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
  const recentAlerts = alerts.slice(0, maxItems);

  return (
    <Paper
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
      <Box sx={{ flexShrink: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px' }}>
          Recent Activity
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
          Live security alert feed
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          pr: 1.5,
          mr: -0.5, // compensative margin for padding
          '&::-webkit-scrollbar': {
            width: '4px', // Thinner scrollbar
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(99, 102, 241, 0.3)',
            borderRadius: '10px',
            transition: 'background 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.6)',
            }
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
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.03)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `slideInRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s both`,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.06)',
                  borderColor: colors.border,
                  transform: 'translateX(4px) scale(1.01)',
                  boxShadow: `0 4px 12px ${colors.bg}`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '3px',
                  backgroundColor: colors.border,
                  opacity: 0.6,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                 <Typography variant="caption" sx={{ 
                    color: colors.text, 
                    fontWeight: 700, 
                    fontSize: '0.7rem', 
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                 }}>
                   <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: colors.text, display: 'inline-block' }}></span>
                   {alert.severity}
                 </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
                  {getRelativeTime(alert.time)}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 0.5,
                  fontSize: '0.9rem',
                  lineHeight: 1.4
                }}
              >
                {alert.title}
              </Typography>

              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                 <span>📍</span> {alert.entity}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
