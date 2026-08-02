import { useEffect, useState } from 'react';
import '../styles/header.css';

interface HeaderProps {
  onAdminClick?: () => void;
}

export function Header({ onAdminClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <a href="#home">Portfolio</a>
          </div>

          <button
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
            <li><a href="#home" onClick={closeMenu}>Home</a></li>
            <li><a href="#projects" onClick={closeMenu}>Projects</a></li>
            <li><a href="#ai-projects" onClick={closeMenu}>AI Projects</a></li>
            <li><a href="#technical-writing" onClick={closeMenu}>Writing</a></li>
            <li><a href="#concepts" onClick={closeMenu}>Concepts</a></li>
            <li><a href="#resume" onClick={closeMenu}>Resume</a></li>
            <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
            {onAdminClick && (
              <li>
                <button onClick={onAdminClick} className="admin-btn">
                  ⚙️ Admin
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
