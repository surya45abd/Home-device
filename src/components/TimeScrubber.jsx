import React, { useState, useEffect } from 'react';

const TIMELINE_STOPS = [
  {
    minuteOffset: 0,
    time: '06:30 AM',
    label: 'Departure',
    desc: 'You left the home perimeter. Phone disconnected from local mesh. Away-Guard armed.',
    icon: 'fa-person-walking-arrow-right',
    type: 'neutral'
  },
  {
    minuteOffset: 165,
    time: '09:15 AM',
    label: 'Eco Automation',
    desc: '3 lights and bedroom ceiling fan automatically switched off to conserve 0.84 kWh.',
    icon: 'fa-leaf',
    type: 'success'
  },
  {
    minuteOffset: 185,
    time: '09:35 AM',
    label: 'OTA Firmware Update',
    desc: 'Smart hub updated firmware to v2.4.1 with zero downtime or mesh disruption.',
    icon: 'fa-arrow-up-from-bracket',
    type: 'neutral'
  },
  {
    minuteOffset: 228,
    time: '10:18 AM',
    label: 'Grid Voltage Sag',
    desc: 'Main meter registered 195V drop. Smart gateway rebooted smoothly; electronics protected.',
    icon: 'fa-bolt-lightning',
    type: 'critical'
  },
  {
    minuteOffset: 252,
    time: '10:42 AM',
    label: 'Patio Motion Anomaly',
    desc: 'Perimeter motion detected. Security floodlight activated and courier snapshot captured.',
    icon: 'fa-shield-halved',
    type: 'warning'
  },
  {
    minuteOffset: 255,
    time: '10:45 AM',
    label: 'Return & Reconnection',
    desc: 'Phone proximity re-acquired via Bluetooth/UWB. Full 17-event catch-up briefing synchronized.',
    icon: 'fa-house-user',
    type: 'success'
  }
];

export default function TimeScrubber({ onSelectStop }) {
  const [currentIndex, setCurrentIndex] = useState(5); // Default to current return time (10:45 AM)
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= TIMELINE_STOPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          if (onSelectStop) onSelectStop(TIMELINE_STOPS[next]);
          return next;
        });
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, onSelectStop]);

  const currentStop = TIMELINE_STOPS[currentIndex];

  const handleSliderChange = (e) => {
    const idx = parseInt(e.target.value, 10);
    setCurrentIndex(idx);
    setIsPlaying(false);
    if (onSelectStop) onSelectStop(TIMELINE_STOPS[idx]);
  };

  const handlePlayToggle = () => {
    if (currentIndex >= TIMELINE_STOPS.length - 1) {
      setCurrentIndex(0);
      if (onSelectStop) onSelectStop(TIMELINE_STOPS[0]);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="dash-card time-scrubber-card">
      <div className="card-header">
        <div className="header-left">
          <div className="icon-bubble scrubber-icon">
            <i className="fa-solid fa-clock-rotate-left"></i>
          </div>
          <div>
            <h2>"While You Were Away" Interactive Time Scrubber</h2>
            <p className="subtitle">
              Scrub back through the 4h 15m duration to see how events unfolded
            </p>
          </div>
        </div>
        <button
          className={`btn-scrubber-play ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlayToggle}
        >
          <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          <span>{isPlaying ? 'Pause Playback' : 'Replay Away Timeline'}</span>
        </button>
      </div>

      {/* Scrubber Track with Interactive Event Pins */}
      <div className="scrubber-track-container">
        <div className="scrubber-pins">
          {TIMELINE_STOPS.map((stop, idx) => (
            <div
              key={stop.time}
              className={`scrubber-pin ${idx === currentIndex ? 'active' : ''} ${stop.type}`}
              style={{ left: `${(idx / (TIMELINE_STOPS.length - 1)) * 96 + 2}%` }}
              onClick={() => {
                setCurrentIndex(idx);
                setIsPlaying(false);
                if (onSelectStop) onSelectStop(stop);
              }}
              title={`${stop.time}: ${stop.label}`}
            >
              <div className="pin-dot"></div>
              <span className="pin-time">{stop.time}</span>
            </div>
          ))}
        </div>

        <input
          type="range"
          min="0"
          max={TIMELINE_STOPS.length - 1}
          value={currentIndex}
          onChange={handleSliderChange}
          className="scrubber-range-input"
        />
      </div>

      {/* Focused Milestone Card */}
      <div className={`scrubber-event-display ${currentStop.type}`}>
        <div className="scrubber-event-top">
          <span className="scrubber-time-badge">
            <i className={`fa-solid ${currentStop.icon}`}></i> {currentStop.time}
          </span>
          <span className={`scrubber-type-tag ${currentStop.type}`}>
            {currentStop.label}
          </span>
        </div>
        <p className="scrubber-event-desc">{currentStop.desc}</p>
      </div>
    </div>
  );
}
