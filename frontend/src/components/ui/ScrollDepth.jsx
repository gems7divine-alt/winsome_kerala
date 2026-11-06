import { useEffect, useRef } from 'react';

/**
 * Tips its contents backward or forward in 3D as they travel through the screen.
 * Driven by scrolling, so unlike mouse tilt it also works on phones.
 * The outer div is what gets measured: it never transforms, so the measurement
 * can't feed back into itself.
 */
export default function ScrollDepth({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const offset = (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.setProperty('--depth', Math.max(-1, Math.min(1, offset)).toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Only listen while on screen, so off-screen elements cost nothing.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
      } else {
        window.removeEventListener('scroll', onScroll);
      }
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      <div className="scroll-depth-inner">{children}</div>
    </div>
  );
}
