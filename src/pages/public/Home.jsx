import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  Stack,
  Rating,
  Divider,
  CardMedia,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VerifiedIcon from '@mui/icons-material/Verified';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import StarIcon from '@mui/icons-material/Star';
import ShieldIcon from '@mui/icons-material/Shield';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

// High-End UI Components
import SpotlightCard from '../../components/ui/SpotlightCard';
import ShimmerBadge from '../../components/ui/ShimmerBadge';
import MarqueeTicker from '../../components/ui/MarqueeTicker';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import DentalJaw3DViewer from '../../components/ui/DentalJaw3DViewer';
import SmileComparisonSlider from '../../components/ui/SmileComparisonSlider';
import AnnualHealthPlanModal from '../../components/common/AnnualHealthPlanModal';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const Home = () => {
  const { doctorProfile, services, testimonials, gallery } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeGalleryCategory, setActiveGalleryCategory] = useState('All');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isAnnualPlanModalOpen, setIsAnnualPlanModalOpen] = useState(false);

  // Dynamic calling phone number from saved Doctor Clinic Configuration
  const clinicDisplayPhone = doctorProfile?.phone || '';
  const clinicDialNumber = clinicDisplayPhone.replace(/[^+\d]/g, '');

  const categories = ['All', 'Implantology', 'Orthodontics', 'Cosmetic', 'Endodontics', 'Preventative'];
  const galleryCategories = ['All', 'Operatory', 'Technology', 'Radiology', 'Hygiene', 'Lounge', 'Surgery'];

  const filteredServices =
    activeCategory === 'All'
      ? services.slice(0, 6)
      : services.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  const clinicGallery = gallery && gallery.length > 0 ? gallery : [];
  const filteredGallery =
    activeGalleryCategory === 'All'
      ? clinicGallery
      : clinicGallery.filter((g) => g.category?.toLowerCase() === activeGalleryCategory.toLowerCase());

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* 1. HERO SECTION - 3D DENTAL JAW 360° SHOWCASE */}
      <Box
        className="bg-mesh-subtle"
        sx={{
          pt: { xs: 6, md: 9 },
          pb: { xs: 8, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Aurora Glows */}
        <Box className="aurora-glow-1" />
        <Box className="aurora-glow-2" />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 3 }}>
          <Grid container spacing={{ xs: 5, lg: 6 }} alignItems="center">
            {/* Hero Left Content */}
            <Grid item xs={12} lg={6}>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                <ShimmerBadge
                  icon={<span className="live-dot" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#E11D48', marginRight: 4 }} />}
                  text="GREATER NOIDA AESTHETIC DENTAL CLINIC • ADVANCED COSMETOLOGY ACTIVE"
                  sx={{ mb: 2.5 }}
                />
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                <Typography
                  variant="h1"
                  sx={{
                    color: '#0A2540',
                    fontSize: { xs: '2.4rem', sm: '3.3rem', md: '3.8rem' },
                    fontWeight: 900,
                    lineHeight: 1.08,
                    letterSpacing: '-0.03em',
                    mb: 2.5,
                  }}
                >
                  Sculpting Your Most Confident,{' '}
                  <Box
                    component="span"
                    className="text-gradient-teal"
                    sx={{
                      display: 'inline-block',
                      position: 'relative',
                    }}
                  >
                    Radiant Smile
                  </Box>
                  .
                </Typography>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#475569',
                    fontSize: { xs: '1.05rem', md: '1.2rem' },
                    lineHeight: 1.7,
                    maxWidth: 580,
                    mb: 4,
                  }}
                >
                  Consult directly with <strong>{doctorProfile.name}</strong> ({doctorProfile.qualification || 'MDS - Prosthodontics & Oral Implantology'}). Experience painless single-visit dental implants, invisible aligners, porcelain veneers, and verified WhatsApp booking passes.
                </Typography>
              </motion.div>

              {/* Action Button Row */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
                  <Button
                    component={Link}
                    to="/book-appointment"
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<CalendarMonthIcon />}
                    sx={{
                      py: 1.8,
                      px: 3.8,
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      boxShadow: '0 12px 30px rgba(225, 29, 72, 0.35)',
                    }}
                  >
                    Book Consultation Slot
                  </Button>

                  <Button
                    component="a"
                    href={clinicDialNumber ? `tel:${clinicDialNumber}` : '#'}
                    title={clinicDisplayPhone ? `Call Clinic: ${clinicDisplayPhone}` : 'Call Clinic'}
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={<PhoneIcon sx={{ color: '#E11D48' }} />}
                    sx={{
                      py: 1.8,
                      px: 3.5,
                      fontSize: '1.02rem',
                      fontWeight: 700,
                      bgcolor: '#FFFFFF',
                      borderColor: '#CBD5E1',
                      color: '#0A2540',
                      '&:hover': {
                        borderColor: '#E11D48',
                        bgcolor: 'rgba(225, 29, 72, 0.04)',
                      },
                    }}
                  >
                    Call Clinic
                  </Button>
                </Stack>
              </motion.div>

              {/* Real-time Trust Statistics Counter */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
                <Grid container spacing={2.5} sx={{ pt: 2, borderTop: '1px solid rgba(226, 232, 240, 0.9)' }}>
                  <Grid item xs={4}>
                    <AnimatedCounter to={15000} suffix="+" prefix="" color="#0A2540" />
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mt: 0.5 }}>
                      Smiles Restored
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <AnimatedCounter to={4.98} decimals={2} suffix="★" color="#E11D48" />
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mt: 0.5 }}>
                      Rating (850+ Reviews)
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <AnimatedCounter to={100} suffix="%" prefix="" color="#0A2540" />
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mt: 0.5 }}>
                      Painless Computer Anesthesia
                    </Typography>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>

            {/* Hero Right - 360° Interactive 3D Dental Jaw Viewer */}
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <DentalJaw3DViewer />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. SEAMLESS MARQUEE TICKER */}
      <MarqueeTicker />

      {/* 2.5 INTERACTIVE BEFORE & AFTER SMILE MAKEOVER SLIDER */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
        <Container maxWidth="xl">
          <SmileComparisonSlider />
        </Container>
      </Box>

      {/* 3. BENTO GRID - WHY PATIENTS CHOOSE THIS PRACTICE */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', maxWidth: 780, mx: 'auto', mb: 8 }}>
            <ShimmerBadge text="AESTHETIC & SURGICAL EXCELLENCE" sx={{ mb: 2 }} />
            <Typography variant="h2" color="#0A2540" mb={2}>
              Crafted for Comfort, Precision & Lifetime Smiles
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.15rem' }}>
              We combine German CAD/CAM 3D scanning, computer-guided surgical navigation, and gentle pain-free protocols for an unparalleled dental experience.
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {/* Bento Tile 1: Senior Consultant Credential & Operatory Suite */}
            <Grid item xs={12} md={7}>
              <SpotlightCard sx={{ p: { xs: 3.5, sm: 4.5 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        bgcolor: 'rgba(225, 29, 72, 0.1)',
                        color: '#E11D48',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <VerifiedIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Chip label="16+ Years • ICOI Fellow (USA)" size="small" sx={{ bgcolor: '#F1F5F9', fontWeight: 700 }} />
                  </Box>
                  <Typography variant="h4" color="#0A2540" fontWeight={800} mb={1.5}>
                    Board Certified Prosthodontics & Implant Specialist
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2.5 }}>
                    Direct one-on-one evaluations with {doctorProfile.name}. Utilizing 3D CBCT imaging, high-resolution intraoral scanning, and precision digital treatment simulations before starting any procedure.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
                    <Chip icon={<CheckCircleIcon sx={{ fontSize: 16, color: '#E11D48 !important' }} />} label="Fellow ICOI (USA)" sx={{ bgcolor: '#F8FAFC' }} />
                    <Chip icon={<CheckCircleIcon sx={{ fontSize: 16, color: '#E11D48 !important' }} />} label="3D Computer Guided Surgery" sx={{ bgcolor: '#F8FAFC' }} />
                    <Chip icon={<CheckCircleIcon sx={{ fontSize: 16, color: '#E11D48 !important' }} />} label="German CAD/CAM Zirconia" sx={{ bgcolor: '#F8FAFC' }} />
                  </Box>
                </Box>

                {/* Clinic Operatory Photo Accent */}
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: { xs: 150, sm: 175 },
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    mt: 1,
                  }}
                >
                  <CardMedia
                    component="img"
                    image="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80"
                    alt="Private VIP Operatory Suite"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      '&:hover': { transform: 'scale(1.04)' },
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 35%, rgba(10,37,64,0.85) 100%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      p: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.85rem' }}>
                        Private Operatory Suite A • Ceiling 4K Relaxation Displays
                      </Typography>
                      <Chip label="ISO 9001 Operatory" size="small" sx={{ bgcolor: 'rgba(225, 29, 72, 0.9)', color: '#FFFFFF', fontWeight: 700, fontSize: '0.68rem' }} />
                    </Box>
                  </Box>
                </Box>
              </SpotlightCard>
            </Grid>

            {/* Bento Tile 2: Doctor Portrait & Credential Badge */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: 'relative',
                  height: '100%',
                  minHeight: { xs: 360, md: 440 },
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid rgba(225, 29, 72, 0.25)',
                  boxShadow: '0 20px 45px -10px rgba(10, 37, 64, 0.12)',
                  bgcolor: '#FFFFFF',
                }}
              >
                <CardMedia
                  component="img"
                  image={doctorProfile.avatar}
                  alt={doctorProfile.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 20%',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    '&:hover': { transform: 'scale(1.03)' },
                  }}
                />

                {/* Subtle gradient vignette at bottom for contrast */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 55%, rgba(10, 37, 64, 0.75) 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Floating Credential Chip */}
                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    bottom: { xs: 16, sm: 20 },
                    left: { xs: 16, sm: 20 },
                    right: { xs: 16, sm: 20 },
                    p: 2,
                    borderRadius: '20px',
                    bgcolor: 'rgba(10, 37, 64, 0.92)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: '#E11D48',
                      color: '#FFFFFF',
                      width: 44,
                      height: 44,
                      boxShadow: '0 4px 14px rgba(225, 29, 72, 0.45)',
                    }}
                  >
                    <MilitaryTechIcon sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} color="#FFFFFF" sx={{ fontSize: '0.94rem' }}>
                      Fellow ICOI (USA)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#FDA4AF', fontWeight: 600, display: 'block', fontSize: '0.78rem' }}>
                      Highest International Implant Credential
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>

            {/* Bento Tile 3: 100% Pain-Free Gentle Protocol */}
            <Grid item xs={12} md={4}>
              <SpotlightCard sx={{ p: 4, height: '100%' }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: 'rgba(10, 37, 64, 0.08)', color: '#0A2540', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <HealthAndSafetyIcon sx={{ fontSize: 24 }} />
                </Box>
                <Typography variant="h5" fontWeight={800} color="#0A2540" mb={1}>
                  100% Painless Anesthesia
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Computer-delivered micro-dose local anesthesia and optional nitrous oxide sedation eliminate dental anxiety and needle sensation.
                </Typography>
              </SpotlightCard>
            </Grid>

            {/* Bento Tile 4: Single-Visit Microscopic Care */}
            <Grid item xs={12} md={4}>
              <SpotlightCard sx={{ p: 4, height: '100%' }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: 'rgba(217, 119, 6, 0.1)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <AccessTimeIcon sx={{ fontSize: 24 }} />
                </Box>
                <Typography variant="h5" fontWeight={800} color="#0A2540" mb={1}>
                  Single-Visit Restorations
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Same-day crowns and laser-assisted rotary root canals completed in one relaxing session without multiple messy impressions.
                </Typography>
              </SpotlightCard>
            </Grid>

            {/* Bento Tile 5: Clear Transparent Pricing */}
            <Grid item xs={12} md={4}>
              <SpotlightCard sx={{ p: 4, height: '100%' }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: 'rgba(225, 29, 72, 0.1)', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <ShieldIcon sx={{ fontSize: 24 }} />
                </Box>
                <Typography variant="h5" fontWeight={800} color="#0A2540" mb={1}>
                  Transparent Pricing & Warranty
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  All implant fixtures and ceramic crowns include official serial certificates and lifetime structural warranties with upfront published pricing.
                </Typography>
              </SpotlightCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 4. CLINICAL SPECIALTIES CATALOG */}
      <Box className="bg-mesh-subtle" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, mb: 6, gap: 2 }}>
            <Box>
              <ShimmerBadge text="CORE CLINICAL DOMAINS" sx={{ mb: 1.5 }} />
              <Typography variant="h2" color="#0A2540">
                Specialized Treatments & Procedures
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/services"
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              sx={{ fontWeight: 700 }}
            >
              View Full Clinical Catalog ({services.length})
            </Button>
          </Box>

          {/* Category Filter Chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 5 }}>
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <Button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  sx={{
                    borderRadius: 9999,
                    px: 3,
                    py: 0.9,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    bgcolor: isSelected ? '#0A2540' : '#FFFFFF',
                    border: '1px solid',
                    borderColor: isSelected ? '#0A2540' : '#E2E8F0',
                    boxShadow: isSelected ? '0 4px 14px rgba(10, 37, 64, 0.2)' : 'none',
                    '&:hover': {
                      bgcolor: isSelected ? '#1E3A5F' : '#F1F5F9',
                    },
                  }}
                >
                  {cat}
                </Button>
              );
            })}
          </Stack>

          {/* Service Cards Grid */}
          <Grid container spacing={3.5} alignItems="stretch">
            {filteredServices.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id} sx={{ display: 'flex' }}>
                <SpotlightCard
                  sx={{
                    p: 3,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    {/* Clinical Procedure Photo */}
                    <Box
                      sx={{
                        position: 'relative',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        mb: 2.5,
                        height: 190,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="190"
                        image={service.image || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80"}
                        alt={service.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80";
                        }}
                        sx={{
                          height: '100%',
                          width: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.45s ease',
                          '&:hover': { transform: 'scale(1.06)' },
                        }}
                      />
                      <Chip
                        label={service.category}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          bgcolor: 'rgba(10, 37, 64, 0.85)',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          backdropFilter: 'blur(6px)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                        }}
                      />
                      {service.duration && (
                        <Chip
                          icon={<AccessTimeIcon sx={{ fontSize: '13px !important', color: '#E11D48 !important' }} />}
                          label={service.duration}
                          size="small"
                          sx={{
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            bgcolor: 'rgba(255, 255, 255, 0.92)',
                            color: '#0A2540',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            backdropFilter: 'blur(6px)',
                          }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant="h5"
                      fontWeight={800}
                      color="#0A2540"
                      mb={1.2}
                      sx={{
                        minHeight: { xs: 'auto', sm: '3.6rem' },
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.25,
                      }}
                    >
                      {service.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.7,
                        mb: 3,
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: { sm: '4.8rem' },
                      }}
                    >
                      {service.description}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    {service.isAnnualPlan || service.id === 'serv-9' ? (
                      <Button
                        onClick={() => setIsAnnualPlanModalOpen(true)}
                        variant="contained"
                        fullWidth
                        startIcon={<CardMembershipIcon sx={{ color: '#F59E0B' }} />}
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          py: 1.2,
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          bgcolor: '#0A2540',
                          color: '#FFFFFF',
                          boxShadow: '0 4px 14px rgba(10, 37, 64, 0.25)',
                          '&:hover': { bgcolor: '#E11D48' },
                        }}
                      >
                        View Plan Details ✨
                      </Button>
                    ) : (
                      <Button
                        component={Link}
                        to="/book-appointment"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        endIcon={<ArrowForwardIcon />}
                        sx={{ py: 1.2, fontWeight: 700 }}
                      >
                        Book Slot
                      </Button>
                    )}
                  </Box>
                </SpotlightCard>
              </Grid>
            ))}
          </Grid>

          {/* Dedicated Annual Health Plan Interactive Modal Component */}
          <AnnualHealthPlanModal
            open={isAnnualPlanModalOpen}
            onClose={() => setIsAnnualPlanModalOpen(false)}
          />
        </Container>
      </Box>

      {/* 5. STATE-OF-THE-ART DENTAL STUDIO TOUR & OPERATORY GALLERY */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', maxWidth: 840, mx: 'auto', mb: 6 }}>
            <ShimmerBadge
              icon={<PhotoLibraryIcon sx={{ fontSize: 16, mr: 0.5, color: '#E11D48' }} />}
              text="HOSPITAL-GRADE CLINICAL INFRASTRUCTURE"
              sx={{ mb: 2 }}
            />
            <Typography variant="h2" color="#0A2540" mb={2}>
              State-of-the-Art Dental Studio Tour
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.15rem' }}>
              Step inside Greater Noida Aesthetic Dental Clinic. Explore our surgical operatories, in-house CAD/CAM 3D milling lab, ultra-low dose CBCT diagnostic suite, and sterilized facilities designed for ultimate patient comfort.
            </Typography>
          </Box>

          {/* Category Filter Pills */}
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" gap={1} sx={{ mb: 6 }}>
            {galleryCategories.map((cat) => {
              const isSelected = activeGalleryCategory === cat;
              return (
                <Button
                  key={cat}
                  onClick={() => setActiveGalleryCategory(cat)}
                  sx={{
                    borderRadius: 9999,
                    px: 2.8,
                    py: 0.8,
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    bgcolor: isSelected ? '#E11D48' : '#F8FAFC',
                    border: '1px solid',
                    borderColor: isSelected ? '#E11D48' : '#E2E8F0',
                    boxShadow: isSelected ? '0 4px 12px rgba(225, 29, 72, 0.25)' : 'none',
                    '&:hover': {
                      bgcolor: isSelected ? '#BE123C' : '#F1F5F9',
                    },
                  }}
                >
                  {cat}
                </Button>
              );
            })}
          </Stack>

          {/* Clinic Photo Grid */}
          <Grid container spacing={3.5}>
            {filteredGallery.map((facility) => (
              <Grid item xs={12} sm={6} md={4} key={facility.id}>
                <SpotlightCard
                  onClick={() => setSelectedFacility(facility)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 18px 36px rgba(10, 37, 64, 0.12)',
                    },
                  }}
                >
                  {/* Photo Container */}
                  <Box sx={{ position: 'relative', height: 230, overflow: 'hidden', borderRadius: '18px 18px 0 0' }}>
                    <CardMedia
                      component="img"
                      height="230"
                      image={facility.imageUrl}
                      alt={facility.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        '&:hover': { transform: 'scale(1.07)' },
                      }}
                    />
                    <Chip
                      label={facility.category}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 14,
                        left: 14,
                        bgcolor: 'rgba(10, 37, 64, 0.85)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        bgcolor: 'rgba(255, 255, 255, 0.92)',
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                        backdropFilter: 'blur(4px)',
                        color: '#0A2540',
                      }}
                    >
                      <ZoomInIcon sx={{ fontSize: 20 }} />
                    </Box>
                  </Box>

                  {/* Details */}
                  <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h5" color="#0A2540" fontWeight={800} mb={1.2}>
                        {facility.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
                        {facility.description}
                      </Typography>
                    </Box>

                    <Button
                      size="small"
                      variant="text"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                      sx={{ color: '#E11D48', fontWeight: 700, p: 0, justifyContent: 'flex-start', '&:hover': { bgcolor: 'transparent', color: '#BE123C' } }}
                    >
                      Inspect Facility Details
                    </Button>
                  </Box>
                </SpotlightCard>
              </Grid>
            ))}
          </Grid>

          {/* Clinic Technology & Sterilization Trust Pillars */}
          <Box
            sx={{
              mt: 7,
              p: { xs: 3, md: 4.5 },
              borderRadius: '24px',
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: 'rgba(225, 29, 72, 0.1)', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HealthAndSafetyIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} color="#0A2540">
                      Class-B Sterilization
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Hospital-grade vacuum autoclave
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: 'rgba(10, 37, 64, 0.08)', color: '#0A2540', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ThreeDRotationIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} color="#0A2540">
                      3D CBCT Imaging
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sub-millimeter jaw scans
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: 'rgba(217, 119, 6, 0.1)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AutoAwesomeIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} color="#0A2540">
                      In-House CAD/CAM Lab
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Robotic same-day crowns
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: 'rgba(37, 211, 102, 0.1)', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <VerifiedIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} color="#0A2540">
                      Private VIP Operatories
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sound-isolated comfort suites
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* LIGHTBOX MODAL FOR CLINIC PICTURES */}
      <Dialog
        open={Boolean(selectedFacility)}
        onClose={() => setSelectedFacility(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          },
        }}
      >
        {selectedFacility && (
          <DialogContent sx={{ p: 0, position: 'relative', bgcolor: '#0A2540' }}>
            <IconButton
              onClick={() => setSelectedFacility(null)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                color: '#FFFFFF',
                zIndex: 10,
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ maxHeight: 520, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                image={selectedFacility.imageUrl}
                alt={selectedFacility.title}
                sx={{
                  width: '100%',
                  maxHeight: 520,
                  objectFit: 'cover',
                }}
              />
            </Box>

            <Box sx={{ p: 3.5, bgcolor: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Chip label={selectedFacility.category} size="small" color="primary" sx={{ fontWeight: 700 }} />
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Apex Dental Studio • On-Site Facility
                </Typography>
              </Box>
              <Typography variant="h4" color="#0A2540" fontWeight={800} mb={1}>
                {selectedFacility.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                {selectedFacility.description}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                <Button
                  component={Link}
                  to="/book-appointment"
                  variant="contained"
                  color="secondary"
                  onClick={() => setSelectedFacility(null)}
                  startIcon={<CalendarMonthIcon />}
                  sx={{ fontWeight: 700 }}
                >
                  Schedule Operatory Visit
                </Button>
                <Button
                  component="a"
                  href={`https://wa.me/${doctorProfile.whatsappNumber}?text=Hi%20Dr.%20Sarah,%20I%20would%20like%20to%20know%20more%20about%20your%20clinic%20facilities%20at%20Apex%20Dental.`}
                  target="_blank"
                  variant="outlined"
                  startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                  sx={{ fontWeight: 700 }}
                >
                  Ask on WhatsApp
                </Button>
              </Stack>
            </Box>
          </DialogContent>
        )}
      </Dialog>

      {/* 5. VERIFIED PATIENT REVIEWS */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 7 }}>
            <ShimmerBadge text="REAL SMILE TRANSFORMATIONS" sx={{ mb: 2 }} />
            <Typography variant="h2" color="#0A2540" mb={1.5}>
              Trusted by 15,000+ Happy Patients
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Authentic feedback from patients who completed dental implants, aligners, and aesthetic restorations with {doctorProfile.name}.
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {testimonials.slice(0, 3).map((item) => (
              <Grid item xs={12} md={4} key={item.id}>
                <SpotlightCard sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar src={item.avatar} alt={item.name} sx={{ width: 50, height: 50 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={800} color="#0A2540">
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="#E11D48" fontWeight={700}>
                          {item.service || 'Consultation Patient'}
                        </Typography>
                      </Box>
                    </Box>

                    <Rating value={item.rating} readOnly precision={0.5} sx={{ mb: 2, color: '#F59E0B' }} />

                    <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic', lineHeight: 1.75 }}>
                      "{item.comment}"
                    </Typography>
                  </Box>

                  <Box sx={{ pt: 2, mt: 2, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {item.date || 'Recent Visit'}
                    </Typography>
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: 14, color: '#E11D48 !important' }} />}
                      label="Verified Patient"
                      size="small"
                      sx={{ bgcolor: 'rgba(225, 29, 72, 0.08)', color: '#E11D48', fontWeight: 700 }}
                    />
                  </Box>
                </SpotlightCard>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button component={Link} to="/testimonials" variant="outlined" color="primary" sx={{ fontWeight: 700, px: 4 }}>
              Read All 500+ Patient Stories →
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 6. CALL TO ACTION - IMMERSIVE CLINICAL PASS CARD */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#06182A', position: 'relative', overflow: 'hidden' }}>
        <Box className="aurora-glow-1" style={{ opacity: 0.2 }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box
            sx={{
              textAlign: 'center',
              p: { xs: 4, sm: 8 },
              borderRadius: '36px',
              background: 'linear-gradient(135deg, rgba(10, 37, 64, 0.8) 0%, rgba(225, 29, 72, 0.25) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 25px 60px -10px rgba(0,0,0,0.5)',
            }}
          >
            <ShimmerBadge
              badgeColor="#E11D48"
              bgColor="rgba(225, 29, 72, 0.12)"
              borderColor="rgba(225, 29, 72, 0.3)"
              text="ZERO QUEUE ONLINE RESERVATION"
              sx={{ mb: 3 }}
            />
            <Typography variant="h2" color="#FFFFFF" fontWeight={900} mb={2}>
              Ready for Your Smile Consultation?
            </Typography>
            <Typography variant="body1" sx={{ color: '#94A3B8', fontSize: '1.15rem', maxWidth: 650, mx: 'auto', mb: 5 }}>
              Reserve your dental examination online in under 60 seconds. Instant WhatsApp entry pass with clinic directions sent straight to your phone.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="center">
              <Button
                component={Link}
                to="/book-appointment"
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<CalendarMonthIcon />}
                sx={{
                  py: 1.8,
                  px: 4.5,
                  fontSize: '1.08rem',
                  fontWeight: 800,
                  boxShadow: '0 12px 30px rgba(225, 29, 72, 0.4)',
                }}
              >
                Book Appointment Online
              </Button>
              <Button
                component="a"
                href={clinicDialNumber ? `tel:${clinicDialNumber}` : '#'}
                title={clinicDisplayPhone ? `Call Clinic: ${clinicDisplayPhone}` : 'Call Clinic'}
                variant="outlined"
                sx={{
                  py: 1.8,
                  px: 4,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255, 255, 255, 0.08)' },
                }}
                startIcon={<PhoneIcon sx={{ color: '#F43F5E' }} />}
              >
                Call Clinic
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
