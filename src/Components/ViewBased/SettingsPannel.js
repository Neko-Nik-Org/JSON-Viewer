import React, { useState } from 'react';
import { Box, Button, ButtonGroup, CircularProgress, Chip, Tooltip } from '@mui/material';
import ShareIcon       from '@mui/icons-material/Share';
import DownloadIcon    from '@mui/icons-material/Download';
import EditIcon        from '@mui/icons-material/Edit';
import EditOffIcon     from '@mui/icons-material/EditOff';
import DataObjectIcon  from '@mui/icons-material/DataObject';
import NumbersIcon     from '@mui/icons-material/Numbers';
import json5 from 'json5';

import ShareDialog         from '../ShareDialog';
import { postJsonData }    from '../../Functions/ApiService';
import { useTurnstile }    from '../../context/TurnstileContext';
import { useNotification } from '../../context/NotificationContext';
import { DOWNLOAD_FILENAME } from '../../config/constants';


const ToggleChip = ({ label, icon, activeIcon, active, onToggle, activeColor = 'primary' }) => (
  <Tooltip title={`${active ? 'Hide' : 'Show'} ${label}`}>
    <Chip
      icon={active ? activeIcon : icon}
      label={label}
      size="small"
      onClick={onToggle}
      variant={active ? 'filled' : 'outlined'}
      color={active ? activeColor : 'default'}
      sx={{ fontWeight: 600, cursor: 'pointer', fontSize: '0.75rem' }}
    />
  </Tooltip>
);


const SettingsPannel = ({
  displayDataTypes,  setDisplayDataTypes,
  displayObjectSize, setDisplayObjectSize,
  enableEditing,     setEnableEditing,
  modJSON,
}) => {
  const { requestToken } = useTurnstile();
  const { notify } = useNotification();

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareResult,     setShareResult]     = useState(null);
  const [shareError,      setShareError]      = useState(null);
  const [sharing,         setSharing]         = useState(false);

  const handleDownload = () => {
    try {
      const pretty   = JSON.stringify(json5.parse(modJSON), null, 2);
      const blob     = new Blob([pretty], { type: 'application/json' });
      const url      = URL.createObjectURL(blob);
      const anchor   = document.createElement('a');
      anchor.href    = url;
      anchor.download = DOWNLOAD_FILENAME;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      notify('JSON downloaded successfully.', 'success');
    } catch {
      notify('Download failed – JSON is invalid.', 'error');
    }
  };

  const handleShare = async () => {
    // Trigger interactive Turnstile challenge before the API call
    const token = await requestToken();
    if (!token) return; // user cancelled challenge

    setSharing(true);
    try {
      const parsed = json5.parse(modJSON);
      const result = await postJsonData(parsed, token);
      setShareResult(result);
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
        gap: 1.5,
        flexWrap: 'wrap',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {/* View toggles */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <ToggleChip
          label="Data Types"
          icon={<DataObjectIcon />}
          activeIcon={<DataObjectIcon />}
          active={displayDataTypes}
          onToggle={() => setDisplayDataTypes(v => !v)}
        />
        <ToggleChip
          label="Object Size"
          icon={<NumbersIcon />}
          activeIcon={<NumbersIcon />}
          active={displayObjectSize}
          onToggle={() => setDisplayObjectSize(v => !v)}
        />
        <ToggleChip
          label="Edit Mode"
          icon={<EditOffIcon />}
          activeIcon={<EditIcon />}
          active={enableEditing}
          onToggle={() => setEnableEditing(v => !v)}
          activeColor="warning"
        />
      </Box>

      {/* Action buttons */}
      <ButtonGroup variant="outlined" size="small">
        <Tooltip title="Download as .json file">
          <Button onClick={handleDownload} startIcon={<DownloadIcon />}>Download</Button>
        </Tooltip>
        <Tooltip title="Share this JSON">
          <Button
            onClick={handleShare}
            disabled={sharing}
            startIcon={sharing ? <CircularProgress size={14} color="inherit" /> : <ShareIcon />}
          >
            {sharing ? 'Sharing…' : 'Share'}
          </Button>
        </Tooltip>
      </ButtonGroup>

      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        shareResult={shareResult}
        shareError={shareError}
      />
    </Box>
  );
};

export default SettingsPannel;
