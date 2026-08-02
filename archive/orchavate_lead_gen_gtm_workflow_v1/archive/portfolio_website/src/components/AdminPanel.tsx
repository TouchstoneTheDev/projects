import { useState, useEffect } from 'react';
import { logout, getCurrentUser } from '../utils/auth';
import { loadCards, addCard, removeCard, exportCardsToPrintFormat, generateCardId } from '../utils/cardManager';
import type { Card } from '../types/index';
import '../styles/admin.css';

interface AdminPanelProps {
  onLogout: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [activeTab, setActiveTab] = useState<'view' | 'add' | 'print'>('view');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'project' as const,
    link: '',
    technologies: '',
    status: 'active'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadedCards = loadCards();
    setCards(loadedCards);
  }, []);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();

    const newCard: Card = {
      id: generateCardId(),
      type: formData.type,
      title: formData.title,
      description: formData.description,
      data: {
        link: formData.link,
        technologies: formData.technologies.split(',').map(t => t.trim()),
        status: formData.status
      }
    };

    addCard(newCard);
    setCards([...cards, newCard]);
    setFormData({
      title: '',
      description: '',
      type: 'project',
      link: '',
      technologies: '',
      status: 'active'
    });
    alert('Card added successfully!');
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      removeCard(cardId);
      setCards(cards.filter(c => c.id !== cardId));
    }
  };

  const handlePrint = () => {
    const printContent = exportCardsToPrintFormat(cards);
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Portfolio - Printable Resume</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 20px; }
              h1 { color: #1f2937; border-bottom: 2px solid #6366f1; }
              h2 { color: #6366f1; margin-top: 20px; }
              code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <h1>Portfolio - Cards & Projects</h1>
            ${printContent}
            <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
              Generated on ${new Date().toLocaleDateString()}
            </p>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  const filteredCards = cards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const user = getCurrentUser();

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Portfolio Admin Panel</h1>
        <div className="admin-user-info">
          <span>Logged in as: <strong>{user?.username}</strong></span>
          <button
            onClick={() => {
              logout();
              onLogout();
            }}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View Cards ({cards.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add Card
        </button>
        <button
          className={`tab-btn ${activeTab === 'print' ? 'active' : ''}`}
          onClick={() => setActiveTab('print')}
        >
          Print to Resume
        </button>
      </div>

      {activeTab === 'view' && (
        <div className="admin-content">
          <h2>Manage Cards</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredCards.length === 0 ? (
            <p className="empty-state">No cards found. {cards.length === 0 && 'Add your first card!'}</p>
          ) : (
            <div className="cards-list">
              {filteredCards.map(card => (
                <div key={card.id} className="card-item">
                  <div className="card-header">
                    <h3>{card.title}</h3>
                    <span className="card-type">{card.type}</span>
                  </div>
                  <p>{card.description}</p>
                  <div className="card-meta">
                    <small>ID: {card.id}</small>
                  </div>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="btn btn-danger btn-small"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'add' && (
        <div className="admin-content">
          <h2>Add New Card</h2>
          <form onSubmit={handleAddCard} className="admin-form">
            <div className="form-group">
              <label>Card Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="project">Project</option>
                <option value="ai">AI Project</option>
                <option value="writing">Technical Writing</option>
                <option value="concept">Developer Concept</option>
              </select>
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Enter card title"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Enter description"
                rows={4}
              />
            </div>

            {(formData.type === 'project' || formData.type === 'ai') && (
              <>
                <div className="form-group">
                  <label>Technologies (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>

                <div className="form-group">
                  <label>Link</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </>
            )}

            {formData.type === 'ai' && (
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn btn-primary">
              Add Card
            </button>
          </form>
        </div>
      )}

      {activeTab === 'print' && (
        <div className="admin-content">
          <h2>Print to Resume</h2>
          <p>Click the button below to generate a printable version of all your cards that can be added to your resume.</p>
          <button onClick={handlePrint} className="btn btn-primary btn-large">
            🖨️ Print Cards to Resume
          </button>
          <div className="print-preview">
            <h3>Preview:</h3>
            <div className="preview-content">
              {cards.length === 0 ? (
                <p>No cards to print. Add some cards first!</p>
              ) : (
                <pre>{exportCardsToPrintFormat(cards)}</pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
