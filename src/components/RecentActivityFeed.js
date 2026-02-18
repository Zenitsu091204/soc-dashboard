import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { getRelativeTime } from '../data/mockSocData';

const severityColors = {
  critical: { bg: 'rgba(239, 68, 68, 0.1)', border: '#EF4444', text: '#EF4444' },
  high: { bg: 'rgba(249, 115, 22, 0.1)', border: '#F97316', text: '#F97316' },
  medium: { bg: 'rgba(234, 179, 8, 0.1)', border: '#EAB308', text: '#EAB308' },
  low: { bg: 'rgba(34, 197, 94, 0.1)', border: '#22C55E', text: '#22C55E' },
};

export default function RecentActivityFeed({ alerts, maxItems = 8 }) {
  // Show all alerts, scrollable container handles the overflow
  const recentAlerts = alerts;

  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255,255,255,0.05)',
        background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.7))',
        borderRadius: '24px', // 2xl rounded corners
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        '&:hover': { 
          borderColor: 'rgba(99, 102, 241, 0.4)', // Soft neon blue/purple glow
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
        },
      }}
    >
      <Box sx={{ flexShrink: 0, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px', color: '#fff' }}>
          Recent Activity
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          Live security alert feed
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          pr: 1.5,
          mr: -0.5,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.1)', // Subtle gray thumb
            borderRadius: '3px',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            },
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
                borderRadius: '12px',
                bgcolor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)', // Slightly brighter on hover
                  transform: 'translateY(-2px)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: colors.border,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                 <Typography variant="caption" sx={{ 
                    color: colors.text, 
                    fontWeight: 800, 
                    fontSize: '0.7rem', 
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                 }}>
                   <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: colors.text }} />
                   {alert.severity}
                 </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>
                  {getRelativeTime(alert.time)}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: '#fff', // Bold white text
                  mb: 0.5,
                  fontSize: '0.95rem',
                  lineHeight: 1.3
                }}
              >
                {alert.title}
              </Typography>

              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                 {alert.entity}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
