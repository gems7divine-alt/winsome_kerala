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

const featureImageLabels = {
  shield: 'Expert Professionals',
  products: 'Premium Products',
  care: 'Personalized Care',
};

export function FeatureIcon({ name, className = iconClasses }) {
  const featureImages = {
    shield: shieldImage,
    products: cosmeticImage,
    care: girlImage,
  };

  if (featureImages[name]) {
    return (
      <img
        className="h-full w-full object-contain"
        src={featureImages[name]}
        alt={featureImageLabels[name]}
        aria-hidden="false"
      />
    );
  }

  if (name === 'lotus') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
        <path d="M16 3.6c2.6 3.1 4 6.5 4 10 0 3.9-1.6 7.3-4 9.5-2.4-2.2-4-5.6-4-9.5 0-3.5 1.4-6.9 4-10Z" />
        <path d="M6.5 10.1c3.4.5 6.3 2.2 8.2 5 1.6 2.3 2.4 5.1 2.1 7.9-3.4-.5-6.3-2.2-8.2-5-1.6-2.3-2.4-5.1-2.1-7.9Z" />
        <path d="M25.5 10.1c.3 2.8-.5 5.6-2.1 7.9-1.9 2.8-4.8 4.5-8.2 5-.3-2.8.5-5.6 2.1-7.9 1.9-2.8 4.8-4.5 8.2-5Z" />
        <path
          d="M4.6 20.6c2 2.4 4.8 3.9 7.8 4.2M27.4 20.6c-2 2.4-4.8 3.9-7.8 4.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === 'people') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
        <circle cx="12.4" cy="10.6" r="4.5" />
        <path d="M4.2 25c.8-4.5 4.1-7.4 8.2-7.4s7.4 2.9 8.2 7.4c.2.9-.6 1.6-1.4 1.6H5.6c-.8 0-1.6-.7-1.4-1.6Z" />
        <circle cx="23.6" cy="9.4" r="3.4" />
        <path d="M22.8 15.5c3.2.1 5.9 2.4 6.5 5.6.2.9-.6 1.7-1.5 1.7h-6.7c.3-2.6-.5-5.1-2.2-7 1.2-.2 2.5-.3 3.9-.3Z" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 3 27 7v7c0 7-4.7 11.8-11 15C9.7 25.8 5 21 5 14V7l11-4Z" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="m12 16 3 3 6-7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
