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
  const totalIOCs = iocs.length;

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 3, // Standard 24px padding
        height: 380, // Consistent height
        display: 'flex',
        flexDirection: 'column'
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
          <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
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
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
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
