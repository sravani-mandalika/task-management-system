import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        const task = res.data.data;
        setTaskData({
          title: task.title,
          description: task.description || '',
          project: task.project?._id || '',
          assignedTo: task.assignedTo?._id || '',
          createdBy: task.createdBy?._id || '',
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ''
        });
      } catch (err) {
        setError('Unable to load task.');
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [id]);

  const handleUpdate = async (formData) => {
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

  if (loading) return <div className="page"><LoadingSpinner label="Loading task..." /></div>;
  if (error && !taskData) return <div className="page"><p className="form-error">{error}</p></div>;

  return (
    <div className="page">
      <h1>Edit Task</h1>
      <TaskForm
        initialData={taskData}
        onSubmit={handleUpdate}
        submitLabel="Save Changes"
        error={error}
      />
      <button className="btn btn-danger" onClick={handleDelete} style={{ marginTop: '12px' }}>
        Delete Task
      </button> 
    </div>
  );
}

export default EditTask;