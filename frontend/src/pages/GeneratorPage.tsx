import { Link } from "react-router-dom";
import { MealGenerator } from "../components/MealGenerator";
import { Eyebrow, FolkDivider, HandwrittenKicker } from "../components/ui";

export function GeneratorPage() {
  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl space-y-3">
          <HandwrittenKicker>~ powiedz, co masz pod ręką ~</HandwrittenKicker>
          <Eyebrow>Generator posiłków</Eyebrow>
          <h1 className="font-brand text-3xl font-semibold leading-tight text-ink sm:text-5xl">
            Zobacz posiłki dobrane pod Twój dzień
          </h1>
          <p className="max-w-2xl text-base leading-7 text-ink-soft">
            Personalizowane propozycje w kilkadziesiąt sekund. Wróć do
            onboardingu, by zmienić preferencje.
          </p>
          <FolkDivider className="max-w-52 text-border-strong" />
        </div>
        <Link to="/onboarding" className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-pill border border-border-strong bg-bg-elevated px-5 py-2.5 text-sm font-semibold leading-none text-accent shadow-xs transition duration-fast ease-out hover:border-accent hover:bg-accent-soft hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent">
          Edytuj preferencje
        </Link>
      </div>
      <MealGenerator />
    </section>
  );
}
