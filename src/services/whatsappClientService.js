const getCleanDoctorName = (name) => {
  if (!name) return 'Dr. John Smith';
  return name.startsWith('Dr.') ? name : `Dr. ${name}`;
};

export const formatDoctorNotification = (appointment, doctorProfile) => {
  const docName = getCleanDoctorName(doctorProfile?.name);
  return `🚨 *NEW APPOINTMENT BOOKING*
--------------------------------
👨‍⚕️ *Doctor:* ${docName}
👤 *Patient:* ${appointment.patientName}
📱 *Phone:* ${appointment.mobile}
🩺 *Concern:* ${appointment.problem || 'General Consultation'}
📅 *Date:* ${appointment.preferredDate}
⏰ *Time:* ${appointment.preferredTime}
📌 *Status:* ${appointment.status || 'Pending'}
🌐 *Source:* ${appointment.source || 'AI Chatbot Assistant'}
--------------------------------
_Please review in Clinic Admin Panel._`;
};

export const formatPatientNotification = (appointment, doctorProfile) => {
  const docName = getCleanDoctorName(doctorProfile?.name);
  return `👋 *Hello ${appointment.patientName},*

📋 *Appointment Request Received!*

👨‍⚕️ *Doctor:* ${docName}
📅 *Date:* ${appointment.preferredDate}
⏰ *Time:* ${appointment.preferredTime}
📍 *Clinic:* ${doctorProfile.address}
📞 *Contact:* ${doctorProfile.phone}

⏳ _Your appointment is pending doctor confirmation. You will receive a notification once approved._`;
};

export const formatStatusChangeNotification = (appointment, doctorProfile, newStatus) => {
  const docName = getCleanDoctorName(doctorProfile?.name);
  const statusLower = (newStatus || '').toLowerCase();

  if (statusLower === 'approved') {
    return `✅ *Appointment Approved!*

Dear ${appointment.patientName},
${docName} has approved your appointment for *${appointment.preferredDate}* at *${appointment.preferredTime}*.

📍 *Address:* ${doctorProfile.address}
📞 *Helpdesk:* ${doctorProfile.phone}

_Please arrive 10 minutes before your slot._`;
  }

  if (statusLower === 'rescheduled') {
    return `🗓️ *Appointment Rescheduled*

Dear ${appointment.patientName},
Your appointment with ${docName} has been rescheduled to:
📅 *New Date:* ${appointment.preferredDate}
⏰ *New Time:* ${appointment.preferredTime}
${appointment.statusNotes ? `\n📝 *Note:* ${appointment.statusNotes}` : ''}

📍 *Address:* ${doctorProfile.address}
📞 *Helpdesk:* ${doctorProfile.phone}

_Please arrive 10 minutes prior to your new slot._`;
  }

  if (statusLower === 'completed') {
    return `🎉 *Consultation Completed*

Dear ${appointment.patientName},
Thank you for visiting ${docName}. We wish you a speedy recovery and great health! 🩺`;
  }

  if (statusLower === 'rejected' || statusLower === 'cancelled') {
    return `❌ *Appointment Update*

Dear ${appointment.patientName},
Your appointment for ${appointment.preferredDate} could not be confirmed.
${appointment.statusNotes ? `📝 *Reason:* ${appointment.statusNotes}\n` : ''}
Please contact our helpdesk at ${doctorProfile.phone} to select another time.`;
  }

  return `📋 *Status Update:* Your appointment with ${docName} is marked as *${newStatus.toUpperCase()}*.`;
};

export const formatOneHourReminderNotification = (appointment, doctorProfile) => {
  const docName = getCleanDoctorName(doctorProfile?.name);
  const clinicAddress = doctorProfile?.address || 'Clinic Reception';
  const clinicPhone = doctorProfile?.phone || '';

  return `⏰ *APPOINTMENT REMINDER (1 HOUR TO GO)*
--------------------------------
👋 *Hello ${appointment.patientName},*

This is a reminder that your confirmed consultation with *${docName}* is scheduled in approximately *1 hour*.

📋 *Appointment Details:*
👨‍⚕️ *Doctor:* ${docName}
📅 *Date:* ${appointment.preferredDate}
⏰ *Time:* ${appointment.preferredTime}
🏥 *Clinic:* ${clinicAddress}
${clinicPhone ? `📞 *Helpdesk:* ${clinicPhone}\n` : ''}
📍 _Please arrive 10 minutes prior to your time slot._
If you need directions or have any questions, feel free to reply to this message.`;
};

/**
 * Direct WhatsApp Web/App Link for immediate messaging
 */
export const getDirectWhatsAppUrl = (phone, text) => {
  let cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }
  const encodedText = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
};

/**
 * Format clean international phone number for Evolution Go (digits only)
 */
export const formatEvolutionPhoneNumber = (phone) => {
  if (!phone) return '';
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.length === 11 && clean.startsWith('0')) {
    clean = '91' + clean.slice(1);
  } else if (clean.length === 10) {
    clean = '91' + clean; // Default to India (+91) if 10 digits provided
  }
  return clean;
};

// In-memory cache for resolved instance token
let cachedInstanceToken = null;

/**
 * Resolve Instance Token using Global API Key or direct Instance Token
 */
