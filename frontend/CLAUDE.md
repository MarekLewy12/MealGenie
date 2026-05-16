# Frontend - MealGenie

## Scope

Ten plik dotyczy tylko `frontend/`. Stack: React 19 + Vite + TypeScript,
Tailwind CSS v4, Zustand, TanStack Query, React Router, React Hook Form + Zod,
Framer Motion, focus-trap.

## Zasady pracy

Przy każdej zmianie UI zachowaj:
- routing (React Router)
- query keys TanStack Query
- store'y Zustand (shape i nazwy)
- payloady i kontrakty API (`services/api.ts` - nie ruszaj bez wyraźnego powodu)
- flow generowania posiłku i przepisu
- obsługę stanów loading / error / empty
- dark mode i responsywność (mobile-first)

Nie zmieniaj kontraktów API bez zsynchronizowanej zmiany backendu.

Build produkcyjny: `vite build` (nie `tsc -b`).

## Direction A - Cozy Polish home kitchen

Źródło prawdy dla tokenów: `frontend/src/index.css`.

Klimat: ciepła polska kuchnia, papier, notes z przepisami - nie zimny SaaS ani AI-tech.
Baza kolorów light-mode to Fresh Herb + Apricot (nie przybrudzone beże ani ciężka terracotta).
Dark-mode: ciepły grafit, nie brąz - ciepło pochodzi z akcentów apricot/basil/saffron.

Nie używaj `--saffron` jako koloru tekstu na jasnym tle - tylko jako miękki akcent tła.
Nie wzmacniaj glow i radial overlays bez wcześniejszego review.
Nie wracaj do slate/indigo/fioletu jako bazy.

Typografia:
- `Outfit` (`--font-brand`) - preferowany dla Landing Page, logo, nazwy kart,
  krótkie tytuły produktowe
- `Source Serif 4` - display, hero, recipe headers (poza landingiem)
- `Source Sans 3` - tekst UI i body
- `Caveat` - oszczędny kicker dekoracyjny, nie do nagłówków
- `JetBrains Mono` - liczby, ilości, wartości tabelaryczne

## Dostępność

Każda zmiana UI wymaga sprawdzenia:
- icon-only buttons mają `aria-label`
- focus ring jest widoczny (globalny focus ring w `index.css`)
- nie ma poziomego overflow na mobile
- animacje respektują `prefers-reduced-motion`
- `/shared/:shareId` działa bez auth i bez globalnego headera

## Branchowanie

Gałąź integracyjna redesignu: `redesign/direction-a`.
PRy z pracy nad redesignem idą do `redesign/direction-a`, nie do `master`.
`master` pozostaje stabilny aż do finalnego, zaakceptowanego merge'a.

## Po zmianie

Pokaż: zmienione pliki, ryzyka, checklistę ręcznego testu, czy zmiana dotyka produkcji.
