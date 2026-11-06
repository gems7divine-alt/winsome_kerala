import Tilt3D from '../../components/ui/Tilt3D';

function ContactCardIcon({ name }) {
  const icons = {
    location: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    phone: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 4 4.8 6.2c-.6.6-.8 1.5-.5 2.3 1.8 5.1 6.1 9.4 11.2 11.2.8.3 1.7.1 2.3-.5L20 17l-4.2-4.2-2 2c-1.9-1-3.6-2.7-4.6-4.6l2-2L7 4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    email: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7h16v10H4V7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    clock: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  };

  return icons[name] ?? null;
}

export default function ContactInfoCard({ icon, title, lines, links = [] }) {
  return (
    <Tilt3D as="article" className="card-lift relative h-full rounded-3xl border border-slate-100 bg-white px-5 py-7 text-center shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
      <div className="coin-flip mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_5px_0_var(--color-primary-deep),0_16px_26px_rgba(233,30,140,0.3)]">
        <ContactCardIcon name={icon} />
      </div>
      <h3 className="depth-2 mt-5 text-base font-bold text-primary sm:text-lg">{title}</h3>
      <div className="depth-1 mt-3 space-y-1 break-words text-sm font-medium leading-6 text-black/85">
        {lines.map((line, index) =>
          links[index] ? (
            <a key={line} href={links[index]} className="block transition hover:text-primary">
              {line}
            </a>
          ) : (
            <p key={line}>{line}</p>
          ),
        )}
      </div>
    </Tilt3D>
  );
}
