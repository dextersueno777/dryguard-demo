# DryGuard Demo - Sensor-Based System Implementation

## 🎯 System Architecture

### Core Design
DryGuard is a **sensor-based intelligent drying cover automation system** that:
- ✅ Monitors rain sensors in real-time
- ✅ Automatically deploys protective cover when rain detected
- ✅ Automatically retracts cover when conditions clear
- ✅ Supports manual override for user control
- ✅ Logs all system events for monitoring

### System Operating Modes

#### 🟢 AUTO MODE (Default)
- System monitors rain sensor continuously
- **Rain detected** → Cover deploys automatically to protect clothes
- **No rain** → Cover retracts for natural drying
- User cannot override in this mode
- System ignores all manual control buttons

#### 🟠 MANUAL MODE  
- Rain sensor is completely ignored
- User has full control via Deploy/Retract buttons
- Allows custom behavior (e.g., partial deployment)
- Useful for user preferences or testing

---

## 🔧 Demo Features

### 1️⃣ Sensor Simulation Controls

**Location**: Control tab → "Sensor Simulation" section

#### Rain Simulation
- **"Simulate Rain" button**: Triggers rain detection
  - Cover automatically deploys (in AUTO mode)
  - Alert banner displays at top
  - Event logged to system log
  
- **"Clear Rain" button**: Clears rain condition
  - Cover automatically retracts (in AUTO mode)
  - Alert dismissed
  - Event logged to system log

#### Temperature Control
- **Slider**: Adjust temperature 15°C - 40°C
- Updates in real-time
- Displayed on Home tab
- Can be used for system context

---

### 2️⃣ System Mode Toggle

**Location**: Control tab → "System Mode" section

- **Toggle Button**: Switch between AUTO ↔ MANUAL
  - Button color changes (Green=AUTO, Orange=MANUAL)
  - Description updates to explain current mode
  - Events logged when mode changes

#### When in AUTO Mode:
- Manual Deploy/Retract buttons are **disabled** (greyed out)
- System responds to rain sensor
- Status message explains automatic behavior

#### When in MANUAL Mode:
- Manual Deploy/Retract buttons are **enabled** (blue)
- Rain sensor is **ignored**
- User can deploy cover manually
- "Clear Override" button appears to reset

---

### 3️⃣ Manual Cover Control

**Location**: Control tab → "Manual Cover Control" section

#### Deploy Cover Button (▼)
- Only works in MANUAL mode
- Deploys cover regardless of rain status
- Shows "Clear Override" button to cancel
- Status updates to "Manual Deploy"

#### Retract Cover Button (▲)
- Only works in MANUAL mode
- Retracts cover regardless of rain status
- Shows "Clear Override" button to cancel
- Status updates to "Manual Retract"

#### Clear Override Button
- Appears when manual action is active
- Clears the manual override
- Returns to neutral state

---

### 4️⃣ Real-Time Sensor Display

**Location**: Home tab → Sensor cards

Shows live system state:
- **Rain Sensor**: "🌧 DETECTED" or "✓ Clear"
- **Temperature**: Actual temperature in °C (e.g., "28°C")
- **Humidity**: Percentage (e.g., "65%")
- **Cover Status**: "Deployed" or "Retracted"

---

### 5️⃣ Alert System

#### Rain Detection Alert (Red Banner)
- **Appears when**: Rain is detected AND system is in AUTO mode
- **Message**: "🌧️ RAIN DETECTED - COVER DEPLOYED"
- **Location**: Top of Home tab, below mode badge
- **Clears when**: Rain is cleared OR manual control engages

#### Event Log
- **Location**: Alerts tab
- **Shows**: All system events with timestamps
- **Examples**:
  - "System started in AUTO mode"
  - "ALERT: Rain detected"
  - "Mode switched to MANUAL"
  - "Manual Deploy"
  - "Rain cleared"

---

## 📊 Demo Script

### Step 1: System Initialization
**Say**: "DryGuard system is starting up in AUTO mode. No rain is detected, so the cover is retracted."

