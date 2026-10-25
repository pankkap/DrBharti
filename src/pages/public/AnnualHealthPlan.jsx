import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  Paper,
  Divider,
  Card,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedIcon from '@mui/icons-material/Verified';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import PersonIcon from '@mui/icons-material/Person';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ShieldIcon from '@mui/icons-material/Shield';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ShimmerBadge from '../../components/ui/ShimmerBadge';

const PLAN_TIERS = [
  {
    id: 'essential',
    name: 'Individual Essential',
    badge: 'Standard Care',
    badgeColor: '#0A2540',
    price: '₹3,499',
    period: '/ year',
    description: 'Perfect for working professionals seeking guaranteed bi-annual dental maintenance and preventive protection.',
    icon: <PersonIcon sx={{ fontSize: 26, color: '#E11D48' }} />,
    features: [
      '2 Comprehensive Dental Exams by Dr. Bharti',
      '2 Ultrasonic Scalings & Airflow Stain Erasures',
      'Full-Mouth Digital Panoramic X-rays (OPG) included',
      '10% Member Discount on all restorative care & fillings',
      'Same-day priority emergency toothache appointments',
    ],
    savingsText: 'Save ₹3,200 on routine checkups',
    isPopular: false,
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive & Cosmetic',
    badge: 'Most Popular ⭐',
    badgeColor: '#10B981',
    price: '₹5,999',
    period: '/ year',
    description: 'Our premier wellness pass. Combines full preventive oral maintenance with aesthetic brightening and top-tier discounts.',
    icon: <WorkspacePremiumIcon sx={{ fontSize: 26, color: '#10B981' }} />,
    features: [
      'Everything in Individual Essential, PLUS:',
      '1 Zoom Laser Whitening session or touch-up voucher',
      'Enamel remineralizing fluoride varnish & sensitivity relief',
      '15% Flat Savings on Porcelain Veneers, Aligners & Implants',
      '1 Complimentary emergency walk-in evaluation included',
      'VIP Concierge line for zero-wait appointment priority',
    ],
    savingsText: 'Save ₹7,500+ annually with aesthetic care',
    isPopular: true,
  },
  {
    id: 'family',
    name: 'Family Smile Shield',
    badge: 'Best Family Value',
    badgeColor: '#2563EB',
    price: '₹9,999',
    period: '/ year',
    description: 'Covers up to 4 family members (2 Adults + 2 Children). Complete multi-generational oral wellness with shared benefits.',
    icon: <FamilyRestroomIcon sx={{ fontSize: 26, color: '#2563EB' }} />,
    features: [
      'Coverage for 2 Adults + 2 Children under 18 years',
      '4 Ultrasonic Cleanings + 4 Pediatric Fluoride Varnishes',
      'Complimentary Pit & Fissure cavity sealants for kids',
      '20% Family Savings on orthodontics, braces & aligners',
      'Shared family treatment discount allowance pool',
    ],
    savingsText: 'Save ₹14,000+ vs individual dental visits',
    isPopular: false,
  },
];

