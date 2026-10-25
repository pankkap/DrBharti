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
} from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BiotechIcon from '@mui/icons-material/Biotech';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VerifiedIcon from '@mui/icons-material/Verified';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ShimmerBadge from '../../components/ui/ShimmerBadge';
import AnnualHealthPlanModal from '../../components/common/AnnualHealthPlanModal';

const CATEGORIES = ['All', 'Implantology', 'Orthodontics', 'Cosmetic', 'Endodontics', 'Preventative', 'Surgery'];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
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

const Services = () => {
  const { services, doctorProfile } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAnnualPlanModalOpen, setIsAnnualPlanModalOpen] = useState(false);

  const filteredServices =
    selectedCategory === 'All'
      ? services
      : services.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <Box className="bg-mesh-subtle" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="xl">
        {/* Header Title */}
        <Box sx={{ textAlign: 'center', maxWidth: 840, mx: 'auto', mb: 6 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <ShimmerBadge text="AESTHETIC DENTISTRY & SURGICAL EXCELLENCE" sx={{ mb: 2 }} />
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <Typography variant="h1" color="#0A2540" mb={2}>
              Clinical Services & Advanced Procedures
            </Typography>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.15rem', lineHeight: 1.75 }}>
              Explore our comprehensive range of painless dental implants, invisible aligners, laser aesthetics, and hospital-grade restorative procedures performed with German 3D CAD/CAM technology.
            </Typography>
          </motion.div>
        </Box>

        {/* Category Filter Chips with Animated Indicator */}
        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" gap={1} sx={{ mb: 6 }}>
          {CATEGORIES.map((cat) => {
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

        {/* Service Cards Grid with High-Resolution Images & Rich Clinical Information */}
        <Grid container spacing={3.5} alignItems="stretch">
          {filteredServices.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={service.id} sx={{ display: 'flex' }}>
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
                  {/* Service Image with Category & Duration Overlays */}
                  <Box sx={{ position: 'relative', overflow: 'hidden', height: 210 }}>
                    <CardMedia
                      component="img"
                      height="210"
                      image={service.image || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80"}
                      alt={service.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80";
                      }}
                      sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                        '&:hover': { transform: 'scale(1.04)' },
                      }}
                    />
                    {/* Gradient Overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(10, 37, 64, 0.4) 0%, transparent 60%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Category Chip floating top-left */}
                    <Chip
                      label={service.category}
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

                    {/* Duration Badge floating top-right */}
                    <Chip
                      icon={<AccessTimeIcon sx={{ fontSize: '13px !important', color: '#E11D48 !important' }} />}
                      label={service.duration}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        color: '#0A2540',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                      }}
                    />
                  </Box>

                  {/* Card Content & Clinical Inclusions */}
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* In-Chair Technology Tag */}
                    {service.technology && (
                      <Box sx={{ mb: 1.5 }}>
                        <Chip
                          icon={<BiotechIcon sx={{ fontSize: '14px !important', color: '#E11D48 !important' }} />}
                          label={service.technology}
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
                    )}

                    {/* Service Title */}
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      color="#0A2540"
                      mb={1}
                      sx={{
                        minHeight: { xs: 'auto', sm: '3.4rem' },
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.25,
                      }}
                    >
                      {service.title}
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
                      {service.description}
                    </Typography>

                    {/* Ideal For Pill */}
                    {service.idealFor && (
                      <Box sx={{ mb: 2, p: 1, px: 1.5, borderRadius: '10px', bgcolor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', fontSize: '0.7rem' }}>
                          RECOMMENDED FOR:
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#0A2540', fontWeight: 700, fontSize: '0.76rem' }}>
                          {service.idealFor}
                        </Typography>
                      </Box>
                    )}

                    {/* Key Clinical Features Checklist */}
                    {service.features && service.features.length > 0 && (
                      <Box sx={{ mb: 2.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', display: 'block', mb: 0.8, fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                          CLINICAL INCLUSIONS:
                        </Typography>
                        <Stack spacing={0.6}>
                          {service.features.map((feat, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                              <CheckCircleIcon sx={{ fontSize: 14, color: '#E11D48', flexShrink: 0 }} />
                              <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.74rem', lineHeight: 1.4 }}>
                                {feat}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}

                  </CardContent>

                  {/* Actions Row */}
                  <Box sx={{ p: 3, pt: 0, mt: 'auto' }}>
                    <Stack direction="row" spacing={1.5}>
                      {service.isAnnualPlan || service.id === 'serv-9' ? (
                        <Button
                          onClick={() => setIsAnnualPlanModalOpen(true)}
                          variant="contained"
                          fullWidth
                          startIcon={<CardMembershipIcon sx={{ color: '#F59E0B' }} />}
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
                          startIcon={<CalendarMonthIcon />}
                          sx={{ py: 1.2, fontWeight: 700, fontSize: '0.9rem' }}
                        >
                          Book Slot
                        </Button>
                      )}
                      <Button
                        component="a"
                        href={`https://wa.me/${doctorProfile.whatsappNumber}?text=${encodeURIComponent(`Hi Dr. Jenkins, I would like to inquire about ${service.title}.`)}`}
                        target="_blank"
                        variant="outlined"
                        sx={{
                          minWidth: 44,
                          px: 1.5,
                          borderColor: '#CBD5E1',
                          color: '#25D366',
                          '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.08)', borderColor: '#25D366' },
                        }}
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

        {/* Dedicated Annual Health Plan Interactive Modal Component */}
        <AnnualHealthPlanModal
          open={isAnnualPlanModalOpen}
          onClose={() => setIsAnnualPlanModalOpen(false)}
        />
      </Container>
    </Box>
  );
};

export default Services;
