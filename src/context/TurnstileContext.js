import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import {
  Dialog, DialogContent, DialogActions,
  Button, Typography, Box, CircularProgress, Fade,
} from '@mui/material';
import ShieldIcon       from '@mui/icons-material/Shield';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
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
  // 'idle' | 'ready' | 'success' | 'error'
  const [widgetState, setWidgetState] = useState('idle');
  const resolveRef     = useRef(null);
  const interactiveRef = useRef(null);

  const requestToken = useCallback(
    () =>
      new Promise((resolve) => {
        resolveRef.current = resolve;
        setWidgetState('idle');
        setDialogOpen(true);
      }),
    []
  );

  const onChallengeSuccess = (token) => {
    setWidgetState('success');
    setTimeout(() => {
      setDialogOpen(false);
      setWidgetState('idle');
      resolveRef.current?.(token);
      resolveRef.current = null;
    }, 350);
  };

  const onChallengeError = () => {
    setWidgetState('error');
    setTimeout(() => {
      setWidgetState('idle');
      interactiveRef.current?.reset();
    }, 1200);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setWidgetState('idle');
    resolveRef.current?.(null);
    resolveRef.current = null;
  };

  const stateLabel = {
    idle:    'Initialising…',
    ready:   'Complete the check below to continue.',
    success: 'Verified! Continuing…',
    error:   'Verification failed — retrying…',
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
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.28)',
          },
        }}
      >
        {/* ── Gradient header ─────────────────────────────────────────── */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            px: 3, pt: 3.5, pb: 3,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 60, height: 60, borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.25)',
            }}
          >
            {widgetState === 'success'
              ? <VerifiedUserIcon sx={{ fontSize: 32, color: '#4ade80' }} />
              : <ShieldIcon       sx={{ fontSize: 32, color: '#fff'    }} />
            }
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>
              Security Check
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', display: 'block', mt: 0.3 }}>
              Powered by Cloudflare Turnstile
            </Typography>
          </Box>
        </Box>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <DialogContent sx={{ px: 3, pt: 2.5, pb: 1, textAlign: 'center' }}>
          <Typography
            variant="body2"
            color={widgetState === 'error' ? 'error' : 'text.secondary'}
            sx={{ mb: 2.5, fontWeight: widgetState === 'error' ? 600 : 400 }}
          >
            {stateLabel[widgetState]}
          </Typography>

          <Box
            sx={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              minHeight: 80, position: 'relative',
            }}
          >
            {widgetState === 'idle' && (
              <CircularProgress size={32} sx={{ position: 'absolute', color: 'primary.main' }} />
            )}
            <Turnstile
              ref={interactiveRef}
              siteKey={CF_TURNSTILE_SITE_KEY}
              options={{ size: 'normal', appearance: 'always', execution: 'render' }}
              onBeforeInteractive={() => setWidgetState('ready')}
              onSuccess={onChallengeSuccess}
              onError={onChallengeError}
              onExpire={() => { setWidgetState('idle'); interactiveRef.current?.reset(); }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 1 }}>
          <Button
            onClick={handleCancel}
            variant="outlined"
            color="inherit"
            size="small"
            sx={{ px: 4, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </TurnstileContext.Provider>
  );
};
