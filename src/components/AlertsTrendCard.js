import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Line,
  LineChart,
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
    <Paper variant="outlined" sx={{ p: 2, height: 260 }}>
      <Typography sx={{ fontWeight: 900 }}>Alerts trend</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Simple timeline of alert volume (mock data).
      </Typography>

      <Box sx={{ mt: 2, height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

