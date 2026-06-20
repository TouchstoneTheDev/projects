import type { Project } from '../types/index';
import '../styles/projects.css';

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Personal Portfolio',
    description: 'Responsive portfolio built with React & Vite. 95+ Lighthouse score through code-splitting and optimization.',
    image: '/images/portfolio.webp',
    technologies: ['React', 'TypeScript', 'Vite', 'CSS3'],
    github: 'https://github.com',
    demo: 'https://portfolio.dev',
    featured: true,
  },
  {
    id: '2',
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration and real-time inventory management.',
    image: '/images/ecommerce.webp',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    github: 'https://github.com',
    featured: true,
  },
  {
    id: '3',
    title: 'Task Management App',
    description: 'Collaborative task manager with real-time updates and team collaboration features.',
    image: '/images/tasks.webp',
    technologies: ['React', 'Firebase', 'Tailwind CSS'],
    demo: 'https://tasks.dev',
    featured: false,
  },
  {
    id: '4',
    title: 'Weather Dashboard',
    description: 'Real-time weather app with geolocation and data visualization.',
    image: '/images/weather.webp',
    technologies: ['React', 'API Integration', 'D3.js'],
    demo: 'https://weather.dev',
    featured: false,
  },
];

export function Projects() {
  const featured = PROJECTS.filter(p => p.featured);
  const other = PROJECTS.filter(p => !p.featured);

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2>Featured Projects</h2>
        <div className="projects-grid featured">
          {featured.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {other.length > 0 && (
          <>
            <h3>Other Projects</h3>
            <div className="projects-grid">
              {other.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <img 
        src={project.image} 
        alt={project.title}
        loading="lazy"
        width="400"
        height="300"
      />
      <div className="project-content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tech-stack">
          {project.technologies.map(tech => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>
        <div className="project-links">
          {project.github && (
            <a href={project.github} className="link-button" aria-label={`${project.title} GitHub`}>
              GitHub
            </a>
          )}
          {project.demo && (
            <a href={project.demo} className="link-button primary" aria-label={`${project.title} Demo`}>
              Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
