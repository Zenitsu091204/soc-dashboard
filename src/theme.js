import { createTheme } from '@mui/material/styles';

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
      default: '#0B1120', // Ultra dark blue-gray
      paper: '#151e32',   // Slightly lighter for cards
    },
    primary: {
      main: '#6366F1', // Indigo
      light: '#818CF8',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#06B6D4', // Cyan
      light: '#22D3EE',
      dark: '#0891B2',
    },
    info: { main: '#3B82F6' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    success: { main: '#10B981' },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
    divider: 'rgba(148, 163, 184, 0.1)',
    action: {
      hover: 'rgba(255, 255, 255, 0.05)',
      selected: 'rgba(99, 102, 241, 0.12)', // Primary-tinted selection
    },
  },
  shape: {
    borderRadius: 4, // Semi-square
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: { fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontWeight: 700, letterSpacing: '-0.025em' },
    h3: { fontWeight: 700, letterSpacing: '-0.025em' },
    h4: { fontWeight: 700, letterSpacing: '-0.025em' },
    h5: { fontWeight: 600, letterSpacing: '-0.025em' },
    h6: { fontWeight: 600, letterSpacing: '-0.025em' },
    subtitle1: { letterSpacing: '0.01em' },
    subtitle2: { letterSpacing: '0.01em', fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#334155 #0B1120',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: 'transparent',
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 2,
            backgroundColor: '#334155',
            minHeight: 24,
            border: '2px solid transparent',
            backgroundClip: 'content-box',
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
            backgroundColor: '#475569',
          },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
            backgroundColor: '#475569',
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            borderRadius: 2,
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(21, 30, 50, 0.6)', // Glass effect base
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        outlined: {
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(11, 17, 32, 0.8)', // Semi-transparent navbar
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
            pointerEvents: 'none',
          },
          '&:focus-visible': {
            outline: '2px solid #6366F1',
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          },
          '&:disabled': {
            background: 'rgba(99, 102, 241, 0.3)',
          },
        },
        outlined: {
          borderColor: 'rgba(99, 102, 241, 0.5)',
          '&:hover': {
            borderColor: '#6366F1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            borderLeft: '4px solid #6366F1',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.18)',
            },
          },
        },
      },
    },
  },
});

