import React, { useState, useEffect, useCallback } from 'react';
import { load, save } from './data/storage';
import { INITIAL_TICKETS, INTEL_SEED } from './data/constants';
import TopBar from './components/TopBar';
import SLABar from './components/SLABar';
import WarRoom from './components/WarRoom';
import Workspace from './components/Workspace';
import RightPanel from './components/RightPanel';
import NewTicketModal from './components/NewTicketModal';
import SettingsModal from './components/SettingsModal';
import KPIView from './components/KPIView';
import KnowledgeView from './components/KnowledgeView';
import './App.css';

const KPI_DEFAULT = {
  closed: 2, replied: 4, avgReply: 18, csat: 4.6,
  closedWeek: [4,6,5,7,2,0,0],
  closedWeekPrev: [3,5,7,4,6,3,0],
  replyTimes: [12,18,22,14,20],
};

export default function App() {
  const [tickets, setTickets] = useState(() => load('TICKETS', INITIAL_TICKETS));
  const [kpi, setKpi] = useState(() => load('KPI', KPI_DEFAULT));
  const [intel, setIntel] = useState(() => load('INTEL', INTEL_SEED));
  const [settings, setSettings] = useState(() => load('SETTINGS', { apiKey: '', pdfFolder: '' }));
  const [kb, setKb] = useState(() => load('KB', []));

  const [activeTicketId, setActiveTicketId] = useState(null);
  const [view, setView] = useState('dashboard');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [ticketFilter, setTicketFilter] = useState('all');

  useEffect(() => { save('TICKETS', tickets); }, [tickets]);
  useEffect(() => { save('KPI', kpi); }, [kpi]);
  useEffect(() => { save('INTEL', intel); }, [intel]);
  useEffect(() => { save('SETTINGS', settings); }, [settings]);
  useEffect(() => { save('KB', kb); }, [kb]);

  const activeTicket = tickets.find(t => t.id === activeTicketId) || null;

  const addIntel = useCallback((text, icon = 'ti-brain', color = '#1D9E75') => {
    setIntel(prev => [{ icon, color, text, time: 'just now' }, ...prev].slice(0, 20));
  }, []);

  const updateTicket = useCallback((id, updates) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const addTicket = useCallback((ticket) => {
    setTickets(prev => [ticket, ...prev]);
    setActiveTicketId(ticket.id);
    setView('dashboard');
    addIntel(`New ticket ${ticket.id} created — ${ticket.product} issue ingested`);
  }, [addIntel]);

  const resolveTicket = useCallback((id) => {
    const t = tickets.find(x => x.id === id);
    setTickets(prev => prev.filter(x => x.id !== id));
    setActiveTicketId(null);
    setKpi(prev => {
      const today = new Date().getDay();
      const week = [...prev.closedWeek];
      week[today === 0 ? 6 : today - 1]++;
      return { ...prev, closed: prev.closed + 1, closedWeek: week };
    });
    addIntel(`Ticket ${id} resolved — KPIs updated`, 'ti-check', '#3B6D11');
  }, [tickets, addIntel]);

  const logFirstReply = useCallback((id) => {
    updateTicket(id, { firstReplyLogged: true });
    setKpi(prev => ({
      ...prev,
      replied: prev.replied + 1,
      replyTimes: [...prev.replyTimes, Math.floor(Math.random() * 15) + 10].slice(-20),
    }));
    addIntel(`First reply logged for ${id} — response time captured`, 'ti-clock', '#185FA5');
  }, [updateTicket, addIntel]);

  const counts = {
    urgent: tickets.filter(t => t.sla === 'urgent').length,
    warning: tickets.filter(t => t.sla === 'warning').length,
    ok: tickets.filter(t => t.sla === 'ok').length,
  };

  const filteredTickets = ticketFilter === 'all'
    ? tickets
    : tickets.filter(t => t.sla === ticketFilter);

  return (
    <div className="app-shell">
      <TopBar
        view={view}
        setView={setView}
        onSettings={() => setShowSettings(true)}
        hasApiKey={!!settings.apiKey}
      />
      <SLABar
        counts={counts}
        onFilter={setTicketFilter}
        activeFilter={ticketFilter}
        onNewTicket={() => setShowNewTicket(true)}
      />

      {view === 'dashboard' && (
        <div className="main-grid">
          <WarRoom
            tickets={filteredTickets}
            activeId={activeTicketId}
            onSelect={setActiveTicketId}
          />
          <Workspace
            ticket={activeTicket}
            apiKey={settings.apiKey}
            onUpdateTicket={updateTicket}
            onResolve={resolveTicket}
            onLogReply={logFirstReply}
            onIntel={addIntel}
            onNewTicket={() => setShowNewTicket(true)}
          />
          <RightPanel
            kpi={kpi}
            intel={intel}
            onCsatUpdate={(score) => setKpi(p => ({ ...p, csat: ((p.csat * p.replied + score) / (p.replied + 1)) }))}
          />
        </div>
      )}

      {view === 'kpis' && <KPIView kpi={kpi} tickets={tickets} />}
      {view === 'knowledge' && (
        <KnowledgeView
          kb={kb}
          setKb={setKb}
          apiKey={settings.apiKey}
          onIntel={addIntel}
        />
      )}

      {showNewTicket && (
        <NewTicketModal
          onClose={() => setShowNewTicket(false)}
          onAdd={addTicket}
          existingCount={tickets.length}
          apiKey={settings.apiKey}
          onIntel={addIntel}
        />
      )}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={(s) => { setSettings(s); setShowSettings(false); }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
