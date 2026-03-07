import React from 'react';
import { Box, Typography } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';

export default function GeographicThreatMap() {
  const mockThreats = [
    { id: 1, top: '30%', left: '20%', severity: 'critical' },
    { id: 2, top: '45%', left: '50%', severity: 'high' },
    { id: 3, top: '25%', left: '70%', severity: 'medium' },
    { id: 4, top: '60%', left: '80%', severity: 'critical' },
    { id: 5, top: '40%', left: '30%', severity: 'low' },
  ];

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
        <PublicIcon sx={{ color: '#6366F1', fontSize: 20 }} /> Global Threat Origins
      </Typography>
      
      <Box sx={{ flex: 1, position: 'relative', borderRadius: 2, overflow: 'hidden', bgcolor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Placeholder Map Background Grid */}
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '15% 15%' }} />
        
        {/* Threat Dots */}
        {mockThreats.map(threat => (
          <Box
            key={threat.id}
            sx={{
              position: 'absolute',
              top: threat.top,
              left: threat.left,
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: threat.severity === 'critical' ? '#ef4444' : threat.severity === 'high' ? '#f59e0b' : '#3b82f6',
              boxShadow: `0 0 10px ${threat.severity === 'critical' ? '#ef4444' : threat.severity === 'high' ? '#f59e0b' : '#3b82f6'}`,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(0.8)', opacity: 0.8 },
                '50%': { transform: 'scale(1.2)', opacity: 1 },
                '100%': { transform: 'scale(0.8)', opacity: 0.8 }
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
