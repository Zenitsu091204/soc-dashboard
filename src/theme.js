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
          backgroundColor: '#0F172A',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderColor: alpha('#94A3B8', 0.35),
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.55)',
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

