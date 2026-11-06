import { ArrowRightIcon } from '../../components/ui/Icon';
import Tilt3D from '../../components/ui/Tilt3D';

export default function ServiceCard({ title, subtitle, image, price, onSelect, onBook }) {
  return (
    <Tilt3D
      as="article"
      max={11}
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
      className="card-lift group relative flex h-full cursor-pointer flex-col rounded-3xl border border-slate-100 bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,0.07)] sm:p-2.5"
    >
      <div className="depth-1 relative mx-auto aspect-square w-full max-w-[220px] ring-spin overflow-hidden rounded-full bg-primary-soft p-1 shadow-[0_12px_24px_rgba(143,15,85,0.2)]">
        <img
          className="h-full w-full rounded-full object-cover transition-transform duration-700 ease-spring group-hover:scale-110"
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="preserve-3d flex flex-1 flex-col px-1 pb-1 pt-3 sm:px-1.5">
        <h3 className="depth-1 text-center text-[13px] font-bold leading-snug text-black sm:text-[15px]">{title}</h3>
        {subtitle && (
          <p className="depth-1 mt-0.5 text-center text-[11px] font-medium leading-snug text-text-muted sm:text-xs">({subtitle})</p>
        )}

        <div className="preserve-3d mt-auto flex items-end justify-between gap-1.5 pt-2.5">
          <div className="depth-2 min-w-0">
            {price ? (
              <p className="rounded-full bg-primary-soft px-2 py-1 text-[11px] font-bold leading-tight text-primary sm:px-2.5 sm:text-xs">
                {price}
              </p>
            ) : (
              <p className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold leading-tight text-text-muted sm:text-xs">
                View price
              </p>
            )}
          </div>

          <button
            type="button"
            aria-label={`Book ${title}`}
            onClick={(e) => {
              e.stopPropagation();
              onBook?.();
            }}
            className="depth-3 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-white shadow-[0_3px_0_var(--color-primary-deep),0_10px_18px_rgba(233,30,140,0.35)]"
          >
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </Tilt3D>
  );
}
