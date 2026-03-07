import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid, Fab, Menu, MenuItem, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import PageHeader from '../components/PageHeader.js';
import StatCard from '../components/StatCard.js';
import AlertsTrendCard from '../components/AlertsTrendCard';
import AlertStatusCard from '../components/AlertStatusCard';
import TopAssetsCard from '../components/TopAssetsCard';
import IocDistributionCard from '../components/IocDistributionCard';
import TopThreatActorsCard from '../components/TopThreatActorsCard';
import RecentActivityFeed from '../components/RecentActivityFeed';
import GeographicThreatMap from '../components/widgets/GeographicThreatMap';
import SystemHealthWidget from '../components/widgets/SystemHealthWidget';
import TopCvesWidget from '../components/widgets/TopCvesWidget';
import api from '../services/api';

const ResponsiveGridLayout = WidthProvider(Responsive);

const WIDGET_REGISTRY = {
  trend: { name: 'Alerts Trend', minW: 4, minH: 3 },
  status: { name: 'Alert Status', minW: 3, minH: 3 },
  assets: { name: 'Top Assets', minW: 3, minH: 3 },
  actors: { name: 'Top Threat Actors', minW: 3, minH: 3 },
  ioc: { name: 'IOC Distribution', minW: 3, minH: 3 },
  map: { name: 'Geographic Map', minW: 4, minH: 4 },
  health: { name: 'System Health', minW: 3, minH: 3 },
  cves: { name: 'Top CVEs', minW: 3, minH: 3 },
  feed: { name: 'Recent Activity Feed', minW: 3, minH: 4 },
};

const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'trend', x: 0, y: 0, w: 8, h: 4 },
    { i: 'status', x: 8, y: 0, w: 4, h: 4 },
    { i: 'assets', x: 0, y: 4, w: 4, h: 4 },
    { i: 'actors', x: 4, y: 4, w: 4, h: 4 },
    { i: 'ioc', x: 8, y: 4, w: 4, h: 4 }
  ]
};

export default function DashboardsPage() {
  const [alerts, setAlerts] = useState([]);
  const [iocs, setIocs] = useState([]);
  const [threatActors, setThreatActors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Layout State
  const [layouts, setLayouts] = useState(DEFAULT_LAYOUTS);
  const [visibleWidgets, setVisibleWidgets] = useState(DEFAULT_LAYOUTS.lg.map(w => w.i));

  // Fab Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const addWidgetMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsRes, iocsRes, actorsRes] = await Promise.all([
          api.get('/alerts'),
          api.get('/intel/iocs'),
          api.get('/intel/threat-actors')
        ]);
        setAlerts(alertsRes.data);
        setIocs(iocsRes.data);
        setThreatActors(actorsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalAlerts = alerts.length;
  const uniqueAssets = useMemo(
    () => new Set(alerts.map((a) => a.source).filter(Boolean)).size,
    [alerts]
  );
  const totalActors = threatActors.length;
  const totalIocs = iocs.length;

  const handleLayoutChange = (layout, allLayouts) => {
    setLayouts(allLayouts);
  };

  const handleAddWidget = (widgetId) => {
    if (!visibleWidgets.includes(widgetId)) {
      const widgetConfig = WIDGET_REGISTRY[widgetId];
      // Append to the bottom of the grid
      const newLayoutItem = { 
        i: widgetId, 
        x: (visibleWidgets.length * 4) % 12, 
        y: Infinity, 
        w: widgetConfig.minW, 
        h: widgetConfig.minH 
      };
      setLayouts(prev => ({
        ...prev,
        lg: [...prev.lg, newLayoutItem]
      }));
      setVisibleWidgets([...visibleWidgets, widgetId]);
    }
    setAnchorEl(null);
  };

  const handeRemoveWidget = (widgetId) => {
    setVisibleWidgets(visibleWidgets.filter(id => id !== widgetId));
    setLayouts(prev => ({
      ...prev,
      lg: prev.lg.filter(item => item.i !== widgetId)
    }));
  };

  const renderWidgetContent = (widgetId) => {
    switch(widgetId) {
      case 'trend': return <AlertsTrendCard alerts={alerts} />;
      case 'status': return <AlertStatusCard alerts={alerts} />;
      case 'assets': return <TopAssetsCard alerts={alerts} />;
      case 'actors': return <TopThreatActorsCard threatActors={threatActors} />;
      case 'ioc': return <IocDistributionCard iocs={iocs} />;
      case 'map': return <GeographicThreatMap />;
      case 'health': return <SystemHealthWidget />;
      case 'cves': return <TopCvesWidget />;
      case 'feed': return <Box sx={{ height: '100%', overflow: 'hidden' }}><RecentActivityFeed alerts={alerts} maxItems={15} /></Box>;
      default: return null;
    }
  };

  if (loading) {
    return <Box sx={{ p: 3, color: 'text.secondary' }}>Loading dashboard...</Box>;
  }

  const availableToAdd = Object.keys(WIDGET_REGISTRY).filter(id => !visibleWidgets.includes(id));

  return (
    <Box sx={{ p: 3, minHeight: '100vh', position: 'relative' }} className="animate-fade-in">
      <PageHeader
        title="Custom Dashboard"
        subtitle="Make it yours. Drag, drop, resize, and add custom widgets."
      />

      {/* KPI row */}
      <Grid container spacing={3} sx={{ mt: 1, mb: 4 }} alignItems="stretch">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Total alerts" value={totalAlerts} helper="All time" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Unique assets" value={uniqueAssets} helper="Active entities" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Threat actors" value={totalActors} helper="Tracked profiles" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Active IOCs" value={totalIocs} helper="Intelligence feed" />
        </Grid>
      </Grid>

      {/* Draggable React Grid Layout */}
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".widget-drag-handle"
        isResizable={true}
        margin={[24, 24]}
      >
        {visibleWidgets.map(widgetId => (
          <Box key={widgetId} sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Custom drag handle / header for each widget */}
            <Box 
              className="widget-drag-handle" 
              sx={{ 
                position: 'absolute', top: 8, right: 8, zIndex: 10,
                display: 'flex', gap: 1, opacity: 0, transition: 'opacity 0.2s',
                '&:hover': { cursor: 'move' }
              }}
            >
              <IconButton 
                size="small" 
                onClick={(e) => { e.stopPropagation(); handeRemoveWidget(widgetId); }}
                sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.8)' } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Box 
              sx={{ 
                flex: 1, height: '100%', 
                '&:hover .widget-drag-handle': { opacity: 1 } // Show controls on hover
              }}
            >
              {renderWidgetContent(widgetId)}
            </Box>
          </Box>
        ))}
      </ResponsiveGridLayout>

      {/* Floating Add Button */}
      {availableToAdd.length > 0 && (
        <>
          <Fab 
            color="primary" 
            aria-label="add" 
            sx={{ position: 'fixed', bottom: 32, right: 32, background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <AddIcon />
          </Fab>
          <Menu
            anchorEl={anchorEl}
            open={addWidgetMenuOpen}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', minWidth: 200 } }}
          >
            <Typography variant="overline" sx={{ px: 2, display: 'block', color: 'text.secondary' }}>Add Widget</Typography>
            {availableToAdd.map(id => (
              <MenuItem key={id} onClick={() => handleAddWidget(id)} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                {WIDGET_REGISTRY[id].name}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
}
