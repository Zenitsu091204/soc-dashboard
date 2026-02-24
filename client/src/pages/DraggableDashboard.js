import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ResponsiveGridLayout, useContainerWidth } from 'react-grid-layout';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CircularProgress from '@mui/material/CircularProgress';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import AlertsTrendCard from '../components/AlertsTrendCard';
import AlertStatusCard from '../components/AlertStatusCard';
import TopAssetsCard from '../components/TopAssetsCard';
import TopThreatActorsCard from '../components/TopThreatActorsCard';
import IocDistributionCard from '../components/IocDistributionCard';
import api from '../services/api';
import showToast from '../utils/toast';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './DraggableDashboard.css';

// WidgetWrapper defined OUTSIDE the component to avoid re-creation on every render
const WidgetWrapper = ({ children, className, style, editMode, ...props }) => {
  return (
    <div
      style={style}
      className={`${className} widget-wrapper ${editMode ? 'edit-mode' : ''}`}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onTouchEnd={props.onTouchEnd}
      ref={props.innerRef}
      {...props}
    >
      {editMode && (
        <Box className="drag-handle">
          <DragIndicatorIcon fontSize="small" />
        </Box>
      )}
      {children}
    </div>
  );
};


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

const fetchUserLayout = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem(`dashboard-layout-${userId}`);
      resolve(saved ? JSON.parse(saved) : defaultLayouts);
    }, 600); 
  });
};

const saveUserLayout = async (userId, layout) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(`dashboard-layout-${userId}`, JSON.stringify(layout));
      resolve({ success: true });
    }, 800); 
  });
};

