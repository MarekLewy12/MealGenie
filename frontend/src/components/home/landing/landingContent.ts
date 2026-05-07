import {
  Eye,
  HeartHandshake,
  Leaf,
  ListChecks,
  MessageCircle,
  SearchX,
  ShieldCheck,
  ShoppingBasket,
  SlidersHorizontal,
  Utensils,
  Clock3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Tone = "accent" | "basil" | "saffron" | "neutral";

export type IconContentItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const landingHeroCopy = {
  eyebrow: "Domowy pomysł na dziś",
  kicker: "po polsku",
  headlineLines: [
    { text: "Co dziś ugotować?" },
    { text: "MealGenie podpowie.", accent: true },
  ],
  subheadline:
    "Zamiast zaczynać od setek przepisów, zacznij od dzisiejszej sytuacji: czasu, apetytu, preferencji i tego, co masz pod ręką.",
  primaryCta: "Zobacz pomysł na dziś",
  secondaryCta: "Załóż profil",
};

export const heroDecisionFacts = [
  { label: "dziś", value: "25 minut i mało energii" },
  { label: "pasuje do", value: "Twoich preferencji" },
  { label: "dalej", value: "wybierz danie albo zmień kierunek" },
];

export const problemNotes = [
  "znowu makaron?",
  "mam 25 minut",
  "co zrobić z resztką papryki?",
  "przepis chce 14 składników",
  "nie chcę iść do sklepu",
  "coś sycącego, ale lekkiego",
];

export const problemCards = [
  {
    title: "Za dużo opcji",
    description:
      "Przepisy są wszędzie, ale mało który pasuje do dzisiejszego dnia.",
  },
  {
    title: "Za mało energii",
    description: "Po pracy najtrudniejsze bywa samo wybranie.",
  },
  {
    title: "Za dużo resztek",
    description:
      "Składniki czekają, aż ktoś wymyśli dla nich sensowny plan.",
  },
];

export const solutionContextItems = [
  { label: "Dziś", value: "mało czasu" },
  { label: "W kuchni", value: "ryż, papryka, jajka" },
  { label: "Ważne", value: "bez laktozy" },
];

export const landingHowSteps = [
  {
    number: "01",
    title: "Mówisz, jak wygląda dziś",
    description: "Czas, apetyt, preferencje i produkty pod ręką.",
  },
  {
    number: "02",
    title: "Wybierasz dobry kierunek",
    description: "Porównujesz kilka opcji bez przekopywania internetu.",
  },
  {
    number: "03",
    title: "Gotujesz z podpowiedziami",
    description: "Przepis, lista braków i asystent zostają pod ręką.",
  },
];

export const landingBenefits: IconContentItem[] = [
  {
    title: "Koniec z 30 kartami",
    description:
      "Nie skaczesz między przepisami, które i tak nie pasują do dnia.",
    icon: SearchX,
  },
  {
    title: "Resztki dostają drugą szansę",
    description: "Łatwiej zużyć produkty, które już czekają w kuchni.",
    icon: Leaf,
  },
  {
    title: "Posiłki pod Twoje zasady",
    description:
      "Dieta, sprzęt, czas i preferencje wpływają na wybór od początku.",
    icon: SlidersHorizontal,
  },
  {
    title: "Zakupy bez zgadywania",
    description:
      "Wiesz, co masz, czego brakuje i czy sklep jest w ogóle potrzebny.",
    icon: ShoppingBasket,
  },
];

export const experienceHighlights: Array<{
  label: string;
  helper: string;
  icon: LucideIcon;
  tone: Tone;
}> = [
  {
    label: "Przepis krok po kroku",
    helper: "bez zgadywania kolejności i ilości",
    icon: Utensils,
    tone: "accent",
  },
  {
    label: "Makro bez kalkulatora",
    helper: "wiesz, czy danie pasuje do dnia",
    icon: Clock3,
    tone: "saffron",
  },
  {
    label: "Lista braków",
    helper: "zakupy bez chaosu",
    icon: ListChecks,
    tone: "neutral",
  },
  {
    label: "Asystent przy gotowaniu",
    helper: "zamienniki i pytania w trakcie",
    icon: MessageCircle,
    tone: "basil",
  },
];

export const landingTrustCards = [
  {
    title: "Zwykłe składniki",
    description: "Produkty z polskich sklepów, targu i domowej spiżarni.",
    icon: ShoppingBasket,
    badge: "praktycznie",
    badgeVariant: "saffron" as const,
  },
  {
    title: "Preferencje jako zasady",
    description:
      "Dieta, alergie i nielubiane składniki wpływają na wybór od początku.",
    icon: ShieldCheck,
    badge: "uważnie",
    badgeVariant: "basil" as const,
  },
  {
    title: "Bez sponsorowanych dań",
    description: "Propozycje wynikają z dopasowania, nie z opłaconego miejsca.",
    icon: HeartHandshake,
    badge: "bez reklam",
    badgeVariant: "accent" as const,
  },
  {
    title: "Pełny przepis pod ręką",
    description: "Kroki, ilości, makro i wskazówki zostają w jednym flow.",
    icon: Eye,
    badge: "czytelnie",
    badgeVariant: "basil" as const,
  },
];

export const finalCtaPoints = [
  "Pierwsza generacja bez konta.",
  "Profil zapisze preferencje i historię.",
  "Bez sponsorowanych podpowiedzi.",
  "Zwykłe składniki, spokojny wybór.",
];
