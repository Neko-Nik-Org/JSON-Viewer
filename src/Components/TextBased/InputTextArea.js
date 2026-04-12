import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon       from '@mui/icons-material/Error';
import { isValidJSON } from '../../Functions/JsonBased';

// Height of sticky header (56px) + toolbar (49px)
const ABOVE_PX = 105;

const InputTextArea = ({ jsonData, setJsonData }) => {
  const theme  = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const isEmpty = !jsonData.trim();
  const isValid = !isEmpty && isValidJSON(jsonData);

  // Accent colour for left-border stripe + status footer
  const accentColor = isEmpty
    ? 'transparent'
    : isValid
      ? (isDark ? '#4ade80' : '#16a34a')
      : (isDark ? '#f87171' : '#dc2626');

  // Very faint tinted background for the status bar
  const statusBg = isEmpty
    ? 'transparent'
    : isValid
      ? (isDark ? 'rgba(74,222,128,0.07)'  : 'rgba(22,163,74,0.06)')
      : (isDark ? 'rgba(248,113,113,0.09)' : 'rgba(220,38,38,0.06)');

  // Left padding shared by both the textarea text and the status footer label,
  // so the text and the indicator are perfectly flush on the left
  const TEXT_PL = '28px';

  return (
    <Box
      sx={{
        display:       'flex',
        flexDirection: 'column',
        height:        `calc(100vh - ${ABOVE_PX}px)`,
        borderLeft:    `4px solid ${accentColor}`,
        transition:    'border-left-color 0.25s ease',
        bgcolor:       isDark ? '#0f1117' : '#ffffff',
        overflow:      'hidden',
      }}
    >
      {/* ── Scrollable editor area ───────────────────────────────────────── */}
      <textarea
        style={{
          flex:            '1 1 0',
          minHeight:        0,
          width:           '100%',
          boxSizing:       'border-box',
          // Left padding accounts for the 4px accent border visually
          paddingTop:      '22px',
          paddingBottom:   '14px',
          paddingLeft:     TEXT_PL,
          paddingRight:    '28px',
          backgroundColor: 'transparent',
          color:           isDark ? '#e2e8f0' : '#1e293b',
          caretColor:      isDark ? '#7c8cf8' : '#4f46e5',
          fontSize:        '16px',
          lineHeight:      1.8,
          fontFamily:      '"JetBrains Mono","Fira Code","Cascadia Code",Consolas,monospace',
          resize:          'none',
          whiteSpace:      'pre',
          overflowX:       'auto',
          overflowY:       'auto',
          border:          'none',
          outline:         'none',
          scrollbarWidth:  'thin',
          scrollbarColor:  isDark
            ? 'rgba(255,255,255,0.18) transparent'
            : 'rgba(0,0,0,0.18) transparent',
        }}
        placeholder="Paste your JSON here…"
        autoFocus
        spellCheck={false}
        onChange={(e) => setJsonData(e.target.value)}
        value={jsonData}
      />

      {/* ── Status footer (visible only when editor has content) ─────────── */}
      {!isEmpty && (
        <Box
          sx={{
            flexShrink: 0,
            display:    'flex',
            alignItems: 'center',
            gap:        '6px',
            pl:         TEXT_PL,
            pr:         '28px',
            py:         '8px',
            bgcolor:    statusBg,
            borderTop:  `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
            transition: 'background-color 0.25s ease',
          }}
        >
          {isValid
            ? <CheckCircleIcon sx={{ fontSize: 14, color: accentColor, flexShrink: 0, transition: 'color 0.25s' }} />
            : <ErrorIcon       sx={{ fontSize: 14, color: accentColor, flexShrink: 0, transition: 'color 0.25s' }} />
          }
          <Typography
            component="span"
            sx={{
              color:         accentColor,
              fontWeight:    600,
              fontSize:      '0.74rem',
              lineHeight:    1,
              letterSpacing: '0.03em',
              fontFamily:    '"Inter","Segoe UI",system-ui,sans-serif',
              transition:    'color 0.25s ease',
            }}
          >
            {isValid ? 'Valid JSON' : 'Invalid JSON'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default InputTextArea;

