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
import AlertsTrendCard from '../components/AlertsTrendCard';
import AlertStatusCard from '../components/AlertStatusCard';
import TopThreatActorsCard from '../components/TopThreatActorsCard';
import TopAssetsCard from '../components/TopAssetsCard';
import IocDistributionCard from '../components/IocDistributionCard';
import RecentActivityFeed from '../components/RecentActivityFeed';
import FilterPanel, { FilterButton } from '../components/FilterPanel';
import { alerts, formatUtc } from '../data/mockSocData';

// Enterprise card styling
const enterpriseCardSx = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(255,255,255,0.05)',
  background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.7))',
  borderRadius: '16px',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(99, 102, 241, 0.3)',
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
  },
};

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

function applyFilters(alertsList, filters) {
  return alertsList.filter((alert) => {
    const severityMatch = Object.keys(filters.severity).every(
      (key) => !filters.severity[key] || alert.severity === key
    );
    const statusMatch = Object.keys(filters.status).every(
      (key) => !filters.status[key] || alert.status === key
    );
    return severityMatch && statusMatch;
  });
}

export default function OverviewPage() {
  const { timeRange } = useOutletContext() || { timeRange: '24h' };
  const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState({
    severity: {
      critical: false,
      high: false,
      medium: false,
      low: false,
    },
    status: {
      open: false,
      'in-progress': false,
      resolved: false,
      'false-positive': false,
    },
  });

  const filteredAlerts = React.useMemo(() => {
    const timeFiltered = filterAlertsByRange(alerts, timeRange);
    return applyFilters(timeFiltered, activeFilters);
  }, [timeRange, activeFilters]);

  const totalAlerts = filteredAlerts.length;
  const criticalAlerts = filteredAlerts.filter((a) => a.severity === 'critical').length;
  const highAlerts = filteredAlerts.filter((a) => a.severity === 'high').length;
  const mediumAlerts = filteredAlerts.filter((a) => a.severity === 'medium').length;
  const lowAlerts = filteredAlerts.filter((a) => a.severity === 'low').length;

  const calculateRiskScore = () => {
    if (totalAlerts === 0) return 0;
    const weightedScore = (criticalAlerts * 10) + (highAlerts * 5) + (mediumAlerts * 2) + (lowAlerts * 1);
    const maxPossibleScore = totalAlerts * 10;
    return Math.min(100, Math.round((weightedScore / maxPossibleScore) * 100));
  };

  const riskScore = calculateRiskScore();

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };

  const activeFiltersCount = 
    Object.values(activeFilters.severity).filter(Boolean).length +
    Object.values(activeFilters.status).filter(Boolean).length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <PageHeader
        title="Live Monitor"
        subtitle="Real-time security operations center dashboard"
        rightContent={
          <FilterButton
            onClick={() => setFilterPanelOpen(true)}
            activeCount={activeFiltersCount}
          />
        }
      />

      {/* Row 1: KPI Cards */}
      <Grid container spacing={3} sx={{ mt: 2 }} alignItems="stretch">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total Alerts"
            value={totalAlerts}
            trend={12}
            helper={`Last ${timeRange}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Critical"
            value={criticalAlerts}
            severity="critical"
            trend={5}
            helper="Requires immediate action"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="High Priority"
            value={highAlerts}
            severity="high"
            trend={-3}
            helper="Elevated threat level"
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

      {/* Row 2: Alerts Trend + IOC Distribution */}
      <Grid container spacing={3} sx={{ mt: 3 }} alignItems="stretch">
        <Grid item xs={12} md={8}>
          <Box sx={{ height: '100%', minHeight: 450 }}>
            {filteredAlerts.length === 0 ? (
              <Paper sx={{ ...enterpriseCardSx, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Alerts Trend</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  No alert data available for the selected time range.
                </Typography>
              </Paper>
            ) : (
              <AlertsTrendCard alerts={filteredAlerts} />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ height: '100%', minHeight: 450 }}>
            <IocDistributionCard />
          </Box>
        </Grid>
      </Grid>

      {/* Row 3: Top Assets + Alert Status */}
      <Grid container spacing={3} sx={{ mt: 3 }} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', minHeight: 400 }}>
            <TopAssetsCard alerts={filteredAlerts} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', minHeight: 400 }}>
            <AlertStatusCard alerts={filteredAlerts} />
          </Box>
        </Grid>
      </Grid>

      {/* Row 4: Threat Actors + Recent Activity */}
      <Grid container spacing={3} sx={{ mt: 3 }} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', minHeight: 400 }}>
            <TopThreatActorsCard />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', minHeight: 400 }}>
            <RecentActivityFeed alerts={filteredAlerts} maxItems={8} />
          </Box>
        </Grid>
      </Grid>

      {/* Recent Alerts Table */}
      <Paper sx={{ ...enterpriseCardSx, mt: 4, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          Recent Alerts
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Severity</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Entity</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlerts.slice(0, 10).map((alert) => (
                <TableRow
                  key={alert.id}
                  sx={{
                    '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.05)' },
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {formatUtc(alert.time)}
                  </TableCell>
                  <TableCell>
                    <SeverityChip severity={alert.severity} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 400 }}>{alert.title}</TableCell>
                  <TableCell>{alert.entity}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>
                    {alert.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Filter Panel */}
      <FilterPanel
        open={filterPanelOpen}
        onClose={() => setFilterPanelOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={activeFilters}
      />
    </Box>
  );
}
