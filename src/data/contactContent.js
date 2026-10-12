import shopImage from '../assets/shop.png';

export const contactHero = {
  label: 'Contact Us',
  title: "We'd Love to",
  titleAccent: 'Hear From You!',
  description:
    'Whether you have a question, need assistance, or want to book an appointment, our team is here to help you with all your beauty and grooming needs.',
  image: shopImage,
  imageAlt: 'Winsome Makeover clinic reception area',
};

export const contactInfoCards = [
  {
    id: 'location',
    icon: 'location',
    title: 'Our Location',
    lines: ['Chemmanoor Junction, Kalpetta,', 'Wayanad, Kerala, India'],
    links: ['https://maps.app.goo.gl/ZkkY63xbxrP7aSjDA?g_st=aw'],
  },
  {
    id: 'phone',
    icon: 'phone',
    title: 'Call Us',
    lines: ['+91 6235 053 555', '+91 6235 053 222'],
    links: ['tel:+916235053555', 'tel:+916235053222'],
  },
  {
    id: 'email',
    icon: 'email',
    title: 'Email Us',
    lines: ['winsomemakeover@gmail.com'],
    links: ['mailto:winsomemakeover@gmail.com'],
  },
  {
    id: 'hours',
    icon: 'clock',
    title: 'Working Hours',
    lines: ['Mon - Sat: 9:30 AM - 7:30 PM', 'Sunday: 10:00 AM - 5:00 PM'],
  },
];

export const mapDetails = {
  title: 'Find Us Here',
  address: 'Chemmanoor Junction, Kalpetta, Wayanad, Kerala, India',
  embedUrl:
    'https://www.google.com/maps?q=Chemmanoor+Junction+Kalpetta+Wayanad+Kerala&output=embed',
  directionsUrl: 'https://maps.app.goo.gl/ZkkY63xbxrP7aSjDA?g_st=aw',
};

export const trustIndicators = [
  { id: 'hygiene', icon: 'shield', title: 'Hygienic', subtitle: 'Environment' },
  { id: 'safe', icon: 'care', title: 'Safe & Trusted', subtitle: 'Services' },
  { id: 'quality', icon: 'products', title: 'Quality You', subtitle: 'Can Trust' },
  { id: 'clients', icon: 'clients', title: 'Happy Clients,', subtitle: 'Beautiful Results' },
];

export const contactCta = {
  scriptTitle: "We're Here to Help You Glow!",
  title: 'Book your appointment today and experience the best in beauty & care.',
};
