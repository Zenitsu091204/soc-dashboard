import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { iocs } from '../data/mockSocData';

const COLORS = ['#6366F1', '#22D3EE', '#F97316', '#A855F7'];

function buildIocTypeData() {
  const counts = new Map();
  iocs.forEach((ioc) => {
    counts.set(ioc.type, (counts.get(ioc.type) || 0) + 1);
  });

  return Array.from(counts.entries()).map(([type, value]) => ({
    name: type,
    value,
  }));
}

export default function IocDistributionCard() {
  const data = React.useMemo(() => buildIocTypeData(), []);

  return (
    <Paper variant="outlined" sx={{ p: 2, height: 320 }}>
      <Typography sx={{ fontWeight: 900 }}>IOC distribution</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Distribution of indicators by type (IP, domain, hash, URL).
      </Typography>

      {data.length === 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No IOC data yet. Donut will fill once indicators are ingested.
          </Typography>
        </Box>
      ) : (
        <>
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
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(148,163,184,0.35)',
                    borderRadius: 8,
                    color: '#e2e8f0',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Total IOCs: <strong>{iocs.length}</strong>
          </Typography>
        </>
      )}
    </Paper>
  );
}

