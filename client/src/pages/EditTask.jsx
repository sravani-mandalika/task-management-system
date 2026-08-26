import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [taskRes, projectsRes, usersRes] = await Promise.all([
          api.get(`/tasks/${id}`),
          api.get('/projects'),
          api.get('/users')
        ]);
        const task = taskRes.data.data;
        setFormData({
          title: task.title,
          description: task.description || '',
          project: task.project?._id || '',
          assignedTo: task.assignedTo?._id || '',
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ''
        });
        setProjects(projectsRes.data.data);
        setUsers(usersRes.data.data);
      } catch (err) {
        setError('Unable to load task.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/tasks/${id}`, formData);
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      navigate('/tasks');
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  if (loading) return <div className="page"><p>Loading task...</p></div>;
  if (error && !formData) return <div className="page"><p className="form-error">{error}</p></div>;

  return (
    <div className="page">
      <h1>Edit Task</h1>
      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        {error && <p className="form-error">{error}</p>}
        <div className="field">
          <label>Title</label>
          <input name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
        </div>
        <div className="field">
          <label>Project</label>
          <select name="project" value={formData.project} onChange={handleChange} required>
            {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Assign To</label>
          <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
            <option value="">Unassigned</option>
            {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
        <div className="field">
          <label>Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>
        <div className="field">
          <label>Due Date</label>
          <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn btn-primary">Save Changes</button>
          <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete Task</button>
        </div>
      </form>
    </div>
  );
}

export default EditTask;