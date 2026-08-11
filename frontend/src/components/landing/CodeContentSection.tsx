import { Code2, Check, Copy } from "lucide-react";
import { useState } from "react";

const SAMPLE_CODE = `// Devloom Knowledge Compiler - Type Safe Pipeline
export interface ArticleNode {
  id: number;
  slug: string;
  title: string;
  author: { handle: string; avatarUrl?: string };
  tags: string[];
}

export async function compileArticleGraph(slug: string): Promise<ArticleNode> {
  const article = await db.blog.findUniqueOrThrow({ where: { slug } });
  return {
    id: article.id,
    slug: article.slug!,
    title: article.title,
    author: { handle: article.author.handle || "engineer" },
    tags: article.tags.map((t) => t.tag.name),
  };
}`;

export function CodeContentSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SAMPLE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 border-b border-border/40 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Bold Statement */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <span className="font-mono text-xs text-loom uppercase tracking-widest block font-sans">
            SECTION 08 // TECHNICAL FORMATTING
          </span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter text-foreground uppercase leading-[0.98]">
            CODE BELONGS <br />
            IN THE STORY.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-normal leading-relaxed">
            Generic publishing platforms treat code snippets as ugly plain-text blocks. Devloom treats source code as a primary editorial medium with syntax highlighting, copy shortcuts, and responsive typography.
          </p>

          <div className="flex flex-col gap-3 font-mono text-xs text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-loom" />
              <span>Full GFM (GitHub Flavored Markdown) support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-loom" />
              <span>TypeScript, Rust, Go, Python & SQL syntax support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-loom" />
              <span>Custom callout blockquotes & responsive data tables</span>
            </div>
          </div>
        </div>

        {/* Right Column: Code Showcase Card */}
        <div className="lg:col-span-7 bg-surface rounded-3xl border border-border/80 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-border/40 bg-surface-subtle/60 flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-2 text-foreground font-bold">
              <Code2 className="w-4 h-4 text-loom" />
              CompilerPipeline.ts
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs hover:text-foreground transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-loom" />
                  <span className="text-loom font-bold">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY CODE</span>
                </>
              )}
            </button>
          </div>

          <div className="p-6 md:p-8 font-mono text-xs overflow-x-auto bg-background text-foreground leading-relaxed">
            <pre>
              <code>
                <span className="text-purple-400">// Devloom Knowledge Compiler - Type Safe Pipeline</span>
                {"\n"}
                <span className="text-loom">export interface</span> <span className="text-yellow-300">ArticleNode</span> {"{\n"}
                {"  "}id: <span className="text-blue-400">number</span>;{"\n"}
                {"  "}slug: <span className="text-blue-400">string</span>;{"\n"}
                {"  "}title: <span className="text-blue-400">string</span>;{"\n"}
                {"  "}author: {"{"} handle: <span className="text-blue-400">string</span>; avatarUrl?: <span className="text-blue-400">string</span> {"}"};{"\n"}
                {"  "}tags: <span className="text-blue-400">string[]</span>;{"\n"}
                {"}\n\n"}
                <span className="text-loom">export async function</span> <span className="text-yellow-300">compileArticleGraph</span>(slug: <span className="text-blue-400">string</span>): <span className="text-yellow-300">Promise</span>&lt;<span className="text-yellow-300">ArticleNode</span>&gt; {"{\n"}
                {"  "}const article = <span className="text-loom">await</span> db.blog.<span className="text-blue-300">findUniqueOrThrow</span>({"{"} where: {"{"} slug {"}"} {"}"});{"\n"}
                {"  "}<span className="text-loom">return</span> {"{\n"}
                {"    "}id: article.id,{"\n"}
                {"    "}slug: article.slug!,{"\n"}
                {"    "}title: article.title,{"\n"}
                {"    "}author: {"{"} handle: article.author.handle || <span className="text-green-400">"engineer"</span> {"}"},{"\n"}
                {"    "}tags: article.tags.<span className="text-blue-300">map</span>((t) =&gt; t.tag.name),{"\n"}
                {"  "}{"};\n"}
                {"}"}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
