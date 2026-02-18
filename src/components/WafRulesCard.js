import * as React from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

// Reusable card style for Glassmorphism
const cardStyle = {
  p: 3,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(255,255,255,0.05)',
  background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.7))',
  borderRadius: '16px',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(34, 211, 238, 0.3)', // Cyan glow
    boxShadow: '0 8px 32px rgba(34, 211, 238, 0.15)',
  },
};

export default function WafRulesCard({ rules = [] }) {
  return (
    <Paper variant="outlined" sx={cardStyle}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <WarningIcon sx={{ color: '#22D3EE' }} />
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>
            Top Triggered WAF Rules
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', marginTop: 0.5 }}>
            Most common blocked attack patterns in last 7 days
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {rules.map((rule) => (
          <Box key={rule.id}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
                {rule.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                {rule.id} • <Box component="span" sx={{ color: '#fff', fontWeight: 700 }}>{rule.count}</Box>
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={rule.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#22D3EE', // Cyan
                  borderRadius: 3,
                  boxShadow: '0 0 8px rgba(34, 211, 238, 0.5)',
                },
              }}
            />
          </Box>
        ))}
        {rules.length === 0 && (
           <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
             No WAF triggers detected.
           </Typography>
        )}
      </Box>
    </Paper>
  );
}
