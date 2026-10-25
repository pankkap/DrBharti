const admin = require('firebase-admin');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onRequest } = require('firebase-functions/v2/https');

// Lazy initialization helper for Firebase Admin & Firestore to avoid deployment discovery timeouts
let _db = null;
function getDb() {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  if (!_db) {
    _db = admin.firestore();
  }
  return _db;
}

/**
 * Parses appointment date ("YYYY-MM-DD") and time ("HH:MM AM/PM") into epoch millis
 * Assumes Asia/Kolkata timezone (+05:30)
 */
function parseAppointmentToMillis(dateStr, timeStr) {
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
}

/**
 * Sends WhatsApp notification to patient via Evolution Go API
 */
async function sendWhatsAppReminder({ recipientPhone, messageText, whatsappSettings }) {
  const cleanPhone = (recipientPhone || '').replace(/\D/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const serverUrl = (whatsappSettings?.serverUrl || 'https://wa.beta-labs.in').replace(/\/+$/, '');
  const apiKey = whatsappSettings?.apiKey || 'ev_sec_993418af882190c102';

  if (!formattedPhone) {
    throw new Error('Invalid or missing recipient phone number');
  }

  // Evolution Go REST API -> POST /send/text
  const endpoint = `${serverUrl}/send/text`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: apiKey,
    },
    body: JSON.stringify({
      number: formattedPhone,
      text: messageText,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Evolution Go API error (${response.status}): ${errText}`);
  }

  return await response.json();
}

/**
 * Core Reminder Worker:
 * Iterates through all doctors, finds approved appointments within 30-75 mins,
 * sends WhatsApp reminder and marks reminder1HourSent: true in Firestore.
 */
async function checkAndSendReminders() {
  const now = Date.now();
  console.log(`[1-Hour Reminder Cron] Started check at ${new Date(now).toISOString()}`);

  const db = getDb();
  const doctorsSnap = await db.collection('DoctorApp').get();
  let totalProcessed = 0;
  let totalRemindersSent = 0;
  const details = [];

  for (const docSnap of doctorsSnap.docs) {
    const doctorId = docSnap.id;
    const doctorData = docSnap.data() || {};
    const whatsappSettings = doctorData.whatsappSettings || {};

    // Skip sending if automated WhatsApp alerts are disabled by doctor
    if (whatsappSettings.enablePatientBookingAlert === false) {
      continue;
    }

    const aptsSnap = await db
      .collection('DoctorApp')
      .doc(doctorId)
      .collection('appointments')
      .where('status', '==', 'Approved')
      .get();

    for (const aptDoc of aptsSnap.docs) {
      const apt = aptDoc.data();
      totalProcessed++;

      // Skip if 1-hour reminder was already sent
      if (apt.reminder1HourSent === true) {
        continue;
      }

      const aptMillis = parseAppointmentToMillis(apt.preferredDate, apt.preferredTime);
      if (!aptMillis) continue;

      const diffMinutes = Math.round((aptMillis - now) / 60000);

      // Trigger reminder if appointment is between -15 and 90 minutes from now (upcoming in next 1.5h or starting shortly)
      if (diffMinutes >= -15 && diffMinutes <= 90) {
        const rawName = doctorData.name || 'Doctor';
        const docName = rawName.startsWith('Dr.') ? rawName : `Dr. ${rawName}`;
        const clinicAddress = doctorData.address || 'Clinic Reception';
        const clinicPhone = doctorData.phone || '';

        const reminderMsg = `⏰ *APPOINTMENT REMINDER (1 HOUR TO GO)*
--------------------------------
👋 *Hello ${apt.patientName},*

This is a reminder that your confirmed consultation with *${docName}* is scheduled in approximately *1 hour*.

📋 *Appointment Details:*
👨‍⚕️ *Doctor:* ${docName}
📅 *Date:* ${apt.preferredDate}
⏰ *Time:* ${apt.preferredTime}
🏥 *Clinic:* ${clinicAddress}
${clinicPhone ? `📞 *Helpdesk:* ${clinicPhone}\n` : ''}
📍 _Please arrive 10 minutes prior to your time slot._
If you need directions or have any questions, feel free to reply to this message.`;

        try {
          await sendWhatsAppReminder({
            recipientPhone: apt.mobile,
            messageText: reminderMsg,
            whatsappSettings,
          });

          // Mark in database so it is NEVER sent again
          await aptDoc.ref.update({
            reminder1HourSent: true,
            reminder1HourSentAt: admin.firestore.FieldValue.serverTimestamp(),
            reminder1HourStatus: 'Delivered',
            reminder1HourDiffMinutes: diffMinutes,
          });

          totalRemindersSent++;
          details.push({
            appointmentId: apt.id,
            patientName: apt.patientName,
            mobile: apt.mobile,
            scheduledTime: `${apt.preferredDate} ${apt.preferredTime}`,
            diffMinutes,
          });

          console.log(`✅ Sent 1-hour reminder for Apt ${apt.id} (${apt.patientName})`);
        } catch (sendErr) {
          console.error(`❌ Failed to send reminder for Apt ${apt.id}:`, sendErr);
        }
      }
    }
  }

  console.log(`[1-Hour Reminder Cron] Completed. Processed: ${totalProcessed}, Reminders Sent: ${totalRemindersSent}`);
  return { totalProcessed, totalRemindersSent, details };
}

/**
 * 1. Scheduled Cloud Function (Cron Trigger)
 * Runs automatically every 10 minutes in Asia/Kolkata timezone
 */
exports.sendOneHourAppointmentReminders = onSchedule(
  {
    schedule: 'every 10 minutes',
    timeZone: 'Asia/Kolkata',
    retryCount: 1,
    memory: '256MiB',
  },
  async (event) => {
    return await checkAndSendReminders();
  }
);

/**
 * 2. HTTP On-Demand Trigger
 * Allows manual or webhook invocation to test or trigger reminders immediately
 */
exports.triggerRemindersNow = onRequest(
  { cors: true },
  async (req, res) => {
    try {
      const result = await checkAndSendReminders();
      res.status(200).json({
        success: true,
        message: `Cron check executed. Processed ${result.totalProcessed} approved appointments, sent ${result.totalRemindersSent} reminders.`,
        data: result,
      });
    } catch (error) {
      console.error('Error executing reminder check:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);
