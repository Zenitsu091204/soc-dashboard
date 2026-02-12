import * as React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import GroupWorkRoundedIcon from '@mui/icons-material/GroupWorkRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import RuleFolderRoundedIcon from '@mui/icons-material/RuleFolderRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import LanRoundedIcon from '@mui/icons-material/LanRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';

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
        mx: 1,
        mb: 0.5,
        borderRadius: 2,
        color: 'text.secondary',
        transition: 'background-color 150ms ease, transform 150ms ease',
        '&:hover': {
          bgcolor: 'rgba(34, 197, 94, 0.12)',
          transform: 'translateX(2px)',
        },
        '&.active': {
          color: 'text.primary',
          bgcolor: 'rgba(34, 197, 94, 0.12)',
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 38,
          color: 'inherit',
          transition: 'color 150ms ease, transform 150ms ease',
          '.MuiListItemButton-root:hover &': {
            color: 'primary.main',
            transform: 'scale(1.05)',
          },
          '.Mui-selected &': {
            color: 'primary.main',
          },
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }}
      />
    </ListItemButton>
  );
}

export default function SOCLayout() {
  const [timeRange, setTimeRange] = React.useState('24h');

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 900, letterSpacing: 0.2, flexGrow: 1 }}
          >
            SOC Dashboard
          </Typography>
          <TextField
            select
            size="small"
            label="Time range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="1h">Last 1 hour</MenuItem>
            <MenuItem value="24h">Last 24 hours</MenuItem>
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
          </TextField>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Toolbar sx={{ minHeight: 64 }} />
        <Box sx={{ px: 1, py: 1 }}>
          <Typography
            variant="overline"
            sx={{ px: 2, color: 'text.secondary', letterSpacing: 1 }}
          >
            Navigation
          </Typography>
          <List disablePadding sx={{ mt: 1 }}>
            {navItems.map((item) => {
              if (item.type === 'section') {
                return (
                  <Typography
                    key={item.id}
                    variant="caption"
                    sx={{
                      px: 2,
                      pt: 1.5,
                      pb: 0.5,
                      color: 'text.secondary',
                      letterSpacing: 1,
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
        <Divider sx={{ mt: 'auto' }} />
        <Box sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Beginner-friendly starter layout
          </Typography>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          px: { xs: 2, md: 3 },
          py: 3,
        }}
      >
        <Toolbar sx={{ minHeight: 64 }} />
        <Outlet context={{ timeRange }} />
      </Box>
    </Box>
  );
}

