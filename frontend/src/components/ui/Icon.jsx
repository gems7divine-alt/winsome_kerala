import shieldImage from '../../assets/shield.png';
import cosmeticImage from '../../assets/cosmetic.png';
import girlImage from '../../assets/girl.png';
const iconClasses = 'h-7 w-7 stroke-current';

export function CalendarIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 2v4M16 2v4M4 9h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M5 5h14a1 1 0 0 1 1 1v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="m9 14 2 2 4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRightIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FeatureIcon({ name }) {
  const featureImages = {
    shield: shieldImage,
    products: cosmeticImage,
    care: girlImage,
  };

  if (featureImages[name]) {
    const label = {
      shield: 'Expert Professionals',
      products: 'Premium Products',
      care: 'Personalized Care',
    }[name];
    return (
      <img
        className="h-full w-full object-contain"
        src={featureImages[name]}
        alt={label}
        aria-hidden="false"
      />
    );
  }

  return (
    <svg className={iconClasses} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 3 27 7v7c0 7-4.7 11.8-11 15C9.7 25.8 5 21 5 14V7l11-4Z" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="m12 16 3 3 6-7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
