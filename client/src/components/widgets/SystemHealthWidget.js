import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';

export default function SystemHealthWidget() {
  const [metrics, setMetrics] = useState({ cpu: 45, memory: 62, disk: 80 });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(100, Math.max(0, prev.memory + (Math.random() * 5 - 2.5))),
        disk: prev.disk // Static
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
        <StorageIcon sx={{ color: '#6366F1', fontSize: 20 }} /> System Health
      </Typography>
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <MemoryIcon sx={{ fontSize: 16 }} /> CPU Usage
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: metrics.cpu > 80 ? '#ef4444' : '#10b981' }}>
              {metrics.cpu.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={metrics.cpu} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: metrics.cpu > 80 ? '#ef4444' : '#10b981' } }} />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <CloudQueueIcon sx={{ fontSize: 16 }} /> Memory
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: metrics.memory > 80 ? '#ef4444' : '#3b82f6' }}>
              {metrics.memory.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={metrics.memory} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: metrics.memory > 80 ? '#ef4444' : '#3b82f6' } }} />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <StorageIcon sx={{ fontSize: 16 }} /> Disk Space
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f59e0b' }}>
              {metrics.disk.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={metrics.disk} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b' } }} />
        </Box>
      </Box>
    </Box>
  );
}
