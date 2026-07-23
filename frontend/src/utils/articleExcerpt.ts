export function generateExcerpt(content: string, length: number = 150): string {
  if (!content) return "";
  // Very naive stripping of basic markdown characters for excerpts
  const plainText = content
    .replace(/[#_*~`>]/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Links
    .replace(/\n+/g, " ")
    .trim();
    
  if (plainText.length <= length) return plainText;
  return plainText.substring(0, length).trim() + "...";
}
