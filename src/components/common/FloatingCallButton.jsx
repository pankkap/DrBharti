import React, { useState } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const FloatingCallButton = () => {
  const { doctorProfile } = useApp() || {};
  const [isHovered, setIsHovered] = useState(false);

  // Pick phone number from saved Doctor Clinic Configuration
  const rawPhone = doctorProfile?.phone || '+91 97292 80731';
  const cleanPhone = rawPhone.replace(/[^+\d]/g, '');

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 20, md: 32 },
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={() => setIsHovered(false)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tooltip title={`Call Clinic Directly: ${rawPhone}`} arrow placement="top">
        <motion.a
          href={`tel:${cleanPhone}`}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0F4C81 0%, #0284C7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 10px 25px rgba(15, 76, 129, 0.45)',
            textDecoration: 'none',
            position: 'relative',
            border: '2px solid rgba(255, 255, 255, 0.25)',
          }}
          aria-label="Call Doctor Directly"
        >
          <PhoneInTalkIcon sx={{ fontSize: 28, color: '#FFFFFF' }} />

          {/* Micro status dot */}
          <Box
            sx={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 14,
              height: 14,
              bgcolor: '#38BDF8',
              borderRadius: '50%',
              border: '2px solid #FFFFFF',
            }}
          />
        </motion.a>
      </Tooltip>
    </Box>
  );
};

export default FloatingCallButton;
