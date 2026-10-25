import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Avatar,
  CircularProgress,
  Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useApp } from '../../context/AppContext';
import { uploadFileToStorage } from '../../services/firebase';
import TimingSlotManager from '../../components/admin/TimingSlotManager';

const DoctorProfile = () => {
  const { doctorProfile, setDoctorProfile, showCursorSnack, activeDoctorId } = useApp();
  const [formData, setFormData] = useState({ ...doctorProfile });
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Keep form data in sync if remote doctor profile updates
  useEffect(() => {
    if (doctorProfile) {
      setFormData((prev) => ({ ...prev, ...doctorProfile }));
    }
  }, [doctorProfile]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB. Please choose a smaller photo.');
      return;
    }

    setUploadError('');
    setUploading(true);

    try {
      // 1. Upload to Firebase Storage under DoctorApp/{doctorId}/profile/
      const storagePath = `DoctorApp/${activeDoctorId || 'doc001'}/profile/avatar_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const downloadUrl = await uploadFileToStorage(file, storagePath);

      // 2. Update local state and auto-save avatar
      const updated = { ...formData, avatar: downloadUrl };
      setFormData(updated);
      await setDoctorProfile(updated);

      showCursorSnack('Profile photo uploaded to Firebase Storage and saved!', null, {
        title: 'Photo Uploaded',
        severity: 'success',
      });
    } catch (err) {
      console.warn('Firebase storage upload failed, falling back to local data URL:', err);
      // Fallback to data URL so user is never blocked
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const updated = { ...formData, avatar: ev.target.result };
        setFormData(updated);
        await setDoctorProfile(updated);
      };
      reader.readAsDataURL(file);
      setUploadError('Uploaded locally (check Firebase Storage rules if cloud upload fails).');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setDoctorProfile(formData);
    setSuccess(true);
    showCursorSnack('Doctor & Clinic profile saved to Firestore successfully!', e, {
      title: 'Profile Saved',
      severity: 'success',
    });
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <Box maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="#0F4C81">
            Doctor & Clinic Profile Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your credentials, clinic information, and profile photo saved in Firestore & Cloud Storage.
          </Typography>
        </Box>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
          Doctor & Clinic details updated successfully in Firebase Firestore!
        </Alert>
      )}

      {uploadError && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setUploadError('')}>
          {uploadError}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: '#FFF' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Doctor Photo Section */}
            <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={formData.avatar}
                  sx={{
                    width: 115,
                    height: 115,
                    mx: 'auto',
                    mb: 1.5,
                    border: '3.5px solid #E11D48',
                    boxShadow: '0 6px 20px rgba(225, 29, 72, 0.25)',
                  }}
                />
                {uploading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress size={32} sx={{ color: '#FFF' }} />
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  color="secondary"
                  disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                  sx={{
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontWeight: 700,
                    borderColor: '#E11D48',
                    color: '#E11D48',
                    '&:hover': { bgcolor: 'rgba(225, 29, 72, 0.08)', borderColor: '#E11D48' },
                  }}
                >
                  {uploading ? 'Uploading to Storage...' : 'Upload Doctor Photo (Storage)'}
                  <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Uploads directly to Firebase Storage bucket. Supports PNG, JPG, JPEG, WEBP.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Doctor Full Name *"
                required
                fullWidth
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Medical Registration No *"
                required
                fullWidth
                value={formData.registrationNo || ''}
                onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Title & Specialization *"
                required
                fullWidth
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Qualifications *"
                required
                fullWidth
                value={formData.qualification || ''}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Professional Biography *"
                multiline
                rows={3}
                required
                fullWidth
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Clinic Phone *"
                required
                fullWidth
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Doctor WhatsApp Number (Country Code e.g. 919876543210) *"
                required
                fullWidth
                value={formData.whatsappNumber || ''}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Clinic Email *"
                required
                fullWidth
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience Years *"
                required
                fullWidth
                value={formData.experience || ''}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Clinic Address *"
                multiline
                rows={2}
                required
                fullWidth
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
                  bgcolor: '#0F4C81',
                  borderRadius: 2.5,
                  fontWeight: 700,
                  '&:hover': { bgcolor: '#0B3860' },
                }}
              >
                Save Profile Changes (Firestore)
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Appointment Consultation Timing Slots Manager */}
      <Box sx={{ mt: 4 }}>
        <TimingSlotManager />
      </Box>
    </Box>
  );
};

export default DoctorProfile;
