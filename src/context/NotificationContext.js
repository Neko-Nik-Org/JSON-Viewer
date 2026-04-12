import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * Simple notification system to replace window.alert() everywhere in the app.
 * Usage:
 *   const { notify } = useNotification();
 *   notify('Something went wrong', 'error');
 *   notify('Copied!', 'success');
 */

const NotificationContext = createContext({ notify: () => {} });

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [queue, setQueue]     = useState([]);
  const [current, setCurrent] = useState(null);
  const [open, setOpen]       = useState(false);

  const notify = useCallback((message, severity = 'info') => {
    setQueue(prev => [...prev, { message, severity, key: Date.now() }]);
  }, []);

  // Pop next from queue whenever a Snackbar closes
  React.useEffect(() => {
    if (!open && queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrent(next);
      setQueue(rest);
      setOpen(true);
    }
  }, [open, queue]);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={current?.severity ?? 'info'}
          variant="filled"
          sx={{ minWidth: 260 }}
        >
          {current?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
