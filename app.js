/**
 * PulseHome OS 2.4 - Interactive Application Logic
 * Implements Presence Simulation, Real-time Energy Calculations,
 * Intelligent Triage of Away Events, and Live Appliance Control.
 */

// --- Global State ---
const state = {
  presence: 'HOME', // 'HOME' | 'AWAY'
  soundEnabled: true,
  mainBreakerActive: true,
  baseIdleWattage: 305, // Refrigerator (180W) + WiFi Hub (25W) + Standby electronics (100W)
  todayBaseKwh: 4.82,
  
  // Issues from the away period
  issues: {
    power: { active: true, title: "Main Grid Voltage Drop & Gateway Reset", time: "10:18 AM", severity: "critical" },
    motion: { active: true, title: "Patio Perimeter Motion Detected", time: "10:42 AM", severity: "warning" }
  },

  // Appliance states
  fans: {
    1: { name: "Living Room Fan", active: true, speed: 3, baseWatts: 15, wattsPerSpeed: 10 },
    2: { name: "Bedroom Ceiling Fan", active: false, speed: 1, baseWatts: 15, wattsPerSpeed: 10 }
  },
  
  lights: {
    1: { name: "Living Room Lighting", active: true, brightness: 75, maxWatts: 32 },
    2: { name: "Kitchen Ceiling Spots", active: false, brightness: 50, maxWatts: 40 },
    3: { name: "Porch Motion Floodlight", active: true, brightness: 100, maxWatts: 18 },
    4: { name: "Bedroom Nightstand Lamps", active: false, brightness: 40, maxWatts: 20 }
  },

  // Timeline events representing the 17 raw events reimagined with context
  events: [
    {
      id: 'e1',
      time: '10:42 AM',
      category: 'motion',
      important: true,
      severity: 'warning',
      title: 'Patio Motion Detected',
      desc: 'Rear motion sensor detected a person while in Away Mode. Auto-activated security floodlight.',
      tag: 'Security Anomaly',
      tagClass: 'tag-warning'
    },
    {
      id: 'e2',
      time: '10:18 AM',
      category: 'power',
      important: true,
      severity: 'critical',
      title: 'Main Grid Voltage Dip & Gateway Reset',
      desc: 'Main meter registered 195V line sag. Smart hub disconnected for 42s then restored with zero data loss.',
      tag: 'Breaker Anomaly',
      tagClass: 'tag-critical'
    },
    {
      id: 'e3',
      time: '10:05 AM',
      category: 'motion',
      important: false,
      severity: 'info',
      title: 'Hallway Motion (Routine Cluster)',
      desc: 'Clustered 3 routine pet movements between 9:47 AM and 10:05 AM. Filtered out as non-urgent.',
      tag: '3 Events Clustered',
      tagClass: 'tag-clustered'
    },
    {
      id: 'e4',
      time: '09:47 AM',
      category: 'motion',
      important: false,
      severity: 'info',
      title: 'Hallway Motion Detected',
      desc: 'Indoor sensor pinged. Verified within low-height pet threshold.',
      tag: 'Routine Motion',
      tagClass: 'tag-info'
    },
    {
      id: 'e5',
      time: '09:35 AM',
      category: 'system',
      important: false,
      severity: 'info',
      title: 'Software Updated to v2.4.1',
      desc: 'OTA firmware patch applied successfully. Improved mesh stability and power metering accuracy.',
      tag: 'System Update',
      tagClass: 'tag-info'
    },
    {
      id: 'e6',
      time: '09:31 AM',
      category: 'motion',
      important: false,
      severity: 'info',
      title: 'Front Foyer Movement Detected',
      desc: 'Detected occupant exit. Pre-departure routine initiated.',
      tag: 'Departure Event',
      tagClass: 'tag-info'
    },
    {
      id: 'e7',
      time: '09:15 AM',
      category: 'power',
      important: false,
      severity: 'info',
      title: 'Auto-Eco Away Protocol Engaged',
      desc: 'Phone left geofence. 3 lights and Bedroom fan shut down automatically to prevent power waste.',
      tag: 'Eco-Automation',
      tagClass: 'tag-info'
    }
  ]
};

