import { useCallback, useEffect, useRef, useState } from 'react';
import logoImage from '../../assets/logo-clean.png';
import { navItems } from '../../data/homeContent';
import Button from '../ui/Button';
import MobileSidebar from '../MobileSidebar/MobileSidebar';

function Logo({ onClick, compact }) {
  return (
    <button className="block shrink-0" onClick={onClick} type="button" aria-label="Winsome Makeover home">
      <img
        className={`h-auto object-contain transition-[width] duration-300 ${compact ? 'w-24 sm:w-28' : 'w-28 sm:w-32 lg:w-36'}`}
        src={logoImage}
        alt="Winsome Makeover Aesthetic Beauty Clinic"
      />
    </button>
  );
}

function HamburgerIcon() {
  return (
    <svg className="h-6 w-6 text-black" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Header({ activePage = 'home', onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24);
  const progressRef = useRef(null);

  const pageByNav = {
    Home: 'home',
    Services: 'services',
    Contact: 'contact',
    'About Us': 'about',
  };

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 24);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty('--progress', scrollable > 0 ? String(window.scrollY / scrollable) : '0');
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const closeDrawer = useCallback(() => setMobileOpen(false), []);

  const navigate = (page) => {
    onNavigate(page);
    closeDrawer();
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-[0_8px_30px_rgba(143,15,85,0.12)]' : 'shadow-[0_1px_0_rgba(233,30,140,0.08)]'}`}
      >
        <div className="site-container flex items-center justify-between gap-4 py-0.5 xl:gap-8">
          <Logo onClick={() => navigate('home')} compact={scrolled} />

          <nav className="hidden items-center gap-5 text-sm font-semibold text-black lg:ml-auto lg:flex xl:gap-10 xl:text-[15px]">
            {navItems.map((item) => {
              const isActive = pageByNav[item] === activePage;
              return (
                <button
                  key={item}
                  type="button"
                  className={`group relative whitespace-nowrap py-3 transition hover:text-primary ${isActive ? 'text-primary' : ''}`}
                  onClick={() => pageByNav[item] && onNavigate(pageByNav[item])}
                >
                  {item}
                  <span
                    className={`absolute bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-primary transition-transform duration-300 ease-spring ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                  />
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Button size="sm" onClick={() => navigate('booking')}>Book Appointment</Button>
            <Button size="sm" variant="outline" ariaLabel="Admin" onClick={() => navigate('admin')}>
              Admin
            </Button>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-sidebar"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-black transition active:bg-primary-soft lg:hidden"
          >
            <HamburgerIcon />
          </button>
        </div>
        <span ref={progressRef} className="scroll-progress" aria-hidden="true" />
      </header>

      {/* Sibling of the header, not a child, so the menu and its overlay stack above
          the header instead of inside its z-30 stacking context. */}
      <MobileSidebar
        open={mobileOpen}
        onClose={closeDrawer}
        activePage={activePage}
        onNavigate={onNavigate}
      />
    </>
  );
}
