import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Multi-Tenant Doctor Firestore Service
 * Hierarchy:
 * - Collection: DoctorApp
 * - Document per doctor: DoctorApp/{doctorId} (e.g. DoctorApp/doc001, DoctorApp/doc002)
 *   Subcollections:
 *   - DoctorApp/{doctorId}/patients/{patientId}
 *   - DoctorApp/{doctorId}/appointments/{appointmentId}
 *   - DoctorApp/{doctorId}/gallery/{galleryId}
 */

/**
 * Recursively cleans an object for Firestore by removing any keys with `undefined` values.
 * Firestore setDoc and updateDoc fail if any field is undefined.
 * Preserves Date, FieldValues, primitives, and nulls.
 */
export const cleanForFirestore = (obj) => {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object' || obj instanceof Date || (obj && obj._methodName)) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => (item === undefined ? null : cleanForFirestore(item)));
  }
  const cleaned = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== undefined) {
      cleaned[key] = cleanForFirestore(val);
    }
  }
  return cleaned;
};

// ==========================================
// DOCTOR PROFILE & SETTINGS
// ==========================================

export const getDoctorProfile = async (doctorId) => {
  if (!doctorId) return null;
  try {
    const docRef = doc(db, 'DoctorApp', doctorId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching doctor profile (${doctorId}):`, error);
    return null;
  }
};

export const saveDoctorProfile = async (doctorId, profileData) => {
  if (!doctorId) throw new Error('Doctor ID required');
  try {
    const docRef = doc(db, 'DoctorApp', doctorId);
    const cleaned = cleanForFirestore({
      ...profileData,
      updatedAt: serverTimestamp(),
    });
    await setDoc(docRef, cleaned, { merge: true });
    return { id: doctorId, ...cleaned };
  } catch (error) {
    console.error(`Error saving doctor profile (${doctorId}):`, error);
    throw error;
  }
};

export const saveDoctorSettings = async (doctorId, settingsData) => {
  if (!doctorId) throw new Error('Doctor ID required');
  try {
    const docRef = doc(db, 'DoctorApp', doctorId);
    const cleaned = cleanForFirestore({
      ...settingsData,
      updatedAt: serverTimestamp(),
    });
    await setDoc(docRef, cleaned, { merge: true });
    return cleaned;
  } catch (error) {
    console.error(`Error saving doctor settings (${doctorId}):`, error);
    throw error;
  }
};

export const initDoctorDocIfMissing = async (doctorId, defaultData = {}) => {
  if (!doctorId) return;
  try {
    const docRef = doc(db, 'DoctorApp', doctorId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      const cleaned = cleanForFirestore({
        ...defaultData,
        id: doctorId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await setDoc(docRef, cleaned, { merge: true });
    }
  } catch (err) {
    console.warn('initDoctorDocIfMissing warning:', err);
  }
};

export const subscribeDoctorProfile = (doctorId, callback) => {
  if (!doctorId) return () => {};
  const docRef = doc(db, 'DoctorApp', doctorId);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() });
      } else {
        callback(null);
      }
    },
    (err) => {
      console.warn(`Profile subscription warning (${doctorId}):`, err);
    }
  );
};

// ==========================================
// PATIENTS MANAGEMENT (Per Doctor)
// ==========================================

export const subscribePatients = (doctorId, callback) => {
  if (!doctorId) return () => {};
  const patientsRef = collection(db, 'DoctorApp', doctorId, 'patients');
  const q = query(patientsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const patients = [];
      snapshot.forEach((doc) => {
        patients.push({ id: doc.id, ...doc.data() });
      });
      callback(patients);
    },
    (error) => {
      console.warn(`Patients subscription fallback (${doctorId}):`, error);
      return onSnapshot(collection(db, 'DoctorApp', doctorId, 'patients'), (snap) => {
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        callback(list);
      });
    }
  );
};

export const addPatientRecord = async (doctorId, patientData) => {
  if (!doctorId) throw new Error('Doctor ID required');
  try {
    const cleanPhone = (patientData.mobile || '').replace(/\D/g, '');
    const patientId = cleanPhone ? `PAT-${cleanPhone}` : `PAT-${Date.now()}`;
    const docRef = doc(db, 'DoctorApp', doctorId, 'patients', patientId);

    // Fetch existing patient document to preserve existing profile fields and maintain lifecycle
    let existing = null;
    try {
      const snap = await getDoc(docRef);
      if (snap.exists()) existing = snap.data();
    } catch (e) {}

    const previousVisits = existing?.totalVisits || (existing ? 1 : 0);
    const totalVisits = previousVisits + 1;

    const dataToSave = cleanForFirestore({
      ...(existing || {}),
      ...patientData,
      id: patientId,
      doctorId,
      totalVisits: patientData.totalVisits || totalVisits,
      lastVisit: patientData.lastVisit || existing?.lastVisit || new Date().toISOString().split('T')[0],
      lastProblem: patientData.lastProblem || existing?.lastProblem || '',
      lastAppointmentId: patientData.lastAppointmentId || existing?.lastAppointmentId || '',
      lastAppointmentStatus: patientData.lastAppointmentStatus || existing?.lastAppointmentStatus || 'Pending',
      updatedAt: serverTimestamp(),
      createdAt: existing?.createdAt || patientData.createdAt || new Date().toISOString(),
    });

    await setDoc(docRef, dataToSave, { merge: true });
    return { id: patientId, ...dataToSave };
  } catch (error) {
    console.error('Error adding patient record:', error);
    throw error;
  }
};

export const updatePatientRecord = async (doctorId, patientId, updateData) => {
  if (!doctorId || !patientId) throw new Error('Doctor ID and Patient ID required');
  try {
    const docRef = doc(db, 'DoctorApp', doctorId, 'patients', patientId);
    const cleaned = cleanForFirestore({
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    await updateDoc(docRef, cleaned);
    return { id: patientId, ...updateData };
  } catch (error) {
    console.error('Error updating patient record:', error);
    throw error;
  }
};

export const deletePatientRecord = async (doctorId, patientId) => {
  if (!doctorId || !patientId) throw new Error('Doctor ID and Patient ID required');
  try {
    const docRef = doc(db, 'DoctorApp', doctorId, 'patients', patientId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting patient record:', error);
    throw error;
  }
};

// ==========================================
// APPOINTMENTS MANAGEMENT (Per Doctor)
// ==========================================

export const subscribeAppointments = (doctorId, callback) => {
  if (!doctorId) return () => {};
  const aptsRef = collection(db, 'DoctorApp', doctorId, 'appointments');
  const q = query(aptsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const apts = [];
      snapshot.forEach((doc) => {
        apts.push({ id: doc.id, ...doc.data() });
      });
      callback(apts);
    },
    (err) => {
      console.warn(`Appointments subscription warning (${doctorId}):`, err);
      return onSnapshot(collection(db, 'DoctorApp', doctorId, 'appointments'), (snap) => {
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        callback(list);
      });
    }
  );
};

export const addAppointmentRecord = async (doctorId, bookingData) => {
  if (!doctorId) throw new Error('Doctor ID required');
  try {
    const aptId = bookingData.id || `APT-${Math.floor(100000 + Math.random() * 900000)}`;
    const docRef = doc(db, 'DoctorApp', doctorId, 'appointments', aptId);

    const record = cleanForFirestore({
      ...bookingData,
      id: aptId,
      doctorId,
      status: bookingData.status || 'Pending',
      createdAt: bookingData.createdAt || new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(docRef, record);

    // Also touch parent DoctorApp/{doctorId} document to guarantee existence in Firestore Console
    try {
      const parentDocRef = doc(db, 'DoctorApp', doctorId);
      await setDoc(
        parentDocRef,
        cleanForFirestore({
          lastBookingAt: serverTimestamp(),
          lastBookingId: aptId,
          lastBookedPatient: bookingData.patientName || '',
          updatedAt: serverTimestamp(),
        }),
        { merge: true }
      );
    } catch (parentErr) {
      console.warn('Parent doctor doc touch warning:', parentErr);
    }

    // Auto-upsert patient in DoctorApp/{doctorId}/patients to maintain patient lifecycle
    try {
      await addPatientRecord(doctorId, {
        name: bookingData.patientName,
        mobile: bookingData.mobile,
        email: bookingData.email || '',
        age: bookingData.age || '',
        gender: bookingData.gender || '',
        address: bookingData.address || '',
        lastVisit: bookingData.preferredDate || new Date().toISOString().split('T')[0],
        lastProblem: bookingData.problem || '',
        lastAppointmentId: aptId,
        lastAppointmentStatus: record.status || 'Pending',
      });
    } catch (e) {
      console.warn('Auto-upsert patient warning:', e);
    }

    return record;
  } catch (error) {
    console.error('Error adding appointment record:', error);
    throw error;
  }
};

export const updateAppointmentRecord = async (doctorId, appointmentId, updateData) => {
  if (!doctorId || !appointmentId) throw new Error('Doctor ID and Appointment ID required');
  try {
    const docRef = doc(db, 'DoctorApp', doctorId, 'appointments', appointmentId);
    const cleaned = cleanForFirestore({
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    await updateDoc(docRef, cleaned);

    // Auto-maintain patient lifecycle upon appointment status changes
    try {
      const aptSnap = await getDoc(docRef);
      if (aptSnap.exists()) {
        const apt = aptSnap.data();
        const cleanPhone = (apt.mobile || '').replace(/\D/g, '');
        if (cleanPhone) {
          const patRef = doc(db, 'DoctorApp', doctorId, 'patients', `PAT-${cleanPhone}`);
          await setDoc(
            patRef,
            cleanForFirestore({
              lastAppointmentId: appointmentId,
              lastAppointmentStatus: updateData.status || apt.status,
              ...(updateData.statusNotes ? { lastStatusNotes: updateData.statusNotes } : {}),
              ...(updateData.preferredDate ? { lastVisit: updateData.preferredDate } : {}),
              updatedAt: serverTimestamp(),
            }),
            { merge: true }
          );
        }
      }
    } catch (e) {
      console.warn('Could not auto-update patient lifecycle during appointment update:', e);
    }

    return { id: appointmentId, ...updateData };
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

export const deleteAppointmentRecord = async (doctorId, appointmentId) => {
  if (!doctorId || !appointmentId) throw new Error('Doctor ID and Appointment ID required');
  try {
    const docRef = doc(db, 'DoctorApp', doctorId, 'appointments', appointmentId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

// ==========================================
// GALLERY MANAGEMENT (Per Doctor)
// ==========================================

export const subscribeGallery = (doctorId, callback) => {
  if (!doctorId) return () => {};
  const galleryRef = collection(db, 'DoctorApp', doctorId, 'gallery');
  return onSnapshot(
    galleryRef,
    (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      callback(items);
    },
    (err) => console.warn(`Gallery subscription warning (${doctorId}):`, err)
  );
};

export const addGalleryRecord = async (doctorId, itemData) => {
  if (!doctorId) throw new Error('Doctor ID required');
  try {
    const galId = itemData.id || `gal-${Date.now()}`;
    const docRef = doc(db, 'DoctorApp', doctorId, 'gallery', galId);
    const data = cleanForFirestore({
      ...itemData,
      id: galId,
      doctorId,
      createdAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
    await setDoc(docRef, data);
    return data;
  } catch (error) {
    console.error('Error adding gallery item:', error);
    throw error;
  }
};

export const deleteGalleryRecord = async (doctorId, galleryId) => {
  if (!doctorId || !galleryId) throw new Error('Doctor ID and Gallery ID required');
  try {
    const docRef = doc(db, 'DoctorApp', doctorId, 'gallery', galleryId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    throw error;
  }
};

// ==========================================
// 1-HOUR APPOINTMENT REMINDER HELPERS
// ==========================================

export const parseAppointmentToMillis = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const sDate = String(dateStr).trim();
  const sTime = String(timeStr).trim();

  // 1. Extract Date (supports YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY, YYYY/MM/DD, or Date string)
  let year, month, day;
  const isoMatch = sDate.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  const dmyMatch = sDate.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);

  if (isoMatch) {
    year = parseInt(isoMatch[1], 10);
    month = parseInt(isoMatch[2], 10) - 1;
    day = parseInt(isoMatch[3], 10);
  } else if (dmyMatch) {
    day = parseInt(dmyMatch[1], 10);
    month = parseInt(dmyMatch[2], 10) - 1;
    year = parseInt(dmyMatch[3], 10);
  } else {
    const fallbackD = new Date(sDate);
    if (!isNaN(fallbackD.getTime())) {
      year = fallbackD.getFullYear();
      month = fallbackD.getMonth();
      day = fallbackD.getDate();
    } else {
      return null;
    }
  }

  // 2. Extract Time (supports 5:30 PM, 05:30 PM, 5:30pm, 17:30, 05:30, 5:30, 5.30 PM)
  let hours = 0;
  let minutes = 0;

  const match12 = sTime.match(/^(\d{1,2})[:.](\d{2})\s*([AP]M)$/i);
  const matchPlain = sTime.match(/^(\d{1,2})[:.](\d{2})(?::\d{2})?$/);

  if (match12) {
    hours = parseInt(match12[1], 10);
    minutes = parseInt(match12[2], 10);
    const period = match12[3].toUpperCase();
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
  } else if (matchPlain) {
    hours = parseInt(matchPlain[1], 10);
    minutes = parseInt(matchPlain[2], 10);
    // If hours is between 1 and 7, clinic appointments at e.g. 5:30 mean 17:30 (5:30 PM)
    if (hours >= 1 && hours <= 7) {
      hours += 12;
    }
  } else {
    return null;
  }

  // 3. Compute epoch millis in Asia/Kolkata (IST = UTC + 5:30)
  const utcMillis = Date.UTC(year, month, day, hours, minutes);
  const istOffsetMillis = 5.5 * 60 * 60 * 1000;
  return utcMillis - istOffsetMillis;
};

export const markAppointmentReminderSent = async (doctorId, appointmentId, diffMinutes = 60) => {
  if (!doctorId || !appointmentId) return;
  try {
    const docRef = doc(db, 'DoctorApp', doctorId, 'appointments', appointmentId);
    await updateDoc(
      docRef,
      cleanForFirestore({
        reminder1HourSent: true,
        reminder1HourSentAt: serverTimestamp(),
        reminder1HourStatus: 'Delivered',
        reminder1HourDiffMinutes: diffMinutes,
        updatedAt: serverTimestamp(),
      })
    );
  } catch (err) {
    console.error('Error marking appointment reminder sent in Firestore:', err);
  }
};

