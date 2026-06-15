.app-shell {
  display: grid;
  grid-template-rows: 48px 48px 1fr;
  height: 100vh;
  overflow: hidden;
}

.main-grid {
  display: grid;
  grid-template-columns: 280px 1fr 260px;
  overflow: hidden;
  height: 100%;
}

/* ── Shared panel ── */
.panel { overflow-y: auto; background: var(--surface); border-right: 0.5px solid var(--border); }
.panel:last-child { border-right: none; border-left: 0.5px solid var(--border); }
.panel-header {
  padding: 10px 1rem;
  border-bottom: 0.5px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0;
  background: var(--surface);
  z-index: 10;
}
.panel-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-3); }

/* ── Tags ── */
.product-tag {
  font-size: 10px; font-weight: 600;
  padding: 2px 7px; border-radius: 4px; flex-shrink: 0;
}
.tag-swg   { background: #E6F1FB; color: #0C447C; }
.tag-proxy { background: #EEEDFE; color: #3C3489; }
.tag-cas   { background: #EAF3DE; color: #27500A; }
.tag-ztna  { background: #FAEEDA; color: #633806; }
.tag-mc    { background: #FBEAF0; color: #72243E; }

/* ── SLA badges ── */
.sla-badge { font-size: 11px; padding: 2px 7px; border-radius: 4px; font-weight: 500; }
.sla-urgent  { background: #FCEBEB; color: #A32D2D; }
.sla-warning { background: #FAEEDA; color: #633806; }
.sla-ok      { background: #EAF3DE; color: #27500A; }

/* ── Status chips ── */
.chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; }
.chip-open     { background: #E6F1FB; color: #0C447C; }
.chip-pending  { background: #FAEEDA; color: #633806; }
.chip-resolved { background: #EAF3DE; color: #27500A; }

/* ── Buttons ── */
.btn {
  padding: 6px 13px; border-radius: var(--radius-md);
  font-size: 13px; cursor: pointer;
  border: 0.5px solid var(--border-med);
  background: var(--surface); color: var(--text-1);
  display: inline-flex; align-items: center; gap: 6px;
  transition: background 0.12s, border-color 0.12s;
  white-space: nowrap;
}
.btn:hover { background: var(--surface-2); }
.btn i { font-size: 14px; }
.btn-primary { background: var(--teal); color: #fff; border-color: var(--teal); }
.btn-primary:hover { background: var(--teal-dark); border-color: var(--teal-dark); }
.btn-danger { background: #FCEBEB; color: #A32D2D; border-color: #f5c6c6; }
.btn-danger:hover { background: #f8d7d7; }
.btn-sm { padding: 4px 10px; font-size: 12px; }
.btn-icon { padding: 6px; }

/* ── Form inputs ── */
.form-group { margin-bottom: 1rem; }
.form-label { font-size: 12px; color: var(--text-2); margin-bottom: 4px; display: block; font-weight: 500; }
.form-input, .form-select, .form-textarea {
  width: 100%;
  border: 0.5px solid var(--border-med);
  border-radius: var(--radius-md);
  padding: 8px 10px;
  font-size: 13px;
  font-family: inherit;
  background: var(--surface-2);
  color: var(--text-1);
  transition: border-color 0.12s;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--teal);
  background: var(--surface);
}
.form-textarea { resize: vertical; min-height: 80px; line-height: 1.6; }

/* ── Section cards ── */
.section-card {
  background: var(--surface);
  border: 0.5px solid var(--border);
  border-radius: var(--radius-lg);
  margin-bottom: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.section-head {
  padding: 11px 1rem;
  border-bottom: 0.5px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  background: var(--surface);
}
.section-head-left { display: flex; align-items: center; gap: 8px; }
.section-icon { font-size: 16px; color: var(--teal); }
.section-label { font-size: 13px; font-weight: 500; }
.section-body { padding: 1rem; }

/* ── Tabs ── */
.tab-row {
  display: flex; gap: 0;
  border-bottom: 0.5px solid var(--border);
  background: var(--surface);
  overflow-x: auto;
}
.tab {
  padding: 9px 14px; font-size: 12px; cursor: pointer;
  border-bottom: 2px solid transparent;
  color: var(--text-2);
  transition: all 0.15s; white-space: nowrap;
  font-weight: 500;
}
.tab:hover { color: var(--text-1); }
.tab.active { color: var(--teal); border-bottom-color: var(--teal); }

/* ── AI states ── */
.ai-thinking {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px;
  background: var(--teal-faint);
  border-radius: var(--radius-md);
  font-size: 12px; color: var(--teal-dark);
  margin-top: 8px;
  border: 0.5px solid rgba(29,158,117,0.2);
}
.ai-thinking i { color: var(--teal); font-size: 14px; }
.dots span { display: inline-block; animation: blink 1.4s infinite both; }
.dots span:nth-child(2) { animation-delay: .2s; }
.dots span:nth-child(3) { animation-delay: .4s; }

.ai-response {
  background: var(--teal-faint);
  border-radius: var(--radius-md);
  padding: 12px;
  font-size: 13px; line-height: 1.7;
  margin-top: 8px;
  border-left: 2px solid var(--teal);
  white-space: pre-wrap;
}

/* ── RCA blocks ── */
.rca-block {
  background: var(--surface-2);
  border-radius: var(--radius-md);
  padding: 12px;
  margin-bottom: 10px;
}
.rca-label {
  font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--text-3); margin-bottom: 6px;
}
.rca-content { font-size: 13px; line-height: 1.7; }

/* ── Log drop zone ── */
.log-drop {
  border: 1.5px dashed var(--border-med);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  color: var(--text-2);
}
.log-drop:hover { border-color: var(--teal); background: var(--teal-faint); color: var(--teal-dark); }
.log-drop i { font-size: 28px; margin-bottom: 8px; display: block; }
.log-drop p { font-size: 13px; }
.log-drop small { font-size: 11px; color: var(--text-3); }

/* ── Conversation ── */
.convo-item { padding: 10px 0; border-bottom: 0.5px solid var(--border); }
.convo-item:last-child { border-bottom: none; }
.convo-sender { font-size: 11px; font-weight: 600; margin-bottom: 4px; }
.convo-sender.engineer { color: var(--teal); }
.convo-sender.customer { color: var(--blue); }
.convo-text { font-size: 13px; line-height: 1.6; }
.convo-time { font-size: 10px; color: var(--text-3); margin-top: 4px; }

/* ── Empty states ── */
.empty-state {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  height: 100%; gap: 10px;
  color: var(--text-3); padding: 3rem;
  text-align: center;
}
.empty-state i { font-size: 40px; opacity: 0.3; }
.empty-state p { font-size: 14px; }
.empty-state small { font-size: 12px; color: var(--text-3); }

/* ── Modal ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 100;
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(2px);
}
.modal {
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 0.5px solid var(--border-med);
  width: 100%; max-width: 560px;
  max-height: 85vh; overflow-y: auto;
  box-shadow: var(--shadow-md);
  animation: fadeIn 0.2s ease both;
}
.modal-wide { max-width: 720px; }
.modal-head {
  padding: 1rem;
  border-bottom: 0.5px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0;
  background: var(--surface); z-index: 1;
}
.modal-title { font-size: 15px; font-weight: 600; }
.modal-body { padding: 1rem; }
.modal-close {
  background: none; border: none; cursor: pointer;
  color: var(--text-2); font-size: 18px;
  display: flex; align-items: center;
  padding: 4px; border-radius: var(--radius-sm);
}
.modal-close:hover { background: var(--surface-2); }

/* ── Misc ── */
.btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.divider { border: none; border-top: 0.5px solid var(--border); margin: 1rem 0; }
.badge-count {
  font-size: 10px; font-weight: 600;
  background: var(--surface-3); color: var(--text-2);
  padding: 1px 6px; border-radius: 10px; margin-left: 4px;
}
