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
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useApp } from '../../context/AppContext';

const CATEGORIES = ['General', 'Specialized', 'Cardiology', 'Preventative', 'Pediatrics'];

const ManageServices = () => {
  const { services, addService, deleteService, showCursorSnack } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'General', description: '', fee: '$50 / ₹500', duration: '20 mins' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    addService(form);
    showCursorSnack(`Service "${form.title}" added successfully!`, e, {
      title: 'Service Added',
      severity: 'success',
    });
    setForm({ title: '', category: 'General', description: '', fee: '$50 / ₹500', duration: '20 mins' });
    setOpen(false);
  };

  const handleDelete = (serv, e) => {
    deleteService(serv.id);
    showCursorSnack(`Service "${serv.title}" removed.`, e, {
      title: 'Service Removed',
      severity: 'info',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="#0F4C81">
          Manage Clinic Services ({services.length})
        </Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ bgcolor: '#E11D48', '&:hover': { bgcolor: '#BE123C' } }}>
          Add New Service
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: '#FFF', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Service Title</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fee</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((serv) => (
              <TableRow key={serv.id} hover>
                <TableCell fontWeight={700} color="#0F4C81">
                  {serv.title}
                </TableCell>
                <TableCell>
                  <Chip label={serv.category} size="small" sx={{ fontWeight: 600 }} />
                </TableCell>
                <TableCell sx={{ maxWidth: 300 }}>{serv.description}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#E11D48' }}>{serv.fee}</TableCell>
                <TableCell>{serv.duration}</TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={(e) => handleDelete(serv, e)}>
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
            Add New Medical Service
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Service Title *" required fullWidth value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <TextField select label="Category *" fullWidth value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="Description *" multiline rows={3} required fullWidth value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <TextField label="Consultation Fee *" fullWidth value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
            <TextField label="Duration *" fullWidth value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save Service
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ManageServices;
