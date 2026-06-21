import React, { useState } from 'react';
import { PRODUCTS } from '../data/constants';
import { callClaude, SYSTEM_PROMPT } from '../data/api';

const PRODUCT_NAMES = Object.keys(PRODUCTS);

export default function NewTicketModal({ onClose, onAdd, existingCount, onIntel }) {
  const [form, setForm] = useState({
    id: `TK-${String(1047 + existingCount).padStart(4,'0')}`,
    subject: '',
    product: 'ProxySG',
    customer: '',
    company: '',
    description: '',
    sla: 'ok',
  });
  const [parsing, setParsing] = useState(false);

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); }

  async function parseEmail() {
    if (!form.description.trim()) return;
    setParsing(true);
    try {
      if (apiKey) {
        const prompt = `Parse this support email and return JSON with fields: subject, product (one of: ${PRODUCT_NAMES.join(', ')}), customer (full name), company, description (issue summary), sla (urgent/warning/ok based on urgency).\n\nEmail:\n${form.description}`;
        const raw = await callClaude(SYSTEM_PROMPT, prompt, 400);
        const cleaned = raw.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        setForm(p => ({ ...p, ...parsed }));
        onIntel('Email parsed — ticket fields auto-populated by AI', 'ti-mail', '#185FA5');
      } else {
        // Heuristic parse without API
        const lines = form.description.split('\n');
        const subjectLine = lines.find(l => l.toLowerCase().includes('subject:') || l.length > 10);
        const urgentWords = ['urgent', 'critical', 'p1', 'down', 'breach', 'outage'];
        const isUrgent = urgentWords.some(w => form.description.toLowerCase().includes(w));
        const productMatch = PRODUCT_NAMES.find(p => form.description.toLowerCase().includes(p.toLowerCase()));
        setForm(prev => ({
          ...prev,
          subject: subjectLine?.replace(/subject:/i,'').trim().slice(0,80) || prev.subject,
          sla: isUrgent ? 'urgent' : prev.sla,
          product: productMatch || prev.product,
        }));
        onIntel('Email content parsed — key fields detected', 'ti-mail', '#185FA5');
      }
    } catch (e) {
      onIntel('Email parse failed — please fill fields manually', 'ti-alert-circle', '#A32D2D');
    }
    setParsing(false);
  }

  function submit() {
    if (!form.subject.trim()) return;
    const ticket = {
      ...form,
      status: 'open',
      sentiment: 'neutral',
      created: Date.now(),
      conversation: [],
      logs: [],
      rca: false,
      firstReplyLogged: false,
      csatScore: null,
    };
    onAdd(ticket);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <span className="modal-title">New ticket</span>
          <button className="modal-close" onClick={onClose}><i className="ti ti-x" /></button>
        </div>
        <div className="modal-body">

          <div className="form-group">
            <label className="form-label">Paste email / ticket content</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: 100 }}
              placeholder="Paste the full email notification here — click 'Parse' to auto-fill fields below..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
            <button className="btn btn-sm" style={{ marginTop: 6 }} onClick={parseEmail} disabled={parsing || !form.description.trim()}>
              <i className={`ti ${parsing ? 'ti-loader spin' : 'ti-sparkles'}`} />
              {parsing ? 'Parsing...' : 'Auto-parse email'}
            </button>
          </div>

          <hr className="divider" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Ticket ID</label>
              <input className="form-input" value={form.id} onChange={e => set('id', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={form.sla} onChange={e => set('sla', e.target.value)}>
                <option value="ok">Normal</option>
                <option value="warning">High — due soon</option>
                <option value="urgent">Urgent — SLA breach</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <input className="form-input" placeholder="Brief issue description" value={form.subject} onChange={e => set('subject', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Product</label>
            <select className="form-select" value={form.product} onChange={e => set('product', e.target.value)}>
              {PRODUCT_NAMES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Customer name</label>
              <input className="form-input" placeholder="Full name" value={form.customer} onChange={e => set('customer', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Company</label>
              <input className="form-input" placeholder="Company name" value={form.company} onChange={e => set('company', e.target.value)} />
            </div>
          </div>

          <div className="btn-row" style={{ marginTop: 4 }}>
            <button className="btn btn-primary" onClick={submit} disabled={!form.subject.trim()}>
              <i className="ti ti-plus" /> Create ticket
            </button>
            <button className="btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
