import React, { useEffect, useRef } from 'react';
import { Box, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { isValidJSON } from '../../Functions/JsonBased';

// Approximate height taken by everything above the textarea
const HEADER_HEIGHT = 104; // header bar (56) + toolbar (48)

const InputTextArea = ({ jsonData, setJsonData }) => {
  const textareaRef = useRef(null);
  const theme       = useTheme();
  const isDark      = theme.palette.mode === 'dark';

  const isEmpty = !jsonData.trim();
  const isValid = !isEmpty && isValidJSON(jsonData);

  // ── Dynamic height ─────────────────────────────────────────────────────────
  useEffect(() => {
    const resize = () => {
      if (!textareaRef.current) return;
      textareaRef.current.style.height = `${window.innerHeight - HEADER_HEIGHT}px`;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // ── Border colour driven by validity ──────────────────────────────────────
  const borderColor = isEmpty
    ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)')
    : isValid
      ? (isDark ? '#4ade80' : '#16a34a')
      : (isDark ? '#f87171' : '#dc2626');

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Validity badge */}
      {!isEmpty && (
        <Box sx={{ position: 'absolute', top: 10, right: 16, zIndex: 10 }}>
          <Chip
            icon={isValid ? <CheckCircleOutlineIcon fontSize="small" /> : <ErrorOutlineIcon fontSize="small" />}
            label={isValid ? 'Valid JSON' : 'Invalid JSON'}
            size="small"
            color={isValid ? 'success' : 'error'}
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.72rem', backdropFilter: 'blur(6px)' }}
          />
        </Box>
      )}

      <textarea
        ref={textareaRef}
        style={{
          display:         'block',
          width:           '100%',
          boxSizing:       'border-box',
          padding:         '14px 16px',
          backgroundColor: isDark ? '#0f1117' : '#ffffff',
          color:           isDark ? '#e2e8f0' : '#1e293b',
          caretColor:      isDark ? '#7c8cf8' : '#4f46e5',
          fontSize:        '14px',
          lineHeight:      1.7,
          fontFamily:      '"JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, monospace',
          resize:          'none',
          whiteSpace:      'pre',
          overflowX:       'auto',
          border:          `1.5px solid ${borderColor}`,
          outline:         'none',
          transition:      'border-color 0.2s ease',
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

