import { useState } from 'react';
import { RESUME_DATA } from '../data/resume';
import '../styles/resume.css';

export function Resume() {
  const [viewFormat, setViewFormat] = useState<'web' | 'ats'>('web');

  const generateATSResume = () => {
    const { personalInfo, summary, experience, skills, education, certifications } = RESUME_DATA;
    
    const content = `
${personalInfo.fullName}
${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}
${personalInfo.linkedIn} | ${personalInfo.github} | ${personalInfo.portfolio}

PROFESSIONAL SUMMARY
${summary}

EXPERIENCE
${experience.map(exp => `
${exp.position}
${exp.company} | ${exp.duration}
${exp.description}
${exp.achievements.map(achievement => `• ${achievement}`).join('\n')}
`).join('\n')}

SKILLS
${skills.map(skillGroup => `
${skillGroup.category}: ${skillGroup.items.join(', ')}
`).join('\n')}

EDUCATION
${education.map(edu => `
${edu.degree} in ${edu.field}
${edu.school} | ${edu.graduationDate}
GPA: ${edu.gpa}
${edu.achievements.map(ach => `• ${ach}`).join('\n')}
`).join('\n')}

CERTIFICATIONS
${certifications.map(cert => `
${cert.name}
${cert.issuer} | ${cert.date}
`).join('\n')}
    `;
    
    return content;
  };

  const downloadResume = () => {
    const content = generateATSResume();
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'resume-tanmay-veer.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const printResume = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      const { personalInfo, summary, experience, skills, education, certifications } = RESUME_DATA;
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${personalInfo.fullName} - Resume</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.5; max-width: 8.5in; margin: 0; padding: 20px; }
            header { border-bottom: 2px solid #333; margin-bottom: 20px; }
            h1 { margin: 0; font-size: 24px; }
            .contact-info { font-size: 12px; margin: 5px 0; }
            h2 { border-bottom: 1px solid #666; margin-top: 20px; margin-bottom: 10px; font-size: 14px; }
            .job { margin-bottom: 15px; }
            .job-title { font-weight: bold; }
            .company { font-style: italic; }
            .duration { color: #666; font-size: 12px; }
            ul { margin: 5px 0; padding-left: 20px; }
            li { margin: 3px 0; font-size: 12px; }
            .skills { column-count: 2; }
            .skill-group { margin-bottom: 10px; }
            @media print { body { margin: 0; padding: 0; } }
          </style>
        </head>
        <body>
          <header>
            <h1>${personalInfo.fullName}</h1>
            <div class="contact-info">
              ${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}
            </div>
            <div class="contact-info">
              <a href="${personalInfo.linkedIn}">LinkedIn</a> | <a href="${personalInfo.github}">GitHub</a> | <a href="${personalInfo.portfolio}">Portfolio</a>
            </div>
          </header>

          <section>
            <h2>PROFESSIONAL SUMMARY</h2>
            <p>${summary}</p>
          </section>

          <section>
            <h2>EXPERIENCE</h2>
            ${experience.map(exp => `
              <div class="job">
                <div class="job-title">${exp.position}</div>
                <div class="company">${exp.company}</div>
                <div class="duration">${exp.duration}</div>
                <p>${exp.description}</p>
                <ul>
                  ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </section>

          <section>
            <h2>SKILLS</h2>
            <div class="skills">
              ${skills.map(skillGroup => `
                <div class="skill-group">
                  <strong>${skillGroup.category}:</strong> ${skillGroup.items.join(', ')}
                </div>
              `).join('')}
            </div>
          </section>

          <section>
            <h2>EDUCATION</h2>
            ${education.map(edu => `
              <div>
                <strong>${edu.degree} in ${edu.field}</strong><br>
                ${edu.school} | ${edu.graduationDate}<br>
                GPA: ${edu.gpa}
              </div>
            `).join('')}
          </section>

          <section>
            <h2>CERTIFICATIONS</h2>
            <ul>
              ${certifications.map(cert => `<li>${cert.name} - ${cert.issuer} (${cert.date})</li>`).join('')}
            </ul>
          </section>
        </body>
        </html>
      `;
      printWindow.document.write(content);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  return (
    <section id="resume" className="resume">
      <div className="container">
        <h2>Experience & Skills</h2>

        <div className="resume-format-toggle">
          <button
            className={`format-btn ${viewFormat === 'web' ? 'active' : ''}`}
            onClick={() => setViewFormat('web')}
          >
            Web View
          </button>
          <button
            className={`format-btn ${viewFormat === 'ats' ? 'active' : ''}`}
            onClick={() => setViewFormat('ats')}
          >
            ATS Format
          </button>
        </div>

        <div className="resume-content">
          {viewFormat === 'web' ? (
            <div className="resume-grid">
              <div className="experience">
                <h3>Experience</h3>
                {RESUME_DATA.experience.map((exp) => (
                  <div key={exp.id} className="experience-item">
                    <h4>{exp.position}</h4>
                    <p className="company">{exp.company}</p>
                    <p className="duration">{exp.duration}</p>
                    <p className="description">{exp.description}</p>
                    <ul className="achievements">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="skills">
                <h3>Skills</h3>
                {RESUME_DATA.skills.map((skillGroup, idx) => (
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
          ) : (
            <div className="ats-resume">
              <h3>{RESUME_DATA.personalInfo.fullName}</h3>
              <p>
                {RESUME_DATA.personalInfo.email} | {RESUME_DATA.personalInfo.phone} | {RESUME_DATA.personalInfo.location}
              </p>
              <p>
                <a href={RESUME_DATA.personalInfo.linkedIn}>LinkedIn</a> | <a href={RESUME_DATA.personalInfo.github}>GitHub</a> | <a href={RESUME_DATA.personalInfo.portfolio}>Portfolio</a>
              </p>

              <h4>PROFESSIONAL SUMMARY</h4>
              <p>{RESUME_DATA.summary}</p>

              <h4>EXPERIENCE</h4>
              {RESUME_DATA.experience.map(exp => (
                <div key={exp.id} className="ats-item">
                  <div className="ats-title">{exp.position} at {exp.company}</div>
                  <div className="ats-date">{exp.duration}</div>
                  <p>{exp.description}</p>
                  <ul>
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <h4>SKILLS</h4>
              {RESUME_DATA.skills.map(skillGroup => (
                <div key={skillGroup.category}>
                  <strong>{skillGroup.category}:</strong> {skillGroup.items.join(', ')}
                </div>
              ))}

              <h4>EDUCATION</h4>
              {RESUME_DATA.education.map(edu => (
                <div key={edu.id} className="ats-item">
                  <div className="ats-title">{edu.degree} in {edu.field}</div>
                  <div className="ats-date">{edu.school} | {edu.graduationDate}</div>
                  <p>GPA: {edu.gpa}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="resume-download">
          <button onClick={downloadResume} className="button primary">
            📥 Download Resume
          </button>
          <button onClick={printResume} className="button secondary">
            🖨️ Print Resume
          </button>
        </div>
      </div>
    </section>
  );
}
