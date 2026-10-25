import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  Fab,
  Chip,
  Fade,
  CircularProgress,
  Divider,
  Badge,
  Tooltip,
  Stack,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useApp } from '../../context/AppContext';
import { getDirectWhatsAppUrl, formatPatientNotification } from '../../services/whatsappClientService';

const QUICK_SYMPTOMS = [
  'Dental Implants Consultation',
  'Clear Invisible Aligners',
  'Laser Teeth Whitening',
  'Toothache / Root Canal',
  'Porcelain Veneers / Smile Design',
  'Ultrasonic Cleaning & Polish',
];

const renderFormattedText = (text) => {
  if (!text) return null;
  // Parse *bold* and _italic_
  const parts = text.split(/(\*[^*]+\*|_[^_]+_)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <strong key={idx} style={{ fontWeight: 700 }}>{part.slice(1, -1)}</strong>;
    }
    if (part.startsWith('_') && part.endsWith('_') && part.length > 2) {
      return <em key={idx}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

const AIChatbotWidget = () => {
  const { doctorProfile, addAppointment, getAvailableSlotsForDate, getDoctorTimingSlots } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Greeting, 1: Name, 2: Mobile, 3: Problem, 4: Date, 5: Time, 6: Confirm, 7: Success
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastCreatedApt, setLastCreatedApt] = useState(null);

  // Form payload being filled by chatbot
  const [formData, setFormData] = useState({
    patientName: '',
    mobile: '',
    problem: '',
    preferredDate: '',
    preferredTime: '',
    source: 'AI Chatbot',
  });

  const chatEndRef = useRef(null);

  // Auto-Popup effect when site opens
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Initialize initial greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: 'ai',
          text: `👋 Hello & Welcome to ${doctorProfile.name}'s Dental Studio!\n\nI'm your AI Dental Assistant. I can help you schedule your consultation and send an instant WhatsApp appointment pass in under 1 minute.\n\nMay I please know your *Full Name*?`,
        },
      ]);
      setCurrentStep(1);
    }
  }, [isOpen, doctorProfile, messages.length]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend = userInput) => {
    const val = textToSend.trim();
    if (!val && currentStep !== 4 && currentStep !== 5 && currentStep !== 6) return;

    // Append User Message
    const updatedMessages = [...messages, { sender: 'user', text: val }];
    setMessages(updatedMessages);
    setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      processNextStep(val);
      setIsTyping(false);
    }, 500);
  };

  const processNextStep = (inputVal) => {
    if (currentStep === 1) {
      setFormData((prev) => ({ ...prev, patientName: inputVal }));
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Nice to meet you, *${inputVal}*! 😊\n\nPlease enter your *WhatsApp Mobile Number* so we can dispatch your automated confirmation receipt.`,
        },
      ]);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const clean = inputVal.replace(/[^0-9]/g, '');
      setFormData((prev) => ({ ...prev, mobile: inputVal }));
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Got your number 📱 *${inputVal}*.\n\nWhat health concern or symptom are you visiting Dr. ${doctorProfile.name} for? Select an option below or type your symptom:`,
          type: 'symptom_selector',
        },
      ]);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setFormData((prev) => ({ ...prev, problem: inputVal }));
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDateStr = tomorrow.toISOString().split('T')[0];

      setFormData((prev) => ({ ...prev, preferredDate: defaultDateStr }));
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Noted for *${inputVal}*.\n\nPlease select your preferred appointment date:`,
          type: 'date_selector',
        },
      ]);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      const chosenDate = formData.preferredDate || inputVal;
      handleDateSelect(chosenDate);
    } else if (currentStep === 5) {
      const targetDate = formData.preferredDate || new Date().toISOString().split('T')[0];
      const slotData = getAvailableSlotsForDate
        ? getAvailableSlotsForDate(targetDate)
        : { allAvailable: getDoctorTimingSlots?.()?.all || [] };
      const matched = slotData.allAvailable.find((s) => s.toLowerCase() === inputVal.trim().toLowerCase());
      if (matched) {
        handleTimeSelect(matched);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `Please pick from the available doctor slots for *${targetDate}*:\n${slotData.allAvailable.join(' | ')}`,
            type: 'time_selector',
            availableSlots: slotData.allAvailable,
          },
        ]);
      }
    }
  };

  const handleSymptomSelect = (symptom) => {
    setFormData((prev) => ({ ...prev, problem: symptom }));
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: symptom },
      {
        sender: 'ai',
        text: `Noted: *${symptom}*.\n\nPlease choose your preferred appointment date:`,
        type: 'date_selector',
      },
    ]);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData((prev) => ({ ...prev, preferredDate: tomorrow.toISOString().split('T')[0] }));
    setCurrentStep(4);
  };

  const handleDateSelect = (dateStr) => {
    setFormData((prev) => ({ ...prev, preferredDate: dateStr }));
    const slotData = getAvailableSlotsForDate
      ? getAvailableSlotsForDate(dateStr)
      : { allAvailable: getDoctorTimingSlots?.()?.all || [] };

    if (slotData.isClosed) {
      setMessages((prev) => [
        ...prev,
        { sender: 'user', text: `📅 Selected Date: ${dateStr}` },
        {
          sender: 'ai',
          text: `⚠️ *Clinic Closed on ${slotData.dayOfWeek}s* 🩺\n\nDr. ${doctorProfile.name} is available on:\n*${slotData.days?.join(', ')}*\n\nPlease choose an open clinic date:`,
          type: 'date_selector',
        },
      ]);
      setCurrentStep(4);
      return;
    }

    if (!slotData.allAvailable || slotData.allAvailable.length === 0) {
      setMessages((prev) => [
        ...prev,
        { sender: 'user', text: `📅 Selected Date: ${dateStr}` },
        {
          sender: 'ai',
          text: `⚠️ All consultation slots for *${dateStr} (${slotData.dayOfWeek})* are already booked!\n\nPlease select another convenient date:`,
          type: 'date_selector',
        },
      ]);
      setCurrentStep(4);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: `📅 Selected Date: ${dateStr} (${slotData.dayOfWeek})` },
      {
        sender: 'ai',
        text: `Great! Date set to *${dateStr} (${slotData.dayOfWeek})*.\n\nDoctor *${doctorProfile.name}* has the following available consultation slots:\n\nPlease select your preferred time:`,
        type: 'time_selector',
        availableSlots: slotData.allAvailable,
      },
    ]);
    setCurrentStep(5);
  };

  const handleQuickDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const dateStr = d.toISOString().split('T')[0];
    handleDateSelect(dateStr);
  };

  const handleTimeSelect = (timeSlot) => {
    setFormData((prev) => ({ ...prev, preferredTime: timeSlot }));
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: `⏰ Preferred Time: ${timeSlot}` },
      {
        sender: 'ai',
        text: `Awesome! Here is your appointment summary. Please review and confirm:`,
        type: 'confirmation_card',
      },
    ]);
    setCurrentStep(6);
  };

  const handleFinalConfirmBooking = async () => {
    setIsTyping(true);
    const created = await addAppointment({
      ...formData,
      preferredDate: formData.preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: formData.preferredTime || '05:00 PM',
      source: 'AI Chatbot Assistant',
    });
    setIsTyping(false);
    setLastCreatedApt(created);

    setMessages((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: `🎉 *APPOINTMENT CONFIRMED!*\n\n🆔 *Booking ID:* ${created.id}\n👤 *Patient:* ${created.patientName}\n👨‍⚕️ *Doctor:* ${doctorProfile.name}\n📅 *Date:* ${created.preferredDate}\n⏰ *Time:* ${created.preferredTime}\n\n📲 *WhatsApp Confirmation* has been sent to your phone and the clinic doctor!\n\nYou can also click below to open your confirmation in WhatsApp directly:`,
        type: 'success',
      },
    ]);
    setCurrentStep(7);
  };

  const resetChat = () => {
    setMessages([
      {
        sender: 'ai',
        text: `👋 Hello & Welcome back to ${doctorProfile.name}'s Dental Studio!\n\nI can help you schedule another dental consultation.\nMay I know the patient's *Full Name*?`,
      },
    ]);
    setCurrentStep(1);
    setLastCreatedApt(null);
    setFormData({
      patientName: '',
      mobile: '',
      problem: '',
      preferredDate: '',
      preferredTime: '',
      source: 'AI Chatbot',
    });
  };

  return (
    <>
      {/* Floating Trigger Button with Badge */}
      {!isOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 20, md: 32 },
            right: { xs: 20, md: 32 },
            zIndex: 1200,
          }}
        >
          <Tooltip title="Book Appointment with AI Assistant" placement="left" arrow>
            <Fab
              color="secondary"
              className="pulse-button"
              onClick={() => setIsOpen(true)}
              sx={{
                width: 58,
                height: 58,
                bgcolor: '#E11D48',
                '&:hover': { bgcolor: '#BE123C', transform: 'scale(1.08)' },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 25px rgba(225, 29, 72, 0.45)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                position: 'relative',
                overflow: 'visible',
              }}
            >
              <SmartToyIcon sx={{ fontSize: 30, color: '#FFF' }} />

              {/* Red AI Badge (Clearly visible, bold, with border & shadow) */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  bgcolor: '#EF4444',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '0.72rem',
                  lineHeight: 1,
                  px: 0.8,
                  py: 0.35,
                  borderRadius: '9999px',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.65)',
                  letterSpacing: '0.04em',
                  zIndex: 15,
                  pointerEvents: 'none',
                }}
              >
                AI
              </Box>
            </Fab>
          </Tooltip>
        </Box>
      )}

      {/* Floating Chatbot Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: { xs: 12, sm: 24 },
            right: { xs: 12, sm: 24 },
            width: { xs: 'calc(100vw - 24px)', sm: 380 },
            maxHeight: 620,
            height: { xs: '80vh', sm: 560 },
            borderRadius: '16px',
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            zIndex: 1300,
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.2)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 2.5,
              py: 2,
              bgcolor: '#0F172A',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: '#1E293B',
                  color: '#E11D48',
                  width: 36,
                  height: 36,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <SmartToyIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#FFFFFF" lineHeight={1.2}>
                  Clinic Assistant
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.74rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                  {doctorProfile.name} • Online
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip title="Reset Chat">
                <IconButton onClick={resetChat} size="small" sx={{ color: '#94A3B8', '&:hover': { color: '#FFF' } }}>
                  <RestartAltIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton onClick={() => setIsOpen(false)} size="small" sx={{ color: '#94A3B8', '&:hover': { color: '#FFF' } }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: 'auto',
              bgcolor: '#F8FAFC',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            {messages.map((msg, index) => (
              <React.Fragment key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.75,
                      maxWidth: '85%',
                      borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      bgcolor: msg.sender === 'user' ? '#0F172A' : '#FFFFFF',
                      color: msg.sender === 'user' ? '#FFFFFF' : '#1E293B',
                      border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                      whiteSpace: 'pre-line',
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(15, 23, 42, 0.15)' : '0 1px 3px rgba(0,0,0,0.03)',
                    }}
                  >
                    {renderFormattedText(msg.text)}
                  </Paper>
                </Box>

                {/* Symptom / Category Quick Selector */}
                {msg.type === 'symptom_selector' && currentStep === 3 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, my: 0.5 }}>
                    {QUICK_SYMPTOMS.map((symptom) => (
                      <Chip
                        key={symptom}
                        label={symptom}
                        icon={<MedicalServicesIcon sx={{ fontSize: 15 }} />}
                        onClick={() => handleSymptomSelect(symptom)}
                        clickable
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          bgcolor: '#FFFFFF',
                          borderColor: '#CBD5E1',
                          color: '#0F172A',
                          borderRadius: '8px',
                          '&:hover': {
                            bgcolor: '#0F172A !important',
                            color: '#FFFFFF !important',
                            borderColor: '#0F172A !important',
                            '& .MuiChip-icon': { color: '#FFFFFF !important' },
                            '& .MuiChip-label': { color: '#FFFFFF !important' },
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Date Selector */}
                {msg.type === 'date_selector' && currentStep === 4 && (
                  <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFF', border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" fontWeight={700} color="#0F172A" display="block" mb={1}>
                      Quick Date Options:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                      <Button size="small" variant="outlined" onClick={() => handleQuickDate(0)} sx={{ borderRadius: '6px', py: 0.5, fontSize: '0.8rem' }}>
                        Today
                      </Button>
                      <Button size="small" variant="contained" color="secondary" onClick={() => handleQuickDate(1)} sx={{ borderRadius: '6px', py: 0.5, fontSize: '0.8rem' }}>
                        Tomorrow
                      </Button>
                      <Button size="small" variant="outlined" onClick={() => handleQuickDate(2)} sx={{ borderRadius: '6px', py: 0.5, fontSize: '0.8rem' }}>
                        In 2 Days
                      </Button>
                    </Box>

                    <Typography variant="caption" fontWeight={600} color="text.secondary" display="block" mb={0.5}>
                      Or Select Specific Date:
                    </Typography>
                    <TextField
                      type="date"
                      fullWidth
                      size="small"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, preferredDate: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      fullWidth
                      sx={{ mt: 1.5, borderRadius: '6px' }}
                      onClick={() => handleDateSelect(formData.preferredDate)}
                    >
                      Confirm Date
                    </Button>
                  </Paper>
                )}

                {/* Time Selector */}
                {msg.type === 'time_selector' && currentStep === 5 && (
                  <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFF', border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" fontWeight={700} color="#0F172A" display="block" mb={1}>
                      Available Consultation Time Slots:
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                      {(msg.availableSlots || (getAvailableSlotsForDate ? getAvailableSlotsForDate(formData.preferredDate).allAvailable : getDoctorTimingSlots().all)).map((slot) => (
                        <Button
                          key={slot}
                          variant="outlined"
                          size="small"
                          startIcon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                          onClick={() => handleTimeSelect(slot)}
                          sx={{
                            borderRadius: '8px',
                            py: 0.8,
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            borderColor: '#CBD5E1',
                            color: '#0F172A',
                            '&:hover': {
                              bgcolor: '#E11D48',
                              color: '#FFF',
                              borderColor: '#E11D48',
                            },
                          }}
                        >
                          {slot}
                        </Button>
                      ))}
                    </Box>
                  </Paper>
                )}

                {/* Confirmation Summary Card */}
                {msg.type === 'confirmation_card' && currentStep === 6 && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      bgcolor: '#F8FAFC',
                      border: '1px solid #CBD5E1',
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={800} color="#0F172A" mb={1} display="flex" alignItems="center" gap={0.5}>
                      📋 Summary Review
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', mb: 0.5 }}>
                      <strong>Patient:</strong> {formData.patientName}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', mb: 0.5 }}>
                      <strong>WhatsApp:</strong> {formData.mobile}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', mb: 0.5 }}>
                      <strong>Concern:</strong> {formData.problem}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', mb: 1.5 }}>
                      <strong>Slot:</strong> {formData.preferredDate} at {formData.preferredTime}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        fullWidth
                        onClick={handleFinalConfirmBooking}
                        startIcon={<CheckCircleIcon />}
                        sx={{ borderRadius: '8px', fontWeight: 700 }}
                      >
                        Confirm Booking
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        onClick={resetChat}
                        sx={{ borderRadius: '8px' }}
                      >
                        Edit
                      </Button>
                    </Stack>
                  </Paper>
                )}

                {/* Success State Direct WhatsApp Button */}
                {msg.type === 'success' && lastCreatedApt && (
                  <Box sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<WhatsAppIcon />}
                      href={getDirectWhatsAppUrl(
                        lastCreatedApt.mobile,
                        formatPatientNotification(lastCreatedApt, doctorProfile)
                      )}
                      target="_blank"
                      sx={{
                        bgcolor: '#25D366',
                        '&:hover': { bgcolor: '#128C7E' },
                        color: '#FFF',
                        fontWeight: 700,
                        borderRadius: '8px',
                        py: 1,
                        fontSize: '0.85rem',
                      }}
                    >
                      Open WhatsApp Pass
                    </Button>
                  </Box>
                )}
              </React.Fragment>
            ))}

            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', p: 1 }}>
                <CircularProgress size={14} color="secondary" />
                <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.78rem' }}>
                  Typing...
                </Typography>
              </Box>
            )}

            <div ref={chatEndRef} />
          </Box>

          {/* Chat Input Bar */}
          {currentStep !== 6 && currentStep !== 7 && (
            <Box
              sx={{
                p: 1.25,
                bgcolor: '#FFF',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                gap: 1,
                alignItems: 'center',
              }}
            >
              <TextField
                placeholder={
                  currentStep === 1
                    ? 'Enter your full name...'
                    : currentStep === 2
                    ? 'Enter WhatsApp mobile number...'
                    : currentStep === 3
                    ? 'Type symptom or select above...'
                    : 'Type your message...'
                }
                variant="outlined"
                size="small"
                fullWidth
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: '#F8FAFC',
                    fontSize: '0.875rem',
                  },
                }}
              />
              <IconButton
                onClick={() => handleSend()}
                disabled={!userInput.trim()}
                sx={{
                  bgcolor: userInput.trim() ? '#0F172A' : '#F1F5F9',
                  color: userInput.trim() ? '#FFF !important' : '#94A3B8',
                  borderRadius: '8px',
                  p: 1,
                  '&:hover': { bgcolor: '#1E293B' },
                }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          {currentStep === 7 && (
            <Box sx={{ p: 1.5, bgcolor: '#FFF', textAlign: 'center', borderTop: '1px solid #E2E8F0' }}>
              <Button size="small" variant="outlined" color="primary" onClick={resetChat} sx={{ borderRadius: '8px' }}>
                Book Another Appointment
              </Button>
            </Box>
          )}
        </Paper>
      </Fade>
    </>
  );
};

export default AIChatbotWidget;

