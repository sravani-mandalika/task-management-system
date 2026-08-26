import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', status: '' });

  const [selectedMember, setSelectedMember] = useState('');
  const [memberError, setMemberError] = useState('');

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '', description: '', assignedTo: '', createdBy: '',
    status: 'TODO', priority: 'MEDIUM', dueDate: ''
  });
  const [taskFormError, setTaskFormError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [projectRes, tasksRes, usersRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?project=${id}`),
        api.get('/users')
      ]);
      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
      setAllUsers(usersRes.data.data);
      setFormData({
        name: projectRes.data.data.name,
        description: projectRes.data.data.description || '',
        status: projectRes.data.data.status
      });
    } catch (err) {
      setError('Unable to load project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${id}`, formData);
      setEditing(false);
      fetchData();
    } catch (err) {
      setError('Failed to update project.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    try {
      await api.delete(`/projects/${id}`);
      navigate('/projects');
    } catch (err) {
      setError('Failed to delete project.');
    }
  };

  const handleAddMember = async () => {
    if (!selectedMember) return;
    setMemberError('');
    try {
      const updatedMemberIds = [...(project.members?.map((m) => m._id) || []), selectedMember];
      await api.put(`/projects/${id}`, { members: updatedMemberIds });
      setSelectedMember('');
      fetchData();
    } catch (err) {
      setMemberError('Failed to add member.');
    }
  };

  const handleRemoveMember = async (userId) => {
    setMemberError('');
    try {
      const updatedMemberIds = project.members.filter((m) => m._id !== userId).map((m) => m._id);
      await api.put(`/projects/${id}`, { members: updatedMemberIds });
      fetchData();
    } catch (err) {
      setMemberError('Failed to remove member.');
    }
  };

  const handleTaskFormChange = (e) => {
    setTaskFormData({ ...taskFormData, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskFormError('');
    try {
      await api.post('/tasks', { ...taskFormData, project: id });
      setTaskFormData({
        title: '', description: '', assignedTo: '', createdBy: '',
        status: 'TODO', priority: 'MEDIUM', dueDate: ''
      });
      setShowTaskForm(false);
      fetchData(); // refresh tasks (and everything else) immediately
    } catch (err) {
      setTaskFormError(err.response?.data?.message || 'Failed to create task');
    }
  };

  // Helper: how many tasks in this project are assigned to a given user
  const taskCountForUser = (userId) => tasks.filter((t) => t.assignedTo?._id === userId).length;

  // Helper: task titles assigned to a given user, for a quick inline list
  const tasksForUser = (userId) => tasks.filter((t) => t.assignedTo?._id === userId);

  if (loading) {
    return (
      <div className="page">
        <LoadingSpinner label="Loading project..." />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="page">
        <p className="form-error">{error}</p>
      </div>
    );
  }

  if (!project) return null;

  const availableUsers = allUsers.filter(
    (u) => !project.members?.some((m) => m._id === u._id)
  );

  return (
    <div className="page">
      {!editing ? (
        <>
          <div className="page-header">
            <h1>{project.name}</h1>
            <StatusBadge value={project.status} />
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>{project.description}</p>

          <div style={{ display: 'flex', gap: '10px', margin: '16px 0 24px' }}>
            <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit Project</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete Project</button>
          </div>
        </>
      ) : (
        <form className="card" onSubmit={handleUpdate} style={{ marginBottom: '24px' }}>
          <div className="field">
            <label>Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="field">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">Save Changes</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Members section */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Members</h3>

        {project.members?.length > 0 ? (
          <ul className="member-list">
            {project.members.map((m) => {
                const memberTasks = tasksForUser(m._id);
                return (
                <li key={m._id} className="member-list-item">
                  <div className="member-list-row">
                    <span>
                      {m.name}{' '}
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>({m.email})</span>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="member-task-count">
                      {memberTasks.length} task{memberTasks.length === 1 ? '' : 's'}
                      </span>
                      <button className="btn-remove" onClick={() => handleRemoveMember(m._id)}>Remove</button>
                    </div>
                  </div>
                </li>
                );
              })}
          </ul>
        ) : (
          <p className="empty-state">No members added yet.</p>
        )}

        {memberError && <p className="form-error">{memberError}</p>}

        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
            <option value="">Select a user to add...</option>
            {availableUsers.map((u) => (
              <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
            ))}
          </select>
          <button className="btn btn-secondary" onClick={handleAddMember} disabled={!selectedMember}>
            Add
          </button>
        </div>
      </div>

      {/* Tasks section */}
      <h2>Tasks</h2>

      {tasks.length === 0 && <p className="empty-state">No tasks found.</p>}
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}

export default ProjectDetails;