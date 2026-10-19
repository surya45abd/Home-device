import React, { useState } from 'react';

export default function TimelineCard({ events }) {
  const [filter, setFilter] = useState('important');

  const filteredEvents = events.filter((ev) => {
    if (filter === 'important') return ev.important;
    if (filter === 'motion') return ev.category === 'motion';
    if (filter === 'power') return ev.category === 'power' || ev.category === 'system';
    return true; // 'all'
  });

  return (
    <div className="dash-card timeline-card">
      <div className="card-header">
        <div className="header-left">
          <div className="icon-bubble events-icon">
            <i className="fa-solid fa-clock-rotate-left"></i>
          </div>
          <div>
            <h2>Activity & Event Intelligence</h2>
            <p className="subtitle">Contextual history with noise filtering</p>
          </div>
        </div>
        <div className="filter-dropdown">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="important">Needs Attention (2)</option>
            <option value="all">All Events (17)</option>
            <option value="motion">Motion & Security (8)</option>
            <option value="power">Power & System (4)</option>
          </select>
        </div>
      </div>

      {/* Explanatory note on noise reduction */}
      <div className="intel-banner">
        <i className="fa-solid fa-lightbulb-on"></i>
        <span>
          <strong>Intelligent Grouping:</strong> Repetitive routine movements
          are clustered together, highlighting only actionable anomalies.
        </span>
      </div>

      {/* Structured Activity Timeline */}
      <div className="timeline-stream">
        {filteredEvents.length === 0 ? (
          <div
            style={{
              padding: '1.5rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem'
            }}
          >
            <i
              className="fa-solid fa-check-circle"
              style={{
                fontSize: '1.5rem',
                marginBottom: '0.5rem',
                color: 'var(--accent-emerald)',
                display: 'block'
              }}
            ></i>
            <p>No events found for this filter.</p>
          </div>
        ) : (
          filteredEvents.map((ev) => {
            let icon = 'fa-bell';
            if (ev.category === 'motion') icon = 'fa-person-walking';
            if (ev.category === 'power') icon = 'fa-bolt-lightning';
            if (ev.category === 'system') icon = 'fa-gear';

            return (
              <div
                key={ev.id}
                className={`timeline-item ${ev.severity} ${ev.category} ${
                  ev.important ? 'important' : ''
                }`}
              >
                <div className="timeline-bullet">
                  <i className={`fa-solid ${icon}`}></i>
                </div>
                <div className="timeline-content">
                  <div className="timeline-top">
                    <span className="timeline-title">{ev.title}</span>
                    <span className="timeline-timestamp">{ev.time}</span>
                  </div>
                  <p className="timeline-desc">{ev.desc}</p>
                  <span className={`timeline-tag ${ev.tagClass}`}>{ev.tag}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
