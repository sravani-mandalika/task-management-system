import { useEffect, useState } from 'react';
import api from '../api/axios';

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

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Projects</th>
            <th>Active</th>
            <th>Tasks</th>
            <th>Completed</th>
            <th>Pending</th>
            <th>High Priority</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{stats.totalProjects}</td>
            <td>{stats.activeProjects}</td>
            <td>{stats.totalTasks}</td>
            <td>{stats.completedTasks}</td>
            <td>{stats.pendingTasks}</td>
            <td>{stats.highPriorityTasks}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;