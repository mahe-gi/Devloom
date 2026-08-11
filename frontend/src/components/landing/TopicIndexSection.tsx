import { useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Hash, Sparkles } from "lucide-react";

interface Topic {
  name: string;
  slug: string;
  count: string;
  desc: string;
}

const TOPICS: Topic[] = [
  { name: "React", slug: "react", count: "48+", desc: "State management, rendering hooks, architecture" },
  { name: "TypeScript", slug: "typescript", count: "36+", desc: "Type system patterns, generic design, safety" },
  { name: "Node.js", slug: "nodejs", count: "29+", desc: "Event loop internals, worker threads, async I/O" },
  { name: "System Design", slug: "system-design", count: "52+", desc: "Distributed systems, sharding, message queues" },
  { name: "PostgreSQL", slug: "postgresql", count: "21+", desc: "Query execution plans, indexing, transaction safety" },
  { name: "DevOps", slug: "devops", count: "18+", desc: "Docker optimization, CI/CD pipelines, Kubernetes" },
  { name: "Web Performance", slug: "performance", count: "24+", desc: "Core Web Vitals, memory leak debugging, bundles" },
  { name: "AI & ML", slug: "ai", count: "15+", desc: "LLM integrations, vector indexing, neural notes" },
  { name: "Security", slug: "security", count: "14+", desc: "Auth token security, zero trust, API hardening" },
];

export function TopicIndexSection() {
  const [hoveredTopic, setHoveredTopic] = useState<Topic | null>(TOPICS[0]);

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 border-b border-border/40 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="font-mono text-xs text-loom uppercase tracking-widest block mb-2">
            SECTION 04 // INDEXED DOMAINS
          </span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter text-foreground uppercase">
            EXPLORE BY KNOWLEDGE.
          </h2>
        </div>
        <p className="text-muted-foreground text-sm max-w-md font-medium">
          Filter technical articles across curated engineering domains. Every topic links to deep technical writeups and real examples.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Typographic Topic Cloud */}
        <div className="lg:col-span-8 flex flex-wrap gap-3">
          {TOPICS.map((topic) => {
            const isHovered = hoveredTopic?.slug === topic.slug;
            return (
              <Link
                key={topic.slug}
                to={`/tags/${topic.slug}`}
                onMouseEnter={() => setHoveredTopic(topic)}
                className={`px-5 py-3.5 rounded-2xl border text-sm md:text-lg font-bold font-sans transition-all duration-300 flex items-center gap-2.5 group cursor-pointer ${
                  isHovered
                    ? "bg-loom text-black border-loom shadow-xl scale-[1.03]"
                    : "bg-surface border-border/70 text-foreground hover:border-loom hover:text-loom"
                }`}
              >
                <Hash className={`w-4 h-4 ${isHovered ? "text-black" : "text-muted-foreground"}`} />
                <span>{topic.name}</span>
                <span
                  className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                    isHovered ? "bg-black/20 text-black" : "bg-surface-subtle text-muted-foreground"
                  }`}
                >
                  {topic.count}
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>

        {/* Dynamic Topic Inspector Box */}
        <div className="lg:col-span-4 bg-surface rounded-3xl p-8 border border-border/80 shadow-xl flex flex-col justify-between min-h-[280px]">
          {hoveredTopic ? (
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center font-mono text-xs text-loom uppercase">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    DOMAIN INSPECTOR
                  </span>
                  <span>{hoveredTopic.count} ARTICLES</span>
                </div>
                <h3 className="text-3xl font-black text-foreground font-sans tracking-tight">
                  {hoveredTopic.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {hoveredTopic.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-border/40 mt-6">
                <Link
                  to={`/tags/${hoveredTopic.slug}`}
                  className="w-full py-3 rounded-full bg-foreground text-background font-bold text-xs hover:bg-loom hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  <span>Browse {hoveredTopic.name} Tag</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-xs">
              HOVER OVER A DOMAIN TO INSPECT
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
