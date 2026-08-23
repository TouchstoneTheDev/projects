import type { AIProject, TechnicalWriting, DeveloperConcept } from '../types/index';

export const AI_PROJECTS: AIProject[] = [
  {
    id: 'ai-1',
    title: 'AI-Powered Code Reviewer',
    description: 'Automated code review tool using Claude AI to analyze pull requests and suggest improvements.',
    technologies: ['Claude API', 'React', 'Node.js', 'GitHub API'],
    link: 'https://github.com/TouchstoneTheDev/ai-code-reviewer',
    status: 'active'
  },
  {
    id: 'ai-2',
    title: 'Textbook Generator',
    description: 'AI-powered educational content generator that creates comprehensive textbooks from topics.',
    technologies: ['Claude API', 'Python', 'Firebase', 'React'],
    link: 'https://github.com/TouchstoneTheDev/projects',
    status: 'completed'
  },
  {
    id: 'ai-3',
    title: 'Smart Resume Builder',
    description: 'AI assistant that optimizes resumes for ATS and tailors them for specific job postings.',
    technologies: ['GPT API', 'React', 'TypeScript', 'Flask'],
    link: 'https://github.com/TouchstoneTheDev/resume-builder',
    status: 'in-progress'
  },
  {
    id: 'ai-4',
    title: 'Content Analysis Agent',
    description: 'Multi-agent system for analyzing, summarizing, and extracting insights from documents.',
    technologies: ['Claude API', 'Python', 'Anthropic SDK', 'PostgreSQL'],
    link: 'https://github.com',
    status: 'active'
  }
];

export const TECHNICAL_WRITING: TechnicalWriting[] = [
  {
    id: 'tw-1',
    title: 'Building High-Performance React Applications',
    platform: 'Dev.to',
    url: 'https://dev.to/tanmayveer',
    date: '2024-01-15',
    description: 'Deep dive into React performance optimization techniques and best practices.'
  },
  {
    id: 'tw-2',
    title: 'Mastering TypeScript Advanced Types',
    platform: 'Medium',
    url: 'https://medium.com/@tanmayveer',
    date: '2024-02-20',
    description: 'Comprehensive guide to TypeScript advanced type system and generics.'
  },
  {
    id: 'tw-3',
    title: 'Docker & Kubernetes for Beginners',
    platform: 'Hashnode',
    url: 'https://hashnode.com/@tanmayveer',
    date: '2024-03-10',
    description: 'Getting started with containerization and orchestration tools.'
  },
  {
    id: 'tw-4',
    title: 'API Design Best Practices',
    platform: 'Dev.to',
    url: 'https://dev.to/tanmayveer',
    date: '2024-04-05',
    description: 'Guidelines for designing robust, scalable, and maintainable APIs.'
  },
  {
    id: 'tw-5',
    title: 'State Management in Modern Web Apps',
    platform: 'Medium',
    url: 'https://medium.com/@tanmayveer',
    date: '2024-05-12',
    description: 'Comparison of state management solutions and when to use each.'
  }
];

export const DEVELOPER_CONCEPTS: DeveloperConcept[] = [
  {
    id: 'concept-1',
    title: 'Clean Code Architecture',
    description: 'Writing maintainable, readable code following SOLID principles and design patterns.',
    icon: '🏗️',
    examples: ['Design Patterns', 'SOLID Principles', 'Code Reviews', 'Refactoring']
  },
  {
    id: 'concept-2',
    title: 'Performance Optimization',
    description: 'Techniques to improve application speed, reduce bundle size, and optimize runtime performance.',
    icon: '⚡',
    examples: ['Code Splitting', 'Lazy Loading', 'Caching Strategies', 'Asset Optimization']
  },
  {
    id: 'concept-3',
    title: 'Scalable System Design',
    description: 'Designing systems that can grow and handle increasing load and complexity.',
    icon: '📈',
    examples: ['Microservices', 'Load Balancing', 'Database Sharding', 'Queue Systems']
  },
  {
    id: 'concept-4',
    title: 'DevOps & CI/CD',
    description: 'Automating deployment processes and maintaining reliable infrastructure.',
    icon: '🔄',
    examples: ['GitHub Actions', 'Docker', 'Kubernetes', 'Monitoring & Logging']
  },
  {
    id: 'concept-5',
    title: 'Security Best Practices',
    description: 'Protecting applications and data through secure coding and infrastructure practices.',
    icon: '🔒',
    examples: ['Authentication', 'Encryption', 'SQL Injection Prevention', 'CORS & CSRF']
  },
  {
    id: 'concept-6',
    title: 'Testing & Quality Assurance',
    description: 'Comprehensive testing strategies to ensure code reliability and prevent bugs.',
    icon: '✅',
    examples: ['Unit Testing', 'Integration Testing', 'E2E Testing', 'Test Coverage']
  }
];
