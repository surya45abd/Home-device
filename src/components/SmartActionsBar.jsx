import React from 'react';

export default function SmartActionsBar({
  onClearAllMinor,
  onActivateComfort,
  onExportReport,
  onSecurityLockdown
}) {
  return (
    <div className="dash-card smart-actions-card">
      <div className="smart-actions-inner">
        <div className="smart-actions-text">
          <div className="actions-header">
            <span className="recipe-badge">Recommended Next Actions</span>
            <h3>Quick Actions for Returning Home</h3>
          </div>
          <p>
            Avoid cognitive fatigue. Choose one-click automations to set up your home right now.
          </p>
        </div>

        <div className="smart-action-buttons">
          <button
            className="btn-recipe comfort"
            onClick={onActivateComfort}
            title="Turns on warm ambient lighting and living room fan at speed 3"
          >
            <i className="fa-solid fa-mug-hot"></i>
            <div>
              <strong>Restore Evening Comfort</strong>
              <span>Living Room Light & Fan (Speed 3)</span>
            </div>
          </button>

          <button
            className="btn-recipe resolve"
            onClick={onClearAllMinor}
            title="Acknowledge power sag and mark motion as safe courier"
          >
            <i className="fa-solid fa-check-double"></i>
            <div>
              <strong>Resolve & Archive All Alerts</strong>
              <span>Mark all 2 incidents as resolved</span>
            </div>
          </button>

          <button
            className="btn-recipe lockdown"
            onClick={onSecurityLockdown}
            title="Turn on security floodlights and arm all zones"
          >
            <i className="fa-solid fa-shield-virus"></i>
            <div>
              <strong>Max Perimeter Lockdown</strong>
              <span>Arm all motion & floodlights</span>
            </div>
          </button>

          <button
            className="btn-recipe export"
            onClick={onExportReport}
            title="Export full diagnostic report"
          >
            <i className="fa-solid fa-file-arrow-down"></i>
            <div>
              <strong>Export Incident Audit</strong>
              <span>Save 17-event JSON log</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
