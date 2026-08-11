import { useState } from "react";
import { Terminal, Eye, FileCode2 } from "lucide-react";
import { MarkdownRenderer } from "../article/MarkdownRenderer";

const INITIAL_MARKDOWN = `# Debugging Memory Leaks in Node.js Event Loop

When operating high-throughput microservices, subtle memory leaks can accumulate quietly before triggering an \`OOM (Out Of Memory)\` process crash.

## The Diagnostic Trace

We isolated heap allocation dynamics by capturing heap snapshots before and after stress tests:

\`\`\`typescript
import { getHeapStatistics } from "v8";

export function logMemoryMetrics(stage: string): void {
  const mem = process.memoryUsage();
  console.log(\`[\${stage}] RSS: \${(mem.rss / 1024 / 1024).toFixed(2)} MB\`);
  console.log(\`[\${stage}] Heap Used: \${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB\`);
}
\`\`\`

> **Key Discovery:** Unbound event listeners registered inside request handlers caused closure retention across GC cycles.

### Resolution & Benchmarks

Replacing inline callbacks with named handlers reduced GC pause durations by **68%** under 10k req/sec load.`;

export function LiveEditorDemo() {
  const [markdown, setMarkdown] = useState(INITIAL_MARKDOWN);
  const [activeTab, setActiveTab] = useState<"split" | "editor" | "preview">("split");

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 border-b border-border/40 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="font-mono text-xs text-loom uppercase tracking-widest block mb-2">
            SECTION 07 // WRITING EXPERIENCE
          </span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter text-foreground uppercase">
            LIVE EDITOR DEMO.
          </h2>
        </div>
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-surface-subtle border border-border">
          <button
            onClick={() => setActiveTab("split")}
            className={`px-4 py-1.5 rounded-full font-mono text-xs transition-all cursor-pointer ${
              activeTab === "split" ? "bg-loom text-black font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            SPLIT VIEW
          </button>
          <button
            onClick={() => setActiveTab("editor")}
            className={`px-4 py-1.5 rounded-full font-mono text-xs transition-all cursor-pointer ${
              activeTab === "editor" ? "bg-loom text-black font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            MARKDOWN
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-1.5 rounded-full font-mono text-xs transition-all cursor-pointer ${
              activeTab === "preview" ? "bg-loom text-black font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            PREVIEW
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-3xl border border-border/80 overflow-hidden shadow-2xl">
        {/* Editor Top Bar */}
        <div className="px-6 py-4 border-b border-border/40 bg-surface-subtle/50 flex items-center justify-between font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-foreground font-semibold flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-loom" />
              article-draft.md
            </span>
          </div>
          <span className="text-loom font-bold">LIVE AUTOSAVED</span>
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          
          {/* Left Column: Interactive Raw Markdown Code */}
          {(activeTab === "split" || activeTab === "editor") && (
            <div
              className={`${
                activeTab === "split" ? "lg:col-span-6 border-r border-border/40" : "lg:col-span-12"
              } p-6 bg-surface font-mono text-xs text-foreground flex flex-col justify-between`}
            >
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-full min-h-[380px] bg-transparent focus:outline-none resize-none font-mono leading-relaxed text-muted-foreground focus:text-foreground transition-colors"
                spellCheck={false}
              />
              <div className="pt-4 border-t border-border/30 flex justify-between items-center text-[10px] text-subtle-foreground font-mono">
                <span className="flex items-center gap-1">
                  <FileCode2 className="w-3 h-3" />
                  MARKDOWN SYNTAX ACTIVE
                </span>
                <span>{markdown.length} CHARACTERS</span>
              </div>
            </div>
          )}

          {/* Right Column: Live Formatted Article Preview */}
          {(activeTab === "split" || activeTab === "preview") && (
            <div
              className={`${
                activeTab === "split" ? "lg:col-span-6" : "lg:col-span-12"
              } p-8 md:p-12 bg-background flex flex-col justify-between overflow-y-auto max-h-[540px]`}
            >
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-loom mb-4 uppercase">
                  <Eye className="w-3.5 h-3.5" />
                  <span>EDITORIAL PREVIEW</span>
                </div>
                <MarkdownRenderer content={markdown} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
