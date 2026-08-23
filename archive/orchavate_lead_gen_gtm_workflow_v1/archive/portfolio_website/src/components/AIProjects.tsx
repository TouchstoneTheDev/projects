import { AI_PROJECTS } from '../data/projects';
import '../styles/ai-projects.css';

export function AIProjects() {
  return (
    <section id="ai-projects" className="ai-projects">
      <div className="container">
        <h2>AI & Machine Learning Projects</h2>
        <p className="section-description">
          Exploring the intersection of AI and software development
        </p>

        <div className="ai-projects-grid">
          {AI_PROJECTS.map(project => (
            <article key={project.id} className={`ai-project-card status-${project.status}`}>
              <div className="project-status">
                <span className={`status-badge ${project.status}`}>
                  {project.status === 'active' && '🟢 Active'}
                  {project.status === 'in-progress' && '🟡 In Progress'}
                  {project.status === 'completed' && '🟣 Completed'}
                </span>
              </div>

              <h3>{project.title}</h3>
              <p className="description">{project.description}</p>

              <div className="technologies">
                {project.technologies.map(tech => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  aria-label={`${project.title} GitHub`}
                >
                  View Project →
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
