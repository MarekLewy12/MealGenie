import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Sparkles,
  ShieldCheck,
  NotebookPen,
  Eye,
  EyeOff,
  User,
  ListChecks,
  Utensils,
  Clock3,
} from "lucide-react";

import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from "../schemas/auth";
import { loginUser, registerUser } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { notify } from "../store/notificationStore";
import { HandwrittenKicker } from "../components/ui";

type AuthMode = "login" | "register";

export function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const getModeFromQuery = (): AuthMode =>
    searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<AuthMode>(getModeFromQuery);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const activeSchema = mode === "login" ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
    reset,
    clearErrors,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(activeSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      let result;
      if (mode === "login") {
        const loginPayload: LoginFormData = {
          email: data.email,
          password: data.password,
        };
        result = await loginUser(loginPayload);
      } else {
        result = await registerUser(data);
      }

      const hasCompletedOnboarding = Boolean(result.hasCompletedOnboarding);

      setAuth(result.token, result.user, hasCompletedOnboarding);
      if (mode === "login") {
        notify.success("Zalogowano pomyślnie.", "Witaj!");
      } else {
        notify.success("Konto utworzone pomyślnie.", "Gotowe!");
      }

      const redirectPath = hasCompletedOnboarding ? "/dashboard" : "/onboarding";
      setTimeout(() => {
        navigate(redirectPath);
      }, 100);
    } catch (err: unknown) {
      console.error("Login error:", err);
      const fallbackMessage =
        mode === "login" ? "Błędne dane logowania" : "Błąd rejestracji";
      const apiMessage =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error
          : undefined;
      const message =
        apiMessage ?? (err instanceof Error ? err.message : fallbackMessage);
      setErrorMsg(message);
      notify.error(message, "Autoryzacja");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting || isFormSubmitting;

  useEffect(() => {
    const requestedMode = getModeFromQuery();
    if (requestedMode === mode) {
      return;
    }

    setMode(requestedMode);
    setErrorMsg(null);
    setShowPassword(false);
    clearErrors();
    reset();
  }, [searchParams, mode, clearErrors, reset]);

  const toggleMode = () => {
    const nextMode = mode === "login" ? "register" : "login";
    setMode(nextMode);
    setSearchParams(
      nextMode === "register" ? { mode: "register" } : {},
      { replace: true },
    );
    setErrorMsg(null);
    setShowPassword(false);
    clearErrors();
    reset();
  };

  const journeySteps = [
    {
      icon: ShieldCheck,
      title: "Preferencje jako zasady",
      description: "Dieta i alergie wpływają na wybór od razu.",
      tone: "text-basil",
      bgTone: "bg-basil-soft dark:bg-basil/20",
    },
    {
      icon: NotebookPen,
      title: "Domowe składniki",
      description: "Przepisy oparte o produkty, które masz pod ręką.",
      tone: "text-ink dark:text-saffron",
      bgTone: "bg-saffron-soft dark:bg-saffron/20",
    },
    {
      icon: ListChecks,
      title: "Gotowy plan",
      description: "Kroki i asystent w jednym, wygodnym widoku.",
      tone: "text-accent",
      bgTone: "bg-accent-soft dark:bg-accent/20",
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden bg-bg text-ink">
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
        {/* LEWA STRONA (Branding / Wizualna) */}
        <div className="relative hidden min-h-0 flex-col items-center justify-center overflow-hidden border-r border-border bg-bg-sunken p-12 lg:flex">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-[10%] -top-[10%] h-[40rem] w-[40rem] rounded-full bg-saffron/20 blur-[100px] dark:bg-saffron/10" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[45rem] w-[45rem] rounded-full bg-accent/15 blur-[120px] dark:bg-accent/10" />
            <div className="absolute left-[60%] top-[30%] h-[30rem] w-[30rem] rounded-full bg-basil/10 blur-[100px] dark:bg-basil/5" />
          </div>

          <div className="relative z-10 flex w-full max-w-2xl flex-col items-start gap-10 xl:gap-14">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-5"
            >
              <HandwrittenKicker className="text-2xl xl:text-3xl">
                {mode === "login" ? "witaj z powrotem" : "gotujemy?"}
              </HandwrittenKicker>
              <h2 className="font-brand text-4xl font-bold leading-[1.05] text-ink lg:text-6xl xl:text-[4rem]">
                {mode === "login" ? (
                  <>
                    Spokojna <span className="text-accent">decyzja</span>,
                    <br />
                    szybki obiad.
                  </>
                ) : (
                  <>
                    Zacznij od <span className="text-accent">jednego</span>
                    <br />
                    dobrego planu.
                  </>
                )}
              </h2>
              <p className="max-w-xl text-lg leading-8 text-ink-soft xl:text-xl xl:leading-9">
                MealGenie prowadzi od krótkiego opisu dnia do planu, który da
                się od razu zabrać do kuchni.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="w-full"
            >
              <div className="w-full rounded-2xl border border-border bg-bg-elevated/85 p-8 shadow-sm backdrop-blur-sm sm:p-10">
                <div className="mb-4 flex items-center gap-2 border-b border-dotted border-border-dotted pb-3">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="font-brand text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Dlaczego warto
                  </span>
                </div>
                <div className="space-y-4">
                  {journeySteps.map((step) => (
                    <div key={step.title} className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${step.bgTone}`}
                      >
                        <step.icon className={`h-6 w-6 ${step.tone}`} />
                      </div>
                      <div className="pt-0.5">
                        <p className="font-brand text-sm font-semibold text-ink">
                          {step.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-soft">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-2 w-full rounded-2xl border border-border bg-bg-elevated p-6 shadow-xl xl:p-7"
            >
              <div className="flex items-center justify-between border-b border-border-dotted pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Utensils className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="font-brand text-sm font-bold uppercase tracking-wider text-ink-muted">
                    Twój plan na dziś
                  </span>
                </div>
                <span className="rounded-full bg-basil-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-basil">
                  Idealne dopasowanie
                </span>
              </div>

              <div className="pt-5">
                <h3 className="font-brand text-2xl font-semibold text-ink xl:text-3xl">
                  Łosoś z puree kalafiorowym
                </h3>
                <p className="mt-2 text-base text-ink-soft xl:text-lg">
                  Szybki i lekki obiad. Wykorzystuje resztkę kalafiora z
                  wczoraj i omija nabiał, tak jak lubisz.
                </p>

                <div className="mt-5 flex gap-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink-muted xl:text-base">
                    <Clock3 className="h-5 w-5 text-accent" aria-hidden="true" />
                    25 minut
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink-muted xl:text-base">
                    <ListChecks className="h-5 w-5 text-basil" aria-hidden="true" />
                    2 składniki do kupienia
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* PRAWA STRONA (Formularz) */}
        <div className="relative flex min-h-0 flex-col items-center justify-center overflow-y-auto bg-bg p-6 sm:p-12 lg:p-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`auth-heading-${mode}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-[28rem] space-y-2 text-center lg:text-left"
            >
              <h1 className="font-brand text-4xl font-bold tracking-tight text-ink">
                {mode === "login" ? "Zaloguj się" : "Załóż profil"}
              </h1>
              <p className="text-base leading-7 text-ink-soft">
                {mode === "login"
                  ? "Wróć do swoich preferencji i wygenerowanych pomysłów."
                  : "Zapisz swoje nielubiane składniki, alergie i zasady gotowania."}
              </p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 w-full max-w-[28rem] space-y-6"
            >
              <div className="space-y-4">
                {mode === "register" && (
                  <div className="space-y-1.5 animate-fade-in-up">
                    <label className="block text-sm font-semibold uppercase tracking-wider text-ink-muted">
                      Imię
                    </label>
                    <div className="group relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex h-14 items-center pl-4">
                        <User className="h-6 w-6 text-ink-disabled transition-colors group-focus-within:text-accent" />
                      </div>
                      <input
                        {...register("name")}
                        type="text"
                        autoComplete="name"
                        placeholder="Jak się do Ciebie zwracać?"
                        className="block h-14 w-full rounded-2xl border border-border bg-bg-sunken pl-12 pr-4 text-base text-ink outline-none transition-all placeholder:text-ink-disabled focus:border-accent focus:bg-bg-elevated focus:ring-4 focus:ring-accent/10"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-medium text-bordeaux">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold uppercase tracking-wider text-ink-muted">
                    Email
                  </label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex h-14 items-center pl-4">
                      <Mail className="h-6 w-6 text-ink-disabled transition-colors group-focus-within:text-accent" />
                    </div>
                    <input
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                      placeholder="twoj@email.pl"
                      className="block h-14 w-full rounded-2xl border border-border bg-bg-sunken pl-12 pr-4 text-base text-ink outline-none transition-all placeholder:text-ink-disabled focus:border-accent focus:bg-bg-elevated focus:ring-4 focus:ring-accent/10"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-bordeaux">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold uppercase tracking-wider text-ink-muted">
                    Hasło
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex h-14 items-center pl-4">
                      <Lock className="h-6 w-6 text-ink-disabled transition-colors group-focus-within:text-accent" />
                    </div>
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      autoComplete={
                        mode === "login" ? "current-password" : "new-password"
                      }
                      placeholder="••••••••"
                      className="block h-14 w-full rounded-2xl border border-border bg-bg-sunken pl-12 pr-12 text-base text-ink outline-none transition-all placeholder:text-ink-disabled focus:border-accent focus:bg-bg-elevated focus:ring-4 focus:ring-accent/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-ink-disabled transition hover:bg-border hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                      </span>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-bordeaux">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-3 rounded-xl border border-bordeaux/30 bg-accent-soft px-4 py-3 text-sm text-bordeaux"
                  role="alert"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 font-medium">{errorMsg}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isBusy}
                className="group flex min-h-[3.5rem] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-accent bg-accent px-5 py-3 text-center text-base font-semibold leading-tight text-ink-inverse shadow-accent transition duration-base ease-out hover:-translate-y-0.5 hover:border-accent-hover hover:bg-accent-hover active:border-accent-pressed active:bg-accent-pressed disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isBusy ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Zaloguj się" : "Załóż profil"}
                    <ArrowRight className="h-4 w-4 transition duration-300 ease-out group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {mode === "register" && (
                <p className="text-center text-xs leading-relaxed text-ink-muted">
                  Konto zapisze Twoje preferencje, historię przepisów i
                  ustawienia MealGenie.
                </p>
              )}
            </motion.form>
          </AnimatePresence>

          <div className="mt-8 w-full max-w-[28rem]">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs font-brand font-bold uppercase tracking-wider">
                <span className="bg-bg px-4 text-ink-muted">lub</span>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-border bg-bg-sunken px-5 py-3 text-sm font-semibold text-ink-disabled transition duration-base ease-out"
            >
              <svg viewBox="0 0 533.5 544.3" className="h-4 w-4 opacity-60">
                <path
                  fill="#4285F4"
                  d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272.1v95.4h146.8c-6.3 34-25 62.8-53.6 82.1v68.2h86.8c50.7-46.6 81.4-115.3 81.4-195.3z"
                />
                <path
                  fill="#34A853"
                  d="M272.1 544.3c72.6 0 133.6-24 178.1-65.6l-86.8-68.2c-24.1 16.2-55 25.9-91.3 25.9-70 0-129.4-47.2-150.6-110.6H32.1v69.4c44.3 87.8 135.6 149.1 240 149.1z"
                />
                <path
                  fill="#FBBC05"
                  d="M121.5 325.8c-10.9-32.7-10.9-68 0-100.7V155.7H32.1c-21.8 43.5-34.2 92.4-34.2 145 0 52.7 12.4 101.5 34.2 145l89.4-69.9z"
                />
                <path
                  fill="#EA4335"
                  d="M272.1 107.7c39.6 0 75 13.6 103 40.4l77-77C405.4 24.4 344.4 0 272.1 0 167.7 0 76.4 61.3 32.1 149.1l89.4 69.9c21.2-63.4 80.6-111.3 150.6-111.3z"
                />
              </svg>
              <span>Zaloguj przez Google (wkrótce)</span>
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={`auth-switch-${mode}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="mt-8 flex items-center justify-center gap-2 text-sm"
              >
                <span className="text-ink-soft">
                  {mode === "login" ? "Nie masz jeszcze profilu?" : "Masz już profil?"}
                </span>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="cursor-pointer font-semibold text-accent transition-colors hover:text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                >
                  {mode === "login" ? "Załóż profil" : "Zaloguj się"}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
