import React from 'react';
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
} from '@mui/material';
import PageHeader from '../components/PageHeader';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import PublicIcon from '@mui/icons-material/Public';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoIcon from '@mui/icons-material/Info';

// Mock threat intelligence data
const threatIntelligence = {
  activeCampaigns: [
    {
      id: 'C001',
      name: 'Operation ShadowNet',
      threatActor: 'APT29 (Cozy Bear)',
      severity: 'critical',
      firstSeen: '2026-02-01',
      lastSeen: '2026-02-13',
      targetSectors: ['Government', 'Defense', 'Energy'],
      ttps: ['T1566.001', 'T1059.001', 'T1071.001'],
      confidence: 95,
      affectedAssets: 12,
    },
    {
      id: 'C002',
      name: 'PhishStorm 2026',
      threatActor: 'TA505',
      severity: 'high',
      firstSeen: '2026-01-28',
      lastSeen: '2026-02-12',
      targetSectors: ['Finance', 'Healthcare', 'Retail'],
      ttps: ['T1566.002', 'T1204.002', 'T1105'],
      confidence: 88,
      affectedAssets: 45,
    },
    {
      id: 'C003',
      name: 'RansomWave Q1',
      threatActor: 'LockBit 3.0',
      severity: 'critical',
      firstSeen: '2026-02-05',
      lastSeen: '2026-02-13',
      targetSectors: ['Manufacturing', 'Education', 'Healthcare'],
      ttps: ['T1486', 'T1490', 'T1489'],
      confidence: 92,
      affectedAssets: 8,
    },
    {
      id: 'C004',
      name: 'Supply Chain Infiltration',
      threatActor: 'APT41',
      severity: 'high',
      firstSeen: '2026-01-15',
      lastSeen: '2026-02-10',
      targetSectors: ['Technology', 'Telecommunications'],
      ttps: ['T1195.002', 'T1078', 'T1027'],
      confidence: 85,
      affectedAssets: 23,
    },
  ],
  emergingThreats: [
    {
      id: 'ET001',
      title: 'New Zero-Day in Microsoft Exchange',
      description: 'Critical RCE vulnerability actively exploited in the wild',
      severity: 'critical',
      cve: 'CVE-2026-0001',
      publishedDate: '2026-02-12',
      exploitAvailable: true,
      patchAvailable: false,
    },
    {
      id: 'ET002',
      title: 'Sophisticated Phishing Campaign Targeting C-Suite',
      description: 'AI-generated deepfake voice messages used in BEC attacks',
      severity: 'high',
      cve: null,
      publishedDate: '2026-02-11',
      exploitAvailable: false,
      patchAvailable: false,
    },
    {
      id: 'ET003',
      title: 'Malicious npm Package Discovered',
      description: 'Popular JavaScript library compromised with backdoor',
      severity: 'high',
      cve: null,
      publishedDate: '2026-02-10',
      exploitAvailable: true,
      patchAvailable: true,
    },
  ],
  iocFeeds: [
    {
      type: 'IP Address',
      value: '192.168.100.45',
      threatType: 'C2 Server',
      confidence: 'High',
      firstSeen: '2026-02-13',
      sources: 3,
    },
    {
      type: 'Domain',
      value: 'malicious-update.com',
      threatType: 'Phishing',
      confidence: 'Critical',
      firstSeen: '2026-02-12',
      sources: 5,
    },
    {
      type: 'File Hash',
      value: 'a1b2c3d4e5f6...',
      threatType: 'Ransomware',
      confidence: 'High',
      firstSeen: '2026-02-11',
      sources: 4,
    },
    {
      type: 'Email',
      value: 'ceo@fake-company.net',
      threatType: 'BEC',
      confidence: 'Medium',
      firstSeen: '2026-02-10',
      sources: 2,
    },
  ],
};

