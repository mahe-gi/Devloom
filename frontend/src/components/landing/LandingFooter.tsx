import { Link } from "react-router";
import { ArrowUp } from "lucide-react";

export function LandingFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-20 px-6 md:px-12 max-w-7xl mx-auto z-10 font-sans border-t border-border/40">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-border/40">
        
        {/* Left Column: Brand Statement */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <span className="font-black text-2xl tracking-tighter text-foreground">DEVLOOM</span>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
            An editorial publishing platform for software engineers to document technical insights, post-mortems, and architectural discoveries.
          </p>
          <span className="font-mono text-xs text-loom font-semibold mt-2">
            IDEAS COMPILE HERE // PUBLISHING ENGINE
          </span>
        </div>

        {/* Navigation Column 1: Explore */}
        <div className="md:col-span-3 flex flex-col gap-3 font-sans text-sm">
          <span className="font-mono text-xs text-subtle-foreground uppercase tracking-widest block mb-1">
            EXPLORE
          </span>
          <Link to="/blogs" className="text-muted-foreground hover:text-foreground transition-colors">
            All Technical Articles
          </Link>
          <Link to="/tags/react" className="text-muted-foreground hover:text-foreground transition-colors">
            React Articles
          </Link>
          <Link to="/tags/system-design" className="text-muted-foreground hover:text-foreground transition-colors">
            System Design
          </Link>
          <Link to="/tags/typescript" className="text-muted-foreground hover:text-foreground transition-colors">
            TypeScript Deep Dives
          </Link>
        </div>

        {/* Navigation Column 2: Platform */}
        <div className="md:col-span-2 flex flex-col gap-3 font-sans text-sm">
          <span className="font-mono text-xs text-subtle-foreground uppercase tracking-widest block mb-1">
            PLATFORM
          </span>
          <Link to="/publish" className="text-muted-foreground hover:text-foreground transition-colors">
            Start Writing
          </Link>
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Author Dashboard
          </Link>
          <Link to="/signin" className="text-muted-foreground hover:text-foreground transition-colors">
            Sign In / Register
          </Link>
        </div>

        {/* Navigation Column 3: Back to top */}
        <div className="md:col-span-2 flex flex-col justify-between items-start md:items-end">
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full border border-border/80 text-muted-foreground hover:text-foreground hover:border-foreground transition-all cursor-pointer flex items-center justify-center"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Massive Typographic Footer Mark */}
      <div className="pt-12 flex flex-col items-center justify-center text-center">
        <h2 className="font-sans font-black text-foreground/15 text-[14vw] leading-none tracking-tighter select-none pointer-events-none">
          DEVLOOM
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-center w-full pt-6 font-mono text-xs text-subtle-foreground gap-2">
          <span>&copy; {new Date().getFullYear()} DEVLOOM. ALL RIGHTS RESERVED.</span>
          <span>MADE FOR ENGINEERS WHO THINK IN PUBLIC.</span>
        </div>
      </div>
    </footer>
  );
}
