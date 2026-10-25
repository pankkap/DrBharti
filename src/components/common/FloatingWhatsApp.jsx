import React, { useState } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const FloatingWhatsApp = () => {
  const { doctorProfile } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const whatsappNumber = doctorProfile.whatsappNumber || '919876543210';
  const defaultMsg = encodeURIComponent(`Hello Dr. ${doctorProfile.name}, I would like to inquire about an appointment.`);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 20, md: 32 },
        left: { xs: 20, md: 32 },
        zIndex: isHovered ? 1500 : 1200,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.a
        href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        style={{
          width: 58,
          height: 58,
          borderRadius: '50%',
          backgroundColor: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFF',
          boxShadow: '0 10px 25px rgba(37, 211, 102, 0.45)',
          textDecoration: 'none',
          position: 'relative',
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 34, color: '#FFF' }} />
        <Box
          sx={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 14,
            height: 14,
            bgcolor: '#10B981',
            borderRadius: '50%',
            border: '2px solid #FFF',
          }}
          className="live-dot"
        />
      </motion.a>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: '#06182A',
              color: '#FFF',
              padding: '8px 14px',
              borderRadius: '12px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5), 0 0 20px rgba(37, 211, 102, 0.25)',
              border: '1px solid rgba(255,255,255,0.18)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              zIndex: 1600,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#25D366', display: 'block' }}>
              WhatsApp Reception Online
            </Typography>
            <Typography variant="caption" sx={{ color: '#E2E8F0', fontSize: '0.75rem' }}>
              Direct line to {doctorProfile?.name ? (doctorProfile.name.startsWith('Dr.') ? doctorProfile.name : `Dr. ${doctorProfile.name}`) : 'Doctor'}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default FloatingWhatsApp;
