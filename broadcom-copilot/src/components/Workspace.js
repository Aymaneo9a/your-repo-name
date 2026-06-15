import React, { useState, useRef } from 'react';
import { PRODUCTS, RCA_TEMPLATES, DRAFT_TEMPLATES } from '../data/constants';
import { callClaude, SYSTEM_PROMPT } from '../data/api';
import './Workspace.css';

export default function Workspace({ ticket, apiKey, onUpdateTicket, onResolve, onLogReply, onIntel, onNewTicket }) {
  const [tab, setTab] = useState('analysis');
  const [analyzing, setAnalyzing] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [tone, setTone] = useState('Professional');
  const [feedback, setFeedback] = useState('');
  const [copied, setCopied] = useState(false);
  const [logContent, setLogContent] = useState('');
  const [logFiles, setLogFiles] = useState([]);
  const fileRef = useRef();

  React.useEffect(() => {
    if (ticket) {
      setTab('analysis');
      setDraft(DRAFT_TEMPLATES[ticket.product]?.replace('{customer}', ticket.customer.split(' ')[0]) || '');
      setFeedback('');
      setLogFiles([]);
      setLogContent('');
    }
  }, [ticket?.id]);

  if (!ticket) {
    return (
      <div className="workspace-panel">
        <div className="empty-state">
          <i className="ti ti-inbox" />
          <p style={{ fontWeight: 500 }}>Select a ticket to begin</p>
          <small>Or create a new ticket to start your analysis</small>
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={onNewTicket}>
            <i className="ti ti-plus" /> New ticket
          </button>
        </div>
      </div>
    );
  }

  const prod = PRODUCTS[ticket.product];

  async function runAnalysis() {
    setAnalyzing(true);
    setTab('analysis');
    try {
      let rca;
      if (apiKey) {
        const logSummary = logContent || `[No logs uploaded — using ticket description]\n${ticket.description}`;
        const prompt = `Product: ${ticket.product}\nTicket: ${ticket.subject}\nDescription: ${ticket.description}\nLog content:\n${logSummary.slice(0, 3000)}\n\nGenerate a detailed RCA as JSON with fields: summary, rootCause, timeline, evidence, resolution, kbRef`;
        const raw = await callClaude(apiKey, SYSTEM_PROMPT, prompt, 1500);
        try {
          const cleaned = raw.replace(/```json|```/g, '').trim();
          rca = JSON.parse(cleaned);
        } catch {
          rca = { summary: raw, rootCause: '', timeline: '', evidence: '', resolution: '', kbRef: '' };
        }
        onIntel(`Live AI RCA generated for ${ticket.id} via Claude API`, 'ti-cpu', '#1D9E75');
      } else {
        await new Promise(r => setTimeout(r, 2000));
        rca = RCA_TEMPLATES[ticket.product] || RCA_TEMPLATES['ProxySG'];
        onIntel(`RCA generated for ${ticket.id} — root cause identified`, 'ti-report-analytics', '#1D9E75');
      }
      onUpdateTicket(ticket.id, { rca });
    } catch (e) {
      onIntel(`Analysis error: ${e.message}`, 'ti-alert-circle', '#A32D2D');
      onUpdateTicket(ticket.id, { rca: RCA_TEMPLATES[ticket.product] || RCA_TEMPLATES['ProxySG'] });
    }
    setAnalyzing(false);
  }

  async function regenerateDraft() {
    setDraftLoading(true);
    try {
      if (apiKey) {
        const rcaContext = ticket.rca ? JSON.stringify(ticket.rca) : 'No RCA yet';
        const fbContext = feedback ? `\nCustomer latest reply: ${feedback}` : '';
        const prompt = `Product: ${ticket.product}\nCustomer: ${ticket.customer}\nCompany: ${ticket.company}\nTicket: ${ticket.subject}\nRCA: ${rcaContext}${fbContext}\nTone: ${tone}\n\nWrite a professional support reply. Address the customer by first name. Be concise and solution-focused.`;
        const result = await callClaude(apiKey, SYSTEM_PROMPT, prompt, 800);
        setDraft(result);
        onIntel(`AI draft regenerated for ${ticket.id} (${tone} tone)`, 'ti-pencil', '#185FA5');
      } else {
        await new Promise(r => setTimeout(r, 1200));
        let base = DRAFT_TEMPLATES[ticket.product]?.replace('{customer}', ticket.customer.split(' ')[0]) || draft;
        if (tone === 'Friendly') base = base.replace('Dear', 'Hi').replace('Kind regards', 'Best,');
        if (tone === 'Urgent') base += '\n\nThis is being treated as a priority. I will follow up within the hour.';
        if (tone === 'Empathetic') base = base.replace('Thank you for', 'I completely understand how disruptive this is —');
        if (feedback && (feedback.includes('escalat') || feedback.includes('P1') || feedback.includes('manager'))) {
          base += '\n\nI understand the urgency and am treating this as a top priority. I am personally monitoring this case.';
        }
        setDraft(base);
      }
    } catch (e) {
      onIntel(`Draft error: ${e.message}`, 'ti-alert-circle', '#A32D2D');
    }
    setDraftLoading(false);
  }

  async function updateFromFeedback() {
    if (!feedback.trim()) return;
    const sentiment = (feedback.includes('escalat') || feedback.includes('P1') || feedback.includes('manager') || feedback.includes('urgent'))
      ? 'escalating' : feedback.includes('frustrat') || feedback.includes('disappoint') ? 'frustrated' : 'neutral';
    onUpdateTicket(ticket.id, { sentiment });
    onIntel(`Sentiment detected for ${ticket.id}: ${sentiment}`, 'ti-mood-smile', '#BA7517');
    await regenerateDraft();
  }

  function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogContent(prev => prev + `\n\n--- ${f.name} ---\n` + ev.target.result);
        setLogFiles(prev => [...prev, f.name]);
        onIntel(`Log file ingested: ${f.name} — product: ${ticket.product}`, 'ti-file-upload', '#185FA5');
      };
      reader.readAsText(f);
    });
    onUpdateTicket(ticket.id, { logs: [...ticket.logs, ...files.map(f => f.name)] });
  }

  function copyDraft() {
    navigator.clipboard.writeText(draft).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function logAsSent() {
    if (!draft.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const preview = draft.substring(0, 200) + (draft.length > 200 ? '...' : '');
    const newConvo = [...ticket.conversation, { sender: 'engineer', text: preview, time }];
    onUpdateTicket(ticket.id, { conversation: newConvo });
    if (!ticket.firstReplyLogged) onLogReply(ticket.id);
    onIntel(`Reply sent for ${ticket.id} — conversation updated`, 'ti-send', '#3B6D11');
  }

  function addCustomerReply() {
    if (!feedback.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newConvo = [...ticket.conversation, { sender: 'customer', text: feedback, time }];
    onUpdateTicket(ticket.id, { conversation: newConvo });
    setFeedback('');
  }

  const rca = ticket.rca;

  return (
    <div className="workspace-panel">
      <div className="workspace-header">
        <div className="ws-meta-row">
          <span className={`product-tag ${prod.cls}`}>{ticket.product}</span>
          <span className="ws-id">{ticket.id}</span>
          <span className={`chip chip-open`} style={{ marginLeft: 'auto' }}>open</span>
          <button className="btn btn-sm" style={{ background: '#EAF3DE', color: '#27500A', border: '0.5px solid #b8d89e' }} onClick={() => onResolve(ticket.id)}>
            <i className="ti ti-check" /> Resolve
          </button>
        </div>
        <div className="ws-title">{ticket.subject}</div>
        <div className="ws-submeta">
          <i className="ti ti-user" style={{ fontSize: 12 }} />
          <span>{ticket.customer} · {ticket.company}</span>
          <span className={`sla-badge sla-${ticket.sla}`} style={{ marginLeft: 8 }}>
            {ticket.sla === 'urgent' ? '⚠ SLA breached' : ticket.sla === 'warning' ? '⏱ Due within 2h' : '✓ On track'}
          </span>
        </div>
      </div>

      <div className="tab-row">
        {[
          { id: 'analysis',     label: 'Analysis & RCA', icon: 'ti-report-analytics' },
          { id: 'reply',        label: 'Draft reply',    icon: 'ti-pencil' },
          { id: 'conversation', label: `Conversation (${ticket.conversation.length})`, icon: 'ti-messages' },
          { id: 'logs',         label: `Logs (${ticket.logs.length})`, icon: 'ti-file-text' },
        ].map(t => (
          <div key={t.id} className={`tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            <i className={`ti ${t.icon}`} /> {t.label}
          </div>
        ))}
      </div>

      <div className="workspace-body">

        {/* ANALYSIS TAB */}
        {tab === 'analysis' && (
          <div className="animate-in">
            <div className="section-card">
              <div className="section-head">
                <div className="section-head-left"><i className="ti ti-file-description section-icon" /><span className="section-label">Ticket description</span></div>
              </div>
              <div className="section-body">
                <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-1)' }}>{ticket.description}</p>
              </div>
            </div>

            <div className="section-card">
              <div className="section-head">
                <div className="section-head-left"><i className="ti ti-upload section-icon" /><span className="section-label">Log files</span></div>
                {logFiles.length > 0 && <span style={{ fontSize: 11, color: 'var(--teal)' }}>{logFiles.length} file(s) loaded</span>}
              </div>
              <div className="section-body">
                <input type="file" ref={fileRef} multiple accept=".log,.txt,text/plain" style={{ display: 'none' }} onChange={handleFileUpload} />
                <div className="log-drop" onClick={() => fileRef.current.click()}>
                  <i className="ti ti-file-upload" />
                  <p>Drop log files here or click to upload</p>
                  <small>Supports .log .txt plain text · Multiple files supported</small>
                </div>
                {logFiles.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {logFiles.map(f => (
                      <div key={f} style={{ fontSize: 12, color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' }}>
                        <i className="ti ti-file-check" /> {f}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="section-card">
              <div className="section-head">
                <div className="section-head-left"><i className="ti ti-brain section-icon" /><span className="section-label">AI Analysis & RCA</span></div>
                {rca && <span style={{ fontSize: 11, background: '#EAF3DE', color: '#27500A', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>✓ Generated</span>}
              </div>
              <div className="section-body">
                {!rca && !analyzing && (
                  <>
                    <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 10 }}>
                      {apiKey ? 'Upload logs then click Analyze — AI will cross-reference Broadcom TechDocs and KB articles.' : 'Click Analyze to generate RCA using built-in product knowledge.'}
                    </p>
                    <button className="btn btn-primary" onClick={runAnalysis}>
                      <i className="ti ti-cpu" /> Analyze & build RCA
                    </button>
                  </>
                )}
                {analyzing && (
                  <div className="ai-thinking">
                    <i className="ti ti-cpu spin" />
                    Analyzing logs and cross-referencing Broadcom TechDocs
                    <span className="dots"><span>.</span><span>.</span><span>.</span></span>
                  </div>
                )}
                {rca && !analyzing && (
                  <>
                    {[
                      { label: 'Summary',       val: rca.summary },
                      { label: 'Root Cause',    val: rca.rootCause },
                      { label: 'Timeline',      val: rca.timeline, mono: true },
                      { label: 'Evidence',      val: rca.evidence },
                      { label: 'Resolution',    val: rca.resolution, mono: true },
                      { label: 'KB Reference',  val: rca.kbRef },
                    ].filter(r => r.val).map(r => (
                      <div className="rca-block" key={r.label}>
                        <div className="rca-label">{r.label}</div>
                        <div className={`rca-content${r.mono ? ' mono' : ''}`} style={{ whiteSpace: 'pre-wrap' }}>{r.val}</div>
                      </div>
                    ))}
                    <div className="btn-row">
                      <button className="btn btn-primary" onClick={() => setTab('reply')}><i className="ti ti-send" /> Draft reply</button>
                      <button className="btn" onClick={runAnalysis}><i className="ti ti-refresh" /> Re-analyze</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* REPLY TAB */}
        {tab === 'reply' && (
          <div className="animate-in">
            <div className="section-card">
              <div className="section-head">
                <div className="section-head-left"><i className="ti ti-message-circle section-icon" /><span className="section-label">Customer feedback</span></div>
              </div>
              <div className="section-body">
                <textarea
                  className="form-textarea"
                  style={{ minHeight: 80 }}
                  placeholder="Paste the customer's latest reply here — AI detects sentiment and adjusts the draft..."
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                />
                <div className="btn-row">
                  <button className="btn" onClick={updateFromFeedback} disabled={!feedback.trim()}>
                    <i className="ti ti-refresh" /> Update draft from feedback
                  </button>
                  <button className="btn btn-sm" onClick={addCustomerReply} disabled={!feedback.trim()}>
                    <i className="ti ti-plus" /> Log to conversation
                  </button>
                </div>
              </div>
            </div>

            <div className="section-card">
              <div className="section-head">
                <div className="section-head-left"><i className="ti ti-pencil section-icon" /><span className="section-label">Reply draft</span></div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '3px 8px' }} value={tone} onChange={e => setTone(e.target.value)}>
                    <option>Professional</option>
                    <option>Friendly</option>
                    <option>Urgent</option>
                    <option>Empathetic</option>
                  </select>
                </div>
              </div>
              <div className="section-body">
                {draftLoading ? (
                  <div className="ai-thinking">
                    <i className="ti ti-brain spin" />
                    Generating reply using RCA context and customer sentiment
                    <span className="dots"><span>.</span><span>.</span><span>.</span></span>
                  </div>
                ) : (
                  <textarea
                    className="form-textarea reply-textarea"
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                  />
                )}
                <div className="btn-row" style={{ marginTop: 10 }}>
                  <button className="btn btn-primary" onClick={copyDraft}>
                    <i className={`ti ${copied ? 'ti-check' : 'ti-copy'}`} />
                    {copied ? 'Copied!' : 'Copy to clipboard'}
                  </button>
                  <button className="btn" onClick={regenerateDraft} disabled={draftLoading}>
                    <i className="ti ti-refresh" /> Regenerate
                  </button>
                  <button className="btn" onClick={logAsSent}>
                    <i className="ti ti-check" /> Log as sent
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONVERSATION TAB */}
        {tab === 'conversation' && (
          <div className="animate-in">
            <div className="section-card">
              <div className="section-body">
                {ticket.conversation.length === 0 ? (
                  <div className="empty-state" style={{ height: 200 }}>
                    <i className="ti ti-messages" />
                    <p>No conversation yet</p>
                    <small>Paste customer replies in the Draft reply tab</small>
                  </div>
                ) : (
                  ticket.conversation.map((c, i) => (
                    <div className="convo-item" key={i}>
                      <div className={`convo-sender ${c.sender}`}>
                        {c.sender === 'engineer' ? '🟢 You (engineer)' : `🔵 ${ticket.customer}`}
                      </div>
                      <div className="convo-text">{c.text}</div>
                      <div className="convo-time">{c.time}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* LOGS TAB */}
        {tab === 'logs' && (
          <div className="animate-in">
            <div className="section-card">
              <div className="section-head">
                <div className="section-head-left"><i className="ti ti-file-text section-icon" /><span className="section-label">Uploaded logs</span></div>
              </div>
              <div className="section-body">
                {ticket.logs.length === 0 ? (
                  <div className="empty-state" style={{ height: 200 }}>
                    <i className="ti ti-file-off" />
                    <p>No logs uploaded</p>
                    <small>Go to Analysis tab to upload log files</small>
                  </div>
                ) : (
                  <>
                    {ticket.logs.map(f => (
                      <div key={f} style={{ fontSize: 13, color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '0.5px solid var(--border)' }}>
                        <i className="ti ti-file-check" /> {f}
                      </div>
                    ))}
                    {logContent && (
                      <details style={{ marginTop: 12 }}>
                        <summary style={{ cursor: 'pointer', fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>View raw log content</summary>
                        <pre style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', background: 'var(--surface-3)', padding: 12, borderRadius: 6, overflow: 'auto', maxHeight: 300 }}>{logContent}</pre>
                      </details>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
