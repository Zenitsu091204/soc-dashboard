import * as React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import PublicIcon from '@mui/icons-material/Public'; // Domain/URL
import RouterIcon from '@mui/icons-material/Router'; // IP
import TagIcon from '@mui/icons-material/Tag'; // Hash

// Reusable card style (same as WafRulesCard for consistency)
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
    borderColor: 'rgba(168, 85, 247, 0.3)', // Purple glow
    boxShadow: '0 8px 32px rgba(168, 85, 247, 0.15)',
  },
};

const getIcon = (type) => {
  switch (type) {
    case 'IP': return <RouterIcon sx={{ fontSize: 18, color: '#A855F7' }} />;
    case 'Domain':
    case 'URL': return <PublicIcon sx={{ fontSize: 18, color: '#3B82F6' }} />;
    case 'Hash': return <TagIcon sx={{ fontSize: 18, color: '#F97316' }} />;
    default: return <PublicIcon sx={{ fontSize: 18 }} />;
  }
};

const getSeverityColor = (severity) => {
  switch (severity.toLowerCase()) {
    case 'critical': return '#EF4444';
    case 'high': return '#F97316';
    case 'medium': return '#EAB308';
    case 'low': return '#22C55E';
    default: return '#94A3B8';
  }
};

export default function ThreatIntelFeedCard({ feed = [] }) {
  return (
    <Paper variant="outlined" sx={cardStyle}>
       <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <RssFeedIcon sx={{ color: '#A855F7' }} /> {/* Purple Accent */}
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>
            Threat Intelligence Feed (MISP)
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', marginTop: 0.5 }}>
            New IOCs synced automatically from MISP
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5, overflowY: 'auto' }}>
        {feed.map((item) => (
          <Box key={item.id} sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 1.5,
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                p: 0.8, 
                borderRadius: '8px', 
                bgcolor: 'rgba(255,255,255,0.05)', 
                display: 'flex' 
              }}>
                {getIcon(item.type)}
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#f1f5f9' }}>
                  {item.value}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  {item.type} • {item.time}
                </Typography>
              </Box>
            </Box>
            
            <Chip 
              label={item.severity} 
              size="small" 
              sx={{ 
                height: 24, 
                fontSize: '0.7rem',
                fontWeight: 700,
                color: getSeverityColor(item.severity),
                bgcolor: `${getSeverityColor(item.severity)}20`,
                border: `1px solid ${getSeverityColor(item.severity)}40`
              }} 
            />
          </Box>
        ))}
        {feed.length === 0 && (
           <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
             No recent threat intel updates.
           </Typography>
        )}
      </Box>
    </Paper>
  );
}
