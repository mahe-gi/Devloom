import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

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
      <div className="relative group rounded-xl overflow-hidden my-8 bg-[#1a1b26] border border-[#292e42] shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1f2335] border-b border-[#292e42]">
          <span className="text-xs font-mono text-[#a9b1d6]">{match[1]}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-[#a9b1d6] hover:text-white hover:bg-[#292e42] transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="overflow-x-auto p-5">
          <code className={`font-mono text-[14px] leading-relaxed text-[#c0caf5] ${className || ""}`} {...props}>
            {children}
          </code>
        </div>
      </div>
    );
  }

  if (!inline) {
    return (
       <div className="relative group rounded-xl overflow-hidden my-8 bg-[#1a1b26] border border-[#292e42] shadow-sm">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-[#a9b1d6] hover:text-white hover:bg-[#292e42] transition-colors bg-[#1f2335] border border-[#292e42]"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="overflow-x-auto p-5">
          <code className={`font-mono text-[14px] leading-relaxed text-[#c0caf5] ${className || ""}`} {...props}>
            {children}
          </code>
        </div>
      </div>
    )
  }

  return (
    <code className="font-mono text-[0.85em] bg-surface-secondary text-foreground-secondary px-1.5 py-0.5 rounded-md border border-border" {...props}>
      {children}
    </code>
  );
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-editorial max-w-none text-[17px] md:text-[19px] leading-[1.75] text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock as any,
          p: ({node, ...props}) => <p className="mb-7 last:mb-0 text-foreground-secondary" {...props} />,
          h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-foreground tracking-tight leading-tight" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-5 text-foreground tracking-tight leading-tight" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-foreground tracking-tight leading-snug" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-7 space-y-2.5 text-foreground-secondary" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-7 space-y-2.5 text-foreground-secondary" {...props} />,
          li: ({node, ...props}) => <li className="pl-1" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-primary pl-5 py-1 my-8 italic text-foreground-muted bg-surface-secondary/50 rounded-r-xl" {...props} />
          ),
          a: ({node, ...props}) => (
            <a className="text-primary hover:text-primary-hover font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all" {...props} />
          ),
          img: ({node, ...props}) => (
            <img className="rounded-xl border border-border w-full h-auto my-10 shadow-sm bg-surface-secondary" loading="lazy" {...props} />
          ),
          hr: ({node, ...props}) => <hr className="my-10 border-border" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
