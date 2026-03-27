import React from 'react';
import { Box, Typography, Chip, Table, TableBody, TableCell, TableRow, TableHead, TableContainer } from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';

export default function TopCvesWidget() {
  const cves = [];

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
        <BugReportIcon sx={{ color: '#ef4444', fontSize: 20 }} /> Top Exploited CVEs
      </Typography>
      
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'text.secondary', fontSize: '0.75rem' } }}>
                <TableCell>CVE ID</TableCell>
                <TableCell>CVSS</TableCell>
                <TableCell>Product</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cves.map(row => (
                <TableRow key={row.cve} sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'text.primary', fontSize: '0.8rem' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>{row.cve}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.score.toFixed(1)} 
                      size="small" 
                      sx={{ height: 20, bgcolor: row.score >= 9 ? '#ef4444' : row.score >= 7 ? '#f59e0b' : '#3b82f6', color: 'white', fontWeight: 'bold' }} 
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{row.product}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
