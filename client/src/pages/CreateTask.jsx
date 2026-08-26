import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TaskForm from '../components/TaskForm';

const emptyTask = {
  title: '', description: '', project: '', assignedTo: '',
  createdBy: '', status: 'TODO', priority: 'MEDIUM', dueDate: ''
};

function CreateTask() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleCreate = async (formData) => {
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
      <TaskForm
        initialData={emptyTask}
        onSubmit={handleCreate}
        submitLabel="Create Task"
        error={error}
      />
    </div>
  );
}

export default CreateTask;