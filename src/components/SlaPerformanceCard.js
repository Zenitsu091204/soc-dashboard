import * as React from 'react';
import { Box, Paper, Typography, CircularProgress, Chip } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

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
    borderColor: 'rgba(34, 197, 94, 0.3)', // Green glow
    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.15)',
  },
};

const MetricItem = ({ label, value, subValue, highlight = false }) => (
  <Box sx={{ flex: 1, p: 1.5, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
    <Typography variant="h5" sx={{ fontWeight: 800, color: highlight ? '#F43F5E' : '#fff' }}>
      {value}
    </Typography>
    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
      {label}
    </Typography>
  </Box>
);

export default function SlaPerformanceCard({ metrics }) {
  if (!metrics) return null;

  return (
    <Paper variant="outlined" sx={cardStyle}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SpeedIcon sx={{ color: '#22C55E' }} /> {/* Green Accent */}
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.rem', color: '#fff' }}>
            Response Time & SLA
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', marginTop: 0.5 }}>
            Operational efficiency in incident handling
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Main Rings Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
             <CircularProgress 
              variant="determinate" 
              value={100} 
              size={70} 
              thickness={4}
              sx={{ color: 'rgba(255,255,255,0.1)' }} 
            />
            <CircularProgress 
              variant="determinate" 
              value={metrics.slaCompliance} 
              size={70} 
              thickness={4}
              sx={{ 
                color: metrics.slaCompliance > 90 ? '#22C55E' : '#EAB308',
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
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6rem' }}>SLA</Typography>
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1 }}>
                {metrics.slaCompliance}%
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>Efficiency Trend</Typography>
             <Chip 
              icon={metrics.trendType === 'negative' ? <TrendingDownIcon /> : <TrendingUpIcon />}
              label={metrics.trend}
              size="small"
              sx={{ 
                bgcolor: metrics.trendType === 'negative' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                color: metrics.trendType === 'negative' ? '#F43F5E' : '#22C55E',
                fontWeight: 600,
                '& .MuiChip-icon': {
                   color: 'inherit'
                }
              }}
            />
          </Box>
        </Box>

        {/* Metrics Grid */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <MetricItem label="Avg Response" value={metrics.avgResponseTime} />
          <MetricItem label="Avg Resolution" value={metrics.avgResolutionTime} />
          <MetricItem label="Breaches" value={metrics.slaBreaches} highlight={metrics.slaBreaches > 0} />
        </Box>
      </Box>
    </Paper>
  );
}