**Show**: Home tab
- Mode badge shows "AUTO MODE" (green)
- Rain Sensor shows "✓ Clear"
- Cover is visible but retracted
- Status shows "No Rain - Cover Retracted"

---

### Step 2: Rain Detection  
**Say**: "When rain is detected, the system automatically deploys the protective cover."

**Do**: 
1. Click Control tab
2. Click "Simulate Rain" button

**Show**: 
- Rain Sensor status changes to "🌧 DETECTED"
- Cover Status changes to "deployed"
- Event logged: "ALERT: Rain detected"

**Go to Home tab**:
- Red alert banner displays: "🌧️ RAIN DETECTED - COVER DEPLOYED"
- Cover image now shows with transparent overlay
- Status message: "Rain sensor triggered. Cover deployed automatically..."

---

### Step 3: Rain Clears
**Say**: "When conditions clear, the cover automatically retracts to allow natural drying."

**Do**:
1. Return to Control tab
2. Click "Clear Rain" button

**Show**:
- Rain Sensor changes to "✓ Clear"
- Cover Status changes to "retracted"
- Alert banner disappears

---

### Step 4: Manual Override
**Say**: "Users can manually override the system for custom control."

**Do**:
1. In Control tab, click "Switch to MANUAL" button

**Show**:
- Mode badge changes to "MANUAL MODE" (orange)
- Deploy/Retract buttons become enabled (no longer greyed)
- Description changes: "You have manual control - system ignores rain sensors"
- Event logged: "Mode switched to MANUAL"

---

### Step 5: Manual Control
**Say**: "In MANUAL mode, I can deploy the cover regardless of weather conditions."

**Do**:
1. Click "Simulate Rain" to show manual mode ignores it
2. Click "▼ Deploy Cover" button

**Show**:
- Cover Status changes to "deployed"
- "Clear Override" button appears
- Status message: "Manual Deploy - Cover deployed by user override"
- Event logged: "Manual Deploy"

---

### Step 6: System Event Log
**Say**: "The system records all actions for monitoring and debugging."

**Do**:
1. Click Alerts tab

**Show**:
- Event log with all timestamped events:
  - "System started in AUTO mode"
  - "ALERT: Rain detected"
  - "Mode switched to MANUAL"
  - "Manual Deploy"
  - etc.
- Total event count

---

### Step 7: System Settings
**Say**: "System Settings shows the current state and explains system behavior."

**Do**:
1. Click Settings tab

**Show**:
- Current Mode indicator
- Rain Status
- Temperature and Cover Status
- System Logic explanation for current mode

---

## 🔄 Complete System Flow

```
┌─────────────────────────────────────────┐
│      AUTO MODE (Default)                │
├─────────────────────────────────────────┤
│                                         │
│  Rain Detected?                         │
│  │                                      │
│  ├─ Yes → Deploy Cover                 │
│  │         └─ Alert: Rain Detected     │
│  │         └─ Log: ALERT event         │
│  │                                      │
│  └─ No → Retract Cover                 │
│          └─ No Alert                   │
│          └─ Normal operation            │
│                                         │
│  Manual Controls: DISABLED              │
└─────────────────────────────────────────┘

        ↓ User Switches Mode ↓

┌─────────────────────────────────────────┐
│      MANUAL MODE                        │
├─────────────────────────────────────────┤
│                                         │
│  User can:                              │
│  ├─ Deploy Cover (ignores rain)        │
│  ├─ Retract Cover (ignores rain)       │
│  └─ Clear Override                      │
│                                         │
│  Rain Sensor: IGNORED                   │
│  Manual Controls: ENABLED               │
└─────────────────────────────────────────┘
```

---

## 📁 Key Files

### System Logic
- **`lib/systemLogic.js`**: Core decision logic
  - `getSystemState()`: Determines cover state
  - `getWeatherAppearance()`: Maps sensor data to visuals
  - `shouldAlert()`: Triggers rain alerts

