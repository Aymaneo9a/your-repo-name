*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy: #0d1b2a;
  --navy-mid: #112233;
  --teal: #1D9E75;
  --teal-dark: #0f6e56;
  --teal-faint: #e1f5ee;
  --amber: #BA7517;
  --red: #A32D2D;
  --blue: #185FA5;
  --surface: #ffffff;
  --surface-2: #f6f8fa;
  --surface-3: #eef1f5;
  --border: rgba(0,0,0,0.08);
  --border-med: rgba(0,0,0,0.14);
  --text-1: #0d1b2a;
  --text-2: #4a5568;
  --text-3: #8a9ab0;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.07);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.10);
}

@media (prefers-color-scheme: dark) {
  :root {
    --surface: #111827;
    --surface-2: #1a2234;
    --surface-3: #0d1520;
    --border: rgba(255,255,255,0.08);
    --border-med: rgba(255,255,255,0.14);
    --text-1: #e8edf5;
    --text-2: #8a9ab0;
    --text-3: #4a5568;
    --teal-faint: #0a2e24;
  }
}

html, body, #root { height: 100%; }

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--surface-3);
  color: var(--text-1);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

textarea, input, select, button {
  font-family: inherit;
  font-size: 13px;
}

textarea:focus, input:focus, select:focus { outline: none; }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-med); border-radius: 3px; }

.mono { font-family: 'JetBrains Mono', monospace; }

@keyframes blink {
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-in { animation: fadeIn 0.25s ease both; }
.spin { animation: spin 1s linear infinite; display: inline-block; }
