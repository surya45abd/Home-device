import React from 'react';

export default function MainMeterCard({
  totalWattage,
  breakerActive,
  onToggleBreaker,
  todayKwh
}) {
  // Gauge fill percentage (relative to 3000W residential limit)
  const gaugePercent = breakerActive
    ? Math.min(100, Math.max(5, (totalWattage / 3000) * 100))
    : 0;

  let loadStatusLabel = 'Normal Residential';
  let loadStatusClass = 'metric-delta positive';

  if (!breakerActive) {
    loadStatusLabel = 'Breaker Isolated (0W)';
    loadStatusClass = 'metric-delta danger';
  } else if (totalWattage < 350) {
    loadStatusLabel = 'Low Eco Baseline';
    loadStatusClass = 'metric-delta positive';
  } else if (totalWattage < 800) {
    loadStatusLabel = 'Normal Residential';
    loadStatusClass = 'metric-delta positive';
  } else if (totalWattage < 1800) {
    loadStatusLabel = 'Elevated Load';
    loadStatusClass = 'metric-delta warning';
  } else {
    loadStatusLabel = 'Peak Load Warning';
    loadStatusClass = 'metric-delta danger';
  }

  return (
    <div className="dash-card meter-card">
      <div className="card-header">
        <div className="header-left">
          <div className="icon-bubble meter-icon">
            <i className="fa-solid fa-gauge-high"></i>
          </div>
          <div>
            <h2>Main Power Supply & Smart Meter</h2>
            <p className="subtitle">
              Grid Feed: 230V AC • Frequency: 50.1 Hz • Health: Optimal
            </p>
          </div>
        </div>
        <div className="header-right">
          <span className="live-pill">
            <span className="pulse-dot"></span> LIVE GRID
          </span>
        </div>
      </div>

      <div className="meter-metrics-row">
        {/* Metric 1 */}
        <div className="metric-box">
          <span className="metric-label">Current Load</span>
          <div className="metric-value-wrap">
            <span className="metric-val">{totalWattage}</span>
            <span className="metric-unit">Watts</span>
          </div>
          <span className={loadStatusClass}>{loadStatusLabel}</span>
        </div>

        {/* Metric 2 */}
        <div className="metric-box">
          <span className="metric-label">Today's Consumption</span>
          <div className="metric-value-wrap">
            <span className="metric-val">{todayKwh.toFixed(2)}</span>
            <span className="metric-unit">kWh</span>
          </div>
          <span className="metric-delta">
            Est. ${(todayKwh * 0.3).toFixed(2)} today
          </span>
        </div>

        {/* Metric 3 */}
        <div className="metric-box">
          <span className="metric-label">Breaker Master State</span>
          <div className="metric-value-wrap">
            <span
              className={`metric-status ${breakerActive ? 'online' : 'tripped'}`}
            >
              {breakerActive ? 'ARMED & ACTIVE' : 'ISOLATED / OFF'}
            </span>
          </div>
          <span className="metric-sub">
            Surge Protection: {breakerActive ? 'OK' : 'Standby'}
          </span>
        </div>
      </div>

      {/* Interactive Power Breaker Toggle */}
      <div className="meter-controls-bar">
        <div className="breaker-toggle-wrapper">
          <div className="breaker-info">
            <strong>
              <i className="fa-solid fa-power-off"></i> Main Meter Supply Line
            </strong>
            <p>Master isolation breaker for all connected home circuits</p>
          </div>
          <label className="switch-toggle" title="Toggle Main Power Supply">
            <input
              type="checkbox"
              checked={breakerActive}
              onChange={(e) => onToggleBreaker(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Real-Time Power Draw Gauge Bar */}
      <div className="meter-gauge-container">
        <div className="gauge-labels">
          <span>Idle (120W)</span>
          <span>
            Active Loads:{' '}
            <strong>
              Fridge (180W), Hub (25W), Dynamic Lighting & Fans
            </strong>
          </span>
          <span>Peak Safe (3000W)</span>
        </div>
        <div className="gauge-track">
          <div
            className="gauge-fill"
            style={{ width: `${gaugePercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
