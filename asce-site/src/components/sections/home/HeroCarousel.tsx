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
  // Index within `trackSlides` (includes clones).
  // Start at 1 so the first visible slide is the real slide 0.
  const [active, setActive] = useState(1);
  const [animating, setAnimating] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Used for aria-controls / aria-describedby wiring (stable per mount).
  const controlsId = useId();
  const liveId = useId();

  const slidesLength = SLIDES.length;
  const trackSlides =
    slidesLength > 1 ? [SLIDES[slidesLength - 1], ...SLIDES, SLIDES[0]] : [...SLIDES];

  // Visible index mapped back to the real slides (0..slidesLength-1).
  const safeActive =
    slidesLength <= 1 ? 0 : ((active - 1 + slidesLength) % slidesLength);
  const activeSlide = SLIDES[safeActive];

  const canMove = slidesLength > 1 && !isTransitioning;
  const clampActive = (v: number) => Math.max(0, Math.min(slidesLength + 1, v));

  const moveTo = (next: number) => {
    if (!canMove) return;
    setIsTransitioning(true);
    setActive(clampActive(next));
  };

  // Navigation helpers (also used by keyboard handlers).
  const goPrev = () => moveTo(active - 1);
  const goNext = () => moveTo(active + 1);

  useEffect(() => {
    if (slidesLength <= 1) return;
    const id = window.setInterval(() => {
      setIsTransitioning((t) => {
        if (t) return t;
        setActive((v) => clampActive(v + 1));
        return true;
      });
    }, 4500);
    return () => window.clearInterval(id);
  }, [slidesLength]);

  useEffect(() => {
    if (animating) return;
    // Re-enable transitions on the next frame after a snap.
    const id = window.requestAnimationFrame(() => setAnimating(true));
    return () => window.cancelAnimationFrame(id);
  }, [animating]);

  useEffect(() => {
    // If transitions are disabled (motion-reduce) there may be no transitionend.
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setIsTransitioning(false);
  }, [active]);

  const snapTo = (nextActive: number) => {
    setAnimating(false);
    setActive(nextActive);
    setIsTransitioning(false);
  };

  const onTrackTransitionEnd = () => {
    if (slidesLength <= 1) return;
    if (active === 0) snapTo(slidesLength);
    else if (active === slidesLength + 1) snapTo(1);
    else setIsTransitioning(false);
  };

  const renderDots = () => (
    <div className="pointer-events-auto flex items-center gap-2">
      {Array.from({ length: slidesLength }, (_, idx) => (
        <button
          key={idx}
          type="button"
          aria-label={`Go to slide ${idx + 1} of ${slidesLength}`}
          aria-current={idx === safeActive ? "true" : undefined}
          onClick={() => moveTo(idx + 1)}
          className={[
            "h-[6px] w-[6px] cursor-pointer rounded-full bg-neutral-300 transition-[transform,background-color] duration-200 ease-out will-change-transform hover:scale-[1.6] hover:bg-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none sm:h-2 sm:w-2",
            idx === safeActive ? "scale-[1.35] bg-neutral-900 hover:bg-neutral-900" : "",
          ].join(" ")}
        />
      ))}
    </div>
  );

  const renderArrowButton = (direction: "prev" | "next") => (
    <button
      type="button"
      aria-controls={controlsId}
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      onClick={direction === "prev" ? goPrev : goNext}
      className={[
        "group absolute top-1/2 flex h-[42px] w-[42px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-[opacity,transform,box-shadow] duration-200 ease-out hover:opacity-100 hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none sm:h-[62px] sm:w-[62px]",
        direction === "prev"
          ? "left-2 active:-translate-x-0.5 active:shadow-[0_6px_18px_rgba(0,0,0,0.22)] sm:left-4"
          : "right-2 active:translate-x-0.5 active:shadow-[0_6px_18px_rgba(0,0,0,0.22)] sm:right-4",
      ].join(" ")}
    >
      <img
        src={`/ASGS-Webmaster-Challenge/icons/${direction}.svg`}
        aria-hidden="true"
        alt={direction === "prev" ? "Previous slide" : "Next slide"}
        height={31}
        className={[
          "h-[31px] w-auto transition-transform duration-200 ease-out [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.55))] motion-reduce:transition-none",
          direction === "prev" ? "group-active:-translate-x-0.5" : "group-active:translate-x-0.5",
        ].join(" ")}
        draggable={false}
      />
    </button>
  );

  return (
    <section aria-label="Featured event photos" className="w-full">
      <div
        className="relative w-full overflow-hidden bg-neutral-100"
        role="region"
        aria-roledescription="carousel"
        aria-describedby={liveId}
        tabIndex={0}
        onKeyDown={(e) => {
          // Keyboard support: Left/Right arrows to navigate.
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
            className={[
              "flex h-full w-full will-change-transform",
              animating ? "transition-transform duration-500 ease-[cubic-bezier(0.2,0.9,0.2,1)]" : "transition-none",
              "motion-reduce:transition-none",
            ].join(" ")}
            style={{ transform: `translateX(-${active * 100}%)` }}
            onTransitionEnd={onTrackTransitionEnd}
          >
            {trackSlides.map((slide) => (
              <div key={slide.src} className="w-full shrink-0">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="block h-full w-full object-cover object-center"
                  fetchPriority={slide.src === activeSlide?.src ? "high" : "auto"}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        {renderArrowButton("prev")}
        {renderArrowButton("next")}

        <div id={controlsId} className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 sm:block">
          {renderDots()}
        </div>

        <span id={liveId} className="sr-only" aria-live="polite">
          {activeSlide ? `Slide ${safeActive + 1} of ${slidesLength}.` : ""}
        </span>
      </div>

      <div className="pointer-events-none mt-3 flex justify-center sm:hidden">{renderDots()}</div>
    </section>
  );
}

