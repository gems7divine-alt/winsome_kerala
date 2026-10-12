import { services } from '../../data/servicesContent';
import { ArrowRightIcon, CalendarIcon } from '../../components/ui/Icon';
import ServiceCard from './ServiceCard';

function Sparkle({ className }) {
  return (
    <span className={`absolute text-primary ${className}`} aria-hidden="true">
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l1.4 4.6L18 8l-4.6 1.4L12 14l-1.4-4.6L6 8l4.6-1.4L12 2Zm0 10l1 3.2L16 16l-3 1 1 3.2L12 18l-1 2.2 1-3.2-3-1 3-1-1-3.2L12 12Z" />
      </svg>
    </span>
  );
}

function FloralCorner({ className, flip = false }) {
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

function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft via-white to-white pt-16 pb-10 sm:pt-20 sm:pb-14">
      <FloralCorner className="left-0 top-16 h-24 w-24 sm:h-32 sm:w-32" />
      <FloralCorner className="right-0 top-16 h-24 w-24 sm:h-32 sm:w-32" flip />
      <Sparkle className="left-[18%] top-[38%] hidden sm:block" />
      <Sparkle className="right-[22%] top-[42%] hidden sm:block" />
      <Sparkle className="left-[42%] top-[28%] opacity-70" />

      <div className="relative z-10 mx-auto max-w-[1480px] px-5 text-center sm:px-8 lg:px-12">
        <p className="text-base font-bold uppercase tracking-[0.22em] text-primary sm:text-xl">Our Services</p>
        <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-black sm:text-5xl md:text-6xl">
          Beauty Solutions{' '}
          <span className="block font-script text-[1.15em] font-normal text-primary sm:inline sm:text-[1.2em]">
            Just For You
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-text-muted sm:text-base sm:leading-8">
          Discover our wide range of beauty and grooming services designed to bring out the best in you.
        </p>
      </div>
    </section>
  );
}

function ServicesGrid({ onBookAppointment }) {
  return (
    <section className="bg-white pb-12 sm:pb-16">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              subtitle={service.subtitle}
              image={service.image}
              onBook={onBookAppointment}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesCta({ onBookAppointment }) {
  return (
    <section className="bg-white px-5 pb-12 sm:px-8 lg:px-12">
      <div className="relative mx-auto max-w-[1480px] overflow-hidden rounded-3xl bg-primary px-5 py-5 shadow-[0_24px_60px_rgba(233,30,140,0.28)] sm:px-8 sm:py-6">
        <FloralCorner className="right-0 bottom-0 h-24 w-24 translate-x-5 translate-y-5 text-white/15" flip />

        <div className="relative z-10 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4 sm:items-center">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-primary shadow-[0_12px_30px_rgba(0,0,0,0.08)] sm:h-14 sm:w-14">
              <CalendarIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div>
              <p className="font-script text-xl text-white sm:text-2xl">Ready to Glow?</p>
              <h2 className="mt-0.5 text-lg font-bold leading-tight text-white sm:text-xl md:text-2xl">
                Book Your Appointment Today
              </h2>
              <p className="mt-1 max-w-xl text-sm font-medium leading-5 text-white/90">
                Let our experts pamper you with the best care and treatments.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBookAppointment}
            className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-primary shadow-[0_16px_32px_rgba(0,0,0,0.12)] transition hover:bg-primary-soft sm:h-12 sm:w-auto sm:px-6"
          >
            <CalendarIcon className="h-4 w-4 shrink-0" />
            <span>Book Appointment</span>
            <ArrowRightIcon className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Services({ onBookAppointment }) {
  return (
    <div id="services" className="bg-white scroll-mt-24">
      <ServicesHero />
      <ServicesGrid onBookAppointment={onBookAppointment} />
      <ServicesCta onBookAppointment={onBookAppointment} />
    </div>
  );
}
