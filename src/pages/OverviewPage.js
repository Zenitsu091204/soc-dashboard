import * as React from 'react';
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SeverityChip from '../components/SeverityChip';
import StatCard from '../components/StatCard';
import SeverityDistributionCard from '../components/SeverityDistributionCard';
import AlertsTrendCard from '../components/AlertsTrendCard';
import AlertStatusCard from '../components/AlertStatusCard';
import RiskScoreCard from '../components/RiskScoreCard';
import { alerts, iocs, threatActors, formatUtc } from '../data/mockSocData';

function filterAlertsByRange(allAlerts, range) {
  if (!range) return allAlerts;
  const now = new Date('2026-02-12T06:00:00Z'); // fixed "now" for mock data

  const maxDiffMs = {
    '1h': 1 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  }[range];

  if (!maxDiffMs) return allAlerts;

  return allAlerts.filter((a) => {
    const t = new Date(a.time);
    return now - t <= maxDiffMs;
  });
}

export default function OverviewPage() {
  const { timeRange } = useOutletContext() || { timeRange: '24h' };

  const filteredAlerts = React.useMemo(
    () => filterAlertsByRange(alerts, timeRange),
    [timeRange],
  );

  const totalAlerts = filteredAlerts.length;
  const criticalAlerts = filteredAlerts.filter(
    (a) => a.severity === 'critical',
  ).length;
  const highAlerts = filteredAlerts.filter(
    (a) => a.severity === 'high',
  ).length;
  const iocCount = iocs.length;
  const taCount = threatActors.length;

  return (
    <Box>
      <PageHeader
        title="Overview"
        subtitle="A quick snapshot of alerts, indicators, and tracked entities."
      />

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4} lg={4}>
          <RiskScoreCard score={72} trend={5} />
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={2}>
          <StatCard
            label="Total alerts"
            value={totalAlerts}
            helper={`In selected range (${timeRange})`}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={2}>
          <StatCard
            label="Critical alerts"
            value={criticalAlerts}
            helper="Highest urgency"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={2}>
          <StatCard
            label="High alerts"
            value={highAlerts}
            helper="Next to review"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={2}>
          <StatCard
            label="Threat actors"
            value={taCount}
            helper="Profiles maintained"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            label="IOCs tracked"
            value={iocCount}
            helper="Across sources"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} lg={6}>
          <AlertsTrendCard alerts={filteredAlerts} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <SeverityDistributionCard alerts={filteredAlerts} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <AlertStatusCard alerts={filteredAlerts} />
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
        <Typography sx={{ fontWeight: 900 }}>Recent alerts</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Table view of the latest alerts (mock data).
        </Typography>

        <Box sx={{ mt: 2, overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Entity</TableCell>
                <TableCell align="right">Severity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((a) => (
                <TableRow key={a.id} hover>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {formatUtc(a.time)}
                  </TableCell>
                  <TableCell>{a.title}</TableCell>
                  <TableCell>{a.entity}</TableCell>
                  <TableCell align="right">
                    <SeverityChip severity={a.severity} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}

