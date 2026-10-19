import React from 'react';

export default function SimulationSandbox({
  onSimulateAway,
  onSimulateReturn,
  onSimulateSurge,
  onResetDemo
}) {
  return (
    <div className="dash-card simulation-sandbox">
      <div className="card-header">
        <div className="header-left">
          <div className="icon-bubble sandbox-icon">
            <i className="fa-solid fa-vial-circle-check"></i>
          </div>
          <div>
            <h3>Interactive Evaluator Sandbox</h3>
            <p className="subtitle">
              Test live states & scenarios for assignment evaluation
            </p>
          </div>
        </div>
      </div>
      <div className="sandbox-buttons">
        <button className="btn-sandbox" onClick={onSimulateAway}>
          <i className="fa-solid fa-person-walking"></i> 1. Simulate Leaving Home (Auto-Disconnect)
        </button>
        <button className="btn-sandbox" onClick={onSimulateReturn}>
          <i className="fa-solid fa-person-walking-dashed-line-arrow-right"></i> 2. Simulate Returning Home (Auto-Reconnect & Catchup)
        </button>
        <button className="btn-sandbox" onClick={onSimulateSurge}>
          <i className="fa-solid fa-bolt"></i> 3. Trigger Power Surge Anomaly
        </button>
        <button className="btn-sandbox" onClick={onResetDemo}>
          <i className="fa-solid fa-arrow-rotate-left"></i> Reset Demo State
        </button>
      </div>
    </div>
  );
}
