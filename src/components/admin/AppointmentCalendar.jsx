import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack,
  Tooltip,
  Avatar,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useApp } from '../../context/AppContext';
import AddAppointmentModal from './AddAppointmentModal';

const COMMON_CONCERNS = [
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

const STATUS_COLORS = {
  Pending: { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  Approved: { bg: '#DCFCE7', color: '#16A34A', border: '#BBF7D0' },
  Rescheduled: { bg: '#E0F2FE', color: '#0284C7', border: '#BAE6FD' },
  Completed: { bg: '#fce5e5', color: '#be185d', border: '#fecdd3' },
  Rejected: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DEFAULT_CALENDAR_SLOTS = ['09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '04:00 PM', '05:00 PM', '06:30 PM', '07:30 PM'];

// Safe date key normalizer (YYYY-MM-DD)
const normalizeDateKey = (rawDate) => {
  if (!rawDate) return '';
  try {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
  } catch (e) {}

  const clean = String(rawDate).split('T')[0].trim().replace(/\//g, '-');
  const parts = clean.split('-');
  if (parts.length === 3) {
    const y = parts[0];
    const m = parts[1].padStart(2, '0');
    const d = parts[2].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return clean;
};

const AppointmentCalendar = ({
  appointments = [],
  onUpdateStatus,
  onReschedule,
  showCursorSnack,
}) => {
  const appContext = useApp?.() || {};
  const { addAppointment, doctorProfile } = appContext;
  const doctorTimingSlots = appContext.getDoctorTimingSlots?.()?.all || DEFAULT_CALENDAR_SLOTS;
  const getAvailableSlotsForDate = appContext.getAvailableSlotsForDate;

  // Smart initial month: default to month of appointments if available, otherwise current date
  const [currentDate, setCurrentDate] = useState(() => {
    if (Array.isArray(appointments) && appointments.length > 0) {
      const found = appointments.find((a) => a.preferredDate);
      if (found) {
        const d = new Date(found.preferredDate);
        if (!isNaN(d.getTime())) return d;
      }
    }
    return new Date();
  });

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState(null);
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, apt: null, date: '', time: '' });

  // Manual Add Appointment Modal State
  const [addModal, setAddModal] = useState({
    open: false,
    date: '',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Generate calendar days using reliable native Date math
  const { calendarDays, monthName } = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      days.push({
        day: d.getDate(),
        dateKey: `${yyyy}-${mm}-${dd}`,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      days.push({
        day: i,
        dateKey: `${yyyy}-${mm}-${dd}`,
        isCurrentMonth: true,
      });
    }

    // Next month filler days to complete grid (up to 35 or 42 cells)
    const targetLength = days.length > 35 ? 42 : 35;
    const remaining = targetLength - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      days.push({
        day: d.getDate(),
        dateKey: `${yyyy}-${mm}-${dd}`,
        isCurrentMonth: false,
      });
    }

    const monthStr = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
    return { calendarDays: days, monthName: monthStr };
  }, [year, month]);

  // Group appointments by normalized YYYY-MM-DD key
  const appointmentsByDate = useMemo(() => {
    const map = {};
    appointments.forEach((apt) => {
      const key = normalizeDateKey(apt.preferredDate);
      if (!key) return;
      if (!map[key]) map[key] = [];
      map[key].push(apt);
    });
    return map;
  }, [appointments]);

  const todayKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  const handleCellClick = (cellDateKey, dayList) => {
    setSelectedDayAppointments({ date: cellDateKey, list: dayList || [] });
  };

  const handleOpenAddModal = (targetDate) => {
    setAddModal({
      open: true,
      date: targetDate || todayKey,
    });
  };

  const handleOpenReschedule = (apt) => {
    setRescheduleModal({
      open: true,
      apt,
      date: normalizeDateKey(apt.preferredDate),
      time: apt.preferredTime || doctorTimingSlots[0] || '10:00 AM',
    });
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleModal.date || !rescheduleModal.time) return;
    if (onReschedule) {
      onReschedule(rescheduleModal.apt.id, rescheduleModal.date, rescheduleModal.time);
    } else if (onUpdateStatus) {
      onUpdateStatus(rescheduleModal.apt.id, 'Rescheduled', `Rescheduled to ${rescheduleModal.date} at ${rescheduleModal.time}`, {
        preferredDate: rescheduleModal.date,
        preferredTime: rescheduleModal.time,
      });
    }
    setRescheduleModal({ open: false, apt: null, date: '', time: '' });
    setSelectedAppointment(null);
    if (selectedDayAppointments) setSelectedDayAppointments(null);
  };

  return (
    <Box>
      {/* Calendar Header Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 4,
          border: '1px solid #E2E8F0',
          bgcolor: '#FFF',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F8FAFC', borderRadius: 3, p: 0.5, border: '1px solid #E2E8F0' }}>
            <IconButton onClick={prevMonth} size="small" aria-label="Previous month">
              <ChevronLeftIcon />
            </IconButton>
            <IconButton onClick={nextMonth} size="small" aria-label="Next month">
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Button
            startIcon={<TodayIcon />}
            variant="outlined"
            size="small"
            onClick={goToToday}
            sx={{
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 700,
              color: '#0F4C81',
              borderColor: '#CBD5E1',
            }}
          >
            Today
          </Button>
          <Typography variant="h5" fontWeight={800} color="#0F4C81">
            {monthName}
          </Typography>
        </Box>

        {/* Status Legends */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
          {Object.entries(STATUS_COLORS).map(([status, style]) => (
            <Chip
              key={status}
              label={status}
              size="small"
              sx={{
                bgcolor: style.bg,
                color: style.color,
                fontWeight: 700,
                fontSize: '0.75rem',
                border: `1px solid ${style.border}`,
              }}
            />
          ))}
        </Stack>
      </Paper>

      {/* Calendar Month Grid - CSS Grid (Reliable 7 Columns) */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid #E2E8F0',
          bgcolor: '#FFF',
          overflow: 'hidden',
        }}
      >
        {/* Days of Week Header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            bgcolor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          {DAYS_OF_WEEK.map((dayName, idx) => (
            <Box
              key={dayName}
              sx={{
                py: 1.5,
                textAlign: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
                color: idx === 0 || idx === 6 ? '#0F4C81' : '#475569',
                borderRight: idx < 6 ? '1px solid #E2E8F0' : 'none',
              }}
            >
              {dayName}
            </Box>
          ))}
        </Box>

        {/* Day Cells Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          }}
        >
          {calendarDays.map((cell, idx) => {
            const dayApts = appointmentsByDate[cell.dateKey] || [];
            const isToday = cell.dateKey === todayKey;
            const borderRight = (idx + 1) % 7 !== 0 ? '1px solid #E2E8F0' : 'none';
            const borderBottom = idx < calendarDays.length - 7 ? '1px solid #E2E8F0' : 'none';

            return (
              <Box
                key={cell.dateKey + idx}
                onClick={() => handleCellClick(cell.dateKey, dayApts)}
                sx={{
                  minHeight: 120,
                  p: 1.2,
                  bgcolor: isToday ? 'rgba(225, 29, 72, 0.05)' : cell.isCurrentMonth ? '#FFF' : '#FBFCFD',
                  borderRight,
                  borderBottom,
                  position: 'relative',
                  cursor: dayApts.length > 0 ? 'pointer' : 'default',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    bgcolor: cell.isCurrentMonth ? 'rgba(15, 76, 129, 0.04)' : '#F1F5F9',
                  },
                }}
              >
                {/* Date Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.82rem',
                      fontWeight: isToday ? 800 : cell.isCurrentMonth ? 700 : 400,
                      color: isToday ? '#FFF' : cell.isCurrentMonth ? '#1E293B' : '#94A3B8',
                      bgcolor: isToday ? '#E11D48' : 'transparent',
                    }}
                  >
                    {cell.day}
                  </Box>

                  {dayApts.length > 0 && (
                    <Chip
                      label={`${dayApts.length}`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        bgcolor: '#0F4C81',
                        color: '#FFF',
                      }}
                    />
                  )}
                </Box>

                {/* Appointment Tags */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                  {dayApts.slice(0, 2).map((apt) => {
                    const st = STATUS_COLORS[apt.status] || STATUS_COLORS.Pending;
                    return (
                      <Box
                        key={apt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppointment(apt);
                        }}
                        sx={{
                          p: '4px 8px',
                          borderRadius: 1.5,
                          bgcolor: st.bg,
                          color: st.color,
                          border: `1px solid ${st.border}`,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                          '&:hover': { opacity: 0.85 },
                        }}
                      >
                        {apt.preferredTime ? `${apt.preferredTime.split(' ')[0]} ` : ''}
                        {apt.patientName}
                      </Box>
                    );
                  })}

                  {dayApts.length > 2 && (
                    <Typography
                      variant="caption"
                      color="primary"
                      fontWeight={700}
                      sx={{ fontSize: '0.7rem', cursor: 'pointer', pl: 0.5 }}
                    >
                      +{dayApts.length - 2} more...
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Single Appointment Details Dialog */}
      <Dialog
        open={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        {selectedAppointment && (
          <>
            <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight={800} color="#0F4C81">
                  Appointment Details
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {selectedAppointment.id}
                </Typography>
              </Box>
              <Chip
                label={selectedAppointment.status}
                sx={{
                  bgcolor: STATUS_COLORS[selectedAppointment.status]?.bg || '#FEF3C7',
                  color: STATUS_COLORS[selectedAppointment.status]?.color || '#D97706',
                  fontWeight: 700,
                }}
              />
            </DialogTitle>

            <DialogContent dividers>
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 50, height: 50, bgcolor: 'rgba(15, 76, 129, 0.1)', color: '#0F4C81' }}>
                    <PersonIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800} color="#0F4C81">
                      {selectedAppointment.patientName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedAppointment.age ? `${selectedAppointment.age} yrs, ` : ''}
                      {selectedAppointment.gender || ''}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Mobile Number
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                      {selectedAppointment.mobile}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Email Address
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedAppointment.email || 'Not provided'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Scheduled Date & Slot
                    </Typography>
                    <Typography variant="body1" fontWeight={700} color="#E11D48">
                      📅 {selectedAppointment.preferredDate} ({selectedAppointment.preferredTime})
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Service / Health Concern
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedAppointment.problem || 'General Checkup'}
                    </Typography>
                  </Grid>

                  {selectedAppointment.address && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Patient Address
                      </Typography>
                      <Typography variant="body2">{selectedAppointment.address}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Button
                startIcon={<WhatsAppIcon />}
                variant="outlined"
                color="success"
                onClick={() => {
                  const phone = (selectedAppointment.mobile || '').replace(/\D/g, '');
                  window.open(`https://wa.me/${phone}`, '_blank');
                }}
                sx={{ borderRadius: 2.5, fontWeight: 700 }}
              >
                Chat WhatsApp
              </Button>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {selectedAppointment.status !== 'Approved' && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => {
                      onUpdateStatus(selectedAppointment.id, 'Approved');
                      setSelectedAppointment(null);
                    }}
                    sx={{ borderRadius: 2.5, fontWeight: 700 }}
                  >
                    Approve
                  </Button>
                )}

                <Button
                  variant="outlined"
                  startIcon={<EditCalendarIcon />}
                  onClick={() => handleOpenReschedule(selectedAppointment)}
                  sx={{ borderRadius: 2.5, fontWeight: 700 }}
                >
                  Reschedule
                </Button>

                {selectedAppointment.status !== 'Completed' && (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<EventAvailableIcon />}
                    onClick={() => {
                      onUpdateStatus(selectedAppointment.id, 'Completed');
                      setSelectedAppointment(null);
                    }}
                    sx={{ borderRadius: 2.5, fontWeight: 700, bgcolor: '#E11D48', '&:hover': { bgcolor: '#BE123C' } }}
                  >
                    Completed
                  </Button>
                )}
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Selected Day All Appointments Dialog */}
      <Dialog
        open={Boolean(selectedDayAppointments)}
        onClose={() => setSelectedDayAppointments(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        {selectedDayAppointments && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
              <Typography variant="h6" fontWeight={800} color="#0F4C81">
                Appointments on {selectedDayAppointments.date} ({selectedDayAppointments.list.length})
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleOpenAddModal(selectedDayAppointments.date)}
                sx={{
                  bgcolor: '#E11D48',
                  borderRadius: 2.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 2.2,
                  py: 0.8,
                  boxShadow: '0 2px 8px rgba(225, 29, 72, 0.25)',
                  '&:hover': { bgcolor: '#BE123C' },
                }}
              >
                Add Appointment
              </Button>
            </DialogTitle>
            <DialogContent dividers>
              {selectedDayAppointments.list.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <CalendarMonthIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 1.5 }} />
                  <Typography variant="subtitle1" fontWeight={800} color="#334155">
                    No Appointments on {selectedDayAppointments.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 360, mx: 'auto' }}>
                    There are no patient visits booked on this date. Click below to manually book a consultation slot.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenAddModal(selectedDayAppointments.date)}
                    sx={{
                      bgcolor: '#E11D48',
                      borderRadius: 2.5,
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 3,
                      py: 1,
                      '&:hover': { bgcolor: '#BE123C' },
                    }}
                  >
                    Add Appointment
                  </Button>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {selectedDayAppointments.list.map((apt) => (
                    <Paper
                      key={apt.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2,
                        bgcolor: '#F8FAFC',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={apt.preferredTime}
                          size="small"
                          icon={<AccessTimeIcon />}
                          sx={{ fontWeight: 800, bgcolor: '#0F4C81', color: '#FFF' }}
                        />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={800} color="#0F4C81">
                            {apt.patientName} ({apt.mobile})
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Concern: {apt.problem || 'Routine Checkup'}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={apt.status}
                          size="small"
                          sx={{
                            bgcolor: STATUS_COLORS[apt.status]?.bg,
                            color: STATUS_COLORS[apt.status]?.color,
                            fontWeight: 700,
                          }}
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setSelectedDayAppointments(null);
                          }}
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                        >
                          Inspect
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedDayAppointments(null)} sx={{ fontWeight: 700 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Manual Appointment Booking Modal */}
      <AddAppointmentModal
        open={addModal.open}
        initialDate={addModal.date}
        onClose={() => setAddModal((prev) => ({ ...prev, open: false }))}
        onSuccess={(created) => {
          if (selectedDayAppointments && selectedDayAppointments.date === created.preferredDate) {
            setSelectedDayAppointments((prev) => ({
              ...prev,
              list: [created, ...(prev?.list || []).filter((a) => a.id !== created.id)],
            }));
          }
        }}
      />

      {/* Reschedule Modal */}
      <Dialog
        open={rescheduleModal.open}
        onClose={() => setRescheduleModal({ open: false, apt: null, date: '', time: '' })}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0F4C81' }}>Reschedule Appointment</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="New Appointment Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={rescheduleModal.date}
              onChange={(e) => setRescheduleModal((prev) => ({ ...prev, date: e.target.value }))}
            />
            <TextField
              select
              label="New Time Slot"
              fullWidth
              value={rescheduleModal.time}
              onChange={(e) => setRescheduleModal((prev) => ({ ...prev, time: e.target.value }))}
            >
              {doctorTimingSlots.map((slot) => {
                const isBooked = rescheduleModal.date && getAvailableSlotsForDate
                  ? getAvailableSlotsForDate(rescheduleModal.date).bookedSlots.includes(slot)
                  : false;
                return (
                  <MenuItem key={slot} value={slot}>
                    {slot} {isBooked ? ' (Already Booked)' : ''}
                  </MenuItem>
                );
              })}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRescheduleModal({ open: false, apt: null, date: '', time: '' })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmReschedule}
            sx={{ bgcolor: '#E11D48', '&:hover': { bgcolor: '#BE123C' }, fontWeight: 700, borderRadius: 2.5 }}
          >
            Save Reschedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentCalendar;
