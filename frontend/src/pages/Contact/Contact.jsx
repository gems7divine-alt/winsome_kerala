import {
  contactCta,
  contactHero,
  contactInfoCards,
  mapDetails,
  trustIndicators,
} from '../../data/contactContent';
import { ArrowRightIcon, CalendarIcon, FeatureIcon } from '../../components/ui/Icon';
import ContactInfoCard from './ContactInfoCard';

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

function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft via-white to-white pt-16 pb-10 sm:pt-20 sm:pb-14">
      <FloralCorner className="left-0 top-10 h-24 w-24 sm:h-32 sm:w-32" />
      <FloralCorner className="right-0 top-10 h-24 w-24 sm:h-32 sm:w-32" flip />

      <div className="relative z-10 mx-auto grid max-w-[1480px] grid-cols-1 items-center gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-12">
        <div className="max-w-xl">
          <p className="text-base font-bold uppercase tracking-[0.22em] text-primary sm:text-xl">{contactHero.label}</p>
          <h2 className="mt-4 text-4xl font-bold leading-[1.05] text-black sm:text-5xl md:text-6xl">
            {contactHero.title}{' '}
            <span className="block font-script text-[1.1em] font-normal text-primary sm:inline sm:text-[1.15em]">
              {contactHero.titleAccent}
            </span>
          </h2>
          <p className="mt-4 text-sm font-medium leading-7 text-text-muted sm:text-base sm:leading-8">
            {contactHero.description}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[620px] lg:max-w-none">
          <div className="overflow-hidden rounded-[40px] rounded-bl-[120px] border-4 border-white shadow-[0_24px_60px_rgba(233,30,140,0.12)]">
            <img
              className="h-[260px] w-full object-cover sm:h-[320px] lg:h-[360px]"
              src={contactHero.image}
              alt={contactHero.imageAlt}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactDetails() {
  return (
    <section className="bg-white pb-10 sm:pb-14">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {contactInfoCards.map((card) => (
            <ContactInfoCard
              key={card.id}
              icon={card.icon}
              title={card.title}
              lines={card.lines}
              links={card.links}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section className="bg-white pb-10 sm:pb-14">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="overflow-hidden rounded-[28px] border border-primary/15 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">
            <div className="border-b border-primary/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
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
            </div>

            <div className="relative min-h-[280px] sm:min-h-[340px]">
              <iframe
                title="Winsome Makeover location map"
                className="absolute inset-0 h-full w-full border-0"
                src={mapDetails.embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                href={mapDetails.directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition hover:bg-primary-soft"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m22 2-7 20-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-y border-primary/10 bg-primary-soft/40 py-8 sm:py-10">
      <div className="mx-auto grid max-w-[1480px] grid-cols-2 gap-6 px-5 sm:px-8 md:grid-cols-4 lg:px-12">
        {trustIndicators.map((item) => (
          <div key={item.id} className="flex items-center gap-3 sm:gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center text-primary sm:h-14 sm:w-14">
              <FeatureIcon name={item.icon === 'clients' ? 'care' : item.icon} />
            </div>
            <p className="text-xs font-bold leading-tight text-black sm:text-sm">
              {item.title}
              <br />
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactCta({ onBookAppointment }) {
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
              <p className="font-script text-xl text-white sm:text-2xl">{contactCta.scriptTitle}</p>
              <p className="mt-1 max-w-xl text-sm font-medium leading-6 text-white/95 sm:text-base">
                {contactCta.title}
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

export default function Contact({ onBookAppointment }) {
  return (
    <div id="contact" className="scroll-mt-24 bg-white">
      <ContactHero />
      <ContactDetails />
      <MapSection />
      <TrustBar />
      <ContactCta onBookAppointment={onBookAppointment} />
    </div>
  );
}
