import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Area,
  AreaChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatUtc } from '../data/mockSocData';

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
      return { key, label, count };
    });
}

export default function AlertsTrendCard({ alerts }) {
  const data = React.useMemo(() => buildAlertsOverTime(alerts), [alerts]);

  return (
    <Paper variant="outlined" sx={{ p: 2, height: 420 }}>
      <Typography sx={{ fontWeight: 900 }}>Alerts trend</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Simple timeline of alert volume (mock data).
      </Typography>

      <Box sx={{ mt: 2, height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="alertsArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              stroke="#9e9e9e"
              tickLine={false}
              axisLine={{ stroke: '#424242' }}
              minTickGap={16}
            />
            <YAxis
              allowDecimals={false}
              stroke="#9e9e9e"
              tickLine={false}
              axisLine={{ stroke: '#424242' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#121212',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                color: '#f5f5f5',
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#22D3EE"
              strokeWidth={0}
              fill="url(#alertsArea)"
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#22D3EE"
              strokeWidth={3}
              dot={{ r: 4, stroke: '#22D3EE', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

