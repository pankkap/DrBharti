import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export const ShimmerBadge = ({
  icon,
  text,
  badgeColor = '#BE123C',
  bgColor = 'rgba(225, 29, 72, 0.08)',
  borderColor = 'rgba(225, 29, 72, 0.25)',
  onClick,
  sx = {},
}) => {
  return (
    <Box
      component={motion.div}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.25,
        px: 2.2,
        py: 0.85,
        borderRadius: 9999,
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 2px 10px rgba(225, 29, 72, 0.1)',
        ...sx,
      }}
    >
      {/* Moving Shimmer Sheen */}
      <Box
        className="shimmer-sheen"
        sx={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '60%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
          transform: 'skewX(-20deg)',
          animation: 'shimmerSlide 3.5s infinite ease-in-out',
        }}
      />
      {icon && <Box sx={{ display: 'flex', alignItems: 'center', color: badgeColor }}>{icon}</Box>}
      <Typography
        variant="caption"
        sx={{
          color: badgeColor,
          fontWeight: 700,
          fontSize: '0.84rem',
          letterSpacing: '-0.01em',
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default ShimmerBadge;
