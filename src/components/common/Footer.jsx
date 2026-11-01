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

      {/* 2. SEPARATE DEDICATED SUB-FOOTER WITH ACTION BUTTON CLEARANCE SECTION */}
      <Box
        component="section"
        aria-label="Footer Bottom and Quick Access Dock"
        sx={{
          bgcolor: '#020B14',
          color: '#94A3B8',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          pt: { xs: 4, md: 5 },
          pb: { xs: 15, sm: 16, md: 18 }, // Generous clearance so floating buttons never cover text or links
          position: 'relative',
        }}
      >
        <Container maxWidth="xl">
          {/* Main Legal & Navigation Row */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 2.5,
              mb: 2.5,
            }}
          >
            {/* Copyright, Certified Standards & Beta-Labs Developer Showcase */}
            <Box sx={{ maxWidth: { xs: '100%', md: '750px' } }}>
              <Typography variant="body2" sx={{ color: '#E2E8F0', fontWeight: 600, mb: 0.5 }}>
                © {new Date().getFullYear()} {doctorProfile.name} Practice Center. All rights reserved.
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  flexWrap: 'wrap',
                  fontSize: '0.78rem',
                  mb: 1.75,
                }}
              >
                <span>HIPAA Compliant & NABH Standards</span>
                <span style={{ color: '#334155' }}>•</span>
                <span>256-Bit SSL Encrypted Medical Records</span>
                <span style={{ color: '#334155' }}>•</span>
                <span>Instant WhatsApp Confirmation Enabled</span>
              </Typography>

              {/* Beta-Labs Developer Showcase & Inbound Client Lead Generator */}
              <Box
                component="a"
                href="https://www.beta-labs.in"
                target="_blank"
                rel="noopener noreferrer"
                title="Beta-Labs | High-Performance Websites & AI Solutions"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  p: { xs: '7px 12px', sm: '6px 14px' },
                  borderRadius: { xs: '10px', sm: '9999px' },
                  bgcolor: 'rgba(56, 189, 248, 0.04)',
                  border: '1px solid rgba(56, 189, 248, 0.22)',
                  textDecoration: 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
                  flexWrap: 'wrap',
                  '&:hover': {
                    bgcolor: 'rgba(56, 189, 248, 0.1)',
                    borderColor: '#38BDF8',
                    boxShadow: '0 4px 18px rgba(56, 189, 248, 0.25)',
                    transform: 'translateY(-1px)',
                    '& .beta-arrow': {
                      transform: 'translateX(3px)',
                      color: '#38BDF8',
                    },
                  },
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 15, color: '#38BDF8' }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#94A3B8',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                  }}
                >
                  Engineered & Designed by{' '}
                  <strong style={{ color: '#38BDF8', fontWeight: 800, letterSpacing: '0.02em' }}>
                    Beta-Labs
                  </strong>
                </Typography>
                <span style={{ color: '#475569', display: { xs: 'none', sm: 'inline' } }}>•</span>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#F1F5F9',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  Want a website like this for your practice or business?{' '}
                  <span style={{ color: '#38BDF8', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 700 }}>
                    Build With Us
                  </span>
                  <span
                    className="beta-arrow"
                    style={{
                      display: 'inline-block',
                      transition: 'transform 0.2s ease',
                      color: '#38BDF8',
                      fontWeight: 800,
                    }}
                  >
                    →
                  </span>
                </Typography>
              </Box>
            </Box>

            {/* Legal Links & Admin Login */}
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
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
                |
              </Typography>

              <Button
                component={Link}
                to="/admin/login"
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                size="small"
                startIcon={<LockOutlinedIcon sx={{ fontSize: 14 }} />}
                sx={{
                  color: '#E2E8F0',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  px: 1.5,
                  py: 0.5,
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
          </Box>

          {/* Dedicated Visual Dock Section for the 3 Floating Buttons */}
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)', my: 2 }} />

          {/* Desktop/Tablet Dock Labels (perfectly aligned with the 3 floating buttons) */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 0.5,
            }}
          >
            {/* Left Hint (Aligned with WhatsApp Floating Button) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.74rem', letterSpacing: '0.02em', color: '#6EE7B7' }}>
                WhatsApp Reception Online
              </Typography>
            </Box>

            {/* Center Hint (Aligned with Call Doctor Floating Button) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.74rem', letterSpacing: '0.02em', color: '#7DD3FC' }}>
                Emergency Clinic Hotline: {doctorProfile.phone}
              </Typography>
            </Box>

            {/* Right Hint (Aligned with AI Chatbot Floating Button) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.74rem', letterSpacing: '0.02em', color: '#FDA4AF' }}>
                24/7 AI Smart Booking Assistant
              </Typography>
            </Box>
          </Box>

          {/* Mobile Dock Hint */}
          <Box sx={{ display: { xs: 'block', sm: 'none' }, textAlign: 'center', pt: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
              Tap the buttons below for instant WhatsApp, Call, or 24/7 AI Booking
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
