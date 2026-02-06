import Link from 'next/link';

const highlights = [
  {
    title: 'Unified activity timeline',
    description: 'Pull GitHub commits, PRs, and issues into one clear signal of impact.'
  },
  {
    title: 'Weekly developer wrap-up',
    description: 'Receive streak insights, focus areas, and momentum shifts every Monday.'
  },
  {
    title: 'Public portfolio in minutes',
    description: 'Publish a recruiter-friendly profile with verified contribution stats.'
  }
];

export default function HomePage() {
  return (
    <main>
      <div className="container">
        <nav className="nav">
          <div>
            <strong>DevPulse</strong>
            <div className="subtle">Developer Productivity & Portfolio Intelligence</div>
          </div>
          <div className="nav-links">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/connect">Connect</Link>
            <Link href="/settings">Settings</Link>
            <Link href="/dev/demo">Public Profile</Link>
          </div>
        </nav>

        <section className="hero">
          <span className="badge">Spotify Wrapped for your code life</span>
          <h1>Track every commit, celebrate every streak, and ship a portfolio recruiters trust.</h1>
          <p>
            DevPulse aggregates GitHub, LeetCode, and Codeforces activity into a single
            intelligence layer that highlights your consistency, momentum, and impact.
          </p>
          <div className="button-row">
            <Link className="button" href="/connect">Connect accounts</Link>
            <Link className="button secondary" href="/dev/demo">View demo profile</Link>
          </div>
        </section>
      </div>

      <div className="container">
        <h2 className="section-title">Why teams love DevPulse</h2>
        <div className="grid three">
          {highlights.map((item) => (
            <div className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p className="subtle">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <h2 className="section-title">MVP snapshot</h2>
        <div className="grid three">
          <div className="card">
            <span>GitHub Signal</span>
            <h3>182 commits</h3>
            <p className="subtle">Across 7 repositories in the last 30 days.</p>
          </div>
          <div className="card">
            <span>LeetCode Momentum</span>
            <h3>48 problems solved</h3>
            <p className="subtle">+12% week-over-week growth.</p>
          </div>
          <div className="card">
            <span>Recruiter Ready</span>
            <h3>Public DevPulse</h3>
            <p className="subtle">Share a clean profile with verified stats.</p>
          </div>
        </div>
      </div>

      <div className="container footer">
        <span>Built for developers who want their work to speak clearly.</span>
        <span>© 2025 DevPulse</span>
      </div>
    </main>
  );
}
