import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Stack,
  Paper,
  IconButton,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedIcon from '@mui/icons-material/Verified';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StarIcon from '@mui/icons-material/Star';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import PersonIcon from '@mui/icons-material/Person';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ShieldIcon from '@mui/icons-material/Shield';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

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

const AnnualHealthPlanModal = ({ open, onClose }) => {
  const { doctorProfile } = useApp();
  const [selectedTier, setSelectedTier] = useState('comprehensive');
  const navigate = useNavigate();

  const activePlan = PLAN_TIERS.find((p) => p.id === selectedTier) || PLAN_TIERS[1];

  const cleanPhone = (doctorProfile?.phone || '+91 97292 80731').replace(/[^+\d]/g, '');
  const waNumber = (doctorProfile?.whatsappNumber || '919729280731').replace(/\D/g, '');

  const handleBookWithPlan = (tierName) => {
    onClose();
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="body"
      PaperProps={{
        sx: {
          borderRadius: { xs: '20px', md: '28px' },
          overflow: 'hidden',
          bgcolor: '#FFFFFF',
          boxShadow: '0 25px 60px -15px rgba(10, 37, 64, 0.35)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          m: { xs: 1.5, sm: 3 },
        },
      }}
    >
      {/* Top Banner Header */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#06182A',
          color: '#FFFFFF',
          p: { xs: 3, sm: 4.5 },
          background: 'linear-gradient(135deg, #06182A 0%, #0A2E4C 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: { xs: 12, sm: 18 },
            right: { xs: 12, sm: 18 },
            color: '#FFFFFF',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ maxWidth: 820 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <Chip
              icon={<CardMembershipIcon sx={{ color: '#10B981 !important', fontSize: '16px !important' }} />}
              label="APEX 365 DENTAL WELLNESS MEMBERSHIP"
              size="small"
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.15)',
                color: '#34D399',
                fontWeight: 800,
                fontSize: '0.75rem',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            />
            <Chip
              label="Zero Insurance Waiting Period"
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                color: '#E2E8F0',
                fontWeight: 600,
                fontSize: '0.72rem',
              }}
            />
          </Stack>

          <Typography
            variant="h3"
            fontWeight={900}
            color="#FFFFFF"
            sx={{
              color: '#FFFFFF !important',
              fontSize: { xs: '1.75rem', sm: '2.4rem' },
              mb: 1.2,
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
              letterSpacing: '-0.01em',
            }}
          >
            Annual Dental Health & Wellness Plan
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#CBD5E1',
              lineHeight: 1.7,
              fontSize: { xs: '0.92rem', sm: '1.05rem' },
              '& strong': { color: '#FFFFFF' },
            }}
          >
            Comprehensive 365-day dental health coverage for individuals and families. Enjoy 100% covered preventative cleanings, full digital 3D diagnostics, and guaranteed VIP member discounts on every single treatment with <strong>{doctorProfile?.name || 'Dr. Bharti, MDS'}</strong>.
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ p: { xs: 2.5, sm: 4.5 } }}>
        {/* Core Perks Highlights Bar */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { title: '100% Free Preventative Care', sub: '2x Cleanings, Polish & Exams/yr', icon: <CheckCircleIcon sx={{ color: '#E11D48' }} /> },
            { title: 'Up to 20% Off All Treatments', sub: 'Fillings, Implants, Braces & Veneers', icon: <AutoAwesomeIcon sx={{ color: '#F59E0B' }} /> },
            { title: 'Priority Emergency Access', sub: 'Same-day relief for acute dental pain', icon: <ShieldIcon sx={{ color: '#2563EB' }} /> },
            { title: 'Transparent Pricing', sub: 'Zero hidden clauses or claim paperwork', icon: <VerifiedIcon sx={{ color: '#10B981' }} /> },
          ].map((perk, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  bgcolor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  height: '100%',
                }}
              >
                {perk.icon}
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} color="#0A2540" sx={{ fontSize: '0.86rem' }}>
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

        {/* Section Heading: Membership Tiers */}
        <Box sx={{ textAlign: 'center', mb: 3.5 }}>
          <Typography variant="h4" fontWeight={800} color="#0A2540" sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem' } }}>
            Choose Your 365-Day Membership Tier
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Select the plan tailored to your lifestyle. Active immediately upon enrollment with zero waiting times.
          </Typography>
        </Box>

        {/* 3 Tier Pricing Cards */}
        <Grid container spacing={3} alignItems="stretch" sx={{ mb: 5 }}>
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
                    borderRadius: '22px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    overflow: 'visible',
                    border: isSelected ? '2.5px solid #E11D48' : '1px solid #FBCFE8',
                    bgcolor: isSelected ? '#fce5e5' : '#FFFFFF',
                    boxShadow: isSelected ? '0 12px 30px rgba(225, 29, 72, 0.18)' : '0 4px 16px rgba(0,0,0,0.03)',
                    p: 3,
                    '&:hover': {
                      borderColor: '#E11D48',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  {/* Top Badge */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tier.icon}
                      <Typography variant="h6" fontWeight={800} color="#0A2540">
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
                        fontSize: '0.72rem',
                        mb: 1.5,
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                      <Typography variant="h3" fontWeight={900} color="#0A2540">
                        {tier.price}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                        {tier.period}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#E11D48', fontWeight: 700, display: 'block', mt: 0.5 }}>
                      {tier.savingsText}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, minHeight: 44, lineHeight: 1.5, fontSize: '0.84rem' }}>
                      {tier.description}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5, borderColor: isSelected ? '#FECDD3' : '#F1F5F9' }} />

                  {/* Feature Checklist */}
                  <Stack spacing={1.2} sx={{ mb: 3, flexGrow: 1 }}>
                    {tier.features.map((feat, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: '#E11D48', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                          {feat}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  {/* Enroll CTA */}
                  <Button
                    variant={isSelected ? 'contained' : 'outlined'}
                    color={tier.isPopular ? 'secondary' : 'primary'}
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookWithPlan(tier.name);
                    }}
                    sx={{
                      py: 1.2,
                      fontWeight: 800,
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontSize: '0.92rem',
                    }}
                  >
                    Select & Enroll Now →
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Coverage Comparison Table: Plan vs Standard */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: '20px',
            bgcolor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            mb: 4,
          }}
        >
          <Typography variant="h5" fontWeight={800} color="#0A2540" sx={{ mb: 0.5 }}>
            💡 Cost Comparison: Pay-As-You-Go vs Annual Health Plan
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            See how much you save on essential diagnostic and therapeutic dental care throughout the year.
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                  <th style={{ padding: '10px 14px', color: '#475569', fontSize: '0.85rem', fontWeight: 800 }}>Clinical Procedure / Service</th>
                  <th style={{ padding: '10px 14px', color: '#475569', fontSize: '0.85rem', fontWeight: 800 }}>Standard Clinic Cost</th>
                  <th style={{ padding: '10px 14px', color: '#E11D48', fontSize: '0.85rem', fontWeight: 800 }}>With Annual Health Plan</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ITEMS.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '12px 14px', fontSize: '0.88rem', color: '#1E293B', fontWeight: 600 }}>{item.service}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.88rem', color: '#64748B' }}>{item.standard}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.88rem', color: '#BE123C', fontWeight: 800 }}>
                      <span style={{ backgroundColor: '#fce5e5', border: '1px solid #FECDD3', padding: '3px 8px', borderRadius: '6px' }}>
                        {item.plan}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>

        {/* Doctor Commitment & FAQ Box */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '18px',
            bgcolor: '#FFFFFF',
            border: '1.5px solid #FECDD3',
            boxShadow: '0 4px 16px rgba(225, 29, 72, 0.08)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2.5,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={800} color="#0A2540">
              Have Questions Before Joining?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              Speak directly with our front desk or message on WhatsApp to activate your annual pass instantly.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button
              component="a"
              href={getWaEnrollUrl()}
              target="_blank"
              variant="contained"
              startIcon={<WhatsAppIcon />}
              sx={{
                bgcolor: '#25D366',
                color: '#FFFFFF',
                fontWeight: 700,
                textTransform: 'none',
                py: 1.2,
                px: 2.5,
                borderRadius: '12px',
                '&:hover': { bgcolor: '#128C7E' },
              }}
            >
              Inquire via WhatsApp
            </Button>
            <Button
              component="a"
              href={`tel:${cleanPhone}`}
              variant="outlined"
              color="primary"
              startIcon={<PhoneIcon />}
              sx={{
                fontWeight: 700,
                textTransform: 'none',
                py: 1.2,
                px: 2.5,
                borderRadius: '12px',
              }}
            >
              Call Clinic
            </Button>
          </Stack>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default AnnualHealthPlanModal;
