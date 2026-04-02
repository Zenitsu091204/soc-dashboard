import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Chip } from '@mui/material';
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon';
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';
import ExclamationTriangleIcon from '@heroicons/react/24/solid/ExclamationTriangleIcon';
import api from '../services/api';

export default function SyncStatusWidget() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchStatus = async () => {
    try {
      const { data } = await api.get('/intel/sync/status');
      setStatus(data);
    } catch (err) {
      console.error('Failed to fetch sync status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    if (syncing) return;
    try {
      setSyncing(true);
      await api.post('/intel/sync');
      await fetchStatus();
    } catch (err) {
      console.error('Manual sync failed', err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading && !status) return <CircularProgress size={20} sx={{ color: 'indigo.500' }} />;

  const isSuccess = status?.status === 'success';
  const lastSyncDate = status?.timestamp ? new Date(status.timestamp).toLocaleString() : 'Never';

  return (
    <Box sx={{ 
      p: 2, 
      bgcolor: 'rgba(15, 23, 42, 0.4)', 
      backdropFilter: 'blur(8px)',
      borderRadius: '12px', 
      border: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 3
    }}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isSuccess ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
          {isSuccess ? <CheckCircleIcon className="w-5 h-5" /> : <ExclamationTriangleIcon className="w-5 h-5" />}
        </div>
        <div>
          <Typography variant="caption" sx={{ color: 'slate.500', fontWeight: 'bold', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            OpenCTI Sync Status
          </Typography>
          <div className="flex items-center gap-2">
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'medium' }}>
              {isSuccess ? 'Connected & Healthy' : status?.message || 'Sync Pending'}
            </Typography>
            <Chip 
              label={`${status?.iocCount || 0} IOCs`} 
              size="small" 
              sx={{ height: 16, fontSize: '9px', bgcolor: 'indigo.500/20', color: 'indigo.300', border: '1px solid rgba(99, 102, 241, 0.2)' }} 
            />
          </div>
          <Typography variant="caption" sx={{ color: 'slate.400', fontSize: '10px' }}>
            Last updated: {lastSyncDate}
          </Typography>
        </div>
      </div>

      <button 
        onClick={handleManualSync}
        disabled={syncing}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          syncing 
            ? 'bg-indigo-500/20 text-indigo-300 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
        }`}
      >
        <ArrowPathIcon className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
        {syncing ? 'Syncing...' : 'Sync Now'}
      </button>
    </Box>
  );
}
