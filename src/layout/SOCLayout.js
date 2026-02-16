import * as React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Fade,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import GroupWorkRoundedIcon from '@mui/icons-material/GroupWorkRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import RuleFolderRoundedIcon from '@mui/icons-material/RuleFolderRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LanRoundedIcon from '@mui/icons-material/LanRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useAuth } from '../context/AuthContext';
import RiskPulseBar from '../components/RiskPulseBar';
import GlobalSearch from '../components/GlobalSearch';
import { alerts, calculateRiskScore } from '../data/mockSocData';

const DRAWER_WIDTH_OPEN = 240;
const DRAWER_WIDTH_CLOSED = 70;

const navItems = [
  // Operations
  { type: 'section', id: 'ops', label: 'OPERATIONS' },
  {
    type: 'item',
    id: 'dashboards',
    label: 'Dashboards',
    to: '/dashboards',
    icon: <QueryStatsRoundedIcon fontSize="small" />,
  },
  {
    type: 'item',
    id: 'live-monitor',
    label: 'Live monitor',
    to: '/',
    icon: <LanRoundedIcon fontSize="small" />,
  },
  {
    type: 'item',
    id: 'investigations',
    label: 'Investigations',
    to: '/search',
    icon: <TravelExploreRoundedIcon fontSize="small" />,
  },
  {
    type: 'item',
    id: 'ioc-workbench',
    label: 'IOC workbench',
    to: '/ioc-feed',
    icon: <RuleFolderRoundedIcon fontSize="small" />,
  },

  // Intelligence
  { type: 'section', id: 'intel', label: 'INTELLIGENCE' },
  {
    type: 'item',
    id: 'actors',
    label: 'Actor profiles',
    to: '/threat-actors',
    icon: <GroupWorkRoundedIcon fontSize="small" />,
  },
  {
    type: 'item',
    id: 'intel-reports',
    label: 'Intel reports',
    to: '/intel-reports',
    icon: <DescriptionRoundedIcon fontSize="small" />,
  },
  {
    type: 'item',
    id: 'custom-dashboard',
    label: 'Custom Dashboard',
    icon: <TuneRoundedIcon fontSize="small" />,
    to: '/custom-dashboard',
  },
  {
    type: 'item',
    id: 'campaign-timeline',
    label: 'Campaign timeline',
    icon: <TimelineRoundedIcon fontSize="small" />,
  },

  // Workspace
  { type: 'section', id: 'workspace', label: 'WORKSPACE' },
  {
    type: 'item',
    id: 'assets',
    label: 'Assets',
    icon: <LanRoundedIcon fontSize="small" />,
  },
  {
    type: 'item',
    id: 'settings',
    label: 'Workspace settings',
    icon: <TuneRoundedIcon fontSize="small" />,
  },
];

function SidebarNavItem({ label, to, icon, open }) {
  const buttonProps = to
    ? {
        component: NavLink,
        to,
        end: to === '/',
      }
    : {};

  return (
    <Tooltip title={!open ? label : ''} placement="right" arrow>
      <ListItemButton
        {...buttonProps}
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
          mx: 1,
          mb: 0.5,
          borderRadius: 1,
          color: 'text.secondary',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            color: 'text.primary',
          },
          '&.active': {
            color: 'primary.light',
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)',
            '& .MuiListItemIcon-root': {
              color: 'primary.main',
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 2 : 'auto',
            justifyContent: 'center',
            color: 'inherit',
            transition: 'color 0.2s',
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
          sx={{ opacity: open ? 1 : 0, display: open ? 'block' : 'none', transition: 'opacity 0.2s' }}
        />
      </ListItemButton>
    </Tooltip>
  );
}

