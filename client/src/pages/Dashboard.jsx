import { useEffect, useState } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks?limit=1000') // large limit so we get all tasks for counting
        ]);

        const projects = projectsRes.data.data;
        const tasks = tasksRes.data.data;

        setStats({
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'ACTIVE').length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'DONE').length,
          pendingTasks: tasks.filter(t => t.status !== 'DONE').length,
          highPriorityTasks: tasks.filter(t => t.priority === 'HIGH').length
        });
      } catch (err) {
        setError('Unable to load dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;
  if (error) return <p>{error}</p>;

  return (
    <div className="page">
  <h1>Dashboard</h1>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '20px' }}>
    {[
      { label: 'Projects', value: stats.totalProjects },
      { label: 'Active', value: stats.activeProjects },
      { label: 'Tasks', value: stats.totalTasks },
      { label: 'Completed', value: stats.completedTasks },
      { label: 'Pending', value: stats.pendingTasks },
      { label: 'High Priority', value: stats.highPriorityTasks }
    ].map((stat) => (
      <div key={stat.label} className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent)' }}>{stat.value}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{stat.label}</div>
      </div>
    ))}
  </div>
</div>
  );
}

export default Dashboard;