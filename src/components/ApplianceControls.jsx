import React, { useState } from 'react';

export default function ApplianceControls({
  fans,
  lights,
  breakerActive,
  onToggleFan,
  onChangeFanSpeed,
  onToggleLight,
  onChangeLightBrightness
}) {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="dash-card appliances-card">
      <div className="card-header">
        <div className="header-left">
          <div className="icon-bubble appliances-icon">
            <i className="fa-solid fa-sliders"></i>
          </div>
          <div>
            <h2>Home Appliance Controls</h2>
            <p className="subtitle">
              Real-time control over fans, lights, and automated zones
            </p>
          </div>
        </div>
        <div className="filter-tabs">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Devices (6)
          </button>
          <button
            className={`tab-btn ${activeTab === 'fans' ? 'active' : ''}`}
            onClick={() => setActiveTab('fans')}
          >
            <i className="fa-solid fa-fan"></i> Fans (2)
          </button>
          <button
            className={`tab-btn ${activeTab === 'lights' ? 'active' : ''}`}
            onClick={() => setActiveTab('lights')}
          >
            <i className="fa-solid fa-lightbulb"></i> Lights (4)
          </button>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="device-grid">
        {/* Device 1: Living Room Fan */}
        {(activeTab === 'all' || activeTab === 'fans') && (
          <div className="device-card fan-card">
            <div className="dev-card-top">
              <div
                className={`dev-icon-wrap fan-anim ${
                  breakerActive && fans[1].active ? 'rotating' : ''
                } ${fans[1].speed >= 4 ? 'fast' : fans[1].speed <= 2 ? 'slow' : ''}`}
              >
                <i className="fa-solid fa-fan"></i>
              </div>
              <div className="dev-info">
                <div className="dev-name">{fans[1].name}</div>
                <div className="dev-location">
                  {fans[1].active && breakerActive
                    ? `Speed ${fans[1].speed} (Medium) • ${
                        fans[1].baseWatts + fans[1].speed * fans[1].wattsPerSpeed
                      }W`
                    : 'Turned Off • 0W'}
                </div>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={fans[1].active && breakerActive}
                  disabled={!breakerActive}
                  onChange={(e) => onToggleFan(1, e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="dev-slider-control">
              <div className="slider-header">
                <span>Fan Speed</span>
                <span>{fans[1].active && breakerActive ? `${fans[1].speed * 20}%` : 'Off'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={fans[1].speed}
                disabled={!fans[1].active || !breakerActive}
                className={`range-slider ${
                  !fans[1].active || !breakerActive ? 'disabled' : ''
                }`}
                onChange={(e) => onChangeFanSpeed(1, parseInt(e.target.value, 10))}
              />
            </div>
          </div>
        )}

        {/* Device 2: Master Bedroom Fan */}
        {(activeTab === 'all' || activeTab === 'fans') && (
          <div className="device-card fan-card">
            <div className="dev-card-top">
              <div
                className={`dev-icon-wrap fan-anim ${
                  breakerActive && fans[2].active ? 'rotating' : ''
                } ${fans[2].speed >= 4 ? 'fast' : fans[2].speed <= 2 ? 'slow' : ''}`}
              >
                <i className="fa-solid fa-fan"></i>
              </div>
              <div className="dev-info">
                <div className="dev-name">{fans[2].name}</div>
                <div className="dev-location">
                  {fans[2].active && breakerActive
                    ? `Speed ${fans[2].speed} • ${
                        fans[2].baseWatts + fans[2].speed * fans[2].wattsPerSpeed
                      }W`
                    : 'Auto-off when Away • 0W'}
                </div>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={fans[2].active && breakerActive}
                  disabled={!breakerActive}
                  onChange={(e) => onToggleFan(2, e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="dev-slider-control">
              <div className="slider-header">
                <span>Fan Speed</span>
                <span>{fans[2].active && breakerActive ? `${fans[2].speed * 20}%` : 'Off'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={fans[2].speed}
                disabled={!fans[2].active || !breakerActive}
                className={`range-slider ${
                  !fans[2].active || !breakerActive ? 'disabled' : ''
                }`}
                onChange={(e) => onChangeFanSpeed(2, parseInt(e.target.value, 10))}
              />
            </div>
          </div>
        )}

        {/* Device 3: Living Room Lighting */}
        {(activeTab === 'all' || activeTab === 'lights') && (
          <div className="device-card light-card">
            <div className="dev-card-top">
              <div
                className={`dev-icon-wrap light-glow ${
                  breakerActive && lights[1].active ? 'on' : ''
                }`}
                style={{
                  opacity:
                    breakerActive && lights[1].active
                      ? 0.3 + (lights[1].brightness / 100) * 0.7
                      : 0.3
                }}
              >
                <i className="fa-solid fa-lightbulb"></i>
              </div>
              <div className="dev-info">
                <div className="dev-name">{lights[1].name}</div>
                <div className="dev-location">
                  Warm Amber •{' '}
                  {lights[1].active && breakerActive
                    ? `${Math.round(
                        (lights[1].brightness / 100) * lights[1].maxWatts
                      )}W`
                    : '0W'}
                </div>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={lights[1].active && breakerActive}
                  disabled={!breakerActive}
                  onChange={(e) => onToggleLight(1, e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="dev-slider-control">
              <div className="slider-header">
                <span>Brightness</span>
                <span>
                  {lights[1].active && breakerActive
                    ? `${lights[1].brightness}%`
                    : 'Off'}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={lights[1].brightness}
                disabled={!lights[1].active || !breakerActive}
                className={`range-slider ${
                  !lights[1].active || !breakerActive ? 'disabled' : ''
                }`}
                onChange={(e) =>
                  onChangeLightBrightness(1, parseInt(e.target.value, 10))
                }
              />
            </div>
          </div>
        )}

        {/* Device 4: Kitchen Recessed Spots */}
        {(activeTab === 'all' || activeTab === 'lights') && (
          <div className="device-card light-card">
            <div className="dev-card-top">
              <div
                className={`dev-icon-wrap light-glow ${
                  breakerActive && lights[2].active ? 'on' : ''
                }`}
              >
                <i className="fa-solid fa-lightbulb"></i>
              </div>
              <div className="dev-info">
                <div className="dev-name">{lights[2].name}</div>
                <div className="dev-location">
                  {lights[2].active && breakerActive
                    ? `${Math.round(
                        (lights[2].brightness / 100) * lights[2].maxWatts
                      )}W`
                    : 'Turned off at 9:15 AM • 0W'}
                </div>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={lights[2].active && breakerActive}
                  disabled={!breakerActive}
                  onChange={(e) => onToggleLight(2, e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="dev-slider-control">
              <div className="slider-header">
                <span>Brightness</span>
                <span>
                  {lights[2].active && breakerActive
                    ? `${lights[2].brightness}%`
                    : 'Off'}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={lights[2].brightness}
                disabled={!lights[2].active || !breakerActive}
                className={`range-slider ${
                  !lights[2].active || !breakerActive ? 'disabled' : ''
                }`}
                onChange={(e) =>
                  onChangeLightBrightness(2, parseInt(e.target.value, 10))
                }
              />
            </div>
          </div>
        )}

        {/* Device 5: Exterior Porch Floodlight */}
        {(activeTab === 'all' || activeTab === 'lights') && (
          <div className="device-card light-card">
            <div className="dev-card-top">
              <div
                className={`dev-icon-wrap light-glow ${
                  breakerActive && lights[3].active ? 'on' : ''
                }`}
              >
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div className="dev-info">
                <div className="dev-name">{lights[3].name}</div>
                <div className="dev-location">
                  {lights[3].active && breakerActive
                    ? 'Triggered at 10:42 AM • 18W'
                    : 'Standby • 0W'}
                </div>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={lights[3].active && breakerActive}
                  disabled={!breakerActive}
                  onChange={(e) => onToggleLight(3, e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="dev-slider-control">
              <div className="slider-header">
                <span>Deterrent Intensity</span>
                <span>
                  {lights[3].active && breakerActive
                    ? `${lights[3].brightness}%`
                    : 'Off'}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={lights[3].brightness}
                disabled={!lights[3].active || !breakerActive}
                className={`range-slider ${
                  !lights[3].active || !breakerActive ? 'disabled' : ''
                }`}
                onChange={(e) =>
                  onChangeLightBrightness(3, parseInt(e.target.value, 10))
                }
              />
            </div>
          </div>
        )}

        {/* Device 6: Bedroom Lamps */}
        {(activeTab === 'all' || activeTab === 'lights') && (
          <div className="device-card light-card">
            <div className="dev-card-top">
              <div
                className={`dev-icon-wrap light-glow ${
                  breakerActive && lights[4].active ? 'on' : ''
                }`}
              >
                <i className="fa-solid fa-moon"></i>
              </div>
              <div className="dev-info">
                <div className="dev-name">{lights[4].name}</div>
                <div className="dev-location">
                  {lights[4].active && breakerActive
                    ? `${Math.round(
                        (lights[4].brightness / 100) * lights[4].maxWatts
                      )}W`
                    : 'Standby Mode • 0W'}
                </div>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={lights[4].active && breakerActive}
                  disabled={!breakerActive}
                  onChange={(e) => onToggleLight(4, e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="dev-slider-control">
              <div className="slider-header">
                <span>Brightness</span>
                <span>
                  {lights[4].active && breakerActive
                    ? `${lights[4].brightness}%`
                    : 'Off'}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={lights[4].brightness}
                disabled={!lights[4].active || !breakerActive}
                className={`range-slider ${
                  !lights[4].active || !breakerActive ? 'disabled' : ''
                }`}
                onChange={(e) =>
                  onChangeLightBrightness(4, parseInt(e.target.value, 10))
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
