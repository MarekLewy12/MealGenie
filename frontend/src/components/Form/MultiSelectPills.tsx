type MultiSelectPillsProps = {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  label: string;
};

export function MultiSelectPills({ options, value, onChange, label }: MultiSelectPillsProps) {
  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-200">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                active
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md shadow-indigo-900/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {option.replace('_', ' ')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
