# DryGuard - Implementation Details

## 📋 What Was Changed

### 1. System Logic Architecture

#### Created: `lib/systemLogic.js`
The brain of the system - pure logic for determining system state:

```javascript
getSystemState({ rain, mode, manualAction })
- If MANUAL mode: Returns based on manualAction
- If AUTO mode: Returns based on rain sensor
- Returns: { cover, status, description }

getWeatherAppearance(rain, temperature)
- Maps sensor data to visual representation
- Rain → "rainy" appearance
- No rain + high temp → "sunny"
- Otherwise → "cloudy"
```

**Why**: Separates business logic from UI, making it testable and reusable.

---

### 2. API Endpoint Updates

#### Modified: `app/api/sensor/route.js`

**Before**: Cycled through mock weather scenes automatically
```javascript
let index = 0;
export async function GET() {
  const data = scenes[index];
  index = (index + 1) % scenes.length;
  return Response.json(data);
}
```

**After**: Stateful sensor system with POST support
```javascript
let system = {
  rain: false,
  temperature: 28,
  humidity: 65,
  mode: "AUTO",
  manualAction: null,
  eventLog: [...],
  timestamp: new Date().toLocaleTimeString()
};

export async function GET() {
  // Returns current system state with computed cover/status
}

export async function POST(req) {
  // Updates system state and logs events
}
```

**Features**:
- Stores actual system state (not simulated weather)
- Supports POST requests to update state
- Tracks event history (last 20 events)
- Computes cover state based on logic
- Returns complete system snapshot

---

### 3. Component Architecture Changes

#### `app/page.js` (Main Page)
**Added**:
- State management for sensor data
- `useEffect` hook for periodic fetching (10 seconds)
- `handleSystemUpdate()` function for POST requests
- Data and callback passing to all components

**Data Flow**:
```
Page (state: sensorData)
  ├─→ Home (data prop)
  ├─→ Alerts (data prop)
  ├─→ Control (data prop + onUpdate callback)
  └─→ Settings (data prop)
```

---

#### `components/Home.js` (Dashboard)
**Changed From**:
- Weather-based logic (normalizedWeather)
- Conditional cover deployment based on weather name

**Changed To**:
- Sensor-based logic (rain: boolean)
- Conditional cover deployment based on rain sensor
- Mode badge display (AUTO/MANUAL)
- Conditional alert banner (only in AUTO + rain)
- Proper formatting of temperature ("28°C")

**Key Logic**:
```javascript
const rain = data.rain;
const mode = data.mode;
const coverStatus = data.cover;
const systemStatus = data.status;

const alertActive = rain && mode === "AUTO";
```

---

#### `components/Control.js` (System Control Panel)
**Changed From**:
- Simple deploy/retract buttons
- Static component with no interaction

**Changed To**:
- **System Mode Toggle**: Switch AUTO ↔ MANUAL
- **Sensor Simulation**:
  - Simulate Rain / Clear Rain buttons
  - Temperature slider (15-40°C)
- **Manual Cover Control**:
  - Deploy button (enabled in MANUAL only)
  - Retract button (enabled in MANUAL only)
  - Clear Override button
- **Current State Display**: Shows live system values

**API Calls**:
```javascript
await fetch("/api/sensor", {
  method: "POST",
  body: JSON.stringify({ rain: true })
})

await fetch("/api/sensor", {
  method: "POST",
  body: JSON.stringify({ mode: "MANUAL" })
})

await fetch("/api/sensor", {
  method: "POST",
  body: JSON.stringify({ manualAction: "deploy" })
})
```

---

#### `components/Alerts.js` (Event Log)
**Changed From**:
- Empty component expecting alerts prop
- No functionality

**Changed To**:
- Displays system event log with timestamps
- Shows rain alert banner when active
- Color-coded events (🚨 for alerts, ℹ️ for info)
- Scrollable event list
- Total event count

**Event Examples**:
- "System started in AUTO mode"
- "🌧 2:10:36 PM - ALERT: Rain detected"
- "2:10:53 PM - Mode switched to MANUAL"
- "2:10:59 PM - Rain cleared"
- "2:11:03 PM - Manual Deploy"

