import React from 'react';
import { Box, LinearProgress, Typography, Chip } from '@mui/material';
import { keyframes } from '@mui/system';

// Pulsing animation for critical risk levels
const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.4), 0 0 20px rgba(239, 68, 68, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3);
  }
`;

const getRiskLevel = (score) => {
  if (score >= 80) return { level: 'Critical', color: '#EF4444', icon: '🔴', bgColor: 'rgba(239, 68, 68, 0.1)' };
  if (score >= 60) return { level: 'High', color: '#F59E0B', icon: '🟠', bgColor: 'rgba(245, 158, 11, 0.1)' };
  if (score >= 40) return { level: 'Elevated', color: '#EAB308', icon: '🟡', bgColor: 'rgba(234, 179, 8, 0.1)' };
  return { level: 'Low', color: '#10B981', icon: '🟢', bgColor: 'rgba(16, 185, 129, 0.1)' };
};

const RiskPulseBar = ({ riskScore = 75, drawerWidth = 0 }) => {
  const risk = getRiskLevel(riskScore);
  const isCritical = riskScore >= 80;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 70, // Below navbar
        left: drawerWidth, 
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar - 1,
        backgroundColor: 'rgba(11, 17, 32, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: `2px solid ${risk.color}`,
        animation: isCritical ? `${pulse} 2s ease-in-out infinite` : 'none',
        transition: (theme) => theme.transitions.create(['left'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 1,
          maxWidth: '100%',
        }}
      >
        {/* Left side - Risk Level Indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              fontSize: 11,
            }}
          >
            Global Threat Level
          </Typography>
          <Chip
            icon={<span style={{ fontSize: 14 }}>{risk.icon}</span>}
            label={risk.level}
            size="small"
            sx={{
              backgroundColor: risk.bgColor,
              color: risk.color,
              fontWeight: 700,
              fontSize: 12,
              border: `1px solid ${risk.color}40`,
              '& .MuiChip-icon': {
                marginLeft: '8px',
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            Risk Score: {riskScore}%
          </Typography>
        </Box>

        {/* Right side - Progress Bar */}
        <Box sx={{ flex: 1, maxWidth: 400, ml: 4 }}>
          <LinearProgress
            variant="determinate"
            value={riskScore}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: `linear-gradient(90deg, ${risk.color} 0%, ${risk.color}dd 100%)`,
                boxShadow: `0 0 10px ${risk.color}40`,
                transition: 'all 0.5s ease',
              },
            }}
          />
        </Box>

        {/* Far right - Status indicators */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5, ml: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 10 }}>
              Systems Online
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isCritical ? '#EF4444' : '#3B82F6',
                boxShadow: isCritical
                  ? '0 0 8px rgba(239, 68, 68, 0.5)'
                  : '0 0 8px rgba(59, 130, 246, 0.5)',
                animation: isCritical ? `${pulse} 1.5s ease-in-out infinite` : 'none',
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 10 }}>
              {isCritical ? 'Alert Active' : 'Monitoring'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RiskPulseBar;
