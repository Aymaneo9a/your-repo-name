const KEYS = {
  TICKETS: 'bsc_tickets',
  KPI: 'bsc_kpi',
  INTEL: 'bsc_intel',
  SETTINGS: 'bsc_settings',
  KB: 'bsc_kb',
};

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(KEYS[key]);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export function save(key, value) {
  try { localStorage.setItem(KEYS[key], JSON.stringify(value)); }
  catch (e) { console.error('Storage error', e); }
}

export function clearAll() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}
