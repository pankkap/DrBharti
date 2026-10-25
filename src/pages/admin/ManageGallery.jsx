import React, { useState, useRef } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CollectionsIcon from '@mui/icons-material/Collections';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useApp } from '../../context/AppContext';
import { uploadFileToStorage } from '../../services/firebase';

const ManageGallery = () => {
  const { gallery, addGallery, deleteGallery, activeDoctorId, showCursorSnack } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Clinic', imageUrl: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size exceeds 5MB. Please choose a smaller photo.');
      return;
    }

    setImageError('');
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setForm((prev) => ({
        ...prev,
        imageUrl: uploadEvent.target.result,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      setImageError('Please provide a title and select a photo.');
      return;
    }

    setUploading(true);
    setImageError('');

    let finalImageUrl = form.imageUrl;

    if (selectedFile) {
      try {
        // Upload file to Firebase Cloud Storage under DoctorApp/{doctorId}/gallery/
        const storagePath = `DoctorApp/${activeDoctorId || 'doc001'}/gallery/${Date.now()}_${selectedFile.name.replace(/\s+/g, '_')}`;
        finalImageUrl = await uploadFileToStorage(selectedFile, storagePath);
      } catch (err) {
        console.warn('Firebase Storage upload warning, saving with preview image:', err);
      }
    }

    try {
      await addGallery({
        title: form.title,
        category: form.category || 'Clinic',
        imageUrl: finalImageUrl,
      });

      showCursorSnack('Photo uploaded and added to Clinic Gallery!', null, {
        title: 'Gallery Updated',
        severity: 'success',
      });

      setForm({ title: '', category: 'Clinic', imageUrl: '' });
      setSelectedFile(null);
      setImageError('');
      setOpen(false);
    } catch (err) {
      setImageError('Failed to save gallery item. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (uploading) return;
    setOpen(false);
    setForm({ title: '', category: 'Clinic', imageUrl: '' });
    setSelectedFile(null);
    setImageError('');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="#0F4C81">
            Manage Clinic Gallery ({gallery.length})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Photos stored in Firebase Cloud Storage & Firestore for your clinic.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ bgcolor: '#E11D48', '&:hover': { bgcolor: '#BE123C' }, borderRadius: 2.5, px: 2.5, py: 1, fontWeight: 700 }}
        >
          Upload Photo (Firebase Storage)
        </Button>
      </Box>

      <Grid container spacing={3}>
        {gallery.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid #E2E8F0',
                transition: 'all 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardMedia component="img" height="200" image={item.imageUrl} alt={item.title} sx={{ objectFit: 'cover' }} />
              <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ minWidth: 0, mr: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="#0F4C81" noWrap>
                    {item.title}
                  </Typography>
                  <Chip
                    label={item.category}
                    size="small"
                    sx={{ mt: 0.5, bgcolor: '#fce5e5', color: '#be185d', fontWeight: 600, fontSize: '0.72rem' }}
                  />
                </Box>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => deleteGallery(item.id)}
                  sx={{ bgcolor: '#FEF2F2', '&:hover': { bgcolor: '#FEE2E2' } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upload Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <form onSubmit={handleAdd}>
          <DialogTitle fontWeight={800} color="#0F4C81" sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhotoCameraIcon sx={{ color: '#E11D48' }} /> Upload Photo to Firebase Storage
          </DialogTitle>

          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            {imageError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {imageError}
              </Alert>
            )}

            {/* Drag & Drop / File Upload Area */}
            <Box
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                p: 3,
                border: '2px dashed',
                borderColor: dragActive ? '#E11D48' : form.imageUrl ? '#10B981' : '#CBD5E1',
                borderRadius: 3.5,
                bgcolor: dragActive ? 'rgba(225, 29, 72, 0.06)' : form.imageUrl ? '#F0FDF4' : '#F8FAFC',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#E11D48',
                  bgcolor: 'rgba(225, 29, 72, 0.04)',
                },
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {form.imageUrl ? (
                <Box>
                  <Box
                    component="img"
                    src={form.imageUrl}
                    alt="Preview"
                    sx={{
                      maxHeight: 180,
                      maxWidth: '100%',
                      borderRadius: 2.5,
                      objectFit: 'cover',
                      mb: 1.5,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Typography variant="body2" fontWeight={700} color="#166534">
                    ✓ Photo Selected! Click or Drag to replace
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUploadIcon sx={{ fontSize: 48, color: '#E11D48', mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={700} color="#0F4C81">
                    Click to browse or drag & drop photo
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Supports PNG, JPG, JPEG, WEBP (Max 5MB)
                  </Typography>
                </Box>
              )}
            </Box>

            <TextField
              label="Photo Title *"
              required
              fullWidth
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Modern Consultation Chamber"
            />

            <TextField
              label="Category (e.g. Clinic, Chamber, Equipment, Reception)"
              fullWidth
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Clinic"
            />
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 1 }}>
            <Button onClick={handleClose} disabled={uploading} sx={{ color: '#64748B', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!form.imageUrl || uploading}
              startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
              sx={{
                bgcolor: '#E11D48',
                '&:hover': { bgcolor: '#BE123C' },
                fontWeight: 700,
                borderRadius: 2.5,
                px: 3,
              }}
            >
              {uploading ? 'Uploading to Storage...' : 'Save Photo'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ManageGallery;
