import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * Advanced Filters Panel
 * Multi-criteria filtering for alerts
 */
const FilterPanel = ({ open, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    severity: {
      critical: true,
      high: true,
      medium: true,
      low: true,
    },
    status: {
      open: true,
      'in-progress': true,
      resolved: false,
      'false-positive': false,
    },
    dateRange: { startDate: '', endDate: '' },
    threatActor: '',
  });

  const handleDateChange = (field, value) => {
    setFilters({ ...filters, dateRange: { ...filters.dateRange, [field]: value } });
  };
  const handleActorChange = (e) => {
    setFilters({ ...filters, threatActor: e.target.value });
  };

  const handleSeverityChange = (severity) => {
    setFilters({
      ...filters,
      severity: {
        ...filters.severity,
        [severity]: !filters.severity[severity],
      },
    });
  };

  const handleStatusChange = (status) => {
    setFilters({
      ...filters,
      status: {
        ...filters.status,
        [status]: !filters.status[status],
      },
    });
  };

  const handleReset = () => {
    setFilters({
      severity: {
        critical: true,
        high: true,
        medium: true,
        low: true,
      },
      status: {
        open: true,
        'in-progress': true,
        resolved: false,
        'false-positive': false,
      },
      dateRange: { startDate: '', endDate: '' },
      threatActor: '',
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const activeFiltersCount = 
    Object.values(filters.severity).filter(Boolean).length +
    Object.values(filters.status).filter(Boolean).length;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 360,
          backgroundColor: 'rgba(21, 30, 50, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon sx={{ color: '#6366F1' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Filters
            </Typography>
            <Chip 
              label={activeFiltersCount} 
              size="small"
              sx={{
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                color: '#6366F1',
                fontWeight: 600,
              }}
            />
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Severity Filters */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
            SEVERITY
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.severity.critical}
                  onChange={() => handleSeverityChange('critical')}
                  sx={{
                    color: '#EF4444',
                    '&.Mui-checked': { color: '#EF4444' },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#EF4444' }} />
                  <Typography variant="body2">Critical</Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.severity.high}
                  onChange={() => handleSeverityChange('high')}
                  sx={{
                    color: '#F59E0B',
                    '&.Mui-checked': { color: '#F59E0B' },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#F59E0B' }} />
                  <Typography variant="body2">High</Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.severity.medium}
                  onChange={() => handleSeverityChange('medium')}
                  sx={{
                    color: '#EAB308',
                    '&.Mui-checked': { color: '#EAB308' },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#EAB308' }} />
                  <Typography variant="body2">Medium</Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.severity.low}
                  onChange={() => handleSeverityChange('low')}
                  sx={{
                    color: '#10B981',
                    '&.Mui-checked': { color: '#10B981' },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981' }} />
                  <Typography variant="body2">Low</Typography>
                </Box>
              }
            />
          </FormGroup>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Status Filters */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
            STATUS
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.status.open}
                  onChange={() => handleStatusChange('open')}
                  sx={{
                    color: '#6366F1',
                    '&.Mui-checked': { color: '#6366F1' },
                  }}
                />
              }
              label={<Typography variant="body2">Open</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.status['in-progress']}
                  onChange={() => handleStatusChange('in-progress')}
                  sx={{
                    color: '#6366F1',
                    '&.Mui-checked': { color: '#6366F1' },
                  }}
                />
              }
              label={<Typography variant="body2">In Progress</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.status.resolved}
                  onChange={() => handleStatusChange('resolved')}
                  sx={{
                    color: '#6366F1',
                    '&.Mui-checked': { color: '#6366F1' },
                  }}
                />
              }
              label={<Typography variant="body2">Resolved</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.status['false-positive']}
                  onChange={() => handleStatusChange('false-positive')}
                  sx={{
                    color: '#6366F1',
                    '&.Mui-checked': { color: '#6366F1' },
                  }}
                />
              }
              label={<Typography variant="body2">False Positive</Typography>}
            />
          </FormGroup>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Date Filters */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
            DATE RANGE
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <input 
              type="date" 
              value={filters.dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
            />
            <input 
              type="date" 
              value={filters.dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Threat Actor Filter */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
            TROUBLESHOOTING TAG
          </Typography>
          <input 
            type="text" 
            placeholder="e.g. APT29"
            value={filters.threatActor}
            onChange={handleActorChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            fullWidth
            sx={{
              borderColor: 'rgba(99, 102, 241, 0.5)',
              color: '#6366F1',
              '&:hover': {
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={handleApply}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
              },
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

// Filter Button Component
export const FilterButton = ({ onClick, activeCount = 0 }) => {
  return (
    <Button
      variant="outlined"
      startIcon={<FilterListIcon />}
      onClick={onClick}
      sx={{
        borderColor: 'rgba(99, 102, 241, 0.5)',
        color: '#6366F1',
        '&:hover': {
          borderColor: '#6366F1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
        },
      }}
    >
      Filters
      {activeCount > 0 && (
        <Chip
          label={activeCount}
          size="small"
          sx={{
            ml: 1,
            height: 20,
            backgroundColor: '#6366F1',
            color: 'white',
            fontWeight: 600,
          }}
        />
      )}
    </Button>
  );
};

export default FilterPanel;
