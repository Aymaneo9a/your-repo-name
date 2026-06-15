import React from 'react';
import './TopBar.css';

export default function TopBar({ view, setView, onSettings, hasApiKey }) {
  const navItems = [
    { id: 'dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
    { id: 'kpis',      icon: 'ti-chart-bar',        label: 'KPIs' },
    { id: 'knowledge', icon: 'ti-books',             label: 'Knowledge' },
  ];

  return (
    <header className="topbar">
      <div className="topbar-logo">
        <i className="ti ti-shield-check" />
        <span>Broadcom Support Copilot</span>
      </div>
      <nav className="topbar-nav">
        {navItems.map(n => (
          <button
            key={n.id}
            className={`nav-btn${view === n.id ? ' active' : ''}`}
            onClick={() => setView(n.id)}
          >
            <i className={`ti ${n.icon}`} />
            {n.label}
          </button>
        ))}
      </nav>
      <div className="topbar-right">
        {!hasApiKey && (
          <span className="api-warning" onClick={onSettings}>
            <i className="ti ti-alert-triangle" /> Add API key
          </span>
        )}
        <button className="nav-btn btn-icon" onClick={onSettings} title="Settings">
          <i className="ti ti-settings" />
        </button>
      </div>
    </header>
  );
}
