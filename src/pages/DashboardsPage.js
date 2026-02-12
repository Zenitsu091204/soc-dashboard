import * as React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader.js';
import StatCard from '../components/StatCard.js';
import {
  alerts,
  iocs,
  threatActors,
  formatUtc,
} from '../data/mockSocData.js';
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

  const data = Array.from(counts.entries()).map(([entity, count]) => ({
    entity,
    count,
  }));

  // Sort descending and keep top 5 for readability
  data.sort((a, b) => b.count - a.count);
  return data.slice(0, 5);
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

  const totalAlerts = alerts.length;
  const uniqueAssets = React.useMemo(
    () => new Set(alerts.map((a) => a.entity)).size,
    []
  );
  const totalActors = threatActors.length;
  const totalIocs = iocs.length;

  return (
    <Box className="animate-fade-in">
      <PageHeader
        title="Security Operations Center"
        subtitle="Real-time monitoring and threat intelligence overview."
      />

      {/* KPI row for this dashboards page */}
      <Grid container spacing={3} sx={{ mt: 1, mb: 4 }}>
        <Grid item xs={12} sm={6} md={3} sx={{ animationDelay: '0.1s' }} className="animate-slide-in">
          <StatCard
            label="Total alerts"
            value={totalAlerts}
            helper="All time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ animationDelay: '0.2s' }} className="animate-slide-in">
          <StatCard
            label="Unique assets"
            value={uniqueAssets}
            helper="Active entities"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ animationDelay: '0.3s' }} className="animate-slide-in">
          <StatCard
            label="Threat actors"
            value={totalActors}
            helper="Tracked profiles"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ animationDelay: '0.4s' }} className="animate-slide-in">
          <StatCard
            label="Active IOCs"
            value={totalIocs}
            helper="Intelligence feed"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              height: 400,
              borderRadius: 1,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
               <div>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Alert Activity</Typography>
                  <Typography variant="body2" color="text.secondary">7-day volume per entity</Typography>
               </div>
               <Box sx={{ px: 2, py: 0.5, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: 1, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                   <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>LIVE</Typography>
               </Box>
            </Box>

            {alertsOverTime.length === 0 ? (
               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                 <Typography color="text.secondary">No data available</Typography>
               </Box>
            ) : (
              <Box sx={{ height: 300, ml: -2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={alertsOverTime}>
                    <XAxis
                      dataKey="label"
                      stroke="#475569"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      allowDecimals={false}
                      stroke="#475569"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        color: '#f5f5f5',
                        fontSize: 13,
                      }}
                      cursor={{ stroke: 'rgba(99, 102, 241, 0.2)', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ r: 4, stroke: '#0B1120', strokeWidth: 2, fill: '#10B981' }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#34D399' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400, borderRadius: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Top Assets</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              By alert volume
            </Typography>

            {alertsByEntity.length === 0 ? (
               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                 <Typography color="text.secondary">No data available</Typography>
               </Box>
            ) : (
              <Box sx={{ height: 300, mx: -2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={alertsByEntity}
                    layout="vertical"
                    margin={{ left: 20, right: 20, top: 0, bottom: 0 }}
                    barSize={20}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="entity"
                      stroke="#94A3B8"
                      width={100}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94A3B8', fontSize: 13, fontWeight: 500 }}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        color: '#f5f5f5',
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#38bdf8"
                      radius={[0, 4, 4, 0]}
                    >
                      {alertsByEntity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#F472B6' : '#22D3EE'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 380, borderRadius: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>IOC Types</Typography>
            <Typography variant="body2" color="text.secondary">
              Distribution by category
            </Typography>
            <Box sx={{ mt: 2, height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={iocTypeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    cornerRadius={6}
                    stroke="none"
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
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        color: '#f5f5f5',
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 380, borderRadius: 1, overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Threat Actors</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Recently active groups
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {threatActors.map((t, i) => (
                <Box
                  key={t.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.06)',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                      {t.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      {t.region}
                    </Typography>
                  </Box>
                  <Box sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 4,
                    bgcolor: t.sophistication === 'Advanced' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                    color: t.sophistication === 'Advanced' ? '#F97316' : '#818CF8',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {t.sophistication}
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

