import React from 'react';
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import { useApp } from '../../context/AppContext';

const ManageContactRequests = () => {
  const { contactRequests } = useApp();

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} color="#0F4C81" mb={3}>
        Incoming Contact Requests ({contactRequests.length})
      </Typography>

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: '#FFF', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Sender Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Contact Info</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Message</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contactRequests.map((req) => (
              <TableRow key={req.id} hover>
                <TableCell fontWeight={700} color="#0F4C81">
                  {req.name}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{req.email}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {req.phone || 'No phone'}
                  </Typography>
                </TableCell>
                <TableCell>{req.subject || 'General Inquiry'}</TableCell>
                <TableCell sx={{ maxWidth: 300 }}>{req.message}</TableCell>
                <TableCell>{new Date(req.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {contactRequests.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No incoming contact messages yet.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ManageContactRequests;
