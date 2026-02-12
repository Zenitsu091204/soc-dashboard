import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export default function StatCard({ label, value, helper, icon: Icon, trend, severity }) {
  // Dynamic color based on severity or value
  const getValueColor = () => {
    if (severity === 'critical') return '#EF4444';
    if (severity === 'high') return '#F97316';
    if (severity === 'medium') return '#EAB308';
    if (severity === 'low') return '#22C55E';
    if (value > 0 && label.toLowerCase().includes('alert')) return '#F97316';
    return 'text.primary';
  };

  return (
    <Paper
      className="animate-fade-in"
      sx={{
        p: 3,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1,
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(30, 41, 59, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.9)',
          borderColor: 'primary.main',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #6366F1, #06B6D4)',
        },
      }}
    >
      {/* Icon in top right */}
      {Icon && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            opacity: 0.2,
          }}
        >
          <Icon sx={{ fontSize: 32 }} />
        </Box>
      )}

      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          letterSpacing: 1,
          color: 'text.secondary',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>

      <Typography
        className="stat-value"
        variant="h3"
        sx={{
          mt: 1,
          fontWeight: 900,
          color: getValueColor(),
          lineHeight: 1,
        }}
      >
        {value.toLocaleString()}
      </Typography>

      {/* Trend indicator */}
      {trend !== undefined && (
        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: trend > 0 ? 'error.main' : 'success.main',
            }}
          >
            {trend > 0 ? '+' : ''}{trend}%
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            vs last 7 days
          </Typography>
        </Box>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {helper}
      </Typography>
    </Paper>
  );
}
