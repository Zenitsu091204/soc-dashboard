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

function buildAssetData(alerts) {
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

export default function TopAssetsCard({ alerts = [] }) {
  const data = React.useMemo(() => buildAssetData(alerts), [alerts]);


  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
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
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 900, fontSize: '1.1rem' }}>Top affected assets</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Assets with the highest alert volume.
        </Typography>
      </Box>

      {data.length === 0 ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No asset data available.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, minHeight: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ left: 20, right: 30, top: 8, bottom: 16 }}
            >
              <XAxis
                type="number"
                stroke="#94a3b8"
                tickLine={false}
                axisLine={{ stroke: '#475569' }}
                allowDecimals={false}
                hide // Hide X axis for cleaner look since we have labels
              />
              <YAxis
                type="category"
                dataKey="entity"
                stroke="#f1f5f9"
                tickLine={false}
                axisLine={false}
                width={140} // Sufficient width for text
                style={{ fontSize: 13, fontWeight: 600 }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.98)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(99, 102, 241, 0.5)',
                  borderRadius: 8,
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 600,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                }}
              />
              <Bar 
                dataKey="count" 
                radius={[0, 4, 4, 0]} 
                barSize={24}
                fill="#22c55e"
              >
                <LabelList
                  dataKey="count"
                  position="right"
                  style={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 700 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}
