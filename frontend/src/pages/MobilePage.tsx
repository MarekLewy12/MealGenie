import { ArrowRight, ListChecks, MonitorCheck, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Logo } from "../components/Logo";
import { Badge, Card, HandwrittenKicker } from "../components/ui";
import { cn } from "../utils/cn";

type RoadmapNote = {
  title: string;
  body: string;
  icon: LucideIcon;
  tone: "accent" | "basil" | "saffron";
};

const roadmapNotes: RoadmapNote[] = [
  {
    title: "Dlaczego mobile ma sens",
    body:
      "MealGenie przydaje się tam, gdzie faktycznie gotujesz: przy blacie, w sklepie i wtedy, gdy telefon jest najbliżej ręki.",
    icon: Smartphone,
    tone: "accent",
  },
  {
    title: "Dlaczego najpierw web",
    body:
      "Najpierw dopracowuję generowanie, przepisy, profil, listę zakupów i asystenta w jednej stabilnej wersji.",
    icon: MonitorCheck,
    tone: "basil",
  },
  {
    title: "Co może wejść później",
    body:
      "Docelowo mobile może dostać szybki tryb gotowania, wygodną listę zakupów i dostęp do preferencji z wersji webowej.",
    icon: ListChecks,
    tone: "saffron",
  },
];

const roadmapIconClassName: Record<RoadmapNote["tone"], string> = {
  accent: "bg-accent-soft text-accent-deep",
  basil: "bg-basil-soft text-basil",
  saffron: "bg-saffron-soft text-ink",
};

export function MobilePage() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-bg px-4 py-12 text-ink sm:px-6 sm:py-16 lg:px-8">
      <section className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <Logo />

        <Card className="relative mt-10 w-full overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(232,111,69,0.10),transparent_34%),radial-gradient(circle_at_86%_12%,rgba(47,138,95,0.10),transparent_38%)]" />

          <div className="relative">
            <Badge variant="saffron" className="text-ink">
              Aplikacja mobilna jest w planach
            </Badge>

            <HandwrittenKicker className="mt-6">
              najpierw dopracowuję web
            </HandwrittenKicker>

            <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-pill border border-border bg-bg-sunken text-accent shadow-xs">
              <Smartphone className="h-8 w-8" aria-hidden="true" />
            </div>

            <h1 className="mx-auto mt-6 max-w-2xl font-brand text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              MealGenie naturalnie pasuje do telefonu, ale najpierw
              dopracowuję wersję webową.
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-ink-soft">
              Natywna aplikacja to osobny, duży etap. Jest na roadmapie, ale
              bez obietnicy daty, APK ani sklepu z aplikacjami. Teraz
              najważniejsze jest dopracowanie weba i funkcji, które mają
              działać świetnie każdego dnia.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/try"
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-ink-inverse shadow-accent transition duration-fast ease-out hover:border-accent-hover hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
              >
                Zobacz pomysł na dziś
                <ArrowRight
                  className="h-4 w-4 transition duration-fast ease-out group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  aria-hidden="true"
                />
              </Link>

              <Link
                to="/"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-border-strong bg-bg-elevated px-5 py-2.5 text-sm font-semibold text-ink shadow-xs transition duration-fast ease-out hover:border-accent hover:bg-accent-soft hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
              >
                Wróć na stronę główną
              </Link>
            </div>
          </div>
        </Card>

        <div className="mt-5 grid w-full gap-3 text-left md:grid-cols-3">
          {roadmapNotes.map((note) => (
            <Card key={note.title} className="p-5">
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-md border border-border",
                  roadmapIconClassName[note.tone],
                )}
              >
                <note.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 font-brand text-xl font-semibold leading-tight text-ink">
                {note.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                {note.body}
              </p>
            </Card>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-ink-muted">
          Ten ekran nie jest zapowiedzią konkretnej daty premiery. To miejsce
          na roadmapie: mobile ma sens, ale najpierw web musi być naprawdę
          dopracowany.
        </p>
      </section>
    </div>
  );
}
