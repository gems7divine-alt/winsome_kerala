import { ArrowRightIcon } from '../../components/ui/Icon';

export default function ServiceCard({ title, subtitle, image, onBook }) {
  return (
    <article className="group relative flex min-h-[88px] items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition hover:border-primary/20 hover:shadow-[0_8px_28px_rgba(233,30,140,0.08)] sm:min-h-[96px] sm:gap-4 sm:px-4">
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
      </div>

      <button
        type="button"
        aria-label={`Book ${title}`}
        onClick={onBook}
        className="absolute bottom-2.5 right-2.5 grid h-7 w-7 place-items-center rounded-full bg-primary text-white shadow-[0_6px_16px_rgba(233,30,140,0.28)] transition group-hover:scale-105"
      >
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </button>
    </article>
  );
}
