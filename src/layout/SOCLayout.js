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
} from '@mui/material';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
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
import { useAuth } from '../context/AuthContext';
import RiskPulseBar from '../components/RiskPulseBar';
import GlobalSearch from '../components/GlobalSearch';
import { alerts, calculateRiskScore } from '../data/mockSocData';

const drawerWidth = 260;

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
    icon: <DescriptionRoundedIcon fontSize="small" />,
  },
  {
    type: 'item',
    id: 'dashboards',
    label: 'Dashboards',
    icon: <DashboardRoundedIcon fontSize="small" />,
    to: '/dashboards',
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

function SidebarNavItem({ label, to, icon }) {
  const buttonProps = to
    ? {
        component: NavLink,
        to,
        end: to === '/',
      }
    : {};

  return (
    <ListItemButton
      {...buttonProps}
      sx={{
        mx: 1.5,
        mb: 0.5,
        borderRadius: 1,
        color: 'text.secondary',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.03)',
          transform: 'translateX(4px)',
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
          minWidth: 40,
          color: 'inherit',
          transition: 'color 0.2s',
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
      />
    </ListItemButton>
  );
}

export default function SOCLayout() {
  const [timeRange, setTimeRange] = React.useState('24h');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const riskScore = calculateRiskScore(alerts);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: 'rgba(11, 17, 32, 0.65)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Toolbar sx={{ minHeight: 70 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
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

      {/* Global Risk Pulse Bar */}
      <RiskPulseBar riskScore={riskScore} />

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#0B1120', // Constant dark background
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          },
        }}
      >
        <Toolbar sx={{ minHeight: 70 }} />
        <Box sx={{ px: 1, py: 2 }}>
          <List disablePadding>
            {navItems.map((item) => {
              if (item.type === 'section') {
                return (
                  <Typography
                    key={item.id}
                    variant="caption"
                    sx={{
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
                );
              }

              return (
                <SidebarNavItem
                  key={item.id}
                  label={item.label}
                  to={item.to}
                  icon={item.icon}
                />
              );
            })}
          </List>
        </Box>
        <Divider sx={{ mt: 'auto', borderColor: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ p: 3 }}>
          <Paper sx={{ p: 2, bgcolor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 3 }}>
             <Typography variant="subtitle2" color="#818CF8" sx={{ fontWeight: 700 }}>Pro Tip</Typography>
             <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
               Press <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: 4 }}>/</code> to search
             </Typography>
          </Paper>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          px: { xs: 2, md: 4 },
          py: 4,
          mt: 5, // Add margin top for risk pulse bar
        }}
      >
        <Toolbar sx={{ minHeight: 70 }} />
        <Container maxWidth="xl" sx={{ px: { xs: 0, md: 1 } }} className="animate-fade-in">
          <Outlet context={{ timeRange }} />
        </Container>
      </Box>
    </Box>
  );
}

