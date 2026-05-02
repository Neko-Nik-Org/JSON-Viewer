import React from 'react';
import ReactDOM from 'react-dom/client';
import formbricks from '@formbricks/js';
import Main from './Pages/MainPage/Main';

// ─── Formbricks Init ──────────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  formbricks.setup({
    environmentId: 'cmonwihov000cn401sofnoh4e',
    appUrl: 'https://survey.nekonik.com',
  }).then(() => {
    formbricks.registerRouteChange();
  }).catch(() => {});
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
