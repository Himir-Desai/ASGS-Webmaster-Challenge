import React, { useState } from "react";

type Item = {
  title: string;
  body: string;
};

type Props = {
  items: Item[];
};

export default function Accordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-neutral-200 rounded-xl border-2 border-neutral-200">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="px-4 py-4">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex((prev) => (prev === idx ? null : idx))}
            >
              <span className="font-athiti text-[24px] font-semibold leading-[1.28] text-neutral-900">
                {item.title}
              </span>
              <span
                aria-hidden="true"
                className={`text-[28px] leading-none text-neutral-500 transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p
                  style={{ transitionDelay: isOpen ? "150ms" : "0ms" }}
                  className={`font-poppins mt-3 text-[18px] font-normal leading-[1.61] tracking-[-0.01em] text-neutral-700 transition-[opacity,transform] duration-300 ease-out ${isOpen ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
                >
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
