"use client";

import { useState } from "react";

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="glass rounded-2xl">
            <button
              type="button"
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-medium text-white">{item.q}</span>
              <span className="ml-4 text-accent-2">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen ? <p className="px-5 pb-4 text-sm text-muted">{item.a}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