### API & State
- **`app/api/sensor/route.js`**: System state management
  - GET: Retrieve current system state
  - POST: Update sensor values and mode
  - In-memory storage with event logging

### Components
- **`components/Home.js`**: Main dashboard with alert banner
- **`components/Control.js`**: Simulation & manual control
- **`components/Alerts.js`**: Event log display
- **`components/Settings.js`**: System info & logic explanation

### Styling
- **`app/globals.css`**: Professional UI with animations
  - Navigation styling
  - Glass-morphism weather scene
  - Responsive sensor grid

---

## 🎨 UI Components

### Mode Badge
- **AUTO MODE**: Green (#22c55e)
- **MANUAL MODE**: Orange (#f59e0b)
- Shows at top of Home page

### Alert Banner (Rain Detection)
- Red background (#fee2e2)
- Red border (#dc2626)
- Dark red text (#991b1b)
- Message: "🌧️ RAIN DETECTED - COVER DEPLOYED"
- Only shows in AUTO mode when rain detected

### Control Buttons (Control Tab)
- **Deploy**: Blue (#3b82f6)
- **Retract**: Green (#10b981)
- **Clear Override**: Gray (#6b7280)
- Disabled when in AUTO mode

### Weather Scene
- Cloudinary background image
- Clothesline and clothes
- Transparent cover overlay
- Smooth 0.5s transitions

---

## ✅ Verification Checklist for Demo

- [ ] AUTO mode correctly deploys cover on rain simulation
- [ ] AUTO mode correctly retracts cover on rain clear
- [ ] Manual mode toggle enables/disables buttons
- [ ] Manual deploy works regardless of rain status
- [ ] Manual retract works regardless of rain status
- [ ] Alert banner appears/disappears appropriately
- [ ] Event log records all system actions
- [ ] Temperature slider updates in real-time
- [ ] Settings tab shows correct system state
- [ ] Mode switches logged in event log
- [ ] Refresh every 10 seconds works
- [ ] All sensor readings accurate

---

## 🎬 Demo Timing

- **Step 1** (Initialization): 30 seconds
- **Step 2** (Rain Detection): 45 seconds
- **Step 3** (Rain Clears): 30 seconds
- **Step 4** (Manual Mode): 45 seconds
- **Step 5** (Manual Control): 45 seconds
- **Step 6** (Event Log): 30 seconds
- **Step 7** (Settings): 30 seconds

**Total Demo Time**: ~4 minutes

---

## 🎓 Key Learning Points

1. **Sensor-Based Logic**: System reacts to real sensor data, not arbitrary weather
2. **Dual-Mode Operation**: AUTO for convenience, MANUAL for control
3. **Real-Time Monitoring**: Event log shows all system decisions
4. **User-Friendly Interface**: Clear status, alerts, and feedback
5. **Scalable Design**: Can be extended with more sensors (humidity, wind, etc.)

---

## 🚀 API Reference

### GET /api/sensor
Returns current system state:
```json
{
  "rain": false,
  "temperature": 28,
  "humidity": 65,
  "mode": "AUTO",
  "manualAction": null,
  "cover": "retracted",
  "status": "No Rain - Cover Retracted",
  "description": "No rain detected. Cover retracted for natural drying.",
  "weather": "sunny",
  "eventLog": ["System started in AUTO mode"],
  "timestamp": "2:10:09 PM"
}
```

### POST /api/sensor
Update system state:
```json
{
  "rain": true,
  "temperature": 25,
  "mode": "MANUAL",
  "manualAction": "deploy"
}
```

---

## 💡 Tips for Success

1. **Explain the logic before demonstrating**: Help audience understand decision flow
2. **Go slowly**: Let changes sink in, give time to see visual feedback
3. **Narrate actions**: Explain what you're doing and why
4. **Show event log**: Proves system is tracking decisions
5. **Test both modes**: Show power of AUTO and flexibility of MANUAL
6. **Ask questions**: "Do you see how the alert appeared?" "Notice the event was logged?"
