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
    <div className="space-y-4">
      {label ? (
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </label>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {options.map((option) => {
          const active = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              aria-pressed={active}
              className={`group flex w-full items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold tracking-tight transition-all duration-200 ${
                active
                  ? "border-indigo-500/70 bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-200/70 ring-1 ring-white/20 dark:border-indigo-400/70 dark:shadow-indigo-900/50"
                  : "border-slate-200/80 bg-white/80 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-indigo-400/60"
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
