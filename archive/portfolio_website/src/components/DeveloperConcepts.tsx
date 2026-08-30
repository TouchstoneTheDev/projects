import { DEVELOPER_CONCEPTS } from '../data/projects';
import '../styles/concepts.css';

export function DeveloperConcepts() {
  return (
    <section id="concepts" className="developer-concepts">
      <div className="container">
        <h2>Developer Concepts & Best Practices</h2>
        <p className="section-description">
          Modern development approaches and industry best practices
        </p>

        <div className="concepts-grid">
          {DEVELOPER_CONCEPTS.map(concept => (
            <article key={concept.id} className="concept-card">
              <div className="concept-icon">{concept.icon}</div>
              <h3>{concept.title}</h3>
              <p className="concept-description">{concept.description}</p>

              <div className="examples">
                <h4>Examples:</h4>
                <ul>
                  {concept.examples.map((example, idx) => (
                    <li key={idx}>{example}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
