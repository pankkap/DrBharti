import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HistoryIcon from '@mui/icons-material/History';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import * as XLSX from 'xlsx';
import { useApp } from '../../context/AppContext';

const ManagePatients = () => {
  const {
    patients = [],
    appointments = [],
    addPatient,
    updatePatient,
    deletePatient,
    activeDoctorId,
    showCursorSnack,
  } = useApp();

  const [search, setSearch] = useState('');
  const [patientModal, setPatientModal] = useState({
    open: false,
    mode: 'add', // 'add' or 'edit'
    id: null,
    formData: {
      name: '',
      mobile: '',
      email: '',
      age: '',
      gender: 'Male',
      bloodGroup: '',
      address: '',
      notes: '',
    },
  });

  const [historyModal, setHistoryModal] = useState({ open: false, patient: null });

  // Merge Firestore patients with appointments to get full count and latest visit
  const mergedPatients = useMemo(() => {
    const map = {};

    // 1. Load persistent Firestore patients
    patients.forEach((p) => {
      const key = p.mobile || p.id;
      map[key] = {
        id: p.id,
        name: p.name || 'Unnamed',
        mobile: p.mobile || '',
        email: p.email || 'N/A',
        age: p.age || 'N/A',
        gender: p.gender || 'N/A',
        bloodGroup: p.bloodGroup || 'N/A',
        address: p.address || 'N/A',
        notes: p.notes || '',
        totalAppointments: 0,
        lastVisit: p.lastVisit || 'N/A',
        lastProblem: p.lastProblem || 'N/A',
      };
    });

    // 2. Count appointments and update last visit
    appointments.forEach((apt) => {
      const key = apt.mobile;
      if (!map[key]) {
        map[key] = {
          id: 'PAT-' + key.replace(/\D/g, ''),
          name: apt.patientName,
          mobile: apt.mobile,
          email: apt.email || 'N/A',
          age: apt.age || 'N/A',
          gender: apt.gender || 'N/A',
          bloodGroup: 'N/A',
          address: apt.address || 'N/A',
          notes: '',
          totalAppointments: 1,
          lastVisit: apt.preferredDate,
          lastProblem: apt.problem,
        };
      } else {
        map[key].totalAppointments += 1;
        if (apt.preferredDate && map[key].lastVisit === 'N/A') {
          map[key].lastVisit = apt.preferredDate;
        }
        if (apt.problem && map[key].lastProblem === 'N/A') {
          map[key].lastProblem = apt.problem;
        }
      }
    });

    return Object.values(map);
  }, [patients, appointments]);

  const filteredPatients = useMemo(() => {
    const s = (search || '').toLowerCase();
    return mergedPatients.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const mobile = String(p.mobile || '');
      const email = (p.email || '').toLowerCase();
      const problem = (p.lastProblem || '').toLowerCase();
      return name.includes(s) || mobile.includes(s) || email.includes(s) || problem.includes(s);
    });
  }, [mergedPatients, search]);

  const handleOpenAdd = () => {
    setPatientModal({
      open: true,
      mode: 'add',
      id: null,
      formData: {
        name: '',
        mobile: '',
        email: '',
        age: '',
        gender: 'Male',
        bloodGroup: '',
        address: '',
        notes: '',
      },
    });
  };

  const handleOpenEdit = (p) => {
    setPatientModal({
      open: true,
      mode: 'edit',
      id: p.id,
      formData: {
        name: p.name,
        mobile: p.mobile,
        email: p.email === 'N/A' ? '' : p.email,
        age: p.age === 'N/A' ? '' : p.age,
        gender: p.gender === 'N/A' ? 'Male' : p.gender,
        bloodGroup: p.bloodGroup === 'N/A' ? '' : p.bloodGroup,
        address: p.address === 'N/A' ? '' : p.address,
        notes: p.notes || '',
      },
    });
  };

  const handleSavePatient = async (e) => {
    e.preventDefault();
    const data = patientModal.formData;
    if (!data.name || !data.mobile) return;

    if (patientModal.mode === 'add') {
      await addPatient(data);
      showCursorSnack('Patient record saved to Firestore successfully!', e, {
        title: 'Patient Added',
        severity: 'success',
      });
    } else {
      await updatePatient(patientModal.id, data);
      showCursorSnack('Patient record updated in Firestore successfully!', e, {
        title: 'Patient Updated',
        severity: 'success',
      });
    }

    setPatientModal({ open: false, mode: 'add', id: null, formData: {} });
  };

  const handleDeletePatient = async (p, e) => {
    if (window.confirm(`Are you sure you want to delete patient "${p.name}"?`)) {
      await deletePatient(p.id);
      showCursorSnack('Patient record deleted.', e, {
        title: 'Deleted',
        severity: 'info',
      });
    }
  };

  const exportToExcel = () => {
    const data = filteredPatients.map((p) => ({
      'Doctor ID': activeDoctorId,
      'Patient Name': p.name,
      'Mobile Number': p.mobile,
      Email: p.email,
      Age: p.age,
      Gender: p.gender,
      'Blood Group': p.bloodGroup,
      Address: p.address,
      'Total Visits': p.totalAppointments,
      'Last Visit Date': p.lastVisit,
      'Last Problem': p.lastProblem,
      Notes: p.notes,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Patients');
    XLSX.writeFile(wb, `Patients_${activeDoctorId || 'Doctor'}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="#0F4C81" mb={0.5}>
            Patient Directory ({filteredPatients.length})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cloud Firestore patient records isolated for this doctor account.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: '#FFF', borderRadius: 2, minWidth: 230 }}
          />

          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={exportToExcel}
            sx={{ borderRadius: 2.5, fontWeight: 700, borderColor: '#CBD5E1', color: '#0F4C81' }}
          >
            Export Excel
          </Button>

          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenAdd}
            sx={{ bgcolor: '#E11D48', '&:hover': { bgcolor: '#BE123C' }, borderRadius: 2.5, fontWeight: 700 }}
          >
            Add Patient (Firestore)
          </Button>
        </Box>
      </Box>

      {/* Patient Table */}
      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: '#FFF', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Patient Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Mobile Number</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Age & Gender</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Visits</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Last Concern</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  No patients found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((p) => {
                const patientApts = appointments.filter((a) => a.mobile === p.mobile);
                return (
                  <TableRow key={p.mobile || p.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: 'rgba(15, 76, 129, 0.1)', color: '#0F4C81' }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700} color="#0F4C81">
                            {p.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {p.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600 }}>{p.mobile}</TableCell>
                    <TableCell>
                      {p.age} yrs {p.gender !== 'N/A' ? `(${p.gender})` : ''}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 180 }}>{p.address}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${p.totalAppointments} Visit(s)`}
                        size="small"
                        sx={{ bgcolor: '#EFF6FF', color: '#1D4ED8', fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 160 }}>{p.lastProblem}</TableCell>

                    <TableCell sx={{ textAlign: 'right' }}>
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Chat on WhatsApp">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => {
                              const ph = p.mobile.replace(/\D/g, '');
                              window.open(`https://wa.me/${ph}`, '_blank');
                            }}
                          >
                            <WhatsAppIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="View Appointment History">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => setHistoryModal({ open: true, patient: p, list: patientApts })}
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit Patient Details">
                          <IconButton size="small" color="info" onClick={() => handleOpenEdit(p)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Patient">
                          <IconButton size="small" color="error" onClick={(e) => handleDeletePatient(p, e)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Add / Edit Patient Modal */}
      <Dialog
        open={patientModal.open}
        onClose={() => setPatientModal({ open: false, mode: 'add', id: null, formData: {} })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <form onSubmit={handleSavePatient}>
          <DialogTitle sx={{ fontWeight: 800, color: '#0F4C81' }}>
            {patientModal.mode === 'add' ? 'Add New Patient Record (Firestore)' : 'Edit Patient Details'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Patient Full Name *"
                  required
                  fullWidth
                  size="small"
                  value={patientModal.formData.name || ''}
                  onChange={(e) =>
                    setPatientModal((prev) => ({
                      ...prev,
                      formData: { ...prev.formData, name: e.target.value },
                    }))
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mobile Number *"
                  required
                  fullWidth
                  size="small"
                  value={patientModal.formData.mobile || ''}
                  onChange={(e) =>
                    setPatientModal((prev) => ({
                      ...prev,
                      formData: { ...prev.formData, mobile: e.target.value },
                    }))
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  size="small"
                  value={patientModal.formData.email || ''}
                  onChange={(e) =>
                    setPatientModal((prev) => ({
                      ...prev,
                      formData: { ...prev.formData, email: e.target.value },
                    }))
                  }
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  label="Age"
                  fullWidth
                  size="small"
                  value={patientModal.formData.age || ''}
                  onChange={(e) =>
                    setPatientModal((prev) => ({
                      ...prev,
                      formData: { ...prev.formData, age: e.target.value },
                    }))
                  }
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  select
                  label="Gender"
                  fullWidth
                  size="small"
                  value={patientModal.formData.gender || 'Male'}
                  onChange={(e) =>
                    setPatientModal((prev) => ({
                      ...prev,
                      formData: { ...prev.formData, gender: e.target.value },
                    }))
                  }
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Blood Group (e.g. O+, A+, B+)"
                  fullWidth
                  size="small"
                  value={patientModal.formData.bloodGroup || ''}
                  onChange={(e) =>
                    setPatientModal((prev) => ({
                      ...prev,
                      formData: { ...prev.formData, bloodGroup: e.target.value },
                    }))
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address / City"
                  fullWidth
                  size="small"
                  value={patientModal.formData.address || ''}
                  onChange={(e) =>
                    setPatientModal((prev) => ({
                      ...prev,
                      formData: { ...prev.formData, address: e.target.value },
                    }))
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Medical Notes / Health History"
                  multiline
                  rows={2}
                  fullWidth
                  size="small"
                  value={patientModal.formData.notes || ''}
                  onChange={(e) =>
                    setPatientModal((prev) => ({
                      ...prev,
                      formData: { ...prev.formData, notes: e.target.value },
                    }))
                  }
                  placeholder="e.g. Diabetic, allergic to penicillin, previous root canal..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setPatientModal({ open: false, mode: 'add', id: null, formData: {} })}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: '#E11D48', '&:hover': { bgcolor: '#BE123C' }, fontWeight: 700, borderRadius: 2.5 }}
            >
              {patientModal.mode === 'add' ? 'Save Patient Record' : 'Update Record'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Patient History Modal */}
      <Dialog
        open={historyModal.open}
        onClose={() => setHistoryModal({ open: false, patient: null })}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        {historyModal.patient && (
          <>
            <DialogTitle sx={{ fontWeight: 800, color: '#0F4C81' }}>
              Appointment History - {historyModal.patient.name} ({historyModal.patient.mobile})
            </DialogTitle>
            <DialogContent dividers>
              {(!historyModal.list || historyModal.list.length === 0) ? (
                <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No prior appointment records found for this patient phone number.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {historyModal.list.map((apt) => (
                    <Paper
                      key={apt.id}
                      elevation={0}
                      sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} color="#0F4C81">
                          📅 {apt.preferredDate} ({apt.preferredTime})
                        </Typography>
                        <Chip label={apt.status} size="small" color={apt.status === 'Approved' ? 'success' : 'default'} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Concern:</strong> {apt.problem || 'General Consultation'}
                      </Typography>
                      {apt.promoCode && (
                        <Typography variant="caption" color="secondary" display="block">
                          Applied Coupon: {apt.promoCode}
                        </Typography>
                      )}
                    </Paper>
                  ))}
                </Stack>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setHistoryModal({ open: false, patient: null })} sx={{ fontWeight: 700 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ManagePatients;
