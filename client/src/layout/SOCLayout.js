import * as React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Tooltip,
  Fade,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import GroupWorkRoundedIcon from '@mui/icons-material/GroupWorkRounded';
import RuleFolderRoundedIcon from '@mui/icons-material/RuleFolderRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import AssignmentLateRoundedIcon from '@mui/icons-material/AssignmentLateRounded';

import LanRoundedIcon from '@mui/icons-material/LanRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useAuth } from '../context/AuthContext';
import RiskPulseBar from '../components/RiskPulseBar';
import GlobalSearch from '../components/GlobalSearch';
import api from '../services/api';

const DRAWER_WIDTH_OPEN = 240;
const DRAWER_WIDTH_CLOSED = 70;

const navItems = [
  // Operations
  { type: 'section', id: 'ops', label: 'OPERATIONS' },
  {
    type: 'item',
    id: 'live-monitor',
    label: 'Dashboard',
    to: '/',
    icon: <LanRoundedIcon fontSize="small" />,
  },
  {
    type: 'item',
    id: 'incidents',
    label: 'Incidents',
    to: '/incident-management',
    icon: <AssignmentLateRoundedIcon fontSize="small" />,
  },
  {
    type: 'item',
    id: 'rule-management',
    label: 'Rule Management',
    to: '/rule-management',
    icon: <GavelRoundedIcon fontSize="small" />,
  },
  {
    type: 'item',
    id: 'intelligence',
    label: 'Intelligence',
    to: '/intelligence',
    icon: <RuleFolderRoundedIcon fontSize="small" />,
  },

  // Workspace
  { type: 'section', id: 'workspace', label: 'WORKSPACE' },
  {
    type: 'item',
    id: 'settings',
    label: 'Settings',
    to: '/settings',
    icon: <TuneRoundedIcon fontSize="small" />,
  },
];

