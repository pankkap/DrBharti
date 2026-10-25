import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';
import PeopleIcon from '@mui/icons-material/People';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LanguageIcon from '@mui/icons-material/Language';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PhoneIcon from '@mui/icons-material/Phone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import SyncIcon from '@mui/icons-material/Sync';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getDirectWhatsAppUrl } from '../../services/whatsappClientService';
import { syncAllDataToFirebase } from '../../services/seedFirebaseData';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
  const {
    appointments,
    patients = [],
    doctorProfile,
    discountLeads = [],
    discountConfig,
    services,
    testimonials,
    faqs,
    gallery,
    whatsappSettings,
    activeDoctorId,
    showCursorSnack,
  } = useApp();
  const navigate = useNavigate();

  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ message: '', percent: 0 });
  const [syncResult, setSyncResult] = useState(null);

  const handleCloudUpload = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await syncAllDataToFirebase(
        activeDoctorId || 'doc001',
        {
          doctorProfile,
          appointments,
          patients,
          gallery,
          services,
          testimonials,
          faqs,
          whatsappSettings,
          discountConfig,
        },
        (message, percent) => {
          setSyncProgress({ message, percent });
        }
      );
      setSyncResult(res);
      if (res.success && showCursorSnack) {
        showCursorSnack('All data & photos successfully uploaded to Firebase Cloud!', null, {
          title: 'Cloud Upload Complete',
          severity: 'success',
        });
      }
    } catch (err) {
      setSyncResult({ success: false, error: err.message });
    } finally {
      setSyncing(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const todayCount = appointments.filter((a) => a.preferredDate === todayStr).length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Rejected' || a.status === 'Cancelled').length;
  const totalCount = appointments.length;

  const exportToExcel = () => {
    const worksheetData = appointments.map((apt) => ({
      'Appointment ID': apt.id,
      'Patient Name': apt.patientName,
      'Mobile Number': apt.mobile,
      Email: apt.email || 'N/A',
      Age: apt.age || 'N/A',
      Gender: apt.gender || 'N/A',
      Problem: apt.problem,
      'Preferred Date': apt.preferredDate,
      'Preferred Time': apt.preferredTime,
      Status: apt.status,
      Source: apt.source || 'Website',
      'Created At': new Date(apt.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments');
    XLSX.writeFile(workbook, `Appointments_Export_${todayStr}.xlsx`);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <Chip
            label="Approved"
            size="small"
            sx={{
              bgcolor: '#ECFDF5',
              color: '#065F46',
              fontWeight: 700,
              border: '1px solid #A7F3D0',
              borderRadius: 2,
            }}
          />
        );
      case 'Completed':
        return (
          <Chip
            label="Completed"
            size="small"
            sx={{
              bgcolor: '#EFF6FF',
              color: '#1E40AF',
              fontWeight: 700,
              border: '1px solid #BFDBFE',
              borderRadius: 2,
            }}
          />
        );
      case 'Rescheduled':
        return (
          <Chip
            label="Rescheduled"
            size="small"
            sx={{
              bgcolor: '#FFFBEB',
              color: '#B45309',
              fontWeight: 700,
              border: '1px solid #FDE68A',
              borderRadius: 2,
            }}
          />
        );
      case 'Rejected':
      case 'Cancelled':
        return (
          <Chip
            label="Rejected"
            size="small"
            sx={{
              bgcolor: '#FEF2F2',
              color: '#991B1B',
              fontWeight: 700,
              border: '1px solid #FECACA',
              borderRadius: 2,
            }}
          />
        );
      default:
        return (
          <Chip
            label="Pending"
            size="small"
            sx={{
              bgcolor: '#FFF7ED',
              color: '#C2410C',
              fontWeight: 700,
              border: '1px solid #FFEDD5',
              borderRadius: 2,
            }}
          />
        );
    }
  };

  const STAT_CARDS = [
    {
      title: "TODAY'S BOOKINGS",
      value: todayCount,
      color: '#0284C7',
      bgLight: '#F0F9FF',
      icon: <CalendarMonthIcon sx={{ fontSize: 24, color: '#0284C7' }} />,
    },
    {
      title: 'PENDING REVIEW',
      value: pendingCount,
      color: '#EA580C',
      bgLight: '#FFF7ED',
      icon: <PendingActionsIcon sx={{ fontSize: 24, color: '#EA580C' }} />,
    },
    {
      title: 'COMPLETED',
      value: completedCount,
      color: '#059669',
      bgLight: '#ECFDF5',
      icon: <CheckCircleIcon sx={{ fontSize: 24, color: '#059669' }} />,
    },
    {
      title: 'CANCELLED',
      value: cancelledCount,
      color: '#DC2626',
      bgLight: '#FEF2F2',
      icon: <CancelIcon sx={{ fontSize: 24, color: '#DC2626' }} />,
    },
    {
      title: 'TOTAL PATIENTS',
      value: totalCount,
      color: '#E11D48',
      bgLight: '#fce5e5',
      icon: <PeopleIcon sx={{ fontSize: 24, color: '#E11D48' }} />,
    },
    {
      title: 'DISCOUNT LEADS',
      value: discountLeads.length,
      color: '#10B981',
      bgLight: '#ECFDF5',
      icon: <LocalOfferIcon sx={{ fontSize: 24, color: '#10B981' }} />,
    },
  ];

  return (
    <Box>
      {/* Welcome Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4.5 },
          borderRadius: 4.5,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0A2540 0%, #1E293B 50%, #BE123C 100%)',
          color: '#FFFFFF',
          mb: 3.5,
          boxShadow: '0 12px 32px rgba(225, 29, 72, 0.22)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2.5,
        }}
      >
        {/* Subtle Decorative Ambient Background Circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: '30%',
            width: 180,
            height: 180,
            borderRadius: '50%',
            bgcolor: 'rgba(225, 29, 72, 0.25)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1, flex: 1, minWidth: 280 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, bgcolor: 'rgba(255,255,255,0.15)', px: 1.5, py: 0.4, borderRadius: 3, mb: 1.5 }}>
            <AutoAwesomeIcon sx={{ fontSize: 16, color: '#FECDD3' }} />
            <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 700, letterSpacing: '0.02em' }}>
              WhatsApp API Automation Active
            </Typography>
          </Box>

          <Typography
            variant="h4"
            fontWeight={800}
            color="#FFFFFF"
            sx={{
              fontSize: { xs: '1.3rem', sm: '1.6rem', md: '1.85rem', lg: '2.05rem' },
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              mb: 1,
              whiteSpace: { sm: 'nowrap' },
            }}
          >
            👋 Welcome Back, {doctorProfile.name}!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#F1F5F9',
              fontSize: { xs: '0.9rem', sm: '0.98rem' },
              fontWeight: 400,
              opacity: 0.95,
              lineHeight: 1.5,
            }}
          >
            Here is your live clinic appointment overview. Patients booking via the AI Chatbot receive instant WhatsApp receipts and status notifications.
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            alignItems: { xs: 'stretch', sm: 'flex-end' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<FileDownloadIcon />}
            onClick={exportToExcel}
            sx={{
              bgcolor: '#FFFFFF',
              color: '#0F4C81',
              fontWeight: 800,
              fontSize: '0.9rem',
              py: 1.3,
              px: 3,
              borderRadius: 3,
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
              textTransform: 'none',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                bgcolor: '#F8FAFC',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
              },
            }}
          >
            Export to Excel
          </Button>

          <Button
            variant="contained"
            size="large"
            disabled={syncing}
            startIcon={
              syncing ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SyncIcon sx={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
              )
            }
            onClick={handleCloudUpload}
            sx={{
              bgcolor: '#E11D48',
              color: '#FFFFFF',
              border: '1.5px solid rgba(255, 255, 255, 0.45)',
              fontWeight: 800,
              fontSize: '0.9rem',
              py: 1.3,
              px: 3,
              borderRadius: 3,
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              textTransform: 'none',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                bgcolor: '#BE123C',
                borderColor: '#FFFFFF',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(225, 29, 72, 0.4)',
              },
              '&:disabled': {
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
              },
            }}
          >
            {syncing ? 'Syncing with Database...' : 'Sync with Database'}
          </Button>
        </Box>
      </Paper>

      {/* Sync Progress & Results (Appears seamlessly when syncing) */}
      {(syncing || syncResult) && (
        <Box sx={{ mb: 3.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {syncing && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: '1px solid #fecdd3',
                bgcolor: '#fce5e5',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography variant="body2" fontWeight={700} color="#0F4C81">
                  {syncProgress.message || 'Synchronizing with Database...'}
                </Typography>
                <Typography variant="body2" fontWeight={700} color="#E11D48">
                  {syncProgress.percent}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={syncProgress.percent}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#FFE4E6',
                  '& .MuiLinearProgress-bar': { bgcolor: '#E11D48' },
                }}
              />
            </Paper>
          )}

          {syncResult && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {syncResult.success ? (
                <Alert severity="success" onClose={() => setSyncResult(null)} sx={{ borderRadius: 2.5 }}>
                  <strong>Database Synchronization Complete!</strong> Successfully synchronized with Firebase:
                  <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                    <li>Doctor Profile & Avatar in Firebase Storage ({syncResult.results?.photosUploaded || 0} photos)</li>
                    <li>{syncResult.results?.appointmentsUploaded || 0} Appointments in Firestore</li>
                    <li>{syncResult.results?.patientsUploaded || 0} Patients in Firestore</li>
                    <li>{syncResult.results?.galleryUploaded || 0} Clinic Gallery items in Firestore</li>
                  </ul>
                </Alert>
              ) : (
                <>
                  {syncResult.results?.appointmentsUploaded > 0 && (
                    <Alert severity="info" sx={{ borderRadius: 2.5 }}>
                      ✓ <strong>Firestore Database:</strong> Successfully synchronized {syncResult.results.appointmentsUploaded} appointments, {syncResult.results.patientsUploaded} patients, and doctor profile!
                    </Alert>
                  )}

                  {syncResult.hasStorageErrors && (
                    <Alert severity="warning" onClose={() => setSyncResult(null)} sx={{ borderRadius: 2.5 }}>
                      <Typography variant="subtitle2" fontWeight={800} color="#92400E" sx={{ mb: 0.5 }}>
                        ⚠️ Firebase Storage Permission Denied (403 Forbidden)
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.82rem', mb: 1 }}>
                        Please make sure your Firebase Storage security rules are published with <code>allow read, write: if true;</code> under <code>match /DoctorApp/&#123;allPaths=**&#125;</code>.
                      </Typography>
                    </Alert>
                  )}

                  {syncResult.hasFirestoreErrors && (
                    <Alert severity="error" onClose={() => setSyncResult(null)} sx={{ borderRadius: 2.5 }}>
                      <strong>Firestore Error:</strong> {syncResult.results.firestoreErrors.join(', ')}
                    </Alert>
                  )}
                </>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* Analytics Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3.5 }}>
        {STAT_CARDS.map((stat) => (
          <Grid item xs={12} sm={4} md={2} key={stat.title} sx={{ display: 'flex' }}>
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                width: '100%',
                height: '100%',
                minHeight: 104,
                borderRadius: 4,
                bgcolor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(15, 76, 129, 0.08)',
                  borderColor: stat.color,
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748B',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      letterSpacing: '0.04em',
                      display: 'block',
                      mb: 0.5,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{
                      color: stat.value > 0 ? '#0F172A' : '#94A3B8',
                      fontSize: '1.9rem',
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: stat.bgLight,
                    borderRadius: 3,
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </Avatar>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Appointments Table */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 4,
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#0F4C81" sx={{ letterSpacing: '-0.01em' }}>
              Recent Appointments
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Latest patient bookings submitted via website and AI Chatbot.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/admin/appointments"
            endIcon={<ArrowForwardIcon />}
            sx={{
              fontWeight: 700,
              color: '#E11D48',
              textTransform: 'none',
              fontSize: '0.88rem',
              '&:hover': { bgcolor: 'rgba(225, 29, 72, 0.08)' },
            }}
          >
            Manage All Appointments
          </Button>
        </Box>

        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', py: 1.5 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', py: 1.5 }}>PATIENT</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', py: 1.5 }}>MOBILE</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', py: 1.5 }}>PROBLEM / REASON</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', py: 1.5 }}>DATE & TIME</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', py: 1.5 }}>SOURCE</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', py: 1.5 }}>STATUS</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', py: 1.5 }}>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No appointments booked yet.
                </TableCell>
              </TableRow>
            ) : (
              appointments.slice(0, 6).map((apt) => (
                <TableRow
                  key={apt.id}
                  hover
                  sx={{
                    transition: 'bgcolor 0.15s ease',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.82rem' }}>
                    {apt.id}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          bgcolor: '#E0F2FE',
                          color: '#0284C7',
                        }}
                      >
                        {apt.patientName ? apt.patientName.charAt(0).toUpperCase() : 'P'}
                      </Avatar>
                      <Typography variant="body2" fontWeight={700} color="#0F172A">
                        {apt.patientName}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ color: '#334155', fontSize: '0.85rem' }}>
                    {apt.mobile}
                  </TableCell>

                  <TableCell sx={{ color: '#334155', fontSize: '0.85rem' }}>
                    <Chip
                      label={apt.problem || 'General Consultation'}
                      size="small"
                      sx={{
                        bgcolor: '#F1F5F9',
                        color: '#334155',
                        fontWeight: 600,
                        fontSize: '0.76rem',
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ color: '#0F172A', fontWeight: 600, fontSize: '0.84rem' }}>
                    {`${apt.preferredDate} (${apt.preferredTime})`}
                  </TableCell>

                  <TableCell>
                    <Chip
                      icon={
                        apt.promoCode || apt.source?.includes('Code:') ? (
                           <LocalOfferIcon sx={{ fontSize: '14px !important', color: '#16A34A !important' }} />
                        ) : apt.source?.includes('Chatbot') || apt.source?.includes('AI') ? (
                          <SmartToyIcon sx={{ fontSize: '14px !important', color: '#E11D48 !important' }} />
                        ) : (
                          <LanguageIcon sx={{ fontSize: '14px !important', color: '#0284C7 !important' }} />
                        )
                      }
                      label={apt.promoCode ? `Promo (${apt.promoCode})` : (apt.source || 'Website')}
                      size="small"
                      sx={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        bgcolor: apt.promoCode || apt.source?.includes('Code:') ? '#DCFCE7' : apt.source?.includes('Chatbot') || apt.source?.includes('AI') ? '#fce5e5' : '#F0F9FF',
                        color: apt.promoCode || apt.source?.includes('Code:') ? '#15803D' : apt.source?.includes('Chatbot') || apt.source?.includes('AI') ? '#BE123C' : '#0369A1',
                      }}
                    />
                  </TableCell>

                  <TableCell>{getStatusChip(apt.status)}</TableCell>

                  <TableCell align="right">
                    <Tooltip title="Open Direct WhatsApp Chat">
                      <IconButton
                        size="small"
                        href={getDirectWhatsAppUrl(apt.mobile, `Hello ${apt.patientName}, this is regarding your appointment at ${doctorProfile.name}'s clinic.`)}
                        target="_blank"
                        sx={{
                          color: '#25D366',
                          bgcolor: '#ECFDF5',
                          '&:hover': { bgcolor: '#25D366', color: '#FFF' },
                        }}
                      >
                        <WhatsAppIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* 2. RECENT DISCOUNT COUPON LEADS TABLE */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 4,
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          mt: 4,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalOfferIcon sx={{ color: '#10B981' }} />
              <Typography variant="h5" fontWeight={800} color="#0A2540">
                Discount Coupon Leads ({discountLeads.length})
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              All patient phone inquiries who claimed discount vouchers from the website. Follow up via Direct Call or WhatsApp.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/admin/coupons"
            variant="outlined"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            sx={{ fontWeight: 700, borderRadius: 2.5 }}
          >
            Discount Coupon Manager
          </Button>
        </Box>

        <Table>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Patient Phone</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Coupon Code</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Offer</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Claimed On</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Quick Follow-Up</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discountLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#94A3B8' }}>
                  No discount coupon inquiries yet. Leads will appear here automatically when patients request discounts.
                </TableCell>
              </TableRow>
            ) : (
              discountLeads.map((lead) => {
                const cleanPhone = lead.phone.replace(/[^+\d]/g, '');
                const waNumber = lead.phone.replace(/\D/g, '');
                const waMsg = encodeURIComponent(
                  `Hello! We received your discount voucher request (Code: ${lead.code}) at Apex Dental Studio. Would you like to schedule your 20% discounted consultation?`
                );

                return (
                  <TableRow key={lead.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: '1.2rem' }}>🇮🇳</span>
                        <Typography variant="body2" fontWeight={800} color="#0A2540">
                          {lead.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={lead.code}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          bgcolor: '#EFF6FF',
                          color: '#2563EB',
                          border: '1px solid #BFDBFE',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700} color="#16A34A">
                        {lead.discount || '20% OFF'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={lead.status || 'Claimed'}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: lead.status === 'Booked' ? '#ECFDF5' : '#FEF3C7',
                          color: lead.status === 'Booked' ? '#065F46' : '#92400E',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title={`Call ${lead.phone}`}>
                          <IconButton
                            component="a"
                            href={`tel:${cleanPhone}`}
                            size="small"
                            sx={{
                              color: '#E11D48',
                              bgcolor: 'rgba(225, 29, 72, 0.08)',
                              '&:hover': { bgcolor: 'rgba(225, 29, 72, 0.16)' },
                            }}
                          >
                            <PhoneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Message on WhatsApp">
                          <IconButton
                            component="a"
                            href={`https://wa.me/${waNumber}?text=${waMsg}`}
                            target="_blank"
                            size="small"
                            sx={{
                              color: '#25D366',
                              bgcolor: 'rgba(37, 211, 102, 0.08)',
                              '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.16)' },
                            }}
                          >
                            <WhatsAppIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;

