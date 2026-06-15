import React from 'react';
import './SLABar.css';

export default function SLABar({ counts, onFilter, activeFilter, onNewTicket }) {
  return (
    <div className="sla-bar">
      <div className="sla-pills">
        {[
          { key: 'urgent',  dot: 'dot-red',   label: 'SLA breached',   count: counts.urgent,  color: '#A32D2D' },
          { key: 'warning', dot: 'dot-amber',  label: 'Due within 2h',  count: counts.warning, color: '#BA7517' },
          { key: 'ok',      dot: 'dot-green',  label: 'On track',       count: counts.ok,      color: '#3B6D11' },
          { key: 'all',     dot: 'dot-blue',   label: 'All tickets',    count: counts.urgent + counts.warning + counts.ok, color: '#185FA5' },
        ].map(p => (
          <button
            key={p.key}
            className={`sla-pill${activeFilter === p.key ? ' active' : ''}`}
            onClick={() => onFilter(p.key)}
          >
            <span className={`sla-dot ${p.dot}`} />
            <span className="sla-pill-label">{p.label}</span>
            <span className="sla-pill-count" style={{ color: p.color }}>{p.count}</span>
          </button>
        ))}
      </div>
      <button className="new-ticket-btn" onClick={onNewTicket}>
        <i className="ti ti-plus" /> New ticket
      </button>
    </div>
  );
}
