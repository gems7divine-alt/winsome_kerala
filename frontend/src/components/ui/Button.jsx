import { ArrowRightIcon, CalendarIcon } from './Icon';

export default function Button({ children, variant = 'filled', className = '', onClick, ariaLabel }) {
  const isFilled = variant === 'filled';

  return (
    <button
      className={[
        'group inline-flex h-14 items-center justify-center gap-3 rounded-2xl px-7 text-sm font-semibold transition duration-300 sm:h-16 sm:px-8 sm:text-base',
        isFilled
          ? 'bg-primary text-white shadow-[0_18px_32px_rgba(233,30,140,0.23)] hover:bg-primary-dark'
          : 'border-2 border-primary bg-white/80 text-primary hover:bg-primary hover:text-white max-sm:bg-white',
        className,
      ].join(' ')}
      aria-label={ariaLabel}
      onClick={onClick}
      type="button"
    >
      {isFilled && (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/25 sm:h-auto sm:w-auto sm:rounded-none sm:bg-transparent">
          <CalendarIcon className="h-5 w-5 shrink-0" />
        </span>
      )}
      <span className="whitespace-nowrap">{children}</span>
      <ArrowRightIcon className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
    </button>
  );
}
