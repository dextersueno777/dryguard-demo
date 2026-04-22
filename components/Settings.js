export default function Settings({ data = {} }) {
  const mode = data.mode || "AUTO";
  const samplingIntervalSec = data.samplingIntervalSec || 1;
  const safetyStatus = data.safetyStatus || "Ready";
  
  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "20px" }}>
      <h2>⚙️ System Settings</h2>
      <div style={{background: "#eff6ff", border: "2px solid #0284c7", borderRadius: "12px", padding: "20px", marginBottom: "20px"}}>
        <h3>📊 System Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div><p style={{ fontSize: "12px", color: "#666", margin: 0 }}>Current Mode</p><p style={{ fontSize: "18px", fontWeight: "600", margin: 0, color: "#0284c7" }}>{mode}</p></div>
          <div><p style={{ fontSize: "12px", color: "#666", margin: 0 }}>Rain Status</p><p style={{ fontSize: "18px", fontWeight: "600", margin: 0, color: data.rain ? "#ef4444" : "#22c55e" }}>{data.rain ? "🌧 Detected" : "✓ Clear"}</p></div>
          <div><p style={{ fontSize: "12px", color: "#666", margin: 0 }}>Temperature</p><p style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>{data.temperature || 28}°C</p></div>
          <div><p style={{ fontSize: "12px", color: "#666", margin: 0 }}>Cover Status</p><p style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>{data.cover || "Unknown"}</p></div>
        </div>
      </div>
      <div style={{background: "#f0fdf4", border: "2px solid #22c55e", borderRadius: "12px", padding: "20px", marginBottom: "20px"}}>
        <h3>🧠 System Logic</h3>
        {mode === "AUTO" ? (<div><p><strong>AUTO Mode Active</strong></p><ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}><li>System monitors rain sensor</li><li>Rain detected → Cover deploys</li><li>No rain → Cover retracts</li><li>Manual override disabled</li></ul></div>) : (<div><p><strong>MANUAL Mode Active</strong></p><ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}><li>Rain sensor ignored</li><li>Complete manual control</li><li>Deploy/retract via Control</li><li>Custom behavior enabled</li></ul></div>)}
      </div>

      <div style={{background: "#fffbeb", border: "2px solid #f59e0b", borderRadius: "12px", padding: "20px", marginBottom: "20px"}}>
        <h3>🧪 Reliability and Safety</h3>
        <ul style={{ paddingLeft: "20px", lineHeight: "1.8", margin: 0 }}>
          <li>Sensor sampling interval: {samplingIntervalSec}s</li>
          <li>Safety controller: {safetyStatus}</li>
          <li>Conflict prevention: new command blocked while motor is moving</li>
        </ul>
      </div>

      <div style={{background: "#fff7ed", border: "2px solid #ea580c", borderRadius: "12px", padding: "20px", marginBottom: "20px"}}>
        <h3>⚠ Limitations</h3>
        <ul style={{ paddingLeft: "20px", lineHeight: "1.8", margin: 0 }}>
          <li>Simulation only: no physical hardware connected in this demo</li>
          <li>Network latency not included in control response model</li>
          <li>Sensor noise model is simplified for demonstration purposes</li>
        </ul>
      </div>

      <div style={{background: "#eef2ff", border: "2px solid #6366f1", borderRadius: "12px", padding: "20px"}}>
        <h3>🚀 Future Work</h3>
        <ul style={{ paddingLeft: "20px", lineHeight: "1.8", margin: 0 }}>
          <li>ESP32 integration for direct hardware deployment</li>
          <li>Cloud monitoring dashboard with historical analytics</li>
          <li>Mobile app alerts and remote manual override</li>
        </ul>
      </div>
    </div>
  );
}