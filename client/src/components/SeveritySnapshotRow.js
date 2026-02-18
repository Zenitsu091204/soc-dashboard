import * as React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const severityConfig = {
  critical: {
    label: 'Critical',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  high: {
    label: 'High',
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  medium: {
    label: 'Medium',
    color: '#EAB308',
    bgColor: 'rgba(234, 179, 8, 0.1)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  low: {
    label: 'Low',
    color: '#22C55E',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
};

export default function SeveritySnapshotRow({ criticalCount, highCount, mediumCount, lowCount }) {
  const severityData = [
    { key: 'critical', count: criticalCount, trend: 12 },
    { key: 'high', count: highCount, trend: -5 },
    { key: 'medium', count: mediumCount, trend: 8 },
    { key: 'low', count: lowCount, trend: -3 },
  ];

  return (
    <Grid container spacing={3}>
      {severityData.map(({ key, count, trend }) => {
        const config = severityConfig[key];
        const isPositive = trend > 0;

        return (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Paper
              sx={{
                p: 2.5,
                background: `linear-gradient(135deg, ${config.bgColor} 0%, rgba(0,0,0,0.1) 100%)`,
                border: `1px solid ${config.borderColor}`,
                borderRadius: 1,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${config.bgColor}`,
                  borderColor: config.color,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: config.color,
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                }}
              >
                {config.label}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1, mb: 0.5 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    color: config.color,
                    lineHeight: 1,
                  }}
                >
                  {count}
                </Typography>
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  alerts
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {isPositive ? (
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'error.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, color: 'success.main' }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: isPositive ? 'error.main' : 'success.main',
                  }}
                >
                  {isPositive ? '+' : ''}{trend}%
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
                  vs 7d
                </Typography>
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