export default function SOCLayout() {
  const layoutRef = React.useRef(null);
  const [open, setOpen] = React.useState(true);
  const [timeRange, setTimeRange] = React.useState('24h');
  const [fullscreen, setFullscreen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const toggleFullscreen = React.useCallback(() => {
    try {
      if (!document.fullscreenElement) {
        const el = layoutRef.current;
        const req = el?.requestFullscreen || el?.webkitRequestFullscreen || el?.msRequestFullscreen;
        if (req) {
          req.call(el).catch(() => setFullscreen((prev) => !prev)); // Fallback to app fullscreen
        } else {
          setFullscreen((prev) => !prev); // Fallback: app-only fullscreen
        }
      } else {
        document.exitFullscreen?.();
      }
    } catch (err) {
      setFullscreen((prev) => !prev); // Fallback: app-only fullscreen
    }
  }, []);

  // Sync state with browser fullscreen API; fallback for when API unavailable
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const riskScore = calculateRiskScore(alerts);
  const drawerWidth = open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED;

  return (
    <Box
      ref={layoutRef}
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        ...(fullscreen && {
          height: '100vh',
          maxHeight: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }),
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: 'rgba(11, 17, 32, 0.65)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: 70 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
             <IconButton
                color="inherit"
                aria-label="toggle drawer"
                onClick={handleDrawerToggle}
                edge="start"
                sx={{ mr: 1 }}
              >
                {open ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
             
             <Box
               component="div"
               sx={{
                 width: 32,
                 height: 32,
                 borderRadius: '8px',
                 background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)'
               }}
             >
               <LanRoundedIcon sx={{ fontSize: 20, color: 'white' }} />
             </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, letterSpacing: -0.5, background: 'linear-gradient(90deg, #fff 0%, #94A3B8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              SOC<span style={{ fontWeight: 400 }}>Dashboard</span>
            </Typography>
          </Box>

          <TextField
            select
            size="small"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{ 
                minWidth: 160,
                '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }
                }
            }}
          >
            <MenuItem value="1h">Last 1 hour</MenuItem>
            <MenuItem value="24h">Last 24 hours</MenuItem>
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
          </TextField>

          {/* Global Search */}
          <Box sx={{ mx: 2 }}>
            <GlobalSearch />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title={fullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen entire dashboard'}>
            <IconButton
              onClick={toggleFullscreen}
              sx={{
                color: fullscreen ? 'primary.light' : 'text.secondary',
                '&:hover': { color: 'primary.light', bgcolor: 'rgba(99, 102, 241, 0.1)' },
              }}
            >
              {fullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {user?.role || 'SOC Analyst'}
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Tooltip title="Logout">
              <IconButton
                onClick={handleLogout}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                  },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <RiskPulseBar riskScore={riskScore} drawerWidth={drawerWidth} />

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            bgcolor: '#0B1120', // Constant dark background
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          },
        }}
      >
        <Toolbar sx={{ minHeight: 70 }} />
        <Box sx={{ key: open ? 'open' : 'closed', px: 1, py: 2 }}>
          <List disablePadding>
            {navItems.map((item) => {
              if (item.type === 'section') {
                return (
                  <Fade in={open} timeout={200} key={item.id}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: open ? 'block' : 'none',
                        px: 3,
                        pt: 2.5,
                        pb: 1,
                        color: 'rgba(148, 163, 184, 0.6)',
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        fontSize: 11,
                        textTransform: 'uppercase'
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Fade>
                );
              }

              return (
                <SidebarNavItem
                  key={item.id}
                  label={item.label}
                  to={item.to}
                  icon={item.icon}
                  open={open}
                />
              );
            })}
          </List>
        </Box>
        <Divider sx={{ mt: 'auto', borderColor: 'rgba(255,255,255,0.05)' }} />
        
        <Fade in={open} timeout={300} unmountOnExit>
          <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 2, bgcolor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 3 }}>
               <Typography variant="subtitle2" color="#818CF8" sx={{ fontWeight: 700 }}>Pro Tip</Typography>
               <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                 Press <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: 4 }}>/</code> to search
               </Typography>
            </Paper>
          </Box>
        </Fade>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          minWidth: 0,
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          px: { xs: 2, md: 4 },
          pr: { xs: 2, md: 5 },
          py: 4,
          mt: 5,
          ...(fullscreen && {
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: 'calc(100vh - 120px)', // Reserve space for AppBar + RiskPulseBar
            WebkitOverflowScrolling: 'touch',
          }),
        }}
      >
        <Toolbar sx={{ minHeight: 70 }} />
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 3 } }} className="animate-fade-in">
          <Outlet context={{ timeRange }} />
        </Container>
      </Box>
    </Box>
  );
}


