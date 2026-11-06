import { ArrowRightIcon, CalendarIcon } from './Icon';
import { FloralCorner } from './Decor';
import Reveal from './Reveal';
import Tilt3D from './Tilt3D';

/** Pink "book now" banner closing the Services, Contact and About sections. */
export default function SectionCta({ script, title, description, onBook, className = '' }) {
  return (
    <section className={`bg-white ${className}`}>
      <div className="site-container">
        <Reveal>
          <Tilt3D max={3} sheen={false} className="relative">
            <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(120deg,#f4379f_0%,var(--color-primary)_45%,var(--color-primary-dark)_100%)] px-5 py-6 shadow-[0_28px_60px_rgba(233,30,140,0.32)] sm:px-8 sm:py-7 lg:px-10">
              <span className="orb orb-pearl -right-6 -top-8 h-28 w-28 opacity-30" aria-hidden="true" />
              <span className="orb orb-pearl bottom-3 left-[46%] hidden h-10 w-10 opacity-25 lg:block" style={{ '--float-delay': '-4s' }} aria-hidden="true" />
              <FloralCorner className="bottom-0 right-0 h-24 w-24 translate-x-5 translate-y-5 text-white/15" flip />

              <div className="relative z-10 flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4 sm:items-center">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-primary shadow-[0_6px_0_#f5b5d9,0_16px_26px_rgba(70,0,40,0.25)] sm:h-14 sm:w-14">
                    <CalendarIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-script text-2xl leading-tight text-white sm:text-3xl">{script}</p>
                    {title && (
                      <h2 className="mt-0.5 text-lg font-bold leading-tight text-white sm:text-xl md:text-2xl">{title}</h2>
                    )}
                    <p className="mt-1 max-w-xl text-sm font-medium leading-6 text-white/95">{description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onBook}
                  className="btn-3d btn-3d-white group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold sm:w-auto"
                >
                  <CalendarIcon className="h-4 w-4 shrink-0" />
                  <span>Book Appointment</span>
                  <ArrowRightIcon className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </Tilt3D>
        </Reveal>
      </div>
    </section>
  );
}
