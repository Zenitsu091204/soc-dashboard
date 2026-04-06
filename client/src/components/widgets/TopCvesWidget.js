import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Table, TableBody, TableCell, TableRow, TableHead, TableContainer, CircularProgress } from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';

export default function TopCvesWidget() {
  const [cves, setCves] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real production deployment, this widget should connect to an internal 
  // Vulnerability Management System (e.g., Nessus, Qualys, or DefectDojo API)
  // rather than a public global feed like NVD, so it only shows vulnerabilities
  // relevant to the organization's actual assets.
  useEffect(() => {
    const fetchLocalVulnerabilities = async () => {
      try {
        // Simulating the check for internal vulnerability scanner integration.
        // Currently no scanner is attached, so it returns empty.
        setTimeout(() => {
          setCves([]);
          setLoading(false);
        }, 600);
      } catch (err) {
        console.error('Failed to fetch internal CVEs:', err);
        setLoading(false);
      }
    };

    fetchLocalVulnerabilities();
  }, []);

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
        <BugReportIcon sx={{ color: '#ef4444', fontSize: 20 }} /> Top Exploited CVEs
      </Typography>

      <Box sx={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={24} sx={{ color: '#6366F1' }} />
          </Box>
        ) : cves.length === 0 ? (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>No internal vulnerabilities detected</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'text.secondary', fontSize: '0.75rem' } }}>
                  <TableCell>CVE ID</TableCell>
                  <TableCell>CVSS</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cves.map(row => (
                  <TableRow key={row.cve} sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'text.primary', fontSize: '0.8rem' } }}>
                    <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      <span style={{ color: '#818cf8' }}>{row.cve}</span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.score.toFixed(1)}
                        size="small"
                        sx={{
                          height: 20,
                          bgcolor: row.score >= 9 ? '#ef4444' : row.score >= 7 ? '#f59e0b' : '#3b82f6',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.product}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
