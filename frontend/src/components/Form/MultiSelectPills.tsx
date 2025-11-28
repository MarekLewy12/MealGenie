type PillOption = {
    value: string;
    label: string;
};

type MultiSelectPillsProps = {
  options: PillOption[]; // Dostępne opcje do wyboru
  value: string[]; // Zaznaczone wartości
  onChange: (next: string[]) => void; // zgłaszanie zmian do rodzica
  label: string; // przetłumaczona etykieta pola
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
          const active = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                active
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md shadow-indigo-900/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
