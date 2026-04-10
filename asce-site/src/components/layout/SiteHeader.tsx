import React, { useEffect, useId, useState } from "react";

const NAV_ITEMS = [
  { href: "/ASGS-Webmaster-Challenge", label: "Home" },
  { href: "/ASGS-Webmaster-Challenge/about", label: "About" },
  { href: "/ASGS-Webmaster-Challenge/contact", label: "Contact" },
  { href: "/ASGS-Webmaster-Challenge/work", label: "Work" },
] as const;

const SiteHeader = () => {
  const mobileNavId = useId();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 border-b border-neutral-200 sm:z-40 ${mobileOpen ? "z-[1000] bg-white" : "z-40 bg-white/90 backdrop-blur"}`}
    >
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 ${mobileOpen ? "relative z-[1001] bg-white" : ""}`}
      >
        <a
          href="/ASGS-Webmaster-Challenge"
          className="inline-flex items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          aria-label="ASCE site home"
        >
          <img
            src="/ASGS-Webmaster-Challenge/images/logo-black.svg"
            alt=""
            className="h-9 w-9 object-contain"
            width={36}
            height={36}
          />
          <span className="text-sm font-semibold tracking-tight text-neutral-900 sm:text-base">
            ASCE
          </span>
        </a>

        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wider text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-neutral-700 transition-colors hover:bg-neutral-100 sm:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls={mobileNavId}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <img
            src={mobileOpen ? "/ASGS-Webmaster-Challenge/icons/close.svg" : "/ASGS-Webmaster-Challenge/icons/hamburger.svg"}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 shrink-0"
            aria-hidden="true"
          />
        </button>
      </div>

      {mobileOpen && (
        <div
          id={mobileNavId}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-[1000] flex min-h-dvh flex-col bg-white sm:hidden"
        >
          <div className="h-16 shrink-0" aria-hidden="true" />
          <nav
            aria-label="Mobile"
            className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-8"
          >
            <ul className="flex w-full max-w-sm flex-col items-center gap-1 text-center">
              {NAV_ITEMS.map((item) => (
                <li key={item.href} className="w-full">
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-6 py-4 text-lg font-semibold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
