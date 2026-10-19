# PulseHome OS 2.4 — Smart Home Presence & Control Hub (React.js Edition)

> **Submission for Software Intern Assignment 1 - 2026**  
> **Candidate Solution:** Intelligent React.js Smart Home Dashboard with Autonomous Away-Guard, Phone Presence Sync, Interactive Home Floor Plan, Main Power Meter, and Appliance Control.

---

## 1. Executive Summary & Problem Diagnosis

### The Core Problem with the Existing Design
When a user opens their smart home app after hours away, they ask one question:  
**"What happened at home while I was away, and is there anything I should care about?"**

The legacy interface failed because it dumped raw, low-signal telemetry:
- **Developer Debug Overload:** Displaying `-67 dBm`, `Firmware 2.4.1`, `17 events`, `Last Restart Yesterday` as primary cards gives zero actionable insight to a homeowner.
- **Cognitive Fatigue:** Listing identical items like `10:42 AM Movement detected`, `10:05 AM Movement detected`, `9:47 AM Movement detected` hides the **2 important events** inside repetitive noise.
- **No Actionability:** When a device disconnected at `10:18 AM`, the user was not told *why* or what to do next.
- **Lack of Physical Context:** No visibility into active power draw (Main Meter), whether lights or ceiling fans were left running, or whether leaving the house saved or wasted electricity.

---

## 2. Our Solution: PulseHome OS (Rethinking the Experience)

In response to the open-ended challenge to **remove, add, reorganize, reinterpret, and completely rethink** the information and experience, we elevated the product into a **full smart home command center**:

```
+---------------------------------------------------------------------------------------------------------+
|                                    PULSEHOME OS 2.4 - TOP NAVIGATION                                    |
| [Logo] PulseHome React 2.4    [Presence] Mobile Connected (2.5m) | [At Home] [Away Mode] [Sound] [Gear] |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|  1. "WHILE YOU WERE AWAY" RETURN HERO                                                                   |
|  "Here's what deserves your attention right now: 2 Critical Issues Detected • 0.84 kWh Saved"           |
|  +---------------------------+   +---------------------------+   +-----------------------------------+  |
|  | 🔴 ACTION REQUIRED (10:18)|   | ⚠️ SECURITY ALERT (10:42) |   | 🟢 ECO-AUTOMATED (09:15 AM)       |  |
|  | Voltage Drop (195V) & Hub |   | Patio Perimeter Motion    |   | 3 Lights & Fan Auto-Off           |  |
|  | Gateway Reset             |   | Security Light Engaged    |   | Saved $0.28 / 0.84 kWh            |  |
|  | [Inspect Breaker][Dismiss]|   | [View Snapshot][Mark Safe]|   | [Restore Comfort Preset]          |  |
|  +---------------------------+   +---------------------------+   +-----------------------------------+  |
|                                                                                                         |
|  2. AI VOICE CONCIERGE AUDIO BRIEFING BAR                                                               |
|  [Headset Icon] "Audio Away Summary: Welcome back home. While you were away for 4h 15m..." [▶ Play Voice]|
|                                                                                                         |
|  3. "WHAT SHOULD I DO NEXT?" ONE-CLICK SMART ACTION RECIPES                                             |
|  [Restore Comfort Preset]  [Resolve All 2 Incidents]  [Max Perimeter Lockdown]  [Export Audit JSON]     |
|                                                                                                         |
|  4. TWO-COLUMN RESPONSIVE COMMAND CENTER                                                                |
|                                                                                                         |
|  LEFT COLUMN: SPATIAL & ENERGY CONTROLS     | RIGHT COLUMN: INTELLIGENT TIMELINE & EVALUATOR SANDBOX    |
|                                             |                                                           |
|  [Interactive Home Floor Plan & Twin]       | [Activity & Event Intelligence Timeline]                  |
|  - Living Room (Chandelier, Fan, PIR)       | - 10:42 AM: Patio Motion (Security Floodlight Engaged)    |
|  - Kitchen (Spots, Fridge 180W)             | - 10:18 AM: Main Grid Voltage Sag (Breaker Anomaly)       |
|  - Master Bedroom (Fan, Bedside Lamps)      | - 10:05 AM: Hallway Motion (3 Routine Events Clustered)   |
|  - Patio (Alert Pin: 10:42 AM Motion)       | Filter: [Needs Attention (2)] [Security] [Power] [All 17] |
|  - Utility Hub (Alert Pin: 10:18 AM Sag)    |                                                           |
|                                             | [Diagnostics & Hub Metadata Accordion]                    |
|  [Main Meter & Smart Breaker]               | - RSSI: -67 dBm • Battery: 64% • Firmware: v2.4.1         |
|  - Live Grid: 230V @ 410W                   |                                                           |
|  - Emergency Isolation Breaker Switch       | [Interviewer Evaluator Sandbox]                           |
|                                             | - [1. Simulate Leaving Home (Auto-Disconnect)]            |
|  [Grid Power Draw Hourly Curve]             | - [2. Simulate Returning Home (Auto-Reconnect)]           |
|  - SVG Chart from 06:00 AM to 11:00 AM      | - [3. Trigger Power Surge Anomaly]                        |
|                                             | - [4. Reset Demo State]                                   |
|  [Appliance Controllers (Fans & Lights)]    |                                                           |
|  - BLDC Fan Speeds 1-5 with live RPM        |                                                           |
|  - Warm Amber Lighting Dimmer               |                                                           |
|                                             |                                                           |
|  ["Away Time Machine" Scrubber]             |                                                           |
|  - Slider from 06:30 AM to 10:45 AM         |                                                           |
+---------------------------------------------------------------------------------------------------------+
```

