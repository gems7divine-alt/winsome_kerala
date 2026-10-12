import { navItems } from '../../data/homeContent';

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

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ease-in-out ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="mobile-sidebar"
        aria-label="Main menu"
        className={`fixed top-0 right-0 z-50 flex w-80 max-w-[90vw] flex-col gap-8 bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-96 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 pt-2 pb-2">
          <h2 className="text-lg font-bold text-black">Menu</h2>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md p-2 text-black hover:text-primary"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-6 pt-4 text-base font-semibold">
          {navItems.map((item) => {
            const page = pageByNav[item];
            const isActive = page === activePage;
            return (
              <button
                key={item}
                type="button"
                onClick={() => page && navigate(page)}
                className={`relative block py-3.5 text-left text-black transition hover:text-primary ${isActive ? 'text-primary' : ''}`}
              >
                <span>{item}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-1 w-6 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