// --- Web Audio API Synthesizer (Modern Digital Chimes) ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

function playSound(type) {
  if (!state.soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'reconnect') {
      // Pleasant futuristic ascending chime (C5 -> E5 -> G5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.25);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'alert') {
      // Gentle warning double blip
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(440, now + 0.1);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'toggle') {
      // Subtle tactile click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (err) {
    console.debug('Web audio playback note:', err);
  }
}

// --- Energy & Wattage Calculations ---
function calculateTotalWattage() {
  if (!state.mainBreakerActive) {
    return 0;
  }

  let total = state.baseIdleWattage;

  // Fans wattage
  for (const id in state.fans) {
    const f = state.fans[id];
    if (f.active) {
      total += f.baseWatts + (f.speed * f.wattsPerSpeed);
    }
  }

  // Lights wattage
  for (const id in state.lights) {
    const l = state.lights[id];
    if (l.active) {
      total += Math.round((l.brightness / 100) * l.maxWatts);
    }
  }

  return total;
}

function updateEnergyDisplay() {
  const wattage = calculateTotalWattage();
  const wattElem = document.getElementById('currentWattage');
  const loadStatus = document.getElementById('loadStatus');
  const gaugeFill = document.getElementById('meterGaugeFill');
  const breakerStatusText = document.getElementById('breakerStatusText');

  if (wattElem) {
    wattElem.textContent = wattage;
  }

  if (!state.mainBreakerActive) {
    if (loadStatus) {
      loadStatus.textContent = 'Breaker Isolated (0W)';
      loadStatus.className = 'metric-delta danger';
    }
    if (gaugeFill) gaugeFill.style.width = '0%';
    if (breakerStatusText) {
      breakerStatusText.textContent = 'ISOLATED / OFF';
      breakerStatusText.className = 'metric-status tripped';
    }
    return;
  }

  if (breakerStatusText) {
    breakerStatusText.textContent = 'ARMED & ACTIVE';
    breakerStatusText.className = 'metric-status online';
  }

  // Gauge percentage (out of max 3000W safe residential load for this circuit)
  const pct = Math.min(100, Math.max(5, (wattage / 3000) * 100));
  if (gaugeFill) {
    gaugeFill.style.width = `${pct}%`;
  }

  if (loadStatus) {
    if (wattage < 350) {
      loadStatus.textContent = 'Low Eco Baseline';
      loadStatus.className = 'metric-delta positive';
    } else if (wattage < 800) {
      loadStatus.textContent = 'Normal Residential';
      loadStatus.className = 'metric-delta positive';
    } else if (wattage < 1800) {
      loadStatus.textContent = 'Elevated Load';
      loadStatus.className = 'metric-delta warning';
    } else {
      loadStatus.textContent = 'Peak Load Warning';
      loadStatus.className = 'metric-delta danger';
    }
  }
}

// --- Fan Controller Functions ---
function toggleFan(id, isActive) {
  playSound('toggle');
  const fan = state.fans[id];
  fan.active = isActive;

  const anim = document.getElementById(`fanAnim${id}`);
  const speedVal = document.getElementById(`fanSpeedVal${id}`);
  const speedPct = document.getElementById(`fanSpeedPercent${id}`);
  const range = document.getElementById(`fanRange${id}`);

  if (isActive) {
    if (anim) {
      anim.classList.add('rotating');
      anim.classList.toggle('fast', fan.speed >= 4);
      anim.classList.toggle('slow', fan.speed <= 2);
    }
    if (range) range.classList.remove('disabled'), (range.disabled = false);
    if (speedVal) speedVal.textContent = `Speed ${fan.speed} • ${fan.baseWatts + fan.speed * fan.wattsPerSpeed}W`;
    if (speedPct) speedPct.textContent = `${fan.speed * 20}%`;
    showToast(`${fan.name} powered ON`, 'info');
  } else {
    if (anim) anim.classList.remove('rotating', 'fast', 'slow');
    if (range) range.classList.add('disabled'), (range.disabled = true);
    if (speedVal) speedVal.textContent = `Turned Off • 0W`;
    if (speedPct) speedPct.textContent = `Off`;
    showToast(`${fan.name} turned OFF`, 'info');
  }

  updateEnergyDisplay();
}

