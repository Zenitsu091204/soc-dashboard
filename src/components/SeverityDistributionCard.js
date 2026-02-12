import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const COLORS = {
  critical: '#ef4444', // red
  high: '#f97316', // orange
  medium: '#38bdf8', // blue
  low: '#9ca3af', // gray
};

function buildSeverityData(alerts) {
  const counts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  alerts.forEach((a) => {
    const key = a.severity;
    if (counts[key] !== undefined) {
      counts[key] += 1;
    }
  });

  return [
    { name: 'Critical', key: 'critical', value: counts.critical },
    { name: 'High', key: 'high', value: counts.high },
    { name: 'Medium', key: 'medium', value: counts.medium },
    { name: 'Low', key: 'low', value: counts.low },
  ];
}

export default function SeverityDistributionCard({ alerts }) {
  const data = React.useMemo(() => buildSeverityData(alerts), [alerts]);

  return (
    <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
      <Typography sx={{ fontWeight: 900 }}>Severity Distribution</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Counts of alerts by severity (mock data).
      </Typography>

      <Box sx={{ mt: 2, height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={COLORS[entry.key]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#121212',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                color: '#f5f5f5',
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

