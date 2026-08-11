import { Link } from "react-router";
import { ArrowDownRight, Terminal, Sparkles } from "lucide-react";

const CODE_FRAGMENTS = [
  "useEffect(..., [])",
  "SELECT * FROM ideas",
  "git rebase --onto",
  "HTTP 429 Too Many Requests",
  "Promise.allSettled()",
  "Redis Cache Invalidation",
  "Distributed Consensus",
  "docker-compose.yml",
];

export function HeroSection({ onExploreClick }: { onExploreClick?: () => void }) {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto z-10 border-b border-border/40">
      
      {/* Top Metadata Badge */}
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-loom animate-ping" />
          <span className="text-foreground font-semibold">DEVLOOM / PUBLISHING PLATFORM</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>LATITUDE: GLOBAL</span>
          <span>SYSTEM: ONLINE</span>
        </div>
      </div>

      {/* Main Editorial Headline */}
      <div className="my-auto flex flex-col gap-8">
        <h1 className="font-sans font-black text-foreground tracking-tighter display-hero uppercase select-none leading-none">
          WHERE <br />
          <span className="font-serif font-normal italic text-loom">DEVELOPERS</span> <br />
          THINK OUT LOUD.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-4">
          <p className="md:col-span-7 font-sans text-lg md:text-2xl text-muted-foreground font-light leading-relaxed">
            A serious editorial publication platform for software engineers to publish deep dives, architectural notes, debugging stories, and technical discoveries.
          </p>

          <div className="md:col-span-5 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-end">
            <Link
              to="/publish"
              className="px-8 py-4 rounded-full bg-foreground text-background font-sans font-bold text-sm hover:bg-loom hover:text-black transition-all flex items-center justify-center gap-2 group shadow-lg"
            >
              <span>Start Writing</span>
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Link>
            <Link
              to="/blogs"
              className="px-8 py-4 rounded-full border border-border/80 hover:border-foreground text-foreground font-sans font-semibold text-sm transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore Network</span>
              <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Floating Category/Syntax Badges Cloud */}
        <div className="pt-10 flex flex-wrap gap-2.5 items-center font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5 mr-2 text-foreground font-semibold">
            <Terminal className="w-3.5 h-3.5 text-loom" />
            <span>TOPICS IN MOTION:</span>
          </span>
          {CODE_FRAGMENTS.map((fragment, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-full border border-border/60 bg-surface/40 backdrop-blur-sm hover:border-loom hover:text-foreground transition-all cursor-default select-none animate-float"
              style={{ animationDelay: `${idx * 0.7}s` }}
            >
              {fragment}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="flex justify-between items-center pt-12 font-mono text-xs text-subtle-foreground border-t border-border/20">
        <span>01 // LIVE STREAM</span>
        <button
          onClick={onExploreClick}
          className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer"
        >
          <span>SCROLL TO DISCOVER</span>
          <ArrowDownRight className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
