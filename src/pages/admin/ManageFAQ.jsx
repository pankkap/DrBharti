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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useApp } from '../../context/AppContext';

const ManageFAQ = () => {
  const { faqs, addFAQ, deleteFAQ } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', category: 'General' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.question || !form.answer) return;
    addFAQ(form);
    setForm({ question: '', answer: '', category: 'General' });
    setOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="#0F4C81">
          Manage Frequently Asked Questions ({faqs.length})
        </Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ bgcolor: '#E11D48', '&:hover': { bgcolor: '#BE123C' } }}>
          Add FAQ
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: '#FFF', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Question</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Answer</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {faqs.map((faq) => (
              <TableRow key={faq.id} hover>
                <TableCell fontWeight={700} color="#0F4C81" sx={{ width: '30%' }}>
                  {faq.question}
                </TableCell>
                <TableCell sx={{ width: '50%' }}>{faq.answer}</TableCell>
                <TableCell>
                  <Chip label={faq.category || 'General'} size="small" />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => deleteFAQ(faq.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Add Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleAdd}>
          <DialogTitle fontWeight={700} color="#0F4C81">
            Add New Question
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Question *" required fullWidth value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
            <TextField label="Category" fullWidth value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <TextField label="Answer *" multiline rows={3} required fullWidth value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save FAQ
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ManageFAQ;
