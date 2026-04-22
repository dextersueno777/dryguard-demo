"use client";

import { useEffect, useRef, useState } from "react";
import SensorCard from "@/components/SensorCard";
import StatusBanner from "@/components/StatusBanner";
import WeatherScene from "@/components/WeatherScene";

function DynamicGreeting() {
  const now = new Date();
  const phTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Manila" })
  );
  const currentHour = phTime.getHours();

  let greeting = "Hello";

  if (currentHour >= 0 && currentHour < 12) {
    greeting = "Magandang umaga";
  } else if (currentHour === 12) {
    greeting = "Magandang tanghali";
  } else if (currentHour > 12 && currentHour < 18) {
    greeting = "Magandang hapon";
  } else {
    greeting = "Magandang gabi";
  }

  let username = "User";
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        username = JSON.parse(stored).username || "User";
      } catch {}
    }
  }

  const nameMap = {
    admin: "Admin",
    dad: "Dad",
    mom: "Mom",
    lola: "Lola",
    lolo: "Lolo",
    brother: "Brother",
    sister: "Sister"
  };

  const displayName = nameMap[username] || username;

  return (
    <p>
      {greeting}, {displayName}! 🌸
    </p>
  );
}
export default function Home({ data, onToggleDemoMode }) {
  const safeData = data || {
    rain: false,
    temperature: 28,
    humidity: 65,
    mode: "AUTO",
    cover: "retracted",
    status: "NoRain Retract",
    description: "System is initializing...",
    weather: "sunny",
    weatherLabel: "SUNNY",
    rainValue: 320,
    rainThreshold: 700,
    sensorStatus: "OK",
    motor: "idle",
    systemHealth: "Stable",
    responseTimeSec: 0,
    lastUpdateMs: 0,
    timestamp: "--:--:--"
  };
  const demoActive = !!safeData.demoMode;

  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
  const previousRainRef = useRef(false);

  // System state from API
  const rain = safeData.rain;
  const temperature = safeData.temperature;
  const humidity = safeData.humidity;
  const mode = safeData.mode;
  const coverStatus = safeData.cover;
  const systemStatus = safeData.status;
  const systemDescription = safeData.description;
  const weather = safeData.weather;
  const weatherLabel = safeData.weatherLabel || "SUNNY";
  const rainValue = safeData.rainValue ?? 0;
  const rainThreshold = safeData.rainThreshold ?? 700;
  const sensorStatus = safeData.sensorStatus || "OK";
  const motor = safeData.motor || "idle";
  const systemHealth = safeData.systemHealth || "Stable";
  const decisionReason = safeData.decisionReason || "Decision not available.";
  const processing = safeData.processing || false;
  const flowFrom = safeData.processingFrom || safeData.lastStableStatus || "NoRain Retract";
  const flowTo = safeData.processingTo || systemStatus;
  const samplingIntervalSec = safeData.samplingIntervalSec || 1;
  const safetyStatus = safeData.safetyStatus || "Ready";
  const lastActionTimestamp = safeData.lastActionTimestamp || "--:--:--";
  const sensorVariance = safeData.sensorVariance ?? 0;

  // Alert indicator
  const alertActive = rain && mode === "AUTO";

  useEffect(() => {
    const interval = setInterval(() => {
      if (safeData.lastUpdateMs) {
        const elapsed = Math.max(0, Math.floor((Date.now() - safeData.lastUpdateMs) / 1000));
        setSecondsSinceUpdate(elapsed);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [safeData.lastUpdateMs]);

  useEffect(() => {
    const playBeep = () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = 880;
        gain.gain.value = 0.05;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        setTimeout(() => {
          osc.stop();
          ctx.close();
        }, 160);
      } catch (err) {
        // Ignore if browser blocks audio.
      }
    };

    let buzzerInterval = null;
    if (rain && mode === "AUTO" && sensorStatus === "OK") {
      if (!previousRainRef.current) {
        playBeep();
      }
      // Short repeating beep while rain is active.
      buzzerInterval = setInterval(playBeep, 900);
    }

    previousRainRef.current = rain;

    return () => {
      if (buzzerInterval) clearInterval(buzzerInterval);
    };
  }, [rain, mode, sensorStatus]);

  return (
    <div className="main-container">
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
        <span style={{ fontWeight: 600, fontSize: 18 }}>
          DEMO MODE: {demoActive ? "ACTIVE" : "OFF"}
        </span>
        {onToggleDemoMode && (
          <button
            style={{
              background: demoActive ? "#2563eb" : "#d1d5db",
              color: demoActive ? "#fff" : "#111",
              border: "none",
              borderRadius: 6,
              padding: "4px 16px",
              fontWeight: 600,
              cursor: "pointer"
            }}
            onClick={onToggleDemoMode}
          >
            {demoActive ? "ON" : "OFF"}
          </button>
        )}
        <span style={{ marginLeft: 24, fontSize: 16 }}>
          Current Weather: <b>{safeData.weatherLabel || safeData.currentWeather || "-"}</b>
        </span>
      </div>
      <h1>DryGuard</h1>
      <DynamicGreeting />
      <div style={{ background: "#eef2ff", border: "2px solid #6366f1", borderRadius: "12px", padding: "12px", marginBottom: "12px" }}>
        {demoActive && (
          <div style={{ color: "#2563eb", fontWeight: 500, marginBottom: 4 }}>
            <span>Demo Mode: Automatic weather cycling every 6s</span>
          </div>
        )}
              {demoActive && (
                <div style={{ color: "#2563eb", fontWeight: 500, marginBottom: 4 }}>
                  <span>Current Weather: {safeData.weatherLabel || safeData.currentWeather || "-"} — {safeData.currentWeatherDescription || ""}</span>
                </div>
              )}
        <div style={{ fontWeight: "700", marginBottom: "6px" }}>SYSTEM SUMMARY</div>
        <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
          <div>Mode: {mode}</div>
          <div>Rain: {rain ? "Detected" : "No Rain"} (Value: {rainValue})</div>
          <div>Threshold: {rainThreshold}</div>
          <div>Action: {systemStatus}</div>
          <div>Motor: {motor === "moving" ? "Running" : "Idle"}</div>
          <div>Response Time: {safeData.responseTimeSec || 0}s</div>
          <div>System Status: {systemHealth}</div>
          <div>Last Action: {lastActionTimestamp}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
        <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
          {motor === "moving" ? "⚙ Motor Running" : "⏹ Motor Idle"}
        </div>
        <div style={{ background: sensorStatus === "OK" ? "#ecfeff" : "#fff7ed", border: sensorStatus === "OK" ? "1px solid #67e8f9" : "1px solid #fdba74", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
          {sensorStatus === "OK" ? "Sensor Status: OK" : "⚠ Sensor Error"}
        </div>
      </div>

      <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "10px", marginBottom: "12px", fontSize: "13px" }}>
        <strong>Decision:</strong> {decisionReason}
      </div>

      <div style={{ background: processing ? "#fff7ed" : "#ecfeff", border: processing ? "1px solid #fdba74" : "1px solid #67e8f9", borderRadius: "10px", padding: "10px", marginBottom: "12px", fontSize: "13px" }}>
        <strong>State Flow:</strong> {flowFrom} → {processing ? "Processing" : "Final"} → {flowTo}
        {processing && (
          <div style={{ marginTop: "6px" }}>
            ⏳ Processing ({safeData.responseTimeSec || 0}s) | ⚙ Motor Running | pending {flowTo}
          </div>
        )}
      </div>

      <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "10px", marginBottom: "12px" }}>
        <strong>System Flow Diagram (UI Version)</strong>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr", alignItems: "center", gap: "6px", marginTop: "8px", fontSize: "12px" }}>
          <div style={{ padding: "8px", borderRadius: "8px", textAlign: "center", background: "#dbeafe" }}>Sensor</div>
          <div>→</div>
          <div style={{ padding: "8px", borderRadius: "8px", textAlign: "center", background: processing ? "#fde68a" : "#dbeafe" }}>Logic</div>
          <div>→</div>
          <div style={{ padding: "8px", borderRadius: "8px", textAlign: "center", background: motor === "moving" ? "#fde68a" : "#dbeafe" }}>Motor</div>
          <div>→</div>
          <div style={{ padding: "8px", borderRadius: "8px", textAlign: "center", background: !processing && motor !== "moving" ? "#bbf7d0" : "#dbeafe" }}>Cover</div>
        </div>
      </div>

      <div style={{ background: "#0f172a", color: "#86efac", borderRadius: "10px", padding: "12px", marginBottom: "15px", fontFamily: "monospace", border: "2px solid #1e293b" }}>
        <div style={{ color: "#f8fafc", marginBottom: "6px" }}>[ LCD DISPLAY ]</div>
        <div>Temp: {temperature}C</div>
        <div>{systemStatus}</div>
      </div>
      
      {/* System Mode Badge */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <span style={{
          background: mode === "AUTO" ? "#22c55e" : "#f59e0b",
          color: "white",
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "14px",
          fontWeight: "600"
        }}>
          {mode} MODE
        </span>
      </div>

      {/* Rain Alert Banner */}
      {alertActive && (
        <div style={{
          background: "#fee2e2",
          border: "2px solid #dc2626",
          color: "#991b1b",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "15px",
          fontWeight: "600",
          textAlign: "center"
        }}>
          🌧️ ALERT: Rain detected | Status: Rain Deploy
        </div>
      )}

      {/* Weather Scene */}
      <div style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "bold", margin: "1rem 0" }}>
        {safeData.weatherLabel === "RAINY" ? "🌧️ Rainy" : safeData.weatherLabel === "SUNNY" ? "☀️ Sunny" : safeData.weatherLabel === "BREEZY" ? "🌬️ Breezy" : "☁️ Cloudy"}
      </div>
      <WeatherScene weather={weather} isCoverDeployed={coverStatus === "deployed"} />

      {/* Status Banner */}
      <StatusBanner
        status={systemStatus}
        description={systemDescription}
      />

      {/* Sensor Readings */}
      <div className="grid">
        <SensorCard label="Rain Value" value={rainValue} />
        <SensorCard label="Threshold" value={rainThreshold} />
        <SensorCard label="Rain Sensor" value={rain ? "🌧 Rain Detected" : "✓ No Rain"} />
        <SensorCard label="Humidity" value={`${humidity}%`} />
        <SensorCard label="Temperature" value={`${temperature}°C`} />
        <SensorCard label="Cover Status" value={systemStatus} />
      </div>

      <div style={{ marginTop: "12px", background: "#f1f5f9", borderRadius: "10px", padding: "10px", fontSize: "13px" }}>
        <strong>System Status:</strong> {systemHealth} | <strong>Response Time:</strong> {safeData.responseTimeSec || 0}s | <strong>Last update:</strong> {secondsSinceUpdate}s ago | <strong>Sensor Sampling:</strong> {samplingIntervalSec}s interval | <strong>Safety:</strong> {safetyStatus} | <strong>Sensor Stability:</strong> ±{sensorVariance} variance
      </div>

      <p className="timestamp">
  Last updated: {
    new Date().toLocaleTimeString("en-US", {
      timeZone: "Asia/Manila"
    })
  } — refreshes every 1s
</p>
    </div>
  );
}

