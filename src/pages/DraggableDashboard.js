import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Tooltip } from '@mui/material';
import GridLayout from 'react-grid-layout';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import AlertsTrendCard from '../components/AlertsTrendCard';
import AlertStatusCard from '../components/AlertStatusCard';
import TopAssetsCard from '../components/TopAssetsCard';
import TopThreatActorsCard from '../components/TopThreatActorsCard';
import IocDistributionCard from '../components/IocDistributionCard';
import { alerts } from '../data/mockSocData';
import showToast from '../utils/toast';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const { Responsive, WidthProvider } = GridLayout;
const ResponsiveGrid = WidthProvider(Responsive);

// Default layout configuration
const defaultLayouts = {
  lg: [
    { i: 'stat1', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat2', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat3', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat4', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'trend', x: 0, y: 2, w: 8, h: 6, minW: 6, minH: 4 },
    { i: 'status', x: 8, y: 2, w: 4, h: 6, minW: 3, minH: 4 },
    { i: 'assets', x: 0, y: 8, w: 4, h: 5, minW: 3, minH: 4 },
    { i: 'threats', x: 4, y: 8, w: 4, h: 5, minW: 3, minH: 4 },
    { i: 'iocs', x: 8, y: 8, w: 4, h: 5, minW: 3, minH: 4 },
  ],
};

const DraggableDashboard = () => {
  const [editMode, setEditMode] = useState(false);
  const [layouts, setLayouts] = useState(defaultLayouts);

  // Load saved layout from localStorage
  useEffect(() => {
    const savedLayouts = localStorage.getItem('dashboard-layouts');
    if (savedLayouts) {
      setLayouts(JSON.parse(savedLayouts));
    }
  }, []);

  // Handle layout change
  const handleLayoutChange = (layout, allLayouts) => {
    if (editMode) {
      setLayouts(allLayouts);
    }
  };

  // Save layout
  const handleSave = () => {
    localStorage.setItem('dashboard-layouts', JSON.stringify(layouts));
    setEditMode(false);
    showToast.success('Layout saved!', 'Your dashboard layout has been saved');
  };

  // Reset to default layout
  const handleReset = () => {
    setLayouts(defaultLayouts);
    localStorage.removeItem('dashboard-layouts');
    showToast.info('Layout reset', 'Dashboard layout has been reset to default');
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // Exiting edit mode without saving
      const savedLayouts = localStorage.getItem('dashboard-layouts');
      if (savedLayouts) {
        setLayouts(JSON.parse(savedLayouts));
      } else {
        setLayouts(defaultLayouts);
      }
    }
    setEditMode(!editMode);
  };

  // Calculate stats
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical').length;
  const highAlerts = alerts.filter((a) => a.severity === 'high').length;
  const riskScore = Math.min(100, Math.round(((criticalAlerts * 10 + highAlerts * 5) / totalAlerts) * 10));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <PageHeader
          title="Customizable Dashboard"
          subtitle="Drag and resize widgets to customize your layout"
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {editMode && (
            <>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
                sx={{
                  borderColor: 'rgba(239, 68, 68, 0.5)',
                  color: '#EF4444',
                  '&:hover': {
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  },
                }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  },
                }}
              >
                Save Layout
              </Button>
            </>
          )}
          <Tooltip title={editMode ? 'Lock Layout' : 'Unlock to Edit'}>
            <IconButton
              onClick={toggleEditMode}
              sx={{
                backgroundColor: editMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                color: editMode ? '#EF4444' : '#6366F1',
                '&:hover': {
                  backgroundColor: editMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                },
              }}
            >
              {editMode ? <LockOpenIcon /> : <LockIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {editMode && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#6366F1', fontWeight: 600 }}>
            ✨ Edit Mode Active
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Drag widgets to reposition • Resize from bottom-right corner • Click Save when done
          </Typography>
        </Box>
      )}

      <ResponsiveGrid
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        onLayoutChange={handleLayoutChange}
        isDraggable={editMode}
        isResizable={editMode}
        compactType="vertical"
        preventCollision={false}
      >
        <Box
          key="stat1"
          sx={{
            '& > *': { height: '100%' },
            ...(editMode && {
              '&:hover': {
                outline: '2px dashed #6366F1',
                outlineOffset: -2,
                cursor: 'move',
              },
            }),
          }}
        >
          <StatCard
            label="Total Alerts"
            value={totalAlerts}
            trend={12}
            helper="In selected range"
          />
        </Box>

        <Box
          key="stat2"
          sx={{
            '& > *': { height: '100%' },
            ...(editMode && {
              '&:hover': {
                outline: '2px dashed #6366F1',
                outlineOffset: -2,
                cursor: 'move',
              },
            }),
          }}
        >
          <StatCard
            label="Critical"
            value={criticalAlerts}
            severity="critical"
            trend={15}
            helper="Requires immediate action"
          />
        </Box>

        <Box
          key="stat3"
          sx={{
            '& > *': { height: '100%' },
            ...(editMode && {
              '&:hover': {
                outline: '2px dashed #6366F1',
                outlineOffset: -2,
                cursor: 'move',
              },
            }),
          }}
        >
          <StatCard
            label="High Priority"
            value={highAlerts}
            severity="high"
            trend={-5}
            helper="Next to review"
          />
        </Box>

        <Box
          key="stat4"
          sx={{
            '& > *': { height: '100%' },
            ...(editMode && {
              '&:hover': {
                outline: '2px dashed #6366F1',
                outlineOffset: -2,
                cursor: 'move',
              },
            }),
          }}
        >
          <StatCard
            label="Risk Score"
            value={riskScore}
            trend={8}
            helper="Overall threat level"
          />
        </Box>

        <Box
          key="trend"
          sx={{
            '& > *': { height: '100%' },
            ...(editMode && {
              '&:hover': {
                outline: '2px dashed #6366F1',
                outlineOffset: -2,
                cursor: 'move',
              },
            }),
          }}
        >
          <AlertsTrendCard alerts={alerts} />
        </Box>

        <Box
          key="status"
          sx={{
            '& > *': { height: '100%' },
            ...(editMode && {
              '&:hover': {
                outline: '2px dashed #6366F1',
                outlineOffset: -2,
                cursor: 'move',
              },
            }),
          }}
        >
          <AlertStatusCard alerts={alerts} />
        </Box>

        <Box
          key="assets"
          sx={{
            '& > *': { height: '100%' },
            ...(editMode && {
              '&:hover': {
                outline: '2px dashed #6366F1',
                outlineOffset: -2,
                cursor: 'move',
              },
            }),
          }}
        >
          <TopAssetsCard alerts={alerts} />
        </Box>

        <Box
          key="threats"
          sx={{
            '& > *': { height: '100%' },
            ...(editMode && {
              '&:hover': {
                outline: '2px dashed #6366F1',
                outlineOffset: -2,
                cursor: 'move',
              },
            }),
          }}
        >
          <TopThreatActorsCard />
        </Box>

        <Box
          key="iocs"
          sx={{
            '& > *': { height: '100%' },
            ...(editMode && {
              '&:hover': {
                outline: '2px dashed #6366F1',
                outlineOffset: -2,
                cursor: 'move',
              },
            }),
          }}
        >
          <IocDistributionCard />
        </Box>
      </ResponsiveGrid>
    </Box>
  );
};

export default DraggableDashboard;
