import shopImage from '../../assets/shop.png';
import employeeImage from '../../assets/employee.png';
import { aboutHero, aboutStats, missionValues, ourStory, teamSection } from '../../data/aboutContent';
import { CalendarIcon } from '../../components/ui/Icon';

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

function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft via-white to-white pt-16 pb-10 sm:pt-20 sm:pb-14">
      <FloralCorner className="left-0 top-16 h-24 w-24 sm:h-32 sm:w-32" />
      <FloralCorner className="right-0 top-16 h-24 w-24 sm:h-32 sm:w-32" flip />
      <Sparkle className="left-[18%] top-[38%] hidden sm:block" />
      <Sparkle className="right-[22%] top-[42%] hidden sm:block" />

      <div className="relative z-10 mx-auto grid max-w-[1480px] grid-cols-1 items-center gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-12">
        <div className="max-w-xl">
          <p className="text-base font-bold uppercase tracking-[0.22em] text-primary sm:text-xl">{aboutHero.label}</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-black sm:text-5xl md:text-6xl">
            {aboutHero.title}{' '}
            <span className="block font-script text-[1.1em] font-normal text-primary sm:inline sm:text-[1.15em]">
              {aboutHero.titleAccent}
            </span>
          </h1>
          <p className="mt-4 text-sm font-medium leading-7 text-text-muted sm:text-base sm:leading-8">
            {aboutHero.description}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[620px] lg:max-w-none">
          <div className="overflow-hidden rounded-[40px] rounded-br-[120px] border-4 border-white shadow-[0_24px_60px_rgba(233,30,140,0.12)]">
            <img
              className="h-[260px] w-full object-cover sm:h-[320px] lg:h-[360px]"
              src={shopImage}
              alt="Winsome Makeover clinic exterior"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StorySection({ onBookAppointment }) {
  return (
    <section className="bg-white pb-12 sm:pb-16">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative mx-auto w-full max-w-[620px] lg:max-w-none">
            <div className="overflow-hidden rounded-[40px] rounded-tl-[120px] border-4 border-white shadow-[0_24px_60px_rgba(233,30,140,0.12)]">
              <img
                className="h-[260px] w-full object-cover sm:h-[320px] lg:h-[360px]"
                src={employeeImage}
                alt="Winsome Makeover beauty expert at work"
                loading="lazy"
              />
            </div>
          </div>

          <div className="max-w-xl">
            <p className="font-script text-2xl text-primary sm:text-3xl">{ourStory.scriptTitle}</p>
            <h2 className="mt-1 text-2xl font-bold leading-tight text-black sm:text-3xl md:text-4xl">
              {ourStory.title}
            </h2>
            <div className="mt-5 space-y-4 text-sm font-medium leading-7 text-text-muted sm:text-base">
              {ourStory.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="border-y border-primary/10 bg-primary-soft/40 py-8 sm:py-10">
      <div className="mx-auto grid max-w-[1480px] grid-cols-2 gap-6 px-5 sm:px-8 md:grid-cols-4 lg:px-12">
        {aboutStats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
            <span className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</span>
            <span className="text-xs font-semibold leading-tight text-black sm:text-sm">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MissionCard({ item }) {
  const icons = {
    target: (
      <path d="M12 3a9 9 0 1 0 9 9M12 3a9 9 0 0 1 9 9M12 3v9m9 0h-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    ),
    sparkle: (
      <path d="M12 2l1.4 4.6L18 8l-4.6 1.4L12 14l-1.4-4.6L6 8l4.6-1.4L12 2Zm0 10l1 3.2L16 16l-3 1 1 3.2L12 18l-1 2.2 1-3.2-3-1 3-1-1-3.2L12 12Z" fill="currentColor" />
    ),
    heart: (
      <path d="M12 20s-7-4.4-7-9a3.8 3.8 0 0 1 7-2.3A3.8 3.8 0 0 1 19 11c0 4.6-7 9-7 9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    ),
  };

  return (
    <article className="rounded-2xl border border-slate-100 bg-white px-6 py-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {icons[item.icon]}
        </svg>
      </div>
      <h3 className="mt-5 text-lg font-bold text-black">{item.title}</h3>
      <p className="mt-3 text-sm font-medium leading-6 text-text-muted">{item.text}</p>
    </article>
  );
}

function MissionSection() {
  return (
    <section className="bg-white pb-12 sm:pb-16">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {missionValues.map((item) => (
            <MissionCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutCta({ onBookAppointment }) {
  return (
    <section className="bg-white px-5 pb-16 pt-6 sm:px-8 lg:px-12">
      <div className="relative mx-auto max-w-[1480px] overflow-hidden rounded-3xl bg-primary px-5 py-5 shadow-[0_24px_60px_rgba(233,30,140,0.28)] sm:px-8 sm:py-6">
        <FloralCorner className="right-0 bottom-0 h-24 w-24 translate-x-5 translate-y-5 text-white/15" flip />

        <div className="relative z-10 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4 sm:items-center">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-primary shadow-[0_12px_30px_rgba(0,0,0,0.08)] sm:h-14 sm:w-14">
              <CalendarIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div>
              <p className="font-script text-xl text-white sm:text-2xl">Ready to Experience the Difference?</p>
              <p className="mt-1 max-w-xl text-sm font-medium leading-6 text-white/95 sm:text-base">
                Come say hello and let our team take care of you. Book your appointment today.
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
          </button>
        </div>
      </div>
    </section>
  );
}

export default function AboutUs({ onBookAppointment }) {
  return (
    <div id="about" className="scroll-mt-24 bg-white">
      <AboutHero />
      <StorySection onBookAppointment={onBookAppointment} />
      <StatsBar />
      <MissionSection />
      <AboutCta onBookAppointment={onBookAppointment} />
    </div>
  );
}
