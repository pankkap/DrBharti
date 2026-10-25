import React, { useEffect, useState, useRef } from 'react';
import { Typography } from '@mui/material';
import { useInView } from 'framer-motion';

export const AnimatedCounter = ({
  from = 0,
  to,
  duration = 1.8,
  decimals = 0,
  suffix = '',
  prefix = '',
  color = '#0A2540',
  variant = 'h2',
  fontWeight = 900,
  sx = {},
}) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Ease out expo formula
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = from + (to - from) * easeOut;
      
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, from, to, duration]);

  const formatted = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString();

  return (
    <Typography
      ref={ref}
      variant={variant}
      sx={{
        fontWeight: fontWeight,
        color: color,
        lineHeight: 1.1,
        ...sx,
      }}
    >
      {prefix}
      {formatted}
      {suffix}
    </Typography>
  );
};

export default AnimatedCounter;
