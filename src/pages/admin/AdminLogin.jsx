import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  Chip,
  Grid,
  Stack,
  IconButton,
  InputAdornment,
  Divider,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShieldIcon from '@mui/icons-material/Shield';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BoltIcon from '@mui/icons-material/Bolt';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

// Google SVG Icon
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const defaultAdminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'dr.bhartidentalclinic@gmail.com';
const defaultAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'Bharti@123';

const AdminLogin = () => {
  const [email, setEmail] = useState(defaultAdminEmail);
  const [password, setPassword] = useState(defaultAdminPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginWithEmail, loginWithGoogle } = useAuth();
  const { doctorProfile } = useApp() || {};
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const res = await loginWithEmail(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Google sign in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail(defaultAdminEmail);
    setPassword(defaultAdminPassword);
    setErrorMsg('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#06182A',
        background: 'radial-gradient(circle at 15% 20%, #0F4C81 0%, #06182A 55%), radial-gradient(circle at 85% 80%, #005F56 0%, #06182A 60%)',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
      }}
    >
      {/* Decorative Ambient Background Glows */}
      <Box
        sx={{
          position: 'absolute',
          top: -60,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: '50%',
          bgcolor: 'rgba(225, 29, 72, 0.15)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          right: -60,
          width: 320,
          height: 320,
          borderRadius: '50%',
          bgcolor: 'rgba(15, 76, 129, 0.25)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, my: 'auto' }}>
        {/* Back Link Row */}
        <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon />}
            size="small"
            sx={{
              color: '#94A3B8',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              px: 2,
              py: 0.5,
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'none',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                borderColor: '#E11D48',
              },
            }}
          >
            Back to Website
          </Button>

          <Chip
            icon={<ShieldIcon sx={{ fontSize: '13px !important', color: '#F43F5E !important' }} />}
            label="Firebase Cloud Serverless Auth"
            size="small"
            sx={{
              bgcolor: 'rgba(225, 29, 72, 0.12)',
              color: '#F43F5E',
              fontWeight: 700,
              fontSize: '0.72rem',
              border: '1px solid rgba(225, 29, 72, 0.25)',
            }}
          />
        </Box>

        {/* Master Single-Screen Executive Card */}
        <Paper
          elevation={24}
          sx={{
            borderRadius: { xs: '20px', sm: '24px' },
            overflow: 'hidden',
            bgcolor: '#FFFFFF',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 35px rgba(225, 29, 72, 0.15)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Grid container alignItems="stretch">
            {/* LEFT SIDE: Doctor App Clip Art Showcase */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                background: 'linear-gradient(145deg, #071E33 0%, #0A2F4A 100%)',
                color: '#FFFFFF',
                p: { xs: 2.5, sm: 3.5 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRight: { md: '1px solid rgba(255, 255, 255, 0.08)' },
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight={900} color="#FFFFFF" sx={{ fontSize: '1.3rem', mb: 0.5 }}>
                  {doctorProfile?.name ? doctorProfile.name.replace(/,.*$/, '') : 'Doctor Clinic'}{' '}
                  <span style={{ color: '#F43F5E' }}>Portal</span>
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontSize: '0.78rem', lineHeight: 1.4 }}>
                  Serverless Multi-Doctor Cloud Architecture
                </Typography>
              </Box>

              {/* 3D Dental Clip Art Image */}
              <Box
                component={motion.div}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 220,
                  mx: 'auto',
                  my: { xs: 2, md: 2.5 },
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 25px rgba(225, 29, 72, 0.2)',
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <Box
                  component="img"
                  src="/assets/clipart/dental_login_art.png"
                  alt="Doctor Clinic Art"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              {/* Benefits List */}
              <Stack spacing={0.8} sx={{ pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonthIcon sx={{ fontSize: 15, color: '#38BDF8' }} />
                  <Typography variant="caption" sx={{ color: '#CBD5E1', fontWeight: 600, fontSize: '0.74rem' }}>
                    Interactive Calendar & Slot Booking
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldIcon sx={{ fontSize: 15, color: '#10B981' }} />
                  <Typography variant="caption" sx={{ color: '#CBD5E1', fontWeight: 600, fontSize: '0.74rem' }}>
                    Unique Doctor ID Data Isolation
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WhatsAppIcon sx={{ fontSize: 15, color: '#25D366' }} />
                  <Typography variant="caption" sx={{ color: '#CBD5E1', fontWeight: 600, fontSize: '0.74rem' }}>
                    Real-time WhatsApp Alerts
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* RIGHT SIDE: Admin Sign-In / Register Form */}
            <Grid
              item
              xs={12}
              md={7}
              sx={{
                p: { xs: 3, sm: 3.5 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                bgcolor: '#FFFFFF',
              }}
            >
              {/* Doctor Sign In Header */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h5"
                  fontWeight={800}
                  color="#0F4C81"
                  sx={{
                    letterSpacing: '-0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: { xs: '1.25rem', sm: '1.45rem' },
                  }}
                >
                  <AdminPanelSettingsIcon sx={{ fontSize: 26, color: '#E11D48' }} />
                  Doctor Sign In
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Sign in with your authorized Firebase administrator credentials.
                </Typography>
              </Box>

              {/* Admin Credentials Box */}
              <Paper
                elevation={0}
                sx={{
                  p: 1.1,
                  px: 1.5,
                  borderRadius: '10px',
                  bgcolor: '#fce5e5',
                  border: '1px solid #fecdd3',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#881337' }}>
                  🔑 <strong>Admin:</strong> <code>{defaultAdminEmail}</code> | <code>{defaultAdminPassword}</code>
                </Typography>
                <Button
                  size="small"
                  onClick={handleFillDemo}
                  startIcon={<BoltIcon sx={{ fontSize: 13 }} />}
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: '#E11D48',
                    bgcolor: '#FFE4E6',
                    py: 0.2,
                    px: 0.8,
                    borderRadius: '6px',
                    textTransform: 'none',
                    minWidth: 'auto',
                    '&:hover': { bgcolor: '#FECDD3' },
                  }}
                >
                  Auto-Fill
                </Button>
              </Paper>

              {errorMsg && (
                <Alert severity="error" sx={{ mb: 2, py: 0.3, borderRadius: '8px', fontSize: '0.8rem' }}>
                  {errorMsg}
                </Alert>
              )}

              {/* SIGN IN FORM (Only Sign In Allowed) */}
              <form onSubmit={handleLogin}>
                <TextField
                  label="Doctor Email *"
                  type="email"
                  fullWidth
                  size="small"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@clinic.com"
                  sx={{ mb: 1.8 }}
                />

                <TextField
                  label="Password *"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  size="small"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  sx={{ mb: 2.2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: '#64748B' }}
                        >
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <LockOutlinedIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    py: 1.2,
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    borderRadius: '10px',
                    bgcolor: '#0F172A',
                    background: 'linear-gradient(135deg, #0A2540 0%, #E11D48 100%)',
                    boxShadow: '0 6px 18px rgba(225, 29, 72, 0.3)',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #06182A 0%, #BE123C 100%)',
                    },
                  }}
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In to Doctor Dashboard'}
                </Button>
              </form>

              {/* Footnote */}
              <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.6 }}>
                <ShieldIcon sx={{ fontSize: 13, color: '#E11D48' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem', fontWeight: 600 }}>
                  256-bit SSL Encrypted Doctor Session
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
