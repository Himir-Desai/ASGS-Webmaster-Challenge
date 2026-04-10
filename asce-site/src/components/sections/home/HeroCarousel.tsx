import React, { useEffect, useId, useState } from "react";

type Slide = {
  src: string;
  alt: string;
};

const SLIDES: readonly Slide[] = [
  { src: "/ASGS-Webmaster-Challenge/images/hero-carousel-nov-21.jpg", alt: "Event highlight from Nov 21." },
  { src: "/ASGS-Webmaster-Challenge/images/hero-carousel-feb-20.jpg", alt: "Event highlight from Feb 20." },
  { src: "/ASGS-Webmaster-Challenge/images/hero-carousel-apr-03.png", alt: "Event highlight from Apr 03." },
] as const;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const controlsId = useId();
  const liveId = useId();
  const [paused, setPaused] = useState(false);

  const SLIDES_LENGTH = SLIDES.length;
  const safeActive = ((active % SLIDES_LENGTH) + SLIDES_LENGTH) % SLIDES_LENGTH;
  const activeSlide = SLIDES[safeActive];

  const goPrev = () => setActive((v) => (v - 1 + SLIDES_LENGTH) % SLIDES_LENGTH);
  const goNext = () => setActive((v) => (v + 1) % SLIDES_LENGTH);

  useEffect(() => {
    if (paused || SLIDES_LENGTH <= 1) return;
    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % SLIDES_LENGTH);
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused, SLIDES_LENGTH]);

  const dots = (
    <div className="pointer-events-auto flex items-center gap-2">
      {Array.from({ length: SLIDES_LENGTH }, (_, idx) => (
        <button
          key={idx}
          type="button"
          aria-label={`Go to slide ${idx + 1} of ${SLIDES_LENGTH}`}
          aria-current={idx === safeActive ? "true" : undefined}
          onClick={() => setActive(idx)}
          className={[
            "h-[6px] w-[6px] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:h-2 sm:w-2",
            idx === safeActive ? "bg-black" : "bg-neutral-300",
          ].join(" ")}
        />
      ))}
    </div>
  );

  return (
    <section aria-label="Featured event photos" className="w-full">
      <div
        className="relative w-full overflow-hidden bg-neutral-100"
        role="region"
        aria-roledescription="carousel"
        aria-describedby={liveId}
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goPrev();
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            goNext();
          }
        }}
      >
        <div
          className="flex w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${safeActive * 100}%)` }}
        >
          {SLIDES.map((slide, idx) => (
            <div key={slide.src} className="w-full shrink-0">
              <img
                src={slide.src}
                alt={slide.alt}
                className="block h-auto w-full object-contain"
                fetchPriority={idx === safeActive ? "high" : "auto"}
                decoding="async"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-controls={controlsId}
          aria-label="Previous slide"
          onClick={goPrev}
          className="absolute left-0 top-1/2 flex h-[42px] w-[42px] -translate-y-1/2 items-center justify-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:h-[62px] sm:w-[62px]"
        >
          <img
            src="/ASGS-Webmaster-Challenge/icons/prev.svg"
            alt=""
            aria-hidden="true"
            height={31}
            className="h-[31px] w-auto [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.55))]"
            draggable={false}
          />
        </button>

        <button
          type="button"
          aria-controls={controlsId}
          aria-label="Next slide"
          onClick={goNext}
          className="absolute right-0 top-1/2 flex h-[42px] w-[42px] -translate-y-1/2 items-center justify-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:h-[62px] sm:w-[62px]"
        >
          <img
            src="/ASGS-Webmaster-Challenge/icons/next.svg"
            alt=""
            aria-hidden="true"
            height={31}
            className="h-[31px] w-auto [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.55))]"
            draggable={false}
          />
        </button>

        <div id={controlsId} className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 sm:block">
          {dots}
        </div>

        <span id={liveId} className="sr-only" aria-live="polite">
          {activeSlide ? `Slide ${safeActive + 1} of ${SLIDES_LENGTH}.` : ""}
        </span>
      </div>

      <div className="pointer-events-none mt-3 flex justify-center sm:hidden">{dots}</div>
    </section>
  );
}

