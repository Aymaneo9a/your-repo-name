import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import './RightPanel.css';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function RightPanel({ kpi, intel }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const avgReply = kpi.replyTimes?.length
    ? Math.round(kpi.replyTimes.reduce((a,b)=>a+b,0)/kpi.replyTimes.length)
    : kpi.avgReply;

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: DAYS,
        datasets: [
          {
            label: 'This week',
            data: kpi.closedWeek || [4,6,5,7,2,0,0],
            backgroundColor: '#1D9E75',
            borderRadius: 3,
          },
          {
            label: 'Last week',
            data: kpi.closedWeekPrev || [3,5,7,4,6,3,0],
            backgroundColor: 'rgba(29,158,117,0.22)',
            borderRadius: 3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { font: { size: 10 }, boxWidth: 10, padding: 8, color: '#8a9ab0' }
          },
          tooltip: { mode: 'index' }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#8a9ab0' } },
          y: { grid: { color: 'rgba(128,128,128,0.08)' }, ticks: { font: { size: 10 }, color: '#8a9ab0', stepSize: 2 } }
        }
      }
    });
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [kpi.closedWeek, kpi.closedWeekPrev]);

  const kpiCards = [
    { label: 'Tickets closed',  value: kpi.closed,          unit: '',   target: '8 today',   trend: '+1 vs yesterday', up: true,  color: '#1D9E75' },
    { label: 'Avg first reply', value: avgReply,             unit: 'm',  target: 'SLA: 30m',  trend: 'Within SLA',      up: true,  color: 'var(--text-1)' },
    { label: 'Avg resolution',  value: '2.4',                unit: 'h',  target: 'Target: 4h',trend: 'Ahead of target', up: true,  color: 'var(--text-1)' },
    { label: 'CSAT score',      value: kpi.csat?.toFixed(1), unit: '/5', target: 'Target: 4.0',trend: 'Above target',   up: true,  color: '#1D9E75' },
  ];

  return (
    <div className="panel right-panel">
      {/* KPI Cards */}
      <div className="panel-header">
        <span className="panel-title">KPI today</span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{new Date().toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}</span>
      </div>
      <div className="kpi-grid">
        {kpiCards.map(k => (
          <div className="kpi-card" key={k.label}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.color }}>{k.value}<span className="kpi-unit">{k.unit}</span></div>
            <div className="kpi-target">{k.target}</div>
            <div className={`kpi-trend ${k.up ? 'trend-up' : 'trend-down'}`}>
              <i className={`ti ti-trending-${k.up ? 'up' : 'down'}`} />
              {k.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Intelligence Feed */}
      <div className="panel-header" style={{ marginTop: 4 }}>
        <span className="panel-title">Intelligence feed</span>
        <span className="badge-count">{intel.length}</span>
      </div>
      <div className="intel-feed">
        {intel.slice(0, 8).map((item, i) => (
          <div className="intel-item" key={i}>
            <i className={`ti ${item.icon} intel-icon`} style={{ color: item.color }} />
            <div>
              <div className="intel-text" dangerouslySetInnerHTML={{ __html: item.text }} />
              <div className="intel-time">{item.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Pulse */}
      <div className="panel-header" style={{ marginTop: 4 }}>
        <span className="panel-title">Weekly pulse</span>
      </div>
      <div className="weekly-wrap">
        <div style={{ position: 'relative', height: 110 }}>
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
}
