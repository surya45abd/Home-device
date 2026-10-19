import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import AwayDigestHero from './components/AwayDigestHero';
import VoiceBriefingBar from './components/VoiceBriefingBar';
import SmartActionsBar from './components/SmartActionsBar';
import HomeFloorPlan from './components/HomeFloorPlan';
import EnergyHistoryChart from './components/EnergyHistoryChart';
import TimeScrubber from './components/TimeScrubber';
import MainMeterCard from './components/MainMeterCard';
import ApplianceControls from './components/ApplianceControls';
import TimelineCard from './components/TimelineCard';
import TelemetryAccordion from './components/TelemetryAccordion';
import SimulationSandbox from './components/SimulationSandbox';
import CameraModal from './components/CameraModal';
import SettingsModal from './components/SettingsModal';
import ToastContainer from './components/ToastContainer';
import { playSound } from './utils/audio';

const INITIAL_EVENTS = [
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
];

export default function App() {
  const [presence, setPresence] = useState('HOME');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showDigest, setShowDigest] = useState(true);
  const [breakerActive, setBreakerActive] = useState(true);
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [todayKwh, setTodayKwh] = useState(4.82);
  const [toasts, setToasts] = useState([]);

  // Away triage issues
  const [issues, setIssues] = useState({
    power: { active: true },
    motion: { active: true }
  });

  // Appliance states
  const [fans, setFans] = useState({
    1: { name: 'Living Room Fan', active: true, speed: 3, baseWatts: 15, wattsPerSpeed: 10 },
    2: { name: 'Bedroom Ceiling Fan', active: false, speed: 1, baseWatts: 15, wattsPerSpeed: 10 }
  });

  const [lights, setLights] = useState({
    1: { name: 'Living Room Lighting', active: true, brightness: 75, maxWatts: 32 },
    2: { name: 'Kitchen Ceiling Spots', active: false, brightness: 50, maxWatts: 40 },
    3: { name: 'Porch Motion Floodlight', active: true, brightness: 100, maxWatts: 18 },
    4: { name: 'Bedroom Nightstand Lamps', active: false, brightness: 40, maxWatts: 20 }
  });

  const [surgeOverrideWatts, setSurgeOverrideWatts] = useState(null);

  // Dynamic Wattage Calculation
  const totalWattage = useMemo(() => {
    if (!breakerActive) return 0;
    if (surgeOverrideWatts !== null) return surgeOverrideWatts;

    let watts = 305; // Base idle (fridge 180W + hub 25W + standby 100W)

    // Fans
    Object.values(fans).forEach((f) => {
      if (f.active) {
        watts += f.baseWatts + f.speed * f.wattsPerSpeed;
      }
    });

    // Lights
    Object.values(lights).forEach((l) => {
      if (l.active) {
        watts += Math.round((l.brightness / 100) * l.maxWatts);
      }
    });

    return watts;
  }, [breakerActive, surgeOverrideWatts, fans, lights]);

  // Toast Helper
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Sound Helper
  const triggerAudio = (type) => {
    playSound(type, soundEnabled);
  };

  // Presence Switch
  const handleSetPresence = (mode) => {
    setPresence(mode);
    if (mode === 'HOME') {
      setShowDigest(true);
      triggerAudio('reconnect');
      showToast('📱 Phone auto-connected to home mesh. Sync complete.', 'success');
    } else {
      triggerAudio('alert');
      showToast('🚶 Left home perimeter. Local connection dropped. Safeguard active.', 'warning');
    }
  };

  // Breaker Toggle
  const handleToggleBreaker = (val) => {
    triggerAudio('toggle');
    setBreakerActive(val);
    if (!val) {
      triggerAudio('alert');
      showToast('⚠️ WARNING: Main Meter Power Supply Tripped / Isolated!', 'danger');
    } else {
      showToast('Main Meter Circuit restored. Voltage 230V stable.', 'success');
    }
  };

  // Fan Controls
  const handleToggleFan = (id, active) => {
    triggerAudio('toggle');
    setFans((prev) => ({
      ...prev,
      [id]: { ...prev[id], active }
    }));
    showToast(`${fans[id].name} ${active ? 'powered ON' : 'turned OFF'}`, 'info');
  };

  const handleChangeFanSpeed = (id, speed) => {
    setFans((prev) => ({
      ...prev,
      [id]: { ...prev[id], speed }
    }));
  };

  // Light Controls
  const handleToggleLight = (id, active) => {
    triggerAudio('toggle');
    setLights((prev) => ({
      ...prev,
      [id]: { ...prev[id], active }
    }));
    showToast(`${lights[id].name} ${active ? 'illuminated' : 'turned OFF'}`, 'info');
  };

  const handleChangeLightBrightness = (id, brightness) => {
    setLights((prev) => ({
      ...prev,
      [id]: { ...prev[id], brightness }
    }));
  };

  // Away Briefing Actions
  const handleResolvePower = () => {
    triggerAudio('reconnect');
    showToast('Main meter circuit diagnostics verified: Inverter health 100%, 0 faults.', 'success');
    setIssues((prev) => ({ ...prev, power: { active: false } }));
  };

  const handleDismissPower = () => {
    triggerAudio('toggle');
    setIssues((prev) => ({ ...prev, power: { active: false } }));
    showToast('Voltage anomaly acknowledged and filed into audit logs.', 'info');
  };

  const handleDismissMotion = () => {
    triggerAudio('toggle');
    setIssues((prev) => ({ ...prev, motion: { active: false } }));
    showToast('Patio movement marked as verified delivery. Floodlight reset.', 'info');
  };

  const handleRestoreComfort = () => {
    triggerAudio('toggle');
    setFans((prev) => ({
      ...prev,
      1: { ...prev[1], active: true, speed: 3 }
    }));
    setLights((prev) => ({
      ...prev,
      1: { ...prev[1], active: true, brightness: 75 }
    }));
    showToast('Living room comfort preset restored (Fan Speed 3 + Warm ambient lights).', 'success');
  };

  // Smart Recipe Handlers
  const handleClearAllMinor = () => {
    triggerAudio('reconnect');
    setIssues({ power: { active: false }, motion: { active: false } });
    showToast('All 2 away issues acknowledged and archived into audit log.', 'success');
  };

  const handleSecurityLockdown = () => {
    triggerAudio('alert');
    setLights((prev) => ({
      ...prev,
      3: { ...prev[3], active: true, brightness: 100 }
    }));
    showToast('Perimeter floodlight armed at 100% deterrent intensity.', 'warning');
  };

  const handleExportReport = () => {
    const reportData = {
      title: 'PulseHome OS Incident Audit Log',
      exportedAt: new Date().toISOString(),
      presenceDuration: '4 hours 15 minutes (06:30 AM – 10:45 AM)',
      totalEventsAnalyzed: 17,
      issuesDetected: [
        { time: '10:18 AM', issue: 'Main Grid Voltage Sag (195V)', status: issues.power.active ? 'Pending' : 'Resolved' },
        { time: '10:42 AM', issue: 'Patio Perimeter Motion', status: issues.motion.active ? 'Pending' : 'Resolved' }
      ],
      energyMetrics: {
        totalKwhToday: todayKwh,
        estimatedCostDollars: (todayKwh * 0.3).toFixed(2),
        ecoSavingsKwh: 0.84
      },
      applianceStatus: {
        mainBreaker: breakerActive ? 'ARMED' : 'TRIPPED',
        fans,
        lights
      },
      timelineEvents: INITIAL_EVENTS
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PulseHome-Audit-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showToast('Incident audit report exported as JSON file.', 'success');
  };

  // Simulation Handlers
  const handleSimulateAway = () => {
    handleSetPresence('AWAY');
    // Eco-away: automatically shut off non-essential fans and lights
    setFans((prev) => ({ ...prev, 1: { ...prev[1], active: false } }));
    setLights((prev) => ({ ...prev, 1: { ...prev[1], active: false } }));
    showToast('⚡ Eco-Away triggered: Non-essential lights & fans shut off.', 'info');
  };

  const handleSimulateReturn = () => {
    showToast('📡 Detecting phone proximity via Bluetooth/UWB...', 'info');
    setTimeout(() => {
      handleSetPresence('HOME');
      setShowDigest(true);
      showToast('👋 Welcome back! Prepared your "While You Were Away" briefing.', 'success');
    }, 600);
  };

  const handleSimulateSurge = () => {
    triggerAudio('alert');
    showToast('⚡ SIMULATION: Injected 255V voltage spike on Main Meter!', 'danger');
    setSurgeOverrideWatts(1840);
    setTimeout(() => {
      setSurgeOverrideWatts(null);
      showToast('Surge suppressor engaged. Inverter normalized grid to 230V.', 'success');
    }, 2200);
  };

  const handleResetDemo = () => {
    setBreakerActive(true);
    setPresence('HOME');
    setShowDigest(true);
    setIssues({
      power: { active: true },
      motion: { active: true }
    });
    setFans({
      1: { name: 'Living Room Fan', active: true, speed: 3, baseWatts: 15, wattsPerSpeed: 10 },
      2: { name: 'Bedroom Ceiling Fan', active: false, speed: 1, baseWatts: 15, wattsPerSpeed: 10 }
    });
    setLights({
      1: { name: 'Living Room Lighting', active: true, brightness: 75, maxWatts: 32 },
      2: { name: 'Kitchen Ceiling Spots', active: false, brightness: 50, maxWatts: 40 },
      3: { name: 'Porch Motion Floodlight', active: true, brightness: 100, maxWatts: 18 },
      4: { name: 'Bedroom Nightstand Lamps', active: false, brightness: 40, maxWatts: 20 }
    });
    setTodayKwh(4.82);
    showToast('Environment reset to initial baseline demo state.', 'info');
  };

  const voiceSummaryText =
    "Welcome back home. While you were away for 4 hours and 15 minutes, two items occurred: at 10:18 AM, a grid voltage sag caused a safe gateway reboot, and at 10:42 AM, a delivery courier was verified on the patio. Your eco-automations saved 0.84 kilowatt-hours.";

  return (
    <>
      {/* Top Navigation */}
      <Navbar
        presence={presence}
        onSetPresence={handleSetPresence}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          setSoundEnabled(!soundEnabled);
          showToast(`Sound chimes ${!soundEnabled ? 'enabled' : 'muted'}`, 'info');
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="main-container">
        {/* Away Catch-Up Briefing Hero */}
        {showDigest && (
          <AwayDigestHero
            issues={issues}
            onResolvePower={handleResolvePower}
            onDismissPower={handleDismissPower}
            onOpenSnapshot={() => {
              triggerAudio('toggle');
              setIsSnapshotOpen(true);
            }}
            onDismissMotion={handleDismissMotion}
            onRestoreComfort={handleRestoreComfort}
            onCloseDigest={() => {
              setShowDigest(false);
              showToast('Briefing minimized. You can access it anytime.', 'info');
            }}
          />
        )}

        {/* AI Voice Concierge Audio Briefing Bar */}
        <VoiceBriefingBar
          textSummary={voiceSummaryText}
          soundEnabled={soundEnabled}
        />

        {/* Smart Actions Bar: "What Should I Do Next?" */}
        <SmartActionsBar
          onClearAllMinor={handleClearAllMinor}
          onActivateComfort={handleRestoreComfort}
          onExportReport={handleExportReport}
          onSecurityLockdown={handleSecurityLockdown}
        />

        {/* Two-Column Grid */}
        <div className="dashboard-layout">
          {/* Left Column: Interactive Layout, Main Meter, Controls, Time Machine */}
          <section className="controls-column">
            {/* Interactive Room Layout / Digital Twin */}
            <HomeFloorPlan
              fans={fans}
              lights={lights}
              breakerActive={breakerActive}
              issues={issues}
              onOpenSnapshot={() => setIsSnapshotOpen(true)}
              onInspectBreaker={handleResolvePower}
              onToggleFan={handleToggleFan}
              onToggleLight={handleToggleLight}
            />

            {/* Main Meter & Smart Power Supply */}
            <MainMeterCard
              totalWattage={totalWattage}
              breakerActive={breakerActive}
              onToggleBreaker={handleToggleBreaker}
              todayKwh={todayKwh}
            />

            {/* Grid Power Draw Hourly Curve */}
            <EnergyHistoryChart />

            {/* Appliance Controls */}
            <ApplianceControls
              fans={fans}
              lights={lights}
              breakerActive={breakerActive}
              onToggleFan={handleToggleFan}
              onChangeFanSpeed={handleChangeFanSpeed}
              onToggleLight={handleToggleLight}
              onChangeLightBrightness={handleChangeLightBrightness}
            />

            {/* "While You Were Away" Interactive Time Scrubber */}
            <TimeScrubber
              onSelectStop={(stop) => {
                showToast(`Milestone: ${stop.time} - ${stop.label}`, 'info');
              }}
            />
          </section>

          {/* Right Column: Timeline, Diagnostics & Evaluator Sandbox */}
          <aside className="timeline-column">
            <TimelineCard events={INITIAL_EVENTS} />

            <TelemetryAccordion
              onForceSync={() => {
                showToast('Initiating cryptographic handshake with home hub...', 'info');
                setTimeout(() => {
                  showToast('Sync completed. Hub telemetry latency: 18ms.', 'success');
                }, 800);
              }}
              onRebootHub={() => {
                triggerAudio('alert');
                showToast('Reboot signal sent to Smart Gateway. Re-establishing mesh in 3s...', 'warning');
                setTimeout(() => {
                  showToast('Gateway rebooted successfully. Firmware v2.4.1 online.', 'success');
                }, 3000);
              }}
            />

            <SimulationSandbox
              onSimulateAway={handleSimulateAway}
              onSimulateReturn={handleSimulateReturn}
              onSimulateSurge={handleSimulateSurge}
              onResetDemo={handleResetDemo}
            />
          </aside>
        </div>
      </main>

      {/* Camera Snapshot Modal */}
      <CameraModal
        isOpen={isSnapshotOpen}
        onClose={() => setIsSnapshotOpen(false)}
        onMarkSafe={() => {
          setIsSnapshotOpen(false);
          handleDismissMotion();
        }}
      />

      {/* Settings & Presence Configuration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(config) => {
          showToast(`Presence rules saved: ${config.awayTimeout}m away delay via ${config.meshProtocol.toUpperCase()}`, 'success');
        }}
      />

      {/* Floating Dynamic Toasts */}
      <ToastContainer toasts={toasts} />
    </>
  );
}
