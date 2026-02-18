import * as React from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import HubIcon from '@mui/icons-material/Hub';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

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
    borderColor: 'rgba(244, 63, 94, 0.3)', // Rose/Red glow
    boxShadow: '0 8px 32px rgba(244, 63, 94, 0.15)',
  },
};

const ConfidenceGauge = ({ value }) => (
  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
    <CircularProgress 
      variant="determinate" 
      value={100} 
      size={40} 
      sx={{ color: 'rgba(255,255,255,0.1)' }} 
    />
    <CircularProgress 
      variant="determinate" 
      value={value} 
      size={40} 
      sx={{ 
        color: value > 80 ? '#F43F5E' : '#F97316',
        position: 'absolute',
        left: 0,
      }} 
    />
    <Box
      sx={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="caption" component="div" sx={{ color: '#fff', fontSize: '0.65rem', fontWeight: 700 }}>
        {value}%
      </Typography>
    </Box>
  </Box>
);

export default function OpenCtiMatchesCard({ matches = [] }) {
  return (
    <Paper variant="outlined" sx={cardStyle}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <HubIcon sx={{ color: '#F43F5E' }} /> {/* Rose Accent */}
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>
            OpenCTI Correlation Matches
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', marginTop: 0.5 }}>
            Threat actor associations detected via OpenCTI
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {matches.map((match) => (
          <Box key={match.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ConfidenceGauge value={match.confidence} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                  {match.actor}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Matched: <Box component="span" sx={{ color: '#cbd5e1' }}>{match.type}</Box>
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'right' }}>
               <Typography 
                 variant="caption" 
                 sx={{ 
                   display: 'inline-flex', 
                   alignItems: 'center', 
                   gap: 0.5,
                   color: match.risk === 'Critical' ? '#F43F5E' : '#FED7AA',
                   fontWeight: 700,
                   bgcolor: match.risk === 'Critical' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(253, 186, 116, 0.1)',
                   px: 1,
                   py: 0.2,
                   borderRadius: 1
                 }}
               >
                 <VerifiedUserIcon sx={{ fontSize: 12 }} /> {match.risk} Risk
               </Typography>
            </Box>
          </Box>
        ))}
         {matches.length === 0 && (
           <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
             No OpenCTI correlations found.
           </Typography>
        )}
      </Box>
    </Paper>
  );
}
