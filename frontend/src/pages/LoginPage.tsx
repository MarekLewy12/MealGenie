import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  ChefHat,
  ArrowRight,
  Loader2,
  Sparkles,
  Clock,
  Brain,
  ShieldCheck,
  NotebookPen,
  Eye,
  EyeOff,
} from "lucide-react";
import { authSchema, type AuthFormData } from "../schemas/auth";
import { loginUser, registerUser } from "../services/api";
import { useAuthStore } from "../store/authStore";

type AuthMode = "login" | "register";

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    setErrorMsg(null);
    try {
      let result;
      if (mode === "login") {
        result = await loginUser(data);
      } else {
        result = await registerUser(data);
      }
      setAuth(result.token, result.user);
      navigate(mode === "login" ? "/" : "/onboarding");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.error ||
          (mode === "login" ? "Błędne dane logowania" : "Błąd rejestracji"),
      );
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setErrorMsg(null);
    setShowPassword(false);
    clearErrors();
    reset();
  };

  const journeySteps = [
    {
      icon: Brain,
      title: "Ustal cel",
      description:
        "Określ styl odżywiania, alergie i preferencje smakowe, aby MealGenie wiedział, czego potrzebujesz.",
    },
    {
      icon: NotebookPen,
      title: "Zdefiniuj zasady",
      description:
        "Dodaj produkty do wykluczenia lub ulubione kuchnie. AI zbuduje plan zgodny z Twoimi priorytetami.",
    },
    {
      icon: Sparkles,
      title: "Odbierz plan",
      description:
        "Dostajesz widok posiłków na kolejne dni, listę zakupów i sugestie zamienników, gdy zmienią się plany.",
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full items-start justify-center overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#020617] dark:text-white">
      {/* --- KONTENER GŁÓWNY (Szklana Karta) --- */}
      <div className="relative z-10 grid min-h-screen w-full max-w-none grid-cols-1 overflow-hidden border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl transition-all dark:border-white/10 dark:bg-slate-900/60 lg:grid-cols-2 lg:shadow-[0_0_50px_-10px_rgba(79,70,229,0.3)]">
        {/* LEWA STRONA (Branding / Wizualna) */}
        <div className="relative hidden flex-col items-center justify-center gap-12 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-700 p-12 text-white dark:from-indigo-950 dark:via-slate-950 dark:to-fuchsia-900 lg:flex">
          {/* Dekoracyjne elementy tła lewej strony */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-12 -top-12 h-72 w-72 rounded-full border border-white/10 bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-fuchsia-400/40 blur-[120px]" />
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/30 blur-[100px]" />
            {/* Subtelny pattern z szumem */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-100 contrast-150 mix-blend-overlay"></div>
            {/* Dodatkowy pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          </div>

          {/* Logo */}
          <Link
            to="/"
            className="relative z-10 flex w-fit items-center gap-3 transition-all hover:scale-[1.02] hover:opacity-80"
          >
            <div className="rounded-xl border border-white/20 bg-white/20 p-2.5 shadow-lg backdrop-blur-md">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">MealGenie</span>
          </Link>

          {/* Główna treść */}
          <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10 text-center">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4 text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Planowanie bez chaosu</span>
              </div>
              <h2 className="text-4xl font-bold leading-[1.1] lg:text-5xl">
                {mode === "login" ? (
                  <>
                    Witaj w{" "}
                    <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
                      uporządkowanej kuchni
                    </span>
                  </>
                ) : (
                  <>
                    Zacznij z{" "}
                    <span className="bg-gradient-to-r from-emerald-200 via-green-100 to-emerald-200 bg-clip-text text-transparent">
                      osobistym kucharzem AI
                    </span>
                  </>
                )}
              </h2>
              <p className="mx-auto max-w-xl text-center text-base leading-relaxed text-indigo-100">
                MealGenie pomaga podejmować decyzje, bilansować posiłki i
                planować zakupy tak, by każdy tydzień był prostszy.
              </p>
              <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-indigo-100/90">
                W jednym miejscu łączymy preferencje, listy składników i
                inspiracje sezonowe, dzięki czemu nie tracisz czasu na szukanie
                pomysłów.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="space-y-4"
            >
              <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-white/5 p-5 shadow-lg backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">
                    Plan działania
                  </div>
                  <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
                    3 kroki · personalizacja
                  </div>
                </div>
                <div className="space-y-3">
                  {journeySteps.map((step, idx) => (
                    <div
                      key={step.title}
                      className="group relative flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 text-left backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
                    >
                      <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/15">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                        <step.icon className="relative h-5 w-5 text-white" />
                        <span className="absolute -right-2 -top-2 rounded-full bg-white/20 px-2 text-[11px] font-semibold text-white">
                          {idx + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          {step.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-indigo-100/80">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* PRAWA STRONA (Formularz) */}
        <div className="flex flex-col items-center justify-center gap-8 p-8 sm:p-12 lg:bg-transparent">
          {/* Logo na mobile (bo lewa strona ukryta) */}
          <div className="mb-8 flex w-full justify-center lg:hidden">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-indigo-600 transition-opacity hover:opacity-80 dark:text-indigo-400"
            >
              <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/50">
                <ChefHat className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">MealGenie</span>
            </Link>
          </div>

          {/* Nagłówek */}
          <div className="w-full max-w-md space-y-3 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {mode === "login" ? "Zaloguj się" : "Stwórz konto"}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {mode === "login"
                ? "Kontynuuj pracę z planerem posiłków, listami zakupów i rekomendacjami AI."
                : "Utwórz konto, aby włączyć inteligentny planer, listy zakupów i dopasowane propozycje."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-md space-y-5 text-left"
            >
              <div className="space-y-4">
                {/* Input Email */}
                <div className="group relative">
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Adres email
                  </label>
                  <div className="pointer-events-none absolute bottom-0 left-0 flex h-[54px] items-center pl-4">
                    <Mail className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="twoj@email.pl"
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500"
                    >
                      <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Input Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Hasło
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex h-[54px] items-center pl-4">
                      <Lock className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                    </div>
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="block w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-12 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100/60 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-indigo-300 dark:focus:ring-indigo-500/40"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                      </span>
                    </button>
                  </div>

                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500"
                    >
                      <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Forgot Password link - only in login mode */}
                {mode === "login" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-500 hover:underline dark:text-indigo-400"
                    >
                      Zapomniałeś hasła?
                    </button>
                  </div>
                )}
              </div>

              {/* Komunikat o błędzie */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span className="flex-1">{errorMsg}</span>
                </motion.div>
              )}

              {/* Przycisk Akcji */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98] dark:shadow-indigo-900/50"
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 transition-opacity group-hover:opacity-100" />
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* Terms for Register */}
              {mode === "register" && (
                <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Rejestrując się, akceptujesz nasze{" "}
                  <button
                    type="button"
                    className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Warunki Usługi
                  </button>{" "}
                  i{" "}
                  <button
                    type="button"
                    className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Politykę Prywatności
                  </button>
                  .
                </p>
              )}
            </motion.form>
          </AnimatePresence>

          {/* Alternatywa logowania */}
          <div className="w-full max-w-md">
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                albo
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-[1px] hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-indigo-500/50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-inner shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-800">
                <svg viewBox="0 0 533.5 544.3" className="h-4 w-4">
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
              </span>
              <span>Kontynuuj z Google (wkrótce)</span>
            </button>
          </div>

          {/* Separator */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="rounded-full bg-white/80 px-4 text-slate-500 backdrop-blur dark:bg-slate-900/80 dark:text-slate-400">
                {mode === "login"
                  ? "Nie masz jeszcze konta?"
                  : "Masz już konto?"}
              </span>
            </div>
          </div>

          {/* Stopka formularza */}
          <div className="flex w-full max-w-md flex-col items-center justify-between gap-3 sm:flex-row">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {mode === "login" ? "Nie masz jeszcze konta?" : "Masz już konto?"}
            </span>
            <button
              onClick={toggleMode}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              {mode === "login" ? "Stwórz nowe konto" : "Zaloguj się"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Trust indicators na mobile */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:hidden">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Prywatność przede wszystkim</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Clock className="h-4 w-4 text-indigo-500" />
              <span>Plan na kolejne dni w kilka minut</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>AI jako partner w kuchni</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
