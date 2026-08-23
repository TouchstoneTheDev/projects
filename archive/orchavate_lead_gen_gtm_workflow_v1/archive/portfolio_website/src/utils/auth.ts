import type { User } from '../types/index';

// Simple JWT-like token system for demo (use proper JWT in production)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Portfolio@2026';
const SECRET_KEY = 'portfolio-secret-key-2026';

export function generateToken(username: string): string {
  const payload = {
    username,
    timestamp: Date.now(),
    role: 'admin'
  };
  return btoa(JSON.stringify(payload));
}

export function validateToken(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token));
    return payload.username === ADMIN_USERNAME && payload.role === 'admin';
  } catch {
    return false;
  }
}

export function login(username: string, password: string): User | null {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = generateToken(username);
    const user: User = {
      id: '1',
      username,
      token,
      role: 'admin'
    };
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  return null;
}

export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('auth_token');
  
  if (!userStr || !token) return null;
  
  try {
    const user = JSON.parse(userStr);
    if (validateToken(token)) {
      return user;
    }
  } catch {
    return null;
  }
  
  return null;
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('auth_token');
  return token ? validateToken(token) : false;
}

// Credentials for user
export const CREDENTIALS = {
  username: ADMIN_USERNAME,
  password: ADMIN_PASSWORD
};
