import React, { createContext, useContext, useState, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, CircularProgress,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { Turnstile } from '@marsidev/react-turnstile';
import { CF_TURNSTILE_SITE_KEY } from '../config/constants';

const TurnstileContext = createContext({
  cfToken:      null,
  requestToken: () => Promise.resolve(null),
});

/** Use this to get the background passive token */
export const useCFToken = () => useContext(TurnstileContext).cfToken;

/** Use this hook in components that need Turnstile */
export const useTurnstile = () => useContext(TurnstileContext);

export const TurnstileProvider = ({ children }) => {
  // ── Background (invisible) token ─────────────────────────────────────────
  const [cfToken, setCfToken] = useState(null);
  const bgRef = useRef(null);

  const onBgSuccess = (t) => setCfToken(t);
  const onBgError   = ()  => setCfToken(null);
  const onBgExpire  = ()  => { setCfToken(null); bgRef.current?.reset(); };

  // ── Interactive challenge dialog ──────────────────────────────────────────
  const [dialogOpen,  setDialogOpen]  = useState(false);
  const [challenged,  setChallenged]  = useState(false); // true once widget loads
  const resolveRef = useRef(null);
  const interactiveRef = useRef(null);

  /**
   * Opens the Turnstile challenge dialog.
   * Returns a Promise<string|null> – resolves with the token on success,
   * or null if the user cancels.
   */
  const requestToken = () =>
    new Promise((resolve) => {
      resolveRef.current = resolve;
      setChallenged(false);
      setDialogOpen(true);
    });

  const onChallengeSuccess = (token) => {
    setDialogOpen(false);
    setChallenged(false);
    resolveRef.current?.(token);
    resolveRef.current = null;
  };

  const onChallengeError = () => {
    setChallenged(false);
    interactiveRef.current?.reset();
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setChallenged(false);
    resolveRef.current?.(null);
    resolveRef.current = null;
  };

  return (
    <TurnstileContext.Provider value={{ cfToken, requestToken }}>
      {children}

      {/* ── Background invisible widget ─────────────────────────────────── */}
      <Turnstile
        ref={bgRef}
        siteKey={CF_TURNSTILE_SITE_KEY}
        options={{ size: 'invisible', appearance: 'interaction-only', execution: 'render' }}
        onSuccess={onBgSuccess}
        onError={onBgError}
        onExpire={onBgExpire}
        style={{ display: 'none', position: 'fixed', zIndex: -1 }}
      />

      {/* ── Interactive challenge dialog ────────────────────────────────── */}
      <Dialog
        open={dialogOpen}
        onClose={handleCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
          <SecurityIcon color="primary" />
          Security Check
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please complete the quick verification below to continue.
          </Typography>

          <Box
            sx={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              minHeight:      72,
              justifyContent: 'center',
            }}
          >
            {!challenged && (
              <CircularProgress size={28} sx={{ mb: 1 }} />
            )}
            <Turnstile
              ref={interactiveRef}
              siteKey={CF_TURNSTILE_SITE_KEY}
              options={{ size: 'normal', appearance: 'always', execution: 'render' }}
              onBeforeInteractive={() => setChallenged(true)}
              onSuccess={onChallengeSuccess}
              onError={onChallengeError}
              onExpire={() => { setChallenged(false); interactiveRef.current?.reset(); }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancel} color="inherit">Cancel</Button>
        </DialogActions>
      </Dialog>
    </TurnstileContext.Provider>
  );
};
