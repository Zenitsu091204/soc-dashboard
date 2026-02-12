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
import TopThreatActorsCard from '../components/TopThreatActorsCard';
import IocDistributionCard from '../components/IocDistributionCard';
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
  const mediumAlerts = filteredAlerts.filter(
    (a) => a.severity === 'medium',
  ).length;
  const lowAlerts = filteredAlerts.filter((a) => a.severity === 'low').length;
  const iocCount = iocs.length;
  const taCount = threatActors.length;

  return (
    <Box>
      <PageHeader
        title="Overview"
        subtitle="A quick snapshot of alerts, indicators, and tracked entities."
      />

      {/* KPI row: SOC-style summary */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total alerts"
            value={totalAlerts}
            helper={
              totalAlerts === 0
                ? 'No alerts yet'
                : `In selected range (${timeRange})`
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Critical"
            value={criticalAlerts}
            helper="Highest urgency"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="High"
            value={highAlerts}
            helper="Next to review"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Medium / Low"
            value={mediumAlerts + lowAlerts}
            helper="Lower priority"
          />
        </Grid>
      </Grid>

      {/* Secondary KPIs */}
      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <RiskScoreCard score={72} trend={5} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Threat actors"
            value={taCount}
            helper="Profiles maintained"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="IOCs tracked"
            value={iocCount}
            helper="Across sources"
          />
        </Grid>
      </Grid>


      {/* Main analytics row: big trend + severity distribution */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          {filteredAlerts.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 2, height: 420 }}>
              <Typography sx={{ fontWeight: 900 }}>Alerts trend</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                No alert data available yet. Connect your SIEM/feed to see trends.
              </Typography>
            </Paper>
          ) : (
            <AlertsTrendCard alerts={filteredAlerts} />
          )}
        </Grid>
        <Grid item xs={12} md={4}>
            {filteredAlerts.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 2, height: 420 }}>
                <Typography sx={{ fontWeight: 900 }}>Severity distribution</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  No alerts to display. Severity breakdown will appear here.
                </Typography>
              </Paper>
            ) : (
              <SeverityDistributionCard alerts={filteredAlerts} />
            )}
        </Grid>
      </Grid>

      {/* Bottom row: supporting analytics (three equal columns) */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <AlertStatusCard alerts={filteredAlerts} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopThreatActorsCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <IocDistributionCard />
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
        <Typography sx={{ fontWeight: 900 }}>Recent alerts</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Table view of the latest alerts.
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
              {filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="body2" color="text.secondary">
                      No alerts to display yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
              filteredAlerts.map((a) => (
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
              )))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}