export default function IntelReportPage() {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#EF4444';
      case 'high':
        return '#F97316';
      case 'medium':
        return '#EAB308';
      case 'low':
        return '#22C55E';
      default:
        return '#94A3B8';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return '#22C55E';
    if (confidence >= 75) return '#EAB308';
    return '#F97316';
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Threat Intelligence Reports"
        subtitle="Real-time threat intelligence, active campaigns, and emerging threats"
      />

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <WarningIcon sx={{ fontSize: 40, color: '#EF4444' }} />
                <Box>
                  <Typography variant="h3" sx={{ color: '#EF4444', fontWeight: 900 }}>
                    {threatIntelligence.activeCampaigns.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Active Campaigns
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, rgba(249, 115, 22, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)',
              border: '1px solid rgba(249, 115, 22, 0.2)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: '#F97316' }} />
                <Box>
                  <Typography variant="h3" sx={{ color: '#F97316', fontWeight: 900 }}>
                    {threatIntelligence.emergingThreats.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Emerging Threats
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SecurityIcon sx={{ fontSize: 40, color: '#6366F1' }} />
                <Box>
                  <Typography variant="h3" sx={{ color: '#6366F1', fontWeight: 900 }}>
                    {threatIntelligence.iocFeeds.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Recent IOCs
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PublicIcon sx={{ fontSize: 40, color: '#22C55E' }} />
                <Box>
                  <Typography variant="h3" sx={{ color: '#22C55E', fontWeight: 900 }}>
                    12
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Intel Sources
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Campaigns */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <BugReportIcon sx={{ color: '#EF4444' }} />
          Active Threat Campaigns
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Campaign</TableCell>
                <TableCell>Threat Actor</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Target Sectors</TableCell>
                <TableCell>Confidence</TableCell>
                <TableCell>Affected Assets</TableCell>
                <TableCell>Last Seen</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {threatIntelligence.activeCampaigns.map((campaign) => (
                <TableRow key={campaign.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {campaign.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {campaign.id}
                    </Typography>
                  </TableCell>
                  <TableCell>{campaign.threatActor}</TableCell>
                  <TableCell>
                    <Chip
                      label={campaign.severity.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: getSeverityColor(campaign.severity),
                        color: 'white',
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {campaign.targetSectors.slice(0, 2).map((sector) => (
                        <Chip
                          key={sector}
                          label={sector}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {campaign.targetSectors.length > 2 && (
                        <Chip
                          label={`+${campaign.targetSectors.length - 2}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={campaign.confidence}
                        sx={{
                          width: 60,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getConfidenceColor(campaign.confidence),
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ color: getConfidenceColor(campaign.confidence) }}>
                        {campaign.confidence}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {campaign.affectedAssets}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {campaign.lastSeen}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Grid container spacing={3}>
        {/* Emerging Threats */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon sx={{ color: '#F97316' }} />
              Emerging Threats
            </Typography>
            {threatIntelligence.emergingThreats.map((threat) => (
              <Box
                key={threat.id}
                sx={{
                  mb: 2,
                  p: 2,
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 1,
                  borderLeft: `4px solid ${getSeverityColor(threat.severity)}`,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {threat.title}
                  </Typography>
                  <Chip
                    label={threat.severity.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: getSeverityColor(threat.severity),
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  {threat.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {threat.cve && (
                    <Chip label={threat.cve} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                  )}
                  {threat.exploitAvailable && (
                    <Chip
                      label="Exploit Available"
                      size="small"
                      sx={{ backgroundColor: '#EF4444', color: 'white', fontSize: '0.65rem' }}
                    />
                  )}
                  {threat.patchAvailable && (
                    <Chip
                      label="Patch Available"
                      size="small"
                      sx={{ backgroundColor: '#22C55E', color: 'white', fontSize: '0.65rem' }}
                    />
                  )}
                  <Chip
                    label={threat.publishedDate}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.65rem' }}
                  />
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Recent IOCs */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon sx={{ color: '#6366F1' }} />
              Recent Indicators of Compromise
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Threat</TableCell>
                    <TableCell>Confidence</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {threatIntelligence.iocFeeds.map((ioc, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Chip label={ioc.type} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {ioc.value}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">{ioc.threatType}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ioc.confidence}
                          size="small"
                          sx={{
                            backgroundColor:
                              ioc.confidence === 'Critical'
                                ? '#EF4444'
                                : ioc.confidence === 'High'
                                ? '#F97316'
                                : '#EAB308',
                            color: 'white',
                            fontSize: '0.65rem',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon fontSize="small" sx={{ color: '#6366F1' }} />
                IOCs are automatically enriched from 12 threat intelligence feeds
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
