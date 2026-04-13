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
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TerminalIcon from '@mui/icons-material/Terminal';
import InfoIcon from '@mui/icons-material/Info';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const RuleManagementPage = () => {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const isAnalyst = currentUser?.role === 'analyst' || isAdmin;

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [exportContent, setExportContent] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const fetchRules = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/rules');
      setRules(data);
      
      // Also fetch the formatted export content
      const exportRes = await api.get('/rules/export');
      setExportContent(exportRes.data);
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
      showNotification(`Sync complete: ${data.results.indicators} IOCs`, 'success');
      await fetchRules();
    } catch (err) {
      showNotification('Sync failed', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showNotification('Copied to clipboard', 'success');
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/rules/${id}/status`, { status: newStatus });
      showNotification(`Rule ${newStatus} successfully`, 'success');
      // Refresh both list and export console
      await fetchRules();
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1, letterSpacing: '-0.02em' }}>
            Firewall Rule Console
          </Typography>
          <Typography variant="body2" sx={{ color: 'slate.400', fontWeight: 'medium' }}>
            Generate and manage NAXSI rules derived from STIX intelligence.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<CloudSyncIcon />}
            onClick={handleSync}
            disabled={syncing || !isAnalyst}
            sx={{ 
              borderColor: 'rgba(255,255,255,0.1)', 
              color: 'slate.300', 
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { borderColor: 'indigo.500', backgroundColor: 'rgba(99, 102, 241, 0.05)' } 
            }}
          >
            {syncing ? 'Syncing...' : 'Fetch Intel & Sync'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ContentCopyIcon />}
            onClick={() => handleCopy(exportContent)}
            sx={{ 
              fontWeight: 'bold', 
              borderRadius: '12px',
              textTransform: 'none',
              px: 3,
              boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)'
            }}
          >
            Copy All Active Rules
          </Button>
        </Box>
      </Box>

      <Paper sx={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, v) => setActiveTab(v)}
          sx={{
            px: 2,
            pt: 1,
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
            '& .MuiTab-root': { color: 'slate.400', fontWeight: 600, textTransform: 'none', fontSize: '0.9rem' }
          }}
        >
          <Tab label="Review Queue" sx={{ py: 2 }} />
          <Tab label="Export Console" sx={{ py: 2 }} />
          <Tab label="Deployment Guide" sx={{ py: 2 }} />
        </Tabs>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

        {/* Tab 0: Rule Grid */}
        {activeTab === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(255,255,255,0.05)', py: 2.5 } }}>
                  <TableCell sx={{ color: 'slate.500', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', tracking: '0.1em' }}>Indicator</TableCell>
                  <TableCell sx={{ color: 'slate.500', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', tracking: '0.1em' }}>Rule Preview</TableCell>
                  <TableCell sx={{ color: 'slate.500', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', tracking: '0.1em' }}>Status</TableCell>
                  <TableCell sx={{ color: 'slate.500', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', tracking: '0.1em', textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id} hover sx={{ '&:last-child td': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255,255,255,0.01)' } }}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                          {rule.indicator?.value || 'Manual Rule'}
                        </Typography>
                        <Chip 
                          label={rule.indicator?.type || 'Generic'} 
                          size="small" 
                          sx={{ height: 18, fontSize: '0.65rem', fontWeight: 900, backgroundColor: 'rgba(255,255,255,0.05)', color: 'slate.400' }} 
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <code className="text-[11px] bg-slate-950/80 p-2 rounded-lg text-indigo-300 border border-white/5 font-mono max-w-sm truncate block">
                          {rule.content}
                        </code>
                        <Tooltip title="Copy Individual Rule">
                          <IconButton size="small" onClick={() => handleCopy(rule.content)} sx={{ color: 'slate.500', '&:hover': { color: 'indigo-400' } }}>
                            <ContentCopyIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={rule.status.toUpperCase()}
                        size="small"
                        sx={{ 
                          height: 20, 
                          fontSize: '0.7rem', 
                          fontWeight: 800,
                          backgroundColor: rule.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : rule.status === 'pending' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(255,255,255,0.05)',
                          color: rule.status === 'active' ? '#4ade80' : rule.status === 'pending' ? '#facc15' : 'slate.400',
                          border: `1px solid ${rule.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : rule.status === 'pending' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255,255,255,0.1)'}`
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {rule.status === 'pending' && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton color="success" size="small" onClick={() => updateStatus(rule.id, 'active')} sx={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}>
                                <CheckCircleOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <IconButton color="error" size="small" onClick={() => updateStatus(rule.id, 'rejected')} sx={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                                <HighlightOffIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                        {rule.status !== 'pending' && (
                           <Switch 
                            checked={rule.status === 'active'} 
                            size="small" 
                            onChange={() => updateStatus(rule.id, rule.status === 'active' ? 'disabled' : 'active')}
                          />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Tab 1: Export Console */}
        {activeTab === 1 && (
          <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'slate.300', display: 'flex', alignItems: 'center', gap: 1 }}>
                <TerminalIcon sx={{ fontSize: 18, color: 'indigo-400' }} />
                Production Rule Set (Ready for naxsi_rules.conf)
              </Typography>
              <Button size="small" startIcon={<ContentCopyIcon />} onClick={() => handleCopy(exportContent)} sx={{ color: 'indigo-400', textTransform: 'none', fontWeight: 700 }}>
                Copy Config
              </Button>
            </Box>
            <Box 
              component="pre" 
              sx={{ 
                p: 3, 
                backgroundColor: 'rgba(2, 6, 23, 0.8)', 
                borderRadius: 2, 
                border: '1px solid rgba(99, 102, 241, 0.2)',
                color: 'indigo.200',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                maxHeight: '400px',
                overflowY: 'auto',
                lineHeight: 1.6,
                '&::-webkit-scrollbar': { width: '8px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }
              }}
            >
              {exportContent || '# No active rules found. Approve generated rules to see them here.'}
            </Box>
          </Box>
        )}

        {/* Tab 2: Deployment Guide */}
        {activeTab === 2 && (
          <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <InfoIcon sx={{ color: 'indigo-400' }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>Manual Deployment Guide</Typography>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
              {[
                { step: '01', title: 'Export Config', desc: 'Go to the Export Console tab and copy the entire rule set. This includes Core and STIX-derived rules.' },
                { step: '02', title: 'Update Proxy', desc: 'Paste the content into your firewall rule file (typically /etc/nginx/naxsi_rules.conf).' },
                { step: '03', title: 'Reload Nginx', desc: 'Execute "nginx -t" to check syntax and "nginx -s reload" to apply the new protection.' }
              ].map(item => (
                <Box key={item.step} sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography variant="h4" sx={{ color: 'indigo-500/30', fontWeight: 900, mb: 1 }}>{item.step}</Typography>
                  <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>{item.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'slate.400', lineHeight: 1.5 }}>{item.desc}</Typography>
                </Box>
              ))}
            </Box>

            <Alert severity="info" sx={{ mt: 4, backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'indigo.200', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 3 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>PRO TIP</Typography>
              The system strictly follows the STIX-CIDR/Regex mapping. Rules marked as "SQL_INJECTION" use ID ranges 1000-2104 and specific match zones (mz) tailored for database protection.
            </Alert>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} variant="filled" sx={{ width: '100%', borderRadius: 3, fontWeight: 700 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RuleManagementPage;
