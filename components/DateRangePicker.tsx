"use client";
import { useState, useRef, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { CalendarDays } from "lucide-react";

type Props = {
  from?: string;
  to?: string;
  onChangeAction: (from: string, to: string) => void;
  onClearAction: () => void;
};

export default function DateRangePicker({
  from,
  to,
  onChangeAction,
  onClearAction,
}: Props) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(
    from && to ? { from: new Date(from), to: new Date(to) } : undefined,
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setVisible(false);
        setTimeout(() => setOpen(false), 150);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(selected: DateRange | undefined) {
    setRange(selected);
    if (
      selected?.from &&
      selected?.to &&
      selected.to.getTime() > selected.from.getTime()
    ) {
      onChangeAction(
        selected.from.toISOString().split("T")[0],
        selected.to.toISOString().split("T")[0],
      );
      setVisible(false);
      setTimeout(() => setOpen(false), 150);
    }
  }

  function handleClear() {
    setRange(undefined);
    onClearAction();
  }

  const label =
    range?.from && range?.to
      ? `${range.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${range.to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      : "Custom range";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          if (open) {
            setVisible(false);
            setTimeout(() => setOpen(false), 150);
          } else {
            setOpen(true);
            requestAnimationFrame(() => setVisible(true));
          }
        }}
        className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-md transition-colors duration-200 cursor-pointer ${
          range?.from
            ? "bg-accent text-white"
            : "bg-card border border-white/10 text-text-muted hover:text-foreground"
        }`}
      >
        <CalendarDays size={14} />
        {label}
      </button>

      {open && (
        <div
          className={`absolute right-0 top-10 z-50 bg-card border border-white/10 rounded-xl shadow-xl p-4 transition-all duration-150 ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            disabled={{ after: new Date() }}
          />
          <div
            className={`overflow-hidden transition-all duration-200 ${
              range?.from ? "max-h-8 opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
          >
            <button
              onClick={handleClear}
              className="w-full text-xs text-text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
