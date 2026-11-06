import { useEffect, useState } from 'react';
import shopImage from '../../assets/shop.png';
import employeeImage from '../../assets/employee.png';
import { aboutHero, aboutStats, missionValues, ourStory } from '../../data/aboutContent';
import { Aurora, FloatingOrbs, FloralCorner, Sparkle } from '../../components/ui/Decor';
import PhotoCard from '../../components/ui/PhotoCard';
import Reveal from '../../components/ui/Reveal';
import SectionCta from '../../components/ui/SectionCta';
import Tilt3D from '../../components/ui/Tilt3D';
import useInView from '../../components/ui/useInView';

function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft via-white to-white pb-10 pt-16 sm:pb-14 sm:pt-20">
      <Aurora />
      <FloatingOrbs />
      <FloralCorner className="left-0 top-16 h-24 w-24 sm:h-32 sm:w-32" />
      <FloralCorner className="right-0 top-16 h-24 w-24 sm:h-32 sm:w-32" flip />
      <Sparkle className="left-[18%] top-[38%] hidden sm:block" />
      <Sparkle className="right-[22%] top-[42%] hidden sm:block" />

      <div className="site-container relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <Reveal direction="left" className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary sm:text-xl">{aboutHero.label}</p>
          <h1 className="mt-4 text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.05] text-black">
            {aboutHero.title}{' '}
            <span className="block font-script text-[1.1em] font-normal text-primary">
              {aboutHero.titleAccent}
            </span>
          </h1>
          <p className="mt-4 text-sm font-medium leading-7 text-text-muted sm:text-base sm:leading-8">
            {aboutHero.description}
          </p>
        </Reveal>

        <Reveal direction="right">
          <PhotoCard
            src={shopImage}
            alt="Winsome Makeover clinic exterior"
            cornerClass="rounded-[32px] rounded-br-[clamp(56px,10vw,120px)]"
          />
        </Reveal>
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="bg-white pb-12 sm:pb-16">
      <div className="site-container grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <Reveal direction="left">
          <PhotoCard
            src={employeeImage}
            alt="Winsome Makeover beauty expert at work"
            cornerClass="rounded-[32px] rounded-tl-[clamp(56px,10vw,120px)]"
          />
        </Reveal>

        <Reveal direction="right" className="max-w-xl">
          <p className="font-script text-2xl text-primary sm:text-3xl">{ourStory.scriptTitle}</p>
          <h2 className="mt-1 text-2xl font-bold leading-tight text-black sm:text-3xl md:text-4xl">{ourStory.title}</h2>
          <div className="mt-5 space-y-4 text-sm font-medium leading-7 text-text-muted sm:text-base">
            {ourStory.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Counts from zero to a display value such as "5K+" or "4.9" once it scrolls into view. */
function CountUp({ value }) {
  const { ref, visible } = useInView();
  const [progress, setProgress] = useState(() => (prefersReducedMotion() ? 1 : 0));
  const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(value);

  useEffect(() => {
    if (!visible || prefersReducedMotion()) return undefined;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1400);
      setProgress(1 - (1 - t) ** 3);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  if (!match) return <span>{value}</span>;

  const [, number, suffix] = match;
  const decimals = number.split('.')[1]?.length ?? 0;

  return (
    <span ref={ref} aria-label={value}>
      {(Number(number) * progress).toFixed(decimals)}
      {suffix}
    </span>
  );
}

function StatsBar() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(120deg,var(--color-primary-deep)_0%,var(--color-primary-dark)_50%,var(--color-primary)_100%)] py-10 sm:py-14">
      <span className="orb orb-pearl -left-8 top-4 h-24 w-24 opacity-20" aria-hidden="true" />
      <span className="orb orb-pearl -right-6 bottom-2 h-32 w-32 opacity-20" style={{ '--float-delay': '-5s' }} aria-hidden="true" />
      <div className="site-container relative grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {aboutStats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 100} className="flex flex-col items-center gap-2 text-center">
            <span className="text-3d text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-none text-white">
              <CountUp value={stat.value} />
            </span>
            <span className="text-xs font-semibold leading-tight text-white/90 sm:text-sm">{stat.label}</span>
          </Reveal>
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
    <Tilt3D
      as="article"
      className="card-lift relative h-full rounded-3xl border border-slate-100 bg-white px-6 py-8 text-center shadow-[0_12px_34px_rgba(15,23,42,0.07)]"
    >
      <div className="coin-flip mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_6px_0_var(--color-primary-deep),0_18px_28px_rgba(233,30,140,0.3)]">
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {icons[item.icon]}
        </svg>
      </div>
      <h3 className="depth-2 mt-6 text-lg font-bold text-black">{item.title}</h3>
      <p className="depth-1 mt-3 text-sm font-medium leading-6 text-text-muted">{item.text}</p>
    </Tilt3D>
  );
}

function MissionSection() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="site-container grid grid-cols-1 gap-5 md:grid-cols-3">
        {missionValues.map((item, index) => (
          <Reveal key={item.title} delay={index * 110}>
            <MissionCard item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function AboutUs({ onBookAppointment }) {
  return (
    <div id="about" className="scroll-mt-24 bg-white">
      <AboutHero />
      <StorySection />
      <StatsBar />
      <MissionSection />
      <SectionCta
        className="pb-16"
        script="Ready to Experience the Difference?"
        description="Come say hello and let our team take care of you. Book your appointment today."
        onBook={onBookAppointment}
      />
    </div>
  );
}
