import { getSystemState, getWeatherAppearance, isRainDetected, getWeatherLabel } from "@/lib/systemLogic";

// Demo mode weather cycle
const DEMO_STATES = [
  { label: "SUNNY", rainValue: 580, description: "Clear sky conditions" },
  { label: "BREEZY", rainValue: 640, description: "Light breeze, still dry" },
  { label: "CLOUDY", rainValue: 690, description: "Clouds overhead" },
  { label: "RAINY", rainValue: 750, description: "Rain detected" }
];
let demoStateIndex = 0;
let demoUpdateCounter = 0;
const DEMO_UPDATES_PER_STATE = 6; // Each state lasts ~6 API calls (10s interval = ~60s per state)

// In-memory system state
let system = {
  rainValue: 320,
  rainThreshold: 700,
  rain: false,
  temperature: 28,
  humidity: 65,
  mode: "AUTO", // AUTO or MANUAL
  manualAction: null, // null, "deploy", or "retract"
  motor: "idle", // idle or moving
  processing: false,
  processingFrom: "NoRain Retract",
  processingTo: "NoRain Retract",
  sensorStatus: "OK", // OK or ERROR
  samplingIntervalSec: 1,
  sensorVariance: 0,
  safetyStatus: "Ready",
  systemHealth: "Stable",
  lastActionTimestamp: "--:--:--",
  decisionReason: "Decision: Rain value (320) did not exceed threshold (700).",
  demoMode: false,
  weatherLabel: "SUNNY",
  currentWeather: "SUNNY",
  currentWeatherDescription: "Clear sky",
  responseTimeSec: 0,
  lastUpdateMs: Date.now(),
  cover: "retracted",
  lastStableStatus: "NoRain Retract",
  eventLog: ["System started in AUTO mode"],
  timestamp: new Date().toLocaleTimeString()
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function applyNoiseSample() {
  if (system.sensorStatus !== "OK") return;

  // In DEMO mode, cycle through weather states instead of random noise
  if (system.demoMode) {
    demoUpdateCounter++;
    if (demoUpdateCounter >= DEMO_UPDATES_PER_STATE) {
      demoUpdateCounter = 0;
      demoStateIndex = (demoStateIndex + 1) % DEMO_STATES.length;
      const nextState = DEMO_STATES[demoStateIndex];
      system.rainValue = nextState.rainValue;
      system.weatherLabel = nextState.label;
      console.log(`[DEMO] Cycling to: ${nextState.label} (rainValue: ${nextState.rainValue})`);
    }
  } else {
    // Normal operation: add small random noise
    const delta = Math.random() * 10 - 5;
    system.sensorVariance = Math.abs(Math.round(delta));
    system.rainValue = Math.round(clamp(system.rainValue + delta, 0, 1023));
  }
}

function computeState() {
  const computed = getSystemState({
    rainValue: system.rainValue,
    rainThreshold: system.rainThreshold,
    mode: system.mode,
    manualAction: system.manualAction,
    sensorStatus: system.sensorStatus,
    currentCover: system.cover
  });
const rain = isRainDetected(system.rainValue, system.rainThreshold);

const weather = system.demoMode
  ? system.weatherLabel.toLowerCase()
  : getWeatherAppearance(rain, system.temperature);

let weatherLabel;

if (system.demoMode) {
  weatherLabel = system.weatherLabel; // ✅ KEEP DEMO VALUE
} else {
  weatherLabel = getWeatherLabel(system.rainValue); // normal logic
}
  // DEBUG: Log weather calculation
  console.log(`[DEBUG] RainValue: ${system.rainValue}, Weather: ${weatherLabel}, Rain: ${rain}, Cover: ${computed.cover}`);

  system = {
    ...system,
    rain,
    cover: computed.cover,
    status: computed.status,
    description: computed.description,
    decisionReason: computed.decision,
    weather,
    weatherLabel,
    timestamp: new Date().toLocaleTimeString()
  };

  if (!system.currentWeather) {
    system.currentWeather = weatherLabel;
  }

  if (!system.processing && !["Sensor Error"].includes(system.status)) {
    system.lastStableStatus = system.status;
  }

  return system;
}

export async function GET() {
  applyNoiseSample();
  system.lastUpdateMs = Date.now();
  const state = computeState();
  return Response.json(state);
}

export async function POST(req) {
  const data = await req.json();

  const commandFields = ["rainValue", "rainThreshold", "temperature", "humidity", "mode", "manualAction", "sensorStatus"];
  const hasCommand = commandFields.some((field) => data[field] !== undefined);

  if (system.motor === "moving" && hasCommand && data.motor !== "idle") {
    const nowText = new Date().toLocaleTimeString();
    system.safetyStatus = "Preventing conflicting commands";
    system.systemHealth = "Stable";
    system.lastActionTimestamp = nowText;
    system.eventLog.push(`${nowText} - Safety: Prevented conflicting command while motor moving`);
    if (system.eventLog.length > 20) {
      system.eventLog = system.eventLog.slice(-20);
    }
    return Response.json(computeState());
  }

  const previousRain = isRainDetected(system.rainValue, system.rainThreshold);

  // Direct field updates
  if (data.rainValue !== undefined) system.rainValue = Number(data.rainValue);
  if (data.rainThreshold !== undefined) system.rainThreshold = Number(data.rainThreshold);
  if (data.temperature !== undefined) system.temperature = Number(data.temperature);
  if (data.humidity !== undefined) system.humidity = Number(data.humidity);
  if (data.mode !== undefined) system.mode = data.mode;
  if (data.manualAction !== undefined) system.manualAction = data.manualAction;
  if (data.motor !== undefined) system.motor = data.motor;
  if (data.processing !== undefined) system.processing = data.processing;
  if (data.processingFrom !== undefined) system.processingFrom = data.processingFrom;
  if (data.processingTo !== undefined) system.processingTo = data.processingTo;
  if (data.sensorStatus !== undefined) system.sensorStatus = data.sensorStatus;
  if (data.systemHealth !== undefined) system.systemHealth = data.systemHealth;
  if (data.safetyStatus !== undefined) system.safetyStatus = data.safetyStatus;
  if (data.demoMode !== undefined) {
    system.demoMode = data.demoMode;
    if (data.demoMode) {
      // Initialize demo mode with first state
      demoStateIndex = 0;
      demoUpdateCounter = 0;
      const firstState = DEMO_STATES[0];
      system.rainValue = firstState.rainValue;
      system.weatherLabel = firstState.label;
      console.log(`[DEMO] Initialized: ${firstState.label} (rainValue: ${firstState.rainValue})`);
    }
  }
  if (data.weatherLabel !== undefined) system.weatherLabel = data.weatherLabel;
  if (data.currentWeather !== undefined) system.currentWeather = data.currentWeather;
  if (data.currentWeatherDescription !== undefined) system.currentWeatherDescription = data.currentWeatherDescription;
  if (data.responseTimeSec !== undefined) system.responseTimeSec = data.responseTimeSec;

  const currentRain = isRainDetected(system.rainValue, system.rainThreshold);
  const nowText = new Date().toLocaleTimeString();

  // Event logging
  if (data.mode !== undefined) {
    system.lastActionTimestamp = nowText;
    system.eventLog.push(`${nowText} - Mode switched to ${data.mode}`);
  }
  if (data.manualAction === "deploy") {
    system.lastActionTimestamp = nowText;
    system.eventLog.push(`${nowText} - Manual Deploy`);
  } else if (data.manualAction === "retract") {
    system.lastActionTimestamp = nowText;
    system.eventLog.push(`${nowText} - Manual Retract`);
  }
  if (data.temperature !== undefined) {
    system.lastActionTimestamp = nowText;
    system.eventLog.push(`${nowText} - Temperature: ${system.temperature}C`);
  }
  if (data.rainThreshold !== undefined) {
    system.lastActionTimestamp = nowText;
    system.eventLog.push(`${nowText} - Threshold set to ${system.rainThreshold}`);
  }
  if (data.rainValue !== undefined) {
    system.lastActionTimestamp = nowText;
  }
  if (data.sensorStatus === "ERROR") {
    system.lastActionTimestamp = nowText;
    system.eventLog.push(`${nowText} - Sensor Error`);
  }
  if (data.sensorStatus === "OK") {
    system.lastActionTimestamp = nowText;
    system.eventLog.push(`${nowText} - Sensor Restored`);
  }

  if (currentRain && !previousRain) {
    system.lastActionTimestamp = nowText;
    system.eventLog.push(`${nowText} - ALERT: Rain detected`);
  } else if (!currentRain && previousRain) {
    system.lastActionTimestamp = nowText;
    system.eventLog.push(`${nowText} - Rain cleared`);
  }

  if (data.motor === "idle") {
    system.safetyStatus = "Ready";
  }

  // Keep only last 20 events
  if (system.eventLog.length > 20) {
    system.eventLog = system.eventLog.slice(-20);
  }

  system.lastUpdateMs = Date.now();
  const state = computeState();
  return Response.json(state);
}
