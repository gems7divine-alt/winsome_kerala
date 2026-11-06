import useInView from './useInView';

export default function Reveal({ children, direction = 'up', delay = 0, className = '' }) {
  const { ref, visible } = useInView();

  return (
    <div
      ref={ref}
      data-reveal={direction}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  );
}
