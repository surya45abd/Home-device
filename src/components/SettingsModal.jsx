import React, { useState } from 'react';

export default function SettingsModal({ isOpen, onClose, onSave }) {
  const [awayTimeout, setAwayTimeout] = useState('15');
  const [autoOffFans, setAutoOffFans] = useState(true);
  const [autoOffLights, setAutoOffLights] = useState(true);
  const [autoArmSecurity, setAutoArmSecurity] = useState(true);
  const [meshProtocol, setMeshProtocol] = useState('uwb');

  if (!isOpen) return null;

  const handleSave = () => {
    if (onSave) {
      onSave({
        awayTimeout,
        autoOffFans,
        autoOffLights,
        autoArmSecurity,
        meshProtocol
      });
    }
    onClose();
  };

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card settings-modal-card">
        <div className="modal-header">
          <div className="modal-title">
            <i className="fa-solid fa-sliders"></i> Phone Presence & Away-Guard Rules
          </div>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-content">
          <div className="settings-section">
            <label className="settings-label">
              <span>Away Auto-Disconnect Delay</span>
              <p>Time after phone leaves perimeter before home enters autonomous eco-mode</p>
            </label>
            <select
              value={awayTimeout}
              onChange={(e) => setAwayTimeout(e.target.value)}
              className="settings-select"
            >
              <option value="5">5 Minutes (Immediate Eco-Shield)</option>
              <option value="15">15 Minutes (Recommended Standard)</option>
              <option value="30">30 Minutes (Relaxed Proximity)</option>
              <option value="60">60 Minutes</option>
            </select>
          </div>

          <div className="settings-section">
            <label className="settings-label">
              <span>Proximity Detection Technology</span>
              <p>Hardware radio used for local zero-latency connection handshake</p>
            </label>
            <select
              value={meshProtocol}
              onChange={(e) => setMeshProtocol(e.target.value)}
              className="settings-select"
            >
              <option value="uwb">Ultra-Wideband (UWB) Sub-meter Proximity</option>
              <option value="ble">Bluetooth Low Energy (BLE) Beacon</option>
              <option value="wifi">Wi-Fi 6 Local Gateway Mesh</option>
            </select>
          </div>

          <div className="settings-section toggles-list">
            <h4>Autonomous Safeguards on Departure</h4>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={autoOffFans}
                onChange={(e) => setAutoOffFans(e.target.checked)}
              />
              <div>
                <strong>Auto-Shutdown Non-Essential Fans</strong>
                <span>Stops ceiling fans after away timeout</span>
              </div>
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={autoOffLights}
                onChange={(e) => setAutoOffLights(e.target.checked)}
              />
              <div>
                <strong>Auto-Shutdown Interior Lighting</strong>
                <span>Dims and turns off living & bedroom spots</span>
              </div>
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={autoArmSecurity}
                onChange={(e) => setAutoArmSecurity(e.target.checked)}
              />
              <div>
                <strong>Arm Perimeter Security Floodlights</strong>
                <span>Triggers floodlight deterrent on motion</span>
              </div>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-action secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-action primary" onClick={handleSave}>
            <i className="fa-solid fa-floppy-disk"></i> Save Presence Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