---

## 3. New Advanced Features Added

1. **AI Voice Concierge & Audio Return Briefing (`VoiceBriefingBar.jsx`):**
   - Uses the native **Web Speech Synthesis API** to speak out a natural language summary when the user returns home.
   - Includes real-time animated equalizer soundwave bars and play/pause audio controls.
2. **Interactive Home Floor Plan & Digital Twin (`HomeFloorPlan.jsx`):**
   - Directly addresses *"shows what every thing should contain in the home and major issues"*.
   - Displays all rooms (Living Room, Kitchen, Master Bedroom, Patio, Utility Station) with live wattage, temperature, connected devices, and **flashing alert pins** for the 10:18 AM and 10:42 AM incidents.
3. **"Away Time Machine" / Timeline Scrubber (`TimeScrubber.jsx`):**
   - Lets the user drag a timeline slider from 06:30 AM (departure) to 10:45 AM (return) or press **"Replay Away Timeline"** to watch the events unfold sequentially.
4. **"What Should I Do Next?" Smart Action Recipes (`SmartActionsBar.jsx`):**
   - Directly solves the problem of users not knowing what to do:
     - 🔘 *Restore Evening Comfort:* Sets living room light to warm ambient (75%) and fan to speed 3.
     - 🔘 *Resolve & Archive All Alerts:* 1-click batch resolution of pending incidents.
     - 🔘 *Max Perimeter Lockdown:* Arms all perimeter sensors and powers floodlights to 100%.
     - 🔘 *Export Incident Audit:* Downloads a formatted JSON audit log for insurance/utility records.
5. **Hourly Grid Power Draw SVG Chart (`EnergyHistoryChart.jsx`):**
   - Renders the residential power load curve from 06:00 AM to 11:00 AM, visually demonstrating the 09:15 AM eco-drop (down to 305W) and the 10:18 AM surge.
6. **Presence Rules & Geofence Settings (`SettingsModal.jsx`):**
   - Configures the away auto-disconnect delay (5, 15, 30 min) and proximity technology (Ultra-Wideband UWB, Bluetooth LE, Wi-Fi 6).

---

## 4. The 3 Assignment Prompts

### A. The Assumptions Made
1. **Smartphone as Proximity & Presence Key:**  
   The user's smartphone communicates via local ultra-wideband (UWB) or home Wi-Fi mesh when inside the residence (< 15m). When the user leaves for more than 15 minutes, the phone transitions to "Away Standby" (cloud telemetry), and the home autonomously arms its security and eco-protocols.
