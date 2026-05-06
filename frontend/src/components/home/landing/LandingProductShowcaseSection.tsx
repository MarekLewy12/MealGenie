import { motion, type MotionProps, useReducedMotion } from "framer-motion";
import {
  Bot,
  Check,
  ChefHat,
  Clock3,
  Heart,
  History,
  ListChecks,
  MessageCircle,
  Sparkles,
  Sprout,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Badge,
  Button,
  Card,
  DottedRow,
  FolkDivider,
  HandwrittenKicker,
} from "../../ui";
import { cn } from "../../../utils/cn";

type ProductMode = {
  label: string;
  helper: string;
  icon: LucideIcon;
  tone: "accent" | "basil" | "saffron" | "neutral";
};

type Macro = {
  label: string;
  value: string;
  barClassName: string;
};

type ShoppingItem = {
  name: string;
  amount: string;
  checked?: boolean;
};

const productModes: ProductMode[] = [
  {
    label: "Generator",
    helper: "pomysł z tego, co jest w kuchni",
    icon: Sparkles,
    tone: "accent",
  },
  {
    label: "Przepis",
    helper: "czytelne kroki i czas gotowania",
    icon: ChefHat,
    tone: "basil",
  },
  {
    label: "Makro",
    helper: "białko, kalorie i porcje pod ręką",
    icon: Utensils,
    tone: "saffron",
  },
  {
    label: "Lista zakupów",
    helper: "braki zebrane w prostą checklistę",
    icon: ListChecks,
    tone: "neutral",
  },
  {
    label: "Asystent",
    helper: "podpowiada zamiany w trakcie gotowania",
    icon: MessageCircle,
    tone: "basil",
  },
  {
    label: "Historia",
    helper: "wracasz do udanych obiadów",
    icon: History,
    tone: "accent",
  },
];

const macros: Macro[] = [
  { label: "Białko", value: "32 g", barClassName: "w-[72%] bg-basil" },
  { label: "Węgle", value: "48 g", barClassName: "w-[86%] bg-saffron" },
  { label: "Tłuszcze", value: "18 g", barClassName: "w-[58%] bg-accent" },
];

const shoppingItems: ShoppingItem[] = [
  { name: "kasza pęczak", amount: "180 g", checked: true },
  { name: "pieczarki", amount: "300 g", checked: true },
  { name: "jarmuż", amount: "2 garści" },
  { name: "twaróg wędzony", amount: "120 g" },
];

const assistantMessages = [
  "Zamień koper na natkę?",
  "Tak. Doda świeżości i zostanie w limicie 35 minut.",
];

const recentRecipes = [
  "Pomidorowa z pieczoną papryką",
  "Placki z cukinii i fety",
  "Ryba po kaszubsku light",
];

const productModeToneClassName: Record<ProductMode["tone"], string> = {
  accent: "bg-accent-soft text-accent-deep",
  basil: "bg-basil/12 text-basil",
  saffron: "bg-saffron/20 text-ink",
  neutral: "bg-bg-sunken text-ink-soft",
};

