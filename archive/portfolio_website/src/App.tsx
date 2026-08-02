import { useState, useEffect } from 'react';
import { isAuthenticated } from './utils/auth';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { AIProjects } from './components/AIProjects';
import { TechnicalWriting } from './components/TechnicalWriting';
import { DeveloperConcepts } from './components/DeveloperConcepts';
import { Resume } from './components/Resume';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import './styles/globals.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowAdmin(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowAdmin(false);
  };

  if (isLoggedIn && showAdmin) {
    return <AdminPanel onLogout={handleLogout} />;
  }

  if (isLoggedIn && !showAdmin) {
    return (
      <>
        <Header onAdminClick={() => setShowAdmin(true)} />
        <main>
          <Hero />
          <Projects />
          <AIProjects />
          <TechnicalWriting />
          <DeveloperConcepts />
          <Resume />
          <Contact />
        </main>
        <Footer />
      </>
    );
  }

  return <Login onLoginSuccess={handleLoginSuccess} />;
}

export default App;
