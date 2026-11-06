import { useMemo, useState } from 'react';
import { services, servicePriceCategories } from '../../data/servicesContent';
import { Aurora, FloatingOrbs, FloralCorner, Sparkle } from '../../components/ui/Decor';
import Reveal from '../../components/ui/Reveal';
import SectionCta from '../../components/ui/SectionCta';
import ServiceCard from './ServiceCard';
import ServicePriceModal from './ServicePriceModal';

function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft via-white to-white pb-10 pt-16 sm:pb-14 sm:pt-20">
      <Aurora />
      <FloatingOrbs />
      <FloralCorner className="left-0 top-16 h-24 w-24 sm:h-32 sm:w-32" />
      <FloralCorner className="right-0 top-16 h-24 w-24 sm:h-32 sm:w-32" flip />
      <Sparkle className="left-[18%] top-[38%] hidden sm:block" />
      <Sparkle className="right-[22%] top-[42%] hidden sm:block" />
      <Sparkle className="left-[42%] top-6 opacity-70" />

      <Reveal className="site-container relative z-10 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary sm:text-xl">Our Services</p>
        <h1 className="mt-4 text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.05] text-black">
          Beauty Solutions{' '}
          <span className="block font-script text-[1.15em] font-normal text-primary xl:inline xl:text-[1.2em]">
            Just For You
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-text-muted sm:text-base sm:leading-8">
          Discover our wide range of beauty and grooming services designed to bring out the best in you.
        </p>
      </Reveal>
    </section>
  );
}

function ServicesGrid({ onBookAppointment }) {
  const [selectedId, setSelectedId] = useState(null);

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedId) || null,
    [selectedId],
  );

  const selectedCategories = useMemo(() => {
    if (!selectedService?.priceCategoryIds?.length) return [];
    return servicePriceCategories.filter((cat) =>
      selectedService.priceCategoryIds.includes(cat.id),
    );
  }, [selectedService]);

  return (
    <section className="bg-white pb-12 sm:pb-16">
      <div className="site-container">
        <p className="mb-5 text-center text-xs font-semibold text-text-muted sm:text-sm">
          Click any service to view detailed prices
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={(index % 5) * 70}>
              <ServiceCard
                title={service.title}
                subtitle={service.subtitle}
                image={service.image}
                price={service.price}
                onSelect={() => setSelectedId(service.id)}
                onBook={onBookAppointment}
              />
            </Reveal>
          ))}
        </div>
      </div>

      {selectedService && (
        <ServicePriceModal
          service={selectedService}
          categories={selectedCategories}
          onClose={() => setSelectedId(null)}
          onBook={onBookAppointment}
        />
      )}
    </section>
  );
}

export default function Services({ onBookAppointment }) {
  return (
    <div id="services" className="bg-white scroll-mt-24">
      <ServicesHero />
      <ServicesGrid onBookAppointment={onBookAppointment} />
      <SectionCta
        className="pb-12"
        script="Ready to Glow?"
        title="Book Your Appointment Today"
        description="Let our experts pamper you with the best care and treatments."
        onBook={onBookAppointment}
      />
    </div>
  );
}
