import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Chip,
  Divider,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import DnsIcon from '@mui/icons-material/Dns';
import KeyIcon from '@mui/icons-material/Key';
import { useApp } from '../../context/AppContext';
import { sendEvolutionGoWhatsAppMessage, checkEvolutionGoStatus } from '../../services/whatsappClientService';

const WhatsAppSettings = () => {
  const { whatsappSettings, setWhatsappSettings, doctorProfile, showCursorSnack, activeDoctorId } = useApp();
  const [formData, setFormData] = useState({
    serverUrl: whatsappSettings?.serverUrl || 'https://wa.beta-labs.in',
    instanceName: whatsappSettings?.instanceName || 'doctor_clinic',
    apiKey: whatsappSettings?.apiKey || '',
    ...whatsappSettings,
    doctorWhatsAppNumber: whatsappSettings?.doctorWhatsAppNumber || doctorProfile?.whatsappNumber || '919729280731',
    enableDoctorInstantAlert: whatsappSettings?.enableDoctorInstantAlert ?? true,
    enablePatientBookingAlert: whatsappSettings?.enablePatientBookingAlert ?? true,
    enableStatusUpdateAlert: whatsappSettings?.enableStatusUpdateAlert ?? true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Connection check state
  const [checkingConn, setCheckingConn] = useState(false);
  const [connResult, setConnResult] = useState(null);

  // Test Message State
  const [testPhone, setTestPhone] = useState(formData.doctorWhatsAppNumber || '919729280731');
  const [testMsg, setTestMsg] = useState(`Hello ${doctorProfile?.name || 'Doctor'}! This is a test WhatsApp notification from your Clinic Booking System.`);
  const [testSending, setTestSending] = useState(false);
  const [testSendResult, setTestSendResult] = useState(null);

  const handleTestConnection = async () => {
    setCheckingConn(true);
    setConnResult(null);
    try {
      const res = await checkEvolutionGoStatus({
        serverUrl: formData.serverUrl,
        instanceName: formData.instanceName,
        apiKey: formData.apiKey,
      });
      setConnResult(res);
      if (res.ok) {
        setWhatsappSettings(formData);
      }
    } catch (err) {
      setConnResult({ ok: false, error: err.message });
    } finally {
      setCheckingConn(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setWhatsappSettings(formData);
    setSavedSuccess(true);
    showCursorSnack('WhatsApp notification settings saved successfully!', e, {
      title: 'Settings Saved',
      severity: 'success',
    });
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleSendTestMessage = async () => {
    if (!testPhone) return;
    setTestSending(true);
    setTestSendResult(null);

    // Ensure latest settings are saved
    setWhatsappSettings(formData);

    const result = await sendEvolutionGoWhatsAppMessage({
      recipientPhone: testPhone,
      messageText: testMsg,
      whatsappSettings: formData,
    });

    setTestSending(false);
    setTestSendResult(result);
  };

  return (
    <Box maxWidth="lg" sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h4" fontWeight={700} color="#0F4C81">
              WhatsApp Notifications
            </Typography>
            <Chip
              icon={<CheckCircleIcon sx={{ color: '#FFF !important' }} />}
              label="WhatsApp Service Active"
              sx={{ bgcolor: '#25D366', color: '#FFF', fontWeight: 700 }}
            />
            <Chip
              icon={<KeyIcon sx={{ fontSize: '15px !important' }} />}
              label={`Doctor ID: ${activeDoctorId || 'doc001'}`}
              sx={{ bgcolor: '#fce5e5', color: '#be185d', fontWeight: 700, border: '1px solid #fecdd3' }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Manage automated WhatsApp appointment receipts, doctor alerts, and patient status updates.
          </Typography>
        </Box>
      </Box>

      {savedSuccess && (
        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3, borderRadius: 3 }}>
          <strong>Saved!</strong> Your WhatsApp notification preferences have been updated successfully.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main Notification Settings Form */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: '#FFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <NotificationsActiveIcon sx={{ color: '#E11D48' }} />
              <Typography variant="h6" fontWeight={700} color="#0F4C81">
                Clinic Notification Preferences
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    label="Doctor Receiving WhatsApp Phone Number *"
                    fullWidth
                    required
                    value={formData.doctorWhatsAppNumber}
                    onChange={(e) => setFormData({ ...formData, doctorWhatsAppNumber: e.target.value })}
                    placeholder="919729280731"
                    helperText="Enter your mobile number with country code (e.g. 919729280731) to receive instant patient booking alerts"
                    InputProps={{
                      startAdornment: <PhoneIphoneIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                    }}
                  />
                </Grid>

                {/* Evolution Go Server Gateway Configuration */}
                <Grid item xs={12}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      bgcolor: '#F8FAFC',
                      borderColor: '#CBD5E1',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CloudQueueIcon sx={{ color: '#0F4C81' }} />
                        <Typography variant="subtitle1" fontWeight={700} color="#0F4C81">
                          WhatsApp Automation Gateway
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleTestConnection}
                        disabled={checkingConn}
                        startIcon={checkingConn ? <CircularProgress size={14} /> : <CheckCircleIcon />}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                      >
                        {checkingConn ? 'Checking Connection...' : 'Test Connection'}
                      </Button>
                    </Box>

                    {connResult && (
                      <Alert
                        severity={connResult.ok ? 'success' : 'error'}
                        sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}
                      >
                        {connResult.ok ? (
                          <span>
                            <strong>Gateway Connected!</strong> WhatsApp Channel: <code>{connResult.instance?.name || formData.instanceName}</code> (Status: {connResult.instance?.connectionStatus || connResult.instance?.status || 'Active'})
                          </span>
                        ) : (
                          <span>
                            <strong>Connection Error:</strong> {connResult.error || 'Failed to connect. Please verify Gateway URL and API Key.'}
                          </span>
                        )}
                      </Alert>
                    )}

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Gateway Server URL"
                          fullWidth
                          size="small"
                          value={formData.serverUrl}
                          onChange={(e) => setFormData({ ...formData, serverUrl: e.target.value })}
                          placeholder="https://wa.beta-labs.in"
                          helperText="Production WhatsApp Gateway URL"
                          InputProps={{
                            startAdornment: <DnsIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="WhatsApp Channel Name"
                          fullWidth
                          size="small"
                          value={formData.instanceName}
                          onChange={(e) => setFormData({ ...formData, instanceName: e.target.value })}
                          placeholder="doctor_clinic"
                          helperText="Active WhatsApp connected channel"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Gateway API Authentication Key"
                          fullWidth
                          size="small"
                          type="text"
                          value={formData.apiKey}
                          onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                          placeholder="API Authentication Key"
                          helperText="Private API key used to authenticate dispatch requests"
                          InputProps={{
                            startAdornment: <KeyIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                {/* Automation Toggles */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3, border: '1px solid #E2E8F0' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.enableDoctorInstantAlert !== false}
                            onChange={(e) => setFormData({ ...formData, enableDoctorInstantAlert: e.target.checked })}
                            color="success"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700} color="#0F4C81">
                              Instant Doctor Alerts
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Send an automated WhatsApp message to your phone as soon as a new appointment is booked.
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>

                    <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3, border: '1px solid #E2E8F0' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.enablePatientBookingAlert !== false}
                            onChange={(e) => setFormData({ ...formData, enablePatientBookingAlert: e.target.checked })}
                            color="success"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700} color="#0F4C81">
                              Patient Booking Receipts
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Send an automated WhatsApp confirmation receipt to the patient upon completing the booking.
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>

                    <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3, border: '1px solid #E2E8F0' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.enableStatusUpdateAlert !== false}
                            onChange={(e) => setFormData({ ...formData, enableStatusUpdateAlert: e.target.checked })}
                            color="success"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700} color="#0F4C81">
                              Status Change Updates (Approved / Rescheduled / Completed)
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Notify the patient via WhatsApp whenever you approve, reschedule, or complete their appointment.
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  </Box>
                </Grid>

                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<SaveIcon />}
                    sx={{
                      py: 1.4,
                      px: 3.5,
                      bgcolor: '#E11D48',
                      '&:hover': { bgcolor: '#BE123C' },
                      borderRadius: 2.5,
                      fontWeight: 700,
                    }}
                  >
                    Save Notification Preferences
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Side Panel: Test WhatsApp Alert & How It Works */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Live Message Tester */}
            <Paper elevation={0} sx={{ p: 3.5, borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: '#FFF' }}>
              <Typography variant="h6" fontWeight={700} color="#0F4C81" mb={1} display="flex" alignItems="center" gap={1}>
                <WhatsAppIcon sx={{ color: '#25D366' }} /> Test My WhatsApp Alerts
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                Send a quick test message to verify your phone receives clinic WhatsApp alerts.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Test WhatsApp Number"
                  size="small"
                  fullWidth
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="919729280731"
                  helperText="Enter phone with country code (e.g. 919729280731)"
                />

                <TextField
                  label="Sample Message"
                  size="small"
                  multiline
                  rows={2}
                  fullWidth
                  value={testMsg}
                  onChange={(e) => setTestMsg(e.target.value)}
                />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSendTestMessage}
                  disabled={testSending || !testPhone}
                  startIcon={testSending ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                  sx={{
                    bgcolor: '#25D366',
                    '&:hover': { bgcolor: '#128C7E' },
                    color: '#FFF',
                    fontWeight: 700,
                    borderRadius: 2.5,
                    py: 1.2,
                  }}
                >
                  {testSending ? 'Dispatching...' : 'Send Test WhatsApp Message'}
                </Button>

                {testSendResult && (
                  <Alert
                    severity={testSendResult.success ? 'success' : 'info'}
                    sx={{ borderRadius: 2, fontSize: '0.85rem' }}
                  >
                    {testSendResult.success
                      ? '✅ Test WhatsApp message dispatched successfully! Check your phone.'
                      : `Notice: ${testSendResult.error || testSendResult.mode}`}
                  </Alert>
                )}
              </Box>
            </Paper>

            {/* Features Card */}
            <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #BAE6FD', bgcolor: '#F0F9FF' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} color="#0369A1" mb={1} display="flex" alignItems="center" gap={1}>
                  <MarkChatReadIcon sx={{ fontSize: 20 }} /> Automated WhatsApp Features
                </Typography>
                <Typography variant="body2" color="#0C4A6E" mb={1}>
                  • <strong>Instant Booking Alerts:</strong> Both doctor and patient get instant notification with booking details.
                </Typography>
                <Typography variant="body2" color="#0C4A6E" mb={1}>
                  • <strong>1-Click Approval Notice:</strong> Patient gets confirmation when you approve their request.
                </Typography>
                <Typography variant="body2" color="#0C4A6E" mb={2}>
                  • <strong>Reschedule Alerts:</strong> Automatically delivers updated date & time to the patient.
                </Typography>

                <Divider sx={{ my: 1.5, borderColor: '#BAE6FD' }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0369A1' }}>
                  <SupportAgentIcon fontSize="small" />
                  <Typography variant="caption" fontWeight={600}>
                    For WhatsApp line changes or technical assistance, contact your system administrator.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WhatsAppSettings;