export function LandingProductShowcaseSection() {
  const shouldReduceMotion = useReducedMotion();

  const sectionMotion: MotionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.28 },
        transition: { duration: 0.6, ease: "easeOut" },
      };

  const floatMotion: MotionProps = shouldReduceMotion
    ? {}
    : {
        animate: { y: [0, -8, 0] },
        transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
      };

  return (
    <section
      aria-labelledby="landing-product-showcase-title"
      className="relative overflow-hidden bg-bg py-14 text-ink sm:py-16 lg:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(194,87,40,0.08),transparent_34%),linear-gradient(180deg,transparent_42%,rgba(90,138,74,0.06))] dark:bg-[linear-gradient(135deg,rgba(232,138,74,0.07),transparent_36%),linear-gradient(180deg,transparent_44%,rgba(139,194,122,0.05))]" />

      <motion.div
        className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12"
        {...sectionMotion}
      >
        <div>
          <HandwrittenKicker>z domowej kuchni</HandwrittenKicker>
          <h2
            id="landing-product-showcase-title"
            className="mt-3 max-w-xl font-brand text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl"
          >
            MealGenie pokazuje cały obiad, nie tylko pomysł.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-ink-soft sm:text-lg">
            Od pierwszej zachcianki po listę zakupów: generator, pełny przepis,
            makro, asystent gotowania oraz historia ulubionych dań są w jednym
            spokojnym widoku.
          </p>

          <FolkDivider className="mt-7 max-w-sm text-accent" />

          <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {productModes.map((mode) => (
              <div
                key={mode.label}
                className="flex items-start gap-3 rounded-md border border-border/80 bg-bg-elevated/80 px-3 py-2.5"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-sm",
                    productModeToneClassName[mode.tone],
                  )}
                >
                  <mode.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-brand text-sm font-semibold leading-5 text-ink">
                    {mode.label}
                  </span>
                  <span className="mt-0.5 block text-sm leading-5 text-ink-soft">
                    {mode.helper}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[720px] lg:mx-0">
          <motion.div
            aria-hidden="true"
            className="absolute -right-2 -top-5 hidden rounded-md border border-border bg-bg-elevated px-4 py-3 shadow-md sm:block lg:-right-4"
            {...floatMotion}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-basil">
              <Sprout className="h-4 w-4" aria-hidden="true" />
              bazylia i sezon
            </div>
          </motion.div>

          <Card className="relative overflow-hidden p-0 shadow-lg">
            <div className="border-b border-border bg-bg-elevated px-4 py-3 sm:px-5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2" aria-hidden="true">
                  <span className="h-3 w-3 rounded-full bg-accent" />
                  <span className="h-3 w-3 rounded-full bg-saffron" />
                  <span className="h-3 w-3 rounded-full bg-basil" />
                </div>
                <div className="min-w-0 flex-1 rounded-pill border border-border bg-bg-sunken px-3 py-1.5 text-xs font-semibold text-ink-soft">
                  MealGenie / dzisiejsza kolacja
                </div>
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[0.86fr_1.14fr]">
              <aside className="border-b border-border bg-bg-sunken p-3 sm:p-4 lg:border-r lg:border-b-0">
                <div className="flex items-center gap-2">
                  <Badge variant="accent">Generator</Badge>
                  <Badge variant="basil">25 min</Badge>
                </div>

                <div className="mt-3 rounded-md border border-border bg-bg-elevated p-3 shadow-xs sm:mt-4 sm:p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Mam w domu
                  </p>
                  <p className="mt-2 font-brand text-xl font-semibold leading-tight text-ink sm:text-2xl">
                    kaszę, pieczarki, jarmuż
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                    <Badge variant="neutral">bez mięsa</Badge>
                    <Badge variant="neutral">ciepły obiad</Badge>
                    <Badge variant="neutral" className="hidden sm:inline-flex">
                      polska kuchnia
                    </Badge>
                  </div>
                  <Button
                    variant="primary"
                    className="mt-4 w-full sm:mt-5"
                    leftIcon={<Sparkles className="h-4 w-4" />}
                  >
                    Generuj przepis
                  </Button>
                </div>

                <div className="mt-4 hidden rounded-md border border-border bg-bg-elevated p-4 lg:block">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-brand text-sm font-bold text-ink">
                      Historia i ulubione
                    </h3>
                    <Heart className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                  </div>
                  <div className="space-y-2">
                    {recentRecipes.map((recipe) => (
                      <div
                        key={recipe}
                        className="rounded-sm border border-border bg-bg-sunken px-3 py-2 text-sm text-ink-soft"
                      >
                        {recipe}
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="bg-bg-elevated p-3 sm:p-5">
                <div className="rounded-md border border-border-strong bg-bg p-3 shadow-sm sm:p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <Badge variant="basil">Pełny przepis</Badge>
                      <h3 className="mt-3 font-brand text-xl font-semibold leading-tight text-ink sm:text-2xl">
                        Kremowe pęczotto z pieczarkami i jarmużem
                      </h3>
                    </div>
                    <div className="rounded-md bg-accent-soft px-3 py-2 text-center text-accent-deep">
                      <Clock3 className="mx-auto h-4 w-4" aria-hidden="true" />
                      <span className="mt-1 block text-xs font-bold">25 min</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-4">
                    {macros.map((macro) => (
                      <div
                        key={macro.label}
                        className="rounded-md border border-border bg-bg-elevated p-2 sm:p-3"
                      >
                        <div
                          className="mb-2 h-2 overflow-hidden rounded-pill bg-bg-sunken"
                          aria-hidden="true"
                        >
                          <div className={cn("h-full rounded-pill", macro.barClassName)} />
                        </div>
                        <p className="text-xs leading-4 text-ink-muted">
                          {macro.label}
                        </p>
                        <p className="font-brand text-base font-bold leading-6 text-ink sm:text-lg">
                          {macro.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 hidden space-y-3 sm:block">
                    <DottedRow label="Porcje" value="2" />
                    <DottedRow label="Kalorie" value="510 kcal" />
                    <DottedRow label="Sprzęt" value="garnek + patelnia" />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 min-[375px]:grid-cols-2 lg:hidden">
                  <div className="rounded-md border border-border bg-bg p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-accent" aria-hidden="true" />
                      <h3 className="font-brand text-sm font-bold text-ink">
                        Lista zakupów
                      </h3>
                    </div>
                    <p className="text-sm font-semibold text-ink">4 produkty</p>
                    <p className="mt-1 text-sm leading-5 text-ink-soft">
                      2 już masz w koszyku
                    </p>
                  </div>

                  <div className="rounded-md border border-border bg-bg-elevated p-3 text-ink">
                    <div className="mb-2 flex items-center gap-2">
                      <Bot className="h-4 w-4 text-basil" aria-hidden="true" />
                      <h3 className="font-brand text-sm font-bold">Asystent</h3>
                    </div>
                    <p className="text-sm leading-5 text-ink-soft">
                      Zamieni składnik i pilnuje czasu.
                    </p>
                  </div>
                </div>

                <div className="mt-4 hidden gap-4 lg:grid xl:grid-cols-2">
                  <div className="rounded-md border border-border bg-bg p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-accent" aria-hidden="true" />
                      <h3 className="font-brand text-sm font-bold text-ink">Lista zakupów</h3>
                    </div>
                    <div className="space-y-2">
                      {shoppingItems.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-3 rounded-md bg-bg-elevated px-4 py-3 text-sm"
                        >
                          <span
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-xs border",
                              item.checked
                                ? "border-basil bg-basil text-ink-inverse"
                                : "border-border-strong bg-bg",
                            )}
                            aria-hidden="true"
                          >
                            {item.checked ? <Check className="h-3.5 w-3.5" /> : null}
                          </span>
                          <span className="min-w-0 flex-1 leading-5 text-ink">{item.name}</span>
                          <span className="text-ink-soft">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-md border border-border-strong bg-[#2b2521] p-4 text-[#fdf8ec] shadow-md dark:bg-bg-sunken dark:text-ink">
                    <div className="mb-3 flex items-center gap-2">
                      <Bot className="h-4 w-4 text-accent" aria-hidden="true" />
                      <h3 className="font-brand text-sm font-bold">Asystent przepisu</h3>
                    </div>
                    <div className="space-y-3">
                      {assistantMessages.map((message, index) => (
                        <p
                          key={message}
                          className={cn(
                            "max-w-[92%] rounded-lg px-4 py-3 text-sm leading-6",
                            index === 0
                              ? "bg-[#fdf8ec] text-ink dark:bg-bg-elevated dark:text-ink"
                              : "ml-auto bg-accent text-ink-inverse",
                          )}
                        >
                          {message}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </section>
  );
}
