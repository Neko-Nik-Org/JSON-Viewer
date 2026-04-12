import React from 'react';
import { Box, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon       from '@mui/icons-material/ErrorOutline';
import { isValidJSON } from '../../Functions/JsonBased';

// Height of everything above this component: sticky header (56px) + toolbar (49px)
const ABOVE_PX = 105;

const InputTextArea = ({ jsonData, setJsonData }) => {
  const theme  = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const isEmpty = !jsonData.trim();
  const isValid = !isEmpty && isValidJSON(jsonData);

  // Validity-driven border colour
  const borderColor = isEmpty
    ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)')
    : isValid
      ? (isDark ? '#4ade80' : '#16a34a')
      : (isDark ? '#f87171' : '#dc2626');

  return (
    <Box
      sx={{
        display:       'flex',
        flexDirection: 'column',
        height:        `calc(100vh - ${ABOVE_PX}px)`,
        border:        `1.5px solid ${borderColor}`,
        transition:    'border-color 0.25s ease',
        overflow:      'hidden',
      }}
    >
      {/* ── Status strip (only when content is present) ─────────────────── */}
      {!isEmpty && (
        <Box
          sx={{
            flexShrink:  0,
            display:     'flex',
            alignItems:  'center',
            justifyContent: 'flex-end',
            px:          2,
            py:          0.6,
            bgcolor:     isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)',
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <Chip
            icon={isValid
              ? <CheckCircleOutlineIcon fontSize="small" />
              : <ErrorOutlineIcon       fontSize="small" />
            }
            label={isValid ? 'Valid JSON' : 'Invalid JSON'}
            size="small"
            color={isValid ? 'success' : 'error'}
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.78rem' }}
          />
        </Box>
      )}

      {/* ── Editor textarea ────────────────────────────────────────────── */}
      <textarea
        style={{
          flex:            '1 1 0',
          minHeight:        0,
          width:           '100%',
          boxSizing:       'border-box',
          padding:         '20px 24px',
          backgroundColor: isDark ? '#0f1117' : '#ffffff',
          color:           isDark ? '#e2e8f0' : '#1e293b',
          caretColor:      isDark ? '#7c8cf8' : '#4f46e5',
          fontSize:        '16px',
          lineHeight:      1.75,
          fontFamily:      '"JetBrains Mono","Fira Code","Cascadia Code",Consolas,monospace',
          resize:          'none',
          whiteSpace:      'pre',
          overflowX:       'auto',
          overflowY:       'auto',
          border:          'none',
          outline:         'none',
          // Custom scrollbar
          scrollbarWidth:  'thin',
          scrollbarColor:  isDark
            ? 'rgba(255,255,255,0.2) transparent'
            : 'rgba(0,0,0,0.2) transparent',
        }}
        placeholder="Paste your JSON here…"
        autoFocus
        spellCheck={false}
        onChange={(e) => setJsonData(e.target.value)}
        value={jsonData}
      />
    </Box>
  );
};

export default InputTextArea;

