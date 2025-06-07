'use client';
import { createTheme } from '@mui/material/styles';
import '@fontsource/rubik';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7B3F00',
      contrastText: '#FFF8E1',
    },
    secondary: {
      main: '#D9A441',
      contrastText: '#3E2723',
    },
    background: {
      default: '#FAF7F0',
      paper: '#FFFDF7',
    },
    text: {
      primary: '#3E2723',
      secondary: '#5D4037',
    },
    divider: '#D7CCC8',
  },
  typography: {
    fontFamily: 'Rubik, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '0.05em',
      color: '#5D4037',
      textTransform: 'uppercase',
    },
    body1: {
      fontSize: '1rem',
      color: '#3E2723',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.03em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 16,
          boxShadow: '0 3px 5px rgba(123, 63, 0, 0.3)',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            backgroundColor: '#5D2E00',
            boxShadow: '0 6px 10px rgba(93, 46, 0, 0.5)',
          },
          '&:active': {
            boxShadow: 'inset 0 3px 5px rgba(93, 46, 0, 0.7)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 15px rgba(123, 63, 0, 0.15)',
          border: '1px solid #D7CCC8',
        },
      },
    },
  },
});

export default theme;