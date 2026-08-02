export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github?: string;
  demo?: string;
  featured: boolean;
  preview?: string;
  liveUrl?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  technologies: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AIProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  status: 'active' | 'completed' | 'in-progress';
}

export interface TechnicalWriting {
  id: string;
  title: string;
  platform: string;
  url: string;
  date: string;
  description: string;
}

export interface DeveloperConcept {
  id: string;
  title: string;
  description: string;
  icon: string;
  examples: string[];
}

export interface Card {
  id: string;
  type: 'project' | 'ai' | 'writing' | 'concept';
  title: string;
  description: string;
  data: Record<string, unknown>;
}

export interface User {
  id: string;
  username: string;
  token: string;
  role: 'admin' | 'user';
}
