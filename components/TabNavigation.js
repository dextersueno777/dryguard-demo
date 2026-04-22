import React from "react";

export default function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <nav className="bottom-nav">
      <button
        className={activeTab === "home" ? "active" : ""}
        onClick={() => setActiveTab("home")}
      >
        🏠 Home
      </button>
      <button
        className={activeTab === "alerts" ? "active" : ""}
        onClick={() => setActiveTab("alerts")}
      >
        🔔 Alerts
      </button>
      <button
        className={activeTab === "control" ? "active" : ""}
        onClick={() => setActiveTab("control")}
      >
        🎛 Control
      </button>
      <button
        className={activeTab === "settings" ? "active" : ""}
        onClick={() => setActiveTab("settings")}
      >
        ⚙️ Settings
      </button>
    </nav>
  );
}
