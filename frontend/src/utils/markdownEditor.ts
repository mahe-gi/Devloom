export function insertMarkdownFormatting(
  textarea: HTMLTextAreaElement,
  prefix: string,
  suffix: string = "",
  placeholder: string = "text"
): { newText: string; newCursorPosition: number } {
  const { selectionStart, selectionEnd, value } = textarea;
  const selectedText = value.substring(selectionStart, selectionEnd);
  
  const insertText = selectedText || placeholder;
  const newText =
    value.substring(0, selectionStart) +
    prefix +
    insertText +
    suffix +
    value.substring(selectionEnd);
    
  const newCursorPosition = selectedText
    ? selectionStart + prefix.length + insertText.length + suffix.length
    : selectionStart + prefix.length;
    
  return { newText, newCursorPosition };
}
