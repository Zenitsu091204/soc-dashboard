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
import SeveritySnapshotRow from '../components/SeveritySnapshotRow';
import AlertsTrendCard from '../components/AlertsTrendCard';
import AlertStatusCard from '../components/AlertStatusCard';
import TopThreatActorsCard from '../components/TopThreatActorsCard';
import TopAssetsCard from '../components/TopAssetsCard';
import IocDistributionCard from '../components/IocDistributionCard';
import RecentActivityFeed from '../components/RecentActivityFeed';
import { alerts, formatUtc } from '../data/mockSocData';

function filterAlertsByRange(allAlerts, range) {
  if (!range) return allAlerts;
  const now = new Date('2026-02-12T06:00:00Z');

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

  const calculateRiskScore = () => {
    if (totalAlerts === 0) return 0;
    const weightedScore = (criticalAlerts * 10) + (highAlerts * 5) + (mediumAlerts * 2) + (lowAlerts * 1);
    const maxPossibleScore = totalAlerts * 10;
    return Math.min(100, Math.round((weightedScore / maxPossibleScore) * 100));
  };

  const riskScore = calculateRiskScore();

  return (
    <Box>
      <PageHeader
        title="Overview"
        subtitle="Real-time SOC monitoring and threat intelligence"
      />

      {/* Row 1: Main KPI Cards */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total Alerts"
            value={totalAlerts}
            trend={12}
            helper={`In selected range (${timeRange})`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Critical"
            value={criticalAlerts}
            severity="critical"
            trend={15}
            helper="Requires immediate action"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="High Priority"
            value={highAlerts}
            severity="high"
            trend={-5}
            helper="Next to review"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Risk Score"
            value={riskScore}
            trend={8}
            helper="Overall threat level"
          />
        </Grid>
      </Grid>

      {/* Row 2: Severity Snapshot */}
      <Box sx={{ mt: 3 }}>
        <SeveritySnapshotRow
          criticalCount={criticalAlerts}
          highCount={highAlerts}
          mediumCount={mediumAlerts}
          lowCount={lowAlerts}
        />
      </Box>

      {/* Row 3: Alert Activity + Right Stack */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={7}>
          {filteredAlerts.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 2, height: 450 }}>
              <Typography sx={{ fontWeight: 900 }}>Alerts Trend</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                No alert data available yet.
              </Typography>
            </Paper>
          ) : (
            <AlertsTrendCard alerts={filteredAlerts} />
          )}
        </Grid>

        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <IocDistributionCard />
            <TopAssetsCard alerts={filteredAlerts} />
            <TopThreatActorsCard />
          </Box>
        </Grid>
      </Grid>

      {/* Row 4: Recent Activity Feed + Alert Status */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <RecentActivityFeed alerts={filteredAlerts} maxItems={10} />
        </Grid>
        <Grid item xs={12} md={4}>
          <AlertStatusCard alerts={filteredAlerts} />
        </Grid>
      </Grid>

      {/* Recent Alerts Table */}
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
                filteredAlerts.slice(0, 10).map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{formatUtc(alert.time)}</TableCell>
                    <TableCell>{alert.title}</TableCell>
                    <TableCell>{alert.entity}</TableCell>
                    <TableCell align="right">
                      <SeverityChip severity={alert.severity} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}
