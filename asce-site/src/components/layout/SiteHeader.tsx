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
      className="sticky top-0 z-[1001] h-[80px] bg-[#00588C] sm:z-40 sm:h-[135px]"
    >
      <div
        className="relative z-[1002] flex h-full w-full items-center justify-between gap-4 bg-[#00588C] px-[25px] sm:px-[50px]"
      >
        <a
          href="/ASGS-Webmaster-Challenge"
          className="inline-flex items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          aria-label="ASCE site home"
        >
          <span className="text-xl tracking-tight text-white">
            LOREM IPSUM
          </span>
        </a>

        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex items-center gap-[50px]">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative inline-flex py-2 text-base uppercase tracking-wider text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 after:absolute after:left-0 after:bottom-1 after:h-0.5 after:w-0 after:bg-current after:transition-[width] after:duration-300 after:ease-out hover:after:w-full"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="group relative h-6 w-6 rounded-md p-0 text-white sm:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls={mobileNavId}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span
            className={`absolute left-0 block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${mobileOpen ? "top-[11px] rotate-45" : "top-1"}`}
          />
          <span
            className={`absolute left-0 top-[11px] block h-0.5 w-6 bg-current transition-opacity duration-300 ease-in-out ${mobileOpen ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`absolute left-0 block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${mobileOpen ? "top-[11px] -rotate-45" : "top-[19px]"}`}
          />
        </button>
      </div>

      <div
        id={mobileNavId}
        role="dialog"
        aria-modal={mobileOpen}
        aria-hidden={!mobileOpen}
        aria-label="Site navigation"
        className={`fixed inset-0 z-[1000] flex min-h-dvh flex-col bg-[#00588C] transition-transform duration-300 ease-out sm:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full pointer-events-none"}`}
      >
        <div className="h-16 shrink-0" aria-hidden="true" />
        <nav
          aria-label="Mobile"
          className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-8"
        >
          <ul
            className="flex w-full max-w-sm flex-col items-center gap-1 text-center"
          >
            {NAV_ITEMS.map((item, i) => (
              <li key={item.href} className="w-full">
                <a
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{ transitionDelay: mobileOpen ? `${150 + i * 50}ms` : "0ms" }}
                  className={`relative inline-block px-6 py-4 text-lg uppercase tracking-widest text-white transition-[opacity,transform] duration-200 ease-out ${mobileOpen ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 after:absolute after:left-0 after:bottom-3 after:h-0.5 after:w-0 after:bg-current after:transition-[width] after:duration-300 after:ease-out hover:after:w-full`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
