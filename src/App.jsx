import { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Services from './pages/Services/Services';
import Contact from './pages/Contact/Contact';
import BookingAppointment from './pages/BookingAppointment/BookingAppointment';
import AboutUs from './pages/AboutUs/AboutUs';

function scrollToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
}

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [activeSection, setActiveSection] = useState('home');
  const [scrollTarget, setScrollTarget] = useState(null);

  const navHighlight = activePage === 'home' ? activeSection : activePage;

  const handleNavigate = (page) => {
    if (page === 'home' || page === 'services' || page === 'contact' || page === 'about') {
      setActivePage('home');
      setScrollTarget(page);
      return;
    }

    setActivePage(page);
    setScrollTarget(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    if (activePage !== 'home' || !scrollTarget) return;

    const sectionId = scrollTarget === 'home' ? 'home' : scrollTarget;
    requestAnimationFrame(() => {
      scrollToSection(sectionId);
      setActiveSection(scrollTarget);
      setScrollTarget(null);
    });
  }, [activePage, scrollTarget]);

  useEffect(() => {
    if (activePage !== 'home') return undefined;

    const sections = ['home', 'services', 'contact', 'about']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [activePage]);

  return (
    <div className="min-h-screen bg-white">
      <Header activePage={navHighlight} onNavigate={handleNavigate} />
      <main>
        {activePage === 'booking' ? (
          <BookingAppointment />
        ) : (
          <>
            <Hero
              onBookAppointment={() => handleNavigate('booking')}
              onExploreServices={() => handleNavigate('services')}
            />
            <Services onBookAppointment={() => handleNavigate('booking')} />
            <Contact onBookAppointment={() => handleNavigate('booking')} />
            <AboutUs onBookAppointment={() => handleNavigate('booking')} />
          </>
        )}
      </main>
    </div>
  );
}
