import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

function ProjectCard({ project }) {
  return (
    <div className="card project-card">
      <div className="task-card-header">
        <h3>{project.name}</h3>
        <StatusBadge value={project.status} />
      </div>
      {project.description && <p className="task-card-desc">{project.description}</p>}
      <div className="task-card-meta">
        <span>{project.members?.length || 0} member{project.members?.length === 1 ? '' : 's'}</span>
      </div>
      <div className="task-card-actions">
        <Link to={`/projects/${project._id}`} className="btn btn-primary">View Details</Link>
      </div>
    </div>
  );
}

export default ProjectCard;