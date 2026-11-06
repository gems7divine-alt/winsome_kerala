import { useEffect } from 'react';
import { ArrowRightIcon, CalendarIcon } from '../../components/ui/Icon';

export default function ServicePriceModal({ service, categories, onClose, onBook }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  if (!service) return null;

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[100] flex items-end justify-center bg-[#2a0a1c]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${service.title} prices`}
    >
      <div
        className="modal-3d flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[calc(100dvh-2.5rem)] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative shrink-0 bg-[linear-gradient(120deg,#f4379f,var(--color-primary-dark))] px-5 pb-5 pt-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close price details"
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white hover:text-primary"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-white bg-white p-[3px]">
              <img src={service.image} alt={service.title} className="h-full w-full rounded-full object-cover" />
            </div>
            <div className="pr-10">
              <h3 className="text-lg font-bold leading-tight text-white sm:text-xl">{service.title}</h3>
              {service.subtitle && <p className="text-xs font-medium text-white/85">({service.subtitle})</p>}
              {service.price ? (
                <p className="mt-1.5 inline-block rounded-full bg-white px-3 py-1 text-xs font-bold text-primary sm:text-sm">
                  {service.price}
                </p>
              ) : (
                <p className="mt-1.5 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                  Price on consultation
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Price list */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="mb-4 last:mb-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary sm:text-sm">
                  {category.title}
                </h4>
                <ul className="mt-1 divide-y divide-slate-100">
                  {category.items.map((item) => (
                    <li key={item.name} className="flex items-baseline justify-between gap-3 py-2">
                      <span className="text-[13px] font-semibold uppercase leading-snug text-black sm:text-sm">
                        {item.name}
                      </span>
                      <span className="mx-1 hidden flex-1 border-b border-dotted border-slate-300 sm:block" aria-hidden="true" />
                      <span className="shrink-0 text-[13px] font-bold text-primary sm:text-sm">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm font-semibold text-black">Price on consultation</p>
              <p className="mt-1 text-xs font-medium text-text-muted">
                Please contact us or book an appointment to know the exact price for {service.title}.
              </p>
            </div>
          )}
          <p className="mt-2 text-center text-[11px] font-medium text-text-muted">
            All Kerala Beauticians Association, Wayanad — Minimum Price Chart 2026-2027
          </p>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 gap-3 border-t border-slate-100 bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 flex-1 rounded-xl border border-slate-200 text-sm font-bold text-black transition hover:bg-slate-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose?.();
              onBook?.();
            }}
            className="btn-3d btn-3d-filled group inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold"
          >
            <CalendarIcon className="h-4 w-4" />
            Book Now
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
