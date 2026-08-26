import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function CreateTask() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '', description: '', project: '', assignedTo: '',
    createdBy: '', status: 'TODO', priority: 'MEDIUM', dueDate: ''
  });

  useEffect(() => {
    Promise.all([api.get('/projects'), api.get('/users')]).then(([p, u]) => {
      setProjects(p.data.data);
      setUsers(u.data.data);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/tasks', formData);
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <div className="page">
      <h1>Create Task</h1>
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
            <option value="">Select project...</option>
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
          <label>Created By (User ID)</label>
          <input name="createdBy" value={formData.createdBy} onChange={handleChange} required placeholder="Paste a user _id" />
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
        <button type="submit" className="btn btn-primary">Create Task</button>
      </form>
    </div>
  );
}

export default CreateTask;