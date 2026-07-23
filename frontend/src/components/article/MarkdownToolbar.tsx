import { RefObject } from "react";
import { insertMarkdownFormatting } from "../../utils/markdownEditor";

interface MarkdownToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function MarkdownToolbar({ textareaRef, onChange, disabled }: MarkdownToolbarProps) {
  const handleInsert = (prefix: string, suffix: string = "", placeholder: string = "text") => {
    if (!textareaRef.current) return;
    const { newText, newCursorPosition } = insertMarkdownFormatting(
      textareaRef.current,
      prefix,
      suffix,
      placeholder
    );
    onChange(newText);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  const toolbarButtons = [
    { label: "Heading", icon: "H", action: () => handleInsert("### ", "", "Heading") },
    { label: "Bold", icon: "B", action: () => handleInsert("**", "**", "bold text") },
    { label: "Italic", icon: "I", action: () => handleInsert("*", "*", "italic text") },
    { label: "Quote", icon: "”", action: () => handleInsert("> ", "", "quote") },
    { label: "Code", icon: "</>", action: () => handleInsert("`", "`", "code") },
    { label: "Code Block", icon: "```", action: () => handleInsert("```\n", "\n```", "code block") },
    { label: "Link", icon: "Link", action: () => handleInsert("[", "](url)", "link text") },
    { label: "Bulleted List", icon: "•", action: () => handleInsert("- ", "", "List item") },
    { label: "Numbered List", icon: "1.", action: () => handleInsert("1. ", "", "List item") },
  ];

  return (
    <div className="sticky top-16 z-10 flex flex-wrap items-center gap-1 p-1 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-sm mb-4 w-max transition-all">
      {toolbarButtons.map((btn, index) => (
        <button
          key={index}
          type="button"
          onClick={btn.action}
          disabled={disabled}
          title={btn.label}
          aria-label={btn.label}
          className="p-2 min-w-[32px] text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}
