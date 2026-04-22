# DryGuard - Sensor-Based System Implementation

## 🎯 System Overview
DryGuard is an **intelligent drying cover automation system** that uses rain sensors and temperature monitoring to automatically protect clothes. The system operates in two modes: **AUTO** (automatic rain detection) and **MANUAL** (user override).

### Core System Logic
```
IF mode === "AUTO":
  IF rain detected → Cover deploys automatically
  IF no rain → Cover retracts automatically

IF mode === "MANUAL":
  Rain sensor ignored
  User has complete control via Deploy/Retract buttons
```

## Project Overview
DryGuard is a smart drying cover automation system with a Next.js frontend that displays real-time weather conditions, sensor data, and automatic cover deployment status.

---

## ✅ Fixes Applied

### 1. **Data Fetching & Auto-Refresh** (page.js)
- **Issue**: Home component wasn't receiving sensor data
- **Fix**: 
  - Added `useEffect` hook to fetch from `/api/sensor` endpoint
  - Implemented auto-refresh every 10 seconds
  - Added fallback mock data for offline mode
  - Passed sensor data to Home component via props

### 2. **Navigation Styling** (globals.css)
- **Issue**: Navigation buttons had no styling
- **Fix**:
  - Added `nav` selector with flexbox layout
  - Styled buttons with blue background (#60a5fa)
  - Added hover effects with darker blue (#3b82f6)
  - Made nav sticky at top with proper z-index
  - Improved spacing and padding

### 3. **Component Default Props**
- **Alerts.js**: Added default empty array for `alerts` prop
- **Control.js**: Added default props for `manualOverride`, `setManualOverride`, `setAutoMode`
- **Settings.js**: Added default props for `notificationsEnabled`, `setNotificationsEnabled`, `simSpeed`, `setSimSpeed`
- **Reason**: Prevent "Cannot read properties of undefined" errors when components render without parent state

---

## 📦 Working Features

### Images
All weather scene images are loading correctly:
- ✅ `sunny.png` - Bright sunny background
- ✅ `cloudy.png` - Cloudy sky background
- ✅ `rainy.png` - Dark rainy background
- ✅ `clothesline.png` - Clothesline with clothes
- ✅ `cover.png` - Protective cover overlay

### Animations
- ✅ Cover deployment with 0.5s smooth transition
- ✅ Opacity fade effects on cover
- ✅ Background image transitions between weather states

### Core Functionality
- ✅ **Weather Detection**: Real-time weather cycling (sunny → breezy → cloudy → rainy)
- ✅ **Auto-Deploy Cover**: Deploys when cloudy/rainy, retracts when sunny/breezy
- ✅ **Sensor Readings**: 
  - Rain detection status
  - Humidity percentage
  - Temperature in Celsius
  - Cover deployment state
- ✅ **Tab Navigation**: Home, Alerts, Control, Settings
- ✅ **Dynamic Greeting**: Tagalog greetings based on time of day
- ✅ **Auto-Refresh**: Updates every 10 seconds
- ✅ **Status Banner**: Shows current cover status and protective message

---

## 🚀 Running the Project

```bash
npm run dev
```

Access at: **http://localhost:3000**

The app will:
1. Start Next.js development server on port 3000
2. Auto-compile on file changes
3. Fetch sensor data every 10 seconds from `/api/sensor`
4. Cycle through 4 weather scenarios from `lib/scenes.js`

---

## 📁 File Structure

```
DryGuard/
├── app/
│   ├── page.js                 (Main page with data fetching)
│   ├── layout.js               (Root layout)
│   ├── globals.css             (Global styles + navigation)
│   └── api/sensor/route.js     (Sensor data API endpoint)
├── components/
│   ├── Home.js                 (Main dashboard)
│   ├── WeatherScene.js         (Weather background + animations)
│   ├── StatusBanner.js         (Status message display)
│   ├── SensorCard.js           (Individual sensor display)
│   ├── Alerts.js               (Notifications tab)
│   ├── Control.js              (Manual cover control tab)
│   ├── Settings.js             (Settings tab)
│   └── [Other components]
├── lib/
│   └── scenes.js               (Mock weather data cycles)
└── public/
    └── images/
        ├── sunny.png
        ├── cloudy.png
        ├── rainy.png
        ├── breezy.png
        ├── clothesline.png
        └── cover.png
```

---

## 🔧 Technical Stack

- **Framework**: Next.js 16.2.4
- **Build Tool**: Turbopack
- **Language**: JavaScript (React)
- **Styling**: CSS (globals.css)
- **State Management**: React hooks (useState, useEffect)

---

## 📝 Notes

- Mock sensor data cycles every 10 seconds based on `lib/scenes.js`
- Cover auto-deploys for "cloudy" and "rainy" weather states
- All images are served from `/public/images/` directory
- Responsive grid layout for sensor cards (2 columns)
- Professional glass-morphism UI effects on weather scene
