import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
  Chip,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tooltip,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AddIcon from '@mui/icons-material/Add';
import { useApp } from '../../context/AppContext';
import * as XLSX from 'xlsx';
import AppointmentCalendar from '../../components/admin/AppointmentCalendar';
import TimingSlotManager from '../../components/admin/TimingSlotManager';
import AddAppointmentModal from '../../components/admin/AddAppointmentModal';

const ManageAppointments = () => {
  const {
    appointments,
    refreshAppointments,
    updateAppointmentStatus,
    deleteAppointment,
    sendOneHourReminder,
    checkAndSendDueOneHourReminders,
    showCursorSnack,
    activeDoctorId,
    getDoctorTimingSlots,
    getAvailableSlotsForDate,
  } = useApp();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [checkingReminders, setCheckingReminders] = useState(false);
  const [addAppointmentModalOpen, setAddAppointmentModalOpen] = useState(false);

  // Modals for actions
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, apt: null, newDate: '', newTime: '' });
  const [rejectModal, setRejectModal] = useState({ open: false, apt: null, reason: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, apt: null });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const filterStatus = ['All', 'Pending', 'Approved', 'Rescheduled', 'Completed', 'Rejected'][tabIndex];

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = filterStatus === 'All' ? true : apt.status === filterStatus;
    const searchLower = (search || '').toLowerCase();
    const pName = (apt.patientName || '').toLowerCase();
    const pMobile = String(apt.mobile || '');
    const pId = (apt.id || '').toLowerCase();
    const pPromo = (apt.promoCode || '').toLowerCase();
    const pSource = (apt.source || '').toLowerCase();

    const matchesSearch =
      pName.includes(searchLower) ||
      pMobile.includes(searchLower) ||
      pId.includes(searchLower) ||
      pPromo.includes(searchLower) ||
      pSource.includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  const handleManualRefresh = (e) => {
    if (typeof refreshAppointments === 'function') {
      refreshAppointments();
    }
    showCursorSnack('Appointments list synchronized with latest bookings.', e, {
      title: 'Synced',
      severity: 'info',
    });
  };

  const handleTriggerDueReminders = async (e) => {
    setCheckingReminders(true);
    try {
      const res = await checkAndSendDueOneHourReminders();
      if (res && res.sentCount > 0) {
        showCursorSnack(`Sent 1-hour WhatsApp reminder(s) to ${res.sentCount} upcoming patient(s)!`, e, {
          title: 'Reminders Delivered',
          severity: 'success',
        });
      } else if (res && res.pendingCount > 0) {
        showCursorSnack(
          `Found ${res.pendingCount} appointment(s) around this time, but status is Pending. Please click "Approve" first to enable automated reminders.`,
          e,
          {
            title: 'Action Required: Approve First',
            severity: 'warning',
          }
        );
      } else if (res && res.alreadySentCount > 0) {
        showCursorSnack(
          `1-hour reminder was already sent for today's ${res.alreadySentApts[0]?.preferredTime || ''} appointment.`,
          e,
          {
            title: 'Already Dispatched',
            severity: 'info',
          }
        );
      } else {
        showCursorSnack('No approved appointments scheduled in the upcoming 90-minute window.', e, {
          title: 'Schedule Up to Date',
          severity: 'info',
        });
      }
    } catch (err) {
      showCursorSnack('Error triggering reminder checks.', e, { title: 'Error', severity: 'error' });
    } finally {
      setCheckingReminders(false);
    }
  };

  const handleSendDirectReminder = async (aptId) => {
    try {
      const res = await sendOneHourReminder(aptId);
      if (res && res.success) {
        showCursorSnack(`1-Hour reminder sent to ${res.appointment?.patientName || 'patient'} via WhatsApp!`, null, {
          title: 'Reminder Sent',
          severity: 'success',
        });
      }
    } catch (err) {
      showCursorSnack('Could not send reminder.', null, { title: 'Error', severity: 'error' });
    }
  };

  const exportToExcel = () => {
    const worksheetData = filteredAppointments.map((apt) => ({
      'Appointment ID': apt.id,
      'Patient Name': apt.patientName,
      'Mobile Number': apt.mobile,
      Email: apt.email || 'N/A',
      Age: apt.age || 'N/A',
      Gender: apt.gender || 'N/A',
      Address: apt.address || 'N/A',
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
    XLSX.writeFile(workbook, `Appointments_List_${filterStatus}.xlsx`);
  };

  const handleApprove = (id, e) => {
    updateAppointmentStatus(id, 'Approved');
    showCursorSnack('Appointment Approved! WhatsApp notification dispatched to patient.', e, {
      title: 'Appointment Approved',
      severity: 'success',
    });
  };

  const handleComplete = (id, e) => {
    updateAppointmentStatus(id, 'Completed');
    showCursorSnack('Appointment Completed! WhatsApp receipt dispatched.', e, {
      title: 'Appointment Completed',
      severity: 'success',
    });
  };

  const handleConfirmReschedule = (e) => {
    if (rescheduleModal.apt && rescheduleModal.newDate && rescheduleModal.newTime) {
      updateAppointmentStatus(
        rescheduleModal.apt.id,
        'Rescheduled',
        '', // Clean note
        {
          preferredDate: rescheduleModal.newDate,
          preferredTime: rescheduleModal.newTime,
        }
      );
      showCursorSnack(`Rescheduled to ${rescheduleModal.newDate} at ${rescheduleModal.newTime}! WhatsApp dispatched.`, e, {
        title: 'Appointment Rescheduled',
        severity: 'info',
      });
      setRescheduleModal({ open: false, apt: null, newDate: '', newTime: '' });
    }
  };

  const handleConfirmReject = (e) => {
    if (rejectModal.apt) {
      updateAppointmentStatus(rejectModal.apt.id, 'Rejected', rejectModal.reason || 'Doctor unavailable at selected time slot');
      showCursorSnack('Appointment Rejected. WhatsApp notification sent to patient.', e, {
        title: 'Appointment Rejected',
        severity: 'error',
      });
      setRejectModal({ open: false, apt: null, reason: '' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="#0F4C81" mb={0.5}>
            Appointment Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cloud Firestore appointments synchronized in real time. Switch between List & Interactive Calendar view.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          {/* View Toggle */}
          <Box sx={{ display: 'flex', bgcolor: '#F1F5F9', p: 0.5, borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
            <Button
              size="small"
              variant={viewMode === 'list' ? 'contained' : 'text'}
              startIcon={<FormatListBulletedIcon />}
              onClick={() => setViewMode('list')}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: viewMode === 'list' ? '#0F4C81' : 'transparent',
                color: viewMode === 'list' ? '#FFF' : '#475569',
                '&:hover': { bgcolor: viewMode === 'list' ? '#0B3860' : 'rgba(0,0,0,0.04)' },
              }}
            >
              List View
            </Button>
            <Button
              size="small"
              variant={viewMode === 'calendar' ? 'contained' : 'text'}
              startIcon={<CalendarMonthIcon />}
              onClick={() => setViewMode('calendar')}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: viewMode === 'calendar' ? '#E11D48' : 'transparent',
                color: viewMode === 'calendar' ? '#FFF' : '#475569',
                '&:hover': { bgcolor: viewMode === 'calendar' ? '#BE123C' : 'rgba(0,0,0,0.04)' },
              }}
            >
              Calendar View
            </Button>
          </Box>

          <Button
            variant="outlined"
            startIcon={<AccessTimeIcon />}
            onClick={() => setSlotModalOpen(true)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              borderColor: '#E11D48',
              color: '#E11D48',
              '&:hover': { borderColor: '#BE123C', bgcolor: 'rgba(225, 29, 72, 0.04)' },
            }}
          >
            Manage Time Slots
          </Button>

          <Button
            variant="outlined"
            startIcon={<NotificationsActiveIcon />}
            onClick={handleTriggerDueReminders}
            disabled={checkingReminders}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              borderColor: '#F59E0B',
              color: '#B45309',
              bgcolor: 'rgba(245, 158, 11, 0.06)',
              '&:hover': { borderColor: '#D97706', bgcolor: 'rgba(245, 158, 11, 0.12)' },
            }}
          >
            {checkingReminders ? 'Checking...' : 'Check 1-Hr Reminders'}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleManualRefresh}
            sx={{ fontWeight: 700, borderRadius: 2.5 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={exportToExcel}
            sx={{ borderRadius: 2.5, fontWeight: 700 }}
          >
            Export to Excel
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddAppointmentModalOpen(true)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              bgcolor: '#E11D48',
              textTransform: 'none',
              px: 2.5,
              boxShadow: '0 2px 8px rgba(225, 29, 72, 0.25)',
              '&:hover': { bgcolor: '#BE123C' },
            }}
          >
            Add Appointment
          </Button>
        </Stack>
      </Box>

      {viewMode === 'calendar' ? (
        <AppointmentCalendar
          appointments={appointments}
          onUpdateStatus={updateAppointmentStatus}
          onReschedule={(id, newDate, newTime) =>
            updateAppointmentStatus(id, 'Rescheduled', '', {
              preferredDate: newDate,
              preferredTime: newTime,
            })
          }
          showCursorSnack={showCursorSnack}
        />
      ) : (
        <>
          {/* Tabs & Search */}
          <Paper elevation={0} sx={{ p: 2, borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: '#FFF', mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} variant="scrollable" scrollButtons="auto">
              <Tab label={`All (${appointments.length})`} />
              <Tab label={`Pending (${appointments.filter((a) => a.status === 'Pending').length})`} />
              <Tab label={`Approved (${appointments.filter((a) => a.status === 'Approved').length})`} />
              <Tab label={`Rescheduled (${appointments.filter((a) => a.status === 'Rescheduled').length})`} />
              <Tab label={`Completed (${appointments.filter((a) => a.status === 'Completed').length})`} />
              <Tab label={`Rejected (${appointments.filter((a) => a.status === 'Rejected').length})`} />
            </Tabs>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search by ID, Name, Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Appointments List Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid #E2E8F0',
          bgcolor: '#FFF',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        }}
      >
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
          <Table sx={{ minWidth: 1050, width: '100%' }}>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: 120, pl: 3, color: '#475569', fontSize: '0.8rem', py: 1.8 }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: 200, color: '#475569', fontSize: '0.8rem', py: 1.8 }}>
                  PATIENT INFO
                </TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: 160, color: '#475569', fontSize: '0.8rem', py: 1.8 }}>
                  HEALTH PROBLEM
                </TableCell>
                <TableCell sx={{ fontWeight: 700, width: 160, color: '#475569', fontSize: '0.8rem', py: 1.8, whiteSpace: 'nowrap' }}>
                  SCHEDULE
                </TableCell>
                <TableCell sx={{ fontWeight: 700, width: 130, color: '#475569', fontSize: '0.8rem', py: 1.8, textAlign: 'center' }}>
                  STATUS
                </TableCell>
                <TableCell sx={{ fontWeight: 700, width: 380, color: '#475569', fontSize: '0.8rem', py: 1.8, textAlign: 'center', pr: 3 }}>
                  DOCTOR ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((apt) => (
                <TableRow
                  key={apt.id}
                  hover
                  sx={{
                    transition: 'background-color 0.15s ease',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell sx={{ pl: 3, fontWeight: 700, color: '#0F4C81', fontSize: '0.84rem' }}>
                    {apt.id}
                    {apt.promoCode ? (
                      <Chip
                        icon={<LocalOfferIcon sx={{ fontSize: '13px !important', color: '#15803D !important' }} />}
                        label={apt.promoCode}
                        size="small"
                        sx={{
                          mt: 0.4,
                          fontWeight: 800,
                          fontSize: '0.68rem',
                          bgcolor: '#DCFCE7',
                          color: '#15803D',
                          border: '1px solid #86EFAC',
                          height: 22,
                          display: 'inline-flex',
                        }}
                      />
                    ) : apt.source && apt.source.includes('Code:') ? (
                      <Chip
                        icon={<LocalOfferIcon sx={{ fontSize: '13px !important', color: '#15803D !important' }} />}
                        label={apt.source.split('Code:')[1].replace(')', '').trim()}
                        size="small"
                        sx={{
                          mt: 0.4,
                          fontWeight: 800,
                          fontSize: '0.68rem',
                          bgcolor: '#DCFCE7',
                          color: '#15803D',
                          border: '1px solid #86EFAC',
                          height: 22,
                          display: 'inline-flex',
                        }}
                      />
                    ) : (
                      <Typography variant="caption" display="block" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                        {apt.source || 'Website'}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={700} color="#0F4C81">
                      {apt.patientName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.2 }}>
                      📞 {apt.mobile} {apt.age ? `• ${apt.age} yrs (${apt.gender})` : ''}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 220 }}>
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

                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="body2" fontWeight={700} color="#0F172A" sx={{ fontSize: '0.84rem' }}>
                      📅 {apt.preferredDate}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.75rem' }}>
                      ⏰ {apt.preferredTime}
                    </Typography>
                    {apt.reminder1HourSent ? (
                      <Chip
                        size="small"
                        icon={<NotificationsActiveIcon sx={{ fontSize: '12px !important', color: '#047857 !important' }} />}
                        label="1h Reminder Sent"
                        sx={{
                          mt: 0.5,
                          height: 20,
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          bgcolor: '#ECFDF5',
                          color: '#047857',
                          border: '1px solid #A7F3D0',
                        }}
                      />
                    ) : apt.status === 'Approved' ? (
                      <Tooltip title="Send 1-hour WhatsApp reminder immediately to patient" arrow>
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => handleSendDirectReminder(apt.id)}
                          startIcon={<NotificationsActiveIcon sx={{ fontSize: 13 }} />}
                          sx={{
                            mt: 0.4,
                            p: '1px 6px',
                            minWidth: 0,
                            fontSize: '0.67rem',
                            fontWeight: 700,
                            color: '#D97706',
                            bgcolor: 'rgba(245, 158, 11, 0.08)',
                            borderRadius: 1.5,
                            textTransform: 'none',
                            '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.16)' },
                          }}
                        >
                          Send 1h Alert
                        </Button>
                      </Tooltip>
                    ) : null}
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={apt.status}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        borderRadius: 2,
                        minWidth: 90,
                        ...(apt.status === 'Approved'
                          ? { bgcolor: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' }
                          : apt.status === 'Completed'
                          ? { bgcolor: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' }
                          : apt.status === 'Rescheduled'
                          ? { bgcolor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' }
                          : apt.status === 'Rejected'
                          ? { bgcolor: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }
                          : { bgcolor: '#FFF7ED', color: '#C2410C', border: '1px solid #FFEDD5' }),
                      }}
                    />
                  </TableCell>

                  {/* Fixed-Slot Doctor Actions Column */}
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 1,
                        width: '100%',
                      }}
                    >
                      {/* Case A: If Appointment is Completed -> Single Full-Width Combined Finished Banner (320px) */}
                      {apt.status === 'Completed' ? (
                        <Box
                          sx={{
                            width: 320,
                            py: 0.65,
                            px: 2,
                            bgcolor: '#EFF6FF',
                            color: '#1E40AF',
                            border: '1px solid #BFDBFE',
                            borderRadius: 2.5,
                            textAlign: 'center',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            letterSpacing: '0.02em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.8,
                          }}
                        >
                          <TaskAltIcon sx={{ fontSize: 16, color: '#1E40AF' }} /> Finished / Completed
                        </Box>
                      ) : apt.status === 'Rejected' || apt.status === 'Cancelled' ? (
                        /* Case B: If Appointment is Rejected / Cancelled -> Single Full-Width Combined Cancelled Banner (320px) */
                        <Box
                          sx={{
                            width: 320,
                            py: 0.65,
                            px: 2,
                            bgcolor: '#FEF2F2',
                            color: '#991B1B',
                            border: '1px solid #FECACA',
                            borderRadius: 2.5,
                            textAlign: 'center',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            letterSpacing: '0.02em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.8,
                          }}
                        >
                          <CancelIcon sx={{ fontSize: 16, color: '#991B1B' }} /> Cancelled / Rejected
                        </Box>
                      ) : (
                        /* Case C: Active Appointment (Pending, Rescheduled, Approved) -> 3 Aligned Button Slots */
                        <>
                          {/* SLOT 1: Primary Action (105px) */}
                          <Box sx={{ width: 105, display: 'flex', justifyContent: 'center' }}>
                            {apt.status === 'Pending' || apt.status === 'Rescheduled' ? (
                              <Tooltip title="Approve & Send WhatsApp Alert">
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  fullWidth
                                  startIcon={<CheckCircleIcon sx={{ fontSize: 15 }} />}
                                  onClick={() => handleApprove(apt.id)}
                                  sx={{
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    textTransform: 'none',
                                    py: 0.6,
                                    boxShadow: 'none',
                                  }}
                                >
                                  Approve
                                </Button>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Mark Consultation Completed">
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  fullWidth
                                  startIcon={<TaskAltIcon sx={{ fontSize: 15 }} />}
                                  onClick={() => handleComplete(apt.id)}
                                  sx={{
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    textTransform: 'none',
                                    py: 0.6,
                                    boxShadow: 'none',
                                  }}
                                >
                                  Complete
                                </Button>
                              </Tooltip>
                            )}
                          </Box>

                          {/* SLOT 2: Reschedule Action (110px) */}
                          <Box sx={{ width: 110, display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="Reschedule Date & Time">
                              <Button
                                size="small"
                                variant="outlined"
                                color="warning"
                                fullWidth
                                startIcon={<AccessTimeIcon sx={{ fontSize: 15 }} />}
                                onClick={() =>
                                  setRescheduleModal({
                                    open: true,
                                    apt,
                                    newDate: apt.preferredDate,
                                    newTime: apt.preferredTime,
                                  })
                                }
                                sx={{
                                  borderRadius: 2,
                                  fontWeight: 700,
                                  fontSize: '0.75rem',
                                  textTransform: 'none',
                                  py: 0.6,
                                }}
                              >
                                Reschedule
                              </Button>
                            </Tooltip>
                          </Box>

                          {/* SLOT 3: Reject Action (90px) - Available on Pending, Rescheduled & Approved */}
                          <Box sx={{ width: 90, display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="Reject / Cancel Appointment">
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                fullWidth
                                startIcon={<CancelIcon sx={{ fontSize: 15 }} />}
                                onClick={() => setRejectModal({ open: true, apt, reason: '' })}
                                sx={{
                                  borderRadius: 2,
                                  fontWeight: 700,
                                  fontSize: '0.75rem',
                                  textTransform: 'none',
                                  py: 0.6,
                                }}
                              >
                                Reject
                              </Button>
                            </Tooltip>
                          </Box>
                        </>
                      )}

                      {/* SLOT 4: Delete Record Icon (36px) */}
                      <Box sx={{ width: 36, display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Delete Record">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => setDeleteModal({ open: true, apt })}
                            sx={{
                              bgcolor: '#FEF2F2',
                              '&:hover': { bgcolor: '#FEE2E2' },
                              borderRadius: 2,
                              p: 0.7,
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {filteredAppointments.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No appointments found under this filter.</Typography>
          </Box>
        )}
      </Paper>
      </>
      )}

      {/* Modal for Reschedule */}
      <Dialog open={rescheduleModal.open} onClose={() => setRescheduleModal({ open: false, apt: null, newDate: '', newTime: '' })}>
        <DialogTitle fontWeight={700} color="#0F4C81">
          Reschedule Appointment for {rescheduleModal.apt?.patientName}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            type="date"
            label="New Appointment Date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={rescheduleModal.newDate}
            onChange={(e) => setRescheduleModal({ ...rescheduleModal, newDate: e.target.value })}
          />
          <TextField
            select
            label="New Time Slot"
            fullWidth
            value={rescheduleModal.newTime}
            onChange={(e) => setRescheduleModal({ ...rescheduleModal, newTime: e.target.value })}
          >
            {(rescheduleModal.newDate
              ? getAvailableSlotsForDate(rescheduleModal.newDate).allSlots
              : getDoctorTimingSlots().all
            ).map((slot) => {
              const bookedOnDate = rescheduleModal.newDate
                ? getAvailableSlotsForDate(rescheduleModal.newDate).bookedSlots.includes(slot)
                : false;
              return (
                <MenuItem key={slot} value={slot}>
                  {slot} {bookedOnDate ? ' (Already Booked)' : ''}
                </MenuItem>
              );
            })}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRescheduleModal({ open: false, apt: null, newDate: '', newTime: '' })}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleConfirmReschedule}>
            Confirm Reschedule & Send WhatsApp
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for Reject */}
      <Dialog open={rejectModal.open} onClose={() => setRejectModal({ open: false, apt: null, reason: '' })}>
        <DialogTitle fontWeight={700} color="#EF4444">
          Reject Appointment for {rejectModal.apt?.patientName}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Reason for Rejection (Sent to Patient via WhatsApp)"
            fullWidth
            multiline
            rows={3}
            value={rejectModal.reason}
            onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRejectModal({ open: false, apt: null, reason: '' })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmReject}>
            Confirm Reject & Send WhatsApp Alert
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, apt: null })}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#991B1B', fontWeight: 800, pb: 1 }}>
          <DeleteIcon sx={{ color: '#EF4444' }} /> Delete Appointment?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Are you sure you want to permanently delete appointment <strong>{deleteModal.apt?.id}</strong> for <strong>{deleteModal.apt?.patientName}</strong>?
          </Typography>
          <Box sx={{ p: 1.5, bgcolor: '#FEF2F2', borderRadius: 2, border: '1px solid #FECACA' }}>
            <Typography variant="caption" sx={{ color: '#991B1B', fontWeight: 600, display: 'block' }}>
              ⚠️ This action cannot be undone. The record will be permanently removed from clinic logs.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setDeleteModal({ open: false, apt: null })}
            sx={{ color: '#64748B', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (deleteModal.apt) {
                deleteAppointment(deleteModal.apt.id);
                setToast({ open: true, message: `🗑️ Appointment ${deleteModal.apt.id} deleted successfully.`, severity: 'info' });
                setDeleteModal({ open: false, apt: null });
              }
            }}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 2.5,
              bgcolor: '#EF4444',
              '&:hover': { bgcolor: '#DC2626' },
            }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification for Doctor Actions */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2.5, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Doctor Timing Slots Management Dialog */}
      <Dialog
        open={slotModalOpen}
        onClose={() => setSlotModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogContent sx={{ p: 2 }}>
          <TimingSlotManager embedded onSaved={() => setSlotModalOpen(false)} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSlotModalOpen(false)} sx={{ fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manual Appointment Booking Modal */}
      <AddAppointmentModal
        open={addAppointmentModalOpen}
        onClose={() => setAddAppointmentModalOpen(false)}
      />
    </Box>
  );
};

export default ManageAppointments;
