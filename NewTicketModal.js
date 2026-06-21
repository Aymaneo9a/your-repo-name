import React, { useEffect, useRef } from 'react';
import { Chart, BarController, LineController, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { PRODUCTS } from '../data/constants';
import './KPIView.css';

Chart.register(BarController, LineController, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function KPIView({ kpi, tickets }) {
  const barRef = useRef(null);
  const lineRef = useRef(null);
  const barChart = useRef(null);
  const lineChart = useRef(null);

  const avgReply = kpi.replyTimes?.length
    ? Math.round(kpi.replyTimes.reduce((a,b)=>a+b,0)/kpi.replyTimes.length)
    : kpi.avgReply;

  const productCounts = Object.keys(PRODUCTS).map(p => ({
    product: p,
    count: tickets.filter(t => t.product === p).length,
    color: PRODUCTS[p].color,
  }));

  useEffect(() => {
    if (barRef.current) {
      if (barChart.current) barChart.current.destroy();
      barChart.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: DAYS,
          datasets: [
            { label: 'This week', data: kpi.closedWeek || [4,6,5,7,2,0,0], backgroundColor: '#1D9E75', borderRadius: 4 },
            { label: 'Last week', data: kpi.closedWeekPrev || [3,5,7,4,6,3,0], backgroundColor: 'rgba(29,158,117,0.22)', borderRadius: 4 },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, color: '#8a9ab0', boxWidth: 12 } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#8a9ab0' } },
            y: { grid: { color: 'rgba(128,128,128,0.08)' }, ticks: { color: '#8a9ab0', stepSize: 2 } }
          }
        }
      });
    }
    if (lineRef.current) {
      if (lineChart.current) lineChart.current.destroy();
      const replyData = kpi.replyTimes?.slice(-7) || [22,18,25,14,20,18,16];
      lineChart.current = new Chart(lineRef.current, {
        type: 'line',
        data: {
          labels: replyData.map((_,i) => `R${i+1}`),
          datasets: [{
            label: 'First reply time (min)',
            data: replyData,
            borderColor: '#185FA5',
            backgroundColor: 'rgba(24,95,165,0.08)',
            borderWidth: 2,
            pointRadius: 3,
            tension: 0.3,
            fill: true,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#8a9ab0', font: { size: 10 } } },
            y: {
              grid: { color: 'rgba(128,128,128,0.08)' },
              ticks: { color: '#8a9ab0' },
              min: 0,
              suggestedMax: 35,
            }
          }
        }
      });
    }
    return () => {
      if (barChart.current) barChart.current.destroy();
      if (lineChart.current) lineChart.current.destroy();
    };
  }, [kpi]);

  const bigCards = [
    { label: 'Tickets closed today',  value: kpi.closed,           unit: '',    target: '8',   pct: Math.min(100, Math.round((kpi.closed/8)*100)),   color: '#1D9E75' },
    { label: 'Avg first reply',        value: avgReply,             unit: 'min', target: '30m', pct: Math.min(100, Math.round(((30-avgReply)/30)*100+70)), color: '#185FA5' },
    { label: 'CSAT score',             value: kpi.csat?.toFixed(1), unit: '/5',  target: '4.0', pct: Math.min(100, Math.round((kpi.csat/5)*100)),      color: '#BA7517' },
    { label: 'Replies sent today',     value: kpi.replied,          unit: '',    target: '10',  pct: Math.min(100, Math.round((kpi.replied/10)*100)),  color: '#534AB7' },
  ];

  return (
    <div className="kpi-view">
      <div className="kpi-view-header">
        <h2>KPI Dashboard</h2>
        <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* Big KPI cards */}
      <div className="kpi-big-grid">
        {bigCards.map(k => (
          <div className="kpi-big-card" key={k.label}>
            <div className="kbc-label">{k.label}</div>
            <div className="kbc-value" style={{ color: k.color }}>{k.value}<span className="kbc-unit">{k.unit}</span></div>
            <div className="kbc-bar-bg">
              <div className="kbc-bar-fill" style={{ width: `${k.pct}%`, background: k.color }} />
            </div>
            <div className="kbc-target">Target: {k.target} · {k.pct}% achieved</div>
          </div>
        ))}
      </div>

      <div className="kpi-charts-grid">
        {/* Tickets by day */}
        <div className="section-card">
          <div className="section-head">
            <div className="section-head-left"><i className="ti ti-chart-bar section-icon" /><span className="section-label">Tickets closed — this week vs last</span></div>
          </div>
          <div className="section-body" style={{ height: 200, position: 'relative' }}>
            <canvas ref={barRef} />
          </div>
        </div>

        {/* Reply time trend */}
        <div className="section-card">
          <div className="section-head">
            <div className="section-head-left"><i className="ti ti-clock section-icon" /><span className="section-label">First reply time trend (last 7 replies)</span></div>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>SLA: 30 min</span>
          </div>
          <div className="section-body" style={{ height: 200, position: 'relative' }}>
            <canvas ref={lineRef} />
          </div>
        </div>
      </div>

      {/* Product breakdown */}
      <div className="section-card" style={{ margin: '0 1.5rem 1.5rem' }}>
        <div className="section-head">
          <div className="section-head-left"><i className="ti ti-layout-grid section-icon" /><span className="section-label">Open tickets by product</span></div>
        </div>
        <div className="section-body">
          <div className="product-breakdown">
            {productCounts.map(p => (
              <div className="pb-row" key={p.product}>
                <span className="pb-label">{p.product}</span>
                <div className="pb-bar-bg">
                  <div className="pb-bar-fill" style={{ width: `${tickets.length ? (p.count/tickets.length)*100 : 0}%`, background: p.color }} />
                </div>
                <span className="pb-count">{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
