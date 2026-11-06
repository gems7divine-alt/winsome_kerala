import homeBackground from '../../assets/home.PNG';
import logoMark from '../../assets/logo-mark.png';
import { featureItems } from '../../data/homeContent';
import Button from '../ui/Button';
import { Aurora, Petals, Sparkle } from '../ui/Decor';
import { FeatureIcon } from '../ui/Icon';
import Reveal from '../ui/Reveal';
import ScrollDepth from '../ui/ScrollDepth';
import Tilt3D from '../ui/Tilt3D';

function FeatureList() {
  return (
    <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-2.5 text-black sm:mx-0 sm:gap-4 lg:mt-10">
      {featureItems.map((item, index) => (
        <Reveal key={item.title} delay={index * 90}>
          <Tilt3D
            max={12}
            className="card-lift relative flex h-full flex-col items-center gap-2 rounded-2xl border border-primary/10 bg-white/80 px-1.5 py-3 text-center shadow-[0_12px_30px_rgba(233,30,140,0.1)] sm:px-3 xl:flex-row xl:gap-3 xl:text-left"
          >
            <div className="coin-flip grid h-10 w-10 shrink-0 place-items-center text-primary sm:h-12 sm:w-12" style={{ '--z': '52px' }}>
              <FeatureIcon name={item.icon} />
            </div>
            <p className="depth-1 text-[11px] font-bold leading-tight sm:text-[13px]">
              {item.title}
              <br />
              {item.subtitle}
            </p>
          </Tilt3D>
        </Reveal>
      ))}
    </div>
  );
}

/**
 * Portrait in an arch with rings orbiting through 3D space around it. The source
 * image is a wide composition, so the <img> is oversized and offset to frame only
 * the subject and her pink backdrop at every size. On phones this comes first and
 * nothing covers it, so the whole figure is seen before the text.
 */
function HeroStage() {
  return (
    <div className="stage-enter order-first min-w-0 sm:order-none">
      <ScrollDepth>
        <Tilt3D
          max={9}
          sheen={false}
          className="relative mx-auto aspect-[652/834] w-[min(90vw,420px,max(240px,calc((100svh-6rem)*0.78)))] sm:w-[min(60vw,400px)] md:w-full md:max-w-[440px] lg:max-w-[min(100%,calc((100svh-8rem)*0.78),560px)]"
        >
          <div className="stage-sway preserve-3d relative h-full w-full">
            <div className="stage-halo" aria-hidden="true" />

            <div className="orbit orbit-alt" style={{ '--orbit-size': '112%', '--orbit-time': '26s' }} aria-hidden="true">
              <span className="orbit-bead" />
            </div>
            <div className="orbit" style={{ '--orbit-size': '128%' }} aria-hidden="true">
              <span className="orbit-bead" />
            </div>

            <div className="relative h-full w-full overflow-hidden rounded-t-[50%_39%] rounded-b-[2rem] border-[6px] border-white bg-primary-light shadow-[0_34px_70px_rgba(143,15,85,0.28)]">
              <img
                className="absolute left-[-142.6%] top-[-19.2%] w-[242.6%] max-w-none"
                src={homeBackground}
                alt="Smiling client of Winsome Makeover"
                fetchPriority="high"
              />
              <span className="photo-sweep" aria-hidden="true" />
              {/* Soft white base so the pink shop name reads like the logo. */}
              <span
                className="absolute inset-x-0 bottom-0 h-[44%] bg-gradient-to-t from-white from-45% via-white/85 via-65% to-transparent"
                aria-hidden="true"
              />
            </div>

            <Sparkle className="twinkle left-[6%] top-[12%]" />
            <Sparkle className="twinkle right-[2%] top-[22%]" delay="-1.2s" />
            <Sparkle className="twinkle bottom-[30%] left-[-2%]" delay="-2.1s" />

            {/* Sized in cqw (its own width), so it always fits the arch whatever the screen. */}
            <div className="shop-name pointer-events-none absolute inset-x-[7%] bottom-[3%] z-10">
              <div className="flex items-center justify-center gap-[3cqw]">
                <img className="h-auto w-[25cqw] shrink-0" src={logoMark} alt="" aria-hidden="true" />
                <p className="shop-name-text font-script text-[17cqw] leading-[0.82] text-primary">
                  Winsome
                  <br />
                  Makeover
                </p>
              </div>
              <div className="mt-[2.5cqw] flex items-center justify-center gap-[2.5cqw] text-primary">
                <span className="h-px w-[14cqw] bg-primary/70" aria-hidden="true" />
                <p className="whitespace-nowrap text-[4cqw] font-semibold leading-none">Aesthetic Beauty Clinic</p>
                <span className="h-px w-[14cqw] bg-primary/70" aria-hidden="true" />
              </div>
            </div>
          </div>
        </Tilt3D>
      </ScrollDepth>
    </div>
  );
}

export default function Hero({ onBookAppointment, onExploreServices }) {
  return (
    <section id="home" className="relative scroll-mt-24 overflow-hidden bg-white">
      <Aurora />
      <Sparkle className="left-[46%] top-[20%] hidden md:block" />
      <Sparkle className="bottom-[8%] left-[6%] hidden opacity-60 md:block" />

      <div className="site-container relative z-10 grid items-center gap-y-10 pb-14 pt-[5.5rem] sm:gap-y-12 sm:pt-28 md:grid-cols-[1.1fr_0.9fr] md:gap-x-8 lg:min-h-svh lg:gap-x-12 lg:pb-12">
        <div className="min-w-0 text-center sm:text-left">
          <p className="flip-in text-sm font-bold uppercase tracking-[0.18em] text-primary sm:text-lg lg:text-xl">
            Enhance Your Beauty +
          </p>
          <h1 className="mt-3 text-[clamp(2.5rem,6.6vw,5.5rem)] font-bold leading-[1.02] text-black sm:mt-5">
            <span className="flip-in" style={{ '--flip-delay': '120ms' }}>Reveal Your</span>
            <span className="flip-in" style={{ '--flip-delay': '260ms' }}>
              Natural{' '}
              <span className="font-script text-[1.25em] font-normal leading-none text-primary">Glow</span>
            </span>
          </h1>

          <p
            className="flip-in mx-auto mt-5 max-w-[610px] text-[15px] font-medium leading-7 text-black/85 sm:mx-0 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9"
            style={{ '--flip-delay': '400ms' }}
          >
            Professional care and personalized beauty treatments to bring out the best in you. Because you deserve to feel beautiful, every day.
          </p>

          <div className="flip-in mt-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap lg:mt-9" style={{ '--flip-delay': '520ms' }}>
            <Button className="btn-glow w-full sm:w-auto" onClick={onBookAppointment}>Book Appointment</Button>
            <Button variant="outline" className="w-full sm:w-auto" onClick={onExploreServices}>
              Explore Services
            </Button>
          </div>

          <FeatureList />
        </div>

        <HeroStage />
      </div>

      <Petals count={10} />
    </section>
  );
}