export const resolveEvolutionInstanceToken = async ({ serverUrl, instanceName, apiKey }) => {
  if (!apiKey) return null;

  // If token is already a UUID / instance token (not the global key), return it
  if (apiKey.includes('-') && apiKey.length >= 32 && apiKey !== 'ev_sec_993418af882190c102') {
    return apiKey;
  }

  if (cachedInstanceToken) {
    return cachedInstanceToken;
  }

  try {
    const cleanServer = (serverUrl || 'https://wa.beta-labs.in').replace(/\/+$/, '');
    const response = await fetch(`${cleanServer}/instance/all`, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const instances = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const target = instances.find(
        (i) => i.name === instanceName || i.client_name === instanceName || i.id === instanceName
      ) || instances[0];

      if (target?.token) {
        cachedInstanceToken = target.token;
        return target.token;
      }
    }
  } catch (e) {
    console.warn('Instance token auto-lookup fallback:', e);
  }

  return apiKey;
};

/**
 * Send WhatsApp Message using Evolution Go REST API
 * Route: POST {serverUrl}/send/text (with instance token in apikey header)
 * Payload: { "number": recipientNumber, "text": messageText }
 */
export const sendEvolutionGoWhatsAppMessage = async ({ recipientPhone, messageText, whatsappSettings }) => {
  const serverUrl = (whatsappSettings?.serverUrl || 'https://wa.beta-labs.in').replace(/\/+$/, '');
  const instanceName = whatsappSettings?.instanceName || 'doctor_clinic';
  const apiKey = whatsappSettings?.apiKey || 'ev_sec_993418af882190c102';
  const isLiveEnabled = whatsappSettings?.isLiveApiEnabled !== false;

  const cleanNumber = formatEvolutionPhoneNumber(recipientPhone);

  if (!cleanNumber) {
    return {
      success: false,
      mode: 'Invalid Phone Number',
      recipientPhone,
      error: 'Recipient phone number is missing or invalid.',
    };
  }

  if (!isLiveEnabled) {
    return {
      success: true,
      mode: 'Simulated (Live API Disabled in Settings)',
      recipientPhone: cleanNumber,
      data: { message: 'Message logged' },
    };
  }

  // Auto-resolve the active instance token (e.g. 405ae57f-...)
  const activeToken = await resolveEvolutionInstanceToken({
    serverUrl,
    instanceName,
    apiKey,
  });

  try {
    // Attempt 1: Official Evolution GO route -> POST /send/text
    const endpoint = `${serverUrl}/send/text`;
    
    let response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': activeToken || apiKey,
      },
      body: JSON.stringify({
        number: cleanNumber,
        text: messageText,
      }),
    });

    // If 404, fallback to /message/sendText/{instance}
    if (response.status === 404) {
      const fallbackEndpoint = `${serverUrl}/message/sendText/${encodeURIComponent(instanceName)}`;
      response = await fetch(fallbackEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': activeToken || apiKey,
        },
        body: JSON.stringify({
          number: cleanNumber,
          text: messageText,
        }),
      });
    }

    const data = await response.json().catch(() => ({ status: response.status }));

    if (response.ok) {
      return {
        success: true,
        data,
        mode: 'Evolution Go Live API Dispatched Direct to WhatsApp',
        recipientPhone: cleanNumber,
      };
    } else {
      console.warn('Evolution Go API Warning:', data);
      return {
        success: false,
        data,
        mode: `Evolution Go Response (${response.status}): ${data?.message || data?.error || 'Failed to dispatch'}`,
        recipientPhone: cleanNumber,
        error: data?.message || data?.error || 'HTTP Error ' + response.status,
      };
    }
  } catch (error) {
    console.warn('Evolution Go Dispatch Error:', error);
    return {
      success: false,
      mode: 'Evolution Go Connection Notice (Direct Web Fallback Available)',
      recipientPhone: cleanNumber,
      error: error.message,
    };
  }
};

/**
 * Check Evolution Go Instance Connection Status
 */
export const checkEvolutionGoStatus = async ({ serverUrl, instanceName, apiKey }) => {
  const cleanServer = (serverUrl || 'https://wa.beta-labs.in').replace(/\/+$/, '');
  const cleanInstance = instanceName || 'doctor_clinic';
  const cleanApiKey = apiKey || 'ev_sec_993418af882190c102';

  try {
    // Check all instances with admin key
    const response = await fetch(`${cleanServer}/instance/all`, {
      method: 'GET',
      headers: {
        'apikey': cleanApiKey,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const instances = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const target = instances.find(
        (i) => i.name === cleanInstance || i.client_name === cleanInstance || i.id === cleanInstance
      ) || instances[0];

      if (target) {
        if (target.token) cachedInstanceToken = target.token;
        return {
          ok: true,
          status: 200,
          connected: target.connected || target.status === 'open',
          instance: target,
          data,
        };
      }
      return {
        ok: true,
        status: 200,
        connected: false,
        instance: null,
        data,
      };
    }

    if (response.status === 401 || response.status === 403) {
      return {
        ok: false,
        status: response.status,
        error: 'Invalid API Key (401 Unauthorized). Please paste your real GLOBAL_API_KEY from your server terminal.',
      };
    }

    return {
      ok: false,
      status: response.status,
      error: `Server returned HTTP ${response.status}: Failed to authenticate with Evolution Go.`,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message || 'Network request failed',
    };
  }
};

/**
 * Primary WhatsApp Notification Dispatcher
 */
export const sendWhatsAppNotification = async ({ recipientPhone, messageText, whatsappSettings }) => {
  return await sendEvolutionGoWhatsAppMessage({ recipientPhone, messageText, whatsappSettings });
};

// Aliased backwards compatibility
export const sendWhatsAppCloudNotification = sendWhatsAppNotification;

