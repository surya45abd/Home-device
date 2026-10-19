import React from 'react';

export default function EnergyHistoryChart() {
  // SVG points for the power curve from 06:00 to 11:00 AM
  // ViewBox: 0 0 650 160
  // 6:00 AM (0, 70), 6:30 AM Departure (65, 45), 7:00 AM (130, 85), 9:00 AM (260, 95)
  // 9:15 AM Eco Drop (290, 130), 10:00 AM (390, 130), 10:18 AM Sag Spike (420, 30), 10:20 AM (435, 130), 10:45 AM Return (520, 115), 11:00 AM (650, 115)
  const linePoints = "0,80 65,40 100,75 260,85 295,128 390,128 420,35 435,128 520,115 650,115";
  const areaPoints = "0,80 65,40 100,75 260,85 295,128 390,128 420,35 435,128 520,115 650,115 650,160 0,160";

  return (
    <div className="dash-card energy-chart-card">
      <div className="card-header">
        <div className="header-left">
          <div className="icon-bubble chart-icon">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <div>
            <h2>Grid Power Draw Curve (06:00 AM – 11:00 AM)</h2>
            <p className="subtitle">
              Visualizing the 09:15 AM eco-drop and 10:18 AM grid anomaly
            </p>
          </div>
        </div>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-color normal"></span> Baseline Draw
          </span>
          <span className="legend-item">
            <span className="legend-color anomaly"></span> 10:18 AM Spike
          </span>
        </div>
      </div>

      <div className="chart-wrapper">
        <svg viewBox="0 0 650 160" className="power-svg">
          <defs>
            <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid horizontal guidelines */}
          <line x1="0" y1="40" x2="650" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4,4" />
          <line x1="0" y1="80" x2="650" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="4,4" />
          <line x1="0" y1="120" x2="650" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="4,4" />

          {/* Y Axis labels */}
          <text x="10" y="36" fill="#64748b" fontSize="10" fontFamily="sans-serif">1500W</text>
          <text x="10" y="76" fill="#64748b" fontSize="10" fontFamily="sans-serif">1000W</text>
          <text x="10" y="116" fill="#64748b" fontSize="10" fontFamily="sans-serif">500W (Eco)</text>

          {/* Shaded Area */}
          <polygon points={areaPoints} fill="url(#chartGrad)" />

          {/* Line Path */}
          <polyline
            points={linePoints}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Event Annotation 1: 06:30 AM Departure */}
          <circle cx="65" cy="40" r="5" fill="#38bdf8" />
          <text x="50" y="24" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">06:30 Depart</text>

          {/* Event Annotation 2: 09:15 AM Eco Drop */}
          <circle cx="295" cy="128" r="5" fill="#10b981" />
          <text x="260" y="148" fill="#10b981" fontSize="10" fontFamily="sans-serif">09:15 Eco Drop (305W)</text>

          {/* Event Annotation 3: 10:18 AM Voltage Sag Surge */}
          <circle cx="420" cy="35" r="6" fill="#f43f5e" />
          <text x="390" y="20" fill="#f43f5e" fontSize="11" fontWeight="bold" fontFamily="sans-serif">⚡ 10:18 AM Sag (195V)</text>

          {/* Event Annotation 4: 10:45 AM Return */}
          <circle cx="520" cy="115" r="5" fill="#38bdf8" />
          <text x="500" y="100" fill="#38bdf8" fontSize="10" fontFamily="sans-serif">10:45 Return (410W)</text>
        </svg>

        {/* X Axis Time Labels */}
        <div className="chart-x-axis">
          <span>06:00 AM</span>
          <span>07:00 AM</span>
          <span>08:00 AM</span>
          <span>09:00 AM</span>
          <span>10:00 AM</span>
          <span>11:00 AM</span>
        </div>
      </div>
    </div>
  );
}
