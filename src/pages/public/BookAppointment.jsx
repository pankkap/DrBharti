import React, { useState, useMemo, useEffect } from 'react';
import {
  Container,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Alert,
  Stack,
  Divider,
  Tooltip,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { getDirectWhatsAppUrl, formatPatientNotification } from '../../services/whatsappClientService';

const QUICK_PROBLEMS = [
  'Toothache / Emergency Pain',
  'Dental Implants Consultation',
  'Clear Aligners (Invisalign)',
  'HydraFacial MD 7-Step Detox',
  'Botox & Anti-Wrinkle Smoothing',
  'Dermal Fillers & Lip Contouring',
  'Hollywood Carbon Laser Peel',
  'Zoom Laser Teeth Whitening',
  'Porcelain Veneers & Smile Design',
  'Single-Visit Root Canal',
  'Autologous PRP Hair Therapy',
  'Medical Clarifying Peel',
];

const BookAppointment = () => {
  const { doctorProfile, addAppointment, getAvailableSlotsForDate, getDoctorTimingSlots } = useApp();
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [slotError, setSlotError] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      patientName: '',
      mobile: '',
      email: '',
      age: '',
      gender: 'Male',
      address: '',
      problem: '',
      preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      preferredTime: '',
      message: '',
    },
  });

  const selectedTime = watch('preferredTime');
  const selectedProblem = watch('problem');
  const selectedDate = watch('preferredDate');
  const location = useLocation();
  const promoCode = location.state?.promoCode;

  // Real-time slot availability for chosen date
  const slotData = useMemo(() => {
    if (getAvailableSlotsForDate) {
      return getAvailableSlotsForDate(selectedDate);
    }
    const timingSlots = getDoctorTimingSlots?.() || { morning: [], evening: [], all: [] };
    return {
      morning: timingSlots.morning.map((slot) => ({ slot, isBooked: false })),
      evening: timingSlots.evening.map((slot) => ({ slot, isBooked: false })),
      availableMorning: timingSlots.morning,
      availableEvening: timingSlots.evening,
      allAvailable: timingSlots.all,
      allSlots: timingSlots.all,
      bookedSlots: [],
    };
  }, [getAvailableSlotsForDate, getDoctorTimingSlots, selectedDate]);

  // Prefill problem/service if passed via navigation state
  useEffect(() => {
    const prefill = location.state?.problem || location.state?.service;
    if (prefill) {
      setValue('problem', prefill);
    }
  }, [location.state, setValue]);

  // Keep preferredTime valid if previous selection became booked or empty
  useEffect(() => {
    if (slotData?.allAvailable?.length > 0) {
      if (!selectedTime || slotData.bookedSlots.includes(selectedTime)) {
        setValue('preferredTime', slotData.allAvailable[0]);
      }
    }
  }, [slotData, selectedTime, setValue]);

  const onSubmit = async (data) => {
    if (slotData.isClosed) {
      setSlotError(`The clinic is closed on ${slotData.dayOfWeek}s. Doctor is available on: ${slotData.days?.join(', ')}. Please choose an open day.`);
      return;
    }
    if (slotData.bookedSlots.includes(data.preferredTime)) {
      setSlotError(`The time slot "${data.preferredTime}" is already booked on ${data.preferredDate}. Please select another time slot.`);
      return;
    }
    if (!slotData.allAvailable.includes(data.preferredTime)) {
      setSlotError('Please select a valid, available time slot.');
      return;
    }
    setSlotError('');

    const created = await addAppointment({
      ...data,
      promoCode: promoCode || null,
      source: promoCode ? `Website Form (20% Code: ${promoCode})` : 'Website Form',
    });
    setBookingSuccess(created);
    
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E11D48', '#0A2540', '#F43F5E', '#F59E0B'],
      });
    } catch (e) {
      // fallback
    }

    reset();
  };

  return (
    <Box className="bg-mesh-subtle" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 6 },
            borderRadius: '32px',
            bgcolor: '#FFFFFF',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 20px 45px -10px rgba(10, 37, 64, 0.08)',
          }}
        >
          {/* Header Title */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Chip label="ONLINE CLINICAL BOOKING PORTAL" color="secondary" sx={{ fontWeight: 700, mb: 1.5 }} />
            <Typography variant="h1" color="#0A2540" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} mb={1}>
              Book Consultation
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Direct appointment with <strong>{doctorProfile.name}</strong>. Both you and the clinic reception receive immediate WhatsApp verification.
            </Typography>
          </Box>

          {/* Success State Card */}
          <AnimatePresence>
            {bookingSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <Paper
                  sx={{
                    p: 4,
                    mb: 5,
                    borderRadius: '24px',
                    bgcolor: 'rgba(225, 29, 72, 0.05)',
                    border: '2px solid #E11D48',
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: '#E11D48',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 36 }} />
                  </Box>

                  <Typography variant="h3" color="#0A2540" fontWeight={800} mb={1}>
                    Appointment Confirmed!
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Booking Reference ID: <strong>{bookingSuccess.id}</strong>
                  </Typography>

                  {/* Digital Clinical Pass Card */}
                  <Paper
                    sx={{
                      p: 3,
                      maxWidth: 480,
                      mx: 'auto',
                      borderRadius: '18px',
                      bgcolor: '#FFFFFF',
                      border: '1px dashed #CBD5E1',
                      textAlign: 'left',
                      mb: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={800} color="#0A2540">
                        🩺 Clinic Entry Pass
                      </Typography>
                      <Chip label="Confirmed" size="small" sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700 }} />
                    </Box>
                    <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                      <strong>Patient Name:</strong> {bookingSuccess.patientName} ({bookingSuccess.gender}, {bookingSuccess.age} yrs)
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                      <strong>Date & Time:</strong> {bookingSuccess.preferredDate} at {bookingSuccess.preferredTime}
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                      <strong>Specialty / Concern:</strong> {bookingSuccess.problem}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      <strong>Clinic:</strong> ABC Medicare Center, Suite 402
                    </Typography>
                  </Paper>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<WhatsAppIcon />}
                      href={getDirectWhatsAppUrl(
                        bookingSuccess.mobile,
                        formatPatientNotification(bookingSuccess, doctorProfile)
                      )}
                      target="_blank"
                      sx={{
                        py: 1.4,
                        px: 3,
                        fontWeight: 700,
                        bgcolor: '#25D366',
                        '&:hover': { bgcolor: '#128C7E' },
                      }}
                    >
                      Open WhatsApp Pass
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setBookingSuccess(null)}
                      sx={{ py: 1.4, px: 3, fontWeight: 700 }}
                    >
                      Book Another Slot
                    </Button>
                  </Stack>
                </Paper>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {!bookingSuccess && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {/* 20% OFF Applied Promo Banner */}
                {promoCode && (
                  <Grid item xs={12}>
                    <Alert
                      severity="success"
                      icon={<CheckCircleIcon sx={{ color: '#16A34A', fontSize: 24 }} />}
                      sx={{
                        borderRadius: '16px',
                        bgcolor: '#F0FDF4',
                        border: '1.5px solid #86EFAC',
                        fontWeight: 700,
                        color: '#15803D',
                        alignItems: 'center',
                        fontSize: '0.96rem',
                        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.1)',
                      }}
                    >
                      🎉 20% First-Time Patient Discount Code <strong>"{promoCode}"</strong> is active for this booking!
                    </Alert>
                  </Grid>
                )}

                {/* Notice Alert */}
                <Grid item xs={12}>
                  <Alert
                    severity="info"
                    icon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                    sx={{
                      borderRadius: '16px',
                      bgcolor: 'rgba(37, 211, 102, 0.08)',
                      color: '#064E3B',
                      border: '1px solid rgba(37, 211, 102, 0.2)',
                    }}
                  >
                    Instant <strong>WhatsApp Confirmation</strong> and clinic queue pass are dispatched right upon submission.
                  </Alert>
                </Grid>

                {/* Patient Name */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="patientName"
                    control={control}
                    rules={{ required: 'Patient Full Name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Patient Full Name *"
                        placeholder="e.g. Robert Walker"
                        fullWidth
                        error={!!errors.patientName}
                        helperText={errors.patientName?.message}
                      />
                    )}
                  />
                </Grid>

                {/* WhatsApp Mobile */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="mobile"
                    control={control}
                    rules={{
                      required: 'WhatsApp Mobile Number is required',
                      pattern: { value: /^[0-9]{10,12}$/, message: 'Enter a valid 10-12 digit phone number' },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Mobile Number (for WhatsApp Pass) *"
                        placeholder="e.g. 9876543210"
                        fullWidth
                        error={!!errors.mobile}
                        helperText={errors.mobile?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Email Address */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email Address is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email Address *"
                        placeholder="robert@example.com"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Age */}
                <Grid item xs={6} sm={3}>
                  <Controller
                    name="age"
                    control={control}
                    rules={{ required: 'Age is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Age *"
                        type="number"
                        placeholder="35"
                        fullWidth
                        error={!!errors.age}
                        helperText={errors.age?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Gender Outlined Select (100% Aligned with Email & Age) */}
                <Grid item xs={6} sm={3}>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: 'Gender is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Gender *"
                        fullWidth
                        error={!!errors.gender}
                        helperText={errors.gender?.message}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>

                {/* Quick Dental Concern Selectors */}
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 1 }}>
                    ⚡ Quick-Select Dental Concern or Procedure:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                    {QUICK_PROBLEMS.map((prob) => {
                      const isSelected = selectedProblem === prob;
                      return (
                        <Chip
                          key={prob}
                          label={prob}
                          clickable
                          onClick={() => setValue('problem', prob)}
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            bgcolor: isSelected ? '#0A2540' : '#F1F5F9',
                            color: isSelected ? '#FFFFFF' : '#334155',
                            border: '1px solid',
                            borderColor: isSelected ? '#0A2540' : '#E2E8F0',
                            '&:hover': {
                              bgcolor: isSelected ? '#1E3A5F' : '#E2E8F0',
                            },
                          }}
                        />
                      );
                    })}
                  </Box>

                  <Controller
                    name="problem"
                    control={control}
                    rules={{ required: 'Dental concern or reason for visit is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Symptoms / Reason for Visit *"
                        placeholder="Describe your dental concern, toothache symptoms, or aesthetic smile goals..."
                        fullWidth
                        multiline
                        rows={2}
                        error={!!errors.problem}
                        helperText={errors.problem?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Balanced & Aligned Schedule Card (Date & Time Slots) */}
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2.5, sm: 3 },
                      borderRadius: '20px',
                      bgcolor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <Grid container spacing={3} alignItems="flex-start">
                      {/* Left: Date Selection & Quick Presets */}
                      <Grid item xs={12} md={5}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0A2540', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarMonthIcon sx={{ fontSize: 18, color: '#E11D48' }} />
                          Preferred Date *
                        </Typography>

                        <Controller
                          name="preferredDate"
                          control={control}
                          rules={{ required: 'Please select a date' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="date"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              error={!!errors.preferredDate}
                              helperText={errors.preferredDate?.message}
                              sx={{ bgcolor: '#FFFFFF', borderRadius: '12px' }}
                            />
                          )}
                        />

                        {/* Quick Date Presets */}
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1, fontSize: '0.74rem' }}>
                            Quick Date Presets:
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            {[
                              { label: 'Today', days: 0 },
                              { label: 'Tomorrow', days: 1 },
                              { label: 'In 2 Days', days: 2 },
                            ].map((preset) => {
                              const targetDate = new Date();
                              targetDate.setDate(targetDate.getDate() + preset.days);
                              const iso = targetDate.toISOString().split('T')[0];
                              const isSelected = selectedDate === iso;
                              return (
                                <Chip
                                  key={preset.label}
                                  label={preset.label}
                                  clickable
                                  onClick={() => setValue('preferredDate', iso)}
                                  size="small"
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    py: 0.5,
                                    bgcolor: isSelected ? '#E11D48' : '#FFFFFF',
                                    color: isSelected ? '#FFFFFF' : '#475569',
                                    border: '1px solid',
                                    borderColor: isSelected ? '#E11D48' : '#CBD5E1',
                                    '&:hover': { bgcolor: isSelected ? '#BE123C' : '#F1F5F9' },
                                  }}
                                />
                              );
                            })}
                          </Stack>
                        </Box>
                      </Grid>

                      {/* Right: Morning & Evening Time Slots */}
                      <Grid item xs={12} md={7}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0A2540', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon sx={{ fontSize: 18, color: '#E11D48' }} />
                            Consultation Time Slots *
                          </Typography>
                          {slotData.dayOfWeek && (
                            <Chip
                              size="small"
                              icon={<CalendarMonthIcon sx={{ fontSize: '14px !important' }} />}
                              label={slotData.isClosed ? `${slotData.dayOfWeek} (Closed)` : slotData.dayOfWeek}
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.73rem',
                                bgcolor: slotData.isClosed ? '#FEE2E2' : '#DCFCE7',
                                color: slotData.isClosed ? '#DC2626' : '#16A34A',
                              }}
                            />
                          )}
                        </Box>

                        {slotError && (
                          <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.8rem' }}>
                            {slotError}
                          </Alert>
                        )}

                        {slotData.isClosed ? (
                          <Alert
                            severity="warning"
                            icon={<CalendarMonthIcon fontSize="small" />}
                            sx={{ mb: 2, borderRadius: 2.5, fontSize: '0.84rem', bgcolor: '#FEF3C7', color: '#92400E' }}
                          >
                            <strong>Clinic Closed on {slotData.dayOfWeek}s:</strong> Dr. {doctorProfile?.name || 'the Doctor'} does not take appointments on {slotData.dayOfWeek}s.
                            <br />
                            <strong>Available Days:</strong> {slotData.days?.join(', ')}. Please select an open date above.
                          </Alert>
                        ) : (
                          <>
                        {slotData.availableMorning?.length > 0 ? (
                          <Box sx={{ mb: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.76rem', fontWeight: 700, display: 'block' }}>
                                🌅 Morning Dental Clinic:
                              </Typography>
                              <Chip
                                label={`${slotData.availableMorning.length} Available`}
                                size="small"
                                sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, bgcolor: '#FEF3C7', color: '#B45309' }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {slotData.availableMorning.map((slot) => {
                                const isSelected = selectedTime === slot;
                                return (
                                  <Chip
                                    key={slot}
                                    label={slot}
                                    clickable
                                    onClick={() => setValue('preferredTime', slot, { shouldValidate: true })}
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: '0.82rem',
                                      py: 1,
                                      px: 0.6,
                                      bgcolor: isSelected ? '#E11D48' : '#FFFFFF',
                                      color: isSelected ? '#FFFFFF' : '#0A2540',
                                      border: '1px solid',
                                      borderColor: isSelected ? '#E11D48' : '#CBD5E1',
                                      boxShadow: isSelected ? '0 4px 12px rgba(225, 29, 72, 0.25)' : 'none',
                                      cursor: 'pointer',
                                      '&:hover': {
                                        bgcolor: isSelected ? '#BE123C' : '#F8FAFC',
                                      },
                                    }}
                                  />
                                );
                              })}
                            </Box>
                          </Box>
                        ) : slotData.morning?.length > 0 ? (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.76rem', fontWeight: 700, display: 'block', mb: 0.4 }}>
                              🌅 Morning Dental Clinic:
                            </Typography>
                            <Typography variant="caption" color="#94A3B8" sx={{ fontStyle: 'italic', display: 'block' }}>
                              All morning slots are booked for this date.
                            </Typography>
                          </Box>
                        ) : null}

                        {/* Evening Slots */}
                        {slotData.availableEvening?.length > 0 ? (
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.76rem', fontWeight: 700, display: 'block' }}>
                                🌙 Evening Dental Clinic:
                              </Typography>
                              <Chip
                                label={`${slotData.availableEvening.length} Available`}
                                size="small"
                                sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, bgcolor: '#E0E7FF', color: '#4338CA' }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {slotData.availableEvening.map((slot) => {
                                const isSelected = selectedTime === slot;
                                return (
                                  <Chip
                                    key={slot}
                                    label={slot}
                                    clickable
                                    onClick={() => setValue('preferredTime', slot, { shouldValidate: true })}
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: '0.82rem',
                                      py: 1,
                                      px: 0.6,
                                      bgcolor: isSelected ? '#E11D48' : '#FFFFFF',
                                      color: isSelected ? '#FFFFFF' : '#0A2540',
                                      border: '1px solid',
                                      borderColor: isSelected ? '#E11D48' : '#CBD5E1',
                                      boxShadow: isSelected ? '0 4px 12px rgba(225, 29, 72, 0.25)' : 'none',
                                      cursor: 'pointer',
                                      '&:hover': {
                                        bgcolor: isSelected ? '#BE123C' : '#F8FAFC',
                                      },
                                    }}
                                  />
                                );
                              })}
                            </Box>
                          </Box>
                        ) : slotData.evening?.length > 0 ? (
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.76rem', fontWeight: 700, display: 'block', mb: 0.4 }}>
                              🌙 Evening Dental Clinic:
                            </Typography>
                            <Typography variant="caption" color="#94A3B8" sx={{ fontStyle: 'italic', display: 'block' }}>
                              All evening slots are booked for this date.
                            </Typography>
                          </Box>
                        ) : null}

                        {slotData.allAvailable?.length === 0 && (
                          <Alert severity="warning" sx={{ mt: 2, borderRadius: 2, fontSize: '0.82rem' }}>
                            All doctor consultation slots are booked for this date. Please pick another date.
                          </Alert>
                        )}
                        </>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Residential Address */}
                <Grid item xs={12}>
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: 'Residential address is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Patient Residential Address *"
                        placeholder="City, Area or Street address..."
                        fullWidth
                        error={!!errors.address}
                        helperText={errors.address?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Additional Notes */}
                <Grid item xs={12}>
                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Past Medical History / Medication Notes (Optional)"
                        placeholder="e.g. Taking Metformin 500mg, allergic to penicillin..."
                        fullWidth
                        multiline
                        rows={2}
                      />
                    )}
                  />
                </Grid>

                {/* Submit Action */}
                <Grid item xs={12}>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      size="large"
                      fullWidth
                      disabled={isSubmitting}
                      startIcon={<CalendarMonthIcon />}
                      sx={{
                        py: 1.8,
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        boxShadow: '0 10px 25px rgba(225, 29, 72, 0.35)',
                      }}
                    >
                      {isSubmitting ? 'Securing Your Slot...' : 'Confirm & Generate WhatsApp Pass'}
                    </Button>
                  </motion.div>
                </Grid>
              </Grid>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default BookAppointment;
