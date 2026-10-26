import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CollectionsIcon from '@mui/icons-material/Collections';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MailIcon from '@mui/icons-material/Mail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LogoutIcon from '@mui/icons-material/Logout';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VerifiedIcon from '@mui/icons-material/Verified';
import CircleIcon from '@mui/icons-material/Circle';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const drawerWidth = 280;

const NAVIGATION_SECTIONS = [
  {
    category: 'MAIN OVERVIEW',
    items: [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
      { text: 'Manage Appointments', icon: <CalendarMonthIcon />, path: '/admin/appointments' },
      { text: 'Patient Directory', icon: <PeopleIcon />, path: '/admin/patients' },
    ],
  },
  {
    category: 'CLINIC MANAGEMENT',
    items: [
      { text: 'Manage Services', icon: <MedicalServicesIcon />, path: '/admin/services' },
      { text: 'Manage Testimonials', icon: <RateReviewIcon />, path: '/admin/testimonials' },
      { text: 'Manage Gallery', icon: <CollectionsIcon />, path: '/admin/gallery' },
      { text: 'Manage FAQ', icon: <HelpOutlineIcon />, path: '/admin/faq' },
      { text: 'Contact Requests', icon: <MailIcon />, path: '/admin/contacts' },
      { text: 'Discount Coupons', icon: <LocalOfferIcon />, path: '/admin/coupons' },
    ],
  },
  {
    category: 'SETTINGS & CHANNELS',
    items: [
      { text: 'Doctor Profile', icon: <AccountCircleIcon />, path: '/admin/doctor-profile' },
      { text: 'WhatsApp Notifications', icon: <WhatsAppIcon />, path: '/admin/whatsapp-settings' },
    ],
  },
];

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { adminUser, logout } = useAuth();
  const { appointments, doctorProfile } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'transparent',
        color: '#FFF',
      }}
    >
      {/* Doctor Admin Header */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.8,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.03)',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={doctorProfile.avatar}
            sx={{
              width: 52,
              height: 52,
              border: '2.5px solid #E11D48',
              boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 13,
              height: 13,
              bgcolor: '#10B981',
              borderRadius: '50%',
              border: '2.5px solid #091524',
            }}
          />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="subtitle1"
            fontWeight={800}
            color="#FFFFFF"
            noWrap
            sx={{ letterSpacing: '-0.02em', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            {doctorProfile.name}
            <VerifiedIcon sx={{ fontSize: 16, color: '#E11D48' }} />
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#F43F5E',
              fontWeight: 700,
              fontSize: '0.74rem',
              display: 'block',
              mt: 0.2,
            }}
          >
            Administrator
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#94A3B8',
              fontSize: '0.7rem',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {adminUser?.email || 'admin@beta-labs.in'}
          </Typography>
        </Box>
      </Box>

      {/* Navigation Groups */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1.5, py: 1.5 }}>
        {NAVIGATION_SECTIONS.map((section) => (
          <Box key={section.category} sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                px: 2,
                py: 0.5,
                display: 'block',
                color: '#94A3B8',
                fontWeight: 800,
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {section.category}
            </Typography>

            <List disablePadding sx={{ mt: 0.5 }}>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      selected={isActive}
                      sx={{
                        borderRadius: 2.5,
                        py: 1.1,
                        px: 1.8,
                        color: isActive ? '#FFFFFF !important' : '#CBD5E1 !important',
                        background: isActive
                          ? 'linear-gradient(90deg, #E11D48 0%, #BE123C 100%) !important'
                          : 'transparent',
                        boxShadow: isActive ? '0 4px 14px rgba(225, 29, 72, 0.4)' : 'none',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        '& .MuiListItemText-primary': {
                          color: isActive ? '#FFFFFF !important' : '#CBD5E1 !important',
                          fontSize: '0.88rem',
                          fontWeight: isActive ? 700 : 500,
                          letterSpacing: '-0.01em',
                          transition: 'color 0.2s ease',
                        },
                        '& .MuiListItemIcon-root': {
                          color: isActive ? '#FFFFFF !important' : '#94A3B8 !important',
                          transition: 'color 0.2s ease',
                        },
                        '&.Mui-selected': {
                          background: 'linear-gradient(90deg, #E11D48 0%, #BE123C 100%) !important',
                          color: '#FFFFFF !important',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #E11D48 0%, #BE123C 100%) !important',
                          },
                          '& .MuiListItemText-primary': {
                            color: '#FFFFFF !important',
                            fontWeight: 700,
                          },
                          '& .MuiListItemIcon-root': {
                            color: '#FFFFFF !important',
                          },
                        },
                        '&:hover': {
                          bgcolor: isActive ? '#E11D48' : 'rgba(255,255,255,0.08)',
                          color: '#FFFFFF !important',
                          transform: 'translateX(4px)',
                          '& .MuiListItemIcon-root': {
                            color: '#FDA4AF !important',
                          },
                          '& .MuiListItemText-primary': {
                            color: '#FFFFFF !important',
                          },
                        },
                      }}
                    >
                      {isActive && (
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: '20%',
                            bottom: '20%',
                            width: 3.5,
                            borderRadius: '0 4px 4px 0',
                            bgcolor: '#FFFFFF',
                          }}
                        />
                      )}
                      <ListItemIcon
                        sx={{
                          color: isActive ? '#FFFFFF !important' : '#94A3B8 !important',
                          minWidth: 36,
                          '& svg': { fontSize: 20 },
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.88rem',
                          fontWeight: isActive ? 700 : 500,
                          letterSpacing: '-0.01em',
                          sx: {
                            color: isActive ? '#FFFFFF !important' : '#CBD5E1 !important',
                          },
                        }}
                      />
                      {item.text === 'Manage Appointments' && pendingCount > 0 && (
                        <Chip
                          label={pendingCount}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            bgcolor: isActive ? '#FFFFFF' : '#EF4444',
                            color: isActive ? '#BE123C' : '#FFFFFF',
                            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />

      {/* Bottom Footer Actions */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          component={Link}
          to="/"
          target="_blank"
          endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
          sx={{
            mb: 1.2,
            py: 0.9,
            borderRadius: 2.5,
            borderColor: 'rgba(255,255,255,0.12)',
            color: '#E2E8F0',
            textTransform: 'none',
            fontSize: '0.84rem',
            fontWeight: 600,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.06)',
              borderColor: 'rgba(255,255,255,0.25)',
            },
          }}
        >
          View Public Site
        </Button>

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            py: 0.9,
            borderRadius: 2.5,
            bgcolor: 'rgba(239, 68, 68, 0.15)',
            color: '#F87171',
            textTransform: 'none',
            fontSize: '0.84rem',
            fontWeight: 700,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#EF4444',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
            },
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F7FB' }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backdropFilter: 'blur(12px)',
          bgcolor: 'rgba(255, 255, 255, 0.94)',
          borderBottom: '1px solid #E2E8F0',
          color: '#1E293B',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: 70 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1, display: { sm: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} color="#0F4C81" sx={{ letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Clinic Management Portal
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {doctorProfile.name} • {doctorProfile.title}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {adminUser?.email && (
              <Chip
                avatar={
                  <Avatar sx={{ bgcolor: '#E11D48', color: '#FFF', fontSize: '11px !important', fontWeight: 800 }}>
                    {adminUser.email[0].toUpperCase()}
                  </Avatar>
                }
                label={adminUser.email}
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  borderColor: '#CBD5E1',
                  color: '#334155',
                  bgcolor: 'rgba(241, 245, 249, 0.7)',
                  display: { xs: 'none', md: 'inline-flex' },
                }}
              />
            )}
            <Chip
              icon={<CircleIcon sx={{ fontSize: '10px !important', color: '#10B981 !important' }} />}
              label="WhatsApp API Active"
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.78rem',
                bgcolor: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                px: 0.5,
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(180deg, #091524 0%, #0F2238 50%, #081422 100%)',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFF',
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(180deg, #091524 0%, #0F2238 50%, #081422 100%)',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '4px 0 24px rgba(0, 0, 0, 0.25)',
              color: '#FFF',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content View */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, sm: 3.5 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 8, sm: 9 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;

