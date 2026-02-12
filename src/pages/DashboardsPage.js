import * as React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';
import {
  alerts,
  iocs,
  threatActors,
  formatUtc,
} from '../data/mockSocData';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

function buildAlertsOverTime() {
  // Small helper that groups alerts by day label
  const map = new Map();
  alerts.forEach((a) => {
    const d = new Date(a.time);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    const current = map.get(key) || 0;
    map.set(key, current + 1);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([day, count]) => ({
      day,
      label: formatUtc(day + 'T00:00:00Z').split(',')[0],
      count,
    }));
}

function buildAlertsByEntity() {
  const counts = new Map();
  alerts.forEach((a) => {
    const key = a.entity;
    const current = counts.get(key) || 0;
    counts.set(key, current + 1);
  });

  return Array.from(counts.entries()).map(([entity, count]) => ({
    entity,
    count,
  }));
}

function buildIocTypeDistribution() {
  const counts = new Map();
  iocs.forEach((i) => {
    const current = counts.get(i.type) || 0;
    counts.set(i.type, current + 1);
  });

  return Array.from(counts.entries()).map(([type, value]) => ({
    name: type,
    value,
  }));
}

const IOC_COLORS = ['#22c55e', '#38bdf8', '#f97316', '#a855f7'];

export default function DashboardsPage() {
  const alertsOverTime = React.useMemo(() => buildAlertsOverTime(), []);
  const alertsByEntity = React.useMemo(() => buildAlertsByEntity(), []);
  const iocTypeDistribution = React.useMemo(
    () => buildIocTypeDistribution(),
    []
  );

  return (
    <Box>
      <PageHeader
        title="Dashboards"
        subtitle="Visual overview of SOC activity using mock data."
      />

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 2, height: 300 }}>
            <Typography sx={{ fontWeight: 900 }}>
              Alerts over time
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Simple time series of alerts using mock timestamps.
            </Typography>
            <Box sx={{ mt: 2, height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={alertsOverTime}>
                  <XAxis
                    dataKey="label"
                    stroke="#9ca3af"
                    tickLine={false}
                    axisLine={{ stroke: '#4b5563' }}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="#9ca3af"
                    tickLine={false}
                    axisLine={{ stroke: '#4b5563' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1f2937',
                      borderRadius: 8,
                      color: '#e5e7eb',
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, height: 300 }}>
            <Typography sx={{ fontWeight: 900 }}>
              Alerts by asset
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              How many alerts each asset generated.
            </Typography>
            <Box sx={{ mt: 2, height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertsByEntity} layout="vertical">
                  <XAxis
                    type="number"
                    stroke="#9ca3af"
                    tickLine={false}
                    axisLine={{ stroke: '#4b5563' }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="entity"
                    stroke="#9ca3af"
                    tickLine={false}
                    axisLine={{ stroke: '#4b5563' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1f2937',
                      borderRadius: 8,
                      color: '#e5e7eb',
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, height: 300 }}>
            <Typography sx={{ fontWeight: 900 }}>
              IOC types
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Distribution of tracked indicators by type.
            </Typography>
            <Box sx={{ mt: 2, height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={iocTypeDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {iocTypeDistribution.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={IOC_COLORS[index % IOC_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1f2937',
                      borderRadius: 8,
                      color: '#e5e7eb',
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, height: 300 }}>
            <Typography sx={{ fontWeight: 900 }}>
              Tracked actors
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Simple count of actor profiles by sophistication.
            </Typography>
            <Box sx={{ mt: 2, fontSize: 14 }}>
              {threatActors.map((t) => (
                <Typography key={t.id} sx={{ mb: 0.5 }}>
                  <strong>{t.name}</strong> — {t.region} • {t.sophistication}
                </Typography>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

