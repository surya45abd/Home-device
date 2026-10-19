import React from 'react';

export default function AwayDigestHero({
  issues,
  onResolvePower,
  onDismissPower,
  onOpenSnapshot,
  onDismissMotion,
  onRestoreComfort,
  onCloseDigest
}) {
  const allResolved = !issues.power.active && !issues.motion.active;

  return (
    <section className="digest-hero">
      <div className="digest-header">
        <div className="digest-badge">
          <i className="fa-solid fa-sparkles"></i>
          <span>Welcome Back Digest • Away for 4h 15m (06:30 AM – 10:45 AM)</span>
        </div>
        <button
          className="btn-text-close"
          onClick={onCloseDigest}
          title="Minimize Briefing"
        >
          Dismiss <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div className="digest-headline">
        <h2>
          {allResolved ? (
            <span>
              <i className="fa-solid fa-circle-check text-success"></i> All away issues resolved! Your home is secure.
            </span>
          ) : (
            "Here's what deserves your attention right now"
          )}
        </h2>
        <p className="digest-desc">
          We analyzed 17 sensor readings while you were away.{' '}
          <strong>
            {allResolved
              ? 'No pending critical actions.'
              : '2 critical items require your review.'}
          </strong>{' '}
          Eco-automations saved you <strong>0.84 kWh</strong>.
        </p>
      </div>

      {/* Priority Cards Grid (Triage) */}
      <div className="priority-cards-grid">
        {/* Critical Issue 1: Power Drop */}
        {issues.power.active && (
          <div className="triage-card critical">
            <div className="triage-top">
              <span className="triage-pill pill-critical">
                <i className="fa-solid fa-triangle-exclamation"></i> Action Required
              </span>
              <span className="event-time">10:18 AM</span>
            </div>
            <h3>Main Grid Voltage Drop & Gateway Reset</h3>
            <p>
              Main meter detected an anomaly (voltage dipped to 195V). Smart gateway
              rebooted smoothly; appliances protected by surge isolation.
            </p>
            <div className="triage-actions">
              <button className="btn-action primary" onClick={onResolvePower}>
                <i className="fa-solid fa-bolt-lightning"></i> Inspect Main Breaker
              </button>
              <button className="btn-action secondary" onClick={onDismissPower}>
                Acknowledge
              </button>
            </div>
          </div>
        )}

        {/* Critical Issue 2: Motion Detected */}
        {issues.motion.active && (
          <div className="triage-card warning">
            <div className="triage-top">
              <span className="triage-pill pill-warning">
                <i className="fa-solid fa-shield-halved"></i> Security Anomaly
              </span>
              <span className="event-time">10:42 AM</span>
            </div>
            <h3>Patio Perimeter Motion Detected</h3>
            <p>
              Motion detected near rear patio while Away Mode was active. Smart
              floodlight turned ON automatically as a visual deterrent.
            </p>
            <div className="triage-actions">
              <button className="btn-action primary" onClick={onOpenSnapshot}>
                <i className="fa-solid fa-camera"></i> View Camera Snapshot
              </button>
              <button className="btn-action secondary" onClick={onDismissMotion}>
                Mark as Safe (Delivery)
              </button>
            </div>
          </div>
        )}

        {/* Smart Automation Summary */}
        <div className="triage-card success">
          <div className="triage-top">
            <span className="triage-pill pill-success">
              <i className="fa-solid fa-leaf"></i> Eco-Save Automated
            </span>
            <span className="event-time">09:15 AM</span>
          </div>
          <h3>Lights & Fans Auto-Secured</h3>
          <p>
            3 lights and 1 ceiling fan left running were shut down 15 min after your
            phone departed. Estimated savings: <strong>$0.28 / 0.84 kWh</strong>.
          </p>
          <div className="triage-actions">
            <button className="btn-action outline" onClick={onRestoreComfort}>
              <i className="fa-solid fa-rotate-left"></i> Restore Living Room Comfort
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
