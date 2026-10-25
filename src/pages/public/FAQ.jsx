import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Chip,
  InputAdornment,
  Paper,
  Stack,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
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

const FAQ = () => {
  const { faqs, doctorProfile } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Booking', 'Consultation', 'WhatsApp', 'Payments'];

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' ||
      (f.category && f.category.toLowerCase().includes(activeCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  return (
    <Box className="bg-mesh-subtle" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Chip label="FREQUENTLY ASKED QUESTIONS" color="secondary" sx={{ fontWeight: 700, mb: 2 }} />
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <Typography variant="h1" color="#0A2540" mb={2}>
              Everything You Need to Know
            </Typography>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', mb: 4 }}>
              Clear answers regarding our online booking process, WhatsApp passes, clinic timings, and consultation fees.
            </Typography>
          </motion.div>

          {/* Search Field */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <TextField
              placeholder="Search questions by keyword (e.g. fee, WhatsApp, cancellation)..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#E11D48' }} />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: 9999,
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                },
              }}
            />
          </motion.div>
        </Box>

        {/* FAQs List */}
        <Box sx={{ mb: 6 }}>
          {filteredFaqs.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={index}
            >
              <Accordion
                elevation={0}
                sx={{
                  mb: 2,
                  borderRadius: '20px !important',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  bgcolor: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.02)',
                  '&:before': { display: 'none' },
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    borderColor: 'rgba(225, 29, 72, 0.3)',
                    boxShadow: '0 8px 24px rgba(10, 37, 64, 0.06)',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#E11D48' }} />}
                  sx={{ py: 1.5, px: 3.5 }}
                >
                  <Typography variant="h6" fontWeight={800} color="#0A2540">
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3.5, pb: 3.5, color: 'text.secondary', lineHeight: 1.75 }}>
                  <Typography variant="body1" color="text.primary" sx={{ fontSize: '0.98rem' }}>
                    {item.answer}
                  </Typography>
                  {item.category && (
                    <Chip
                      label={item.category}
                      size="small"
                      sx={{ mt: 2, bgcolor: 'rgba(225, 29, 72, 0.08)', color: '#E11D48', fontWeight: 700 }}
                    />
                  )}
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}

          {filteredFaqs.length === 0 && (
            <Paper sx={{ p: 5, textAlign: 'center', borderRadius: '24px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <HelpOutlineIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 1 }} />
              <Typography variant="h5" fontWeight={700} color="#0A2540" mb={1}>
                No matching answers found
              </Typography>
              <Typography color="text.secondary">
                We couldn't find any results for "{searchTerm}". Feel free to message our desk directly on WhatsApp.
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Direct WhatsApp Helpline Box */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '24px',
            bgcolor: '#06182A',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={800} color="#FFFFFF" mb={0.5}>
              Still have questions?
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Chat directly with clinic reception on WhatsApp for immediate guidance.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<WhatsAppIcon />}
            href={`https://wa.me/${doctorProfile.whatsappNumber}`}
            target="_blank"
            sx={{
              bgcolor: '#25D366',
              '&:hover': { bgcolor: '#128C7E' },
              px: 3,
              py: 1.2,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            Chat on WhatsApp
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default FAQ;
