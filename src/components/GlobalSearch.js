import React, { useState, useEffect, useCallback } from 'react';
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
import { alerts, iocs, threatActors } from '../data/mockSocData';

/**
 * Global Search Component with Cmd+K shortcut
 * Searches across alerts, IOCs, and threat actors
 */
const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ alerts: [], iocs: [], threatActors: [] });

  // Keyboard shortcut handler (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
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

  // Search function
  const performSearch = useCallback((searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ alerts: [], iocs: [], threatActors: [] });
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();

    // Search alerts (with null-safe checks)
    const alertResults = alerts.filter(
      (alert) =>
        (alert.title && String(alert.title).toLowerCase().includes(lowerQuery)) ||
        (alert.entity && String(alert.entity).toLowerCase().includes(lowerQuery)) ||
        (alert.severity && String(alert.severity).toLowerCase().includes(lowerQuery))
    ).slice(0, 5);

    // Search IOCs (with null-safe checks)
    const iocResults = iocs.filter(
      (ioc) =>
        (ioc.value && String(ioc.value).toLowerCase().includes(lowerQuery)) ||
        (ioc.type && String(ioc.type).toLowerCase().includes(lowerQuery))
    ).slice(0, 5);

    // Search threat actors (with null-safe checks; uses sophistication/riskLevel - no category in mock data)
    const threatActorResults = threatActors.filter(
      (actor) =>
        (actor.name && String(actor.name).toLowerCase().includes(lowerQuery)) ||
        (actor.sophistication && String(actor.sophistication).toLowerCase().includes(lowerQuery)) ||
        (actor.riskLevel && String(actor.riskLevel).toLowerCase().includes(lowerQuery)) ||
        (Array.isArray(actor.targetSectors) && actor.targetSectors.some((s) => String(s).toLowerCase().includes(lowerQuery)))
    ).slice(0, 5);

    setResults({
      alerts: alertResults,
      iocs: iocResults,
      threatActors: threatActorResults,
    });
  }, []);

  // Update search results when query changes
  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  const handleClose = () => {
    setOpen(false);
    setQuery('');
    setResults({ alerts: [], iocs: [], threatActors: [] });
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
                      {results.iocs.map((ioc, index) => (
                        <ListItem key={index} disablePadding>
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
                              secondary={`${actor.sophistication || ''} • ${actor.riskLevel || ''}`}
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
