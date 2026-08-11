import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../../animation/reducedMotion";

export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(false);
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            onComplete?.();
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 15;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col justify-between p-8 md:p-16 font-mono text-xs uppercase tracking-widest pointer-events-none transition-opacity duration-500">
      <div className="flex justify-between items-center text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-extrabold text-foreground tracking-tighter text-sm">DEVLOOM</span>
        <span>INDEXING KNOWLEDGE // 0x7F</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 my-auto text-center">
        <div className="text-5xl md:text-8xl font-serif font-light text-foreground tracking-tight">
          {Math.min(100, progress).toString().padStart(3, "0")}%
        </div>
        <div className="w-48 h-0.5 bg-border relative overflow-hidden rounded-full">
          <div
            className="absolute top-0 left-0 h-full bg-loom transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-muted-foreground text-[10px]">
          INITIALIZING KNOWLEDGE THREADS...
        </span>
      </div>

      <div className="flex justify-between items-center text-muted-foreground border-t border-border/40 pt-4 text-[10px]">
        <span>PUBLISHING PLATFORM FOR DEVELOPERS</span>
        <span>LATENCY: OPTIMAL</span>
      </div>
    </div>
  );
}
