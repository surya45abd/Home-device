import React from 'react';

export default function Navbar({
  presence,
  onSetPresence,
  soundEnabled,
  onToggleSound,
  onOpenSettings
}) {
  const isAway = presence === 'AWAY';

  return (
    <header className="top-nav">
      <div className="nav-brand">
        <div className="brand-icon">
          <i className="fa-solid fa-house-signal"></i>
        </div>
        <div className="brand-info">
          <h1>
            PulseHome <span className="badge-os">React 2.4</span>
          </h1>
          <p className="tagline">Smart Living & Energy Guardian</p>
        </div>
      </div>

      {/* Phone Connection & Presence Indicator */}
      <div className="presence-widget">
        <div className={`phone-status-card ${isAway ? 'away' : ''}`}>
          <div className="phone-icon-wrap">
            <i className="fa-solid fa-mobile-screen-button"></i>
            <span className="signal-radar"></span>
          </div>
          <div className="phone-meta">
            <div className="presence-title">
              <span className={`status-dot ${isAway ? 'away' : 'connected'}`}></span>
              <span>
                {isAway
                  ? 'Away (Phone Disconnected from Mesh)'
                  : 'Mobile Connected (Local Mesh)'}
              </span>
            </div>
            <div className="presence-sub">
              {isAway
                ? 'Cloud Standby • Departed 06:30 AM (4h 15m away)'
                : 'Auto-reconnected • Proximity 2.5m • Battery 64%'}
            </div>
          </div>
        </div>

        {/* Quick Mode Toggle Bar */}
        <div className="quick-sim-controls">
          <button
            className={`btn-mode ${!isAway ? 'active' : ''}`}
            onClick={() => onSetPresence('HOME')}
            title="Simulate returning home with your phone"
          >
            <i className="fa-solid fa-house-user"></i> At Home
          </button>
          <button
            className={`btn-mode ${isAway ? 'active' : ''}`}
            onClick={() => onSetPresence('AWAY')}
            title="Simulate leaving home; phone auto-disconnects"
          >
            <i className="fa-solid fa-person-walking-arrow-right"></i> Away (4h 15m)
          </button>
          <button
            className="btn-icon"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound chimes' : 'Enable sound chimes'}
          >
            <i
              className={`fa-solid ${
                soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'
              }`}
            ></i>
          </button>
          <button
            className="btn-icon"
            onClick={onOpenSettings}
            title="Configure Presence Rules & Geofence"
          >
            <i className="fa-solid fa-gear"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
