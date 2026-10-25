import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  Avatar,
  Card,
  CardMedia,
  Stack,
  Divider,
  Button,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShieldCheckIcon from '@mui/icons-material/GppGood';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import BiotechIcon from '@mui/icons-material/Biotech';
import StarIcon from '@mui/icons-material/Star';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import SpotlightCard from '../../components/ui/SpotlightCard';
import ShimmerBadge from '../../components/ui/ShimmerBadge';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
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

const CERTIFICATION_ICONS = {
  MilitaryTech: <MilitaryTechIcon sx={{ fontSize: 28 }} />,
  AutoAwesome: <AutoAwesomeIcon sx={{ fontSize: 28 }} />,
  WorkspacePremium: <WorkspacePremiumIcon sx={{ fontSize: 28 }} />,
  School: <SchoolIcon sx={{ fontSize: 28 }} />,
  Verified: <VerifiedIcon sx={{ fontSize: 28 }} />,
  HealthAndSafety: <HealthAndSafetyIcon sx={{ fontSize: 28 }} />,
};

const CLINICAL_TECH = [
  {
    title: '3D CBCT Cone-Beam Imaging',
    brand: 'Planmeca ProMax 3D (Finland)',
    desc: 'Ultra-low radiation 3D sub-millimeter bone density scans for exact computer-guided implant planning with zero guesswork.',
  },
  {
    title: 'Intraoral 3D Optical Scanner',
    brand: 'iTero Element 5D Plus (USA)',
    desc: 'Captures 6,000 frames/sec for accurate digital impressions in under 60 seconds with zero unpleasant impression putty or gagging.',
  },
  {
    title: 'In-House CAD/CAM Robotic Milling',
    brand: 'Dentsply Sirona MC XL (Germany)',
    desc: 'Same-day precision E-Max porcelain veneers and monolithic zirconia crowns milled and bonded in a single comfortable appointment.',
  },
  {
    title: 'Laser Hard & Soft Tissue Unit',
    brand: 'Biolase WaterLase iPlus (USA)',
    desc: 'HydroPhotonics laser energy allows suture-free gum re-contouring, laser root canal disinfection, and cold teeth whitening without shots.',
  },
];

const AWARDS_AND_CERTIFICATES = [
  {
    id: 'award-1',
    title: 'Global Dental Excellence Award 2024',
    category: 'Award Ceremony Presentation',
    issuer: 'International Dental Federation & GDE',
    year: '2024',
    image: '/assets/awards/dental_award_giving.jpg',
    badge: 'Podium Award Felicitation',
    tagline: 'Outstanding Implantologist of the Year',
    description: 'Dr. Bharti receiving the prestigious crystal trophy on stage from the Board President at the Global Dental Excellence Awards gala for pioneering advances in computer-guided 3D implantology.',
    credentials: [
      'Presented before 2,500+ international dental delegates',
      'Recognized for 99.8% implant osseointegration rate',
      'Pioneered pain-free digital micro-anesthesia workflows',
    ],
  },
  {
    id: 'cert-1',
    title: 'Fellow in Implant Dentistry (ICOI USA)',
    category: 'Official Board Certificate',
    issuer: 'International Congress of Oral Implantologists, USA',
    year: '2018',
    image: '/assets/awards/dental_board_certificate.jpg',
    badge: 'Official Surgical Credential',
    tagline: 'Registration No. 81753 • USA Board',
    description: 'Official framed diploma with embossed gold foil seal and ribbon, certifying Dr. Bharti as an accredited Surgical Fellow of the ICOI in computer-guided dental implants and bone augmentation.',
    credentials: [
      'Documented submission of 100+ surgical implant cases',
      'Comprehensive peer-reviewed oral board evaluation',
      'Certified mastery in sub-millimeter 3D CBCT navigation',
    ],
  },
  {
    id: 'cert-2',
    title: 'Master Clinician in Digital Smile Design',
    category: 'Master Credential & Trophy',
    issuer: 'International Academy of Digital Dentistry & Esthetics',
    year: '2023 - 2024',
    image: '/assets/awards/digital_smile_certificate.jpg',
    badge: 'Master Clinician Honor',
    tagline: 'Digital Smile Design & CAD/CAM Veneers',
    description: 'Master clinician certificate and crystal award honors in 3D intraoral optical scanning, facial harmony smile design, and robotic E-Max porcelain veneer restorations.',
    credentials: [
      'Evaluated on 50+ full-mouth aesthetic smile makeovers',
      'Certified in conservative 0.2mm enamel preservation',
      'Direct partner with German Dentsply Sirona milling labs',
    ],
  },
];

