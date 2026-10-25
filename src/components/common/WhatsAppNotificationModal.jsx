import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import { useApp } from '../../context/AppContext';
import { getDirectWhatsAppUrl } from '../../services/whatsappClientService';

const WhatsAppNotificationModal = () => {
  const { isNotificationModalOpen, closeNotificationModal, notificationModalData } = useApp();

  if (!notificationModalData) return null;

  const { title, doctorMsg, patientMsg, doctorPhone, patientPhone } = notificationModalData;
  const providerName = 'WhatsApp Automated Gateway';

  return (
    <Dialog
      open={isNotificationModalOpen}
      onClose={closeNotificationModal}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '28px',
          p: 1.5,
          border: '1px solid rgba(225, 29, 72, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(10, 37, 64, 0.25)',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '14px',
              backgroundColor: '#25D366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.35)',
            }}
          >
            <WhatsAppIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#0A2540">
              {providerName} Engine
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Instant Automated Appointment Messaging Pass
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={closeNotificationModal} size="small" sx={{ border: '1px solid #E2E8F0', borderRadius: 2 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: '#F1F5F9' }} />

      <DialogContent sx={{ mt: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
            label={title || 'WhatsApp Message Dispatched'}
            sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700 }}
          />
          <Chip
            label="Live Webhook Verified"
            sx={{ bgcolor: 'rgba(10, 37, 64, 0.06)', color: '#0A2540', fontWeight: 600 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2.5, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Doctor Alert Card */}
          {doctorMsg && (
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: '20px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={800} color="#0A2540">
                  👨‍⚕️ Doctor Clinic Pass
                </Typography>
                <Chip label={`To: ${doctorPhone}`} size="small" sx={{ bgcolor: '#E2E8F0', fontSize: '0.72rem', fontWeight: 600 }} />
              </Box>

              <Box
                sx={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  color: '#1E293B',
                  bgcolor: '#FFF',
                  p: 2,
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  mb: 2,
                  maxHeight: 180,
                  overflowY: 'auto',
                }}
              >
                {doctorMsg}
              </Box>

              <Button
                variant="outlined"
                color="primary"
                size="small"
                fullWidth
                startIcon={<SendIcon />}
                href={getDirectWhatsAppUrl(doctorPhone, doctorMsg)}
                target="_blank"
                sx={{ borderRadius: 9999, fontWeight: 700 }}
              >
                Open Doctor WhatsApp
              </Button>
            </Paper>
          )}

          {/* Patient Alert Card */}
          {patientMsg && (
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: '20px',
                backgroundColor: 'rgba(37, 211, 102, 0.05)',
                border: '1px solid rgba(37, 211, 102, 0.25)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={800} color="#065F46">
                  👤 Patient Confirmation Pass
                </Typography>
                <Chip label={`To: ${patientPhone}`} size="small" sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontSize: '0.72rem', fontWeight: 600 }} />
              </Box>

              <Box
                sx={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  color: '#064E3B',
                  bgcolor: '#FFF',
                  p: 2,
                  borderRadius: '14px',
                  border: '1px solid rgba(37, 211, 102, 0.2)',
                  mb: 2,
                  maxHeight: 180,
                  overflowY: 'auto',
                }}
              >
                {patientMsg}
              </Box>

              <Button
                variant="contained"
                sx={{
                  bgcolor: '#25D366',
                  '&:hover': { bgcolor: '#128C7E' },
                  color: '#FFF',
                  borderRadius: 9999,
                  fontWeight: 700,
                }}
                size="small"
                fullWidth
                startIcon={<WhatsAppIcon />}
                href={getDirectWhatsAppUrl(patientPhone, patientMsg)}
                target="_blank"
              >
                Open Patient WhatsApp Pass
              </Button>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 1 }}>
        <Button onClick={closeNotificationModal} variant="contained" color="primary" sx={{ px: 4 }}>
          Done / Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WhatsAppNotificationModal;
