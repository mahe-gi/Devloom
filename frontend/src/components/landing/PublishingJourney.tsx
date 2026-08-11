import { useState } from "react";
import { BookOpen, Edit3, Code2, Share2, MessageSquare, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "LEARN & DEBUG",
    subtitle: "Turn hard-won solutions into documented knowledge",
    desc: "Every time you spend hours debugging a memory leak, refactoring a query, or understanding an API contract, you possess insights that other developers need.",
    icon: BookOpen,
    badge: "INPUT: EXPERIMENTAL NOTES",
  },
  {
    num: "02",
    title: "WRITE IN MARKDOWN",
    subtitle: "Distraction-free technical writing environment",
    desc: "Devloom provides a clean Markdown editor equipped with syntax toolbars, tag autocomplete, instant previewing, and smart draft autosaving.",
    icon: Edit3,
    badge: "SYNTAX: MARKDOWN + GFM",
  },
  {
    num: "03",
    title: "COMPILE & PREVIEW",
    subtitle: "First-class formatting for code blocks and diagrams",
    desc: "Code snippets are highlighted automatically with precise line numbers, custom tags, tables, blockquotes, and clean typography scales.",
    icon: Code2,
    badge: "OUTPUT: BEAUTIFUL FORMATTING",
  },
  {
    num: "04",
    title: "PUBLISH TO THE NETWORK",
    subtitle: "SEO-optimized edge indexing and instant URL slugs",
    desc: "When published, your article receives a canonical URL, Schema.org BlogPosting metadata, OpenGraph cards, and distribution across Devloom topic indices.",
    icon: Share2,
    badge: "INDEX: GLOBAL EDGE READY",
  },
  {
    num: "05",
    title: "DISCUSS IN PUBLIC",
    subtitle: "Engage directly with engineers around your work",
    desc: "Receive feedback, refine technical arguments, and build your author profile as a recognized voice in developer engineering.",
    icon: MessageSquare,
    badge: "COMMUNITY: ENGAGEMENT",
  },
];

export function PublishingJourney() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 border-b border-border/40 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="font-mono text-xs text-loom uppercase tracking-widest block mb-2">
            SECTION 06 // KNOWLEDGE LIFECYCLE
          </span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter text-foreground uppercase">
            HOW DEVLOOM WORKS.
          </h2>
        </div>
        <p className="text-muted-foreground text-sm max-w-md font-medium">
          From a raw terminal terminal trace to a polished global article — experience the publishing lifecycle designed specifically for software engineers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Interactive Step Selector */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            const Icon = step.icon;
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  isActive
                    ? "bg-surface border-loom shadow-lg scale-[1.01]"
                    : "bg-surface-subtle/50 border-border/40 text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-xs font-bold ${isActive ? "text-loom" : "text-subtle-foreground"}`}>
                    {step.num}
                  </span>
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? "text-loom" : "text-muted-foreground"}`} />
                    <span className={`font-bold text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.title}
                    </span>
                  </div>
                </div>
                {isActive && <CheckCircle2 className="w-4 h-4 text-loom" />}
              </button>
            );
          })}
        </div>

        {/* Right Column: Step Visual & Detailed Storyboard */}
        <div className="lg:col-span-7 bg-surface rounded-3xl p-8 md:p-12 border border-border/80 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center font-mono text-xs text-loom border-b border-border/40 pb-4 mb-6">
            <span>STEP {STEPS[activeStep].num} // {STEPS[activeStep].title}</span>
            <span className="hidden sm:inline px-2.5 py-0.5 rounded bg-loom/10 border border-loom/20 font-bold">
              {STEPS[activeStep].badge}
            </span>
          </div>

          <div className="flex flex-col gap-6 my-auto">
            <h3 className="text-2xl md:text-4xl font-bold font-serif text-foreground tracking-tight">
              {STEPS[activeStep].subtitle}
            </h3>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {STEPS[activeStep].desc}
            </p>
          </div>

          <div className="pt-8 border-t border-border/40 mt-8 flex justify-between items-center font-mono text-xs text-subtle-foreground">
            <span>DEVLOOM PUBLISHING ENGINE</span>
            <span>STATUS: READY</span>
          </div>
        </div>
      </div>
    </section>
  );
}