const About = () => {
  const { doctorProfile } = useApp();
  const [selectedAward, setSelectedAward] = useState(null);

  const certifications = doctorProfile.certifications || [
    {
      title: 'Fellow of ICOI (USA)',
      issuer: 'International Congress of Oral Implantologists, USA',
      year: '2018',
      description: 'Highest tier surgical credential in advanced 3D computer-guided dental implants and bone augmentation.',
      icon: 'MilitaryTech',
    },
    {
      title: 'Digital Smile Design (DSD) Master',
      issuer: 'DSD International Center (Madrid, Spain)',
      year: '2020',
      description: 'Facial harmony analysis, 3D aesthetic smile mockups, and hand-crafted E-Max porcelain veneers.',
      icon: 'AutoAwesome',
    },
    {
      title: 'Invisalign Diamond Provider',
      issuer: 'Align Technology (San Jose, USA)',
      year: '2021',
      description: 'Top 1% clinical provider for complex adult and teen orthodontic clear aligner corrections.',
      icon: 'WorkspacePremium',
    },
    {
      title: 'MDS Prosthodontics (Gold Medalist)',
      issuer: 'Government Dental College & Research Institute',
      year: '2012',
      description: 'Ranked #1 in university post-graduate specialization in crowns, bridges, and full-mouth rehabilitations.',
      icon: 'School',
    },
    {
      title: 'Advanced Laser Dentistry Fellowship',
      issuer: 'World Clinical Laser Institute (WCLI, USA)',
      year: '2019',
      description: 'Dual-wavelength laser certified for painless root canals and bloodless cosmetic gingival shaping.',
      icon: 'Verified',
    },
    {
      title: 'Certified Sedationist Protocol',
      issuer: 'Society for the Advancement of Analgesia in Dentistry (SAAD)',
      year: '2016',
      description: 'Painless relaxation dentistry protocols eliminating dental anxiety and needle sensation.',
      icon: 'HealthAndSafety',
    },
  ];

  return (
    <Box className="bg-mesh-subtle" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="xl">
        {/* Header Title */}
        <Box sx={{ textAlign: 'center', maxWidth: 840, mx: 'auto', mb: 8 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <ShimmerBadge text="DIRECTOR OF AESTHETIC DENTISTRY & IMPLANTOLOGY" sx={{ mb: 2 }} />
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <Typography variant="h1" color="#0A2540" mb={2}>
              Artistry, Precision & Gentle Care
            </Typography>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.15rem', lineHeight: 1.75 }}>
              Meet <strong>{doctorProfile.name}</strong>, an internationally recognized cosmetic prosthodontist and surgical implantologist dedicated to natural smile restorations, anxiety-free dentistry, and digital CAD/CAM accuracy.
            </Typography>
          </motion.div>
        </Box>

        {/* Main Doctor Hero Card */}
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center" sx={{ mb: 10 }}>
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Box sx={{ position: 'relative' }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: '32px',
                    overflow: 'hidden',
                    border: '1px solid rgba(225, 29, 72, 0.25)',
                    boxShadow: '0 25px 50px -12px rgba(10, 37, 64, 0.15)',
                    bgcolor: '#FFFFFF',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="560"
                    image={doctorProfile.avatar}
                    alt={doctorProfile.name}
                    sx={{ objectFit: 'cover' }}
                  />
                </Card>

                {/* Floating Award Chip */}
                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    bottom: 24,
                    left: 20,
                    right: 20,
                    p: 2,
                    borderRadius: '20px',
                    bgcolor: 'rgba(10, 37, 64, 0.92)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Avatar sx={{ bgcolor: '#E11D48', color: '#FFF', width: 44, height: 44 }}>
                    <MilitaryTechIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} color="#FFF">
                      Fellow ICOI (USA)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#FDA4AF', fontWeight: 600 }}>
                      Highest International Implant Credential
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={7}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  icon={<VerifiedIcon sx={{ color: '#E11D48 !important' }} />}
                  label={`Registration: ${doctorProfile.registrationNo}`}
                  sx={{ bgcolor: 'rgba(225, 29, 72, 0.1)', color: '#E11D48', fontWeight: 700 }}
                />
                <Chip
                  label="16+ Years Experience"
                  sx={{ bgcolor: '#0A2540', color: '#FFFFFF', fontWeight: 700 }}
                />
                <Chip
                  label="15,000+ Smiles Created"
                  sx={{ bgcolor: '#fce5e5', color: '#be185d', border: '1px solid #fecdd3', fontWeight: 700 }}
                />
              </Box>

              <Typography variant="h2" color="#0A2540" mb={1} sx={{ fontSize: { xs: '2rem', md: '2.6rem' } }}>
                {doctorProfile.name}
              </Typography>
              <Typography variant="h5" color="#E11D48" fontWeight={700} mb={3}>
                {doctorProfile.title}
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: '24px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
                  mb: 4,
                }}
              >
                <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.85, fontSize: '1.05rem', mb: 2 }}>
                  {doctorProfile.bio}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 2, borderTop: '1px solid #F1F5F9' }}>
                  <FormatQuoteIcon sx={{ color: '#E11D48', fontSize: 32 }} />
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#475569', fontWeight: 600 }}>
                    "A genuine smile is the universal language of human confidence. My life's mission is to restore that confidence through biological precision and gentle artistry."
                  </Typography>
                </Box>
              </Paper>

              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                    <Avatar sx={{ bgcolor: 'rgba(10, 37, 64, 0.08)', color: '#0A2540', width: 44, height: 44, borderRadius: '12px' }}>
                      <SchoolIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                        Academic Credentials
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={800} color="#0A2540">
                        {doctorProfile.qualification}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                    <Avatar sx={{ bgcolor: 'rgba(225, 29, 72, 0.1)', color: '#E11D48', width: 44, height: 44, borderRadius: '12px' }}>
                      <WorkspacePremiumIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                        Clinical Track Record
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={800} color="#0A2540">
                        4,200+ Implants • 99.8% Success
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  component={Link}
                  to="/book-appointment"
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<CalendarMonthIcon />}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ py: 1.6, px: 4, fontWeight: 800, fontSize: '1.02rem', boxShadow: '0 12px 25px rgba(225, 29, 72, 0.35)' }}
                >
                  Schedule Consultation with {doctorProfile.name.split(',')[0]}
                </Button>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{ my: 8, borderColor: 'rgba(226, 232, 240, 0.8)' }} />

        {/* SECTION 2: OFFICIAL CERTIFICATES & AWARD FELICITATION GALLERY */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <ShimmerBadge
            icon={<EmojiEventsIcon sx={{ fontSize: 16, mr: 0.5, color: '#F59E0B' }} />}
            badgeColor="#F59E0B"
            bgColor="rgba(245, 158, 11, 0.1)"
            borderColor="rgba(245, 158, 11, 0.3)"
            text="HONORS, DISTINCTIONS & BOARD DIPLOMAS"
            sx={{ mb: 1.5 }}
          />
          <Typography variant="h2" color="#0A2540" mb={1.5}>
            Distinguished Awards & Official Board Certifications
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={760} mx="auto" sx={{ fontSize: '1.1rem' }}>
            Authentic international board diplomas, surgical fellowships, and podium award presentations recognizing Dr. Bharti' clinical mastery in 3D computer-guided implantology and aesthetic smile restorations.
          </Typography>
        </Box>

        {/* 3 Visual Cards with Certificates and Award Photos */}
        <Grid container spacing={3.5} sx={{ mb: 9 }}>
          {AWARDS_AND_CERTIFICATES.map((item) => (
            <Grid item xs={12} md={4} key={item.id} sx={{ display: 'flex' }}>
              <SpotlightCard
                onClick={() => setSelectedAward(item)}
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(10, 37, 64, 0.12)',
                  },
                }}
              >
                {/* Photo with Overlay Badges */}
                <Box sx={{ position: 'relative', height: 260, overflow: 'hidden', bgcolor: '#06182A' }}>
                  <CardMedia
                    component="img"
                    height="260"
                    image={item.image}
                    alt={item.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80";
                    }}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      '&:hover': { transform: 'scale(1.06)' },
                    }}
                  />
                  {/* Floating Category Badge */}
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                      bgcolor: 'rgba(10, 37, 64, 0.88)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.74rem',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  />
                  {/* Floating Year Badge */}
                  <Chip
                    label={item.year}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      bgcolor: '#F59E0B',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
                    }}
                  />
                  {/* Quick Zoom Icon Button */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '50%',
                      width: 38,
                      height: 38,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      color: '#0A2540',
                      transition: 'all 0.2s ease',
                      '&:hover': { bgcolor: '#E11D48', color: '#FFF' },
                    }}
                  >
                    <ZoomInIcon sx={{ fontSize: 22 }} />
                  </Box>
                </Box>

                {/* Content Details */}
                <Box sx={{ p: 3.5, display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" color="#E11D48" fontWeight={800} sx={{ display: 'block', mb: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {item.issuer}
                    </Typography>
                    <Typography variant="h5" color="#0A2540" fontWeight={800} mb={1} sx={{ lineHeight: 1.3 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
                      {item.description}
                    </Typography>

                    <Stack spacing={1} sx={{ mb: 2 }}>
                      {item.credentials.map((cred, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: '#E11D48', mt: 0.2, flexShrink: 0 }} />
                          <Typography variant="caption" color="text.primary" fontWeight={600}>
                            {cred}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Box sx={{ pt: 2, borderTop: '1px solid #F1F5F9' }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                      sx={{ fontWeight: 700, borderRadius: '12px', py: 1 }}
                    >
                      Inspect Full Document
                    </Button>
                  </Box>
                </Box>
              </SpotlightCard>
            </Grid>
          ))}
        </Grid>

        {/* Trust Highlight Banner for Honors */}
        <Box
          sx={{
            mb: 9,
            p: 3,
            borderRadius: '20px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 14px rgba(10, 37, 64, 0.04)',
          }}
        >
          <Grid container spacing={2} alignItems="center" justifyContent="space-around">
            <Grid item xs={6} md={3} sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" fontWeight={800} color="#0A2540">
                ICOI (USA) Surgical Fellow
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Gold Standard Bone Biology
              </Typography>
            </Grid>
            <Grid item xs={6} md={3} sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" fontWeight={800} color="#0A2540">
                GDE 2024 Award Winner
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Excellence in 3D Guided Surgery
              </Typography>
            </Grid>
            <Grid item xs={6} md={3} sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" fontWeight={800} color="#0A2540">
                DSD Master Clinician
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Facial Harmony & E-Max Veneers
              </Typography>
            </Grid>
            <Grid item xs={6} md={3} sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" fontWeight={800} color="#0A2540">
                Gold Medalist MDS
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Prosthodontics University Rank #1
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 8, borderColor: 'rgba(226, 232, 240, 0.8)' }} />

        {/* SECTION 3: ADDITIONAL BOARD CERTIFICATIONS & FELLOWSHIPS */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <ShimmerBadge text="ACADEMIC & CLINICAL AFFILIATIONS" sx={{ mb: 1.5 }} />
          <Typography variant="h2" color="#0A2540" mb={1.5}>
            Complete Board Fellowships & Credentials
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={720} mx="auto">
            Continuous medical education and peer certifications ensuring evidence-based clinical protocols and long-term prosthetic outcomes.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 10 }}>
          {certifications.map((cert) => (
            <Grid item xs={12} sm={6} md={4} key={cert.title}>
              <SpotlightCard sx={{ p: 3.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                      {CERTIFICATION_ICONS[cert.icon] || <VerifiedIcon sx={{ fontSize: 26 }} />}
                    </Box>
                    <Chip label={cert.year} size="small" sx={{ bgcolor: '#F1F5F9', fontWeight: 700, color: '#0A2540' }} />
                  </Box>

                  <Typography variant="h5" fontWeight={800} color="#0A2540" mb={0.8}>
                    {cert.title}
                  </Typography>

                  <Typography variant="caption" color="#E11D48" fontWeight={700} sx={{ display: 'block', mb: 1.5 }}>
                    {cert.issuer}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {cert.description}
                  </Typography>
                </Box>

                <Box sx={{ pt: 2, mt: 2, borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#E11D48' }} />
                  <Typography variant="caption" fontWeight={700} color="#475569">
                    Verified Active Board Credential
                  </Typography>
                </Box>
              </SpotlightCard>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 8, borderColor: 'rgba(226, 232, 240, 0.8)' }} />

        {/* SECTION 3: ADVANCED CLINICAL TECHNOLOGY ACCREDITATIONS */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <ShimmerBadge text="GERMAN & FINNISH DIAGNOSTICS" sx={{ mb: 1.5 }} />
          <Typography variant="h2" color="#0A2540" mb={1.5}>
            Hospital-Grade In-House Technology
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={720} mx="auto">
            Eliminating external dental lab delays and inaccuracies with in-chair 3D scanning, laser precision, and computer-guided milling.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 10 }}>
          {CLINICAL_TECH.map((tech) => (
            <Grid item xs={12} sm={6} md={3} key={tech.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: '24px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
                }}
              >
                <Box>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      bgcolor: 'rgba(10, 37, 64, 0.06)',
                      color: '#0A2540',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <BiotechIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={800} color="#0A2540" mb={0.5}>
                    {tech.title}
                  </Typography>
                  <Typography variant="caption" color="#E11D48" fontWeight={700} sx={{ display: 'block', mb: 1.5 }}>
                    {tech.brand}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65, fontSize: '0.86rem' }}>
                    {tech.desc}
                  </Typography>
                </Box>
                <Chip label="ISO 13485 Medical Standard" size="small" sx={{ mt: 2, bgcolor: '#F8FAFC', fontWeight: 600, fontSize: '0.7rem' }} />
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 8, borderColor: 'rgba(226, 232, 240, 0.8)' }} />

        {/* SECTION 4: 3 CLINICAL PILLARS OF EXCELLENCE */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip label="OUR PATIENT PLEDGE" color="secondary" sx={{ fontWeight: 700, mb: 1.5 }} />
          <Typography variant="h2" color="#0A2540" mb={2}>
            Clinical Standards You Can Count On
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={680} mx="auto">
            Every smile journey is guided by painless anesthesia, unhurried 30-minute evaluations, and transparent pricing.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <motion.div whileHover={{ y: -6 }} style={{ height: '100%' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  height: '100%',
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(10, 37, 64, 0.08)', color: '#0A2540', width: 56, height: 56, borderRadius: '16px', mb: 2.5 }}>
                  <MedicalServicesIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h4" color="#0A2540" mb={1.5} fontWeight={800}>
                  100% Pain-Free Protocol
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  Computer-controlled micro-anesthesia, nitrous oxide sedation, and dental lasers completely eliminate needle pinches and post-operative discomfort.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div whileHover={{ y: -6 }} style={{ height: '100%' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  height: '100%',
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(225, 29, 72, 0.1)', color: '#E11D48', width: 56, height: 56, borderRadius: '16px', mb: 2.5 }}>
                  <FavoriteIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h4" color="#0A2540" mb={1.5} fontWeight={800}>
                  Dedicated 30-Min Consults
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  We never rush appointments. Every patient receives a full 30-minute consultation with 3D smile mockups, plain-English answers, and clear written treatment options.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div whileHover={{ y: -6 }} style={{ height: '100%' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  height: '100%',
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(37, 211, 102, 0.1)', color: '#25D366', width: 56, height: 56, borderRadius: '16px', mb: 2.5 }}>
                  <ShieldCheckIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h4" color="#0A2540" mb={1.5} fontWeight={800}>
                  Lifetime Implant Warranty
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  All titanium posts and zirconia crowns include verified serial certificates, manufacturer warranties, and scheduled complimentary annual checkups.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* LIGHTBOX MODAL FOR CERTIFICATES & AWARDS */}
      <Dialog
        open={Boolean(selectedAward)}
        onClose={() => setSelectedAward(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: '0 30px 70px rgba(0,0,0,0.35)',
          },
        }}
      >
        {selectedAward && (
          <DialogContent sx={{ p: 0, position: 'relative', bgcolor: '#0A2540' }}>
            <IconButton
              onClick={() => setSelectedAward(null)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(0, 0, 0, 0.65)',
                color: '#FFFFFF',
                zIndex: 10,
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.85)' },
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ maxHeight: 540, overflow: 'hidden', bgcolor: '#06182A', display: 'flex', justifyContent: 'center' }}>
              <CardMedia
                component="img"
                image={selectedAward.image}
                alt={selectedAward.title}
                sx={{
                  width: '100%',
                  maxHeight: 540,
                  objectFit: 'contain',
                }}
              />
            </Box>

            <Box sx={{ p: { xs: 3, sm: 4 }, bgcolor: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Chip label={selectedAward.badge} size="small" sx={{ bgcolor: '#0A2540', color: '#FFF', fontWeight: 700 }} />
                <Chip label={selectedAward.year} size="small" sx={{ bgcolor: '#F59E0B', color: '#FFF', fontWeight: 800 }} />
              </Box>

              <Typography variant="caption" color="#E11D48" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}>
                {selectedAward.issuer}
              </Typography>

              <Typography variant="h4" color="#0A2540" fontWeight={800} mb={1}>
                {selectedAward.title}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                {selectedAward.description}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to="/book-appointment"
                  variant="contained"
                  color="secondary"
                  onClick={() => setSelectedAward(null)}
                  startIcon={<CalendarMonthIcon />}
                  sx={{ py: 1.3, px: 3, fontWeight: 700 }}
                >
                  Schedule Consultation
                </Button>
                <Button
                  component="a"
                  href={`https://wa.me/${doctorProfile.whatsappNumber}?text=Hi%20Dr.%20Sarah,%20I%20saw%20your%20credentials%20at%20Apex%20Dental%20and%20would%20like%20to%20book%20a%20consultation.`}
                  target="_blank"
                  variant="outlined"
                  startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                  sx={{ py: 1.3, px: 3, fontWeight: 700 }}
                >
                  Inquire on WhatsApp
                </Button>
              </Stack>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
};

export default About;