---

#### `components/Settings.js` (System Info)
**Changed From**:
- Settings checkboxes (not functional)
- Simulation speed dropdown

**Changed To**:
- System Information display
  - Current Mode
  - Rain Status
  - Temperature
  - Cover Status
- System Logic explanation
  - AUTO mode: What happens
  - MANUAL mode: What happens

---

#### `components/SensorCard.js` (Sensor Display)
**Updated**:
- Added support for `label` prop
- Better formatting for values
- Improved styling with color and size

**From**: `<SensorCard label="Temperature" value={data.temp} />`
**To**: `<SensorCard label="Temperature" value={`${temperature}°C`} />`

---

### 4. Data Model Changes

**Old Data Structure**:
```javascript
{
  weather: "sunny",  // String: sunny/rainy/cloudy
  timestamp: "10:30:45 AM",
  rain: "0%",  // String
  humidity: "65%",  // String
  temp: "28°C"  // String
}
```

**New Data Structure**:
```javascript
{
  // Sensor values
  rain: false,  // Boolean
  temperature: 28,  // Number
  humidity: 65,  // Number
  
  // System mode
  mode: "AUTO",  // String: AUTO or MANUAL
  manualAction: null,  // String: null, "deploy", "retract"
  
  // Computed values
  cover: "deployed",  // String: deployed or retracted
  status: "Rain Detected - Cover Deployed",  // String
  description: "Rain sensor triggered...",  // String
  weather: "rainy",  // String: sunny, cloudy, rainy
  
  // Monitoring
  eventLog: [...],  // Array of event strings
  timestamp: "2:10:09 PM"  // String
}
```

**Why**:
- Boolean for rain is clearer than string "rainy"
- Numbers for temperature/humidity are easier to process
- Separate mode and manualAction for cleaner logic
- Computed values derived from sensor data
- Event log provides system transparency

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│              User Interaction                        │
│  (Click buttons in Control tab)                     │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Control.js          │
        │  onUpdate(updates)   │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────────────────────┐
        │  POST /api/sensor                    │
        │  { rain, temperature, mode, ... }   │
        └──────────┬───────────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────────────┐
    │  api/sensor/route.js                         │
    │  ├─ Update system state                      │
    │  ├─ Log event to eventLog                    │
    │  ├─ Call getSystemState()                    │
    │  └─ Return updated system                    │
    └──────────┬───────────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────────────┐
    │  lib/systemLogic.js                          │
    │  ├─ getSystemState() → { cover, status }    │
    │  ├─ getWeatherAppearance() → weather        │
    │  └─ shouldAlert() → true/false              │
    └──────────┬───────────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────────────┐
    │  Response sent back to client                │
    │  Updated system state with computed values   │
    └──────────┬───────────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────────────┐
    │  page.js                                     │
    │  setSensorData(data)                        │
    │  Triggers re-render of all components      │
    └──────────┬───────────────────────────────────┘
               │
        ┌──────┴──────┬──────────┬──────────┐
        ▼             ▼          ▼          ▼
     Home.js     Alerts.js  Control.js  Settings.js
     Updates     Updates     Updates     Updates
     display     event log   state       info
```

---

## 🔐 System State Management

### In-Memory Storage
Located in `app/api/sensor/route.js`:

```javascript
let system = {
  rain: false,
  temperature: 28,
  humidity: 65,
  mode: "AUTO",
  manualAction: null,
  eventLog: [
    "System started in AUTO mode"
  ],
  timestamp: new Date().toLocaleTimeString()
};
```

**Important Notes**:
- State persists during server session
- Resets on server restart
- Event log limited to last 20 events
- Timestamp updates with each request

---

## 🎯 Key Decision Points in Logic

### 1. Determine Cover State
```javascript
// In AUTO mode:
if (rain) {
  cover = "deployed"
  status = "Rain Detected - Cover Deployed"
} else {
  cover = "retracted"
  status = "No Rain - Cover Retracted"
}

