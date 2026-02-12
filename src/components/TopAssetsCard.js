import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { alerts } from '../data/mockSocData';

function buildAssetData() {
  const counts = new Map();
  alerts.forEach((a) => {
    counts.set(a.entity, (counts.get(a.entity) || 0) + 1);
  });

  const data = Array.from(counts.entries()).map(([entity, count]) => ({
    entity,
    count,
  }));

  // Sort descending, take top 5
  data.sort((a, b) => b.count - a.count);
  return data.slice(0, 5);
}

export default function TopAssetsCard() {
  const data = React.useMemo(() => buildAssetData(), []);

  return (
    <Paper variant="outlined" sx={{ p: 2, height: 320 }}>
      <Typography sx={{ fontWeight: 900 }}>Top affected assets</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Assets with the highest alert volume (mock data).
      </Typography>

      {data.length === 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No asset data yet. This chart will show your most targeted systems.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 2, height: 230 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ left: 80, right: 24, top: 8, bottom: 8 }}
            >
              <XAxis
                type="number"
                stroke="#94a3b8"
                tickLine={false}
                axisLine={{ stroke: '#475569' }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="entity"
                stroke="#94a3b8"
                tickLine={false}
                axisLine={{ stroke: '#475569' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(148,163,184,0.35)',
                  borderRadius: 8,
                  color: '#e2e8f0',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 6, 6]} fill="#22c55e">
                <LabelList
                  dataKey="count"
                  position="right"
                  style={{ fill: '#e2e8f0', fontSize: 12 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}

