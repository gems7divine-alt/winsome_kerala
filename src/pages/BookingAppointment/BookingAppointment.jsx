import { useState } from 'react';
import emailjs from '@emailjs/browser';
import bookingBackground from '../../assets/booking.PNG';
import { ArrowRightIcon, FeatureIcon } from '../../components/ui/Icon';

const timeSlots = ['9:30 AM', '10:30 AM', '11:30 AM', '12:30 PM', '1:30 PM', '2:30 PM', '3:30 PM', '4:30 PM', '5:30 PM', '6:30 PM'];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getDateSlots() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
    return {
      key: date.toDateString(),
      day: dayNames[date.getDay()],
      date: String(date.getDate()),
      month: monthNames[date.getMonth()],
      year: date.getFullYear(),
    };
  });
}

const bookingFeatures = [
  {
    icon: 'shield',
    title: 'Expert Professionals',
    text: 'Trained and certified beauty experts',
  },
  {
    icon: 'products',
    title: 'Premium Products',
    text: 'We use only safe & premium products',
  },
  {
    icon: 'care',
    title: 'Personalized Care',
    text: 'Customized treatments for you',
  },
];

function Field({ number, label, placeholder, icon, type = 'text', value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex min-h-7 items-center gap-3 text-sm font-bold text-black sm:text-base">
        {icon && <span className="shrink-0">{icon}</span>}
        {number}. {label}
      </span>
      <input
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-black shadow-[0_6px_18px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-black/75 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:text-base"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        required
      />
    </label>
  );
}

function UserIcon() {
  return (
    <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 4 4.8 6.2c-.6.6-.8 1.5-.5 2.3 1.8 5.1 6.1 9.4 11.2 11.2.8.3 1.7.1 2.3-.5L20 17l-4.2-4.2-2 2c-1.9-1-3.6-2.7-4.6-4.6l2-2L7 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookingFeatureList() {
  return (
    <div className="mt-8 hidden space-y-5 sm:block">
      {bookingFeatures.map((feature) => (
        <div key={feature.title} className="flex items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/70 text-primary shadow-[0_12px_30px_rgba(233,30,140,0.08)] ring-1 ring-primary/5">
            <FeatureIcon name={feature.icon} />
          </div>
          <div>
            <p className="text-sm font-bold text-black">{feature.title}</p>
            <p className="mt-1 text-xs font-medium text-black/80 sm:text-sm">{feature.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AppointmentForm() {
  const [dateSlots] = useState(getDateSlots);
  const [selectedDate, setSelectedDate] = useState(dateSlots[0]?.key);
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');

    const slot = dateSlots.find((item) => item.key === selectedDate);
    const dateLabel = slot ? `${slot.day}, ${slot.date} ${slot.month} ${slot.year}` : selectedDate;

    const templateParams = {
      from_name: name,
      user_name: name,
      user_mobile: mobile,
      user_email: email,
      email: email,
      reply_to: email,
      selected_date: dateLabel,
      appointment_date: dateLabel,
      selected_time: selectedTime,
      appointment_time: selectedTime,
    };

    try {
      await emailjs.send('service_69m1iu2', 'template_eimdblu', templateParams, {
        publicKey: 'vk29Tc09XLpHOYXEz',
      });
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <form className="w-full max-w-[650px] rounded-[24px] bg-white/95 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.02] sm:p-5 lg:p-6" onSubmit={handleSubmit}>
      <div className="space-y-3">
        <Field number="1" label="Full Name" placeholder="Enter your full name" icon={<UserIcon />} value={name} onChange={(e) => setName(e.target.value)} />
        <Field number="2" label="Mobile Number" placeholder="Enter your mobile number" icon={<PhoneIcon />} type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        <Field number="3" label="Email Address" placeholder="Enter your email address" icon={null} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-bold text-black sm:text-base">4. Select Date</p>
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
          {dateSlots.map((slot) => (
            <div key={slot.key} className="text-center">
              <p className="mb-1 text-xs font-bold text-black">{slot.day}</p>
              <button
                className={[
                  'h-10 w-full rounded-xl border text-sm font-bold transition',
                  selectedDate === slot.key
                    ? 'border-primary bg-primary text-white shadow-[0_10px_22px_rgba(233,30,140,0.22)]'
                    : 'border-slate-200 bg-white text-black hover:border-primary',
                ].join(' ')}
                type="button"
                onClick={() => setSelectedDate(slot.key)}
              >
                <span className="block text-sm leading-tight">{slot.date}</span>
                <span className="block text-xs font-medium">{slot.month}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-bold text-black sm:text-base">5. Select Time</p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {timeSlots.map((time) => (
            <button
              key={time}
              className={[
                'h-8 rounded-lg border-2 text-xs font-semibold transition sm:text-sm',
                selectedTime === time
                  ? 'border-primary bg-primary text-white shadow-[0_10px_22px_rgba(233,30,140,0.24)]'
                  : 'border-primary/25 bg-white text-primary hover:border-primary',
              ].join(' ')}
              type="button"
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <button
        className="mt-4 flex h-11 w-full items-center justify-center gap-4 rounded-xl bg-primary text-base font-semibold text-white shadow-[0_16px_30px_rgba(233,30,140,0.24)] transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending...' : 'Send'}
        {status !== 'sending' && <ArrowRightIcon className="h-5 w-5" />}
      </button>
      {status === 'success' && (
        <p className="mt-3 text-center text-sm font-semibold text-green-600">
          Thank you! Your appointment request has been sent. We&apos;ll confirm with you soon.
        </p>
      )}
      {status === 'error' && (
        <p className="mt-3 text-center text-sm font-semibold text-red-600">
          Something went wrong. Please try again or call us directly.
        </p>
      )}
      <p className="mt-2 text-center text-xs font-medium tracking-wide text-black/85">Your information is safe with us.</p>
    </form>
  );
}

export default function BookingAppointment() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white pt-24">
      <div
        className="absolute inset-y-0 left-0 w-full bg-[position:left_-60px_bottom] bg-no-repeat bg-[length:auto_140%] opacity-100 sm:bg-[length:auto_100%] lg:w-[55%] lg:bg-[position:left_110px_bottom]"
        style={{ backgroundImage: `url(${bookingBackground})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,242,248,0.12)_0%,rgba(255,242,248,0.03)_43%,rgba(255,255,255,0.04)_63%,rgba(255,255,255,0.72)_80%,#fff_100%)]"
        aria-hidden="true"
      />
      <span className="absolute left-[47%] top-[22%] z-0 hidden h-4 w-4 text-primary lg:block" aria-hidden="true">+</span>
      <span className="absolute bottom-[11%] left-[21%] z-0 hidden h-4 w-4 text-primary lg:block" aria-hidden="true">+</span>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-[1480px] grid-cols-1 items-center gap-6 px-5 pb-4 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-12">
        <div className="max-w-[500px] pb-2 pt-2 lg:pb-0 lg:pt-0">
          <p className="mb-3 text-base font-bold uppercase tracking-[0.22em] text-primary sm:text-xl">Book Appointment</p>
          <h1 className="text-3xl font-bold leading-tight text-black sm:text-[40px] lg:text-[48px]">
            We&apos;re Here to
            <br />
            <span className="font-script text-[1.55em] font-normal leading-none text-primary">Glow</span>
          </h1>
          <p className="mt-3 max-w-md text-sm font-medium leading-6 text-black sm:text-base sm:leading-7">
            Fill in the details below and our <br /> team will connect with you soon.
          </p>
          <BookingFeatureList />
        </div>

        <AppointmentForm />
      </div>
    </section>
  );
}
