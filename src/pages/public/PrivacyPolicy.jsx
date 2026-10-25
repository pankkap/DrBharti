import React from 'react';
import { Container, Paper, Typography, Box, Divider, Chip } from '@mui/material';
import ShieldCheckIcon from '@mui/icons-material/GppGood';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const PrivacyPolicy = () => {
  const { doctorProfile } = useApp();
  const doctorName = doctorProfile?.name || 'Dr. Bharti';
  const clinicName = doctorProfile?.clinicName || 'Greater Noida Aesthetic Dental Clinic';

  return (
    <Box className="bg-mesh-subtle" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3.5, md: 6 },
              borderRadius: '32px',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              bgcolor: '#FFFFFF',
              boxShadow: '0 10px 30px -10px rgba(10, 37, 64, 0.06)',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Chip
                icon={<ShieldCheckIcon sx={{ color: '#E11D48 !important' }} />}
                label="PATIENT DATA PROTECTION & CONFIDENTIALITY"
                sx={{ bgcolor: 'rgba(225, 29, 72, 0.1)', color: '#E11D48', fontWeight: 700, mb: 1.5 }}
              />
              <Typography variant="h1" color="#0A2540" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} mb={1}>
                Privacy & Medical Data Policy
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Last Verified: August 2026 • HIPAA Compliant Diagnostic Data Handling
              </Typography>
            </Box>

            <Divider sx={{ mb: 4, borderColor: '#F1F5F9' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, color: 'text.primary', lineHeight: 1.8 }}>
              <Typography variant="body1" sx={{ fontSize: '1.02rem', color: '#334155' }}>
                Welcome to {doctorName}'s {clinicName} practice portal. We prioritize patient confidentiality and security above all. This policy explains how patient information collected through our online portal, WhatsApp alert service, and AI Concierge is protected.
              </Typography>

              <Box>
                <Typography variant="h5" color="#0A2540" fontWeight={800} mb={1}>
                  1. Information We Collect
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  When you schedule a consultation, we collect your Full Name, WhatsApp Number, Email, Age, Gender, Address, and primary Health Problem. This information is solely used to verify your slot, send automated booking passes, and prepare {doctorName} for your clinical evaluation.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" color="#0A2540" fontWeight={800} mb={1}>
                  2. Automated WhatsApp Cloud API Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  We utilize the official Meta WhatsApp Cloud API for instant transactional notifications, date/time queue passes, and clinic location pins. Your phone number is encrypted and never shared with external marketers or third parties.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" color="#0A2540" fontWeight={800} mb={1}>
                  3. Clinical Confidentiality & Security
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  In accordance with medical practice ethics, your health symptoms and diagnostic records are strictly confidential and accessible exclusively by {doctorName} and authorized clinical staff.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" color="#0A2540" fontWeight={800} mb={1}>
                  4. Patient Access Rights
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  Patients may request a copy or deletion of their appointment logs at any time by contacting clinic reception directly.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
