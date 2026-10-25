import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Chip,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsIcon from '@mui/icons-material/Directions';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const Contact = () => {
  const { doctorProfile, submitContactRequest } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    submitContactRequest(formData);
    setSuccessMsg('Your message has been received! Our clinic desk will follow up promptly via phone or WhatsApp.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <Box className="bg-mesh-subtle" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="xl">
        {/* Header Title */}
        <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', mb: 8 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Chip label="GET IN TOUCH" color="secondary" sx={{ fontWeight: 700, mb: 2 }} />
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <Typography variant="h1" color="#0A2540" mb={2}>
              Clinic Reception & Inquiries
            </Typography>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              We are here to assist with appointment queries, directions, and direct medical assistance.
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={5} sx={{ mb: 8 }}>
          {/* Contact Details Column */}
          <Grid item xs={12} md={5}>
            <Stack spacing={2.5}>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    borderRadius: '24px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    display: 'flex',
                    gap: 2.5,
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: '16px',
                      bgcolor: 'rgba(10, 37, 64, 0.08)',
                      color: '#0A2540',
                      height: 'fit-content',
                    }}
                  >
                    <LocationOnIcon fontSize="medium" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800} color="#0A2540">
                      Clinic Location
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                      {doctorProfile.address}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    borderRadius: '24px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    display: 'flex',
                    gap: 2.5,
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: '16px',
                      bgcolor: 'rgba(37, 211, 102, 0.1)',
                      color: '#25D366',
                      height: 'fit-content',
                    }}
                  >
                    <WhatsAppIcon fontSize="medium" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800} color="#0A2540">
                      WhatsApp Reception Desk
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Instant chat: <strong>+{doctorProfile.whatsappNumber}</strong>
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      color="secondary"
                      href={`https://wa.me/${doctorProfile.whatsappNumber}`}
                      target="_blank"
                      sx={{ p: 0, mt: 0.5, fontWeight: 700 }}
                    >
                      Open WhatsApp Chat →
                    </Button>
                  </Box>
                </Paper>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    borderRadius: '24px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    display: 'flex',
                    gap: 2.5,
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: '16px',
                      bgcolor: 'rgba(225, 29, 72, 0.1)',
                      color: '#E11D48',
                      height: 'fit-content',
                    }}
                  >
                    <PhoneIcon fontSize="medium" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800} color="#0A2540">
                      Emergency Phone Line
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Direct line: <strong>{doctorProfile?.phone}</strong>
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      color="secondary"
                      href={`tel:${doctorProfile?.phone ? doctorProfile.phone.replace(/[^+\d]/g, '') : ''}`}
                      sx={{ p: 0, mt: 0.5, fontWeight: 700 }}
                    >
                      Call Clinic Now →
                    </Button>
                  </Box>
                </Paper>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    borderRadius: '24px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    display: 'flex',
                    gap: 2.5,
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: '16px',
                      bgcolor: 'rgba(217, 119, 6, 0.1)',
                      color: '#D97706',
                      height: 'fit-content',
                    }}
                  >
                    <AccessTimeIcon fontSize="medium" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800} color="#0A2540">
                      Consultation Timings
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Mon - Fri: {doctorProfile.workingHours.weekdays}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Saturday: {doctorProfile.workingHours.saturday}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Stack>
          </Grid>

          {/* Contact Inquiry Form */}
          <Grid item xs={12} md={7}>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3.5, sm: 5 },
                  borderRadius: '32px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  boxShadow: '0 20px 45px -10px rgba(10, 37, 64, 0.08)',
                }}
              >
                <Typography variant="h3" fontWeight={800} color="#0A2540" mb={1}>
                  Send an Inquiry
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3.5}>
                  Have a non-urgent query? Complete this form and our medical reception team will reply shortly.
                </Typography>

                {successMsg && (
                  <Alert
                    severity="success"
                    icon={<CheckCircleIcon sx={{ fontSize: 24 }} />}
                    sx={{ mb: 3.5, borderRadius: '16px', bgcolor: '#ECFDF5', color: '#065F46' }}
                  >
                    {successMsg}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Your Full Name *"
                        placeholder="e.g. John Doe"
                        fullWidth
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email Address *"
                        type="email"
                        placeholder="john@example.com"
                        fullWidth
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Phone / WhatsApp Number"
                        placeholder="9876543210"
                        fullWidth
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Subject"
                        placeholder="e.g. Report Consultation / Timings"
                        fullWidth
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Your Message / Query *"
                        placeholder="Write your inquiry here..."
                        fullWidth
                        required
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                          startIcon={<SendIcon />}
                          sx={{ py: 1.6, fontSize: '1.05rem', fontWeight: 700 }}
                        >
                          Submit Message
                        </Button>
                      </motion.div>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Embedded Map Section */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '28px',
            overflow: 'hidden',
            height: 440,
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px -10px rgba(10, 37, 64, 0.08)',
          }}
        >
          <iframe
            title="Clinic Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.6881234567!2d77.2090!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM2JzUw.0IkgTiA3N8KwMTInMzIuNCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </Paper>
      </Container>
    </Box>
  );
};

export default Contact;
