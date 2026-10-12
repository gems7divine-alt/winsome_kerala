import homeBackground from '../../assets/home.PNG';
import { featureItems } from '../../data/homeContent';
import Button from '../ui/Button';
import { FeatureIcon } from '../ui/Icon';

function FeatureList() {
  return (
    <div className="mt-9 grid max-w-2xl grid-cols-1 gap-5 text-black sm:grid-cols-3">
      {featureItems.map((item) => (
        <div key={item.title} className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center text-primary">
            <FeatureIcon name={item.icon} />
          </div>
          <p className="text-xs font-bold leading-tight sm:text-[13px]">
            {item.title}
            <br />
            {item.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Hero({ onBookAppointment, onExploreServices }) {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-white scroll-mt-24">
      <div
       className="absolute inset-0 bg-no-repeat bg-[length:auto_100%] opacity-100 bg-[position:80%_center] sm:bg-right sm:bg-[position:right_-30px] sm:bg-[length:auto_108%]"
        style={{ backgroundImage: `url(${homeBackground})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,0.9)_36%,rgba(255,255,255,0.18)_52%,rgba(255,255,255,0)_68%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1480px] items-center px-5 pb-10 pt-16 sm:px-8 lg:pt-20 lg:px-12">
        <div className="w-full max-w-[650px] text-left">
          <p className="mt-5 mb-6 text-lg font-bold uppercase tracking-[0.18em] leading-normal text-primary sm:text-2xl">Enhance Your Beauty +</p>
          <h1 className="max-w-[620px] text-4xl font-bold leading-[0.98] text-black sm:text-7xl lg:text-[88px]">
            Reveal Your
            <br />
            Natural{' '}
            <span className="align-baseline font-script text-[1.25em] font-normal leading-none text-primary">Glow</span>
          </h1>

         <p className="mt-5 max-w-[210px] text-base font-medium leading-8 text-black sm:max-w-[610px] sm:text-2xl sm:leading-10">
             Professional care and personalized beauty treatments to bring out the best in you. Because you deserve to feel beautiful, every day.
           </p>
          <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row">
            <Button className="self-start" onClick={onBookAppointment}>Book Appointment</Button>
            <Button variant="outline" className="self-start" onClick={onExploreServices}>
              Explore Services
            </Button>
          </div>

          <FeatureList />
        </div>
      </div>

    </section>
  );
}
