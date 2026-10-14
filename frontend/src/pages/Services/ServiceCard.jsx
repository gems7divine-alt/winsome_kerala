import { ArrowRightIcon } from '../../components/ui/Icon';

export default function ServiceCard({ title, subtitle, image, price, onSelect, onBook }) {
  return (
    <article
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ${title} prices`}
      title={`Click to view ${title} prices`}
      className="group relative flex min-h-[88px] cursor-pointer items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_8px_28px_rgba(233,30,140,0.12)] focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 sm:min-h-[96px] sm:gap-4 sm:px-4"
    >
      <div className="grid h-[62px] w-[62px] shrink-0 place-items-center rounded-full border-2 border-primary p-[3px] sm:h-[68px] sm:w-[68px]">
        <img
          className="h-full w-full rounded-full object-cover"
          src={image}
          alt={title}
          loading="lazy"
        />
      </div>

      <div className="min-w-0 flex-1 pr-8">
        <h3 className="text-sm font-bold leading-tight text-black sm:text-[15px]">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-[11px] font-medium leading-snug text-text-muted sm:text-xs">
            ({subtitle})
          </p>
        )}
        {price ? (
          <p className="mt-1 inline-block rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-bold text-primary sm:text-xs">
            {price}
          </p>
        ) : (
          <p className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-text-muted sm:text-xs">
            Click to view price
          </p>
        )}
        <p className="mt-0.5 hidden text-[10px] font-semibold uppercase tracking-wide text-primary/70 group-hover:text-primary sm:block">
          View details
        </p>
      </div>

      <button
        type="button"
        aria-label={`Book ${title}`}
        onClick={(e) => {
          e.stopPropagation();
          onBook?.();
        }}
        className="absolute bottom-2.5 right-2.5 grid h-7 w-7 place-items-center rounded-full bg-primary text-white shadow-[0_6px_16px_rgba(233,30,140,0.28)] transition group-hover:scale-105"
      >
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </button>
    </article>
  );
}
