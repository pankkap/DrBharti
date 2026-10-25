import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About Doctor', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Aesthetic', path: '/aesthetic' },
  { label: 'Annual Plan', path: '/annual-health-plan' },
  { label: 'Reviews', path: '/testimonials' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const { doctorProfile } = useApp();
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Top Clinic Status Announcement Bar */}
      <Box
        sx={{
          bgcolor: '#06182A',
          color: '#E2E8F0',
          py: 0.75,
          px: 2,
          fontSize: '0.82rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <span className="live-dot" />
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#E2E8F0', display: { xs: 'none', sm: 'inline' } }}>
                Accepting Patients Today:
              </Typography>
              <Typography variant="caption" sx={{ color: '#F43F5E', fontWeight: 700 }}>
                Next Online Slot: 10:30 AM (Immediate WhatsApp Pass)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Typography
                component="a"
                href={`tel:${doctorProfile?.phone ? doctorProfile.phone.replace(/[^+\d]/g, '') : ''}`}
                variant="caption"
                sx={{
                  color: '#94A3B8',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '&:hover': { color: '#E11D48' },
                }}
              >
                <PhoneInTalkIcon sx={{ fontSize: 14, color: '#E11D48' }} />
                <span>Emergency: <strong>{doctorProfile.phone}</strong></span>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Sticky Main Navigation */}
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          bgcolor: isScrolled ? 'rgba(255, 255, 255, 0.88)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: isScrolled ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid transparent',
          transition: 'all 0.3s ease',
          boxShadow: isScrolled ? '0 10px 30px -10px rgba(10, 37, 64, 0.08)' : 'none',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: { xs: 1, md: 1.25 }, px: { xs: 0, sm: 1 } }}>
            {/* Brand Logo & Doctor Specialty */}
            <Box
              component={Link}
              to="/"
              onClick={handleNavClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '14px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(225, 29, 72, 0.22)',
                  border: '1.5px solid rgba(225, 29, 72, 0.2)',
                  flexShrink: 0,
                  backgroundColor: '#FFF',
                }}
              >
                <Box
                  component="img"
                  src="/assets/logo.png"
                  alt="Dr. Bharti Clinic Logo"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </motion.div>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    color="#0A2540"
                    sx={{ lineHeight: 1.1, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}
                  >
                    {doctorProfile.name}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                  {doctorProfile.title || "Director of Aesthetic Dentistry & Oral Implantology"}
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation Links */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 0.5, position: 'relative' }}>
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Box key={link.path} sx={{ position: 'relative' }}>
                    <Button
                      component={Link}
                      to={link.path}
                      onClick={handleNavClick}
                      sx={{
                        color: isActive ? '#0F172A' : '#475569',
                        fontWeight: isActive ? 700 : 500,
                        borderRadius: '8px',
                        px: { lg: 1.15, xl: 1.6 },
                        py: 0.7,
                        fontSize: { lg: '0.85rem', xl: '0.9rem' },
                        transition: 'color 0.15s ease',
                        zIndex: 1,
                        '&:hover': {
                          color: '#0F172A',
                          backgroundColor: 'rgba(15, 23, 42, 0.04)',
                        },
                      }}
                    >
                      {link.label}
                    </Button>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(15, 23, 42, 0.06)',
                          borderRadius: '8px',
                          border: '1px solid rgba(15, 23, 42, 0.12)',
                          zIndex: 0,
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* Action CTAs */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.25 }}>
              <Button
                component={Link}
                to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
                onClick={handleNavClick}
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<AdminPanelSettingsIcon sx={{ fontSize: 18 }} />}
                sx={{
                  borderRadius: '8px',
                  px: 1.75,
                  py: 0.75,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderColor: '#CBD5E1',
                  color: '#334155',
                  '&:hover': {
                    borderColor: '#0F172A',
                    color: '#0F172A',
                    backgroundColor: 'rgba(15, 23, 42, 0.03)',
                  },
                }}
              >
                {isAuthenticated ? 'Admin Desk' : 'Portal'}
              </Button>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  component={Link}
                  to="/book-appointment"
                  onClick={handleNavClick}
                  variant="contained"
                  color="secondary"
                  startIcon={<CalendarMonthIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    borderRadius: '8px',
                    px: 2.5,
                    py: 0.85,
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    boxShadow: '0 2px 8px rgba(225, 29, 72, 0.25)',
                  }}
                >
                  Book Appointment
                </Button>
              </motion.div>
            </Box>

            {/* Mobile Hamburger Toggle */}
            <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
              <IconButton onClick={handleDrawerToggle} color="inherit" sx={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          PaperProps={{
            sx: {
              width: 300,
              p: 3,
              borderRadius: '24px 0 0 24px',
              bgcolor: '#FFFFFF',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                component="img"
                src="/assets/logo.png"
                alt="Dr. Bharti Logo"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  objectFit: 'cover',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(225, 29, 72, 0.2)',
                }}
              />
              <Typography variant="subtitle1" fontWeight={800} color="#0A2540">
                Menu Navigation
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerToggle} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ p: 0 }}>
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <ListItem
                  button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  onClick={handleNavClick}
                  sx={{
                    borderRadius: 3,
                    mb: 0.75,
                    bgcolor: isActive ? 'rgba(225, 29, 72, 0.1)' : 'transparent',
                    color: isActive ? '#E11D48' : '#0F172A',
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }} />
                </ListItem>
              );
            })}

            <ListItem
              button
              component={Link}
              to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
              onClick={handleNavClick}
              sx={{ borderRadius: 3, mt: 1, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}
            >
              <ListItemText
                primary={isAuthenticated ? 'Admin Dashboard' : 'Doctor Portal Login'}
                primaryTypographyProps={{ fontWeight: 700, color: '#0A2540', fontSize: '0.9rem' }}
              />
            </ListItem>
          </List>

          <Box mt={4}>
            <Button
              component={Link}
              to="/book-appointment"
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleNavClick}
              startIcon={<CalendarMonthIcon />}
              sx={{ py: 1.25, fontWeight: 700 }}
            >
              Book Appointment
            </Button>
          </Box>
        </Drawer>
      </AppBar>
    </>
  );
};

export default Navbar;
