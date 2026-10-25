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
  Rating,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useApp } from '../../context/AppContext';

const ManageTestimonials = () => {
  const { testimonials, addTestimonial, deleteTestimonial } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', service: '', rating: 5, comment: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.comment) return;
    addTestimonial({
      ...form,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
    });
    setForm({ name: '', service: '', rating: 5, comment: '' });
    setOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="#0F4C81">
          Manage Patient Testimonials ({testimonials.length})
        </Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ bgcolor: '#E11D48', '&:hover': { bgcolor: '#BE123C' } }}>
          Add Testimonial
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: '#FFF', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Service</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Feedback</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testimonials.map((test) => (
              <TableRow key={test.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar src={test.avatar} />
                    <Typography variant="subtitle2" fontWeight={700} color="#0F4C81">
                      {test.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{test.service}</TableCell>
                <TableCell>
                  <Rating value={test.rating} readOnly size="small" sx={{ color: '#F59E0B' }} />
                </TableCell>
                <TableCell sx={{ maxWidth: 320 }}>{test.comment}</TableCell>
                <TableCell>{test.date}</TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => deleteTestimonial(test.id)}>
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
            Add New Testimonial
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Patient Name *" required fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="Service Received" fullWidth value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
            <Box>
              <Typography variant="caption">Rating</Typography>
              <Rating value={form.rating} onChange={(e, val) => setForm({ ...form, rating: val })} sx={{ color: '#F59E0B' }} />
            </Box>
            <TextField label="Feedback / Comment *" multiline rows={3} required fullWidth value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save Testimonial
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ManageTestimonials;
