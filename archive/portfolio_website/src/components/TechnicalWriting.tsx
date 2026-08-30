import { TECHNICAL_WRITING } from '../data/projects';
import '../styles/technical-writing.css';

export function TechnicalWriting() {
  const platformIcons: Record<string, string> = {
    'Dev.to': '📝',
    'Medium': '✍️',
    'Hashnode': '🔗',
    'Dev': '💻',
    'Blog': '📰'
  };

  return (
    <section id="technical-writing" className="technical-writing">
      <div className="container">
        <h2>Technical Writing</h2>
        <p className="section-description">
          Sharing knowledge and insights about software development
        </p>

        <div className="writing-grid">
          {TECHNICAL_WRITING.map(article => (
            <article key={article.id} className="writing-card">
              <div className="writing-header">
                <span className="platform-badge">
                  {platformIcons[article.platform] || '📄'} {article.platform}
                </span>
                <time className="date">{new Date(article.date).toLocaleDateString()}</time>
              </div>

              <h3>{article.title}</h3>
              <p className="description">{article.description}</p>

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="read-link"
              >
                Read Article →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
