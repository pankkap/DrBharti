import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Stack,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import BiotechIcon from '@mui/icons-material/Biotech';
import SpaIcon from '@mui/icons-material/Spa';
import ShieldIcon from '@mui/icons-material/Shield';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarIcon from '@mui/icons-material/Star';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ShimmerBadge from '../../components/ui/ShimmerBadge';
import SpotlightCard from '../../components/ui/SpotlightCard';
import {
  AESTHETIC_CATEGORIES,
  AESTHETIC_TREATMENTS,
  AESTHETIC_PILLARS,
  AESTHETIC_FAQS,
} from '../../data/aestheticData';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const Aesthetic = () => {
  const { doctorProfile } = useApp();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalTreatment, setActiveModalTreatment] = useState(null);

  const filteredTreatments =
    selectedCategory === 'All'
      ? AESTHETIC_TREATMENTS
      : AESTHETIC_TREATMENTS.filter(
          (t) => t.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const handleBookTreatment = (treatment) => {
    navigate('/book-appointment', {
      state: {
        service: treatment.title,
        problem: `${treatment.title} Consultation`,
      },
    });
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <Box className="bg-mesh-subtle" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="xl">
        {/* 1. HERO SECTION */}
        <Box sx={{ textAlign: 'center', maxWidth: 900, mx: 'auto', mb: 7 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <ShimmerBadge
              icon={<AutoAwesomeIcon sx={{ fontSize: 16, color: '#E11D48', mr: 0.5 }} />}
              text="ADVANCED MEDICAL COSMETOLOGY & FACIAL HARMONIZATION"
              sx={{ mb: 2.5 }}
            />
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <Typography
              variant="h1"
              color="#0A2540"
              mb={2.5}
              sx={{
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' },
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
              }}
            >
              Reveal Your Natural Glow &{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                }}
              >
                Youthful Radiance
              </Box>
            </Typography>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: '1rem', md: '1.18rem' }, lineHeight: 1.75, mb: 4 }}
            >
              Dr. Bharti combines 16+ years of facial surgical anatomy with an accredited
              <strong> Fellowship in Medical Cosmetology</strong>. Explore non-invasive aesthetic treatments—from
              HydraFacial glow infusions and US-FDA Botox® to Hollywood laser peels and PRP hair restoration.
            </Typography>
          </motion.div>

          {/* Quick Stat Highlights */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 5 }}
            >
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  px: 3,
                  py: 1.25,
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(10, 37, 64, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                }}
              >
                <VerifiedIcon sx={{ color: '#E11D48', fontSize: 22 }} />
                <Typography variant="body2" fontWeight={700} color="#0A2540">
                  Doctor-Administered Injectables
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  px: 3,
                  py: 1.25,
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(10, 37, 64, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                }}
              >
                <ShieldIcon sx={{ color: '#10B981', fontSize: 22 }} />
                <Typography variant="body2" fontWeight={700} color="#0A2540">
                  100% US-FDA Approved Products
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  px: 3,
                  py: 1.25,
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(10, 37, 64, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                }}
              >
                <SpaIcon sx={{ color: '#F59E0B', fontSize: 22 }} />
                <Typography variant="body2" fontWeight={700} color="#0A2540">
                  Zero Downtime Protocols
                </Typography>
              </Box>
            </Stack>
          </motion.div>
        </Box>

        {/* 2. CATEGORY FILTER TABS */}
        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" gap={1} sx={{ mb: 6 }}>
          {AESTHETIC_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Box key={cat} sx={{ position: 'relative' }}>
                <Button
                  onClick={() => setSelectedCategory(cat)}
                  sx={{
                    borderRadius: 9999,
                    px: 3,
                    py: 1,
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    bgcolor: isSelected ? '#0A2540' : '#FFFFFF',
                    border: '1px solid',
                    borderColor: isSelected ? '#0A2540' : '#E2E8F0',
                    boxShadow: isSelected ? '0 4px 14px rgba(10, 37, 64, 0.2)' : 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: isSelected ? '#1E3A5F' : '#F1F5F9',
                    },
                  }}
                >
                  {cat}
                </Button>
              </Box>
            );
          })}
        </Stack>

        {/* 4. AESTHETIC TREATMENT CARDS GRID */}
        <Grid container spacing={3.5} alignItems="stretch" sx={{ mb: 10 }}>
          {filteredTreatments.map((treatment, index) => (
            <Grid item xs={12} sm={6} md={4} key={treatment.id} sx={{ display: 'flex' }}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={index}
                whileHover={{ y: -7 }}
                transition={{ duration: 0.25 }}
                style={{ height: '100%', width: '100%', display: 'flex' }}
              >
                <Card
                  sx={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: '24px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                    overflow: 'hidden',
                    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                    '&:hover': {
                      borderColor: 'rgba(225, 29, 72, 0.35)',
                      boxShadow: '0 16px 36px -8px rgba(10, 37, 64, 0.1)',
                    },
                  }}
                >
                  {/* Treatment Image with Badges */}
                  <Box sx={{ position: 'relative', overflow: 'hidden', height: 220 }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={treatment.image}
                      alt={treatment.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80';
                      }}
                      sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                        '&:hover': { transform: 'scale(1.05)' },
                      }}
                    />

                    {/* Gradient Overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(10, 37, 64, 0.5) 0%, transparent 60%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Category Floating Chip */}
                    <Chip
                      label={treatment.category}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 14,
                        left: 14,
                        bgcolor: 'rgba(10, 37, 64, 0.85)',
                        backdropFilter: 'blur(8px)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                      }}
                    />

                    {/* Duration Badge */}
                    <Chip
                      icon={<AccessTimeIcon sx={{ fontSize: '13px !important', color: '#E11D48 !important' }} />}
                      label={treatment.duration}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                        bgcolor: 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(8px)',
                        color: '#0A2540',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                      }}
                    />

                    {/* Downtime Pill on Image Bottom */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 14,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Chip
                        label={treatment.downtime}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.95)',
                          color: '#0A2540',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          height: 24,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Card Body */}
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Technology Badge */}
                    <Box sx={{ mb: 1.5 }}>
                      <Chip
                        icon={<BiotechIcon sx={{ fontSize: '14px !important', color: '#E11D48 !important' }} />}
                        label={treatment.technology}
                        size="small"
                        sx={{
                          bgcolor: '#fce5e5',
                          color: '#be185d',
                          border: '1px solid #fecdd3',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          maxWidth: '100%',
                        }}
                      />
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      color="#0A2540"
                      mb={0.5}
                      sx={{
                        minHeight: { xs: 'auto', sm: '3.2rem' },
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.25,
                      }}
                    >
                      {treatment.title}
                    </Typography>

                    {/* Tagline */}
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#E11D48',
                        fontWeight: 700,
                        display: 'block',
                        mb: 1.5,
                        fontSize: '0.78rem',
                      }}
                    >
                      {treatment.tagline}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.65,
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: { sm: '4.2rem' },
                      }}
                    >
                      {treatment.description}
                    </Typography>

                    {/* Ideal For Pill */}
                    <Box
                      sx={{
                        mb: 2,
                        p: 1.25,
                        borderRadius: '12px',
                        bgcolor: '#F8FAFC',
                        border: '1px solid #F1F5F9',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: '#64748B', fontWeight: 600, display: 'block', fontSize: '0.68rem' }}
                      >
                        TARGET CONCERNS:
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#0A2540', fontWeight: 700, fontSize: '0.76rem' }}>
                        {treatment.idealFor}
                      </Typography>
                    </Box>

                    {/* Clinical Features List */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 800,
                          color: '#334155',
                          display: 'block',
                          mb: 0.8,
                          fontSize: '0.72rem',
                          letterSpacing: '0.04em',
                        }}
                      >
                        CLINICAL HIGHLIGHTS:
                      </Typography>
                      <Stack spacing={0.6}>
                        {treatment.features.slice(0, 3).map((feat, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8 }}>
                            <CheckCircleIcon sx={{ fontSize: 14, color: '#E11D48', flexShrink: 0, mt: 0.2 }} />
                            <Typography
                              variant="caption"
                              sx={{ color: '#475569', fontSize: '0.74rem', lineHeight: 1.4 }}
                            >
                              {feat}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>

                    {/* Procedure Results & Protocol Line */}
                    <Box
                      sx={{
                        mt: 'auto',
                        pt: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px dashed #E2E8F0',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                          RESULTS:
                        </Typography>
                        <Typography variant="caption" fontWeight={700} color="#0A2540" sx={{ fontSize: '0.75rem' }}>
                          {treatment.results.split('(')[0].trim()}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        onClick={() => setActiveModalTreatment(treatment)}
                        startIcon={<InfoOutlinedIcon sx={{ fontSize: 15 }} />}
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#0A2540',
                          textTransform: 'none',
                          p: 0.5,
                          '&:hover': { bgcolor: '#F1F5F9' },
                        }}
                      >
                        Protocol
                      </Button>
                    </Box>
                  </CardContent>

                  {/* Actions Row */}
                  <Box sx={{ p: 3, pt: 0 }}>
                    <Stack direction="row" spacing={1.5}>
                      <Button
                        onClick={() => handleBookTreatment(treatment)}
                        variant="contained"
                        color="secondary"
                        fullWidth
                        startIcon={<CalendarMonthIcon />}
                        sx={{ py: 1.1, fontWeight: 700, fontSize: '0.88rem' }}
                      >
                        Book Consult
                      </Button>
                      <Button
                        component="a"
                        href={`https://wa.me/${doctorProfile.whatsappNumber}?text=${encodeURIComponent(
                          `Hi Dr. Bharti, I would like to inquire about ${treatment.title}.`
                        )}`}
                        target="_blank"
                        variant="outlined"
                        sx={{
                          minWidth: 44,
                          px: 1.5,
                          borderColor: '#CBD5E1',
                          color: '#25D366',
                          '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.08)', borderColor: '#25D366' },
                        }}
                        title="Chat on WhatsApp"
                      >
                        <WhatsAppIcon />
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* 5. THE 4 PILLARS OF AESTHETIC CARE */}
        <Box sx={{ mb: 10 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 6 }}>
            <ShimmerBadge text="OUR CLINICAL PHILOSOPHY" sx={{ mb: 2 }} />
            <Typography variant="h2" color="#0A2540" mb={1.5}>
              Why Choose Dr. Bharti For Medical Aesthetics?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We believe in non-surgical enhancement that honors your natural identity. No frozen expressions,
              no aggressive alterations—just radiant skin, restored facial volume, and effortless elegance.
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {AESTHETIC_PILLARS.map((pillar, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    height: '100%',
                    borderRadius: '20px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 16px rgba(10, 37, 64, 0.04)',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: '#E11D48',
                      boxShadow: '0 16px 32px -8px rgba(10, 37, 64, 0.08)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '14px',
                      bgcolor: '#fce5e5',
                      color: '#E11D48',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                    }}
                  >
                    <StarIcon />
                  </Box>
                  <Typography variant="h6" fontWeight={800} color="#0A2540" mb={1.5}>
                    {pillar.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                    {pillar.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 6. AESTHETIC FAQS ACCORDION */}
        <Box sx={{ maxWidth: 840, mx: 'auto', mb: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <ShimmerBadge text="FREQUENTLY ASKED QUESTIONS" sx={{ mb: 2 }} />
            <Typography variant="h2" color="#0A2540" mb={1.5}>
              Aesthetic Treatments & Safety
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Clear answers to the most common questions our patients ask regarding cosmetic injectables, laser peels,
              and skin protocols.
            </Typography>
          </Box>

          <Stack spacing={2}>
            {AESTHETIC_FAQS.map((faq, index) => (
              <Accordion
                key={index}
                elevation={0}
                sx={{
                  borderRadius: '16px !important',
                  border: '1px solid #E2E8F0',
                  bgcolor: '#FFFFFF',
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                  boxShadow: '0 2px 8px rgba(10, 37, 64, 0.02)',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#0A2540' }} />}
                  sx={{ px: 3, py: 1 }}
                >
                  <Typography variant="subtitle1" fontWeight={700} color="#0A2540">
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pt: 0, pb: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Box>

        {/* 7. BOTTOM VIP CONSULTATION CTA BANNER */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: '28px',
            bgcolor: '#06182A',
            color: '#FFFFFF',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 500,
              height: 300,
              background: 'radial-gradient(circle, rgba(225, 29, 72, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 700, mx: 'auto' }}>
            <ShimmerBadge text="CONFIDENTIAL AESTHETIC EVALUATION" sx={{ mb: 2 }} />
            <Typography variant="h2" color="#FFFFFF" fontWeight={800} mb={2}>
              Ready for a Refreshed, Confident You?
            </Typography>
            <Typography variant="body1" sx={{ color: '#94A3B8', lineHeight: 1.75, mb: 4 }}>
              Schedule a personalized facial assessment with Dr. Bharti at Greater Noida Aesthetic Clinic.
              Receive customized treatment mapping tailored to your specific skin tone, age, and beauty goals.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                component={Link}
                to="/book-appointment"
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<CalendarMonthIcon />}
                sx={{ py: 1.5, px: 4, fontWeight: 700, borderRadius: '12px' }}
              >
                Book Appointment Slot
              </Button>
              <Button
                component="a"
                href={`https://wa.me/${doctorProfile.whatsappNumber}?text=${encodeURIComponent(
                  'Hello Dr. Bharti, I would like to book a private aesthetic consultation.'
                )}`}
                target="_blank"
                variant="outlined"
                size="large"
                startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: 700,
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: '#25D366',
                    bgcolor: 'rgba(37, 211, 102, 0.12)',
                  },
                }}
              >
                WhatsApp Consultation
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>

      {/* 8. INTERACTIVE PROCEDURE PROTOCOL MODAL */}
      <Dialog
        open={Boolean(activeModalTreatment)}
        onClose={() => setActiveModalTreatment(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 1,
            bgcolor: '#FFFFFF',
          },
        }}
      >
        {activeModalTreatment && (
          <>
            <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 1,
              }}
            >
              <Box>
                <Chip
                  label={activeModalTreatment.category}
                  size="small"
                  sx={{ bgcolor: '#0A2540', color: '#FFF', fontWeight: 700, mb: 0.5 }}
                />
                <Typography variant="h5" fontWeight={800} color="#0A2540">
                  {activeModalTreatment.title}
                </Typography>
              </Box>
              <IconButton onClick={() => setActiveModalTreatment(null)} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
              {/* Image Preview */}
              <Box sx={{ borderRadius: '16px', overflow: 'hidden', mb: 2.5, height: 180 }}>
                <img
                  src={activeModalTreatment.image}
                  alt={activeModalTreatment.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>

              {/* Protocol Steps */}
              <Typography variant="subtitle2" fontWeight={800} color="#0A2540" mb={1.5}>
                CLINICAL PROTOCOL & STEP-BY-STEP PROCEDURE:
              </Typography>
              <Stack spacing={1} sx={{ mb: 2.5 }}>
                {activeModalTreatment.protocol?.map((step, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: 16, color: '#E11D48', mt: 0.2, flexShrink: 0 }} />
                    <Typography variant="body2" color="#334155" sx={{ fontSize: '0.85rem' }}>
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {/* Recovery & Results Box */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                      EXPECTED DOWNTIME:
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="#0A2540">
                      {activeModalTreatment.downtime}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                      RESULTS TIMELINE:
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="#0A2540">
                      {activeModalTreatment.results}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1.5 }}>
              <Button onClick={() => setActiveModalTreatment(null)} sx={{ color: '#64748B', fontWeight: 600 }}>
                Close
              </Button>
              <Button
                onClick={() => {
                  const treatment = activeModalTreatment;
                  setActiveModalTreatment(null);
                  handleBookTreatment(treatment);
                }}
                variant="contained"
                color="secondary"
                startIcon={<CalendarMonthIcon />}
                sx={{ px: 3, fontWeight: 700, borderRadius: '10px' }}
              >
                Book This Treatment
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Aesthetic;
