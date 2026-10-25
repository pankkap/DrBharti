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
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const Footer = () => {
  const { doctorProfile } = useApp();

  return (
    <Box sx={{ bgcolor: '#06182A', color: '#E2E8F0', pt: 10, pb: 6, mt: 12, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
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

        <Divider sx={{ my: 5, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" color="#64748B">
            © {new Date().getFullYear()} {doctorProfile.name} Practice Center. All medical data is HIPAA compliant & verified. Instant WhatsApp confirmation enabled.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography component={Link} to="/privacy-policy" variant="caption" color="#64748B" sx={{ textDecoration: 'none', '&:hover': { color: '#FFF' } }}>
              Privacy & Data Policy
            </Typography>
            <Typography component={Link} to="/admin/login" variant="caption" color="#64748B" sx={{ textDecoration: 'none', '&:hover': { color: '#FFF' } }}>
              Staff & Doctor Portal
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
