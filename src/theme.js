import { createTheme, alpha } from '@mui/material/styles';

/**
 * SOC Dashboard theme
 * Dark Indigo + Cyan (Futuristic Clean)
 *
 * Background:      #0F172A
 * Card background: #1E293B
 * Primary:         #6366F1 (indigo)
 * Accent:          #22D3EE (cyan)
 * Text primary:    #E2E8F0
 * Border:          rgba(148, 163, 184, 0.35)
 */
export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    primary: {
      main: '#6366F1', // indigo
    },
    secondary: {
      main: '#22D3EE', // cyan accent
    },
    info: { main: '#22D3EE' },
    warning: { main: '#F97316' }, // high
    error: { main: '#EF4444' },   // critical
    success: { main: '#22C55E' }, // low / success
    text: {
      primary: '#E2E8F0',
      secondary: '#94A3B8',
    },
    divider: alpha('#64748B', 0.5),
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(180deg, #0B1120 0%, #0F172A 100%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(15, 23, 42, 0.78)',
          border: '1px solid rgba(148, 163, 184, 0.25)',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: alpha('#10B981', 0.18),
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#020617', 0.6),
        },
      },
    },
  },
});

