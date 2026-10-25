import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Rating,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import AddCommentIcon from '@mui/icons-material/AddComment';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
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

const Testimonials = () => {
  const { testimonials, addTestimonial } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', service: '', rating: 5, comment: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.comment) return;

    addTestimonial({
      ...form,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 99999)}?auto=format&fit=crop&w=200&q=80`,
    });
    setForm({ name: '', service: '', rating: 5, comment: '' });
    setOpen(false);
  };

  return (
    <Box className="bg-mesh-subtle" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="xl">
        {/* Header Title */}
        <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', mb: 6 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Chip label="VERIFIED PATIENT REVIEWS" color="secondary" sx={{ fontWeight: 700, mb: 2 }} />
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <Typography variant="h1" color="#0A2540" mb={2}>
              Real Experiences & Recoveries
            </Typography>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', mb: 4 }}>
              Read authentic feedback from patients who booked online and visited Dr. John Smith's practice.
            </Typography>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<AddCommentIcon />}
              onClick={() => setOpen(true)}
              sx={{ px: 3.5, py: 1.25, fontWeight: 700 }}
            >
              Share Your Patient Experience
            </Button>
          </motion.div>
        </Box>

        {/* Rating Metrics Summary Bar */}
        <Paper
          elevation={0}
          sx={{
            p: 3.5,
            mb: 6,
            borderRadius: '24px',
            bgcolor: '#FFFFFF',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center', borderRight: { sm: '1px solid #E2E8F0' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Typography variant="h2" fontWeight={900} color="#0A2540">
                  4.95
                </Typography>
                <StarIcon sx={{ color: '#F59E0B', fontSize: 32 }} />
              </Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Overall Clinical Rating (500+ Reviews)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center', borderRight: { sm: '1px solid #E2E8F0' } }}>
              <Typography variant="h3" fontWeight={800} color="#E11D48">
                99.8%
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Patient Recommendation Rate
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={800} color="#0A2540">
                100%
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Verified OPD Visits
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Testimonial Cards Grid */}
        <Grid container spacing={3.5}>
          {testimonials.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={index}
                whileHover={{ y: -6 }}
                style={{ height: '100%' }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: '24px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                      <Avatar src={item.avatar} alt={item.name} sx={{ width: 52, height: 52 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={800} color="#0A2540">
                          {item.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#E11D48', fontWeight: 600, display: 'block' }}>
                          {item.service || 'Consultation Patient'}
                        </Typography>
                      </Box>
                    </Box>

                    <Rating value={item.rating} readOnly precision={0.5} sx={{ mb: 2, color: '#F59E0B' }} />

                    <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic', lineHeight: 1.75 }}>
                      "{item.comment}"
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Visited on {item.date || 'Recent Visit'}
                    </Typography>
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: 14, color: '#E11D48 !important' }} />}
                      label="Verified"
                      size="small"
                      sx={{ bgcolor: 'rgba(225, 29, 72, 0.08)', color: '#E11D48', fontWeight: 700 }}
                    />
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Modal for Review Submission */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              p: 2,
            },
          }}
        >
          <form onSubmit={handleSubmit}>
            <DialogTitle fontWeight={800} color="#0A2540" sx={{ fontSize: '1.4rem' }}>
              Share Your Feedback
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <TextField
                label="Your Full Name *"
                required
                fullWidth
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <TextField
                label="Service Received (e.g. Cardiology, Diabetes Care, Checkup)"
                fullWidth
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
              />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" mb={0.5} fontWeight={600}>
                  Rating *
                </Typography>
                <Rating
                  value={form.rating}
                  onChange={(e, val) => setForm({ ...form, rating: val })}
                  precision={1}
                  sx={{ color: '#F59E0B' }}
                />
              </Box>
              <TextField
                label="Your Review / Experience *"
                required
                multiline
                rows={3}
                fullWidth
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 0 }}>
              <Button onClick={() => setOpen(false)} sx={{ fontWeight: 600, color: '#64748B' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="secondary" sx={{ fontWeight: 700, px: 3 }}>
                Submit Review
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Testimonials;
