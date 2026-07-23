import { useState, KeyboardEvent } from "react";


interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

export function TagInput({ tags, onChange, disabled }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const newTag = inputValue.trim();
    if (!newTag) return;

    if (newTag.length > 30) {
      setError("Tag must be 30 characters or fewer");
      return;
    }

    if (tags.length >= 5) {
      setError("Maximum 5 tags allowed");
      return;
    }

    const normalizedTag = newTag.toLowerCase();
    if (tags.some((t) => t.toLowerCase() === normalizedTag)) {
      setError("Tag already exists");
      return;
    }

    onChange([...tags, newTag]);
    setInputValue("");
    setError(null);
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
    if (tags.length <= 5) {
      setError(null);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-900"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(idx)}
                className="hover:text-red-500 focus:outline-none"
              >
                &times;
              </button>
            )}
          </span>
        ))}
        {tags.length < 5 && (
          <input
            id="tag-input"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            disabled={disabled}
            placeholder={tags.length === 0 ? "Add tags (e.g. Technology, Design) and press Enter" : "Add a tag..."}
            className="flex-1 min-w-[150px] bg-transparent outline-none border-none focus:ring-0 text-gray-900 placeholder:text-gray-600 py-1"
          />
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1 font-medium">{error}</p>}
      <p className="text-xs text-gray-600 mt-1.5">Up to 5 tags, separated by comma or Enter.</p>
    </div>
  );
}
