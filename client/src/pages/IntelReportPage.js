import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import PageHeader from '../components/PageHeader';
import api from '../services/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import PublicIcon from '@mui/icons-material/Public';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoIcon from '@mui/icons-material/Info';

export default function IntelReportPage() {
  const [campaigns, setCampaigns]       = useState([]);
  const [iocs, setIocs]                 = useState([]);
  const [threatActors, setThreatActors] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignRes, iocRes, actorRes] = await Promise.all([
          api.get('/campaigns'),
          api.get('/intel/iocs'),
          api.get('/intel/threat-actors'),
        ]);
        setCampaigns(campaignRes.data.timeline || []);
        setIocs(iocRes.data?.data || iocRes.data || []);
        setThreatActors(actorRes.data?.data || actorRes.data || []);
      } catch (err) {
        console.error('Failed to load intel report data', err);
        setError('Failed to load intelligence data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSeverityColor = (severity) => {
    switch ((severity || '').toLowerCase()) {
      case 'critical': return '#EF4444';
      case 'high':     return '#F97316';
      case 'medium':   return '#EAB308';
      case 'low':      return '#22C55E';
      default:         return '#94A3B8';
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0B1120' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Threat_Intel_Report.pdf');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Typography color="text.secondary">Loading intelligence data…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'Active' || c.status === 'Investigating');

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <PageHeader
          title="Threat Intelligence Reports"
          subtitle="Real-time threat intelligence, active campaigns, and emerging threats"
        />
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExportPDF}
          sx={{ bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' }, mt: 2 }}
        >
          Download PDF
        </Button>
      </Box>

      <Box id="report-content" sx={{ backgroundColor: 'transparent' }}>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(145deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.05) 100%)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <WarningIcon sx={{ fontSize: 40, color: '#EF4444' }} />
                  <Box>
                    <Typography variant="h3" sx={{ color: '#EF4444', fontWeight: 900 }}>{activeCampaigns.length}</Typography>
                    <Typography variant="caption" color="text.secondary">Active Campaigns</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(145deg, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0.05) 100%)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 40, color: '#F97316' }} />
                  <Box>
                    <Typography variant="h3" sx={{ color: '#F97316', fontWeight: 900 }}>{threatActors.length}</Typography>
                    <Typography variant="caption" color="text.secondary">Known Threat Actors</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(145deg, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.05) 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SecurityIcon sx={{ fontSize: 40, color: '#6366F1' }} />
                  <Box>
                    <Typography variant="h3" sx={{ color: '#6366F1', fontWeight: 900 }}>{iocs.length}</Typography>
                    <Typography variant="caption" color="text.secondary">IOCs in Database</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(145deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PublicIcon sx={{ fontSize: 40, color: '#22C55E' }} />
                  <Box>
                    <Typography variant="h3" sx={{ color: '#22C55E', fontWeight: 900 }}>{campaigns.length}</Typography>
                    <Typography variant="caption" color="text.secondary">Total Campaigns</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Active Campaigns */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <BugReportIcon sx={{ color: '#EF4444' }} /> Active Threat Campaigns
          </Typography>
          {activeCampaigns.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No active campaigns. Connect your SIEM or add campaigns via the API.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Campaign</TableCell>
                    <TableCell>Actor</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Indicators</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCampaigns.map((campaign) => (
                    <TableRow key={campaign.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{campaign.title}</Typography>
                      </TableCell>
                      <TableCell>{campaign.actor || '—'}</TableCell>
                      <TableCell>
                        <Chip label={campaign.severity?.toUpperCase()} size="small"
                          sx={{ backgroundColor: getSeverityColor(campaign.severity), color: 'white', fontWeight: 700 }} />
                      </TableCell>
                      <TableCell>{campaign.indicators}</TableCell>
                      <TableCell>{campaign.status}</TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(campaign.startDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Grid container spacing={3}>
          {/* Threat Actors */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ color: '#F97316' }} /> Known Threat Actors
              </Typography>
              {threatActors.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No threat actors in database. Connect OpenCTI or add via the API.
                </Typography>
              ) : (
                threatActors.slice(0, 5).map((actor) => (
                  <Box key={actor.id} sx={{ mb: 2, p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, borderLeft: '4px solid #F97316' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{actor.name}</Typography>
                    {actor.description && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {actor.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                      {actor.origin && <Chip label={actor.origin} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />}
                      {actor.type   && <Chip label={actor.type}   size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />}
                    </Box>
                  </Box>
                ))
              )}
            </Paper>
          </Grid>

          {/* Recent IOCs */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon sx={{ color: '#6366F1' }} /> Recent Indicators of Compromise
              </Typography>
              {iocs.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No IOCs in database. Connect MISP or add via the API.
                </Typography>
              ) : (
                <>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Value</TableCell>
                          <TableCell>Reputation</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {iocs.slice(0, 6).map((ioc) => (
                          <TableRow key={ioc.id} hover>
                            <TableCell><Chip label={ioc.type} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} /></TableCell>
                            <TableCell><Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{ioc.value}</Typography></TableCell>
                            <TableCell>
                              <Chip label={`${ioc.reputation ?? 'N/A'}%`} size="small"
                                sx={{ backgroundColor: ioc.reputation >= 90 ? '#EF4444' : ioc.reputation >= 70 ? '#F97316' : '#EAB308', color: 'white', fontSize: '0.65rem' }} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(99,102,241,0.1)', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InfoIcon fontSize="small" sx={{ color: '#6366F1' }} />
                      IOCs sourced from your connected threat intelligence feeds
                    </Typography>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
