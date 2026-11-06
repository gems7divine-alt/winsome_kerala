import {
  contactCta,
  contactHero,
  contactInfoCards,
  mapDetails,
  trustIndicators,
} from '../../data/contactContent';
import { Aurora, FloatingOrbs, FloralCorner } from '../../components/ui/Decor';
import { FeatureIcon } from '../../components/ui/Icon';
import PhotoCard from '../../components/ui/PhotoCard';
import Reveal from '../../components/ui/Reveal';
import SectionCta from '../../components/ui/SectionCta';
import Tilt3D from '../../components/ui/Tilt3D';
import ContactInfoCard from './ContactInfoCard';

function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft via-white to-white pb-10 pt-16 sm:pb-14 sm:pt-20">
      <Aurora />
      <FloatingOrbs />
      <FloralCorner className="left-0 top-10 h-24 w-24 sm:h-32 sm:w-32" />
      <FloralCorner className="right-0 top-10 h-24 w-24 sm:h-32 sm:w-32" flip />

      <div className="site-container relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <Reveal direction="left" className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary sm:text-xl">{contactHero.label}</p>
          <h2 className="mt-4 text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.05] text-black">
            {contactHero.title}{' '}
            <span className="block font-script text-[1.1em] font-normal text-primary">
              {contactHero.titleAccent}
            </span>
          </h2>
          <p className="mt-4 text-sm font-medium leading-7 text-text-muted sm:text-base sm:leading-8">
            {contactHero.description}
          </p>
        </Reveal>

        <Reveal direction="right">
          <PhotoCard
            src={contactHero.image}
            alt={contactHero.imageAlt}
            cornerClass="rounded-[32px] rounded-bl-[clamp(56px,10vw,120px)]"
            slabClass="-translate-x-3 translate-y-3"
          />
        </Reveal>
      </div>
    </section>
  );
}

function ContactDetails() {
  return (
    <section className="bg-white pb-10 sm:pb-14">
      <div className="site-container grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {contactInfoCards.map((card, index) => (
          <Reveal key={card.id} delay={index * 90}>
            <ContactInfoCard icon={card.icon} title={card.title} lines={card.lines} links={card.links} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section className="bg-white pb-10 sm:pb-14">
      <div className="site-container">
        {/* No tilt here: rotating an iframe would throw off map dragging and taps. */}
        <Reveal>
          <div className="overflow-hidden rounded-[28px] border border-primary/15 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">
              <div className="flex flex-col gap-5 border-b border-primary/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black">{mapDetails.title}</h3>
                    <p className="mt-3 text-sm font-medium leading-6 text-text-muted">{mapDetails.address}</p>
                  </div>
                </div>
                <a
                  href={mapDetails.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-3d btn-3d-outline inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold sm:self-start lg:self-stretch"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m22 2-7 20-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                  Get Directions
                </a>
              </div>

              <div className="relative min-h-[280px] sm:min-h-[360px]">
                <iframe
                  title="Winsome Makeover location map"
                  className="absolute inset-0 h-full w-full border-0"
                  src={mapDetails.embedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-y border-primary/10 bg-primary-soft/40 py-8 sm:py-10">
      <div className="site-container grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
        {trustIndicators.map((item, index) => (
          <Reveal key={item.id} delay={index * 80}>
            <Tilt3D
              max={12}
              className="card-lift relative flex h-full items-center gap-2.5 rounded-2xl border border-white bg-white p-3 shadow-[0_10px_26px_rgba(233,30,140,0.08)] sm:gap-4 sm:p-4"
            >
              <div className="depth-2 grid h-10 w-10 shrink-0 place-items-center text-primary sm:h-14 sm:w-14">
                <FeatureIcon name={item.icon === 'clients' ? 'care' : item.icon} />
              </div>
              <p className="depth-1 min-w-0 text-xs font-bold leading-tight text-black sm:text-sm">
                {item.title}
                <br />
                {item.subtitle}
              </p>
            </Tilt3D>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function Contact({ onBookAppointment }) {
  return (
    <div id="contact" className="scroll-mt-24 bg-white">
      <ContactHero />
      <ContactDetails />
      <MapSection />
      <TrustBar />
      <SectionCta
        className="pb-16 pt-10"
        script={contactCta.scriptTitle}
        description={contactCta.title}
        onBook={onBookAppointment}
      />
    </div>
  );
}
