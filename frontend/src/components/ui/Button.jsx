import { ArrowRightIcon, CalendarIcon } from './Icon';

const sizes = {
  md: 'min-h-12 gap-2.5 px-6 text-sm sm:min-h-14 sm:gap-3 sm:px-8 sm:text-base',
  sm: 'min-h-11 gap-2 px-4 text-xs xl:px-5 xl:text-sm',
};

export default function Button({ children, variant = 'filled', size = 'md', className = '', onClick, ariaLabel }) {
  const isFilled = variant === 'filled';

  return (
    <button
      className={[
        'btn-3d group inline-flex items-center justify-center rounded-2xl font-semibold',
        isFilled ? 'btn-3d-filled' : 'btn-3d-outline',
        sizes[size],
        className,
      ].join(' ')}
      aria-label={ariaLabel}
      onClick={onClick}
      type="button"
    >
      {isFilled && <CalendarIcon className="h-5 w-5 shrink-0" />}
      <span className="whitespace-nowrap">{children}</span>
      {size === 'md' && <ArrowRightIcon className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />}
    </button>
  );
}
