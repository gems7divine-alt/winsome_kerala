import { useState } from 'react';
import logoImage from '../../assets/logo-clean.png';
import { navItems } from '../../data/homeContent';
import Button from '../ui/Button';
import MobileSidebar from '../MobileSidebar/MobileSidebar';

function Logo({ onClick }) {
  return (
    <button className="block shrink-0" onClick={onClick} type="button" aria-label="Winsome Makeover home">
      <img
        className="h-auto w-32 object-contain sm:w-40 lg:w-48"
        src={logoImage}
        alt="Winsome Makeover Aesthetic Beauty Clinic"
      />
    </button>
  );
}

function HamburgerIcon({ open }) {
  return (
    <svg
      className="h-6 w-6 text-black"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export default function Header({ activePage = 'home', onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageByNav = {
    Home: 'home',
    Services: 'services',
    Contact: 'contact',
    'About Us': 'about',
  };

  const closeDrawer = () => setMobileOpen(false);

  const navigate = (page) => {
    onNavigate(page);
    closeDrawer();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-white/95 shadow-[0_2px_10px_rgba(0,0,0,0.06)] backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="relative z-40 mx-auto flex max-w-[1480px] items-center justify-between gap-6 px-5 pt-1 sm:px-8 lg:gap-8 lg:px-12">
        <Logo onClick={() => navigate('home')} />

        <nav className="hidden items-center gap-10 text-[15px] font-semibold text-black lg:flex lg:ml-auto xl:gap-12">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              className="relative py-3 transition hover:text-primary"
              onClick={() => pageByNav[item] && onNavigate(pageByNav[item])}
            >
              <span className={pageByNav[item] === activePage ? 'text-primary' : ''}>{item}</span>
              {pageByNav[item] === activePage && (
                <span className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            className="h-12 sm:h-12 px-5 sm:px-6 text-xs sm:text-sm"
            onClick={() => navigate('booking')}
          >
            Book Appointment
          </Button>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-sidebar"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 text-black lg:hidden"
        >
          <HamburgerIcon open={mobileOpen} />
        </button>
      </div>

      <MobileSidebar
        open={mobileOpen}
        onClose={closeDrawer}
        activePage={activePage}
        onNavigate={onNavigate}
      />
    </header>
  );
}
