import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const STATUS_ORDER = ['open', 'in-progress', 'resolved', 'false-positive'];
const LABELS = {
  open: 'Open',
  'in-progress': 'In progress',
  resolved: 'Resolved',
  'false-positive': 'False positive',
};

function buildStatusData(alerts) {
  const counts = STATUS_ORDER.reduce(
    (acc, key) => ({ ...acc, [key]: 0 }),
    {},
  );

  alerts.forEach((a) => {
    if (a.status && counts[a.status] !== undefined) {
      counts[a.status] += 1;
    }
  });

  return STATUS_ORDER.map((key) => ({
    key,
    name: LABELS[key],
    value: counts[key],
  }));
}

export default function AlertStatusCard({ alerts }) {
  const data = React.useMemo(() => buildStatusData(alerts), [alerts]);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
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
      }}
    >
      <Typography sx={{ fontWeight: 900 }}>Alert status</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Workflow distribution (open, in progress, resolved, false positive).
      </Typography>

      <Box sx={{ mt: 2, flex: 1, minHeight: 150 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={{ stroke: '#475569' }}
            />
            <YAxis
              allowDecimals={false}
              stroke="#94a3b8"
              tickLine={false}
              axisLine={{ stroke: '#475569' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(148,163,184,0.35)',
                borderRadius: 8,
                color: '#e2e8f0',
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
