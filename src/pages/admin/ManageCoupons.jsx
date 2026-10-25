import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import { useApp } from '../../context/AppContext';
import * as XLSX from 'xlsx';

const ManageCoupons = () => {
  const {
    discountConfig,
    setDiscountConfig,
    discountLeads,
    addDiscountLead,
    updateDiscountLeadStatus,
    deleteDiscountLead,
    showCursorSnack,
  } = useApp();

  const [configForm, setConfigForm] = useState({ ...discountConfig });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadCode, setNewLeadCode] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setDiscountConfig(configForm);
    showCursorSnack('Discount coupon offer settings updated successfully!', e, {
      title: 'Offer Updated',
      severity: 'success',
    });
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddManualLead = () => {
    if (!newLeadPhone || newLeadPhone.length < 10) return;
    const phoneClean = newLeadPhone.replace(/\D/g, '').slice(-10);
    const code = newLeadCode.trim() || `${configForm.codePrefix || 'APEX'}${Math.floor(1000 + Math.random() * 9000)}`;
    addDiscountLead({
      phone: `+91 ${phoneClean}`,
      code: code.toUpperCase(),
      discount: configForm.discountPercentage || '20% OFF',
    });
    setNewLeadPhone('');
    setNewLeadCode('');
    setAddLeadOpen(false);
    showCursorSnack('New coupon lead created successfully!', null, {
      title: 'Lead Added',
      severity: 'success',
    });
  };

  const exportToExcel = () => {
    const data = discountLeads.map((lead) => ({
      'Lead ID': lead.id,
      'Phone Number': lead.phone,
      'Coupon Code': lead.code,
      Discount: lead.discount,
      Status: lead.status,
      'Date & Time': new Date(lead.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Discount Leads');
    XLSX.writeFile(workbook, `Discount_Leads_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Filter leads
  const filteredLeads = discountLeads.filter((lead) => {
    const matchSearch =
      lead.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalLeads = discountLeads.length;
  const bookedCount = discountLeads.filter((l) => l.status === 'Booked').length;
  const claimedCount = discountLeads.filter((l) => l.status === 'Claimed').length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#0A2540">
            Discount Coupons & Patient Leads
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure website discount tab, promotional codes, and view prospective patients who requested discounts.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={exportToExcel}
            sx={{ fontWeight: 700 }}
          >
            Export Leads (.xlsx)
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setAddLeadOpen(true)}
            sx={{ fontWeight: 700 }}
          >
            Issue Coupon Manually
          </Button>
        </Stack>
      </Box>

      {/* Overview Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  TOTAL LEADS CAPTURED
                </Typography>
                <PeopleIcon sx={{ color: '#E11D48' }} />
              </Box>
              <Typography variant="h4" fontWeight={900} color="#0A2540">
                {totalLeads}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Prospective patients who claimed code
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  ACTIVE OFFER
                </Typography>
                <LocalOfferIcon sx={{ color: '#10B981' }} />
              </Box>
              <Typography variant="h4" fontWeight={900} color="#16A34A">
                {configForm.discountHeadline || '20% OFF'}
              </Typography>
              <Typography variant="caption" sx={{ color: configForm.isEnabled ? '#10B981' : '#EF4444', fontWeight: 700 }}>
                {configForm.isEnabled ? '● Active on Website' : '○ Disabled'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  PENDING CLAIMED
                </Typography>
                <LocalOfferIcon sx={{ color: '#F59E0B' }} />
              </Box>
              <Typography variant="h4" fontWeight={900} color="#D97706">
                {claimedCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Awaiting appointment booking
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  CONVERTED / BOOKED
                </Typography>
                <CheckCircleIcon sx={{ color: '#2563EB' }} />
              </Box>
              <Typography variant="h4" fontWeight={900} color="#2563EB">
                {bookedCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Successfully booked clinic slot
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 1. DISCOUNT OFFER CONFIGURATION SETTINGS */}
      <Paper elevation={0} sx={{ p: 3.5, borderRadius: 3.5, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#0A2540">
              ⚙️ Floating Discount Offer Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Control the left-side floating discount tab and popup modal shown to website visitors.
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={configForm.isEnabled}
                onChange={(e) => setConfigForm({ ...configForm, isEnabled: e.target.checked })}
                color="secondary"
              />
            }
            label={
              <Typography variant="subtitle2" fontWeight={700} color={configForm.isEnabled ? '#E11D48' : '#64748B'}>
                {configForm.isEnabled ? 'Left Tab Active' : 'Left Tab Disabled'}
              </Typography>
            }
          />
        </Box>

        <form onSubmit={handleSaveConfig}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Discount Headline *"
                fullWidth
                value={configForm.discountHeadline}
                onChange={(e) => setConfigForm({ ...configForm, discountHeadline: e.target.value })}
                placeholder="20% OFF"
                helperText="Displayed inside the green promo banner"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Discount Percentage / Value *"
                fullWidth
                value={configForm.discountPercentage}
                onChange={(e) => setConfigForm({ ...configForm, discountPercentage: e.target.value })}
                placeholder="20% OFF"
                helperText="Subtext on the generated coupon card"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Coupon Code Prefix *"
                fullWidth
                value={configForm.codePrefix}
                onChange={(e) => setConfigForm({ ...configForm, codePrefix: e.target.value.toUpperCase() })}
                placeholder="APEX"
                helperText="e.g. APEX generates APEX98LU"
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Floating Tab Label *"
                fullWidth
                value={configForm.tabLabel}
                onChange={(e) => setConfigForm({ ...configForm, tabLabel: e.target.value })}
                placeholder="GET DISCOUNT"
                helperText="Vertical text on the left screen edge"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Validity Days *"
                type="number"
                fullWidth
                value={configForm.validityDays}
                onChange={(e) => setConfigForm({ ...configForm, validityDays: Number(e.target.value) })}
                helperText="Days before the generated coupon expires"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Discount Subtitle / Target *"
                fullWidth
                value={configForm.discountSubtext}
                onChange={(e) => setConfigForm({ ...configForm, discountSubtext: e.target.value })}
                placeholder="Exclusive discount for new patients!"
                helperText="Shown directly below the headline"
                required
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                startIcon={<SaveIcon />}
                sx={{ py: 1.2, px: 3.5, fontWeight: 700 }}
              >
                Save Offer Settings
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* 2. CAPTURED LEADS DIRECTORY */}
      <Paper elevation={0} sx={{ p: 3.5, borderRadius: 3.5, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#0A2540">
              📋 Patient Discount Inquiries & Leads ({filteredLeads.length})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Follow up directly with phone numbers submitted via the discount widget.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search phone or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: '#94A3B8' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 220 }}
            />

            <FormControl size="small" sx={{ width: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Claimed">Claimed</MenuItem>
                <MenuItem value="Booked">Booked</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Patient Phone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Coupon Code</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Offer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Claimed Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Quick Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5, color: '#94A3B8' }}>
                    No discount leads match your current filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => {
                  const cleanPhone = lead.phone.replace(/[^+\d]/g, '');
                  const waNumber = lead.phone.replace(/\D/g, '');
                  const waMessage = encodeURIComponent(
                    `Hello! We noticed you claimed your ${lead.discount || '20%'} discount voucher (Code: ${lead.code}) at Apex Dental Studio. Would you like us to reserve a consultation slot for you?`
                  );

                  return (
                    <TableRow key={lead.id} hover>
                      {/* Phone */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span style={{ fontSize: '1.2rem' }}>🇮🇳</span>
                          <Typography variant="body2" fontWeight={800} color="#0A2540">
                            {lead.phone}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Code */}
                      <TableCell>
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          <Chip
                            label={lead.code}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              bgcolor: '#EFF6FF',
                              color: '#2563EB',
                              border: '1px solid #BFDBFE',
                              letterSpacing: '0.04em',
                            }}
                          />
                          <Tooltip title={copiedId === lead.id ? 'Copied!' : 'Copy Code'}>
                            <IconButton size="small" onClick={() => handleCopy(lead.id, lead.code)}>
                              {copiedId === lead.id ? <CheckIcon sx={{ fontSize: 16, color: '#16A34A' }} /> : <ContentCopyIcon sx={{ fontSize: 15 }} />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>

                      {/* Offer */}
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="#15803D">
                          {lead.discount || '20% OFF'}
                        </Typography>
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </TableCell>

                      {/* Status Dropdown */}
                      <TableCell>
                        <Select
                          size="small"
                          value={lead.status || 'Claimed'}
                          onChange={(e) => updateDiscountLeadStatus(lead.id, e.target.value)}
                          sx={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            borderRadius: 2,
                            height: 30,
                            bgcolor:
                              lead.status === 'Booked'
                                ? '#ECFDF5'
                                : lead.status === 'Contacted'
                                ? '#EFF6FF'
                                : '#FEF3C7',
                            color:
                              lead.status === 'Booked'
                                ? '#065F46'
                                : lead.status === 'Contacted'
                                ? '#1E40AF'
                                : '#92400E',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'transparent',
                            },
                          }}
                        >
                          <MenuItem value="Claimed">Claimed</MenuItem>
                          <MenuItem value="Contacted">Contacted</MenuItem>
                          <MenuItem value="Booked">Booked</MenuItem>
                        </Select>
                      </TableCell>

                      {/* Quick Actions */}
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          {/* Call Button */}
                          <Tooltip title={`Call ${lead.phone}`}>
                            <IconButton
                              component="a"
                              href={`tel:${cleanPhone}`}
                              size="small"
                              sx={{
                                color: '#E11D48',
                                bgcolor: 'rgba(225, 29, 72, 0.08)',
                                '&:hover': { bgcolor: 'rgba(225, 29, 72, 0.16)' },
                              }}
                            >
                              <PhoneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {/* WhatsApp Button */}
                          <Tooltip title="Send WhatsApp Message with Coupon">
                            <IconButton
                              component="a"
                              href={`https://wa.me/${waNumber}?text=${waMessage}`}
                              target="_blank"
                              size="small"
                              sx={{
                                color: '#25D366',
                                bgcolor: 'rgba(37, 211, 102, 0.08)',
                                '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.16)' },
                              }}
                            >
                              <WhatsAppIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {/* Delete Button */}
                          <Tooltip title="Delete Lead">
                            <IconButton
                              size="small"
                              onClick={() => deleteDiscountLead(lead.id)}
                              sx={{
                                color: '#EF4444',
                                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Manual Lead Dialog */}
      <Dialog open={addLeadOpen} onClose={() => setAddLeadOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#0A2540' }}>Issue Coupon Manually</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Record a patient who called the front desk and issue them a tracked discount coupon.
          </Typography>
          <TextField
            label="Phone Number *"
            fullWidth
            type="tel"
            placeholder="98765 43210"
            value={newLeadPhone}
            onChange={(e) => setNewLeadPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            sx={{ mb: 2, mt: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span>🇮🇳 +91</span>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Custom Coupon Code (Optional)"
            fullWidth
            placeholder={`Auto-generated (e.g. ${configForm.codePrefix}7890)`}
            value={newLeadCode}
            onChange={(e) => setNewLeadCode(e.target.value.toUpperCase())}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setAddLeadOpen(false)}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={handleAddManualLead} sx={{ fontWeight: 700 }}>
            Generate & Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCoupons;