function SidebarNavItem({ label, to, icon, open }) {
  const navigate = useNavigate();
  const isLink = !!to;

  const content = (
    <div
      onClick={() => isLink && navigate(to)}
      className={`
        flex items-center min-h-[48px] px-2.5 mx-1 mb-0.5 rounded-lg cursor-pointer transition-all duration-200
        ${open ? 'justify-start' : 'justify-center'}
        hover:bg-white/5 hover:text-white text-slate-400
        ${isLink ? 'active:text-indigo-400' : ''} 
      `}
    >
      <div className={`flex items-center justify-center transition-colors duration-200 ${open ? 'mr-4' : 'mr-0'}`}>
        {icon}
      </div>
      
      <span 
        className={`whitespace-nowrap text-sm font-medium transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 hidden'}`}
      >
        {label}
      </span>
    </div>
  );

  if (to) {
     return (
        <NavLink 
          to={to} 
          end={to === '/'}
          className={({ isActive }) => `
            flex items-center min-h-[48px] px-2.5 mx-1 mb-0.5 rounded-lg cursor-pointer transition-all duration-200
            ${open ? 'justify-start' : 'justify-center'}
            hover:bg-white/5 hover:text-white text-slate-400
            ${isActive 
              ? 'text-indigo-400 bg-indigo-500/10 bg-gradient-to-r from-indigo-500/15 to-indigo-500/5' 
              : ''}
          `}
        >
          {({ isActive }) => (
            <>
              <div className={`flex items-center justify-center transition-colors duration-200 ${isActive ? 'text-indigo-500' : ''} ${open ? 'mr-4' : 'mr-0'}`}>
                {icon}
              </div>
              <span 
                className={`whitespace-nowrap text-sm font-medium transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 hidden'}`}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
     )
  }

  return (
    <Tooltip title={!open ? label : ''} placement="right" arrow>
      {content}
    </Tooltip>
  );
}

export default function SOCLayout() {
  const layoutRef = React.useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);
  const [timeRange, setTimeRange] = React.useState('24h');
  const [fullscreen, setFullscreen] = React.useState(false);
  const [riskScore, setRiskScore] = React.useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Fetch basic stats for risk score
    const fetchRisk = async () => {
      try {
        const { data } = await api.get('/alerts/stats');
        // Use the correct fields returned by alertController: totalAlerts, criticalAlerts
        const { totalAlerts: total = 0, criticalAlerts: critical = 0, highAlerts: high = 0 } = data;
        const score = total > 0 ? Math.min(100, Math.round(((critical * 10 + high * 5) / total) * 10)) : 0;
        setRiskScore(score);
      } catch (e) {
        console.error("Failed to fetch risk stats", e);
      }
    };
    fetchRisk();
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const toggleFullscreen = React.useCallback(() => {
    try {
      if (!document.fullscreenElement) {
        const el = layoutRef.current;
        const req = el?.requestFullscreen || el?.webkitRequestFullscreen || el?.msRequestFullscreen;
        if (req) {
          req.call(el).catch(() => setFullscreen((prev) => !prev)); 
        } else {
          setFullscreen((prev) => !prev);
        }
      } else {
        document.exitFullscreen?.();
      }
    } catch (err) {
      setFullscreen((prev) => !prev); 
    }
  }, []);

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

  const sidebarWidth = open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED;

  return (
    <div
      ref={layoutRef}
      className={`flex min-h-screen bg-slate-950 ${fullscreen ? 'h-screen max-h-screen overflow-y-auto overflow-x-hidden' : ''}`}
    >
      {/* AppBar */}
      <header
        className={`fixed top-0 right-0 left-0 h-[70px] z-50 bg-slate-950/65 backdrop-blur-xl border-b border-white/5 transition-all duration-300`}
        style={{ width: `calc(100% - ${0}px)` }}
      >
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button
                onClick={handleDrawerToggle}
                className="p-2 rounded-full hover:bg-white/5 text-slate-300 transition-colors"
                aria-label="toggle drawer"
              >
                {open ? <ChevronLeftIcon /> : <MenuIcon />}
              </button>
             
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
               <LanRoundedIcon className="text-white text-sm" />
             </div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              SOC<span className="font-normal">Dashboard</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="h-9 min-w-[160px] px-3 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50"
            >
              <option value="1h">Last 1 hour</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>

            {/* Global Search */}
            <div className="mx-2">
              <GlobalSearch />
            </div>

            <div className="flex-1" />

            <Tooltip title={fullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen entire dashboard'}>
              <button
                onClick={toggleFullscreen}
                className={`p-2 rounded-lg transition-colors ${fullscreen ? 'text-indigo-400' : 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10'}`}
              >
                {fullscreen ? <FullscreenExitIcon className="text-xl" /> : <FullscreenIcon className="text-xl" />}
              </button>
            </Tooltip>

            <div className="flex items-center gap-3 pl-4 border-l border-white/5">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-200">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-slate-400">
                  {user?.role || 'SOC Analyst'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-indigo-500/20">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <Tooltip title="Logout">
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogoutIcon />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>
      
      {/* Risk Bar */}
      <RiskPulseBar riskScore={riskScore} drawerWidth={sidebarWidth} />

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 bg-[#0B1120] border-r border-white/5 transition-all duration-300 overflow-hidden flex flex-col`}
        style={{ width: sidebarWidth, transform: 'translateZ(0)' }}
      >
        <div className="h-[70px] min-h-[70px]" /> {/* Spacer for header */}
        
        <div className="flex-1 py-4 px-2 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {navItems.map((item) => {
              if (item.type === 'section') {
                return (
                  <Fade in={open} timeout={200} key={item.id}>
                    <p
                      className={`
                        pt-4 pb-2 px-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase
                        ${open ? 'block' : 'hidden'}
                      `}
                    >
                      {item.label}
                    </p>
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
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-white/5">
          <Fade in={open} timeout={300} unmountOnExit>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
               <h4 className="text-xs font-bold text-indigo-400">Pro Tip</h4>
               <p className="text-[10px] text-slate-400 mt-1">
                 Press <code className="bg-white/10 px-1 py-0.5 rounded text-white">/</code> to search
               </p>
            </div>
          </Fade>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 pt-[110px] pb-8 px-4 md:px-8 min-w-0 ${fullscreen ? 'max-h-[calc(100vh-120px)]' : ''}`}
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="animate-fade-in max-w-[1920px] mx-auto">
          <Outlet context={{ timeRange }} />
        </div>
      </main>
    </div>
  );
}
