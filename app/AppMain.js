import { useState, useEffect } from "react";
import Home from "@/components/Home";
import Alerts from "@/components/Alerts";
import Control from "@/components/Control";
import Settings from "@/components/Settings";

const weatherStates = ["sunny", "breezy", "cloudy", "rainy"];

export default function AppMain() {
  const [activeTab, setActiveTab] = useState("home");
  const [weather, setWeather] = useState("sunny");
  const [time, setTime] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [manualOverride, setManualOverride] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoMode, setAutoMode] = useState(true);
  const [simSpeed, setSimSpeed] = useState(10000); // ms

  // Smart alert logic
  const getWeatherAlert = (weather) => {
    switch (weather) {
      case "cloudy":
        return "Cloudy conditions detected. Drying may be slower. Consider deploying the cover to protect clothes.";
      case "rainy":
        return "Rain detected! Cover automatically deploying to protect clothes from getting wet.";
      case "breezy":
        return "Breezy weather detected. Clothes will dry faster with natural airflow.";
      case "sunny":
        return "Sunny conditions detected. Clothes are fully exposed for optimal drying.";
      default:
        return "";
    }
  };

  const triggerAlert = (weather) => {
    const message = getWeatherAlert(weather);
    const newAlert = {
      message,
      time: new Date().toLocaleString(),
    };
    setAlerts((prev) => [newAlert, ...prev]);
    if (notificationsEnabled && "Notification" in window && Notification.permission === "granted") {
      new Notification("Weather Update", { body: message });
    }
  };

  // Simulate weather and time
  useEffect(() => {
    const interval = setInterval(() => {
      const nextWeather = weatherStates[Math.floor(Math.random() * weatherStates.length)];
      setWeather(nextWeather);
      setTime((prev) => new Date(prev.getTime() + 10 * 60 * 60 * 1000));
      triggerAlert(nextWeather);
    }, simSpeed);
    return () => clearInterval(interval);
  }, [simSpeed, notificationsEnabled]);

  // Cover logic
  const isCoverDeployed =
    manualOverride === "deployed"
      ? true
      : manualOverride === "retracted"
      ? false
      : ["cloudy", "rainy"].includes(weather);

  // Navigation
  return (
    <div>
      <nav style={{ display: "flex", justifyContent: "center", gap: "1rem", margin: "1rem 0" }}>
        <button onClick={() => setActiveTab("home")}>🏠 Home</button>
        <button onClick={() => setActiveTab("alerts")}>🔔 Alerts</button>
        <button onClick={() => setActiveTab("control")}>🎛 Control</button>
        <button onClick={() => setActiveTab("settings")}>⚙️ Settings</button>
      </nav>
      {activeTab === "home" && (
        <Home
          weather={weather}
          isCoverDeployed={isCoverDeployed}
          time={time}
          mode={manualOverride ? (manualOverride === "deployed" ? "Manual: Deployed" : "Manual: Retracted") : "Auto"}
        />
      )}
      {activeTab === "alerts" && <Alerts alerts={alerts} />}
      {activeTab === "control" && (
        <Control
          manualOverride={manualOverride}
          setManualOverride={setManualOverride}
          setAutoMode={setAutoMode}
        />
      )}
      {activeTab === "settings" && (
        <Settings
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}
          simSpeed={simSpeed}
          setSimSpeed={setSimSpeed}
        />
      )}
    </div>
  );
}
