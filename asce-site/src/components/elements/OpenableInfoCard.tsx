import React, { useEffect, useId, useRef, useState } from "react";

type Props = {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt: string;
  summary: string;
  details: string;
};

export default function OpenableInfoCard({ title, subtitle, imageSrc, imageAlt, summary, details }: Props) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const dialogId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const detailParagraphs = details.split("\n").filter(Boolean);

  const close = () => {
    triggerRef.current?.focus();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    // Simple scroll lock (prevents background scroll + avoids layout shift).
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    const prevPaddingRight = root.style.paddingRight;
    root.style.overflow = "hidden";
    root.style.paddingRight = `${Math.max(0, window.innerWidth - root.clientWidth)}px`;
    return () => {
      root.style.overflow = prevOverflow;
      root.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
  }, [open]);

  return (
    <>
      <article className="card-interactive overflow-hidden rounded-xl border-2 border-neutral-200 bg-white">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full cursor-pointer text-left transition-transform duration-150 ease-out active:scale-[0.99] focus-visible:outline-none motion-reduce:transition-none"
          aria-haspopup="dialog"
          aria-controls={dialogId}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="card-image-zoom block aspect-[7/6] w-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />
          <div className="px-5 pb-6 pt-5 text-center">
            <h3 className="font-poppins text-[18px] font-medium leading-[1.28] tracking-normal text-neutral-900 sm:text-[20px]">
              {title}
            </h3>
            {subtitle ? (
              <p className="font-poppins mt-2 text-[16px] font-light leading-[1.28] tracking-normal text-neutral-600 sm:text-[18px]">
                {subtitle}
              </p>
            ) : null}
            <p className="font-poppins mt-4 text-pretty text-[13px] font-normal leading-[1.61] tracking-[-0.01em] text-neutral-700 sm:text-[14px]">
              {summary}
            </p>
          </div>
        </button>
      </article>

      <div
        className={`fixed inset-0 z-[4000] grid place-items-center bg-black/60 p-4 transition-opacity duration-250 ease-out motion-reduce:transition-none ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        role="presentation"
        {...(open ? {} : { inert: true })}
        onMouseDown={(e) => {
          if (!open) return;
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (!open) return;
          if ((e as React.KeyboardEvent).key === "Escape") close();
        }}
      >
        <div
          id={dialogId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`w-full max-w-5xl overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white shadow-xl will-change-transform transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.2,0.9,0.2,1)] motion-reduce:transition-none ${open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-[0.99]"}`}
          tabIndex={open ? 0 : -1}
        >
          <div className="max-h-[75dvh] overflow-auto md:overflow-hidden md:grid md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <div className="bg-white md:border-r md:border-neutral-200">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="block h-auto w-full object-contain object-center md:h-full md:max-h-[75dvh] md:object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="grid grid-rows-[auto_1fr] md:min-h-0">
              <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <h3 id={titleId} className="font-athiti text-[28px] font-semibold leading-[1.12] text-neutral-900">
                    {title}
                  </h3>
                  {subtitle ? (
                    <p className="font-poppins mt-1 text-[14px] font-normal leading-[1.4] text-neutral-600">
                      {subtitle}
                    </p>
                  ) : null}
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={close}
                  className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-neutral-700 transition-[background-color,color,box-shadow,transform] duration-150 ease-out hover:bg-neutral-100 hover:text-neutral-900 hover:shadow-md hover:shadow-black/15 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none"
                  aria-label="Close"
                >
                  <img src="/icons/close.svg" alt="" aria-hidden="true" className="h-5 w-5" draggable={false} />
                </button>
              </div>

              <div className="px-5 py-5 md:min-h-0 md:overflow-auto sm:px-6 sm:py-6">
                <p className="font-poppins text-pretty text-[15px] leading-[1.7] tracking-[-0.01em] text-neutral-800">
                  {summary}
                </p>

                <div className="mt-4 space-y-3">
                  {detailParagraphs.map((p, idx) => (
                    <p
                      key={idx}
                      className="font-poppins text-pretty text-[14px] leading-[1.7] tracking-[-0.01em] text-neutral-700"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

