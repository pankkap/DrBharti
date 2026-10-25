import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(225, 29, 72, 0.14)',
  borderColor = 'rgba(225, 29, 72, 0.35)',
  sx = {},
  ...props
}) => {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <Box
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      component={motion.div}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      sx={{
        position: 'relative',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
        '&:hover': {
          borderColor: borderColor,
          boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.08)',
        },
        ...sx,
      }}
      {...props}
    >
      {/* Spotlight Radial Follower */}
      <Box
        sx={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          opacity: opacity,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(450px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
          zIndex: 1,
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 2 }}>{children}</Box>
    </Box>
  );
};

export default SpotlightCard;
