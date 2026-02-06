import StatCard from '../_components/StatCard';

const activityRows = [
  { source: 'GitHub', metric: 'Commits', value: '182', trend: '+14%' },
  { source: 'GitHub', metric: 'Pull requests', value: '12', trend: '+2' },
  { source: 'LeetCode', metric: 'Problems solved', value: '48', trend: '+6' },
  { source: 'Codeforces', metric: 'Contests joined', value: '3', trend: '+1' },
];

export default function DashboardPage() {
  return (
    <main>
      <div className="container">
        <h1 className="section-title">Dashboard</h1>
        <p className="subtle">
          Your personal control room for productivity, focus, and momentum.
        </p>
      </div>

      <div className="container grid three">
        <StatCard
          label="Weekly streak"
          value="4 weeks"
          detail="Consistency score in the top 12%."
        />
        <StatCard
          label="Focus area"
          value="Backend"
          detail="52% of your commits touch API code."
        />
        <StatCard
          label="Top repo"
          value="devpulse-api"
          detail="24% of activity last week."
        />
      </div>

      <div className="container">
        <h2 className="section-title">Activity breakdown</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Metric</th>
              <th>Value</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {activityRows.map((row) => (
              <tr key={`${row.source}-${row.metric}`}>
                <td>{row.source}</td>
                <td>{row.metric}</td>
                <td>{row.value}</td>
                <td>{row.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
