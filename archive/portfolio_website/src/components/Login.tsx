import { useState } from 'react';
import { login } from '../utils/auth';
import '../styles/auth.css';

interface LoginProps {
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = login(username, password);
    if (user) {
      onLoginSuccess();
    } else {
      setError('Invalid username or password');
    }
  };

  const handleDemoLogin = () => {
    setUsername('admin');
    setPassword('Portfolio@2026');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Portfolio Admin</h1>
        <p className="subtitle">Manage your portfolio cards and content</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-group">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login
          </button>

          <div className="divider">OR</div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            Use Demo Credentials
          </button>
        </form>

        <div className="credentials-info">
          <p className="info-title">Demo Credentials:</p>
          <code>username: admin</code>
          <code>password: Portfolio@2026</code>
        </div>
      </div>
    </div>
  );
}