function changeFanSpeed(id, val) {
  const speed = parseInt(val, 10);
  const fan = state.fans[id];
  fan.speed = speed;

  const anim = document.getElementById(`fanAnim${id}`);
  const speedVal = document.getElementById(`fanSpeedVal${id}`);
  const speedPct = document.getElementById(`fanSpeedPercent${id}`);

  if (anim) {
    anim.classList.toggle('fast', speed >= 4);
    anim.classList.toggle('slow', speed <= 2);
  }

  if (speedVal) speedVal.textContent = `Speed ${speed} • ${fan.baseWatts + speed * fan.wattsPerSpeed}W`;
  if (speedPct) speedPct.textContent = `${speed * 20}%`;

  updateEnergyDisplay();
}

// --- Light Controller Functions ---
function toggleLight(id, isActive) {
  playSound('toggle');
  const light = state.lights[id];
  light.active = isActive;

  const glow = document.getElementById(`lightGlow${id}`);
  const range = document.getElementById(`lightRange${id}`);
  const briVal = document.getElementById(`lightBriVal${id}`);
  const wattElem = document.getElementById(`lightWatt${id}`);

  if (isActive) {
    if (glow) glow.classList.add('on');
    if (range) range.classList.remove('disabled'), (range.disabled = false);
    if (briVal) briVal.textContent = `${light.brightness}%`;
    if (wattElem) wattElem.textContent = `${Math.round((light.brightness / 100) * light.maxWatts)}W`;
    showToast(`${light.name} illuminated`, 'info');
  } else {
    if (glow) glow.classList.remove('on');
    if (range) range.classList.add('disabled'), (range.disabled = true);
    if (briVal) briVal.textContent = `Off`;
    if (wattElem) wattElem.textContent = `0W`;
    showToast(`${light.name} turned OFF`, 'info');
  }

  updateEnergyDisplay();
}

function changeLightBrightness(id, val) {
  const brightness = parseInt(val, 10);
  const light = state.lights[id];
  light.brightness = brightness;

  const briVal = document.getElementById(`lightBriVal${id}`);
  const wattElem = document.getElementById(`lightWatt${id}`);
  const glow = document.getElementById(`lightGlow${id}`);

  if (briVal) briVal.textContent = `${brightness}%`;
  if (wattElem) wattElem.textContent = `${Math.round((brightness / 100) * light.maxWatts)}W`;

  if (glow) {
    const opacity = 0.3 + (brightness / 100) * 0.7;
    glow.style.opacity = opacity;
  }

  updateEnergyDisplay();
}

// --- Main Breaker Toggle ---
function setupMainBreaker() {
  const toggle = document.getElementById('mainMeterToggle');
  if (!toggle) return;

  toggle.addEventListener('change', (e) => {
    playSound('toggle');
    state.mainBreakerActive = e.target.checked;

    if (!state.mainBreakerActive) {
      playSound('alert');
      showToast('⚠️ WARNING: Main Meter Power Supply Tripped / Isolated!', 'danger');
      // Visual feedback: Stop rotating fan animations temporarily
      document.querySelectorAll('.fan-anim').forEach(el => el.classList.remove('rotating'));
      document.querySelectorAll('.light-glow').forEach(el => el.classList.remove('on'));
    } else {
      showToast('Main Meter Circuit restored. Voltage 230V stable.', 'success');
      // Restore active states
      for (const id in state.fans) {
        if (state.fans[id].active) {
          const anim = document.getElementById(`fanAnim${id}`);
          if (anim) anim.classList.add('rotating');
        }
      }
      for (const id in state.lights) {
        if (state.lights[id].active) {
          const glow = document.getElementById(`lightGlow${id}`);
          if (glow) glow.classList.add('on');
        }
      }
    }

    updateEnergyDisplay();
  });
}

