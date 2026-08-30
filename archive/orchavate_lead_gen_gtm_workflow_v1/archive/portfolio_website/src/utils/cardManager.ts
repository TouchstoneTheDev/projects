import type { Card, AIProject, TechnicalWriting, DeveloperConcept } from '../types/index';

const STORAGE_KEY = 'portfolio_cards';

export function loadCards(): Card[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCards(cards: Card[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error('Error saving cards:', error);
  }
}

export function addCard(card: Card): void {
  const cards = loadCards();
  cards.push(card);
  saveCards(cards);
}

export function removeCard(cardId: string): void {
  const cards = loadCards();
  const filtered = cards.filter(c => c.id !== cardId);
  saveCards(filtered);
}

export function updateCard(cardId: string, updates: Partial<Card>): void {
  const cards = loadCards();
  const index = cards.findIndex(c => c.id === cardId);
  if (index !== -1) {
    cards[index] = { ...cards[index], ...updates };
    saveCards(cards);
  }
}

export function getCardsByType(type: Card['type']): Card[] {
  const cards = loadCards();
  return cards.filter(c => c.type === type);
}

export function generateCardId(): string {
  return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Initialize default cards if none exist
export function initializeDefaultCards(): void {
  const existing = loadCards();
  if (existing.length === 0) {
    // Cards will be created through UI
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}

// Export card data for resume
export function exportCardsToPrintFormat(cards: Card[]): string {
  let output = '';
  
  cards.forEach(card => {
    switch (card.type) {
      case 'project': {
        const project = card.data as AIProject;
        output += `\n## ${card.title}\n`;
        output += `${card.description}\n`;
        output += `Technologies: ${project.technologies?.join(', ')}\n`;
        if (project.link) output += `Link: ${project.link}\n`;
        break;
      }
      case 'ai': {
        const aiProject = card.data as AIProject;
        output += `\n## ${card.title}\n`;
        output += `${card.description}\n`;
        output += `Technologies: ${aiProject.technologies?.join(', ')}\n`;
        output += `Status: ${aiProject.status}\n`;
        if (aiProject.link) output += `Link: ${aiProject.link}\n`;
        break;
      }
      case 'writing': {
        const writing = card.data as TechnicalWriting;
        output += `\n## ${card.title}\n`;
        output += `Platform: ${writing.platform}\n`;
        output += `Date: ${writing.date}\n`;
        output += `${card.description}\n`;
        output += `Link: ${writing.url}\n`;
        break;
      }
      case 'concept': {
        const concept = card.data as DeveloperConcept;
        output += `\n## ${card.title}\n`;
        output += `${card.description}\n`;
        output += `Examples: ${concept.examples?.join(', ')}\n`;
        break;
      }
    }
  });
  
  return output;
}
