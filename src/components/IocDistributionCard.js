import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const COLORS = ['#6366F1', '#22D3EE', '#F97316', '#A855F7'];

function buildIocTypeData(iocs) {
  const counts = new Map();
  iocs.forEach((ioc) => {
    counts.set(ioc.type, (counts.get(ioc.type) || 0) + 1);
  });

  return Array.from(counts.entries()).map(([type, value]) => ({
    name: type,
    value,
  }));
}

export default function IocDistributionCard({ iocs = [] }) {
  const data = React.useMemo(() => buildIocTypeData(iocs), [iocs]);
  const totalIOCs = iocs.length;


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
        <Typography sx={{ fontWeight: 900, fontSize: '1.1rem' }}>IOC distribution</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Distribution of indicators by type.
        </Typography>
      </Box>

      {data.length === 0 ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No IOC data available.
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ flex: 1, minHeight: 150, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  stroke="none"
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
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: -0.5 }}>
                TOTAL
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>
                {totalIOCs}
              </Typography>
            </Box>
          </Box>

          {/* Legend */}
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {data.map((entry, index) => (
              <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: COLORS[index % COLORS.length],
                    boxShadow: `0 0 8px ${COLORS[index % COLORS.length]}`,
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {entry.name} <Box component="span" sx={{ color: 'text.primary', fontWeight: 700, ml: 0.5 }}>{entry.value}</Box>
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
}
