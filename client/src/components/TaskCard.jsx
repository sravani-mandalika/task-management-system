import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

function TaskCard({ task }) {
  return (
    <div className="card task-card">
      <div className="task-card-header">
        <h3>{task.title}</h3>
        <StatusBadge value={task.priority} />
      </div>
      {task.description && <p className="task-card-desc">{task.description}</p>}
      <div className="task-card-meta">
        <StatusBadge value={task.status} />
        {task.assignedTo?.name && <span className="task-card-assignee">👤 {task.assignedTo.name}</span>}
        {task.dueDate && <span className="task-card-due">Due {new Date(task.dueDate).toLocaleDateString()}</span>}
      </div>
      <div className="task-card-actions">
        <Link to={`/tasks/${task._id}/edit`} className="btn btn-secondary">Edit</Link>
      </div>
    </div>
  );
}

export default TaskCard;