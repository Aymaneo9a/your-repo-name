.right-panel { overflow-y: auto; }

.kpi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 10px;
}

.kpi-card {
  background: var(--surface-2);
  border-radius: var(--radius-md);
  padding: 10px;
  border: 0.5px solid var(--border);
}

.kpi-label {
  font-size: 10px;
  color: var(--text-3);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}

.kpi-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 3px;
}

.kpi-unit {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-2);
  margin-left: 1px;
}

.kpi-target {
  font-size: 11px;
  color: var(--text-3);
  margin-bottom: 4px;
}

.kpi-trend {
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 3px;
  font-weight: 500;
}

.kpi-trend i { font-size: 12px; }
.trend-up   { color: #3B6D11; }
.trend-down { color: #A32D2D; }

.intel-feed { padding: 0; }

.intel-item {
  padding: 9px 1rem;
  border-bottom: 0.5px solid var(--border);
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.intel-icon {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 1px;
}

.intel-text {
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-2);
}

.intel-text strong {
  color: var(--text-1);
  font-weight: 600;
}

.intel-time {
  font-size: 10px;
  color: var(--text-3);
  margin-top: 2px;
}

.weekly-wrap {
  padding: 10px 10px 14px;
}
