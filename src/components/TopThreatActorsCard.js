import * as React from 'react';
import { Box, Chip, Paper, Typography } from '@mui/material';

const riskColors = {
  Critical: { bg: 'rgba(239, 68, 68, 0.15)', border: '#EF4444', text: '#EF4444' },
  High: { bg: 'rgba(249, 115, 22, 0.15)', border: '#F97316', text: '#F97316' },
  Medium: { bg: 'rgba(234, 179, 8, 0.15)', border: '#EAB308', text: '#EAB308' },
  Low: { bg: 'rgba(34, 197, 94, 0.15)', border: '#22C55E', text: '#22C55E' },
};

export default function TopThreatActorsCard({ threatActors = [] }) {
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
      <Typography sx={{ fontWeight: 900 }}>Top threat actors</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
        Active threat groups ranked by risk
      </Typography>

      {threatActors.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No actor intelligence loaded yet. Connect your TI platform to see profiles here.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {threatActors.map((actor) => {
            const colors = riskColors[actor.riskLevel];
            return (
              <Box
                key={actor.id}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: colors.border,
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {actor.name}
                  </Typography>
                  <Chip
                    label={actor.riskLevel}
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
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    <strong>Sophistication:</strong> {actor.sophistication}
                  </Typography>
                </Box>

                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Last seen: <strong>{actor.lastSeen}</strong>
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
}
