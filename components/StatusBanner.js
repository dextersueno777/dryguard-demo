export default function StatusBanner({ status, description }) {
  return (
    <div className="banner">
      <h2>{status}</h2>
      <p>{description}</p>
    </div>
  );
}
