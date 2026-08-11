import { useCallback, useEffect, useRef, useState } from 'react';
import NavDots from './NavDots';

const SWIPE_THRESHOLD = 50;
const WHEEL_COOLDOWN_MS = 950;

export default function Carousel({ slides, labels }) {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const lockRef = useRef(false);
  const touchStartX = useRef(null);
  const count = slides.length;

  const goTo = useCallback(
    (next) => {
      setIndex(Math.max(0, Math.min(count - 1, next)));
    },
    [count],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(count - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, goTo, count]);

  useEffect(() => {
    const onWheel = (e) => {
      // Map vertical (and horizontal) wheel to slide changes
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 12) return;
      e.preventDefault();
      if (lockRef.current) return;
      lockRef.current = true;
      if (delta > 0) goNext();
      else goPrev();
      window.setTimeout(() => {
        lockRef.current = false;
      }, reducedMotion ? 100 : WHEEL_COOLDOWN_MS);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [goNext, goPrev, reducedMotion]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  return (
    <div
      className="carousel"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Portfolio"
    >
      <div
        className={`carousel__track${reducedMotion ? ' carousel__track--instant' : ''}`}
        style={{ transform: `translate3d(-${index * 100}vw, 0, 0)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.key}
            className="carousel__panel"
            aria-hidden={i !== index}
          >
            {slide.node}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="carousel__arrow carousel__arrow--prev"
        onClick={goPrev}
        disabled={index === 0}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        className="carousel__arrow carousel__arrow--next"
        onClick={goNext}
        disabled={index === count - 1}
        aria-label="Next slide"
      >
        ›
      </button>

      <NavDots
        count={count}
        index={index}
        labels={labels}
        onSelect={goTo}
      />
    </div>
  );
}
