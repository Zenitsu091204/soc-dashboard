import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Switch,
  Alert,
  Snackbar,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const RuleManagementPage = () => {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const isAnalyst = currentUser?.role === 'analyst' || isAdmin;

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const fetchRules = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/rules');
      setRules(data);
    } catch (err) {
      showNotification('Failed to fetch rules', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const { data } = await api.post('/intel/sync');
      showNotification(`Sync complete: ${data.results.indicators} IOCs, ${data.results.campaigns} campaigns`, 'success');
      fetchRules();
    } catch (err) {
      showNotification('Sync failed', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleDeploy = async () => {
    try {
      setDeploying(true);
      await api.post('/rules/deploy');
      showNotification('Firewall configuration reloaded successfully', 'success');
    } catch (err) {
      showNotification('Deployment failed', 'error');
    } finally {
      setDeploying(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/rules/${id}/status`, { status: newStatus });
      showNotification(`Rule ${newStatus} successfully`, 'success');
      setRules(rules.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      showNotification('Failed to update rule status', 'error');
    }
  };

  if (loading && rules.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
            Rule Management
          </Typography>
          <Typography variant="body2" sx={{ color: 'slate.400' }}>
            Approve and manage NAXSI firewall rules generated from threat intelligence.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CloudSyncIcon />}
            onClick={handleSync}
            disabled={syncing || !isAnalyst}
            sx={{ borderColor: 'rgba(255,255,255,0.1)', color: 'slate.300', '&:hover': { borderColor: 'indigo.500' } }}
          >
            {syncing ? 'Syncing...' : 'Sync OpenCTI'}
          </Button>
          <Tooltip title={!isAdmin ? "Only Admins can deploy to firewall" : ""}>
            <span>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrowIcon />}
                onClick={handleDeploy}
                disabled={deploying || !isAdmin}
                sx={{ fontWeight: 'bold' }}
              >
                {deploying ? 'Deploying...' : 'Deploy to Firewall'}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', border: '1px border-white/5', borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'slate.400', fontWeight: 'bold' }}>Indicator</TableCell>
              <TableCell sx={{ color: 'slate.400', fontWeight: 'bold' }}>Rule Content</TableCell>
              <TableCell sx={{ color: 'slate.400', fontWeight: 'bold' }}>Source</TableCell>
              <TableCell sx={{ color: 'slate.400', fontWeight: 'bold' }}>Verification</TableCell>
              <TableCell sx={{ color: 'slate.400', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'slate.400', fontWeight: 'bold', textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'medium' }}>
                      {rule.indicator?.value || 'Manual Rule'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'slate.500', textTransform: 'uppercase' }}>
                      {rule.indicator?.type || 'Generic'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-black/30 p-2 rounded block text-indigo-300 border border-white/5 truncate max-w-sm">
                    {rule.content}
                  </code>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={rule.source} 
                    size="small" 
                    sx={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'indigo.400', border: '1px border-indigo-500/20' }} 
                  />
                </TableCell>
                <TableCell>
                  {rule.verificationStatus === 'success' ? (
                    <Tooltip title={`Last verified: ${new Date(rule.lastVerified).toLocaleString()}`}>
                      <Chip icon={<VerifiedUserIcon sx={{ fontSize: '16px !important' }} />} label="VERIFIED" size="small" color="success" variant="outlined" />
                    </Tooltip>
                  ) : rule.status === 'active' ? (
                    <Tooltip title="Rule may not be active in firewall config">
                      <Chip icon={<WarningAmberIcon sx={{ fontSize: '16px !important' }} />} label="UNVERIFIED" size="small" color="warning" variant="outlined" />
                    </Tooltip>
                  ) : (
                    <Typography variant="caption" sx={{ color: 'slate.600' }}>N/A</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={rule.status.toUpperCase()}
                    size="small"
                    color={rule.status === 'active' ? 'success' : rule.status === 'pending' ? 'warning' : 'default'}
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {rule.status === 'pending' && (
                      <>
                        <Tooltip title="Approve & Enable">
                          <IconButton color="success" size="small" onClick={() => updateStatus(rule.id, 'active')}>
                            <CheckCircleOutlineIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton color="error" size="small" onClick={() => updateStatus(rule.id, 'rejected')}>
                            <HighlightOffIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {rule.status === 'active' && (
                      <Tooltip title="Disable Rule">
                        <Switch 
                          checked={true} 
                          size="small" 
                          onChange={() => updateStatus(rule.id, 'disabled')}
                        />
                      </Tooltip>
                    )}
                    {rule.status === 'disabled' && (
                      <Tooltip title="Enable Rule">
                        <Switch 
                          checked={false} 
                          size="small" 
                          onChange={() => updateStatus(rule.id, 'active')}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {rules.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8, color: 'slate.500' }}>
                  No rules found. Sync with OpenCTI to generate rules from threat intelligence.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RuleManagementPage;
