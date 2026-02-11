import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

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
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
        {label}
      </label>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 transition focus-within:border-indigo-500 focus-within:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:focus-within:bg-slate-800">
        {/* Tagi */}
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-800 animate-fadeIn sm:px-3 sm:py-1 dark:bg-indigo-500/20 dark:text-indigo-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-0.5 rounded-full p-1 hover:bg-indigo-200/50 dark:hover:bg-indigo-400/30"
              aria-label={`Usuń ${tag}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {/* Kontener Input + Przycisk */}
        <div className="flex flex-1 min-w-[150px] items-center">
          <input
            className="w-full flex-1 bg-transparent px-2 py-1 text-slate-900 outline-none placeholder:text-slate-500 dark:text-white"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Wpisz..."}
          />
          {inputValue.trim().length > 0 && (
            <button
              type="button"
              onClick={addTag}
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-500 active:scale-95"
            >
              +
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Wpisz i naciśnij <strong>Enter</strong> lub <strong>+</strong>
      </p>
    </div>
  );
}
