import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState, useRef, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-secondary text-muted hover:text-foreground transition-component hover:-translate-y-[1px] active:scale-[0.95] focus:outline-none ring-2 ring-transparent focus-visible:ring-primary/20"
        title="Toggle theme"
      >
        {theme === "light" ? <Sun size={18} /> : theme === "dark" ? <Moon size={18} /> : <Monitor size={18} />}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-surface rounded-xl border border-border shadow-lg py-1 z-50 text-sm overflow-hidden transition-reveal origin-top-right">
          <button
            onClick={() => { setTheme("light"); setOpen(false); }}
            className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-surface-secondary transition-colors ${theme === "light" ? "text-primary font-medium" : "text-foreground"}`}
          >
            <Sun size={16} /> Light
          </button>
          <button
            onClick={() => { setTheme("dark"); setOpen(false); }}
            className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-surface-secondary transition-colors ${theme === "dark" ? "text-primary font-medium" : "text-foreground"}`}
          >
            <Moon size={16} /> Dark
          </button>
          <button
            onClick={() => { setTheme("system"); setOpen(false); }}
            className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-surface-secondary transition-colors ${theme === "system" ? "text-primary font-medium" : "text-foreground"}`}
          >
            <Monitor size={16} /> System
          </button>
        </div>
      )}
    </div>
  );
}
