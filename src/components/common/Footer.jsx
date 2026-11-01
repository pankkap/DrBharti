import React from 'react';
import { Box, Container, Grid, Typography, Button, Divider, IconButton, Stack } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const Footer = () => {
  const { doctorProfile } = useApp();

  return (
    <>
      {/* 1. PRIMARY CLINICAL FOOTER */}
      <Box
        component="footer"
        sx={{
          bgcolor: '#06182A',
          color: '#E2E8F0',
          pt: { xs: 8, md: 10 },
          pb: { xs: 6, md: 8 },
          mt: { xs: 8, md: 12 },
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={5}>
            {/* Doctor Bio & Clinical Practice */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  component="img"
                  src="/assets/logo.png"
                  alt={doctorProfile.name}
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    objectFit: 'cover',
                    boxShadow: '0 4px 16px rgba(225, 29, 72, 0.4)',
                    bgcolor: '#FFF',
                    p: 0.25,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#FFF" sx={{ lineHeight: 1.1 }}>
                    {doctorProfile.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#FECDD3', fontWeight: 600 }}>
                    Reg: {doctorProfile.registrationNo}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.7, mb: 3 }}>
                {doctorProfile.bio}
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <IconButton
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.06)',
                    color: '#25D366',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: '#25D366', color: '#FFF' },
                  }}
                  href={`https://wa.me/${doctorProfile.whatsappNumber}`}
                  target="_blank"
                >
                  <WhatsAppIcon fontSize="small" />
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.06)',
                    color: '#E2E8F0',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: '#E11D48', color: '#FFF' },
                  }}
                  href={`tel:${doctorProfile?.phone ? doctorProfile.phone.replace(/[^+\d]/g, '') : ''}`}
                  title={`Call ${doctorProfile?.phone || 'Clinic'}`}
                >
                  <PhoneIcon fontSize="small" />
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.06)',
                    color: '#E2E8F0',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: '#E11D48', color: '#FFF' },
                  }}
                  href={`mailto:${doctorProfile.email}`}
                >
                  <EmailIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle1" fontWeight={700} color="#FFF" mb={2.5}>
                Patient Portal
              </Typography>
              <Stack spacing={1.5}>
                <Typography component={Link} to="/" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} variant="body2" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#F43F5E' } }}>
                  Home
                </Typography>
                <Typography component={Link} to="/about" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} variant="body2" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#F43F5E' } }}>
                  About Doctor
                </Typography>
                <Typography component={Link} to="/services" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} variant="body2" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#F43F5E' } }}>
                  Clinical Services
                </Typography>
                <Typography component={Link} to="/aesthetic" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} variant="body2" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#F43F5E' } }}>
                  Aesthetic & Cosmetology
                </Typography>
                <Typography component={Link} to="/book-appointment" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} variant="body2" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#F43F5E' } }}>
                  Book Appointment
                </Typography>
                <Typography component={Link} to="/testimonials" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} variant="body2" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#F43F5E' } }}>
                  Patient Reviews
                </Typography>
                <Typography component={Link} to="/faq" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} variant="body2" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#F43F5E' } }}>
                  Common FAQs
                </Typography>
                <Typography component={Link} to="/privacy-policy" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} variant="body2" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#F43F5E' } }}>
                  Privacy Policy
                </Typography>
              </Stack>
            </Grid>

            {/* Working Hours */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" fontWeight={700} color="#FFF" mb={2.5}>
                Consultation Hours
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <AccessTimeIcon sx={{ color: '#F43F5E', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="caption" color="#94A3B8" display="block">Monday - Friday (OPD)</Typography>
                    <Typography variant="body2" color="#FFF" fontWeight={600}>{doctorProfile.workingHours.weekdays}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <AccessTimeIcon sx={{ color: '#F43F5E', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="caption" color="#94A3B8" display="block">Saturday (Morning & Evening)</Typography>
                    <Typography variant="body2" color="#FFF" fontWeight={600}>{doctorProfile.workingHours.saturday}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <AccessTimeIcon sx={{ color: '#F59E0B', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="caption" color="#94A3B8" display="block">Sunday (Emergency Care)</Typography>
                    <Typography variant="body2" color="#FFF" fontWeight={600}>{doctorProfile.workingHours.sunday}</Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            {/* Clinic Location & Help */}
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" fontWeight={700} color="#FFF" mb={2.5}>
                Clinic Address
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <LocationOnIcon sx={{ color: '#F43F5E', fontSize: 22, mt: 0.2 }} />
                  <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
                    {doctorProfile.address}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <PhoneIcon sx={{ color: '#F43F5E', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                    {doctorProfile.phone}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <EmailIcon sx={{ color: '#F43F5E', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    {doctorProfile.email}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. SEPARATE DEDICATED SUB-FOOTER */}
      <Box
        component="section"
        aria-label="Footer Bottom Bar"
        sx={{
          bgcolor: '#020B14',
          color: '#94A3B8',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          pt: { xs: 3, md: 3.5 },
          pb: { xs: '84px', md: '98px' }, // Clearance so text is never covered by floating action buttons
          position: 'relative',
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={1.5} alignItems="center" textAlign="center">
            {/* 1. Legal Links & Staff Portal (Centered) */}
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" flexWrap="wrap">
              <Typography
                component={Link}
                to="/privacy-policy"
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                variant="caption"
                sx={{
                  color: '#94A3B8',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  transition: 'color 0.2s',
                  '&:hover': { color: '#F43F5E' },
                }}
              >
                Privacy & Data Policy
              </Typography>

              <Typography variant="caption" sx={{ color: '#334155' }}>
                •
              </Typography>

              <Button
                component={Link}
                to="/admin/login"
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                size="small"
                startIcon={<LockOutlinedIcon sx={{ fontSize: 13 }} />}
                sx={{
                  color: '#E2E8F0',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  px: 1.5,
                  py: 0.35,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(225, 29, 72, 0.15)',
                    borderColor: '#E11D48',
                    color: '#FFF',
                  },
                }}
              >
                Staff & Doctor Portal
              </Button>
            </Stack>

            {/* 2. Copyright (Centered) */}
            <Typography variant="body2" sx={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.85rem' }}>
              © {new Date().getFullYear()} {doctorProfile.name} Practice Center. All rights reserved.
            </Typography>

            {/* 3. Standards & Medical Compliance (Centered) */}
            <Typography
              variant="caption"
              sx={{
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                flexWrap: 'wrap',
                fontSize: '0.76rem',
              }}
            >
              <span>HIPAA Compliant & NABH Standards</span>
              <span style={{ color: '#334155' }}>•</span>
              <span>256-Bit SSL Encrypted Medical Records</span>
              <span style={{ color: '#334155' }}>•</span>
              <span>Instant WhatsApp Confirmation Enabled</span>
            </Typography>

            {/* 4. Beta-Labs Developer Showcase (Centered, Clean, without "Want a website" line) */}
            <Box
              component="a"
              href="https://www.beta-labs.in"
              target="_blank"
              rel="noopener noreferrer"
              title="Beta-Labs | www.beta-labs.in"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                px: 1.8,
                py: 0.5,
                borderRadius: '9999px',
                bgcolor: 'rgba(56, 189, 248, 0.04)',
                border: '1px solid rgba(56, 189, 248, 0.22)',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
                '&:hover': {
                  bgcolor: 'rgba(56, 189, 248, 0.12)',
                  borderColor: '#38BDF8',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 14px rgba(56, 189, 248, 0.2)',
                },
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 14, color: '#38BDF8' }} />
              <Typography
                variant="caption"
                sx={{
                  color: '#94A3B8',
                  fontSize: '0.76rem',
                  fontWeight: 500,
                }}
              >
                Developed by{' '}
                <strong style={{ color: '#38BDF8', fontWeight: 700 }}>
                  Beta-Labs
                </strong>{' '}
                <span style={{ color: '#64748B' }}>(www.beta-labs.in)</span>
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