const COMPARISON_ITEMS = [
  { service: 'Bi-Annual Doctor Consultation (2 visits)', standard: '₹3,000', plan: 'FREE (100% Covered)' },
  { service: 'Ultrasonic Scaling & Airflow Polishing (2 visits)', standard: '₹3,600', plan: 'FREE (100% Covered)' },
  { service: 'Full-Mouth Digital Diagnostics & 3D Scan', standard: '₹2,500', plan: 'FREE (100% Covered)' },
  { service: 'Emergency Toothache Slot Booking', standard: '₹1,500', plan: 'FREE (Priority Access)' },
  { service: 'Dental Fillings, Crowns & Root Canals', standard: 'Standard Rate', plan: '10% – 15% OFF' },
  { service: 'Porcelain Veneers, Aligners & Implants', standard: 'Standard Rate', plan: '15% – 20% OFF' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

const AnnualHealthPlan = () => {
  const { doctorProfile } = useApp();
  const [selectedTier, setSelectedTier] = useState('comprehensive');
  const navigate = useNavigate();

  const activePlan = PLAN_TIERS.find((p) => p.id === selectedTier) || PLAN_TIERS[1];
  const cleanPhone = (doctorProfile?.phone || '+91 97292 80731').replace(/[^+\d]/g, '');
  const waNumber = (doctorProfile?.whatsappNumber || '919729280731').replace(/\D/g, '');

  const handleBookWithPlan = (tierName) => {
    navigate('/book-appointment', {
      state: {
        annualPlan: tierName || activePlan.name,
        source: `Annual Health Plan (${tierName || activePlan.name})`,
      },
    });
  };

  const getWaEnrollUrl = (tierName) => {
    const text = encodeURIComponent(
      `Hello ${doctorProfile?.name || 'Dr. Bharti'}, I would like to enroll in the "${tierName || activePlan.name}" (${activePlan.price}/year) at Apex Dental Studio. Please share the registration details.`
    );
    return `https://wa.me/${waNumber}?text=${text}`;
  };

  return (
    <Box className="bg-mesh-subtle" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ textAlign: 'center', maxWidth: 880, mx: 'auto', mb: 8 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <ShimmerBadge text="365-DAY PREVENTATIVE DENTAL WELLNESS MEMBERSHIP" sx={{ mb: 2 }} />
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <Typography variant="h1" color="#0A2540" mb={2} sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}>
              Annual Dental Health & Wellness Plan
            </Typography>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.15rem', lineHeight: 1.75 }}>
              A modern, transparent alternative to traditional dental insurance. Get complete preventative dental cleanings, 3D scans, priority emergency slots, and exclusive member discounts all year long with <strong>{doctorProfile?.name || 'Dr. Bharti, MDS'}</strong>.
            </Typography>
          </motion.div>
        </Box>

        {/* Feature Highlights Grid */}
        <Grid container spacing={2.5} sx={{ mb: 6 }}>
          {[
            { title: '100% Covered Cleanings', sub: '2x Ultrasonic scaling, airflow polish & exams/yr', icon: <CheckCircleIcon sx={{ color: '#E11D48', fontSize: 26 }} /> },
            { title: 'Up to 20% Treatment Savings', sub: 'Fillings, root canals, implants, veneers & braces', icon: <AutoAwesomeIcon sx={{ color: '#F59E0B', fontSize: 26 }} /> },
            { title: 'Same-Day Emergency Priority', sub: 'Zero waiting for sudden toothache or dental trauma', icon: <ShieldIcon sx={{ color: '#2563EB', fontSize: 26 }} /> },
            { title: 'No Waiting Periods or Deductibles', sub: 'Benefits active on Day 1 with no hidden paperwork', icon: <VerifiedIcon sx={{ color: '#10B981', fontSize: 26 }} /> },
          ].map((perk, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '18px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 16px rgba(10, 37, 64, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  height: '100%',
                }}
              >
                {perk.icon}
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} color="#0A2540" sx={{ fontSize: '0.88rem' }}>
                    {perk.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {perk.sub}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Membership Tiers Cards */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" fontWeight={800} color="#0A2540">
            Select Your Membership Level
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            All plans include full preventive coverage, emergency booking guarantees, and clinic member perks.
          </Typography>
        </Box>

        <Grid container spacing={3.5} alignItems="stretch" sx={{ mb: 7 }}>
          {PLAN_TIERS.map((tier) => {
            const isSelected = selectedTier === tier.id;
            return (
              <Grid item xs={12} md={4} key={tier.id} sx={{ display: 'flex' }}>
                <Card
                  onClick={() => setSelectedTier(tier.id)}
                  elevation={0}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    border: isSelected ? '2.5px solid #E11D48' : '1px solid #FBCFE8',
                    bgcolor: isSelected ? '#fce5e5' : '#FFFFFF',
                    boxShadow: isSelected ? '0 16px 36px rgba(225, 29, 72, 0.18)' : '0 4px 20px rgba(0,0,0,0.03)',
                    p: 3.5,
                    '&:hover': {
                      borderColor: '#E11D48',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tier.icon}
                      <Typography variant="h5" fontWeight={800} color="#0A2540">
                        {tier.name}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={tier.badge}
                      size="small"
                      sx={{
                        bgcolor: tier.isPopular ? '#10B981' : '#F1F5F9',
                        color: tier.isPopular ? '#FFFFFF' : '#475569',
                        fontWeight: 800,
                        fontSize: '0.74rem',
                        mb: 1.5,
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                      <Typography variant="h2" fontWeight={900} color="#0A2540">
                        {tier.price}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                        {tier.period}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#E11D48', fontWeight: 700, display: 'block', mt: 0.5 }}>
                      {tier.savingsText}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, minHeight: 44, lineHeight: 1.5 }}>
                      {tier.description}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: isSelected ? '#FECDD3' : '#F1F5F9' }} />

                  {/* Features */}
                  <Stack spacing={1.4} sx={{ mb: 3.5, flexGrow: 1 }}>
                    {tier.features.map((feat, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 17, color: '#E11D48', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.45 }}>
                          {feat}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Button
                    variant={isSelected ? 'contained' : 'outlined'}
                    color={tier.isPopular ? 'secondary' : 'primary'}
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookWithPlan(tier.name);
                    }}
                    sx={{
                      py: 1.4,
                      fontWeight: 800,
                      borderRadius: '12px',
                      fontSize: '0.96rem',
                    }}
                  >
                    Select & Enroll Now →
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Cost Comparison Table */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: '24px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 30px rgba(10, 37, 64, 0.04)',
            mb: 6,
          }}
        >
          <Typography variant="h4" fontWeight={800} color="#0A2540" sx={{ mb: 1 }}>
            💡 Clear Cost Comparison
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Understand the dramatic savings between regular pay-per-procedure visits and your annual pass.
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '12px 16px', color: '#475569', fontSize: '0.9rem', fontWeight: 800 }}>Clinical Procedure / Service</th>
                  <th style={{ padding: '12px 16px', color: '#475569', fontSize: '0.9rem', fontWeight: 800 }}>Standard Clinic Cost</th>
                  <th style={{ padding: '12px 16px', color: '#E11D48', fontSize: '0.9rem', fontWeight: 800 }}>With Annual Health Plan</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ITEMS.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 16px', fontSize: '0.92rem', color: '#1E293B', fontWeight: 600 }}>{item.service}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.92rem', color: '#64748B' }}>{item.standard}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.92rem', color: '#BE123C', fontWeight: 800 }}>
                      <span style={{ backgroundColor: '#fce5e5', border: '1px solid #FECDD3', padding: '4px 10px', borderRadius: '8px' }}>
                        {item.plan}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>

        {/* Enrollment Help & Call-to-Action */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5 },
            borderRadius: '24px',
            bgcolor: '#06182A',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Box sx={{ maxWidth: 620 }}>
            <Chip label="IMMEDIATE ACTIVATION" size="small" sx={{ bgcolor: 'rgba(37, 211, 102, 0.2)', color: '#25D366', fontWeight: 800, mb: 1.5 }} />
            <Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
              Ready to Lock In 365 Days of Dental Care?
            </Typography>
            <Typography variant="body1" sx={{ color: '#94A3B8', lineHeight: 1.7 }}>
              Enroll directly with our clinic front desk or connect on WhatsApp for instant assistance.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <Button
              component="a"
              href={getWaEnrollUrl()}
              target="_blank"
              variant="contained"
              size="large"
              startIcon={<WhatsAppIcon />}
              sx={{
                bgcolor: '#25D366',
                color: '#FFFFFF',
                fontWeight: 800,
                py: 1.6,
                px: 3.5,
                borderRadius: '14px',
                '&:hover': { bgcolor: '#128C7E' },
              }}
            >
              Enroll via WhatsApp
            </Button>
            <Button
              component="a"
              href={`tel:${cleanPhone}`}
              variant="outlined"
              size="large"
              startIcon={<PhoneIcon />}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                fontWeight: 700,
                py: 1.6,
                px: 3.5,
                borderRadius: '14px',
                '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255, 255, 255, 0.08)' },
              }}
            >
              Call Clinic
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AnnualHealthPlan;
