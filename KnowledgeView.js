import React from 'react';
import { PRODUCTS } from '../data/constants';
import './WarRoom.css';

function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

const SENTIMENT_ICON = { frustrated: '😤', escalating: '🔴', neutral: '😐' };

export default function WarRoom({ tickets, activeId, onSelect }) {
  return (
    <div className="panel war-room">
      <div className="panel-header">
        <span className="panel-title">War room</span>
        <span className="badge-count">{tickets.length}</span>
      </div>
      {tickets.length === 0 && (
        <div className="empty-state" style={{ height: '60%' }}>
          <i className="ti ti-inbox-off" />
          <p>No tickets</p>
        </div>
      )}
      {tickets.map(t => {
        const prod = PRODUCTS[t.product];
        return (
          <div
            key={t.id}
            className={`ticket-card${activeId === t.id ? ' active' : ''}`}
            onClick={() => onSelect(t.id)}
          >
            <div className="tc-top">
              <span className={`product-tag ${prod.cls}`}>{t.product}</span>
              <span className="tc-id">{t.id}</span>
              <span className="sentiment-icon" title={t.sentiment}>{SENTIMENT_ICON[t.sentiment]}</span>
            </div>
            <div className="tc-subject">{t.subject}</div>
            <div className="tc-meta">
              <span className={`sla-badge sla-${t.sla}`}>
                {t.sla === 'urgent' ? '⚠ Breached' : t.sla === 'warning' ? '⏱ Due soon' : '✓ On track'}
              </span>
              <span className="tc-time">{timeAgo(t.created)}</span>
            </div>
            <div className="tc-customer">{t.customer} · {t.company}</div>
          </div>
        );
      })}
    </div>
  );
}
