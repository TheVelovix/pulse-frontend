"use client";
import { useEffect, useRef, useState } from "react";
import { Globe, Lock } from "lucide-react";

export function Card({
  item,
  onDelete,
  onToggleVisibility,
}: {
  item: Project;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
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
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-medium text-sm truncate">{item.name}</h3>
          {item.isPublic && (
            <Globe size={12} className="text-accent shrink-0" />
          )}
        </div>
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
            className={`absolute -right-3.5 top-6.5 bg-card border border-white/10 rounded-md shadow-lg w-40 z-10 transition-all duration-200 ${!menuOpen ? "opacity-0 pointer-events-none scale-80" : "opacity-100 pointer-events-auto scale-100"}`}
          >
            <button
              onClick={e => {
                e.preventDefault();
                setMenuOpen(false);
                onToggleVisibility(item.id);
              }}
              className="w-full text-left text-sm text-text-muted hover:text-foreground hover:bg-white/5 transition-colors duration-200 px-3 py-2 rounded-t-md cursor-pointer flex items-center gap-2"
            >
              {item.isPublic ? (
                <>
                  <Lock size={13} />
                  Make private
                </>
              ) : (
                <>
                  <Globe size={13} />
                  Make public
                </>
              )}
            </button>
            <button
              onClick={e => {
                e.preventDefault();
                setMenuOpen(false);
                onDelete(item.id);
              }}
              className="w-full text-left text-sm text-destructive hover:bg-white/5 transition-colors duration-200 px-3 py-2 rounded-b-md cursor-pointer"
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
