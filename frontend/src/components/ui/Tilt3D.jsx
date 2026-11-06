import { useRef } from 'react';

const TILT_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/**
 * Leans its contents toward the mouse. Children marked .depth-1/2/3 float above
 * the surface. Writes CSS variables directly so moving the mouse never re-renders.
 * Touch devices simply get the resting element.
 */
export default function Tilt3D({ as: Tag = 'div', max = 10, sheen = true, className = '', children, ...rest }) {
  const ref = useRef(null);
  const rect = useRef(null);
  const frame = useRef(0);

  const handleEnter = (e) => {
    if (e.pointerType !== 'mouse' || !window.matchMedia(TILT_QUERY).matches) {
      rect.current = null;
      return;
    }
    // Measured once on entry: reading it per-move would chase the element's own rotation.
    rect.current = ref.current.getBoundingClientRect();
    ref.current.classList.add('is-tilting');
  };

  const handleMove = (e) => {
    const box = rect.current;
    if (!box) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const x = Math.min(1, Math.max(0, (clientX - box.left) / box.width));
      const y = Math.min(1, Math.max(0, (clientY - box.top) / box.height));
      const { style } = ref.current;
      style.setProperty('--ry', `${((x - 0.5) * 2 * max).toFixed(2)}deg`);
      style.setProperty('--rx', `${((0.5 - y) * 2 * max).toFixed(2)}deg`);
      style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    });
  };

  const handleLeave = () => {
    cancelAnimationFrame(frame.current);
    rect.current = null;
    const el = ref.current;
    el.classList.remove('is-tilting');
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <Tag
      ref={ref}
      className={`tilt ${className}`}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      {children}
      {sheen && <span className="tilt-sheen" aria-hidden="true" />}
    </Tag>
  );
}
