export default function StatCard({ label, value, detail }) {
  return (
    <div className="card">
      <span>{label}</span>
      <h3>{value}</h3>
      <p className="subtle">{detail}</p>
    </div>
  );
}