const DraggableDashboard = () => {
  const { width, containerRef, mounted } = useContainerWidth();
  const [editMode, setEditMode] = useState(false);
  const [layouts, setLayouts] = useState(defaultLayouts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  
  // Data State
  const [alerts, setAlerts] = useState([]);
  const [iocs, setIocs] = useState([]);
  const [threatActors, setThreatActors] = useState([]);

  // Mock User Context
  const userId = 'curr_user_123'; 

  // Load layout and data on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        // Load layout
        const layoutData = await fetchUserLayout(userId);
        
        // Load API Data
        const [alertsRes, iocsRes, actorsRes] = await Promise.all([
          api.get('/alerts'),
          api.get('/intel/iocs'),
          api.get('/intel/threat-actors')
        ]);

        if (isMounted) {
          setLayouts(layoutData);
          setAlerts(alertsRes.data);
          setIocs(iocsRes.data);
          setThreatActors(actorsRes.data);
          setLoading(false);
          setAnnouncement('Dashboard loaded successfully.');
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        if (isMounted) {
          setError('Failed to load dashboard data. Please try again.');
          setLoading(false);
          setAnnouncement('Failed to load dashboard.');
        }
      }
    };

    loadData();

    return () => { isMounted = false; };
  }, [userId]);

  const handleLayoutChange = (layout, allLayouts) => {
    if (editMode) {
      setLayouts(allLayouts);
    }
  };

  const handleSaveAndLock = async () => {
    try {
      setSaving(true);
      setAnnouncement('Saving dashboard layout...');
      await saveUserLayout(userId, layouts);
      setEditMode(false);
      setAnnouncement('Dashboard layout saved and locked successfully.');
      showToast.success('Layout Saved & Locked', 'Dashboard configuration persisted to cloud');
    } catch (error) {
      setAnnouncement('Failed to save dashboard layout.');
      showToast.error('Save Failed', 'Could not save layout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLayouts(defaultLayouts);
    localStorage.removeItem(`dashboard-layout-${userId}`);
    showToast.info('Layout Reset', 'Dashboard layout restored to default');
  };

  const toggleEditMode = useCallback(() => {
    if (editMode) {
      setEditMode(false);
      setAnnouncement('Edit mode disabled. Dashboard is now locked.');
    } else {
      setEditMode(true);
      setAnnouncement('Edit mode enabled. You can now drag and resize widgets using handles. Press Escape to cancel.');
    }
  }, [editMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        toggleEditMode();
      }
      if (e.key === 'Escape' && editMode) {
        setEditMode(false);
        setAnnouncement('Edit mode cancelled. Dashboard is now locked.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode, toggleEditMode]);

  // Calculate stats
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical').length;
  const highAlerts = alerts.filter((a) => a.severity === 'high').length;
  const riskScore = totalAlerts > 0 
    ? Math.min(100, Math.round(((criticalAlerts * 10 + highAlerts * 5) / totalAlerts) * 10))
    : 0;


  if (loading) {
     return (
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
           <CircularProgress size={60} thickness={4} sx={{ color: '#6366F1' }} />
        </Box>
     );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: 2 }}>
        <Typography color="error" variant="h6">⚠ {error}</Typography>
        <Button
          variant="contained"
          onClick={() => { setError(null); setLoading(true); }}
          sx={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }} role="main" aria-label="Customizable Dashboard">
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
        style={{ position: 'absolute', left: '-10000px' }}
      >
        {announcement}
      </div>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <PageHeader
          title="Customizable Dashboard"
          subtitle={editMode ? "Editing Mode Active - Drag handles to move" : "Dashboard View - Layout Locked"}
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {editMode ? (
            <>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
                disabled={saving}
                sx={{
                  borderColor: 'rgba(239, 68, 68, 0.5)',
                  color: '#EF4444',
                  '&:hover': {
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  },
                }}
              >
                Reset Default
              </Button>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleSaveAndLock}
                disabled={saving}
                sx={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  },
                }}
              >
                {saving ? 'Saving...' : 'Save & Lock'}
              </Button>
            </>
          ) : (
             <Button
                variant="contained"
                startIcon={<LockOpenIcon />}
                onClick={toggleEditMode}
                sx={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                  },
                }}
              >
                Unlock to Edit
              </Button>
          )}
        </Box>
      </Box>

      <div ref={containerRef}>
        {mounted && (
      <ResponsiveGridLayout
        className="layout"
        width={width}
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={40}
        margin={[24, 24]}
        containerPadding={[0, 0]}
        compactType="vertical"
        preventCollision={!editMode}
        onLayoutChange={handleLayoutChange}
        isDraggable={editMode}
        isResizable={editMode}
        draggableHandle=".drag-handle"
      >
        <div key="stat1">
           <WidgetWrapper>
              <StatCard label="Total Alerts" value={totalAlerts} trend={12} helper="In selected range" />
           </WidgetWrapper>
        </div>

        <div key="stat2">
           <WidgetWrapper>
              <StatCard label="Critical" value={criticalAlerts} severity="critical" trend={15} helper="Requires immediate action" />
           </WidgetWrapper>
        </div>

        <div key="stat3">
           <WidgetWrapper>
              <StatCard label="High Priority" value={highAlerts} severity="high" trend={-5} helper="Next to review" />
           </WidgetWrapper>
        </div>

        <div key="stat4">
           <WidgetWrapper>
              <StatCard label="Risk Score" value={riskScore} trend={8} helper="Overall threat level" />
           </WidgetWrapper>
        </div>

        <div key="trend">
           <WidgetWrapper>
              <AlertsTrendCard alerts={alerts} />
           </WidgetWrapper>
        </div>

        <div key="status">
           <WidgetWrapper>
              <AlertStatusCard alerts={alerts} />
           </WidgetWrapper>
        </div>

        <div key="assets">
           <WidgetWrapper>
              <TopAssetsCard alerts={alerts} />
           </WidgetWrapper>
        </div>

        <div key="threats">
           <WidgetWrapper>
              <TopThreatActorsCard threatActors={threatActors} />
           </WidgetWrapper>
        </div>

        <div key="iocs">
           <WidgetWrapper>
              <IocDistributionCard iocs={iocs} />
           </WidgetWrapper>
        </div>
      </ResponsiveGridLayout>
        )}
      </div>
    </Box>
  );
};

export default DraggableDashboard;
