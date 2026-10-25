import React from 'react';
import { Box, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import SecurityIcon from '@mui/icons-material/Security';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const TRUST_ITEMS = [
  { icon: <VerifiedIcon sx={{ fontSize: 18, color: '#E11D48' }} />, text: 'Dental Council of India Registered' },
  { icon: <StarIcon sx={{ fontSize: 18, color: '#F59E0B' }} />, text: '4.95 / 5.0 Rating (500+ Reviews)' },
  { icon: <WhatsAppIcon sx={{ fontSize: 18, color: '#25D366' }} />, text: 'Instant Automated WhatsApp Passes' },
  { icon: <SecurityIcon sx={{ fontSize: 18, color: '#0A2540' }} />, text: 'HIPAA & ISO 27001 Data Security' },
  { icon: <AccessTimeIcon sx={{ fontSize: 18, color: '#E11D48' }} />, text: '< 5-Minute Reception OPD Wait Time' },
  { icon: <MedicalServicesIcon sx={{ fontSize: 18, color: '#0A2540' }} />, text: '15,000+ Successful Patient Consults' },
];

export const MarqueeTicker = () => {
  return (
    <Box
      sx={{
        py: 2,
        overflow: 'hidden',
        position: 'relative',
        bgcolor: '#FFFFFF',
        borderTop: '1px solid rgba(226, 232, 240, 0.8)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <Box
        className="marquee-track"
        sx={{
          display: 'flex',
          gap: 6,
          width: 'max-content',
          animation: 'marqueeScroll 28s linear infinite',
          '&:hover': {
            animationPlayState: 'paused',
          },
        }}
      >
        {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              whiteSpace: 'nowrap',
              px: 2,
            }}
          >
            {item.icon}
            <Typography variant="body2" fontWeight={700} color="#0A2540" sx={{ fontSize: '0.88rem' }}>
              {item.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MarqueeTicker;
