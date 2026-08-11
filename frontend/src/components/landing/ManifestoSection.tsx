import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../animation/reducedMotion";

const MANIFESTO_WORDS = [
  "THE",
  "BEST",
  "DEVELOPERS",
  "DON'T",
  "JUST",
  "BUILD.",
  "THEY",
  "DEBUG,",
  "DISCOVER,",
  "AND",
  "DOCUMENT",
  "WHAT",
  "THEY",
  "LEARN",
  "FOR",
  "OTHERS.",
];

export function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress from 0 to 1 as container scrolls through viewport
      const progress = Math.min(
        1,
        Math.max(0, (windowHeight - rect.top) / (windowHeight + rect.height / 2))
      );

      const words = containerRef.current.querySelectorAll(".manifesto-word");
      const activeCount = Math.floor(progress * words.length * 1.3);

      words.forEach((word, idx) => {
        if (idx <= activeCount) {
          (word as HTMLElement).style.opacity = "1";
          (word as HTMLElement).style.color = "var(--foreground)";
        } else {
          (word as HTMLElement).style.opacity = "0.2";
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-32 px-6 md:px-12 max-w-7xl mx-auto z-10 border-b border-border/40 font-serif"
    >
      <div className="flex flex-col gap-6">
        <span className="font-mono text-xs text-loom uppercase tracking-widest block font-sans">
          SECTION 03 // MANIFESTO
        </span>

        <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.05] flex flex-wrap gap-x-4 gap-y-2 max-w-6xl">
          {MANIFESTO_WORDS.map((word, idx) => (
            <span
              key={idx}
              className="manifesto-word transition-all duration-300 select-none opacity-20"
            >
              {word === "DOCUMENT" || word === "LEARN" ? (
                <span className="italic font-normal text-loom underline decoration-loom/30 underline-offset-8">
                  {word}
                </span>
              ) : (
                word
              )}
            </span>
          ))}
        </h2>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-12 gap-8 font-sans">
          <div className="md:col-span-6 font-mono text-xs text-muted-foreground uppercase tracking-wider">
            // PUBLISHING PHILOSOPHY
          </div>
          <div className="md:col-span-6 text-muted-foreground text-base md:text-lg leading-relaxed">
            Devloom was engineered on a single premise: technical knowledge should be written with precision, visual clarity, and editorial elegance. No algorithmic noise. Just code and thinking in motion.
          </div>
        </div>
      </div>
    </section>
  );
}
