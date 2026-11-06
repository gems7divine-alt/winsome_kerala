export function Sparkle({ className = '', delay }) {
  return (
    <span className={`absolute text-primary ${className}`} style={delay ? { animationDelay: delay } : undefined} aria-hidden="true">
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1c1 6.5 4.5 10 11 11-6.5 1-10 4.5-11 11-1-6.5-4.5-10-11-11 6.5-1 10-4.5 11-11Z" />
      </svg>
    </span>
  );
}

export function FloralCorner({ className = '', flip = false }) {
  return (
    <svg
      className={`absolute text-primary/25 ${flip ? 'scale-x-[-1]' : ''} ${className}`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 92c18-8 28-22 30-42 2 20 12 34 30 42M18 78c10-4 16-12 18-24 2 12 8 20 18 24M28 64c6-2 10-6 11-12 1 6 5 10 11 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="34" cy="34" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M34 18v-8M34 50v-8M18 34h-8M50 34h-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Petals drifting down through a section. The parent needs `relative overflow-hidden`. */
export function Petals({ count = 6 }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${((i * 37 + 8) % 96) + 2}%`,
            '--petal-size': `${9 + (i % 4) * 2}px`,
            '--petal-time': `${10 + (i % 5) * 2}s`,
            '--petal-delay': `${-i * 1.7}s`,
            '--petal-drift': `${i % 2 ? 50 : -40}px`,
          }}
        />
      ))}
    </div>
  );
}

/** Soft glossy spheres drifting behind a section. The parent needs `relative overflow-hidden`. */
export function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Petals count={5} />
      <span className="orb left-[1.5%] top-6 h-6 w-6 sm:h-9 sm:w-9" style={{ '--float-time': '9s' }} />
      <span className="orb orb-pearl right-[6%] top-[14%] h-10 w-10 sm:h-16 sm:w-16" style={{ '--float-time': '12s', '--float-delay': '-3s' }} />
      <span className="orb orb-pearl -left-5 bottom-[6%] hidden h-14 w-14 md:block" style={{ '--float-time': '11s', '--float-delay': '-6s' }} />
      <span className="orb -right-2 bottom-[8%] hidden h-6 w-6 md:block" style={{ '--float-time': '8s', '--float-delay': '-2s' }} />
    </div>
  );
}

/** Slow-moving pink glow used as a section backdrop. */
export function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <span className="aurora -left-[10%] -top-[15%] h-[55%] w-[60%] bg-primary-light" />
      <span className="aurora -right-[10%] top-[25%] h-[60%] w-[55%] bg-[#ffd9ee]" style={{ animationDelay: '-8s' }} />
    </div>
  );
}
