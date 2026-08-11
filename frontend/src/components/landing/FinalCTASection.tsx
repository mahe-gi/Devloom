import { Link } from "react-router";
import { Sparkles, ArrowRight } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto z-10 border-b border-border/40 font-sans text-center flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 font-mono text-xs text-loom font-bold uppercase tracking-widest mb-6">
        <Sparkles className="w-4 h-4" />
        <span>SECTION 15 // JOIN DEVLOOM</span>
      </div>

      <h2 className="font-sans font-black text-foreground tracking-tighter text-4xl sm:text-6xl md:text-8xl uppercase max-w-5xl leading-[0.95] mb-8">
        YOUR NEXT ARTICLE STARTS WITH <span className="font-serif italic font-light text-loom">ONE BUG.</span>
      </h2>

      <p className="text-muted-foreground text-lg md:text-2xl font-light max-w-2xl leading-relaxed mb-12">
        Publish your engineering deep dives on a platform that honors technical depth and editorial design.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
        <Link
          to="/publish"
          className="w-full sm:w-auto px-10 py-5 rounded-full bg-foreground text-background font-sans font-bold text-base hover:bg-loom hover:text-black transition-all shadow-2xl flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Start Writing Now</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          to="/blogs"
          className="w-full sm:w-auto px-10 py-5 rounded-full border border-border/80 text-foreground font-sans font-semibold text-base hover:border-foreground transition-all flex items-center justify-center"
        >
          <span>Browse All Stories</span>
        </Link>
      </div>
    </section>
  );
}
