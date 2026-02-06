const preferences = [
  { label: 'Weekly email summaries', value: 'Enabled' },
  { label: 'Public profile visibility', value: 'On' },
  { label: 'Theme', value: 'Cloudy light' },
];

export default function SettingsPage() {
  return (
    <main>
      <div className="container">
        <h1 className="section-title">Settings</h1>
        <p className="subtle">
          Manage how DevPulse shares and summarizes your data.
        </p>
      </div>

      <div className="container grid three">
        {preferences.map((item) => (
          <div className="card" key={item.label}>
            <span>{item.label}</span>
            <h3>{item.value}</h3>
            <p className="subtle">Customize this preference in your account.</p>
          </div>
        ))}
      </div>
    </main>
  );
}
