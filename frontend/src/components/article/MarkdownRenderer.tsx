import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const text = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

    if (!inline && match) {
    return (
      <div className="not-prose relative group rounded-xl overflow-hidden my-6 bg-surface/50 border border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{match[1]}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface/80 transition-colors flex items-center gap-1.5"
            title="Copy code"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span className="text-xs font-medium">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="overflow-x-auto p-5">
          <code className={`font-mono text-[14px] leading-relaxed text-foreground block ${className || ""}`} {...props}>
            {children}
          </code>
        </div>
      </div>
    );
  }

  if (!inline) {
    return (
       <div className="not-prose relative group rounded-xl overflow-hidden my-6 bg-surface/50 border border-border shadow-sm">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface/80 transition-colors bg-surface border border-border flex items-center justify-center shadow-sm"
            title="Copy code"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <div className="overflow-x-auto p-5">
          <code className={`font-mono text-[14px] leading-relaxed text-foreground block ${className || ""}`} {...props}>
            {children}
          </code>
        </div>
      </div>
    )
  }

  return (
    <code className="font-mono text-[0.85em] bg-surface text-foreground px-1.5 py-0.5 rounded-md border border-border" {...props}>
      {children}
    </code>
  );
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-slate prose-lg max-w-none text-foreground leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock as any,
          p: ({node, ...props}) => <p className="mb-6 leading-relaxed" {...props} />,
          h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-bold mt-10 mb-5 text-foreground tracking-tight" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-semibold mt-8 mb-4 text-foreground tracking-tight border-b border-border pb-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl font-medium mt-6 mb-3 text-foreground tracking-tight" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2 marker:text-muted-foreground" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2 marker:text-muted-foreground font-medium" {...props} />,
          li: ({node, ...props}) => <li className="pl-1 text-foreground" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-border pl-4 py-1 my-6 italic text-muted-foreground" {...props} />
          ),
          a: ({node, ...props}) => (
            <a className="text-foreground hover:text-foreground/80 font-medium underline underline-offset-4 decoration-border hover:decoration-foreground/50 transition-colors" {...props} />
          ),
          img: ({node, ...props}) => (
            <figure className="my-12">
              <img className="rounded-2xl border border-border w-full h-auto shadow-sm bg-surface" loading="lazy" {...props} />
              {props.alt && <figcaption className="text-center text-sm text-muted-foreground mt-4 font-medium">{props.alt}</figcaption>}
            </figure>
          ),
          hr: ({node, ...props}) => <hr className="my-12 border-border" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
