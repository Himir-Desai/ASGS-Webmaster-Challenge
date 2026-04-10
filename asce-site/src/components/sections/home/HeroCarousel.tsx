import React, { useEffect, useId, useState } from "react";

type Slide = {
  src: string;
  alt: string;
};

const SLIDES: readonly Slide[] = [
  { src: "/images/hero-carousel-nov-21.jpg", alt: "Event highlight from Nov 21." },
  { src: "/images/hero-carousel-feb-20.jpg", alt: "Event highlight from Feb 20." },
  { src: "/images/hero-carousel-apr-03.png", alt: "Event highlight from Apr 03." },
] as const;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const controlsId = useId();
  const liveId = useId();
  const [paused, setPaused] = useState(false);
  const [hoverHint, setHoverHint] = useState<"prev" | "next" | null>(null);

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
            "h-[6px] w-[6px] cursor-pointer rounded-full bg-neutral-300 transition-[transform,background-color] duration-200 ease-out will-change-transform hover:scale-[1.6] hover:bg-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none sm:h-2 sm:w-2",
            idx === safeActive ? "scale-[1.35] bg-neutral-900 hover:bg-neutral-900" : "",
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
        <div className="aspect-[16/9] w-full bg-neutral-100">
          <div
            className="flex h-full w-full will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.2,0.9,0.2,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(-${safeActive * 100}%)` }}
          >
          {SLIDES.map((slide, idx) => (
            <div key={slide.src} className="w-full shrink-0">
              <img
                src={slide.src}
                alt={slide.alt}
                className={[
                  "block h-full w-full object-cover object-center transition-transform duration-200 ease-out motion-reduce:transition-none",
                  idx === safeActive && hoverHint === "prev" ? "translate-x-2" : "",
                  idx === safeActive && hoverHint === "next" ? "-translate-x-2" : "",
                ].join(" ")}
                fetchPriority={idx === safeActive ? "high" : "auto"}
                decoding="async"
              />
            </div>
          ))}
          </div>
        </div>

        <button
          type="button"
          aria-controls={controlsId}
          aria-label="Previous slide"
          onClick={goPrev}
          onMouseEnter={() => setHoverHint("prev")}
          onMouseLeave={() => setHoverHint(null)}
          onFocus={() => setHoverHint("prev")}
          onBlur={() => setHoverHint(null)}
          className="group absolute left-2 top-1/2 flex h-[42px] w-[42px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-[opacity,transform,box-shadow] duration-200 ease-out hover:opacity-100 hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(0,0,0,0.28)] active:-translate-x-0.5 active:shadow-[0_6px_18px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none sm:left-4 sm:h-[62px] sm:w-[62px]"
        >
          <img
            src="/icons/prev.svg"
            alt=""
            aria-hidden="true"
            height={31}
            className="h-[31px] w-auto transition-transform duration-200 ease-out [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.55))] motion-reduce:transition-none group-active:-translate-x-0.5"
            draggable={false}
          />
        </button>

        <button
          type="button"
          aria-controls={controlsId}
          aria-label="Next slide"
          onClick={goNext}
          onMouseEnter={() => setHoverHint("next")}
          onMouseLeave={() => setHoverHint(null)}
          onFocus={() => setHoverHint("next")}
          onBlur={() => setHoverHint(null)}
          className="group absolute right-2 top-1/2 flex h-[42px] w-[42px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-[opacity,transform,box-shadow] duration-200 ease-out hover:opacity-100 hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(0,0,0,0.28)] active:translate-x-0.5 active:shadow-[0_6px_18px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none sm:right-4 sm:h-[62px] sm:w-[62px]"
        >
          <img
            src="/icons/next.svg"
            alt=""
            aria-hidden="true"
            height={31}
            className="h-[31px] w-auto transition-transform duration-200 ease-out [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.55))] motion-reduce:transition-none group-active:translate-x-0.5"
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

