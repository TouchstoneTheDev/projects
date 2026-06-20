import { useEffect, useState } from 'react';
import '../styles/hero.css';

export function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
      <div className="hero-content">
        <h1>Portfolio</h1>
        <p>Full-stack developer | React | TypeScript | Performance-focused</p>
        <a href="#projects" className="cta-button">View Work</a>
      </div>
    </section>
  );
}
