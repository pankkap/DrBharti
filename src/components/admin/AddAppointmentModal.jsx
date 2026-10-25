import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  Paper,
  Switch,
  Avatar,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useApp } from '../../context/AppContext';

export const COMMON_CONCERNS = [
  'General Consultation',
  'Routine Dental Checkup',
  'Toothache / Cavity',
  'Root Canal Treatment',
  'Dental Implants Consultation',
  'Clear Invisible Aligners',
  'Teeth Whitening',
  'Tooth Extraction / Wisdom Tooth',
  'Crowns & Bridges',
  'Scaling & Cleaning',
  'Gum Disease / Bleeding',
  'Emergency Consultation',
];

const AddAppointmentModal = ({ open, onClose, initialDate, onSuccess }) => {
  const {
    addAppointment,
    getAvailableSlotsForDate,
    getDoctorTimingSlots,
    doctorProfile,
    showCursorSnack,
  } = useApp();

  const doctorTimingSlots = useMemo(() => {
    if (getDoctorTimingSlots) {
      const { all } = getDoctorTimingSlots();
      if (all && all.length > 0) return all;
    }
    return [
      '09:30 AM', '10:30 AM', '11:30 AM', '12:30 PM',
      '04:00 PM', '05:00 PM', '06:30 PM', '07:30 PM',
    ];
  }, [getDoctorTimingSlots]);

  const [formData, setFormData] = useState({
    date: initialDate || new Date().toISOString().split('T')[0],
    time: doctorTimingSlots[0] || '10:30 AM',
    patientName: '',
    mobile: '',
    age: '',
    gender: 'Male',
    problem: 'General Consultation',
    status: 'Approved',
    sendWhatsApp: true,
    notes: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync date when initialDate changes or modal opens
  useEffect(() => {
    if (open) {
      const targetDate = initialDate || new Date().toISOString().split('T')[0];
      setFormData((prev) => ({
        ...prev,
        date: targetDate,
        time: prev.time || doctorTimingSlots[0] || '10:30 AM',
      }));
      setError('');
    }
  }, [open, initialDate, doctorTimingSlots]);

  const slotInfo = useMemo(() => {
    if (!formData.date) return { morning: [], evening: [], allAvailable: [], bookedSlots: [] };
    if (getAvailableSlotsForDate) {
      return getAvailableSlotsForDate(formData.date);
    }
    return {
      morning: doctorTimingSlots.map((s) => ({ slot: s, isBooked: false })),
      evening: [],
      allAvailable: doctorTimingSlots,
      bookedSlots: [],
    };
  }, [formData.date, getAvailableSlotsForDate, doctorTimingSlots]);

  // If currently chosen time is invalid for the selected date, pick the first available slot
  useEffect(() => {
    if (slotInfo.allAvailable && slotInfo.allAvailable.length > 0) {
      if (!formData.time || !doctorTimingSlots.includes(formData.time)) {
        setFormData((prev) => ({ ...prev, time: slotInfo.allAvailable[0] }));
      }
    }
  }, [slotInfo, doctorTimingSlots, formData.time]);

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    if (!formData.patientName.trim()) {
      setError('Please enter the patient full name.');
      return;
    }

    const cleanPhone = formData.mobile.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.time) {
      setError('Please select an appointment time slot.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      if (typeof addAppointment !== 'function') {
        throw new Error('Appointment service is currently unavailable.');
      }

      const created = await addAppointment({
        patientName: formData.patientName.trim(),
        mobile: cleanPhone.length === 10 ? `+91 ${cleanPhone}` : formData.mobile.trim(),
        age: formData.age ? String(formData.age).trim() : '',
        gender: formData.gender || 'Male',
        problem: formData.problem || 'General Consultation',
        preferredDate: formData.date,
        preferredTime: formData.time,
        status: formData.status || 'Approved',
        statusNotes: formData.notes || 'Booked manually by Doctor',
        source: 'Doctor Manual Entry',
        sendWhatsApp: formData.sendWhatsApp,
        skipDoctorWhatsApp: true,
      });

      if (typeof showCursorSnack === 'function') {
        showCursorSnack(
          `Appointment for ${created.patientName} created successfully${formData.sendWhatsApp ? ' with WhatsApp alert sent' : ''}!`,
          null,
          {
            title: 'Appointment Booked',
            severity: 'success',
          }
        );
      }

      if (typeof onSuccess === 'function') {
        onSuccess(created);
      }

      onClose();
    } catch (err) {
      console.error('Error creating manual appointment:', err);
      setError(err.message || 'Failed to create appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          py: 2.2,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'rgba(225, 29, 72, 0.12)', color: '#E11D48', width: 44, height: 44 }}>
            <PersonAddIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#0F4C81" sx={{ lineHeight: 1.2 }}>
              Add Manual Appointment
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Book a patient consultation directly into your calendar & database
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} disabled={isSubmitting} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Appointment Date *"
                type="date"
                fullWidth
                required
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Time Slot *"
                fullWidth
                required
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
              >
                {slotInfo?.morning?.length > 0 && [
                  <MenuItem
                    key="m-head"
                    disabled
                    sx={{ fontWeight: 800, fontSize: '0.72rem', color: '#0F4C81', bgcolor: '#F8FAFC' }}
                  >
                    🌅 MORNING SLOTS
                  </MenuItem>,
                  ...slotInfo.morning.map(({ slot, isBooked }) => (
                    <MenuItem key={`m-${slot}`} value={slot}>
                      {slot} {isBooked ? '⚠️ (Booked)' : '✓ (Available)'}
                    </MenuItem>
                  )),
                ]}

                {slotInfo?.evening?.length > 0 && [
                  <MenuItem
                    key="e-head"
                    disabled
                    sx={{ fontWeight: 800, fontSize: '0.72rem', color: '#0F4C81', bgcolor: '#F8FAFC' }}
                  >
                    🌆 EVENING SLOTS
                  </MenuItem>,
                  ...slotInfo.evening.map(({ slot, isBooked }) => (
                    <MenuItem key={`e-${slot}`} value={slot}>
                      {slot} {isBooked ? '⚠️ (Booked)' : '✓ (Available)'}
                    </MenuItem>
                  )),
                ]}

                {!slotInfo?.morning?.length &&
                  !slotInfo?.evening?.length &&
                  doctorTimingSlots.map((slot) => (
                    <MenuItem key={slot} value={slot}>
                      {slot}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Patient Full Name *"
                fullWidth
                required
                placeholder="e.g. Rajesh Sharma"
                value={formData.patientName}
                onChange={(e) => setFormData((prev) => ({ ...prev, patientName: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12} sm={7}>
              <TextField
                label="Patient Mobile Number *"
                fullWidth
                required
                placeholder="9876543210"
                value={formData.mobile}
                onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ fontSize: 18, color: '#64748B' }} />
                    </InputAdornment>
                  ),
                }}
                helperText="10-digit number. WhatsApp will be sent to this number."
              />
            </Grid>

            <Grid item xs={6} sm={2.5}>
              <TextField
                label="Age"
                type="number"
                fullWidth
                placeholder="30"
                value={formData.age}
                onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
              />
            </Grid>

            <Grid item xs={6} sm={2.5}>
              <TextField
                select
                label="Gender"
                fullWidth
                value={formData.gender}
                onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                select
                label="Consultation Concern / Problem"
                fullWidth
                value={formData.problem}
                onChange={(e) => setFormData((prev) => ({ ...prev, problem: e.target.value }))}
              >
                {COMMON_CONCERNS.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Initial Status"
                fullWidth
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              >
                <MenuItem value="Approved">Approved (Confirmed)</MenuItem>
                <MenuItem value="Pending">Pending Review</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Doctor / Reception Notes (Optional)"
                fullWidth
                multiline
                rows={2}
                placeholder="Any specific instructions, referral info, or preliminary notes..."
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </Grid>

            {/* Optional WhatsApp Trigger Card */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: formData.sendWhatsApp ? '#86EFAC' : '#E2E8F0',
                  bgcolor: formData.sendWhatsApp ? '#F0FDF4' : '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: formData.sendWhatsApp ? '#25D366' : '#94A3B8', width: 38, height: 38 }}>
                    <WhatsAppIcon sx={{ color: '#FFF' }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={800}
                      color={formData.sendWhatsApp ? '#15803D' : '#334155'}
                    >
                      Send WhatsApp Confirmation to Patient
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formData.sendWhatsApp
                        ? 'Patient will immediately receive confirmation on WhatsApp with time & clinic address'
                        : 'No WhatsApp notification will be sent for this appointment'}
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={formData.sendWhatsApp}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sendWhatsApp: e.target.checked }))}
                  color="success"
                />
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, bgcolor: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onClose} disabled={isSubmitting} sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
            sx={{
              bgcolor: '#E11D48',
              borderRadius: 2.5,
              fontWeight: 700,
              px: 3,
              py: 1,
              textTransform: 'none',
              '&:hover': { bgcolor: '#BE123C' },
            }}
          >
            {isSubmitting ? 'Saving to Database...' : 'Save & Book Appointment'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddAppointmentModal;
