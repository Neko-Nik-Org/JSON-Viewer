// ─── API ─────────────────────────────────────────────────────────────────────
export const API_BASE_URL = 'https://api.nekonik.com/neko-nik/json-share';
export const API_KEY = 'TMDRHRQSyWuRi0A0g40gS';

// ─── Cloudflare Turnstile ─────────────────────────────────────────────────────
// Set REACT_APP_CF_TURNSTILE_SITE_KEY in your .env file.
// Use '1x00000000000000000000AA' (always-passes dummy) for local development.
export const CF_TURNSTILE_SITE_KEY = '0x4AAAAAAC8XWNeUpN0H3YZP';
  // process.env.REACT_APP_CF_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

// ─── App Metadata ─────────────────────────────────────────────────────────────
export const APP_NAME = 'JSON Viewer';
export const APP_VERSION = '1.0.0';
export const ABOUT_URL = 'https://www.nekonik.com/about';
export const SHARE_BASE_URL = 'https://jsonviewer.nekonik.com';

// ─── Download ─────────────────────────────────────────────────────────────────
export const DOWNLOAD_FILENAME = 'NekoNik-modified.json';
