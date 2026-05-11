import { useId, useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  label: string;
  placeholder?: string;
};

export function TagInput({
  value = [],
  onChange,
  label,
  placeholder,
}: TagInputProps) {
  const generatedId = useId();
  const inputId = `${generatedId}-tag-input`;
  const hintId = `${generatedId}-tag-hint`;
  const accessibleLabel = label.trim() || placeholder || "Wpisz tag";
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (!value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className={label ? "text-sm font-semibold text-ink" : "sr-only"}
      >
        {accessibleLabel}
      </label>

      <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-xl border border-border bg-bg-sunken px-3 py-2 shadow-xs transition duration-fast ease-out focus-within:border-accent focus-within:bg-bg-elevated focus-within:ring-2 focus-within:ring-accent-soft">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-border-strong bg-bg-elevated py-1 pl-3 pr-1 text-sm font-semibold text-ink shadow-xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-ink-muted transition hover:bg-bordeaux/10 hover:text-bordeaux focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={`Usuń składnik: ${tag}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        <div className="flex min-w-[140px] flex-1 items-center">
          <input
            id={inputId}
            aria-describedby={hintId}
            className="min-h-10 w-full flex-1 bg-transparent px-2 py-1 text-sm text-ink outline-none placeholder:text-ink-disabled"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Wpisz..."}
          />
          {inputValue.trim().length > 0 && (
            <button
              type="button"
              onClick={addTag}
              className="ml-2 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-accent bg-accent text-ink-inverse shadow-accent transition hover:border-accent-hover hover:bg-accent-hover active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={`Dodaj składnik: ${inputValue.trim()}`}
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <p id={hintId} className="text-xs text-ink-soft">
        Wpisz i naciśnij <strong>Enter</strong> lub <strong>+</strong>
      </p>
    </div>
  );
}
