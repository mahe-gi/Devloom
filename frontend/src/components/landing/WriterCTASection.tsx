import { Link } from "react-router";
import { Sparkles, ArrowRight } from "lucide-react";

export function WriterCTASection() {
  return (
    <section className="py-28 px-6 md:px-12 max-w-7xl mx-auto z-10 border-b border-border/40 font-sans">
      <div className="relative rounded-3xl bg-foreground text-background p-10 md:p-20 overflow-hidden shadow-2xl">
        {/* Subtle background loom glow */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-loom/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-start gap-8 max-w-4xl">
          <div className="flex items-center gap-2 font-mono text-xs text-loom font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-background/10 border border-background/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SECTION 09 // FOR ENGINEERS & AUTHORS</span>
          </div>

          <h2 className="font-serif font-light text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.04]">
            YOU ALREADY SOLVED SOMETHING TODAY. <br />
            <span className="font-sans font-black italic text-loom">WRITE IT DOWN.</span>
          </h2>

          <p className="text-background/80 text-lg md:text-2xl font-light leading-relaxed max-w-2xl">
            Somewhere across the world, another engineer is searching for the exact bug solution, architecture pattern, or post-mortem insight you just figured out.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/publish"
              className="px-8 py-4 rounded-full bg-loom text-black font-sans font-bold text-sm hover:bg-white transition-all flex items-center justify-center gap-2 shadow-xl group cursor-pointer"
            >
              <span>Start Writing on Devloom</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/blogs"
              className="px-8 py-4 rounded-full border border-background/30 text-background font-sans font-semibold text-sm hover:bg-background/10 transition-all flex items-center justify-center"
            >
              <span>Read Published Articles</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
