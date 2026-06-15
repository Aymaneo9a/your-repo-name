import React, { useState } from 'react';
import { clearAll } from '../data/storage';

export default function SettingsModal({ settings, onSave, onClose }) {
  const [form, setForm] = useState({ ...settings });
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); }

  async function testKey() {
    if (!form.apiKey) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': form.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      });
      if (res.ok) setTestResult('success');
      else setTestResult('error');
    } catch {
      setTestResult('error');
    }
    setTesting(false);
  }

  function handleClearData() {
    if (window.confirm('This will clear all tickets, KPI data and settings. Are you sure?')) {
      clearAll();
      window.location.reload();
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <span className="modal-title">Settings</span>
          <button className="modal-close" onClick={onClose}><i className="ti ti-x" /></button>
        </div>
        <div className="modal-body">

          <div className="form-group">
            <label className="form-label">
              <i className="ti ti-key" style={{ marginRight: 5 }} />
              Claude API Key
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="form-input"
                type={showKey ? 'text' : 'password'}
                placeholder="sk-ant-..."
                value={form.apiKey}
                onChange={e => set('apiKey', e.target.value)}
                style={{ flex: 1 }}
              />
              <button className="btn btn-icon" onClick={() => setShowKey(p => !p)} title="Show/hide key">
                <i className={`ti ${showKey ? 'ti-eye-off' : 'ti-eye'}`} />
              </button>
              <button className="btn btn-sm" onClick={testKey} disabled={!form.apiKey || testing}>
                {testing ? <i className="ti ti-loader spin" /> : <i className="ti ti-plug" />}
                {testing ? 'Testing...' : 'Test'}
              </button>
            </div>
            {testResult === 'success' && (
              <p style={{ fontSize: 12, color: '#3B6D11', marginTop: 6 }}>✓ API key valid — live AI features enabled</p>
            )}
            {testResult === 'error' && (
              <p style={{ fontSize: 12, color: '#A32D2D', marginTop: 6 }}>✗ Invalid key — check and try again</p>
            )}
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
              Your API key is stored locally in your browser only. It is never sent to any server other than Anthropic.
              Get a key at <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: 'var(--teal)' }}>console.anthropic.com</a>
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="ti ti-folder" style={{ marginRight: 5 }} />
              PDF documentation folder path
            </label>
            <input
              className="form-input"
              placeholder="e.g. C:\Broadcom\Docs or /Users/you/broadcom-docs"
              value={form.pdfFolder}
              onChange={e => set('pdfFolder', e.target.value)}
            />
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
              Point to the folder containing your Broadcom PDF admin guides. The tool will reference these when generating RCAs.
            </p>
          </div>

          <hr className="divider" />

          <div className="form-group">
            <label className="form-label" style={{ color: '#A32D2D' }}>Danger zone</label>
            <button className="btn btn-danger btn-sm" onClick={handleClearData}>
              <i className="ti ti-trash" /> Clear all data & reset
            </button>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
              Clears all tickets, KPI history, knowledge base, and settings from local storage.
            </p>
          </div>

          <div className="btn-row" style={{ marginTop: 8 }}>
            <button className="btn btn-primary" onClick={() => onSave(form)}>
              <i className="ti ti-check" /> Save settings
            </button>
            <button className="btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
