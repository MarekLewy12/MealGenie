import { useState, KeyboardEvent } from "react";

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
      <label className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</label>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 transition focus-within:border-indigo-500 focus-within:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:focus-within:bg-slate-800">
        {/* Tagi */}
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-100 px-3 py-1 text-sm text-indigo-700 animate-fadeIn dark:border-indigo-500/30 dark:bg-indigo-900/50 dark:text-indigo-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-indigo-500 hover:text-indigo-700 focus:outline-none dark:text-indigo-400 dark:hover:text-white"
            >
              &times;
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
