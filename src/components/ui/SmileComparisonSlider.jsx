import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Typography, Chip, Paper, IconButton } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VerifiedIcon from '@mui/icons-material/Verified';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SparklesIcon from '@mui/icons-material/Star';

const SmileComparisonSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleInteractionStart = (clientX) => {
    setIsDragging(true);
    handleMove(clientX);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 4 },
        borderRadius: '32px',
        bgcolor: '#FFFFFF',
        border: '1px solid rgba(225, 29, 72, 0.16)',
        boxShadow: '0 25px 50px -12px rgba(10, 37, 64, 0.08)',
        maxWidth: 960,
        mx: 'auto',
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3.5 }}>
        <Chip
          icon={<AutoAwesomeIcon sx={{ fontSize: '14px !important', color: '#E11D48 !important' }} />}
          label="REAL CLINICAL TRANSFORMATIONS"
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: '0.72rem',
            letterSpacing: '0.05em',
            bgcolor: '#fce5e5',
            color: '#be185d',
            border: '1px solid #fecdd3',
            mb: 1.2,
          }}
        />
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0A2540', fontSize: { xs: '1.6rem', md: '2.2rem' }, mb: 1 }}>
          Interactive Smile Restoration Results
        </Typography>
        <Typography variant="body2" sx={{ color: '#475569', maxWidth: 620, mx: 'auto', fontSize: '0.92rem' }}>
          Drag the interactive slider to see the dramatic before-and-after smile makeover achieved with custom porcelain veneers & laser whitening.
        </Typography>
      </Box>

      {/* Interactive Slider Canvas Container */}
      <Box
        ref={containerRef}
        onMouseDown={(e) => handleInteractionStart(e.clientX)}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX)}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsDragging(false)}
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 260, sm: 380, md: 440 },
          borderRadius: '24px',
          overflow: 'hidden',
          cursor: 'ew-resize',
          userSelect: 'none',
          boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
        }}
      >
        {/* "AFTER" Image (Full background) */}
        <Box
          component="img"
          src="/assets/treatments/teeth_after.jpg"
          alt="Perfect Aligned White Teeth After Treatment"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* "AFTER" Overlay Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 18,
            right: 18,
            bgcolor: 'rgba(16, 185, 129, 0.92)',
            color: '#FFFFFF',
            backdropFilter: 'blur(8px)',
            py: 0.6,
            px: 1.6,
            borderRadius: 3,
            fontWeight: 800,
            fontSize: '0.78rem',
            letterSpacing: '0.04em',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 0.6,
          }}
        >
          <VerifiedIcon sx={{ fontSize: 16 }} /> AFTER: APEX SMILE DESIGN
        </Box>

        {/* "BEFORE" Masked Image (Clipped by slider position) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${sliderPosition}%`,
            height: '100%',
            overflow: 'hidden',
            borderRight: '3px solid #FFFFFF',
            boxShadow: '5px 0 15px rgba(0,0,0,0.25)',
          }}
        >
          <Box
            component="img"
            src="/assets/treatments/teeth_before.jpg"
            alt="Before Dental Treatment"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: containerWidth ? `${containerWidth}px` : (containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw'),
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* "BEFORE" Badge */}
          <Box
            sx={{
              position: 'absolute',
              top: 18,
              left: 18,
              bgcolor: 'rgba(15, 23, 42, 0.85)',
              color: '#FFFFFF',
              backdropFilter: 'blur(8px)',
              py: 0.6,
              px: 1.6,
              borderRadius: 3,
              fontWeight: 800,
              fontSize: '0.78rem',
              letterSpacing: '0.04em',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            BEFORE: WEAR & DISCOLORATION
          </Box>
        </Box>

        {/* Divider Slider Handle Line & Knob */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPosition}%`,
            transform: 'translateX(-50%)',
            width: '4px',
            bgcolor: '#FFFFFF',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: '#E11D48',
              border: '3px solid #FFFFFF',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(225, 29, 72, 0.5), 0 0 0 4px rgba(255,255,255,0.4)',
              cursor: 'ew-resize',
              transition: 'transform 0.15s ease',
              transform: isDragging ? 'scale(1.15)' : 'scale(1)',
            }}
          >
            <CompareArrowsIcon sx={{ fontSize: 22 }} />
          </Box>
        </Box>
      </Box>

      {/* Clinical Highlights Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
          mt: 3,
          pt: 3,
          borderTop: '1px solid #F1F5F9',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#E11D48' }}>
            8 Shades
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
            Lighter Enamel in 45 Mins
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#E11D48' }}>
            0.2 mm
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
            Minimal Enamel Prep Veneers
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#E11D48' }}>
            Lifetime
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
            Implant Structural Warranty
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default SmileComparisonSlider;
