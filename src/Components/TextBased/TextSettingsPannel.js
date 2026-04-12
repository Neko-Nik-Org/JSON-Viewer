import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup, CircularProgress, Tooltip } from '@mui/material';
import CompressIcon       from '@mui/icons-material/Compress';
import AutoFixHighIcon    from '@mui/icons-material/AutoFixHigh';
import FolderOpenIcon     from '@mui/icons-material/FolderOpen';
import DeleteOutlineIcon  from '@mui/icons-material/DeleteOutline';
import ShareIcon          from '@mui/icons-material/Share';

import { minifyJSON, beautifyJSON, clearData } from '../../Functions/JsonBased';
import { postJsonData, getSharedJson }          from '../../Functions/ApiService';
import { useCFToken }                           from '../../context/TurnstileContext';
import { useNotification }                       from '../../context/NotificationContext';
import ShareDialog                              from '../ShareDialog';


const TextSettingsPanel = ({ jsonData, setJsonData }) => {
  const cfToken = useCFToken();
  const { notify } = useNotification();

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareResult,     setShareResult]     = useState(null);
  const [shareError,      setShareError]      = useState(null);
  const [sharing,         setSharing]         = useState(false);

  // ── Load from share URL on mount ──────────────────────────────────────────
  useEffect(() => {
    const shareId = new URLSearchParams(window.location.search).get('share');
    if (!shareId) return;

    setJsonData('// Loading shared JSON…');
    getSharedJson(shareId, cfToken)
      .then(data => setJsonData(JSON.stringify(data.data.content, null, 2)))
      .catch(() => {
        setJsonData('');
        notify('Failed to load shared JSON. The link may have expired.', 'error');
      });
    // cfToken intentionally excluded – run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Toolbar actions ───────────────────────────────────────────────────────
  const handleMinify = () => {
    try   { setJsonData(minifyJSON(jsonData)); }
    catch { notify('Cannot minify – JSON is not valid.', 'error'); }
  };

  const handleBeautify = () => {
    try   { setJsonData(beautifyJSON(jsonData)); }
    catch { notify('Cannot beautify – JSON is not valid.', 'error'); }
  };

  const handleClear = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('share');
    window.history.replaceState({}, '', url.toString());
    clearData(setJsonData);
    setShareResult(null);
    setShareError(null);
    notify('Editor cleared.', 'info');
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type   = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file   = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setJsonData(ev.target.result);
        notify(`Loaded: ${file.name}`, 'success');
      };
      reader.readAsText(file, 'UTF-8');
    };
    input.click();
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const parsed = JSON.parse(jsonData);
      const result = await postJsonData(parsed, cfToken);
      setShareResult(result.data);
      setShareError(null);
    } catch (err) {
      setShareResult(null);
      setShareError(err.response?.data?.message || err.message || 'Sharing failed. Please try again.');
    } finally {
      setSharing(false);
      setShareDialogOpen(true);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        px: { xs: 1.5, sm: 2 },
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <ButtonGroup variant="outlined" size="small">
        <Tooltip title="Minify JSON">
          <Button onClick={handleMinify} startIcon={<CompressIcon />}>Minify</Button>
        </Tooltip>
        <Tooltip title="Beautify / Format JSON">
          <Button onClick={handleBeautify} startIcon={<AutoFixHighIcon />}>Beautify</Button>
        </Tooltip>
        <Tooltip title="Load from file">
          <Button onClick={handleLoad} startIcon={<FolderOpenIcon />}>Load</Button>
        </Tooltip>
        <Tooltip title="Clear editor">
          <Button onClick={handleClear} startIcon={<DeleteOutlineIcon />} color="error">Clear</Button>
        </Tooltip>
      </ButtonGroup>

      <Tooltip title="Share this JSON">
        <span>
          <Button
            variant="contained"
            size="small"
            onClick={handleShare}
            disabled={sharing || !jsonData.trim()}
            startIcon={sharing ? <CircularProgress size={14} color="inherit" /> : <ShareIcon />}
            sx={{ fontWeight: 600 }}
          >
            {sharing ? 'Sharing…' : 'Share'}
          </Button>
        </span>
      </Tooltip>

      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        shareResult={shareResult}
        shareError={shareError}
      />
    </Box>
  );
};

export default TextSettingsPanel;

