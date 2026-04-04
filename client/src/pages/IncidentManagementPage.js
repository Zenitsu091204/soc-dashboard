import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HistoryIcon from '@mui/icons-material/History';
import SecurityIcon from '@mui/icons-material/Security';
import GavelIcon from '@mui/icons-material/Gavel';
import api from '../services/api';

const IncidentManagementPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/incidents');
      setIncidents(data);
    } catch (err) {
      console.error('Failed to fetch incidents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleOpenDetail = async (incident) => {
    try {
      setTimelineLoading(true);
      // Fetch full incident with hydrated relationships
      const { data: fullIncident } = await api.get(`/incidents/${incident.id}`);
      setSelectedIncident(fullIncident);
      setNotes(fullIncident.notes || '');
      setStatus(fullIncident.status);
      setOpenDetail(true);
      
      const { data: timelineData } = await api.get(`/incidents/${incident.id}/timeline`);
      setTimeline(timelineData);
    } catch (err) {
      console.error('Failed to fetch incident details', err);
    } finally {
      setTimelineLoading(false);
    }
  };

  const handleUpdateIncident = async () => {
    try {
      await api.patch(`/incidents/${selectedIncident.id}`, { status, notes });
      fetchIncidents();
      setOpenDetail(false);
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
          Incident Management
        </Typography>
        <Typography variant="body2" sx={{ color: 'slate.400' }}>
          Track and resolve security incidents generated from correlated alerts.
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'slate.400' }}>Incident Title</TableCell>
              <TableCell sx={{ color: 'slate.400' }}>Priority</TableCell>
              <TableCell sx={{ color: 'slate.400' }}>Status</TableCell>
              <TableCell sx={{ color: 'slate.400' }}>Alerts</TableCell>
              <TableCell sx={{ color: 'slate.400' }}>Assigned To</TableCell>
              <TableCell sx={{ color: 'slate.400', textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.id} hover>
                <TableCell sx={{ color: 'white', fontWeight: 'medium' }}>{incident.title}</TableCell>
                <TableCell>
                  <Chip 
                    label={incident.priority.toUpperCase()} 
                    size="small"
                    color={incident.priority === 'high' ? 'error' : 'warning'}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={incident.status.toUpperCase()} 
                    size="small"
                    variant="outlined"
                    sx={{ color: 'indigo.400', borderColor: 'indigo.500/30' }}
                  />
                </TableCell>
                <TableCell sx={{ color: 'slate.300' }}>{incident.alerts?.length || 0}</TableCell>
                <TableCell sx={{ color: 'slate.400' }}>{incident.assignedTo || 'Unassigned'}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleOpenDetail(incident)} sx={{ color: 'indigo.400' }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Incident Detail Dialog */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#0f172a', color: 'white' } }}>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold' }}>
          Investigation: {selectedIncident?.title}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ minWidth: 200, input: { color: 'white' } }}
                variant="outlined"
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="investigating">Investigating</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </TextField>
              <TextField
                  select
                  label="Priority"
                  value={selectedIncident?.priority || 'medium'}
                  onChange={(e) => setIncidents(prev => prev.map(i => i.id === selectedIncident.id ? {...i, priority: e.target.value} : i))}
                  sx={{ minWidth: 150 }}
              >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
              </TextField>
            </Box>

            <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'slate-400', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon style={{ width: 16 }} /> Associated Indicators ({selectedIncident?.incidentIocs?.length || 0})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedIncident?.incidentIocs?.map(({ ioc }) => (
                        <Chip 
                            key={ioc.id} 
                            label={`${ioc.type.toUpperCase()}: ${ioc.value}`} 
                            size="small" 
                            sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'indigo.300', border: '1px solid rgba(99, 102, 241, 0.2)' }} 
                        />
                    ))}
                    {!selectedIncident?.incidentIocs?.length && <Typography variant="caption" sx={{ color: 'slate.600' }}>No indicators linked</Typography>}
                </Box>
            </Box>

            <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'slate-400', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GavelIcon style={{ width: 16 }} /> Active Protection Rules ({selectedIncident?.incidentRules?.length || 0})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedIncident?.incidentRules?.map(({ rule }) => (
                        <Chip 
                            key={rule.id} 
                            label={`Rule #${rule.id.substring(0, 8)}`} 
                            size="small" 
                            variant="outlined"
                            sx={{ color: 'emerald.400', borderColor: 'emerald.500/20' }} 
                        />
                    ))}
                    {!selectedIncident?.incidentRules?.length && <Typography variant="caption" sx={{ color: 'slate.600' }}>No rules deployed for this incident</Typography>}
                </Box>
            </Box>
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1, color: 'slate-400' }}>Analyst Notes</Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Add investigation findings, evidence, and next steps..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ 
                bgcolor: 'rgba(255,255,255,0.02)',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': { color: 'white' }
            }}
          />

          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'slate.400', display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon fontSize="small" /> Threat Timeline & Audit Logs
            </Typography>
            {timelineLoading ? (
              <CircularProgress size={20} />
            ) : (
              <Box sx={{ borderLeft: '2px solid rgba(255,255,255,0.05)', ml: 1, pl: 3 }}>
                {timeline.map((log, index) => (
                  <Box key={log.id} sx={{ mb: 2, position: 'relative' }}>
                    <Box sx={{ 
                      position: 'absolute', 
                      left: '-31px', 
                      top: '4px', 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      bgcolor: 'indigo.500',
                      boxShadow: '0 0 10px rgba(99,102,241,0.5)'
                    }} />
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {log.action.replace(/_/g, ' ')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'slate.500' }}>
                      {new Date(log.timestamp).toLocaleString()} • {log.details}
                    </Typography>
                  </Box>
                ))}
                {timeline.length === 0 && (
                  <Typography variant="caption" sx={{ color: 'slate.600' }}>No history recorded for this incident yet.</Typography>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Button onClick={() => setOpenDetail(false)} sx={{ color: 'slate.400' }}>Cancel</Button>
          <Button 
            onClick={handleUpdateIncident} 
            variant="contained" 
            startIcon={<CheckCircleIcon />}
            sx={{ bgcolor: 'indigo.600', '&:hover': { bgcolor: 'indigo.700' } }}
          >
            Update Incident
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncidentManagementPage;
