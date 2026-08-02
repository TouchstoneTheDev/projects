import { useEffect, useState } from 'react';
import { getProfilePicture } from '../utils/profile';
import { RESUME_DATA } from '../data/resume';
import '../styles/hero.css';

export function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [profilePic, setProfilePic] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch profile picture from GitHub
    getProfilePicture('TouchstoneTheDev').then(pic => setProfilePic(pic));
  }, []);

  return (
    <section className="hero" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
      <div className="hero-content">
        {profilePic && (
          <img
            src={profilePic}
            alt={RESUME_DATA.personalInfo.fullName}
            className="hero-profile-pic"
            loading="lazy"
          />
        )}
        <h1>{RESUME_DATA.personalInfo.fullName}</h1>
        <p>Full-stack developer | React | TypeScript | Performance-focused | AI Enthusiast</p>
        <div className="hero-links">
          <a href={RESUME_DATA.personalInfo.github} className="hero-link">
            GitHub
          </a>
          <a href={RESUME_DATA.personalInfo.linkedIn} className="hero-link">
            LinkedIn
          </a>
        </div>
        <a href="#projects" className="cta-button">View My Work</a>
      </div>
    </section>
  );
}
