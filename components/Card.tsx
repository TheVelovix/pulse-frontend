"use client";
import { useEffect, useRef, useState } from "react";

export function Card({
  item,
  onDelete,
}: {
  item: CardItem;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-card border border-white/10 rounded-lg p-4 flex flex-col gap-3 relative transition-colors duration-200 hover:border-accent cursor-pointer">
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-sm">{item.name}</h3>
        <div className="relative" ref={menuRef}>
          <button
            onClick={e => {
              setMenuOpen(prev => !prev);
              e.preventDefault();
            }}
            className="text-text-muted hover:text-foreground transition-colors duration-200 px-1 rounded cursor-pointer"
            aria-label="Options"
          >
            &#8942;
          </button>
          <div
            className={`absolute -right-3.5 top-6.5 bg-card border border-white/10 rounded-md shadow-lg w-fit z-10 transition-all duration-200 ${!menuOpen ? "opacity-0 pointer-events-none scale-80" : "opacity-100 pointer-events-auto scale-100"}`}
          >
            <button
              onClick={e => {
                e.preventDefault();
                setMenuOpen(false);
                onDelete(item.id);
              }}
              className="w-full text-left text-sm text-destructive hover:bg-white/5 transition-colors duration-200 px-3 py-2 rounded-md cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <p className="text-xs text-text-muted">
        Created{" "}
        {new Date(item.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
    </div>
  );
}
