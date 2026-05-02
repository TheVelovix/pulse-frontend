"use client";
import { useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";

const NAV = [
  { id: "introduction", label: "Introduction" },
  { id: "quick-start", label: "Quick Start" },
  { id: "authentication", label: "Authentication" },
  { id: "projects", label: "Projects" },
  { id: "analytics", label: "Analytics" },
  { id: "live-views", label: "Live Views" },
  { id: "custom-events", label: "Custom Events" },
  { id: "adblocker-bypass", label: "Bypassing Ad Blockers" },
];

export default function DocsMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg transition-colors duration-200 cursor-pointer"
        aria-label="Open navigation"
      >
        <ListIcon size={16} />
        Contents
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-white/10 z-50 flex flex-col p-6 gap-1 transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Documentation
          </p>
          <button
            onClick={() => setOpen(false)}
            className="text-text-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <XIcon size={18} />
          </button>
        </div>
        {NAV.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm text-text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors duration-150"
          >
            {item.label}
          </a>
        ))}
      </div>
    </>
  );
}
