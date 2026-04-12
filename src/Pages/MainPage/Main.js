import React from 'react';
import {
  Box, Tab, Tabs, IconButton, Tooltip,
  ThemeProvider, createTheme, CssBaseline,
  Typography, useMediaQuery,
} from '@mui/material';
import { Brightness4, Brightness7, DataObject } from '@mui/icons-material';

import JSONViewer from '../Viewer/JSONViewer';
import Text from '../TextPaste/Text';
import { TurnstileProvider, useTurnstile } from '../../context/TurnstileContext';
import { NotificationProvider, useNotification } from '../../context/NotificationContext';
import { getSharedJson } from '../../Functions/ApiService';
import { ABOUT_URL } from '../../config/constants';

// ─── Theme Factory ────────────────────────────────────────────────────────────
const buildTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary:   { main: mode === 'dark' ? '#7c8cf8' : '#4f46e5' },
      secondary: { main: mode === 'dark' ? '#f472b6' : '#db2777' },
      background: {
        default: mode === 'dark' ? '#0f1117' : '#f8fafc',
        paper:   mode === 'dark' ? '#1a1d27' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, letterSpacing: 0.3 },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, minWidth: 80 },
        },
      },
      MuiButtonGroup: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
    },
  });

// ─── Component ────────────────────────────────────────────────────────────────
const MainContent = () => {
  const [jsonData, setJsonData] = React.useState('');
  const [tab, setTab]           = React.useState('Text');
  const [mode, setMode]         = React.useState(
    () => localStorage.getItem('theme') || 'light'
  );

  const theme      = React.useMemo(() => buildTheme(mode), [mode]);
  const isDark     = mode === 'dark';
  const isSmall    = useMediaQuery(theme.breakpoints.down('sm'));
  const { requestToken } = useTurnstile();
  const { notify }       = useNotification();

  React.useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  // ── Load from share URL once on app mount (path-based: /{id}) ────────────
  React.useEffect(() => {
    const pathId = window.location.pathname.slice(1);
    if (!pathId) return;

    requestToken().then((token) => {
      if (!token) {
        notify('Verification cancelled – shared JSON not loaded.', 'warning');
        return;
      }
      setJsonData('// Loading shared JSON…');
      getSharedJson(pathId, token)
        .then(data => setJsonData(JSON.stringify(data.data.content, null, 2)))
        .catch(() => {
          setJsonData('');
          notify('Failed to load shared JSON. The link may have expired.', 'error');
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));

  const handleTabChange = (_event, newTab) => {
    if (newTab === 'About') {
      window.open(ABOUT_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    setTab(newTab);
  };

  const headerBg = isDark
    ? 'linear-gradient(135deg, #1a1d27 0%, #14171f 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          background: headerBg,
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          backdropFilter: 'blur(12px)',
          px: { xs: 1.5, sm: 3 },
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <DataObject sx={{ fontSize: 28, color: 'primary.main' }} />
          {!isSmall && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: 'text.primary',
                lineHeight: 1,
              }}
            >
              JSON Viewer
            </Typography>
          )}
        </Box>

        {/* Navigation */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="main navigation"
          sx={{ flex: 1, justifyContent: 'center' }}
        >
          <Tab value="Text"   label="Text"   />
          <Tab value="Visual" label="Visual" />
          <Tab value="About"  label="About"  />
        </Tabs>

        {/* Theme toggle */}
        <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton
            onClick={toggleTheme}
            size="small"
            sx={{
              flexShrink: 0,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
              borderRadius: 2,
              px: 1.5,
              gap: 0.75,
              color: 'text.primary',
              '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
            }}
          >
            {isDark ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
            {!isSmall && (
              <Typography variant="caption" fontWeight={600}>
                {isDark ? 'Light' : 'Dark'}
              </Typography>
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Page content ────────────────────────────────────────────────── */}
      <Box component="main" sx={{ width: '100%' }}>
        {tab === 'Text'   && <Text       jsonData={jsonData} setJsonData={setJsonData} />}
        {tab === 'Visual' && <JSONViewer modJSON={jsonData}  setModJSON={setJsonData}  />}
      </Box>
    </ThemeProvider>
  );
};

// Wrap with providers so all children can access Turnstile token + notifications
const Main = () => (
  <NotificationProvider>
    <TurnstileProvider>
      <MainContent />
    </TurnstileProvider>
  </NotificationProvider>
);

export default Main;