// --- Presence Simulation: Leaving & Returning Home ---
function setPresenceMode(mode) {
  state.presence = mode;

  const btnHome = document.getElementById('btnAtHome');
  const btnAway = document.getElementById('btnAway');
  const phoneCard = document.getElementById('phoneCard');
  const statusDot = document.getElementById('statusDot');
  const stateLabel = document.getElementById('connectionStateLabel');
  const presenceSub = document.getElementById('presenceSub');
  const digestHero = document.getElementById('digestHero');

  if (mode === 'HOME') {
    if (btnHome) btnHome.classList.add('active');
    if (btnAway) btnAway.classList.remove('active');
    if (phoneCard) phoneCard.classList.remove('away');
    if (statusDot) statusDot.className = 'status-dot connected';
    if (stateLabel) stateLabel.textContent = 'Mobile Connected (Local Mesh)';
    if (presenceSub) presenceSub.textContent = 'Auto-reconnected • Proximity 2.5m • Battery 64%';
    if (digestHero) digestHero.style.display = 'block';

    playSound('reconnect');
    showToast('📱 Phone auto-connected to home mesh. Sync complete.', 'success');
  } else {
    if (btnHome) btnHome.classList.remove('active');
    if (btnAway) btnAway.classList.add('active');
    if (phoneCard) phoneCard.classList.add('away');
    if (statusDot) statusDot.className = 'status-dot away';
    if (stateLabel) stateLabel.textContent = 'Away (Phone Disconnected from Mesh)';
    if (presenceSub) presenceSub.textContent = 'Cloud Standby • Departed 06:30 AM (4h 15m away)';

    playSound('alert');
    showToast('🚶 Left home perimeter. Local connection dropped. Safeguard active.', 'warning');
  }
}

function simulateAwayFlow() {
  setPresenceMode('AWAY');

  // Demonstrate smart energy protection: Turn off living room lights and bedroom fan
  if (state.lights[1].active) {
    document.getElementById('light1Toggle').checked = false;
    toggleLight(1, false);
  }
  if (state.fans[1].active) {
    document.getElementById('fan1Toggle').checked = false;
    toggleFan(1, false);
  }

  showToast('⚡ Eco-Away triggered: Non-essential lights & fans shut off.', 'info');
}

