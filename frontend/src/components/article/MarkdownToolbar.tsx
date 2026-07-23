import { RefObject } from "react";
import { insertMarkdownFormatting } from "../../utils/markdownEditor";
import {
  Heading1,
  Bold,
  Italic,
  Quote,
  Code,
  SquareTerminal,
  Link,
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
    { label: "Heading", icon: <Heading1 className="w-4 h-4" />, action: () => handleInsert("### ", "", "Heading") },
    { label: "Bold", icon: <Bold className="w-4 h-4" />, action: () => handleInsert("**", "**", "bold text") },
    { label: "Italic", icon: <Italic className="w-4 h-4" />, action: () => handleInsert("*", "*", "italic text") },
    { label: "Quote", icon: <Quote className="w-4 h-4" />, action: () => handleInsert("> ", "", "quote") },
    { label: "Code", icon: <Code className="w-4 h-4" />, action: () => handleInsert("`", "`", "code") },
    { label: "Code Block", icon: <SquareTerminal className="w-4 h-4" />, action: () => handleInsert("```\n", "\n```", "code block") },
    { label: "Link", icon: <Link className="w-4 h-4" />, action: () => handleInsert("[", "](url)", "link text") },
    { label: "Bulleted List", icon: <List className="w-4 h-4" />, action: () => handleInsert("- ", "", "List item") },
    { label: "Numbered List", icon: <ListOrdered className="w-4 h-4" />, action: () => handleInsert("1. ", "", "List item") },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/20 border-b border-border/40 w-full transition-all">
      {toolbarButtons.map((btn, index) => (
        <button
          key={index}
          type="button"
          onClick={btn.action}
          disabled={disabled}
          title={btn.label}
          aria-label={btn.label}
          className="p-2 min-w-[32px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}
