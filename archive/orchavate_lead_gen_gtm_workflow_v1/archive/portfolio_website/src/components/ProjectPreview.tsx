import '../styles/modal.css';

interface ProjectPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    description: string;
    image?: string;
    technologies: string[];
    liveUrl?: string;
    github?: string;
    preview?: string;
  };
}

export function ProjectPreview({ isOpen, onClose, project }: ProjectPreviewProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content project-preview">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="preview-header">
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="preview-image"
              loading="lazy"
            />
          )}
          <h2>{project.title}</h2>
        </div>

        <div className="preview-body">
          <div className="description-section">
            <h3>Overview</h3>
            <p>{project.description}</p>
          </div>

          <div className="technologies-section">
            <h3>Technologies</h3>
            <div className="tech-stack">
              {project.technologies.map(tech => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.preview && (
            <div className="preview-section">
              <h3>Preview</h3>
              <p>{project.preview}</p>
            </div>
          )}
        </div>

        <div className="preview-footer">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              View on GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Live Demo
            </a>
          )}
          <button onClick={onClose} className="btn btn-outline">
            Close
          </button>
        </div>
      </div>
    </>
  );
}
