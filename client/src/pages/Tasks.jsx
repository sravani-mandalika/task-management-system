import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (search) params.append('search', search);
      params.append('page', page);
      params.append('limit', limit);

      const res = await api.get(`/tasks?${params.toString()}`);
      setTasks(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError('Unable to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchTasks, 300);
    return () => clearTimeout(debounce);
  }, [statusFilter, priorityFilter, search, page, limit]);

  // Any time a filter or search changes, jump back to page 1 —
  // staying on page 3 of a now-smaller result set would look broken
  useEffect(() => {
    setPage(1);
  }, [statusFilter, priorityFilter, search]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tasks</h1>
        <Link to="/tasks/new" className="btn btn-primary">+ New Task</Link>
      </div>

      <div className="filters-bar">
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '240px' }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>

      {loading && <LoadingSpinner label="Loading tasks..." />}
      {error && <p className="form-error">{error}</p>}
      {!loading && !error && tasks.length === 0 && <p className="empty-state">No tasks found.</p>}
      {!loading && !error && tasks.map((task) => <TaskCard key={task._id} task={task} />)}

      {!loading && !error && pagination.pages > 1 && (
        <div className="pagination-bar">
          <button
            className="btn btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </span>
          <button
            className="btn btn-secondary"
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Tasks;