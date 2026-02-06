import Link from 'next/link';

const sampleHighlights = [
  { label: 'Total commits', value: '1,248' },
  { label: 'Top language', value: 'TypeScript' },
  { label: 'Longest streak', value: '32 days' },
];

const recentProjects = [
  {
    name: 'DevPulse API',
    description: 'REST service powering GitHub insights and weekly summaries.',
    activity: '14 commits this week'
  },
  {
    name: 'Interview Prep Tracker',
    description: 'LeetCode analytics dashboard for daily practice.',
    activity: '8 problems solved'
  },
  {
    name: 'Portfolio Refresh',
    description: 'Personal site rebuild with accessibility improvements.',
    activity: '5 pull requests'
  }
];

export default function PublicProfilePage({ params }) {
  const username = params?.username ?? 'devpulse';

  return (
    <main>
      <div className="container">
        <nav className="nav">
          <div>
            <strong>{username}</strong>
            <div className="subtle">Developer fingerprint • Updated today</div>
          </div>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/connect">Connect</Link>
          </div>
        </nav>

        <section className="hero">
          <span className="badge">Public profile</span>
          <h1>{username} ships consistently across web and backend work.</h1>
          <p>
            DevPulse verifies activity across GitHub and interview platforms to surface
            the true pace, focus, and impact behind every contribution.
          </p>
          <div className="button-row">
            <button className="button" type="button">Share profile</button>
            <button className="button secondary" type="button">Download resume</button>
          </div>
        </section>
      </div>

      <div className="container grid three">
        {sampleHighlights.map((item) => (
          <div className="card" key={item.label}>
            <span>{item.label}</span>
            <h3>{item.value}</h3>
            <p className="subtle">Verified by DevPulse.</p>
          </div>
        ))}
      </div>

      <div className="container">
        <h2 className="section-title">Recent focus</h2>
        <div className="grid three">
          {recentProjects.map((project) => (
            <div className="card" key={project.name}>
              <h3>{project.name}</h3>
              <p className="subtle">{project.description}</p>
              <span className="badge">{project.activity}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
