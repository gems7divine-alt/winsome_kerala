import { useEffect } from 'react';
import { navItems } from '../../data/homeContent';
import Button from '../ui/Button';

function CloseIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function MobileSidebar({ open, onClose, activePage, onNavigate }) {
  const pageByNav = {
    Home: 'home',
    Services: 'services',
    Contact: 'contact',
    'About Us': 'about',
  };

  const navigate = (page) => {
    onNavigate(page);
    onClose();
  };

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[#2a0a1c]/50 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Swings in from the right edge like a door on a hinge. */}
      <aside
        id="mobile-sidebar"
        aria-label="Main menu"
        inert={!open}
        style={{
          transform: open
            ? 'perspective(1200px) rotateY(0deg) translateX(0)'
            : 'perspective(1200px) rotateY(-28deg) translateX(100%)',
          transformOrigin: '100% 50%',
        }}
        className={`fixed right-0 top-0 z-50 flex h-[100dvh] w-80 max-w-[88vw] flex-col gap-4 overflow-y-auto overscroll-contain rounded-l-3xl bg-white shadow-2xl transition-[transform,opacity] duration-500 ease-spring sm:w-96 lg:hidden ${open ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex items-center justify-between px-6 pt-3">
          <h2 className="text-lg font-bold text-black">Menu</h2>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-black transition hover:bg-primary-soft hover:text-primary"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-4 text-base font-semibold">
          {navItems.map((item, index) => {
            const page = pageByNav[item];
            const isActive = page === activePage;
            return (
              <button
                key={item}
                type="button"
                onClick={() => page && navigate(page)}
                style={{
                  transitionDelay: open ? `${120 + index * 60}ms` : '0ms',
                  transform: open ? 'none' : 'perspective(600px) rotateY(-40deg) translateX(24px)',
                }}
                className={`min-h-12 shrink-0 rounded-2xl px-4 text-left transition-[transform,opacity,color] duration-500 ease-spring hover:text-primary ${open ? 'opacity-100' : 'opacity-0'} ${isActive ? 'bg-primary-soft text-primary' : 'text-black'}`}
              >
                {item}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3.5 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2">
          <Button size="sm" className="w-full text-sm!" onClick={() => navigate('booking')}>Book Appointment</Button>
          <Button size="sm" variant="outline" className="w-full text-sm!" onClick={() => navigate('admin')}>Admin</Button>
        </div>
      </aside>
    </>
  );
}
