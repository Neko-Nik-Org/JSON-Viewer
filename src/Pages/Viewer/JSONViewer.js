import React from 'react';
import { Box, Alert } from '@mui/material';
import ReactJson from '@microlink/react-json-view';
import { isValidJSON } from '../../Functions/JsonBased';
import SettingsPannel from '../../Components/ViewBased/SettingsPannel';
import json5 from 'json5';
import { useTheme } from '@mui/material/styles';

const JSONViewer = ({ modJSON, setModJSON }) => {
  const [displayDataTypes,  setDisplayDataTypes]  = React.useState(false);
  const [displayObjectSize, setDisplayObjectSize] = React.useState(true);
  const [enableEditing,     setEnableEditing]     = React.useState(false);

  const theme  = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const valid  = isValidJSON(modJSON);

  return (
    <Box sx={{ width: '100%' }}>
      <SettingsPannel
        displayDataTypes={displayDataTypes}   setDisplayDataTypes={setDisplayDataTypes}
        displayObjectSize={displayObjectSize} setDisplayObjectSize={setDisplayObjectSize}
        enableEditing={enableEditing}         setEnableEditing={setEnableEditing}
        modJSON={modJSON}
      />

      <Box sx={{ p: { xs: 1.5, sm: 2.5 }, overflowX: 'auto' }}>
        {!modJSON.trim() ? (
          <Alert severity="info" variant="outlined" sx={{ maxWidth: 480 }}>
            Switch to the <strong>Text</strong> tab, paste your JSON, then come back here.
          </Alert>
        ) : !valid ? (
          <Alert severity="error" variant="outlined" sx={{ maxWidth: 480 }}>
            The pasted content is not valid JSON. Fix it in the <strong>Text</strong> tab first.
          </Alert>
        ) : (
          <ReactJson
            style={{ fontSize: '14px', lineHeight: 1.6, fontFamily: '"JetBrains Mono", monospace' }}
            quotesOnKeys={false}
            src={json5.parse(modJSON)}
            indentWidth={4}
            collapsed={2}
            name={false}
            displayDataTypes={displayDataTypes}
            displayObjectSize={displayObjectSize}
            onEdit={enableEditing ? (e) => setModJSON(JSON.stringify(e.updated_src, null, 2)) : false}
            onAdd={enableEditing  ? (e) => setModJSON(JSON.stringify(e.updated_src, null, 2)) : false}
            onDelete={enableEditing ? (e) => setModJSON(JSON.stringify(e.updated_src, null, 2)) : false}
            theme={isDark ? 'colors' : 'rjv-default'}
          />
        )}
      </Box>
    </Box>
  );
};

export default JSONViewer;