// In MANUAL mode:
if (manualAction === "deploy") {
  cover = "deployed"
  status = "Manual Deploy"
} else if (manualAction === "retract") {
  cover = "retracted"
  status = "Manual Retract"
}
```

### 2. Determine Weather Appearance
```javascript
if (rain) {
  weather = "rainy"  // Use rainy background
} else if (temperature > 28) {
  weather = "sunny"  // Use sunny background
} else {
  weather = "cloudy"  // Use cloudy background
}
```

### 3. Determine Alert Display
```javascript
alertActive = rain && mode === "AUTO"
// Shows alert only if:
// - Rain is detected AND
// - System is in AUTO mode
```

---

## 📝 Event Logging

### When Events Are Logged

1. **System Start**
   - `"System started in AUTO mode"`

2. **Mode Changes**
   - `"Mode switched to MANUAL"` or `"Mode switched to AUTO"`

3. **Rain Detection**
   - `"[TIME] - ALERT: Rain detected"` (first rain)
   - `"[TIME] - Rain cleared"` (rain stops)

4. **Temperature Changes**
   - `"[TIME] - Temperature: 28°C"`

5. **Manual Actions**
   - `"[TIME] - Manual Deploy"`
   - `"[TIME] - Manual Retract"`
   - `"[TIME] - Manual override cleared"`

### Event Limit
- Maximum 20 events stored
- When exceeding limit, oldest events removed
- Last 20 events always available

---

## ✨ UI/UX Enhancements

### Color Coding
- **Green (#22c55e)**: AUTO mode, Clear status, Positive actions
- **Orange (#f59e0b)**: MANUAL mode, Manual actions
- **Blue (#0284c7)**: Deploy action, Primary information
- **Red (#ef4444)**: Rain alert, Danger/attention
- **Yellow (#fef3c7)**: Sensor simulation section

### Visual Feedback
- Button active state indicates current selection
- Disabled buttons (AUTO mode) show reduced opacity
- Color changes immediate on mode switch
- Alert banner appears/disappears smoothly
- Event log updates in real-time

### Responsive Design
- Sensor cards in 2-column grid
- Control panel full width
- Proper spacing and padding
- Mobile-friendly layout

---

## 🚀 Performance Considerations

1. **API Polling**: 10-second interval balances responsiveness and server load
2. **State Storage**: In-memory only - suitable for demo, should use database for production
3. **Event Logging**: Limited to 20 events to control memory usage
4. **Re-renders**: Only affected components re-render on data change (React optimization)
5. **Image Loading**: Static images served from public folder (no delay)

---

## 🐛 Testing Scenarios

### Scenario 1: AUTO Mode Rain Response
1. Start in AUTO mode
2. Click "Simulate Rain"
3. Verify: Cover deploys, alert shows, event logged
4. Click "Clear Rain"
5. Verify: Cover retracts, alert disappears, event logged

### Scenario 2: Manual Override
1. Switch to MANUAL mode
2. Simulate rain (should be ignored)
3. Verify: Cover doesn't auto-deploy
4. Click "Deploy Cover"
5. Verify: Cover deploys by manual action
6. Verify: Event shows "Manual Deploy"

### Scenario 3: Mode Switching
1. Start in AUTO mode with rain simulated
2. Cover should be deployed
3. Switch to MANUAL
4. Verify: Mode changes, cover state persists
5. Verify: Mode change event logged

### Scenario 4: Event Log History
1. Perform multiple actions (rain, mode switch, manual deploy)
2. Check Alerts tab
3. Verify: All actions in log with timestamps
4. Verify: Oldest events may disappear if >20 events

---

## 🎓 Learning Outcomes

After understanding this implementation, you should understand:
- ✅ How sensor-based systems work
- ✅ Separation of business logic from UI
- ✅ Client-server communication patterns
- ✅ React hooks for state management
- ✅ Component composition and data flow
- ✅ API design (GET vs POST)
- ✅ Event logging and monitoring
