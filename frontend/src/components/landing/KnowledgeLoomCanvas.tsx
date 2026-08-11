import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../animation/reducedMotion";

export function KnowledgeLoomCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Dynamic threads
    const threads = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      phase: Math.random() * Math.PI * 2,
    }));

    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const lineAlpha = isDark ? 0.08 : 0.06;
      const strokeColor = isDark ? "rgba(52, 211, 153," : "rgba(16, 185, 129,";

      // Draw weaving lines between nodes
      for (let i = 0; i < threads.length; i++) {
        const t1 = threads[i];
        t1.phase += 0.01;
        t1.x += t1.vx;
        t1.y += t1.vy + Math.sin(t1.phase) * 0.15;

        if (t1.x < 0) t1.x = width;
        if (t1.x > width) t1.x = 0;
        if (t1.y < 0) t1.y = height;
        if (t1.y > height) t1.y = 0;

        for (let j = i + 1; j < threads.length; j++) {
          const t2 = threads[j];
          const dx = t1.x - t2.x;
          const dy = t1.y - t2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 280) {
            ctx.beginPath();
            ctx.moveTo(t1.x, t1.y);
            // Curved loom weave
            const cx = (t1.x + t2.x) / 2 + Math.sin(scrollY * 0.001 + i) * 30;
            const cy = (t1.y + t2.y) / 2 + Math.cos(scrollY * 0.001 + j) * 30;
            ctx.quadraticCurveTo(cx, cy, t2.x, t2.y);
            ctx.strokeStyle = `${strokeColor} ${(1 - dist / 280) * lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw node dot
        ctx.beginPath();
        ctx.arc(t1.x, t1.y, t1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${strokeColor} ${isDark ? 0.3 : 0.25})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
