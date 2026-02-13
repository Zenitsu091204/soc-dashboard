import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatUtc } from '../data/mockSocData';
import showToast from '../utils/toast';

function buildAlertsOverTime(alerts) {
  const counts = new Map();

  alerts.forEach((a) => {
    const d = new Date(a.time);
    const key = d.toISOString().slice(0, 13); // group by hour (YYYY-MM-DDTHH)
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return Array.from(counts.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, count]) => {
      const label = formatUtc(key + ':00:00Z');
      return { key, label, count, date: label };
    });
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'rgba(15, 23, 42, 0.98)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: 2,
          p: 2,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1 }}>
          {label}
        </Typography>
        <Typography variant="h6" sx={{ color: '#6366F1', fontWeight: 700 }}>
          {payload[0].value} alerts
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5 }}>
          Click to filter by this time
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function AlertsTrendCard({ alerts, onTimeRangeClick }) {
  const data = React.useMemo(() => buildAlertsOverTime(alerts), [alerts]);

  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3).reduce((sum, d) => sum + d.count, 0);
    const previous = data.slice(-6, -3).reduce((sum, d) => sum + d.count, 0);
    if (previous === 0) return 0;
    return Math.round(((recent - previous) / previous) * 100);
  };

  const trend = calculateTrend();

  // Handle chart click
  const handleChartClick = (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const clickedData = data.activePayload[0].payload;
      showToast.info(
        'Time range selected',
        `Showing ${clickedData.count} alerts from ${clickedData.label}`
      );
      if (onTimeRangeClick) {
        onTimeRangeClick(clickedData);
      }
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        height: 450, 
        borderRadius: 1,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <div>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Alerts Trend</Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time volume analysis • Click to filter
          </Typography>
        </div>
        {/* Trend Indicator */}
        <Box
          sx={{
            px: 2,
            py: 1,
            bgcolor: trend > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: 2,
            border: `1px solid ${trend > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: trend > 0 ? '#EF4444' : '#22C55E',
            }}
          >
            {trend > 0 ? '+' : ''}{trend}%
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            7-day trend
          </Typography>
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={360}>
        <AreaChart 
          data={data}
          onClick={handleChartClick}
          style={{ cursor: 'pointer' }}
        >
          <defs>
            <linearGradient id="alertsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tickLine={false}
            axisLine={{ stroke: '#475569' }}
            style={{ fontSize: 12 }}
          />
          <YAxis
            stroke="#94a3b8"
            tickLine={false}
            axisLine={{ stroke: '#475569' }}
            style={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366F1', strokeWidth: 2 }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#6366F1"
            strokeWidth={3}
            fill="url(#alertsGradient)"
            dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#1E293B' }}
            activeDot={{ 
              r: 8, 
              fill: '#818CF8', 
              strokeWidth: 3, 
              stroke: '#1E293B',
              style: { cursor: 'pointer' }
            }}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}
