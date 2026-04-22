export default function SensorCard({ label, title, value, unit }) {
  const displayLabel = label || title;
  
  return (
    <div className="sensor-card">
      <h3>{displayLabel}</h3>
      <p className="value" style={{ fontSize: "24px", fontWeight: "600", color: "#0284c7", margin: "10px 0" }}>
        {value}
        {unit && <span style={{ fontSize: "14px", color: "#666" }}> {unit}</span>}
      </p>
    </div>
  );
}
