'use client';
import { createTheme } from '@mui/material/styles';

const PRIMARY_PURPLE = '#783CB4';

export const getCustomTheme = (mode: 'light' | 'dark') => {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: PRIMARY_PURPLE,
        contrastText: '#ffffff',
      },
      background: {
        default: isLight ? '#f4f5f7' : '#0a0a0a',
        paper: isLight ? '#ffffff' : '#111111',
      },
      text: {
        primary: isLight ? '#111827' : '#ffffff',
        secondary: isLight ? '#6b7280' : '#a0a0a0',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 800,
        fontSize: '2rem',
        color: isLight ? '#111827' : '#ffffff',
      },
      body1: {
        color: isLight ? '#6b7280' : '#a0a0a0',
      },
      body2: {
        color: isLight ? '#6b7280' : '#a0a0a0',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          html {
            color-scheme: ${isLight ? 'light' : 'dark'};
            background-color: ${isLight ? '#f4f5f7' : '#0a0a0a'};
          }
          body {
            background-color: ${isLight ? '#f4f5f7' : '#0a0a0a'};
            color: ${isLight ? '#111827' : '#ffffff'};
            transition: background-color 0.3s ease, color 0.3s ease;
          }
        `,
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              // Light mode gets white bg, dark mode gets dark bg
              backgroundColor: isLight ? '#ffffff' : '#1a1a1a', 
              borderRadius: 12,
              color: isLight ? '#000000' : '#ffffff',
              '& fieldset': {
                borderColor: isLight ? '#e5e7eb' : '#333333',
              },
              '&:hover fieldset': {
                borderColor: PRIMARY_PURPLE,
              },
              '&.Mui-focused fieldset': {
                borderColor: PRIMARY_PURPLE,
              },
              '& input': {
                color: isLight ? '#000000' : '#ffffff',
                '&::placeholder': {
                  color: isLight ? '#9ca3af' : '#666666',
                  opacity: 1,
                },
              },
              '& input[type="password"]': {
                color: isLight ? '#000000' : '#ffffff',
              },
            },
            '& .MuiInputLabel-root': {
              color: isLight ? '#4b5563' : '#a0a0a0',
              fontWeight: 500,
              fontSize: '0.95rem',
              '&.Mui-focused': {
                color: PRIMARY_PURPLE,
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            padding: '12px 24px',
          },
          contained: {
            backgroundColor: PRIMARY_PURPLE,
            color: '#ffffff',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#6a33a0',
              boxShadow: 'none',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: isLight ? '#111827' : '#ffffff',
            textDecoration: 'underline',
            cursor: 'pointer',
            '&:hover': {
              color: PRIMARY_PURPLE,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? '#f3f4f6' : '#1a1a1a',
            border: isLight ? '1px solid #e5e7eb' : '1px solid #2a2a2a',
            borderRadius: '50%',
            width: 48,
            height: 48,
            color: isLight ? '#4b5563' : '#ffffff',
            '&:hover': {
              backgroundColor: isLight ? '#e5e7eb' : '#2a2a2a',
            },
          },
        },
      },
    },
  });
};