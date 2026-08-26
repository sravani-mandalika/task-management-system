import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', createdBy: '' });
  const [submitError, setSubmitError] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      setError('Unable to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      await api.post('/projects', formData);
      setFormData({ name: '', description: '', createdBy: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <form className="card" onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          {submitError && <p className="form-error">{submitError}</p>}
          <div className="field">
            <label>Project Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
          </div>
          <div className="field">
            <label>Created By (User ID)</label>
            <input name="createdBy" value={formData.createdBy} onChange={handleChange} required placeholder="Paste a user _id" />
          </div>
          <button type="submit" className="btn btn-primary">Create Project</button>
        </form>
      )}

      {loading && <LoadingSpinner label="Loading projects..." />}
      {error && <p className="form-error">{error}</p>}
      {!loading && !error && projects.length === 0 && <p className="empty-state">No projects found.</p>}
      {!loading && !error && projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}

export default Projects;