function simulateReturnFlow() {
  showToast('📡 Detecting phone proximity via Bluetooth/UWB...', 'info');

  setTimeout(() => {
    setPresenceMode('HOME');

    // Restore digest hero
    const hero = document.getElementById('digestHero');
    if (hero) {
      hero.style.display = 'block';
      hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showToast('👋 Welcome back! Prepared your "While You Were Away" briefing.', 'success');
  }, 600);
}

function simulatePowerSurge() {
  playSound('alert');
  showToast('⚡ SIMULATION: Injected 255V voltage spike on Main Meter!', 'danger');

  const wattElem = document.getElementById('currentWattage');
  const loadStatus = document.getElementById('loadStatus');
  if (wattElem) wattElem.textContent = '1,840';
  if (loadStatus) {
    loadStatus.textContent = 'Surge Detected (Stabilizing...)';
    loadStatus.className = 'metric-delta danger';
  }

  setTimeout(() => {
    updateEnergyDisplay();
    showToast('Surge suppressor engaged. Inverter normalized grid to 230V.', 'success');
  }, 2200);
}

function resetToInitialState() {
  state.mainBreakerActive = true;
  const breakerToggle = document.getElementById('mainMeterToggle');
  if (breakerToggle) breakerToggle.checked = true;

  // Reset fan 1 on, fan 2 off
  document.getElementById('fan1Toggle').checked = true;
  toggleFan(1, true);
  document.getElementById('fan2Toggle').checked = false;
  toggleFan(2, false);

  // Reset lights
  document.getElementById('light1Toggle').checked = true;
  toggleLight(1, true);
  document.getElementById('light2Toggle').checked = false;
  toggleLight(2, false);
  document.getElementById('light3Toggle').checked = true;
  toggleLight(3, true);
  document.getElementById('light4Toggle').checked = false;
  toggleLight(4, false);

  // Reset issues
  state.issues.power.active = true;
  state.issues.motion.active = true;
  const pCard = document.getElementById('cardIssuePower');
  const mCard = document.getElementById('cardIssueMotion');
  if (pCard) pCard.style.display = 'flex';
  if (mCard) mCard.style.display = 'flex';

  setPresenceMode('HOME');
  filterEvents('important');
  const filterSelect = document.getElementById('eventFilterSelect');
  if (filterSelect) filterSelect.value = 'important';

  showToast('Environment reset to initial baseline demo state.', 'info');
}

// --- Issue Triage Resolvers ---
function resolveIssue(type) {
  playSound('reconnect');
  if (type === 'power') {
    showToast('Main meter circuit diagnostics verified: Inverter health 100%, 0 faults.', 'success');
    dismissIssue('power');
  }
}

function dismissIssue(type) {
  playSound('toggle');
  if (type === 'power') {
    const card = document.getElementById('cardIssuePower');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => (card.style.display = 'none'), 300);
    }
    state.issues.power.active = false;
    showToast('Voltage anomaly acknowledged and filed into audit logs.', 'info');
  } else if (type === 'motion') {
    const card = document.getElementById('cardIssueMotion');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => (card.style.display = 'none'), 300);
    }
    state.issues.motion.active = false;
    showToast('Patio movement marked as verified delivery. Floodlight reset.', 'info');
  }

  checkAllIssuesDismissed();
}

function checkAllIssuesDismissed() {
  if (!state.issues.power.active && !state.issues.motion.active) {
    const greeting = document.getElementById('digestGreeting');
    if (greeting) {
      greeting.innerHTML = '<i class="fa-solid fa-circle-check text-success"></i> All away issues resolved! Your home is calm and secure.';
    }
  }
}

function restorePriorLighting() {
  playSound('toggle');
  document.getElementById('light1Toggle').checked = true;
  toggleLight(1, true);
  document.getElementById('fan1Toggle').checked = true;
  toggleFan(1, true);
  showToast('Living room comfort preset restored (Fan + Warm ambient lights).', 'success');
}

// --- Modal Handling ---
function viewSnapshotModal() {
  playSound('toggle');
  const modal = document.getElementById('snapshotModal');
  if (modal) modal.classList.add('active');
}

function closeSnapshotModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) {
    return;
  }
  const modal = document.getElementById('snapshotModal');
  if (modal) modal.classList.remove('active');
}

function markSafePackage() {
  closeSnapshotModal();
  dismissIssue('motion');
  showToast('Security alert resolved: Package delivery confirmed safe.', 'success');
}

