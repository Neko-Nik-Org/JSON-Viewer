import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, IconButton, Tooltip, Divider, Stack,
} from '@mui/material';
import ContentCopyIcon  from '@mui/icons-material/ContentCopy';
import OpenInNewIcon    from '@mui/icons-material/OpenInNew';
import CheckCircleIcon  from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useTheme }     from '@mui/material/styles';
import { format }       from 'date-fns';

import { useNotification } from '../context/NotificationContext';


const fmtDate = (ts) => {
  try { return format(new Date(ts), "dd MMM yyyy, hh:mm a 'UTC'"); }
  catch { return ts || '—'; }
};


const ShareDialog = ({ open, onClose, shareResult, shareError }) => {
  const theme      = useTheme();
  const isDark     = theme.palette.mode === 'dark';
  const { notify } = useNotification();
  const [copied, setCopied] = useState(false);

  // Path-based share URL: origin/{id}  (e.g. https://jsonviewer.nekonik.com/abc123)
  const shareUrl = shareResult?.id
    ? `${window.location.origin}/${shareResult.id}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      notify('Link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        {shareError
          ? <><ErrorOutlineIcon color="error" /> Error Sharing JSON</>
          : <><CheckCircleIcon  color="success" /> JSON Shared Successfully</>
        }
      </DialogTitle>

      <DialogContent dividers>
        {shareError ? (
          <Typography color="error" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorOutlineIcon fontSize="small" /> {shareError}
          </Typography>
        ) : (
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Use the link below to share this JSON with anyone.
            </Typography>

            <Box
              sx={{
                display:     'flex',
                alignItems:  'center',
                gap:         1,
                p:           1.5,
                borderRadius: 2,
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border:  `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                cursor:  'pointer',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
                },
              }}
              onClick={handleCopy}
            >
              <Typography
                variant="body2"
                sx={{
                  flex: 1, wordBreak: 'break-all',
                  fontFamily: 'monospace', color: 'text.primary', fontSize: '0.82rem',
                }}
              >
                {shareUrl}
              </Typography>

              <Tooltip title={copied ? 'Copied!' : 'Copy link'}>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleCopy(); }}>
                  {copied
                    ? <CheckCircleIcon fontSize="small" color="success" />
                    : <ContentCopyIcon fontSize="small" />
                  }
                </IconButton>
              </Tooltip>

              <Tooltip title="Open in new tab">
                <IconButton
                  size="small"
                  component="a"
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Divider />

            <Stack direction="row" spacing={4}>
              <Box>
                <Typography variant="caption" color="text.disabled" display="block">Created</Typography>
                <Typography variant="body2">{fmtDate(shareResult?.created_at)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.disabled" display="block">Expires</Typography>
                <Typography variant="body2">{fmtDate(shareResult?.expires_at)}</Typography>
              </Box>
            </Stack>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose} variant="contained" disableElevation>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
