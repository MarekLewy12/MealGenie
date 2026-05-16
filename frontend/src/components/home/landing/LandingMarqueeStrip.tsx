const marqueeNotes = [
  { text: "mam ryż, jajka i zero planu", className: "bg-saffron-soft dark:bg-saffron/10" },
  { text: "nie chcę kolejnego makaronu", className: "bg-basil-soft dark:bg-basil/10" },
  { text: "25 minut, potem kapitulacja", className: "bg-accent-soft dark:bg-accent/10" },
  { text: "szkoda wyrzucić paprykę", className: "bg-bg-elevated dark:bg-white/5" },
  { text: "chcę coś ciepłego, ale bez kombinowania", className: "bg-basil-soft dark:bg-basil/10" },
  { text: "co zrobić z tą cukinią?", className: "bg-saffron-soft dark:bg-saffron/10" },
  { text: "jedna patelnia brzmi uczciwie", className: "bg-accent-soft dark:bg-accent/10" },
  { text: "coś sycącego, ale lekkiego", className: "bg-bg-elevated dark:bg-white/5" },
];

export function LandingMarqueeStrip() {
  const items = [...marqueeNotes, ...marqueeNotes];

  return (
    <div
      aria-hidden="true"
      className="marquee-fade-mask relative overflow-hidden border-y border-border bg-bg-sunken/40 py-4 dark:border-border-strong/50"
    >
      <div className="marquee-track py-1">
        {items.map((note, i) => (
          <span
            key={`${note.text}-${i}`}
            className={`inline-flex shrink-0 items-center rounded-full px-5 py-2 text-sm font-medium text-ink whitespace-nowrap ${note.className}`}
          >
            &ldquo;{note.text}&rdquo;
          </span>
        ))}
      </div>
    </div>
  );
}