// --- Timeline Rendering & Filtering ---
function renderTimeline(eventsToRender) {
  const container = document.getElementById('timelineStream');
  if (!container) return;

  container.innerHTML = '';

  if (eventsToRender.length === 0) {
    container.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        <i class="fa-solid fa-check-circle" style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--accent-emerald);"></i>
        <p>No events found for this filter.</p>
      </div>
    `;
    return;
  }

  eventsToRender.forEach(ev => {
    const item = document.createElement('div');
    item.className = `timeline-item ${ev.severity} ${ev.category} ${ev.important ? 'important' : ''}`;

    let icon = 'fa-bell';
    if (ev.category === 'motion') icon = 'fa-person-walking';
    if (ev.category === 'power') icon = 'fa-bolt-lightning';
    if (ev.category === 'system') icon = 'fa-gear';

    item.innerHTML = `
      <div class="timeline-bullet">
        <i class="fa-solid ${icon}"></i>
      </div>
      <div class="timeline-content">
        <div class="timeline-top">
          <span class="timeline-title">${ev.title}</span>
          <span class="timeline-timestamp">${ev.time}</span>
        </div>
        <p class="timeline-desc">${ev.desc}</p>
        <span class="timeline-tag ${ev.tagClass}">${ev.tag}</span>
      </div>
    `;

    container.appendChild(item);
  });
}

function filterEvents(category) {
  let filtered = state.events;

  if (category === 'important') {
    filtered = state.events.filter(e => e.important);
  } else if (category === 'motion') {
    filtered = state.events.filter(e => e.category === 'motion');
  } else if (category === 'power') {
    filtered = state.events.filter(e => e.category === 'power' || e.category === 'system');
  }

  renderTimeline(filtered);
}

// --- Tab Switching for Appliances ---
function setupDeviceTabs() {
  const tabs = document.querySelectorAll('#deviceTabs .tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-tab');
      const cards = document.querySelectorAll('#deviceGrid .device-card');

      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// --- Telemetry Accordion & Diagnostics ---
function toggleTelemetry() {
  const body = document.getElementById('telemetryBody');
  const chevron = document.getElementById('telemetryChevron');
  if (body) {
    body.classList.toggle('collapsed');
    if (chevron) {
      chevron.style.transform = body.classList.contains('collapsed') ? 'rotate(-90deg)' : 'rotate(0deg)';
    }
  }
}

function triggerManualSync() {
  showToast('Initiating cryptographic handshake with home hub...', 'info');
  setTimeout(() => {
    showToast('Sync completed. Hub telemetry latency: 18ms.', 'success');
  }, 800);
}

function restartGateway() {
  playSound('alert');
  showToast('Reboot signal sent to Smart Gateway. Re-establishing mesh in 3s...', 'warning');
  setTimeout(() => {
    showToast('Gateway rebooted successfully. Firmware v2.4.1 online.', 'success');
  }, 3000);
}

// --- Toast System ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'warning') icon = 'fa-triangle-exclamation';
  if (type === 'danger') icon = 'fa-circle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- Setup Sound Button ---
function setupSoundToggle() {
  const btn = document.getElementById('btnSoundToggle');
  const icon = document.getElementById('soundIcon');
  if (!btn) return;

  btn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) {
      if (icon) icon.className = 'fa-solid fa-volume-high';
      playSound('toggle');
      showToast('Sound chimes enabled', 'info');
    } else {
      if (icon) icon.className = 'fa-solid fa-volume-xmark';
      showToast('Sound chimes muted', 'info');
    }
  });
}

// --- Initialize Everything ---
document.addEventListener('DOMContentLoaded', () => {
  setupMainBreaker();
  setupDeviceTabs();
  setupSoundToggle();

  // Mode Buttons
  const btnHome = document.getElementById('btnAtHome');
  const btnAway = document.getElementById('btnAway');
  if (btnHome) btnHome.addEventListener('click', () => setPresenceMode('HOME'));
  if (btnAway) btnAway.addEventListener('click', () => setPresenceMode('AWAY'));

  // Dismiss Digest Button
  const btnDismiss = document.getElementById('btnDismissDigest');
  if (btnDismiss) {
    btnDismiss.addEventListener('click', () => {
      const hero = document.getElementById('digestHero');
      if (hero) hero.style.display = 'none';
      showToast('Briefing minimized. You can access it anytime.', 'info');
    });
  }

  // Initial render
  updateEnergyDisplay();
  filterEvents('important'); // Default to important events to solve the user fatigue problem
});
