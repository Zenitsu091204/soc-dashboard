import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BugReportIcon from '@mui/icons-material/BugReport';
import PersonIcon from '@mui/icons-material/Person';
import api from '../services/api';

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ alerts: [], iocs: [], threatActors: [] });
  const [loading, setLoading] = useState(false);
  // Cache raw data so we only fetch once per dialog open, not per keystroke
  const dataCache = useRef(null);
  const abortControllerRef = useRef(null);

  // Keyboard shortcut handler (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle search with Cmd+K or / (if not in input)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search function — fetches data once and filters client-side on subsequent searches
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ alerts: [], iocs: [], threatActors: [] });
      return;
    }

    setLoading(true);
    try {
      // Abort any previous in-flight request
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      // Use cached data if available — only fetch once per dialog session
      if (!dataCache.current) {
        const [alertsRes, iocsRes, actorsRes] = await Promise.all([
          api.get('/alerts'),
          api.get('/intel/iocs'),
          api.get('/intel/threat-actors'),
        ]);
        dataCache.current = {
          alerts: alertsRes.data,
          iocs: iocsRes.data,
          threatActors: actorsRes.data,
        };
      }

      const { alerts, iocs, threatActors } = dataCache.current;
      const lowerQuery = searchQuery.toLowerCase();

      const filteredAlerts = alerts.filter(a =>
        (a.title && a.title.toLowerCase().includes(lowerQuery)) ||
        (a.entity && a.entity.toLowerCase().includes(lowerQuery))
      ).slice(0, 5);

      const filteredIocs = iocs.filter(i =>
        i.value && i.value.toLowerCase().includes(lowerQuery)
      ).slice(0, 5);

      const filteredActors = threatActors.filter(t =>
        t.name && t.name.toLowerCase().includes(lowerQuery)
      ).slice(0, 5);

      setResults({ alerts: filteredAlerts, iocs: filteredIocs, threatActors: filteredActors });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Search failed', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
        if(query) performSearch(query);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  const handleClose = () => {
    setOpen(false);
    setQuery('');
    setResults({ alerts: [], iocs: [], threatActors: [] });
    // Clear the cache when dialog closes so next open gets fresh data
    dataCache.current = null;
  };

  const totalResults = results.alerts.length + results.iocs.length + results.threatActors.length;

  return (
    <>
      {/* Search trigger button */}
      <TextField
        size="small"
        placeholder="Search... (⌘K)"
        onClick={() => setOpen(true)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <Chip
              label="⌘K"
              size="small"
              sx={{
                height: 20,
                fontSize: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            />
          ),
          readOnly: true,
        }}
        sx={{
          width: { xs: 200, md: 300 },
          cursor: 'pointer',
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          },
        }}
      />

      {/* Search Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(21, 30, 50, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 2,
            maxHeight: '80vh',
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {/* Search Input */}
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <TextField
              fullWidth
              autoFocus
              placeholder="Search alerts, IOCs, threat actors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6366F1' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
          </Box>

          {/* Search Results */}
          <Box sx={{ maxHeight: '60vh', overflowY: 'auto', p: 2 }}>
            {!query.trim() ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Start typing to search across alerts, IOCs, and threat actors
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Press ESC to close
                </Typography>
              </Box>
            ) : loading ? (
               <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary'}}>Searching...</Box>
            ) : totalResults === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No results found for "{query}"
                </Typography>
              </Box>
            ) : (
              <>
                {/* Alerts Results */}
                {results.alerts.length > 0 && (
                  <>
                    <Typography variant="caption" sx={{ color: 'text.secondary', px: 2, fontWeight: 600 }}>
                      ALERTS ({results.alerts.length})
                    </Typography>
                    <List dense>
                      {results.alerts.map((alert) => (
                        <ListItem key={alert.id} disablePadding>
                          <ListItemButton
                            sx={{
                              borderRadius: 1,
                              '&:hover': {
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                              },
                            }}
                          >
                            <ListItemIcon>
                              <NotificationsIcon sx={{ color: '#6366F1' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={alert.title}
                              secondary={`${alert.entity} • ${alert.severity}`}
                              primaryTypographyProps={{ variant: 'body2' }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* IOCs Results */}
                {results.iocs.length > 0 && (
                  <>
                    <Typography variant="caption" sx={{ color: 'text.secondary', px: 2, fontWeight: 600 }}>
                      INDICATORS OF COMPROMISE ({results.iocs.length})
                    </Typography>
                    <List dense>
                      {results.iocs.map((ioc) => (
                        <ListItem key={ioc.id || ioc.value} disablePadding>
                          <ListItemButton
                            sx={{
                              borderRadius: 1,
                              '&:hover': {
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                              },
                            }}
                          >
                            <ListItemIcon>
                              <BugReportIcon sx={{ color: '#F59E0B' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={ioc.value}
                              secondary={ioc.type}
                              primaryTypographyProps={{ variant: 'body2', fontFamily: 'monospace' }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* Threat Actors Results */}
                {results.threatActors.length > 0 && (
                  <>
                    <Typography variant="caption" sx={{ color: 'text.secondary', px: 2, fontWeight: 600 }}>
                      THREAT ACTORS ({results.threatActors.length})
                    </Typography>
                    <List dense>
                      {results.threatActors.map((actor) => (
                        <ListItem key={actor.id} disablePadding>
                          <ListItemButton
                            sx={{
                              borderRadius: 1,
                              '&:hover': {
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                              },
                            }}
                          >
                            <ListItemIcon>
                              <PersonIcon sx={{ color: '#EF4444' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={actor.name}
                              secondary={`${actor.type || ''}`}
                              primaryTypographyProps={{ variant: 'body2' }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalSearch;
