import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Resume } from './components/Resume';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import './styles/globals.css';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Projects />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