2. **Autonomous Eco-Safeguard:**  
   Leaving home automatically detects non-essential energy draws. Active fans and interior lights left on are automatically shut down to prevent wasted electricity, while essential loads (refrigerator, security hub) stay active on baseline power.
3. **Re-connection Handshake:**  
   Upon returning within proximity, the mobile device automatically re-establishes direct encrypted local mesh connectivity and requests the **"While You Were Away" catch-up payload**.
4. **Context Behind the 2 Important Events:**  
   - The **10:18 AM event** ("Device disconnected") is interpreted as an electrical grid voltage sag (195V) causing the gateway to auto-reset while surge suppressors isolated home electronics.
   - The **10:42 AM event** ("Movement detected") is interpreted as an exterior perimeter trigger while Away mode was armed, activating security deterrent floodlights and capturing a courier package delivery snapshot.
5. **Routine Activity Clustering:**  
   The remaining 15 movement events (e.g., 9:31, 9:47, 10:05 AM) are identified as internal hallway pet movements and routine departure motion, intelligently clustered rather than presented as 15 separate alerts.

---

### B. The Key Decisions Made
1. **Tiered Information Hierarchy over Flat Chronological Logs:**  
   - **Tier 1 (Immediate Action Required):** Critical anomalies with direct one-click resolution buttons right on the cards.
   - **Tier 2 (Peace of Mind / Automated Savings):** What the smart home handled automatically (kWh saved, devices turned off).
   - **Tier 3 (Background Telemetry):** Demoted technical stats (-67 dBm, firmware version, uptime) into a collapsible technical diagnostics accordion.
2. **Direct Control of Core Home Systems (Main Meter, Fans, Lights):**  
   Built interactive React state controllers for the Main Power Meter (with live wattage math, master breaker isolation switch), BLDC Ceiling Fans (multi-speed animation, eco-mode), and Lighting (dimmers, warm amber glow).
3. **Real-Time Dynamic Load Math via React `useMemo`:**  
   Toggling appliances or adjusting fan speeds immediately updates the live wattage on the Main Power Meter in real time. Tripping the main breaker immediately isolates all active circuits.
4. **Built-in Evaluator Simulation Sandbox:**  
   Added interactive simulation buttons right on the dashboard so anyone testing can simulate:
   - Leaving home (triggers phone disconnect and eco-shutoff)
   - Returning home (triggers reconnection chime and digest briefing)
   - Triggering a live voltage surge anomaly.
5. **Aesthetic Excellence:**  
   Implemented modern glassmorphism, glowing micro-animations, rotating fan blade visuals, custom sliders, responsive layouts, and synthesized Web Audio digital feedback.

---

### C. What I Would Improve or Explore with More Time
1. **Live Camera WebRTC Stream & Computer Vision Clips:**  
   Replace the simulated SVG camera snapshot with an interactive WebRTC scrubbable 5-second video buffer of the motion event.
2. **Machine Learning Appliance Signature Disaggregation (NILM):**  
   Use Non-Intrusive Load Monitoring on the Main Meter feed to break down exact power usage per appliance (e.g. detect if the refrigerator compressor is degrading or pulling abnormal amps).
3. **Multi-User Family Presence Geofencing:**  
   Support multi-resident households with shared keys so "Away Mode" only triggers when the last family member leaves, and restores personalized comfort scenes depending on *who* returns home first.
4. **Solar & Home Battery Inverter Integration:**  
   Incorporate solar panel generation vs battery storage reserves (e.g., Tesla Powerwall / Enphase) to show net zero grid export during away hours.
5. **Voice AI Assistant Integration:**  
   Full bi-directional conversational voice AI allowing the homeowner to ask: *"Did anyone ring the doorbell while I was out?"*

---

## 5. How to Run Locally

1. Open a terminal in this directory:
   ```bash
   cd d:\frontend-projects\assignment
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
4. To create an optimized production build:
   ```bash
   npm run build
   ```
