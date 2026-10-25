import React, { useState } from 'react';
import { Box, Typography, Button, Chip, Stack } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const DAYS = [
  { day: 'Today', date: 'Sept 1', available: true, slots: 4 },
  { day: 'Tomorrow', date: 'Sept 2', available: true, slots: 8 },
  { day: 'Wednesday', date: 'Sept 3', available: true, slots: 6 },
  { day: 'Thursday', date: 'Sept 4', available: true, slots: 9 },
];

const DEFAULT_SLOTS = [
  '09:30 AM',
  '10:30 AM',
  '11:30 AM',
  '04:30 PM',
  '05:30 PM',
  '06:30 PM',
];

export const InteractiveHeroCalendar = () => {
  const { getDoctorTimingSlots, getAvailableSlotsForDate, doctorProfile } = useApp?.() || {};
  const [selectedDay, setSelectedDay] = useState(0);

  const activeDateStr = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + selectedDay);
    return d.toISOString().split('T')[0];
  }, [selectedDay]);

  const activeSlots = React.useMemo(() => {
    if (getAvailableSlotsForDate) {
      const available = getAvailableSlotsForDate(activeDateStr).allAvailable;
      return available.length > 0 ? available.slice(0, 6) : [];
    }
    return getDoctorTimingSlots?.()?.all?.slice(0, 6) || DEFAULT_SLOTS;
  }, [getAvailableSlotsForDate, getDoctorTimingSlots, activeDateStr]);

  const [selectedSlot, setSelectedSlot] = useState(activeSlots[0] || '10:30 AM');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (activeSlots.length > 0 && !activeSlots.includes(selectedSlot)) {
      setSelectedSlot(activeSlots[0]);
    }
  }, [activeSlots, selectedSlot]);

  const handleBook = () => {
    navigate('/book-appointment');
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      sx={{
        borderRadius: '16px',
        p: { xs: 2.5, sm: 3 },
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '8px',
              bgcolor: 'rgba(225, 29, 72, 0.1)',
              color: '#E11D48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={800} color="#0F172A">
              OPD Availability Radar
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <span className="live-dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#E11D48' }} />
              {doctorProfile?.name || 'Dr. Bharti'} • In Clinic
            </Typography>
          </Box>
        </Box>

        <Chip
          icon={<WhatsAppIcon sx={{ fontSize: 13, color: '#25D366 !important' }} />}
          label="Instant Pass"
          size="small"
          sx={{ bgcolor: 'rgba(37, 211, 102, 0.08)', color: '#065F46', fontWeight: 600, borderRadius: '6px' }}
        />
      </Box>

      {/* Day Selector Pills */}
      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.72rem' }}>
        Select Consultation Day
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mb: 2 }}>
        {DAYS.map((item, idx) => {
          const isSelected = selectedDay === idx;
          return (
            <Box
              key={item.day}
              component={motion.button}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDay(idx)}
              sx={{
                p: 1,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isSelected ? '#0F172A' : '#E2E8F0',
                bgcolor: isSelected ? '#0F172A' : '#F8FAFC',
                cursor: 'pointer',
                textAlign: 'center',
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: isSelected ? '#94A3B8' : '#64748B', fontSize: '0.7rem' }}>
                {item.day}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: isSelected ? '#FFFFFF' : '#0F172A', fontSize: '0.85rem' }}>
                {item.date}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.68rem', color: isSelected ? '#FECDD3' : '#E11D48', fontWeight: 600 }}>
                {item.slots} slots
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Time Slot Chips */}
      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.72rem' }}>
        Select Available Time Slot
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.75, mb: 2.5 }}>
        {activeSlots.map((slot) => {
          const isSelected = selectedSlot === slot;
          return (
            <Button
              key={slot}
              size="small"
              variant={isSelected ? 'contained' : 'outlined'}
              onClick={() => setSelectedSlot(slot)}
              sx={{
                fontWeight: 600,
                fontSize: '0.78rem',
                borderRadius: '6px',
                py: 0.6,
                bgcolor: isSelected ? '#E11D48' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#334155',
                borderColor: isSelected ? '#E11D48' : '#CBD5E1',
                '&:hover': {
                  bgcolor: isSelected ? '#BE123C' : '#F8FAFC',
                  borderColor: isSelected ? '#BE123C' : '#94A3B8',
                },
              }}
            >
              {slot}
            </Button>
          );
        })}
      </Box>

      {/* CTA Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="medium"
        endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
        onClick={handleBook}
        sx={{
          py: 1.2,
          fontWeight: 700,
          fontSize: '0.92rem',
          borderRadius: '8px',
        }}
      >
        Book {selectedSlot} Slot
      </Button>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1, fontSize: '0.72rem' }}>
        Verified Instant WhatsApp OPD Pass Dispatch
      </Typography>
    </Box>
  );
};

export default InteractiveHeroCalendar;
