import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CursorSnackbar renders an ultra-modern snack notification directly at the
 * user's cursor / click position on screen when saving data or performing actions.
 */
const CursorSnackbar = ({
  open,
  message = 'Changes saved successfully!',
  title = 'Saved Successfully',
  severity = 'success',
  x = 0,
  y = 0,
  onClose,
  autoHideDuration = 3800,
}) => {
  const [coords, setCoords] = useState({ left: 20, top: 20 });

  useEffect(() => {
    if (open) {
      // Calculate clamped position so the snack stays fully within viewport
      const width = 340;
      const height = 75;
      
      // Center horizontally on cursor, float slightly above (y - 70)
      let targetLeft = x - width / 2;
      let targetTop = y - height - 15;

      // If clicked near top of screen, display below the cursor instead
      if (targetTop < 20) {
        targetTop = y + 25;
      }

      // Clamp within viewport
      const clampedLeft = Math.max(16, Math.min(window.innerWidth - width - 16, targetLeft));
      const clampedTop = Math.max(16, Math.min(window.innerHeight - height - 16, targetTop));

      setCoords({ left: clampedLeft, top: clampedTop });
    }
  }, [open, x, y]);

  useEffect(() => {
    if (open && autoHideDuration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  const getSeverityIcon = () => {
    switch (severity) {
      case 'error':
        return <ErrorOutlineIcon sx={{ color: '#EF4444', fontSize: 24 }} />;
      case 'info':
        return <InfoOutlinedIcon sx={{ color: '#0EA5E9', fontSize: 24 }} />;
      default:
        return <CheckCircleIcon sx={{ color: '#10B981', fontSize: 24 }} />;
    }
  };

  const getBorderColor = () => {
    switch (severity) {
      case 'error':
        return 'rgba(239, 68, 68, 0.45)';
      case 'info':
        return 'rgba(14, 165, 233, 0.45)';
      default:
        return 'rgba(16, 185, 129, 0.45)';
    }
  };

  const getGlowShadow = () => {
    switch (severity) {
      case 'error':
        return '0 12px 36px rgba(239, 68, 68, 0.35)';
      case 'info':
        return '0 12px 36px rgba(14, 165, 233, 0.35)';
      default:
        return '0 12px 36px rgba(16, 185, 129, 0.35)';
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.78, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -10 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
          style={{
            position: 'fixed',
            left: coords.left,
            top: coords.top,
            zIndex: 999999,
            pointerEvents: 'auto',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: { xs: 290, sm: 340 },
              p: 1.75,
              borderRadius: '18px',
              bgcolor: 'rgba(6, 24, 42, 0.94)',
              backdropFilter: 'blur(16px)',
              border: `1.5px solid ${getBorderColor()}`,
              boxShadow: `${getGlowShadow()}, 0 20px 45px -10px rgba(0,0,0,0.6)`,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Ambient accent pulse line on top */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background:
                  severity === 'error'
                    ? 'linear-gradient(90deg, #EF4444, #F87171)'
                    : 'linear-gradient(90deg, #10B981, #059669)',
              }}
            />

            {/* Icon with pulsing background circle */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                bgcolor:
                  severity === 'error'
                    ? 'rgba(239, 68, 68, 0.15)'
                    : 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {getSeverityIcon()}
            </Box>

            {/* Content */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={800}
                  sx={{ color: '#FFFFFF', lineHeight: 1.2, fontSize: '0.92rem' }}
                >
                  {title}
                </Typography>
                <AutoAwesomeIcon sx={{ fontSize: 13, color: '#10B981' }} />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#94A3B8',
                  lineHeight: 1.4,
                  fontSize: '0.78rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  fontWeight: 500,
                  mt: 0.3,
                }}
              >
                {message}
              </Typography>
            </Box>

            {/* Dismiss Button */}
            {onClose && (
              <IconButton
                size="small"
                onClick={onClose}
                sx={{
                  color: '#64748B',
                  p: 0.5,
                  '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            )}
          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CursorSnackbar;
