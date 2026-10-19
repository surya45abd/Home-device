import React, { useState } from 'react';

export default function TelemetryAccordion({ onForceSync, onRebootHub }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dash-card telemetry-card">
      <div
        className="collapsible-header"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="header-left">
          <i className="fa-solid fa-server"></i>
          <span>Hub Diagnostics & Technical Metadata</span>
        </div>
        <i
          className="fa-solid fa-chevron-down"
          style={{
            transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        ></i>
      </div>

      {!collapsed && (
        <div className="telemetry-body">
          <div className="telemetry-grid">
            <div className="tele-item">
              <span className="tele-label">Hub Mesh Link</span>
              <span className="tele-val text-success">
                <i className="fa-solid fa-circle-check"></i> Connected
              </span>
            </div>
            <div className="tele-item">
              <span className="tele-label">Gateway Battery</span>
              <span className="tele-val">64% (Good)</span>
            </div>
            <div className="tele-item">
              <span className="tele-label">Signal (RSSI)</span>
              <span className="tele-val">-67 dBm (Strong)</span>
            </div>
            <div className="tele-item">
              <span className="tele-label">Firmware</span>
              <span className="tele-val">v2.4.1 (Latest)</span>
            </div>
            <div className="tele-item">
              <span className="tele-label">Last Sync</span>
              <span className="tele-val">10:45 AM (Just now)</span>
            </div>
            <div className="tele-item">
              <span className="tele-label">Last Restart</span>
              <span className="tele-val">Yesterday, 11:34 PM</span>
            </div>
          </div>

          <div className="telemetry-actions">
            <button className="btn-sm" onClick={onForceSync}>
              <i className="fa-solid fa-rotate"></i> Force Sync
            </button>
            <button className="btn-sm" onClick={onRebootHub}>
              <i className="fa-solid fa-power-off"></i> Reboot Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
