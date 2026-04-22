"use client";

import { useState, useEffect, useRef } from "react";
import Home from "@/components/Home";
import Alerts from "@/components/Alerts";
import Control from "@/components/Control";
import Settings from "@/components/Settings";
import { weatherStates } from "@/lib/demoWeather";

function predictTargetStatus(current, updates) {
  const mode = updates.mode ?? current.mode ?? "AUTO";
  const manualAction = updates.manualAction ?? current.manualAction ?? null;
  const sensorStatus = updates.sensorStatus ?? current.sensorStatus ?? "OK";
  const rainThreshold = updates.rainThreshold ?? current.rainThreshold ?? 700;
  const rainValue = updates.rainValue ?? current.rainValue ?? 0;

  if (sensorStatus === "ERROR") return "Sensor Error";
  if (mode === "MANUAL") {
    if (manualAction === "deploy") return "Manual Deploy";
    if (manualAction === "retract") return "Manual Retract";
  }
  if (Number(rainValue) > Number(rainThreshold)) return "Rain Deploy";
  return "NoRain Retract";
}

export default function Page() {
  const [activeTab, setActiveTab] = useState("home");
  const [sensorData, setSensorData] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const sensorDataRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      window.location.href = "/login";
    } else {
      setUser(JSON.parse(stored));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    sensorDataRef.current = sensorData;
  }, [sensorData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor", { cache: "no-store" });
        const data = await res.json();
        setSensorData(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        setSensorData({
          rainValue: 320,
          rainThreshold: 700,
          rain: false,
          temperature: 28,
          humidity: 65,
          mode: "AUTO",
          manualAction: null,
          motor: "idle",
          processing: false,
          processingFrom: "NoRain Retract",
          processingTo: "NoRain Retract",
          sensorStatus: "OK",
          samplingIntervalSec: 1,
          safetyStatus: "Ready",
          systemHealth: "Stable",
          decisionReason: "Decision: Rain value (320) did not exceed threshold (700).",
          demoMode: false,
          weatherLabel: "SUNNY",
          currentWeather: "SUNNY",
          currentWeatherDescription: "Clear sky",
          responseTimeSec: 0,
          lastUpdateMs: Date.now(),
          cover: "retracted",
          status: "NoRain Retract",
          description: "System is ready",
          weather: "sunny",
          eventLog: ["System started"],
          timestamp: new Date().toLocaleTimeString()
        });
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSystemUpdate = async (updates) => {
    try {
      const current = sensorDataRef.current;

      if (current?.motor === "moving") {
        const safetyRes = await fetch("/api/sensor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ safetyStatus: "Preventing conflicting commands" })
        });
        const safetyData = await safetyRes.json();
        setSensorData(safetyData);
        return;
      }

      const fromStatus = current?.status || "NoRain Retract";
      const toStatus = predictTargetStatus(current || {}, updates);

      // Simulate 2-4s response time and show motor action while processing.
      const movingRes = await fetch("/api/sensor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motor: "moving",
          processing: true,
          processingFrom: fromStatus,
          processingTo: toStatus,
          safetyStatus: "Ready",
          systemHealth: "Stable"
        })
      });
      const movingData = await movingRes.json();
      setSensorData(movingData);
      sensorDataRef.current = movingData;

      const responseTimeMs = 2000 + Math.floor(Math.random() * 2001);

      await new Promise((resolve) => {
        setTimeout(resolve, responseTimeMs);
      });

      const res = await fetch("/api/sensor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updates,
          motor: "idle",
          processing: false,
          responseTimeSec: Number((responseTimeMs / 1000).toFixed(1))
        })
      });
      const data = await res.json();
      setSensorData(data);
      sensorDataRef.current = data;
    } catch (error) {
      console.error("Error updating system:", error);
    }
  };

  // Demo mode is now handled in the API - removed client-side cycling

  const handleDemoModeToggle = async () => {
    const next = !demoMode;
    setDemoMode(next);

    try {
      const res = await fetch("/api/sensor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoMode: next })
      });
      const data = await res.json();
      setSensorData(data);
    } catch (error) {
      console.error("Error toggling demo mode:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) return null;

  return (
    <div>
      {/* User Header */}
      <div style={{
        background: "#f3f4f6",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #d1d5db"
      }}>
        <div style={{ fontSize: "14px", color: "#666" }}>
          <span style={{ fontWeight: 600 }}>👤 {user?.username}</span>
          <span style={{ marginLeft: "12px", background: user?.role === "ADMIN" ? "#dc2626" : "#3b82f6", color: "white", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>
            {user?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600"
          }}
        >
          Logout
        </button>
      </div>

      {/* Navigation */}
      <nav>
        <button onClick={() => setActiveTab("home")}>🏠 Home</button>
        <button onClick={() => setActiveTab("alerts")}>🔔 Alerts</button>
        <button onClick={() => setActiveTab("control")}>🎛 Control</button>
        <button onClick={() => setActiveTab("settings")}>⚙️ Settings</button>
      </nav>

      {/* Pages */}
      {activeTab === "home" && <Home data={{ ...sensorData, demoMode, user }} onToggleDemoMode={handleDemoModeToggle} />}
      {activeTab === "alerts" && <Alerts data={sensorData} />}
      {activeTab === "control" && <Control data={{ ...sensorData, demoMode, user }} onUpdate={handleSystemUpdate} onToggleDemoMode={handleDemoModeToggle} />}
      {activeTab === "settings" && <Settings data={sensorData} />}
    </div>
  );
}
