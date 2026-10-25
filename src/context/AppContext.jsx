import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  INITIAL_DOCTOR_PROFILE,
  DEFAULT_TIMING_SLOTS,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_GALLERY,
  INITIAL_APPOINTMENTS,
  INITIAL_WHATSAPP_SETTINGS,
  INITIAL_DISCOUNT_CONFIG,
  INITIAL_DISCOUNT_LEADS,
  INITIAL_PATIENTS,
} from '../data/initialData';
import {
  formatDoctorNotification,
  formatPatientNotification,
  formatStatusChangeNotification,
  formatOneHourReminderNotification,
  sendWhatsAppCloudNotification,
} from '../services/whatsappClientService';
import CursorSnackbar from '../components/common/CursorSnackbar';
import { useAuth } from './AuthContext';
import { getActiveDoctorId } from '../services/firebase';
import {
  subscribeDoctorProfile,
  saveDoctorProfile,
  saveDoctorSettings,
  initDoctorDocIfMissing,
  subscribeAppointments,
  addAppointmentRecord,
  updateAppointmentRecord,
  deleteAppointmentRecord,
  subscribePatients,
  addPatientRecord,
  updatePatientRecord,
  deletePatientRecord,
  subscribeGallery,
  addGalleryRecord,
  deleteGalleryRecord,
  parseAppointmentToMillis,
  markAppointmentReminderSent,
} from '../services/doctorFirebaseService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { doctorId: authDoctorId, adminUser } = useAuth();
  // If VITE_DOCTOR_ID is explicitly set in .env (e.g. doc001), use it for this app instance;
  // otherwise fallback to logged in admin's UID or URL parameter ?doctorId=...
  const envDoctorId = import.meta.env.VITE_DOCTOR_ID;
  const activeDoctorId = envDoctorId || authDoctorId || getActiveDoctorId() || 'doc001';

  // Doctor Profile State
  const [doctorProfile, setDoctorProfileState] = useState(() => {
    const saved = localStorage.getItem('app_doctor_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name && !parsed.name.includes('John Smith')) {
          if (!parsed.timingSlots) {
            parsed.timingSlots = DEFAULT_TIMING_SLOTS;
          }
          if (parsed.address?.includes('Apex') || parsed.phone?.includes('97292') || !parsed.clinicName) {
            parsed.name = INITIAL_DOCTOR_PROFILE.name;
            parsed.title = INITIAL_DOCTOR_PROFILE.title;
            parsed.qualification = INITIAL_DOCTOR_PROFILE.qualification;
            parsed.clinicName = INITIAL_DOCTOR_PROFILE.clinicName;
            parsed.phone = INITIAL_DOCTOR_PROFILE.phone;
            parsed.whatsappNumber = INITIAL_DOCTOR_PROFILE.whatsappNumber;
            parsed.address = INITIAL_DOCTOR_PROFILE.address;
            localStorage.setItem('app_doctor_profile', JSON.stringify(parsed));
          }
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_DOCTOR_PROFILE;
  });

  // Services State
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('app_services');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return INITIAL_SERVICES.map((initial) => {
            const match = parsed.find((p) => p.id === initial.id);
            if (match) {
              const image = match.image && !match.image.includes('unsplash.com') ? match.image : initial.image;
              return { ...initial, ...match, image };
            }
            return initial;
          });
        }
      } catch (e) {}
    }
    return INITIAL_SERVICES;
  });

  // Testimonials State
  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem('app_testimonials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_TESTIMONIALS;
  });

  // FAQs State
  const [faqs, setFaqs] = useState(() => {
    const saved = localStorage.getItem('app_faqs');
    return saved ? JSON.parse(saved) : INITIAL_FAQS;
  });

  // Gallery State
  const [gallery, setGallery] = useState(() => {
    const saved = localStorage.getItem('app_gallery');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 6) return parsed;
      } catch (e) {}
    }
    return INITIAL_GALLERY;
  });

  // Appointments State
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('app_appointments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_APPOINTMENTS;
  });

  // Persistent Patients State (for active doctor)
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('app_patients');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_PATIENTS;
  });

  // Contact Requests State
  const [contactRequests, setContactRequests] = useState(() => {
    const saved = localStorage.getItem('app_contact_requests');
    return saved ? JSON.parse(saved) : [];
  });

  // WhatsApp Settings State
  const [whatsappSettings, setWhatsappSettingsState] = useState(() => {
    const envServerUrl = import.meta.env?.VITE_EVOLUTION_SERVER_URL || 'https://wa.beta-labs.in';
    const envInstance = import.meta.env?.VITE_EVOLUTION_INSTANCE_NAME || 'doctor_clinic';
    const envApiKey = import.meta.env?.VITE_EVOLUTION_API_KEY || '';

    let merged = {
      ...INITIAL_WHATSAPP_SETTINGS,
      serverUrl: envServerUrl,
      instanceName: envInstance,
      apiKey: envApiKey,
    };

    const saved = localStorage.getItem('app_whatsapp_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const isLocal = !parsed.serverUrl || parsed.serverUrl.includes('localhost') || parsed.serverUrl.includes('127.0.0.1');
        const validSavedKey = parsed.apiKey && parsed.apiKey !== 'ev_sec_993418af882190c102' ? parsed.apiKey : '';

        merged = {
          ...merged,
          ...parsed,
          serverUrl: isLocal ? envServerUrl : parsed.serverUrl || envServerUrl,
          instanceName: parsed.instanceName || envInstance,
          apiKey: validSavedKey || envApiKey,
        };
      } catch (e) {}
    }
    return merged;
  });

  // Discount Configuration State
  const [discountConfig, setDiscountConfigState] = useState(() => {
    const saved = localStorage.getItem('app_discount_config');
    if (saved) {
      try {
        return { ...INITIAL_DISCOUNT_CONFIG, ...JSON.parse(saved) };
      } catch (e) {}
    }
    return INITIAL_DISCOUNT_CONFIG;
  });

  // Discount Leads State
  const [discountLeads, setDiscountLeads] = useState(() => {
    const saved = localStorage.getItem('app_discount_leads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_DISCOUNT_LEADS;
  });

  // Global Cursor Snack State
  const lastCursorPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      lastCursorPos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const [cursorSnack, setCursorSnack] = useState({
    open: false,
    message: 'Changes saved successfully!',
    title: 'Saved Successfully',
    severity: 'success',
    x: 0,
    y: 0,
  });

  const showCursorSnack = (message, eventOrOptions = null, options = {}) => {
    let x = lastCursorPos.current.x;
    let y = lastCursorPos.current.y;
    let opts = options;
    if (eventOrOptions) {
      if (typeof eventOrOptions.clientX === 'number' && eventOrOptions.clientX > 0) {
        x = eventOrOptions.clientX;
        y = eventOrOptions.clientY;
      } else if (eventOrOptions.currentTarget && typeof eventOrOptions.currentTarget.getBoundingClientRect === 'function') {
        const rect = eventOrOptions.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top;
      } else if (typeof eventOrOptions.x === 'number') {
        x = eventOrOptions.x;
        y = eventOrOptions.y;
      } else if (typeof eventOrOptions === 'object') {
        opts = { ...opts, ...eventOrOptions };
      }
    }

    setCursorSnack({
      open: true,
      message: message || 'Changes have been saved successfully.',
      title: opts.title || (opts.severity === 'error' ? 'Notice' : 'Saved Successfully'),
      severity: opts.severity || 'success',
      x,
      y,
    });
  };

  const hideCursorSnack = () => {
    setCursorSnack((prev) => ({ ...prev, open: false }));
  };

  // =========================================================
  // FIRESTORE REAL-TIME SUBSCRIPTIONS FOR ACTIVE DOCTOR
  // =========================================================
  useEffect(() => {
    if (!activeDoctorId) return;

    // 1. Subscribe to Doctor Profile and Global Settings in DoctorApp/{doctorId}
    const unsubProfile = subscribeDoctorProfile(activeDoctorId, (cloudProfile) => {
      if (cloudProfile) {
        setDoctorProfileState((prev) => ({ ...prev, ...cloudProfile }));

        if (Array.isArray(cloudProfile.services) && cloudProfile.services.length > 0) {
          setServices(cloudProfile.services);
        }
        if (Array.isArray(cloudProfile.testimonials) && cloudProfile.testimonials.length > 0) {
          setTestimonials(cloudProfile.testimonials);
        }
        if (Array.isArray(cloudProfile.faqs) && cloudProfile.faqs.length > 0) {
          setFaqs(cloudProfile.faqs);
        }
        if (cloudProfile.whatsappSettings && typeof cloudProfile.whatsappSettings === 'object') {
          setWhatsappSettingsState((prev) => ({ ...prev, ...cloudProfile.whatsappSettings }));
        }
        if (cloudProfile.discountConfig && typeof cloudProfile.discountConfig === 'object') {
          setDiscountConfigState((prev) => ({ ...prev, ...cloudProfile.discountConfig }));
        }
        if (Array.isArray(cloudProfile.contactRequests)) {
          setContactRequests(cloudProfile.contactRequests);
        }
        if (Array.isArray(cloudProfile.discountLeads) && cloudProfile.discountLeads.length > 0) {
          setDiscountLeads(cloudProfile.discountLeads);
        }
      } else {
        // Initialize DoctorApp/{activeDoctorId} in Firestore with full initial defaults if empty
        initDoctorDocIfMissing(activeDoctorId, {
          ...INITIAL_DOCTOR_PROFILE,
          timingSlots: DEFAULT_TIMING_SLOTS,
          services: INITIAL_SERVICES,
          testimonials: INITIAL_TESTIMONIALS,
          faqs: INITIAL_FAQS,
          whatsappSettings: INITIAL_WHATSAPP_SETTINGS,
          discountConfig: INITIAL_DISCOUNT_CONFIG,
          discountLeads: INITIAL_DISCOUNT_LEADS,
        });
      }
    });

    // 2. Subscribe to Appointments
    const unsubApts = subscribeAppointments(activeDoctorId, (cloudApts) => {
      if (Array.isArray(cloudApts) && cloudApts.length > 0) {
        setAppointments(cloudApts);
        localStorage.setItem('app_appointments', JSON.stringify(cloudApts));
      }
    });

    // 3. Subscribe to Patients
    const unsubPatients = subscribePatients(activeDoctorId, (cloudPatients) => {
      if (Array.isArray(cloudPatients) && cloudPatients.length > 0) {
        setPatients(cloudPatients);
        localStorage.setItem('app_patients', JSON.stringify(cloudPatients));
      }
    });

    // 4. Subscribe to Gallery
    const unsubGallery = subscribeGallery(activeDoctorId, (cloudGallery) => {
      if (cloudGallery && cloudGallery.length > 0) {
        setGallery(cloudGallery);
        localStorage.setItem('app_gallery', JSON.stringify(cloudGallery));
      }
    });

    return () => {
      if (typeof unsubProfile === 'function') unsubProfile();
      if (typeof unsubApts === 'function') unsubApts();
      if (typeof unsubPatients === 'function') unsubPatients();
      if (typeof unsubGallery === 'function') unsubGallery();
    };
  }, [activeDoctorId]);

  // Local storage cache updates
  useEffect(() => {
    localStorage.setItem('app_doctor_profile', JSON.stringify(doctorProfile));
  }, [doctorProfile]);

  useEffect(() => {
    localStorage.setItem('app_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('app_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('app_faqs', JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem('app_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('app_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('app_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('app_contact_requests', JSON.stringify(contactRequests));
  }, [contactRequests]);

  useEffect(() => {
    localStorage.setItem('app_whatsapp_settings', JSON.stringify(whatsappSettings));
  }, [whatsappSettings]);

  useEffect(() => {
    localStorage.setItem('app_discount_config', JSON.stringify(discountConfig));
  }, [discountConfig]);

  useEffect(() => {
    localStorage.setItem('app_discount_leads', JSON.stringify(discountLeads));
  }, [discountLeads]);

  // Doctor Profile Setter (Syncs to Firestore)
  const setDoctorProfile = async (newProfile) => {
    setDoctorProfileState(newProfile);
    if (activeDoctorId) {
      try {
        await saveDoctorProfile(activeDoctorId, newProfile);
      } catch (e) {
        console.warn('Could not sync profile to Firestore:', e);
      }
    }
  };

  // Get active doctor timing slots (with fallback to default timing slots)
  const getDoctorTimingSlots = () => {
    const raw = doctorProfile?.timingSlots;
    const days = Array.isArray(raw?.days) && raw.days.length > 0
      ? raw.days
      : DEFAULT_TIMING_SLOTS.days;
    const morning = Array.isArray(raw?.morning) && raw.morning.length > 0 
      ? raw.morning 
      : DEFAULT_TIMING_SLOTS.morning;
    const evening = Array.isArray(raw?.evening) && raw.evening.length > 0 
      ? raw.evening 
      : DEFAULT_TIMING_SLOTS.evening;
    return {
      days,
      morning,
      evening,
      all: [...morning, ...evening],
    };
  };

  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Get available slots for a specific date (filters out closed days and active booked appointments)
  const getAvailableSlotsForDate = (dateStr) => {
    const { days, morning, evening, all } = getDoctorTimingSlots();
    if (!dateStr) {
      return {
        days,
        dayOfWeek: '',
        isClosed: false,
        morning: morning.map((slot) => ({ slot, isBooked: false })),
        evening: evening.map((slot) => ({ slot, isBooked: false })),
        availableMorning: morning,
        availableEvening: evening,
        allAvailable: all,
        allSlots: all,
        bookedSlots: [],
      };
    }

    const targetDate = String(dateStr).split('T')[0].trim();
    const parts = targetDate.split('-').map(Number);
    const dateObj = parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date(targetDate);
    const dayOfWeek = !isNaN(dateObj.getTime()) ? DAY_NAMES[dateObj.getDay()] : '';
    const isClosed = dayOfWeek ? !days.includes(dayOfWeek) : false;

    if (isClosed) {
      return {
        days,
        dayOfWeek,
        isClosed: true,
        closedReason: `Clinic closed on ${dayOfWeek}s. Doctor available on: ${days.join(', ')}.`,
        morning: [],
        evening: [],
        availableMorning: [],
        availableEvening: [],
        allAvailable: [],
        allSlots: [],
        bookedSlots: [],
      };
    }

    const bookedSet = new Set();

    appointments.forEach((apt) => {
      const aptDate = apt?.preferredDate ? String(apt.preferredDate).split('T')[0].trim() : '';
      const isSameDate = aptDate === targetDate;
      const isActive = apt?.status !== 'Cancelled' && apt?.status !== 'Rejected';
      if (isSameDate && isActive && apt?.preferredTime) {
        bookedSet.add(apt.preferredTime.trim());
      }
    });

    return {
      days,
      dayOfWeek,
      isClosed: false,
      morning: morning.map((slot) => ({
        slot,
        isBooked: bookedSet.has(slot.trim()),
      })),
      evening: evening.map((slot) => ({
        slot,
        isBooked: bookedSet.has(slot.trim()),
      })),
      availableMorning: morning.filter((slot) => !bookedSet.has(slot.trim())),
      availableEvening: evening.filter((slot) => !bookedSet.has(slot.trim())),
      allAvailable: all.filter((slot) => !bookedSet.has(slot.trim())),
      allSlots: all,
      bookedSlots: Array.from(bookedSet),
    };
  };

  // Update doctor timing slots and persist to Firestore + local state
  const updateDoctorTimingSlots = async (newTimingSlots) => {
    const updated = {
      ...doctorProfile,
      timingSlots: newTimingSlots,
    };
    await setDoctorProfile(updated);
    return updated;
  };

  // Handle New Booking (from Web or Chatbot) - Saves to Firestore & Sends WhatsApp
  const addAppointment = async (bookingData) => {
    const newAppointment = {
      id: 'APT-' + Math.floor(100000 + Math.random() * 900000),
      ...bookingData,
      status: bookingData.status || 'Pending',
      createdAt: new Date().toISOString(),
    };

    // Update local state immediately
    setAppointments((prev) => [newAppointment, ...prev.filter((a) => a.id !== newAppointment.id)]);

    // Save to Firestore under DoctorApp/{doctorId}/appointments
    const targetDocId = activeDoctorId || 'doc001';
    let savedRecord = null;
    try {
      savedRecord = await addAppointmentRecord(targetDocId, newAppointment);
      console.log(`[Firestore] Slot booking saved: DoctorApp/${targetDocId}/appointments/${newAppointment.id}`);
    } catch (err) {
      console.error('Could not save appointment to Firestore, kept in local state:', err);
    }

    // Auto-upsert into local patients state immediately
    if (bookingData.mobile) {
      const cleanPhone = bookingData.mobile.replace(/\D/g, '');
      const patId = `PAT-${cleanPhone}`;
      setPatients((prev) => {
        const exists = prev.find((p) => (p.mobile || '').replace(/\D/g, '') === cleanPhone || p.id === patId);
        if (exists) {
          return prev.map((p) => {
            const pPhone = (p.mobile || '').replace(/\D/g, '');
            if (pPhone === cleanPhone || p.id === patId) {
              return {
                ...p,
                totalVisits: (p.totalVisits || 1) + 1,
                lastVisit: bookingData.preferredDate || p.lastVisit,
                lastProblem: bookingData.problem || p.lastProblem,
                lastAppointmentId: newAppointment.id,
                lastAppointmentStatus: newAppointment.status,
                updatedAt: new Date().toISOString(),
              };
            }
            return p;
          });
        }
        return [
          {
            id: patId,
            name: bookingData.patientName,
            mobile: bookingData.mobile,
            email: bookingData.email || '',
            age: bookingData.age || '',
            gender: bookingData.gender || 'Male',
            address: bookingData.address || '',
            totalVisits: 1,
            lastVisit: bookingData.preferredDate || new Date().toISOString().split('T')[0],
            lastProblem: bookingData.problem || '',
            lastAppointmentId: newAppointment.id,
            lastAppointmentStatus: newAppointment.status,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ];
      });
    }

    // Auto update discount lead if promoCode was used
    if (bookingData.promoCode) {
      setDiscountLeads((prev) => {
        const updated = prev.map((lead) => {
          if (lead.code && lead.code.toUpperCase() === bookingData.promoCode.toUpperCase()) {
            return { ...lead, status: 'Booked', bookedAt: new Date().toISOString() };
          }
          return lead;
        });
        saveDoctorSettings(targetDocId, { discountLeads: updated }).catch((e) => {
          console.warn('Could not sync promo update to Firestore:', e);
        });
        return updated;
      });
    }

    window.dispatchEvent(new Event('app_data_updated'));

    // Format and trigger WhatsApp messages
    const doctorMsg = formatDoctorNotification(newAppointment, doctorProfile);
    const patientMsg =
      newAppointment.status === 'Approved'
        ? formatStatusChangeNotification(newAppointment, doctorProfile, 'Approved')
        : formatPatientNotification(newAppointment, doctorProfile);

    // Doctor alert (can be skipped for doctor manual entries)
    if (bookingData.skipDoctorWhatsApp !== true && whatsappSettings?.enableDoctorInstantAlert !== false) {
      sendWhatsAppCloudNotification({
        recipientPhone: whatsappSettings?.doctorWhatsAppNumber || doctorProfile?.phone,
        messageText: doctorMsg,
        whatsappSettings,
      }).catch((e) => console.warn('Doctor WhatsApp notify error:', e));
    }

    // Patient alert (optional trigger, enabled by default or controlled by doctor)
    if (bookingData.sendWhatsApp !== false && whatsappSettings?.enablePatientBookingAlert !== false) {
      sendWhatsAppCloudNotification({
        recipientPhone: newAppointment.mobile,
        messageText: patientMsg,
        whatsappSettings,
      }).catch((e) => console.warn('Patient WhatsApp notify error:', e));
    }

    return newAppointment;
  };

  // Update Appointment Status (Admin Panel)
  const updateAppointmentStatus = async (id, newStatus, reason = '', updatedFields = {}) => {
    let targetApt = null;

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          targetApt = {
            ...apt,
            status: newStatus,
            statusNotes: reason,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
          return targetApt;
        }
        return apt;
      })
    );

    // Sync status update to Firestore
    if (activeDoctorId) {
      try {
        await updateAppointmentRecord(activeDoctorId, id, {
          status: newStatus,
          statusNotes: reason,
          ...updatedFields,
        });

        // Also update local patient state to maintain lifecycle
        if (targetApt && targetApt.mobile) {
          const cleanPhone = targetApt.mobile.replace(/\D/g, '');
          setPatients((prev) =>
            prev.map((p) => {
              const pPhone = (p.mobile || '').replace(/\D/g, '');
              if (pPhone === cleanPhone || p.id === `PAT-${cleanPhone}`) {
                return {
                  ...p,
                  lastAppointmentId: id,
                  lastAppointmentStatus: newStatus,
                  lastStatusNotes: reason || '',
                  ...(updatedFields.preferredDate ? { lastVisit: updatedFields.preferredDate } : {}),
                  updatedAt: new Date().toISOString(),
                };
              }
              return p;
            })
          );
        }
      } catch (err) {
        console.warn('Firestore appointment status update warning:', err);
      }
    }

    if (targetApt) {
      const patientMsg = formatStatusChangeNotification(targetApt, doctorProfile, newStatus);
      sendWhatsAppCloudNotification({
        recipientPhone: targetApt.mobile,
        messageText: patientMsg,
        whatsappSettings,
      }).catch((e) => console.warn('WhatsApp status notify error:', e));
    }
  };

  // 1-HOUR APPOINTMENT REMINDER (Single Appointment Trigger)
  const sendOneHourReminder = async (id) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return { success: false, error: 'Appointment not found' };

    const reminderMsg = formatOneHourReminderNotification(apt, doctorProfile);
    const targetDocId = activeDoctorId || 'doc001';

    // 1. Send WhatsApp message to patient
    let sendResult = null;
    try {
      sendResult = await sendWhatsAppCloudNotification({
        recipientPhone: apt.mobile,
        messageText: reminderMsg,
        whatsappSettings,
      });
    } catch (e) {
      console.warn('1-hour reminder WhatsApp send error:', e);
    }

    // 2. Mark in local state immediately
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              reminder1HourSent: true,
              reminder1HourSentAt: new Date().toISOString(),
              reminder1HourStatus: 'Delivered',
            }
          : a
      )
    );

    // 3. Mark in Firestore
    try {
      await markAppointmentReminderSent(targetDocId, id);
    } catch (e) {
      console.warn('Could not mark 1-hour reminder in Firestore:', e);
    }

    return { success: true, appointment: apt, sendResult };
  };

  // CHECK AND SEND DUE 1-HOUR REMINDERS (Scans Approved appointments -15 to 90 mins away)
  const checkAndSendDueOneHourReminders = async () => {
    const now = Date.now();
    const approvedApts = appointments.filter((a) => a.status === 'Approved' && !a.reminder1HourSent);
    let sentCount = 0;
    const sentApts = [];

    for (const apt of approvedApts) {
      const aptMillis = parseAppointmentToMillis(apt.preferredDate, apt.preferredTime);
      if (!aptMillis) continue;
      const diffMinutes = Math.round((aptMillis - now) / 60000);

      // Trigger if scheduled between -15 and 90 minutes from now (upcoming in next 1.5h or starting shortly)
      if (diffMinutes >= -15 && diffMinutes <= 90) {
        await sendOneHourReminder(apt.id);
        sentCount++;
        sentApts.push({
          id: apt.id,
          name: apt.patientName,
          time: `${apt.preferredDate} ${apt.preferredTime}`,
          diffMinutes,
        });
      }
    }

    // Diagnostic information for appointments scheduled around this time
    const pendingUpcoming = appointments.filter((a) => {
      if (a.status === 'Approved') return false;
      const ms = parseAppointmentToMillis(a.preferredDate, a.preferredTime);
      if (!ms) return false;
      const diff = Math.round((ms - now) / 60000);
      return diff >= -15 && diff <= 90;
    });

    const alreadySentUpcoming = appointments.filter((a) => {
      if (!a.reminder1HourSent) return false;
      const ms = parseAppointmentToMillis(a.preferredDate, a.preferredTime);
      if (!ms) return false;
      const diff = Math.round((ms - now) / 60000);
      return diff >= -15 && diff <= 90;
    });

    return {
      sentCount,
      sentApts,
      pendingCount: pendingUpcoming.length,
      pendingApts: pendingUpcoming,
      alreadySentCount: alreadySentUpcoming.length,
      alreadySentApts: alreadySentUpcoming,
    };
  };

  // Background periodic check every 3 minutes while application is active
  useEffect(() => {
    const interval = setInterval(() => {
      checkAndSendDueOneHourReminders().catch((e) => console.warn('Periodic reminder check warning:', e));
    }, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [appointments, doctorProfile, whatsappSettings]);

  const deleteAppointment = async (id) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    if (activeDoctorId) {
      try {
        await deleteAppointmentRecord(activeDoctorId, id);
      } catch (e) {
        console.warn('Firestore delete appointment error:', e);
      }
    }
  };

  // PATIENTS CRUD (Firestore-synced)
  const addPatient = async (patientData) => {
    const localId = 'PAT-' + Date.now();
    const newPat = { id: localId, ...patientData, createdAt: new Date().toISOString() };
    setPatients((prev) => [newPat, ...prev.filter((p) => p.mobile !== patientData.mobile)]);

    if (activeDoctorId) {
      try {
        const saved = await addPatientRecord(activeDoctorId, patientData);
        return saved;
      } catch (e) {
        console.warn('Firestore add patient error:', e);
      }
    }
    return newPat;
  };

  const updatePatient = async (patientId, updateData) => {
    setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, ...updateData } : p)));
    if (activeDoctorId) {
      try {
        await updatePatientRecord(activeDoctorId, patientId, updateData);
      } catch (e) {
        console.warn('Firestore update patient error:', e);
      }
    }
  };

  const deletePatient = async (patientId) => {
    setPatients((prev) => prev.filter((p) => p.id !== patientId));
    if (activeDoctorId) {
      try {
        await deletePatientRecord(activeDoctorId, patientId);
      } catch (e) {
        console.warn('Firestore delete patient error:', e);
      }
    }
  };

  // WhatsApp Settings Setter (Firestore-synced)
  const setWhatsappSettings = async (newSettings) => {
    const resolved = typeof newSettings === 'function' ? newSettings(whatsappSettings) : newSettings;
    setWhatsappSettingsState(resolved);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { whatsappSettings: resolved });
      console.log(`[Firestore] WhatsApp settings updated for DoctorApp/${targetDocId}`);
    } catch (e) {
      console.warn('Could not sync WhatsApp settings to Firestore:', e);
    }
  };

  // Discount Offer Configuration Setter (Firestore-synced)
  const setDiscountConfig = async (newConfig) => {
    const resolved = typeof newConfig === 'function' ? newConfig(discountConfig) : newConfig;
    setDiscountConfigState(resolved);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { discountConfig: resolved });
      console.log(`[Firestore] Discount config updated for DoctorApp/${targetDocId}`);
    } catch (e) {
      console.warn('Could not sync discount config to Firestore:', e);
    }
  };

  // Services CRUD (Firestore-synced)
  const addService = async (serv) => {
    const newServ = { id: 'serv-' + Date.now(), ...serv, isActive: true };
    const updated = [newServ, ...services];
    setServices(updated);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { services: updated });
    } catch (e) {
      console.warn('Could not sync services to Firestore:', e);
    }
    return newServ;
  };

  const updateService = async (id, updatedFields) => {
    const updated = services.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
    setServices(updated);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { services: updated });
    } catch (e) {
      console.warn('Could not sync service update to Firestore:', e);
    }
  };

  const deleteService = async (id) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { services: updated });
    } catch (e) {
      console.warn('Could not sync services deletion to Firestore:', e);
    }
  };

  // Testimonials CRUD (Firestore-synced)
  const addTestimonial = async (test) => {
    const newTest = { id: 'test-' + Date.now(), ...test, date: new Date().toISOString().split('T')[0] };
    const updated = [newTest, ...testimonials];
    setTestimonials(updated);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { testimonials: updated });
    } catch (e) {
      console.warn('Could not sync testimonials to Firestore:', e);
    }
    return newTest;
  };

  const updateTestimonial = async (id, updatedFields) => {
    const updated = testimonials.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
    setTestimonials(updated);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { testimonials: updated });
    } catch (e) {
      console.warn('Could not sync testimonial update to Firestore:', e);
    }
  };

  const deleteTestimonial = async (id) => {
    const updated = testimonials.filter((t) => t.id !== id);
    setTestimonials(updated);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { testimonials: updated });
    } catch (e) {
      console.warn('Could not sync testimonials deletion to Firestore:', e);
    }
  };

  // FAQ CRUD (Firestore-synced)
  const addFAQ = async (faq) => {
    const newFaq = { id: 'faq-' + Date.now(), ...faq };
    const updated = [newFaq, ...faqs];
    setFaqs(updated);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { faqs: updated });
    } catch (e) {
      console.warn('Could not sync faqs to Firestore:', e);
    }
    return newFaq;
  };

  const updateFAQ = async (id, updatedFields) => {
    const updated = faqs.map((f) => (f.id === id ? { ...f, ...updatedFields } : f));
    setFaqs(updated);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { faqs: updated });
    } catch (e) {
      console.warn('Could not sync faq update to Firestore:', e);
    }
  };

  const deleteFAQ = async (id) => {
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { faqs: updated });
    } catch (e) {
      console.warn('Could not sync faqs deletion to Firestore:', e);
    }
  };

  // Gallery CRUD (Firestore-synced)
  const addGallery = async (item) => {
    const newGal = { id: 'gal-' + Date.now(), ...item, createdAt: new Date().toISOString() };
    setGallery((prev) => [newGal, ...prev]);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await addGalleryRecord(targetDocId, newGal);
    } catch (e) {
      console.warn('Firestore add gallery error:', e);
    }
  };

  const deleteGallery = async (id) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await deleteGalleryRecord(targetDocId, id);
    } catch (e) {
      console.warn('Firestore delete gallery error:', e);
    }
  };

  // Contact Requests (Firestore-synced)
  const submitContactRequest = async (req) => {
    const newReq = { id: 'req-' + Date.now(), ...req, date: new Date().toISOString() };
    const updated = [newReq, ...contactRequests];
    setContactRequests(updated);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { contactRequests: updated });
    } catch (e) {
      console.warn('Could not sync contact requests to Firestore:', e);
    }
    return newReq;
  };

  // Discount Leads (Firestore-synced)
  const addDiscountLead = async (lead) => {
    const newLead = {
      id: 'lead-' + Date.now(),
      phone: lead.phone,
      code: lead.code,
      discount: lead.discount || discountConfig.discountPercentage,
      status: 'Claimed',
      createdAt: new Date().toISOString(),
      ...lead,
    };
    const updated = [newLead, ...discountLeads];
    setDiscountLeads(updated);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { discountLeads: updated });
    } catch (e) {
      console.warn('Could not sync discount leads to Firestore:', e);
    }
    return newLead;
  };

  const updateDiscountLeadStatus = async (id, status) => {
    const updated = discountLeads.map((lead) => (lead.id === id ? { ...lead, status } : lead));
    setDiscountLeads(updated);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { discountLeads: updated });
    } catch (e) {
      console.warn('Could not sync discount lead status to Firestore:', e);
    }
  };

  const deleteDiscountLead = async (id) => {
    const updated = discountLeads.filter((lead) => lead.id !== id);
    setDiscountLeads(updated);
    const targetDocId = activeDoctorId || 'doc001';
    try {
      await saveDoctorSettings(targetDocId, { discountLeads: updated });
    } catch (e) {
      console.warn('Could not sync discount lead deletion to Firestore:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeDoctorId,
        doctorProfile,
        setDoctorProfile,
        getDoctorTimingSlots,
        getAvailableSlotsForDate,
        updateDoctorTimingSlots,
        services,
        testimonials,
        faqs,
        gallery,
        appointments,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        contactRequests,
        whatsappSettings,
        setWhatsappSettings,
        discountConfig,
        setDiscountConfig,
        discountLeads,
        setDiscountLeads,
        addDiscountLead,
        updateDiscountLeadStatus,
        deleteDiscountLead,
        addAppointment,
        refreshAppointments: () => {},
        updateAppointmentStatus,
        deleteAppointment,
        sendOneHourReminder,
        checkAndSendDueOneHourReminders,
        addService,
        updateService,
        deleteService,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        addGallery,
        deleteGallery,
        submitContactRequest,
        cursorSnack,
        showCursorSnack,
        hideCursorSnack,
      }}
    >
      {children}
      <CursorSnackbar {...cursorSnack} onClose={hideCursorSnack} />
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
