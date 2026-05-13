import { OnboardingForm } from "../components/OnboardingForm";
import { useAuthStore } from "../store/authStore";
import { HandwrittenKicker } from "../components/ui";

export function OnboardingPage() {
  const user = useAuthStore((state) => state.user);
  const userName = user?.name || "Kucharzu";

  return (
    <section className="relative w-full bg-bg px-4 py-12 text-ink sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <HandwrittenKicker>poznajmy się</HandwrittenKicker>

        <h1 className="mt-4 font-brand text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Witaj, <span className="text-accent">{userName}</span>! 👋
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          Pozwól MealGenie poznać Twój styl gotowania, aby propozycje były
          idealnie trafione w Twój gust i możliwości.
        </p>

        <p className="mt-2 text-sm font-medium text-ink-muted">
          Zawsze możesz zmienić te ustawienia później w swoim profilu.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-4xl md:mt-16">
        <OnboardingForm />
      </div>
    </section>
  );
}
