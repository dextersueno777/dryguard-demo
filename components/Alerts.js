export default function Alerts({ data = {} }) {
  const eventLog = data.eventLog || [];
  const rain = data.rain || false;
  const sensorStatus = data.sensorStatus || "OK";
  const status = data.status || "NoRain Retract";
  
  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "20px" }}>
      <h2>📋 System Event Log</h2>

      {/* Sensor/Rain Alert Banner */}
      {sensorStatus === "ERROR" ? (
        <div style={{
          background: "#fff7ed",
          border: "2px solid #ea580c",
          color: "#9a3412",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
          fontWeight: "600",
          textAlign: "center"
        }}>
          ⚠ SENSOR ERROR: Automatic control paused
        </div>
      ) : rain && (
        <div style={{
          background: "#fee2e2",
          border: "2px solid #dc2626",
          color: "#991b1b",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
          fontWeight: "600",
          textAlign: "center"
        }}>
          🌧️ ALERT: Rain detected | {status}
        </div>
      )}

      {/* Event Log */}
      <div style={{
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "15px"
      }}>
        <h3 style={{ marginTop: 0 }}>Recent Events:</h3>
        
        {eventLog.length === 0 ? (
          <p style={{ color: "#999" }}>No events yet.</p>
        ) : (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {eventLog.map((event, idx) => (
              <div
                key={idx}
                style={{
                  background: event.includes("ALERT") ? "#fef3c7" : event.includes("Safety") ? "#fff7ed" : "white",
                  border: `1px solid ${event.includes("ALERT") ? "#fcd34d" : event.includes("Safety") ? "#fdba74" : "#e5e7eb"}`,
                  borderLeft: `4px solid ${event.includes("ALERT") ? "#f59e0b" : event.includes("Safety") ? "#ea580c" : "#3b82f6"}`,
                  padding: "12px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontFamily: "monospace"
                }}
              >
                <span style={{ fontWeight: "600" }}>
                  {event.includes("ALERT") ? "🚨 " : event.includes("Safety") ? "🛡 " : "ℹ️ "}
                </span>
                {event}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#999" }}>
        Total events: {eventLog.length}
      </div>
    </div>
  );
}