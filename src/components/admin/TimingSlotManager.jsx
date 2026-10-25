import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  TextField,
  MenuItem,
  Stack,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Grid,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useApp } from '../../context/AppContext';
import { DEFAULT_TIMING_SLOTS, ALL_DAYS_OF_WEEK } from '../../data/initialData';

// Helper to convert "HH:MM AM/PM" to minutes from midnight for sorting
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const sortSlots = (slots) => {
  return [...slots].sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
};

const TimingSlotManager = ({ onSaved = null, embedded = false }) => {
  const { doctorProfile, updateDoctorTimingSlots, showCursorSnack } = useApp();

  const initialDays = Array.isArray(doctorProfile?.timingSlots?.days) && doctorProfile.timingSlots.days.length > 0
    ? doctorProfile.timingSlots.days
    : DEFAULT_TIMING_SLOTS.days;
  const initialMorning = doctorProfile?.timingSlots?.morning || DEFAULT_TIMING_SLOTS.morning;
  const initialEvening = doctorProfile?.timingSlots?.evening || DEFAULT_TIMING_SLOTS.evening;

  const [activeDays, setActiveDays] = useState(initialDays);
  const [morningSlots, setMorningSlots] = useState(initialMorning);
  const [eveningSlots, setEveningSlots] = useState(initialEvening);
  const [selectedSection, setSelectedSection] = useState('morning');
  const [newHour, setNewHour] = useState('10');
  const [newMinute, setNewMinute] = useState('00');
  const [newPeriod, setNewPeriod] = useState('AM');
  const [customInput, setCustomInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', severity: 'info' });

  // Toggle active consultation day
  const handleToggleDay = (day) => {
    if (activeDays.includes(day)) {
      if (activeDays.length === 1) {
        setMessage({ text: 'You must keep at least one consultation day active.', severity: 'warning' });
        return;
      }
      setActiveDays((prev) => prev.filter((d) => d !== day));
      setMessage({ text: `Disabled appointments on ${day}s. Click "Save Slots" to apply.`, severity: 'info' });
    } else {
      const ordered = ALL_DAYS_OF_WEEK.filter((d) => activeDays.includes(d) || d === day);
      setActiveDays(ordered);
      setMessage({ text: `Enabled appointments on ${day}s. Click "Save Slots" to apply.`, severity: 'success' });
    }
  };

  // Quick preset days
  const handleSetPresetDays = (preset) => {
    if (preset === 'mon-sat') {
      setActiveDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
      setMessage({ text: 'Set consultation days to Monday - Saturday. Click "Save Slots" to apply.', severity: 'info' });
    } else if (preset === 'mon-fri') {
      setActiveDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
      setMessage({ text: 'Set consultation days to Monday - Friday. Click "Save Slots" to apply.', severity: 'info' });
    } else if (preset === 'all') {
      setActiveDays(ALL_DAYS_OF_WEEK);
      setMessage({ text: 'Set consultation days to all 7 days. Click "Save Slots" to apply.', severity: 'info' });
    }
  };

  // Add new slot handler
  const handleAddSlot = (e) => {
    e?.preventDefault();
    let slotToAdd = '';

    if (customInput.trim()) {
      slotToAdd = customInput.trim();
    } else {
      const formattedHour = String(newHour).padStart(2, '0');
      slotToAdd = `${formattedHour}:${newMinute} ${newPeriod}`;
    }

    // Auto-detect target section if AM/PM is clear
    const targetSection =
      selectedSection || (slotToAdd.toUpperCase().includes('PM') ? 'evening' : 'morning');

    if (targetSection === 'morning') {
      if (morningSlots.includes(slotToAdd)) {
        setMessage({ text: `Slot "${slotToAdd}" already exists in Morning slots!`, severity: 'warning' });
        return;
      }
      const updated = sortSlots([...morningSlots, slotToAdd]);
      setMorningSlots(updated);
      setMessage({ text: `Added "${slotToAdd}" to Morning slots. Click "Save Slots" to persist.`, severity: 'success' });
    } else {
      if (eveningSlots.includes(slotToAdd)) {
        setMessage({ text: `Slot "${slotToAdd}" already exists in Evening slots!`, severity: 'warning' });
        return;
      }
      const updated = sortSlots([...eveningSlots, slotToAdd]);
      setEveningSlots(updated);
      setMessage({ text: `Added "${slotToAdd}" to Evening slots. Click "Save Slots" to persist.`, severity: 'success' });
    }

    setCustomInput('');
  };

  // Remove slot handler
  const handleRemoveSlot = (section, slotToRemove) => {
    if (section === 'morning') {
      const updated = morningSlots.filter((s) => s !== slotToRemove);
      setMorningSlots(updated);
    } else {
      const updated = eveningSlots.filter((s) => s !== slotToRemove);
      setEveningSlots(updated);
    }
    setMessage({ text: `Removed "${slotToRemove}". Click "Save Slots" to persist.`, severity: 'info' });
  };

  // Reset to default standard slots
  const handleResetToDefault = () => {
    setActiveDays(DEFAULT_TIMING_SLOTS.days);
    setMorningSlots(DEFAULT_TIMING_SLOTS.morning);
    setEveningSlots(DEFAULT_TIMING_SLOTS.evening);
    setMessage({ text: 'Schedule reset to default schedule (Mon - Sat). Click "Save Slots" to persist.', severity: 'info' });
  };

  // Save changes to Firestore
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const newTimingSlots = {
        days: activeDays,
        morning: sortSlots(morningSlots),
        evening: sortSlots(eveningSlots),
        updatedAt: new Date().toISOString(),
      };
      await updateDoctorTimingSlots(newTimingSlots);
      setMessage({
        text: 'Consultation days & timing slots successfully synced with Firestore! All patient bookings & WhatsApp AI Assistant will now follow this exact schedule.',
        severity: 'success',
      });
      showCursorSnack('Doctor consultation days and slots updated and synced with Cloud & WhatsApp AI!', null, {
        title: 'Schedule & Slots Saved',
        severity: 'success',
      });
      if (typeof onSaved === 'function') {
        onSaved(newTimingSlots);
      }
    } catch (err) {
      console.error('Error saving doctor timing slots:', err);
      setMessage({ text: 'Failed to sync with cloud. Please try again.', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: embedded ? 2 : 3.5,
        borderRadius: 3.5,
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: 'rgba(225, 29, 72, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E11D48',
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#0F4C81">
              Custom Consultation Timing Slots
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create and manage the exact appointment slots you want to offer patients & WhatsApp AI.
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltIcon />}
            onClick={handleResetToDefault}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', color: '#64748B' }}
          >
            Reset Defaults
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<CloudDoneIcon />}
            onClick={handleSaveChanges}
            disabled={isSaving}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              bgcolor: '#E11D48',
              '&:hover': { bgcolor: '#BE123C' },
            }}
          >
            {isSaving ? 'Saving...' : 'Save Slots'}
          </Button>
        </Stack>
      </Box>

      {/* Info notice */}
      <Alert
        severity="info"
        icon={<InfoOutlinedIcon fontSize="small" />}
        sx={{
          mb: 3,
          borderRadius: 2.5,
          fontSize: '0.83rem',
          bgcolor: 'rgba(15, 76, 129, 0.05)',
          color: '#0F4C81',
          '& .MuiAlert-icon': { color: '#0F4C81' },
        }}
      >
        <strong>Clinic Rule:</strong> Patients booking via the website and the <strong>WhatsApp AI Assistant</strong> are strictly limited to the slots configured below. Slots already booked for a specific date are automatically disabled to prevent double bookings.
      </Alert>

      {message.text && (
        <Alert
          severity={message.severity}
          onClose={() => setMessage({ text: '', severity: 'info' })}
          sx={{ mb: 2.5, borderRadius: 2 }}
        >
          {message.text}
        </Alert>
      )}

      {/* Clinic Consultation Days (Working Days of the Week) */}
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          bgcolor: '#F8FAFC',
          borderColor: '#CBD5E1',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon sx={{ color: '#E11D48', fontSize: 22 }} />
            <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
              Clinic Consultation Days (Weekly Working Days)
            </Typography>
          </Box>
          {/* Presets */}
          <Stack direction="row" spacing={0.8}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleSetPresetDays('mon-sat')}
              sx={{ borderRadius: 2, fontSize: '0.75rem', py: 0.3, textTransform: 'none', fontWeight: 600, color: '#0F4C81', borderColor: '#CBD5E1' }}
            >
              Mon - Sat
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleSetPresetDays('mon-fri')}
              sx={{ borderRadius: 2, fontSize: '0.75rem', py: 0.3, textTransform: 'none', fontWeight: 600, color: '#0F4C81', borderColor: '#CBD5E1' }}
            >
              Mon - Fri
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleSetPresetDays('all')}
              sx={{ borderRadius: 2, fontSize: '0.75rem', py: 0.3, textTransform: 'none', fontWeight: 600, color: '#0F4C81', borderColor: '#CBD5E1' }}
            >
              All 7 Days
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.82rem' }}>
          Select the active days when patients and WhatsApp AI can schedule appointments with <strong>{doctorProfile?.name || 'the Doctor'}</strong>. Days turned off will be marked closed on the website and WhatsApp AI.
        </Typography>

        {/* Day of Week Toggle Chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {ALL_DAYS_OF_WEEK.map((day) => {
            const isActive = activeDays.includes(day);
            return (
              <Chip
                key={day}
                label={day}
                icon={isActive ? <CheckCircleIcon sx={{ fontSize: '16px !important', color: '#FFF !important' }} /> : undefined}
                clickable
                onClick={() => handleToggleDay(day)}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  py: 2.2,
                  px: 1,
                  bgcolor: isActive ? '#E11D48' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  border: '1px solid',
                  borderColor: isActive ? '#E11D48' : '#CBD5E1',
                  boxShadow: isActive ? '0 3px 10px rgba(225, 29, 72, 0.25)' : 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: isActive ? '#BE123C' : '#F1F5F9',
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Schedule Summary Status */}
        <Box sx={{ mt: 1.8, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F4C81', fontSize: '0.8rem' }}>
            📅 Active Clinic Days ({activeDays.length}/7):
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
            {activeDays.length === 7
              ? 'Open every day (Monday to Sunday)'
              : activeDays.length === 6 && !activeDays.includes('Sunday')
              ? 'Monday to Saturday (Closed on Sunday)'
              : activeDays.length === 5 && !activeDays.includes('Saturday') && !activeDays.includes('Sunday')
              ? 'Monday to Friday (Closed on Weekends)'
              : activeDays.join(', ')}
          </Typography>
        </Box>
      </Paper>

      {/* Add New Slot Control */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          bgcolor: '#F8FAFC',
          borderColor: '#E2E8F0',
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} color="#1E293B" sx={{ mb: 1.5 }}>
          ➕ Add New Consultation Time Slot
        </Typography>

        <Grid container spacing={1.5} alignItems="center">
          {/* Section: Morning or Evening */}
          <Grid item xs={12} sm={3}>
            <TextField
              select
              size="small"
              label="Session"
              fullWidth
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setNewPeriod(e.target.value === 'morning' ? 'AM' : 'PM');
              }}
            >
              <MenuItem value="morning">🌅 Morning Clinic</MenuItem>
              <MenuItem value="evening">🌙 Evening Clinic</MenuItem>
            </TextField>
          </Grid>

          {/* Hour */}
          <Grid item xs={4} sm={2}>
            <TextField
              select
              size="small"
              label="Hour"
              fullWidth
              value={newHour}
              onChange={(e) => setNewHour(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const h = String(i + 1).padStart(2, '0');
                return (
                  <MenuItem key={h} value={h}>
                    {h}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>

          {/* Minute */}
          <Grid item xs={4} sm={2}>
            <TextField
              select
              size="small"
              label="Minute"
              fullWidth
              value={newMinute}
              onChange={(e) => setNewMinute(e.target.value)}
            >
              {['00', '15', '30', '45'].map((m) => (
                <MenuItem key={m} value={m}>
                  :{m}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* AM / PM */}
          <Grid item xs={4} sm={2}>
            <TextField
              select
              size="small"
              label="AM / PM"
              fullWidth
              value={newPeriod}
              onChange={(e) => {
                setNewPeriod(e.target.value);
                setSelectedSection(e.target.value === 'AM' ? 'morning' : 'evening');
              }}
            >
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="PM">PM</MenuItem>
            </TextField>
          </Grid>

          {/* Add Button */}
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddCircleIcon />}
              onClick={handleAddSlot}
              sx={{
                bgcolor: '#0F4C81',
                '&:hover': { bgcolor: '#0B3860' },
                fontWeight: 700,
                borderRadius: 2,
                textTransform: 'none',
                py: 0.9,
              }}
            >
              Add to {selectedSection === 'morning' ? 'Morning' : 'Evening'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Slots Lists */}
      <Grid container spacing={3}>
        {/* Morning Slots */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              bgcolor: '#F8FAFC',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WbSunnyIcon sx={{ color: '#D97706', fontSize: 20 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#0F172A">
                    Morning Dental Clinic Slots
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.73rem', fontWeight: 600, display: 'block' }}>
                    Available on: {activeDays.length === 7 ? 'All 7 Days' : activeDays.map((d) => d.slice(0, 3)).join(', ')}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={`${morningSlots.length} Slots`}
                size="small"
                sx={{ fontWeight: 700, bgcolor: '#FEF3C7', color: '#B45309', fontSize: '0.75rem' }}
              />
            </Box>

            {morningSlots.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 2 }}>
                No morning slots configured. Add a slot above.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {morningSlots.map((slot) => (
                  <Chip
                    key={slot}
                    label={slot}
                    icon={<AccessTimeIcon sx={{ fontSize: '15px !important' }} />}
                    onDelete={() => handleRemoveSlot('morning', slot)}
                    deleteIcon={
                      <Tooltip title={`Remove ${slot}`}>
                        <DeleteForeverIcon sx={{ fontSize: '18px !important' }} />
                      </Tooltip>
                    }
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      py: 2.2,
                      px: 0.5,
                      bgcolor: '#FFFFFF',
                      color: '#0F4C81',
                      border: '1px solid #CBD5E1',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                      '& .MuiChip-deleteIcon': {
                        color: '#EF4444',
                        '&:hover': { color: '#DC2626' },
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Evening Slots */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              bgcolor: '#F8FAFC',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NightsStayIcon sx={{ color: '#6366F1', fontSize: 20 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#0F172A">
                    Evening Dental Clinic Slots
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.73rem', fontWeight: 600, display: 'block' }}>
                    Available on: {activeDays.length === 7 ? 'All 7 Days' : activeDays.map((d) => d.slice(0, 3)).join(', ')}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={`${eveningSlots.length} Slots`}
                size="small"
                sx={{ fontWeight: 700, bgcolor: '#E0E7FF', color: '#4338CA', fontSize: '0.75rem' }}
              />
            </Box>

            {eveningSlots.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 2 }}>
                No evening slots configured. Add a slot above.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {eveningSlots.map((slot) => (
                  <Chip
                    key={slot}
                    label={slot}
                    icon={<AccessTimeIcon sx={{ fontSize: '15px !important' }} />}
                    onDelete={() => handleRemoveSlot('evening', slot)}
                    deleteIcon={
                      <Tooltip title={`Remove ${slot}`}>
                        <DeleteForeverIcon sx={{ fontSize: '18px !important' }} />
                      </Tooltip>
                    }
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      py: 2.2,
                      px: 0.5,
                      bgcolor: '#FFFFFF',
                      color: '#0F4C81',
                      border: '1px solid #CBD5E1',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                      '& .MuiChip-deleteIcon': {
                        color: '#EF4444',
                        '&:hover': { color: '#DC2626' },
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Save Button Footer */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        <Button
          variant="contained"
          size="medium"
          startIcon={<CloudDoneIcon />}
          onClick={handleSaveChanges}
          disabled={isSaving}
          sx={{
            py: 1.2,
            px: 3.5,
            bgcolor: '#E11D48',
            borderRadius: 2.5,
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': { bgcolor: '#BE123C' },
          }}
        >
          {isSaving ? 'Syncing with Firestore...' : 'Apply & Save Slots to Cloud'}
        </Button>
      </Box>
    </Paper>
  );
};

export default TimingSlotManager;
