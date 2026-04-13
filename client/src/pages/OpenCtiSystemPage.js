import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  CircularProgress, 
  Chip,
  Paper,
  Button,
  useTheme
} from '@mui/material';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import api from '../services/api';
import toast from 'react-hot-toast';

const OpenCtiSystemPage = () => {
  const [connectors, setConnectors] = useState([]);
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchData = async () => {
    try {
      const [connRes, statusRes] = await Promise.all([
        api.get('/intel/connectors'),
        api.get('/intel/sync/status')
      ]);
      setConnectors(connRes.data);
      setSyncStatus(statusRes.data);
    } catch (err) {
      console.error("Failed to fetch system status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    const id = toast.loading('Synchronizing with OpenCTI...');
    try {
      await api.post('/intel/sync');
      toast.success('Sync complete', { id });
      fetchData();
    } catch (err) {
      toast.error('Sync failed', { id });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
           <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
             OpenCTI API Engine
           </Typography>
           <Typography variant="body2" sx={{ color: 'slate.400' }}>
             Direct GraphQL API integration. Monitoring external source connectors and local sync state.
           </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<SyncRoundedIcon className={syncing ? 'animate-spin' : ''} />}
          onClick={handleSync}
          disabled={syncing}
          sx={{ 
            bgcolor: 'indigo.600', 
            '&:hover': { bgcolor: 'indigo.700' },
            borderRadius: '12px',
            textTransform: 'none',
            px: 3
          }}
        >
          {syncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Sync Card */}
        <Grid item xs={12} md={4}>
           <Paper sx={{ p: 3, bgcolor: '#0F172A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
             <Typography variant="subtitle2" sx={{ color: 'slate.400', mb: 2 }}>LAST SYNC STATE</Typography>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {syncStatus?.status === 'success' ? (
                  <CheckCircleRoundedIcon color="success" sx={{ fontSize: 32 }} />
                ) : (
                  <ErrorRoundedIcon color="error" sx={{ fontSize: 32 }} />
                )}
                <Box>
                  <Typography variant="h6" sx={{ color: 'white' }}>{syncStatus?.status?.toUpperCase() || 'UNKNOWN'}</Typography>
                  <Typography variant="caption" sx={{ color: 'slate.500' }}>
                    {syncStatus?.lastSync ? new Date(syncStatus.lastSync).toLocaleString() : 'Never'}
                  </Typography>
                </Box>
             </Box>
             <Typography variant="body2" sx={{ color: 'slate.300', p: 2, bgcolor: 'white/5', borderRadius: '8px' }}>
                {syncStatus?.message || 'No messages'}
             </Typography>
           </Paper>
        </Grid>

        {/* Connectors Grid */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {connectors.map(conn => (
              <Grid item xs={12} sm={6} key={conn.id}>
                 <Paper sx={{ p: 2, bgcolor: 'white/5', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HubRoundedIcon fontSize="small" sx={{ color: 'indigo.400' }} />
                        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{conn.name}</Typography>
                      </Box>
                      <Chip 
                        label={conn.status} 
                        size="small" 
                        color={conn.status === 'active' ? 'success' : 'default'}
                        sx={{ height: 20, fontSize: '0.65rem' }}
                      />
                   </Box>
                   <Typography variant="caption" sx={{ color: 'slate.500', display: 'block' }}>
                     Type: {conn.type}
                   </Typography>
                   <Typography variant="caption" sx={{ color: 'slate.500' }}>
                     Last heartbeat: {new Date(conn.lastSeen).toLocaleTimeString()}
                   </Typography>
                 </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OpenCtiSystemPage;
