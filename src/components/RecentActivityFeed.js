import * as React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { getRelativeTime } from '../data/mockSocData';

const severityColors = {
  critical: { bg: 'rgba(239, 68, 68, 0.1)', border: '#EF4444', text: '#EF4444' },
  high: { bg: 'rgba(249, 115, 22, 0.1)', border: '#F97316', text: '#F97316' },
  medium: { bg: 'rgba(234, 179, 8, 0.1)', border: '#EAB308', text: '#EAB308' },
  low: { bg: 'rgba(34, 197, 94, 0.1)', border: '#22C55E', text: '#22C55E' },
};

export default function RecentActivityFeed({ alerts, maxItems = 8 }) {
  const recentAlerts = alerts.slice(0, maxItems);

  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
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
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
        Recent Activity
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Live alert feed
      </Typography>

      <Box
        sx={{
          maxHeight: 400,
          overflowY: 'auto',
          pr: 1,
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#334155',
            borderRadius: 3,
          },
        }}
      >
        {recentAlerts.map((alert, index) => {
          const colors = severityColors[alert.severity];
          return (
            <Box
              key={alert.id}
              sx={{
                p: 2,
                mb: 1.5,
                borderRadius: 1,
                bgcolor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.2s ease',
                animation: `slideInRight 0.4s ease ${index * 0.05}s both`,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: colors.border,
                  transform: 'translateX(4px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                <Chip
                  label={alert.severity.toUpperCase()}
                  size="small"
                  sx={{
                    bgcolor: colors.bg,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    height: 20,
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {getRelativeTime(alert.time)}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 0.5,
                }}
              >
                {alert.title}
              </Typography>

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {alert.entity}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
