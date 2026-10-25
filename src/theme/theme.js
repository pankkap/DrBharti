import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F172A', // Sophisticated Slate Navy
      light: '#1E293B',
      dark: '#020617',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E11D48', // Crimson Reddish Brand Accent (Brochure Match)
      light: '#F43F5E',
      dark: '#BE123C',
      contrastText: '#FFFFFF',
    },
    accent: {
      main: '#BE123C', // Professional Red/Rose Accent
      light: '#E11D48',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#fce5e5', // Pink Theme Background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    success: {
      main: '#10B981',
      light: '#D1FAE5',
    },
    warning: {
      main: '#F59E0B',
      light: '#FEF3C7',
    },
    error: {
      main: '#EF4444',
      light: '#FEE2E2',
    },
    info: {
      main: '#0284C7',
      light: '#E0F2FE',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
      fontSize: '2.75rem',
      lineHeight: 1.15,
      letterSpacing: '-0.025em',
      color: '#0F172A',
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      fontSize: '2.1rem',
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
      color: '#0F172A',
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      fontSize: '1.6rem',
      lineHeight: 1.3,
      letterSpacing: '-0.015em',
      color: '#0F172A',
    },
    h4: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.35,
      color: '#0F172A',
    },
    h5: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1.1rem',
      lineHeight: 1.4,
      color: '#0F172A',
    },
    h6: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      fontSize: '0.95rem',
      lineHeight: 1.4,
      color: '#0F172A',
    },
    body1: {
      fontSize: '0.975rem',
      lineHeight: 1.6,
      color: '#334155',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.55,
      color: '#64748B',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          fontSize: '0.9rem',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#1E293B',
          },
        },
        containedSecondary: {
          backgroundColor: '#E11D48',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#BE123C',
            boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
          },
        },
        outlinedPrimary: {
          borderColor: '#CBD5E1',
          color: '#0F172A',
          '&:hover': {
            borderColor: '#0F172A',
            backgroundColor: 'rgba(15, 23, 42, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
          border: '1px solid #E2E8F0',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
            borderColor: '#CBD5E1',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '0.8rem',
        },
      },
    },
  },
});

export default theme;
