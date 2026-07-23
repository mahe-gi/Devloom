import { RefObject } from "react";
import { insertMarkdownFormatting } from "../../utils/markdownEditor";
import { 
  Heading, 
  Bold, 
  Italic, 
  TextQuote, 
  Code, 
  SquareTerminal, 
  Link as LinkIcon, 
  List, 
  ListOrdered 
} from "lucide-react";

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
    { label: "Heading", icon: <Heading size={16} />, action: () => handleInsert("### ", "", "Heading") },
    { label: "Bold", icon: <Bold size={16} />, action: () => handleInsert("**", "**", "bold text") },
    { label: "Italic", icon: <Italic size={16} />, action: () => handleInsert("*", "*", "italic text") },
    { label: "Quote", icon: <TextQuote size={16} />, action: () => handleInsert("> ", "", "quote") },
    { label: "Code", icon: <Code size={16} />, action: () => handleInsert("`", "`", "code") },
    { label: "Code Block", icon: <SquareTerminal size={16} />, action: () => handleInsert("```\n", "\n```", "code block") },
    { label: "Link", icon: <LinkIcon size={16} />, action: () => handleInsert("[", "](url)", "link text") },
    { label: "Bulleted List", icon: <List size={16} />, action: () => handleInsert("- ", "", "List item") },
    { label: "Numbered List", icon: <ListOrdered size={16} />, action: () => handleInsert("1. ", "", "List item") },
  ];

  return (
    <div className="sticky top-16 z-10 flex flex-wrap items-center gap-1 p-1 bg-surface/80 backdrop-blur-md border border-border rounded-xl shadow-sm mb-4 w-max transition-all">
      {toolbarButtons.map((btn, index) => (
        <button
          key={index}
          type="button"
          onClick={btn.action}
          disabled={disabled}
          title={btn.label}
          aria-label={btn.label}
          className="p-2 text-muted hover:text-foreground hover:bg-surface-subtle rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}
