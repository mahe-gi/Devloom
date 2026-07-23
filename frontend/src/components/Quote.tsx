import { Quote as QuoteIcon } from "lucide-react";

export const Quote = ({ type }: { type: "signup" | "signin" }) => {
  return (
    <div className="h-screen flex flex-col justify-between bg-foreground p-12 lg:p-24 text-surface relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--color-primary),_transparent_40%)]" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] opacity-20 bg-[radial-gradient(circle_at_center,_var(--color-accent),_transparent_50%)] blur-3xl" />
      
      <div className="relative z-10">
        <h1 className="text-2xl font-bold tracking-tight mb-2">101dev</h1>
        <p className="text-muted text-sm font-medium">The Editorial Platform</p>
      </div>
      
      <div className="relative z-10 max-w-xl">
        <QuoteIcon className="w-10 h-10 text-primary mb-6 opacity-80" />
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-8">
          {type === "signup"
            ? "A community of thinkers, writers, and dreamers. Join us in shaping the future of technical writing."
            : "Welcome back. Let's create something amazing today and inspire the world."}
        </h2>
        <div className="space-y-1">
          <h5 className="text-lg font-semibold tracking-tight text-surface">Ch Mahesh</h5>
          <p className="text-sm text-surface/60 font-medium">Founder, 101dev</p>
        </div>
      </div>
    </div>
  );
};
