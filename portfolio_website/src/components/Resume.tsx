import '../styles/resume.css';

const SKILLS = [
  {
    category: 'Frontend',
    items: ['React', 'TypeScript', 'Vite', 'CSS3', 'Tailwind CSS', 'Performance Optimization'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express', 'Python', 'SQL', 'MongoDB', 'Firebase'],
  },
  {
    category: 'DevOps & Tools',
    items: ['GitHub Actions', 'Docker', 'GCP', 'CI/CD', 'Git', 'AWS'],
  },
];

const EXPERIENCE = [
  {
    company: 'Tech Company',
    position: 'Senior Frontend Developer',
    duration: '2023 - Present',
    description: 'Led frontend architecture and performance optimization initiatives.',
  },
  {
    company: 'Startup',
    position: 'Full Stack Developer',
    duration: '2021 - 2023',
    description: 'Built full-stack web applications and managed cloud deployments.',
  },
  {
    company: 'Agency',
    position: 'Web Developer',
    duration: '2020 - 2021',
    description: 'Developed responsive websites and client projects.',
  },
];

export function Resume() {
  return (
    <section id="resume" className="resume">
      <div className="container">
        <h2>Experience & Skills</h2>
        
        <div className="resume-grid">
          <div className="experience">
            <h3>Experience</h3>
            {EXPERIENCE.map((exp, idx) => (
              <div key={idx} className="experience-item">
                <h4>{exp.position}</h4>
                <p className="company">{exp.company}</p>
                <p className="duration">{exp.duration}</p>
                <p className="description">{exp.description}</p>
              </div>
            ))}
          </div>

          <div className="skills">
            <h3>Skills</h3>
            {SKILLS.map((skillGroup, idx) => (
              <div key={idx} className="skill-group">
                <h4>{skillGroup.category}</h4>
                <div className="skill-tags">
                  {skillGroup.items.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="resume-download">
          <a href="/resume.pdf" className="button primary" download>
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}
