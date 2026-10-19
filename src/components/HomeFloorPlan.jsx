import React, { useState } from 'react';

export default function HomeFloorPlan({
  fans,
  lights,
  breakerActive,
  issues,
  onOpenSnapshot,
  onInspectBreaker,
  onToggleFan,
  onToggleLight
}) {
  const [selectedRoom, setSelectedRoom] = useState('all');

  const rooms = [
    {
      id: 'living',
      name: 'Living Room',
      icon: 'fa-couch',
      temp: '22.5°C',
      deviceCount: '2 Devices',
      hasAlert: false,
      alertMsg: null,
      color: '#38bdf8'
    },
    {
      id: 'kitchen',
      name: 'Kitchen & Dining',
      icon: 'fa-utensils',
      temp: '23.0°C',
      deviceCount: '1 Light + Fridge',
      hasAlert: false,
      alertMsg: null,
      color: '#10b981'
    },
    {
      id: 'bedroom',
      name: 'Master Bedroom',
      icon: 'fa-bed',
      temp: '21.8°C',
      deviceCount: '2 Devices',
      hasAlert: false,
      alertMsg: null,
      color: '#818cf8'
    },
    {
      id: 'patio',
      name: 'Patio & Perimeter',
      icon: 'fa-tree',
      temp: '19.4°C',
      deviceCount: '1 Floodlight + Camera',
      hasAlert: issues.motion.active,
      alertMsg: '10:42 AM Motion Detected',
      color: '#f59e0b'
    },
    {
      id: 'utility',
      name: 'Main Meter & Utility',
      icon: 'fa-bolt-lightning',
      temp: '24.1°C',
      deviceCount: 'Main Breaker + Inverter',
      hasAlert: issues.power.active,
      alertMsg: '10:18 AM Voltage Sag',
      color: '#f43f5e'
    }
  ];

  return (
    <div className="dash-card floorplan-card">
      <div className="card-header">
        <div className="header-left">
          <div className="icon-bubble floorplan-icon">
            <i className="fa-solid fa-layer-group"></i>
          </div>
          <div>
            <h2>Interactive Home Layout & Zones</h2>
            <p className="subtitle">
              Overview of all rooms, appliances, and localized anomaly pins
            </p>
          </div>
        </div>
        <div className="floorplan-pills">
          <button
            className={`pill-btn ${selectedRoom === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedRoom('all')}
          >
            All Zones
          </button>
          {rooms.map((r) => (
            <button
              key={r.id}
              className={`pill-btn ${selectedRoom === r.id ? 'active' : ''} ${
                r.hasAlert ? 'has-alert' : ''
              }`}
              onClick={() => setSelectedRoom(r.id)}
            >
              <i className={`fa-solid ${r.icon}`}></i> {r.name}
              {r.hasAlert && <span className="alert-dot"></span>}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Digital Twin Grid */}
      <div className="rooms-map-grid">
        {/* Living Room Card */}
        {(selectedRoom === 'all' || selectedRoom === 'living') && (
          <div className="room-box">
            <div className="room-box-header">
              <div className="room-title">
                <i className="fa-solid fa-couch"></i> Living Room
              </div>
              <span className="room-temp">22.5°C</span>
            </div>
            <div className="room-device-pills">
              <span
                className={`device-pill ${
                  breakerActive && fans[1].active ? 'active' : ''
                }`}
                onClick={() => onToggleFan(1, !fans[1].active)}
              >
                <i className="fa-solid fa-fan"></i> Fan ({fans[1].active ? `Speed ${fans[1].speed}` : 'Off'})
              </span>
              <span
                className={`device-pill ${
                  breakerActive && lights[1].active ? 'active' : ''
                }`}
                onClick={() => onToggleLight(1, !lights[1].active)}
              >
                <i className="fa-solid fa-lightbulb"></i> Chandelier ({lights[1].active ? `${lights[1].brightness}%` : 'Off'})
              </span>
              <span className="device-pill static">
                <i className="fa-solid fa-person-walking"></i> Hallway PIR
              </span>
            </div>
            <div className="room-footer">
              <span>Status: Calm</span>
              <span className="room-wattage">
                {breakerActive
                  ? `${(fans[1].active ? fans[1].baseWatts + fans[1].speed * 10 : 0) + (lights[1].active ? Math.round(lights[1].brightness * 0.32) : 0)}W`
                  : '0W'}
              </span>
            </div>
          </div>
        )}

        {/* Kitchen Card */}
        {(selectedRoom === 'all' || selectedRoom === 'kitchen') && (
          <div className="room-box">
            <div className="room-box-header">
              <div className="room-title">
                <i className="fa-solid fa-utensils"></i> Kitchen & Dining
              </div>
              <span className="room-temp">23.0°C</span>
            </div>
            <div className="room-device-pills">
              <span
                className={`device-pill ${
                  breakerActive && lights[2].active ? 'active' : ''
                }`}
                onClick={() => onToggleLight(2, !lights[2].active)}
              >
                <i className="fa-solid fa-lightbulb"></i> Ceiling Spots ({lights[2].active ? `${lights[2].brightness}%` : 'Off'})
              </span>
              <span className="device-pill static">
                <i className="fa-solid fa-snowflake"></i> Inverter Fridge (180W)
              </span>
            </div>
            <div className="room-footer">
              <span>Status: Auto-off applied</span>
              <span className="room-wattage">
                {breakerActive
                  ? `${180 + (lights[2].active ? Math.round(lights[2].brightness * 0.4) : 0)}W`
                  : '0W'}
              </span>
            </div>
          </div>
        )}

        {/* Master Bedroom Card */}
        {(selectedRoom === 'all' || selectedRoom === 'bedroom') && (
          <div className="room-box">
            <div className="room-box-header">
              <div className="room-title">
                <i className="fa-solid fa-bed"></i> Master Bedroom
              </div>
              <span className="room-temp">21.8°C</span>
            </div>
            <div className="room-device-pills">
              <span
                className={`device-pill ${
                  breakerActive && fans[2].active ? 'active' : ''
                }`}
                onClick={() => onToggleFan(2, !fans[2].active)}
              >
                <i className="fa-solid fa-fan"></i> Ceiling Fan ({fans[2].active ? `Speed ${fans[2].speed}` : 'Off'})
              </span>
              <span
                className={`device-pill ${
                  breakerActive && lights[4].active ? 'active' : ''
                }`}
                onClick={() => onToggleLight(4, !lights[4].active)}
              >
                <i className="fa-solid fa-moon"></i> Nightstand Lamps ({lights[4].active ? `${lights[4].brightness}%` : 'Off'})
              </span>
            </div>
            <div className="room-footer">
              <span>Status: Idle</span>
              <span className="room-wattage">
                {breakerActive
                  ? `${(fans[2].active ? fans[2].baseWatts + fans[2].speed * 10 : 0) + (lights[4].active ? Math.round(lights[4].brightness * 0.2) : 0)}W`
                  : '0W'}
              </span>
            </div>
          </div>
        )}

        {/* Patio & Backyard Card (Highlights the 10:42 AM Motion Event!) */}
        {(selectedRoom === 'all' || selectedRoom === 'patio') && (
          <div className={`room-box ${issues.motion.active ? 'alert-highlight' : ''}`}>
            <div className="room-box-header">
              <div className="room-title">
                <i className="fa-solid fa-tree"></i> Patio & Backyard
              </div>
              {issues.motion.active ? (
                <span className="room-badge-alert">
                  <i className="fa-solid fa-triangle-exclamation"></i> 10:42 AM Motion
                </span>
              ) : (
                <span className="room-temp">19.4°C</span>
              )}
            </div>
            <div className="room-device-pills">
              <span
                className={`device-pill ${
                  breakerActive && lights[3].active ? 'active' : ''
                }`}
                onClick={() => onToggleLight(3, !lights[3].active)}
              >
                <i className="fa-solid fa-shield-halved"></i> Floodlight ({lights[3].active ? '100%' : 'Off'})
              </span>
              <span
                className="device-pill clickable-pill"
                onClick={onOpenSnapshot}
                title="Click to view camera snapshot"
              >
                <i className="fa-solid fa-video"></i> CAM-04 Patio (View Feed)
              </span>
            </div>
            <div className="room-footer">
              {issues.motion.active ? (
                <button className="btn-room-action" onClick={onOpenSnapshot}>
                  Review Motion Snapshot <i className="fa-solid fa-arrow-right"></i>
                </button>
              ) : (
                <>
                  <span>Perimeter Secure</span>
                  <span className="room-wattage">{breakerActive && lights[3].active ? '18W' : '0W'}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Utility / Main Meter Station (Highlights the 10:18 AM Power Sag!) */}
        {(selectedRoom === 'all' || selectedRoom === 'utility') && (
          <div className={`room-box ${issues.power.active ? 'critical-highlight' : ''}`}>
            <div className="room-box-header">
              <div className="room-title">
                <i className="fa-solid fa-bolt-lightning"></i> Utility & Meter Station
              </div>
              {issues.power.active ? (
                <span className="room-badge-critical">
                  <i className="fa-solid fa-bolt"></i> 10:18 AM Voltage Dip
                </span>
              ) : (
                <span className="room-temp">230V AC</span>
              )}
            </div>
            <div className="room-device-pills">
              <span className={`device-pill ${breakerActive ? 'active' : ''}`}>
                <i className="fa-solid fa-power-off"></i> Main Breaker ({breakerActive ? 'Armed' : 'Tripped'})
              </span>
              <span className="device-pill static">
                <i className="fa-solid fa-network-wired"></i> Zigbee Mesh Hub
              </span>
            </div>
            <div className="room-footer">
              {issues.power.active ? (
                <button className="btn-room-action critical" onClick={onInspectBreaker}>
                  Inspect Circuit Health <i className="fa-solid fa-arrow-right"></i>
                </button>
              ) : (
                <>
                  <span>Grid Feed: 50.1 Hz</span>
                  <span className="room-wattage">25W (Hub)</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
