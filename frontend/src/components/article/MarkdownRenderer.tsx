import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
            {copied ? <span className="text-xs">Copied!</span> : <span className="text-xs">Copy</span>}
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
            {copied ? <span className="text-xs">Copied!</span> : <span className="text-xs">Copy</span>}
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
    <code className="font-mono text-[0.85em] bg-gray-50 text-gray-700 px-1.5 py-0.5 rounded-md border border-gray-200" {...props}>
      {children}
    </code>
  );
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-editorial max-w-none text-[17px] md:text-[19px] leading-[1.75] text-gray-900">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock as any,
          p: ({node, ...props}) => <p className="mb-7 last:mb-0 text-gray-700" {...props} />,
          h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-gray-900 tracking-tight leading-tight" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-5 text-gray-900 tracking-tight leading-tight" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900 tracking-tight leading-snug" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-7 space-y-2.5 text-gray-700" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-7 space-y-2.5 text-gray-700" {...props} />,
          li: ({node, ...props}) => <li className="pl-1" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-blue-600 pl-5 py-1 my-8 italic text-gray-500 bg-gray-50/50 rounded-r-xl" {...props} />
          ),
          a: ({node, ...props}) => (
            <a className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4 decoration-blue-600/30 hover:decoration-blue-600 transition-all" {...props} />
          ),
          img: ({node, ...props}) => (
            <img className="rounded-xl border border-gray-200 w-full h-auto my-10 shadow-sm bg-gray-50" loading="lazy" {...props} />
          ),
          hr: ({node, ...props}) => <hr className="my-10 border-gray-200" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
