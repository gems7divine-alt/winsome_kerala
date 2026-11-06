import ScrollDepth from './ScrollDepth';
import Tilt3D from './Tilt3D';

/** Rounded photo floating in front of a pink slab that sits further back in 3D space. */
export default function PhotoCard({ src, alt, cornerClass, slabClass = 'translate-x-3 translate-y-3' }) {
  return (
    <ScrollDepth>
    <Tilt3D max={7} sheen={false} className="relative mx-auto w-full max-w-[620px] lg:max-w-none">
      <div
        className={`depth-back absolute inset-0 bg-gradient-to-br from-primary to-primary-dark opacity-90 ${slabClass} ${cornerClass}`}
        aria-hidden="true"
      />
      <div className={`relative overflow-hidden border-4 border-white shadow-[0_24px_60px_rgba(143,15,85,0.2)] ${cornerClass}`}>
        <img className="aspect-[16/10] w-full object-cover" src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </Tilt3D>
    </ScrollDepth>
  );
}
