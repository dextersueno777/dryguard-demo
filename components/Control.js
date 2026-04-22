"use client";

import { useEffect, useState } from "react";

export default function Control({ data = {}, onUpdate = () => {}, onToggleDemoMode }) {
    const demoActive = !!data.demoMode;
  const user = data.user || {};
  const isAdmin = user.role === "ADMIN";
  
  const [tempValue, setTempValue] = useState(data.temperature || 28);
  const [thresholdValue, setThresholdValue] = useState(data.rainThreshold ?? 700);

  const mode = data.mode || "AUTO";
  const manualAction = data.manualAction || null;
  const rainThreshold = data.rainThreshold ?? 700;
  const rainValue = data.rainValue ?? 0;
  const sensorStatus = data.sensorStatus || "OK";
  const motor = data.motor || "idle";
  const samplingIntervalSec = data.samplingIntervalSec || 1;
  const safetyStatus = data.safetyStatus || "Ready";

  useEffect(() => {
    setTempValue(data.temperature || 28);
    setThresholdValue(data.rainThreshold ?? 700);
  }, [data.temperature, data.rainThreshold]);

  const toggleMode = async () => {
    const newMode = mode === "AUTO" ? "MANUAL" : "AUTO";
    await onUpdate({ mode: newMode });
  };

  const simulateRain = async () => {
    await onUpdate({ rainValue: 750 });
  };

  const clearRain = async () => {
    await onUpdate({ rainValue: 300 });
  };

  const adjustTemperature = async (value) => {
    setTempValue(value);
    await onUpdate({ temperature: parseInt(value) });
  };

  const deployManually = async () => {
    if (mode === "MANUAL") {
      await onUpdate({ manualAction: "deploy" });
    }
  };

  const retractManually = async () => {
    if (mode === "MANUAL") {
      await onUpdate({ manualAction: "retract" });
    }
  };

  const clearManualOverride = async () => {
    await onUpdate({ manualAction: null });
  };

  const triggerSensorError = async () => {
    await onUpdate({ sensorStatus: "ERROR" });
  };

  const restoreSensor = async () => {
    await onUpdate({ sensorStatus: "OK" });
  };

  const applyThreshold = async () => {
    await onUpdate({ rainThreshold: Number(thresholdValue) });
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "20px" }}>
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
      </div>
      <h2>System Control Panel</h2>

      {/* Mode Toggle */}
      <div style={{
        background: "#f0f9ff",
        border: "2px solid #0284c7",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px"
      }}>
        <h3>🔧 System Mode</h3>
        <p style={{ fontSize: "14px", color: "#666" }}>
          {mode === "AUTO"
            ? "System automatically deploys cover when rain is detected"
            : "You have manual control - system ignores rain sensors"}
        </p>
        <button
          onClick={toggleMode}
          style={{
            width: "100%",
            padding: "12px",
            background: mode === "AUTO" ? "#22c55e" : "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Current: {mode} MODE → Switch to {mode === "AUTO" ? "MANUAL" : "AUTO"}
        </button>
      </div>

      {/* Simulation Controls */}
      <div style={{
        background: "#fef3c7",
        border: "2px solid #f59e0b",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        opacity: demoActive ? 0.5 : 1,
        pointerEvents: demoActive ? "none" : "auto"
      }}>
        <h3>📊 Sensor Simulation</h3>

        <div style={{ background: "#fff", borderRadius: "8px", padding: "12px", marginBottom: "15px" }}>
          <p style={{ margin: "4px 0" }}><strong>Rain Value:</strong> {rainValue}</p>
          <p style={{ margin: "4px 0" }}><strong>Threshold:</strong> {rainThreshold}</p>
          <p style={{ margin: "4px 0" }}><strong>Status:</strong> {rainValue > rainThreshold ? "Rain Detected" : "No Rain"}</p>
        </div>

        {/* Rain Simulation */}
        <div style={{ marginBottom: "15px" }}>
          <p style={{ fontSize: "14px", fontWeight: "600" }}>🌧 Rain Simulation</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={simulateRain}
              style={{
                flex: 1,
                padding: "10px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Simulate Rain
            </button>
            <button
              onClick={clearRain}
              style={{
                flex: 1,
                padding: "10px",
                background: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Clear Rain
            </button>
          </div>
        </div>

        {/* Temperature Control */}
        <div style={{ marginBottom: "15px" }}>
          <p style={{ fontSize: "14px", fontWeight: "600" }}>🌡 Temperature Control</p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="range"
              min="15"
              max="40"
              value={tempValue}
              onChange={(e) => adjustTemperature(e.target.value)}
              style={{ flex: 1, height: "8px" }}
            />
            <span style={{ fontWeight: "600", minWidth: "80px" }}>{tempValue}°C</span>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <p style={{ fontSize: "14px", fontWeight: "600" }}>🎚 Threshold Calibration</p>
          {!isAdmin ? (
            <div style={{
              background: "#f3e8ff",
              border: "1px solid #d8b4fe",
              color: "#6b21a8",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "13px"
            }}>
              ⚠️ Admin only: Threshold calibration is restricted to administrators.
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="number"
                  min="100"
                  max="1023"
                  value={thresholdValue}
                  onChange={(e) => setThresholdValue(e.target.value)}
                  style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />
                <button
                  onClick={applyThreshold}
                  style={{
                    padding: "10px 14px",
                    background: "#6366f1",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Apply
                </button>
              </div>
              <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#555" }}>
                The threshold can be calibrated depending on environmental conditions.
              </p>
            </>
          )}
        </div>

        <div style={{ marginTop: "10px" }}>
          <p style={{ fontSize: "14px", fontWeight: "600" }}>⚠ Sensor Health</p>
          {!isAdmin ? (
            <div style={{
              background: "#fef3c7",
              border: "1px solid #fcd34d",
              color: "#92400e",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "13px"
            }}>
              ⚠️ Admin only: Sensor simulation is restricted to administrators.
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={triggerSensorError}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#f97316",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Simulate Sensor Error
              </button>
              <button
                onClick={restoreSensor}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#0ea5e9",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Restore Sensor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Manual Control */}
      <div style={{
        background: mode === "MANUAL" ? "#e0f2fe" : "#f3f4f6",
        border: `2px solid ${mode === "MANUAL" ? "#0284c7" : "#d1d5db"}`,
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        opacity: demoActive ? 0.5 : (mode === "MANUAL" ? 1 : 0.6),
        pointerEvents: demoActive ? "none" : "auto"
      }}>
        <h3>🎛 Manual Cover Control {mode !== "MANUAL" && "(Disabled in AUTO mode)"}</h3>
        <p style={{ fontSize: "14px", color: "#666" }}>
          {mode === "MANUAL"
            ? "Override automatic control and manually deploy or retract the cover"
            : "Switch to MANUAL mode to enable manual control"}
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={deployManually}
            disabled={mode !== "MANUAL"}
            style={{
              flex: 1,
              padding: "12px",
              background: mode === "MANUAL" ? "#3b82f6" : "#d1d5db",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: mode === "MANUAL" ? "pointer" : "not-allowed",
              fontWeight: "600"
            }}
          >
            ▼ Deploy Cover
          </button>
          <button
            onClick={retractManually}
            disabled={mode !== "MANUAL"}
            style={{
              flex: 1,
              padding: "12px",
              background: mode === "MANUAL" ? "#10b981" : "#d1d5db",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: mode === "MANUAL" ? "pointer" : "not-allowed",
              fontWeight: "600"
            }}
          >
            ▲ Retract Cover
          </button>
        </div>
        {manualAction && mode === "MANUAL" && (
          <button
            onClick={clearManualOverride}
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "10px",
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Clear Override
          </button>
        )}
      </div>

      <div style={{ background: "#eff6ff", padding: "15px", borderRadius: "8px", fontSize: "14px" }}>
        <strong>Current State:</strong>
        <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>Mode: <strong>{mode}</strong></li>
          <li>Rain Value: <strong>{rainValue}</strong></li>
          <li>Threshold: <strong>{rainThreshold}</strong></li>
          <li>Rain: <strong>{rainValue > rainThreshold ? "🌧 Detected" : "✓ Clear"}</strong></li>
          <li>Temperature: <strong>{data.temperature}°C</strong></li>
          <li>Humidity: <strong>{data.humidity}%</strong></li>
          <li>Motor: <strong>{motor === "moving" ? "⚙ Motor Running" : "⏹ Motor Idle"}</strong></li>
          <li>Sensor: <strong>{sensorStatus === "OK" ? "OK" : "ERROR"}</strong></li>
          <li>Sampling: <strong>{samplingIntervalSec}s interval</strong></li>
          <li>Safety: <strong>{safetyStatus}</strong></li>
          <li>Cover: <strong>{data.cover}</strong></li>
        </ul>
      </div>
    </div>
  );
}