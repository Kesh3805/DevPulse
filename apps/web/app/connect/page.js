const integrations = [
  {
    name: 'GitHub',
    status: 'Connected',
    description: 'Sync commits, PRs, and issues every 12 hours.'
  },
  {
    name: 'LeetCode',
    status: 'Pending',
    description: 'Add your handle to track solved problems and tags.'
  },
  {
    name: 'Codeforces',
    status: 'Pending',
    description: 'Link your profile to pull contest history.'
  }
];

export default function ConnectPage() {
  return (
    <main>
      <div className="container">
        <h1 className="section-title">Connect accounts</h1>
        <p className="subtle">
          Link platforms once and keep your DevPulse profile up to date.
        </p>
      </div>

      <div className="container grid three">
        {integrations.map((integration) => (
          <div className="card" key={integration.name}>
            <span>{integration.name}</span>
            <h3>{integration.status}</h3>
            <p className="subtle">{integration.description}</p>
            <button className="button" type="button">
              {integration.status === 'Connected' ? 'Manage' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
