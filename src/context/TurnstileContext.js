import React, { createContext, useContext, useState, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { CF_TURNSTILE_SITE_KEY } from '../config/constants';

const TurnstileContext = createContext({ cfToken: null });

export const useCFToken = () => useContext(TurnstileContext).cfToken;

export const TurnstileProvider = ({ children }) => {
  const [cfToken, setCfToken] = useState(null);
  const widgetRef = useRef(null);

  const handleSuccess = (token) => setCfToken(token);
  const handleError   = ()      => setCfToken(null);
  const handleExpire  = ()      => {
    setCfToken(null);
    // Attempt an automatic re-execution when the token expires
    widgetRef.current?.reset();
  };

  return (
    <TurnstileContext.Provider value={{ cfToken }}>
      {children}
      {/* Invisible Turnstile – runs silently in the background */}
      <Turnstile
        ref={widgetRef}
        siteKey={CF_TURNSTILE_SITE_KEY}
        options={{ size: 'invisible', appearance: 'interaction-only', execution: 'render' }}
        onSuccess={handleSuccess}
        onError={handleError}
        onExpire={handleExpire}
        style={{ display: 'none', position: 'fixed', bottom: 0, right: 0, zIndex: -1 }}
      />
    </TurnstileContext.Provider>
  );
};
