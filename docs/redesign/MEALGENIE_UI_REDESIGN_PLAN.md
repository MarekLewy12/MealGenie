# MealGenie UI Redesign Plan - Direction A

Status dokumentu: gotowy do review  
Zakres: plan wdrożenia redesignu UI, bez zmian kodu aplikacji  
Kierunek: Direction A - Cozy Polish home kitchen

## Status Wdrożenia

| Etap | Status | Data | Notatka |
|---|---|---|---|
| Etap 1 - Foundation | Gotowe do review | 2026-05-06 | Wprowadzono tokeny Direction A, fonty, `html lang="pl"`, globalny focus ring, reduced motion i ciepłe tło light/dark w `frontend/src/index.css`, `frontend/tailwind.config.js`, `frontend/index.html` oraz `frontend/src/App.tsx`. Do ręcznego sprawdzenia: light/dark po reloadzie, mobile overflow, widoczność focusu i ewentualny FOUC przed osobnym no-FOUC fixem. |
| Etap 3 - Logo, header i shell | Gotowe do review | 2026-05-06 | Wprowadzono komponent `Logo`, header Direction A, przestylowany `ThemeToggle`, skip-link do treści oraz zachowano brak globalnego headera na `/shared/:shareId`. Zmienione pliki: `frontend/src/components/Logo.tsx`, `frontend/src/components/Header.tsx`, `frontend/src/components/ThemeToggle.tsx`, `frontend/src/App.tsx`, `frontend/index.html`, `docs/redesign/MEALGENIE_UI_REDESIGN_PLAN.md`. |
| Etap 4 - Karty posiłków i historii | Gotowe do review | 2026-05-06 | Przebudowano wizualnie karty na papierowy styl Direction A, z ciepłym obrazem/fallbackiem, fontem brandowym dla nazw przepisów, badge/meta, dotted rows i dostępnym usuwaniem historii. Zmienione pliki: `frontend/src/components/MealCard.tsx`, `frontend/src/components/MealHistoryCard.tsx`, `frontend/src/components/Logo.tsx`, `frontend/src/index.css`, `frontend/tailwind.config.js`, `frontend/index.html`, `docs/redesign/MEALGENIE_UI_REDESIGN_PLAN.md`. |

## Strategia branchowania redesignu

`master` pozostaje stabilnym stanem produkcyjnym sprzed redesignu i nie przyjmuje bezpośrednich PR-ów UI redesignu.

Punkty bezpieczeństwa dla stanu sprzed UI redesignu:

- tag: `pre-ui-redesign-2026-05-06`
- branch archiwalny: `archive/pre-ui-redesign-2026-05-06`

Gałąź integracyjna redesignu:

- `redesign/direction-a`

Zasady pracy:

- PR z `feature/ui-redesign-foundation` ma być kierowany do `redesign/direction-a`, nie do `master`. Jeśli branch foundation występuje jako `feat/ui-redesign-foundation`, obowiązuje ta sama zasada.
- Kolejne branche robocze redesignu mają startować z `redesign/direction-a`.
- `master` pozostaje nietknięty aż do finalnego, osobno zaakceptowanego PR-a `redesign/direction-a` -> `master`.
- Tej strategii nie zmieniamy bez osobnej decyzji Marka.

## 1. Decyzja projektowa

Wybieramy Direction A, ponieważ najlepiej pasuje do obietnicy MealGenie: pomoc w codziennym gotowaniu, bez technologicznego dystansu i bez wrażenia kolejnego zimnego narzędzia AI. Obecny frontend jest mocno oparty o język SaaS/AI: slate, indigo, fiolety, gradienty, glow i `Space Grotesk`. Direction A przenosi produkt w stronę ciepłego polskiego domu: pergamin, kremowy papier, notes z przepisami, terracotta, bazylia, spokojna typografia i klimat "jak u babci, ale w telefonie".

To nie jest kopiowanie prototypu 1:1. Pliki HTML/JSX z Claude Design są referencją wizualną i produktową. Implementacja ma zachować obecny routing, API, React Query, Zustand, store'y, kontrakty danych, flow generowania posiłku i przepisu, dark mode, responsywność oraz obsługę błędów.

Najważniejsza korekta względem prototypu: produkcyjnie nie używamy Fraunces/Inter jako głównej pary. Zgodnie z handoffem Direction A docelowa typografia to:

- `Source Serif 4` dla nagłówków i display.
- `Source Sans 3` dla UI i tekstu bazowego.
- `Outfit` jako font brandowy dla logo, nazw kart i krótkich tytułów produktowych.
- `Caveat` tylko jako oszczędny, dekoracyjny kicker.
- `JetBrains Mono` dla liczb, ilości i elementów wymagających tabularnego rytmu.

Decyzja typograficzna po review Etapu 4: `Outfit` zostaje jako font brandowy dla logo, nazw kart i krótkich tytułów produktowych. `Source Serif 4` pozostaje dla display/hero/recipe editorial headings, a `Source Sans 3` dla tekstu UI i body.

## 2. Pliki referencyjne

| Plik | Rola w redesignie | Jak używać |
|---|---|---|
| `docs/redesign/direction-a/README.md` | Główny handoff Direction A | Źródło decyzji o typografii, tokenach, dark mode, responsywności, motion i a11y. |
| `docs/redesign/direction-a/Logo Concepts.html` | Koncepcje logo | Referencja dla nowego logo. Rekomendacja handoffu: Concept 02, Spoon monogram. |
| `docs/redesign/direction-a/directions/direction-a.jsx` | Prototyp ekranów Direction A | Referencja layoutów: landing, dashboard, generator, suggestions, recipe, chat, mobile. Nie kopiować kodu 1:1. |
| `docs/redesign/direction-a/directions/shared.jsx` | Pomocnicze elementy prototypu | Referencja dla placeholderów i wzorców, ale nie kopiować `GenieMark` jako logo produkcyjnego. |
| `docs/redesign/direction-a/MealGenie Directions.html` | Pełny canvas kierunków | Kontekst wizualny i porównawczy. Implementujemy tylko Direction A. |

## 3. Mapowanie Direction A na obecny frontend

### Foundation i shell

| Obszar | Obecne pliki | Planowana zmiana |
|---|---|---|
| Globalne style | `frontend/src/index.css`, `frontend/tailwind.config.js` | Dodać tokeny Direction A, fonty, tło parchment/hearth dark, focus ringi i reduced motion. Zachować Tailwind v4 i obecny setup z `@import "tailwindcss"` oraz `@config`. |
| Root aplikacji | `frontend/src/App.tsx` | Zmienić tylko warstwę tła/dekoracji i ewentualny skip-link. Nie zmieniać tras, redirectów ani guardów. |
| Nawigacja | `frontend/src/components/Header.tsx` | Przestylować na cream paper nav, nowe logo, spokojne linki, pill buttons, poprawne focus states. |
| Layout zalogowany | `frontend/src/components/AuthenticatedLayout.tsx` | Ewentualnie dodać `PaperTexture`, bez zmiany `Outlet`, `DashboardBackLink` i `ChatDrawer`. |
| Theme | `frontend/src/components/ThemeToggle.tsx`, `frontend/index.html` | Uspójnić dark mode z tokenami. Dodać no-FOUC script tylko jeśli robimy to jako osobny, kontrolowany krok. |

### Ekrany i komponenty produktowe

| Direction A | Obecny frontend | Decyzja implementacyjna |
|---|---|---|
| `A_LandingHero` | `HomePage.tsx`, `Header.tsx`, `MealCard.tsx` | Landing przebudować na hero z pergaminem, serifowym H1, kartą przepisu jako kartką z notesu. Landing robić później, gdy atomy i karty są stabilne. |
| `A_Dashboard` | `DashboardPage.tsx`, `MealHistoryCard.tsx`, `shoppingListStore.ts` | Zachować React Query, historię, ulubione i listę zakupów. Zmienić layout na ciepły dashboard: powitanie, plan tygodnia, karta zakupów, szybkie pomysły. |
| `A_Generator` | `GeneratorPage.tsx`, `GuestGeneratorPage.tsx`, `MealGenerator.tsx`, `TagInput.tsx` | Zachować cały stan, payloady i mutacje API. Przełożyć UI na kroki: składniki, czas, dla kogo. |
| `A_Suggestions` | `MealGenerator.tsx`, `MealCard.tsx` | Nie tworzyć osobnej trasy. To jest `SuccessView` w `MealGenerator`. |
| `A_Recipe` | `RecipePage.tsx`, `SharedRecipePage.tsx`, `RecipeSections.tsx`, `RecipeLoadingWithPreview.tsx` | Zachować generowanie, historię, favorite, share, PDF, chat. Przebudować warstwę prezentacji: zdjęcie, serifowe tytuły, dotted rows, semantyczne kroki. |
| `A_Chat` | `ChatDrawer.tsx`, `chatStore.ts`, `types/chat.ts`, `services/api.ts` | Modyfikować tylko komponent UI. Store, typy i endpoint zostają. Drawer docelowo z prawej na desktopie i jako full-screen/bottom sheet na mobile. |
| `A_Mobile` | Responsywność powyższych ekranów, później `MobilePage.tsx` | Traktować jako wzorzec responsywny. Marketingowa strona APK może dostać polish pass na końcu. |
| Biblioteka przepisów | `RecipesPage.tsx`, `MealHistoryCard.tsx` | Nie ma osobnego artboardu, ale ekran powinien odziedziczyć nowy styl kart i foundation. |

## 4. Etapy implementacji

### Etap 0 - Przygotowanie i zasady

Cel: zamknąć decyzje i ustawić bezpieczne granice.

Zakres:

- Potwierdzić, że redesign dotyczy tylko frontendu.
- Nie dotykać backendu, Prisma, Docker, Caddy, nginx, deploymentu ani endpointów.
- Nie instalować zależności.
- Ustalać zmiany w małych PR-ach.

Checklist testowy:

- Sprawdzić `frontend/package.json`, żeby wiedzieć, jakie skrypty są dostępne.
- Sprawdzić `git diff` przed każdym PR-em.
- Upewnić się, że zmiany nie dotykają `backend/`, `frontend/src/services/api.ts`, store'ów i typów bez osobnej decyzji.

### Etap 1 - Foundation: tokeny, fonty, motyw, a11y baseline

Cel: wprowadzić Direction A jako system, zanim ruszymy ekrany.

Warunek startowy:

- Przed rozpoczęciem PR 2 ponownie sprawdzić aktualny setup Tailwinda i Vite w `frontend/package.json`, `frontend/src/index.css`, `frontend/tailwind.config.js` oraz `frontend/vite.config.ts`. Na dzień 2026-05-06 projekt używa Tailwind v4 przez `@tailwindcss/vite`, `@import "tailwindcss"` i `@config "../tailwind.config.js"`, a dark mode jest klasowy przez `.dark`. Foundation ma być wdrażany na podstawie aktualnych plików, nie z pamięci ani z klasycznego setupu Tailwind v3.

Zakres:

- Dodać tokeny CSS dla powierzchni, tekstu, brandu, borderów, radiusów, cieni i motion.
- Wprowadzić typografię:
  - `Source Serif 4`,
  - `Source Sans 3`,
  - `Caveat`,
  - `JetBrains Mono`.
- Ustawić `html lang="pl"` w `frontend/index.html`.
- Dodać globalny `prefers-reduced-motion`.
- Dodać wspólny focus ring: 2px `--accent` z offsetem.
- Zastąpić globalny klimat slate/indigo/fuchsia tłem parchment/hearth dark.
- Zachować istniejący mechanizm dark mode albo przepiąć go w osobnym, kontrolowanym commicie. Nie mieszać obu naraz.

Checklist testowy:

- `npm run build` w `frontend`, jeśli środowisko pozwala.
- Light mode i dark mode po reloadzie.
- Brak poziomego overflow na mobile.
- Test polskich znaków: `ąęćłńóśźż` oraz `PIEROGI Z KOPERKIEM`.
- Focus widoczny na linkach, buttonach i inputach.
- `prefers-reduced-motion: reduce` ogranicza animacje.

### Etap 2 - Atomy UI

Cel: stworzyć małe, powtarzalne elementy, aby ekrany nie miały duplikowanych klas.

Nowe komponenty rekomendowane w `frontend/src/components/ui/`:

- `Button.tsx` - warianty `primary`, `secondary`, `ghost`, `pill`.
- `IconButton.tsx` - dla przycisków ikonowych z wymaganym `aria-label`.
- `Card.tsx` albo `PaperCard.tsx` - warianty `paper`, `sunken`, `dark`.
- `Input.tsx`, `Textarea.tsx` - z label API, `aria-invalid`, `aria-describedby`.
- `Switch.tsx` - `role="switch"`, `aria-checked`.
- `PillGroup.tsx` - grupa opcji z semantyką `fieldset/legend` albo `role="group"`.
- `Eyebrow.tsx` - małe uppercase label.
- `HandwrittenKicker.tsx` - `Caveat`, tylko dekoracyjnie.
- `FolkDivider.tsx` - dekoracyjny SVG z `aria-hidden="true"`.
- `DottedRow.tsx` - składnik plus ilość z dotted leader.
- `Badge.tsx` - m.in. `Polecane`.
- `MealEmoji.tsx` - fallback, gdy brak zdjęcia.

Uwaga: w `package.json` nie ma `clsx`. Nie instalować. Jeśli helper klas będzie potrzebny, dodać prosty lokalny helper albo użyć template stringów.

Checklist testowy:

- Każdy focusable ma widoczny `focus-visible`.
- Komponenty ikonowe mają `aria-label`.
- Touch targety na mobile mają minimum 44x44px.
- `FolkDivider` jest dekoracyjny i ukryty dla czytników.
- `HandwrittenKicker` nie jest jedynym nośnikiem informacji.
- Komponenty działają w light i dark mode.

### Etap 3 - Logo, header i shell

Cel: nadać aplikacji pierwszy widoczny sygnał Direction A bez zmiany flow.

Zakres:

- Dodać nowe logo jako inline SVG lub komponent `Logo`.
- Jako domyślny kierunek przyjąć `Concept 02 - Spoon monogram`, dopóki Marek nie wybierze inaczej.
- Przestylować `Header.tsx`:
  - cream paper,
  - terracotta/brown,
  - linki bez gradientowego SaaS feel,
  - auth action jako pill,
  - mobile menu z poprawnym focus i ESC.
- Przestylować globalne tło w `App.tsx`.
- Zachować wszystkie istniejące linki i warunki `token`.

Checklist testowy:

- Linki nadal prowadzą do tych samych tras.
- Header działa dla guest i authenticated.
- `/shared/:shareId` nadal nie dostaje globalnego headera.
- Mobile menu jest obsługiwalne klawiaturą.
- Theme toggle działa tak samo na publicznych i zalogowanych widokach.

### Etap 4 - Karty posiłków i historii

Cel: szybko przenieść dużą część UI w Direction A, bo karty są używane w wielu miejscach.

Zakres:

- Przebudować `MealCard.tsx` na papierową kartę przepisu:
  - obraz lub fallback,
  - serifowy tytuł,
  - delikatny opis,
  - dotted meta row,
  - terracotta CTA.
- Przebudować `MealHistoryCard.tsx`:
  - zachować link do `/recipe/:id`,
  - zachować delete mutation i invalidację React Query,
  - poprawić `aria-label` dla usuwania.
- Nie zmieniać `MealSuggestion`, `MealHistoryItem` ani składania URL-i obrazków.

Checklist testowy:

- Landing sample cards renderują się poprawnie.
- Generator success cards działają.
- Dashboard recent/favorites działają.
- `RecipesPage` pokazuje historię.
- Obrazki z `/meal-images/...` nadal się ładują.
- Usuwanie historii nadal invaliduje query.

### Etap 5 - Recipe jako pierwszy pełny ekran produktowy

Cel: przebudować ekran o najwyższej wartości produktowej i najłatwiejszy do walidacji.

Zakres:

- `RecipePage.tsx`:
  - nowy hero ze zdjęciem i ciepłym overlayem,
  - serifowy tytuł,
  - meta cards,
  - sidebar/asystent w stylu Direction A.
- `RecipeSections.tsx`:
  - `IngredientsSection` jako `<ul role="list">`,
  - `StepsSection` jako `<ol>`,
  - numery kroków `aria-hidden="true"` lub CSS,
  - przyciski składników z konkretnym `aria-label`,
  - `DottedRow` dla składników tam, gdzie pasuje.
- `SharedRecipePage.tsx`:
  - odziedziczyć styl sekcji,
  - nie wymagać auth,
  - zachować `getSharedMeal`.
- Nie ruszać `generateFullRecipe`, `getMealById`, `toggleMealShare`, `toggleMealFavorite`, `downloadRecipePdf`.

Checklist testowy:

- Wejście z generatora do `/recipe`.
- Wejście z historii do `/recipe/:id`.
- Udostępnienie i otwarcie `/shared/:shareId` bez tokena.
- Favorite on/off.
- Export PDF z obrazkiem.
- Dodanie/usunięcie składników z listy zakupów.
- Kroki są czytelne dla klawiatury i screen readera.
- Mobile fixed CTA nie zakrywa treści.

### Etap 6 - Generator i suggestions

Cel: przebudować główny flow generowania bez zmiany payloadów.

Zakres:

- `GeneratorPage.tsx` i `GuestGeneratorPage.tsx`:
  - nowe nagłówki Direction A,
  - usunięcie zimnych gradientów.
- `MealGenerator.tsx`:
  - zachować obecny state i `useMutation`,
  - zachować `generateMealSuggestions` i `guestGenerateMealSuggestions`,
  - zachować query paramy `mealType`, `prepTime`, `servingSize`,
  - UI ułożyć jako spokojny formularz krokowy:
    1. opis/składniki,
    2. czas,
    3. porcje/głód/sprzęt/typ posiłku.
- `SuccessView` potraktować jako implementację `A_Suggestions`.
- `TagInput.tsx`:
  - powiązać label z inputem,
  - zapewnić nazwę dostępną nawet gdy label wizualny jest pusty,
  - minimum 44px dla przycisku usuwania/dodawania.

Checklist testowy:

- Guest `/try` generuje 3 propozycje.
- Guest limit 429 pokazuje poprawny error.
- Auth `/generator` generuje propozycje.
- Wybór dania przechodzi do `/recipe` ze stanem `teaser`.
- Parametry query nadal ustawiają formularz.
- Thermomix switch ma `role="switch"` i `aria-checked`.
- Range inputy mają programowe etykiety.
- Loader i error states są zgodne z nowym stylem.

### Etap 7 - Dashboard i Recipes

Cel: przebudować centrum aplikacji, zachowując dane i akcje.

Zakres:

- `DashboardPage.tsx`:
  - nowy greeting w stylu Direction A,
  - karta startu generatora,
  - karta asystenta,
  - lista zakupów jako ciepła karta,
  - historia i ulubione przez nowe karty.
- Zachować:
  - `getMealHistory`,
  - query keys,
  - `useShoppingListStore`,
  - `openGlobalChat`,
  - eksport listy zakupów.
- `RecipesPage.tsx`:
  - nowy header i puste/error/loading states,
  - odziedziczone nowe `MealHistoryCard`.

Checklist testowy:

- Dashboard po zalogowaniu.
- Empty states dla braku historii.
- Recent/favorites.
- Lista zakupów: toggle, clear, export.
- Linki do generatora, settings i recipes.
- Chat z dashboardu.
- Mobile layout bez overflow.

### Etap 8 - Chat drawer

Cel: przebudować chat jako bezpieczny, dostępny drawer.

Zakres:

- `ChatDrawer.tsx`:
  - wygląd Direction A,
  - drawer z prawej na desktopie,
  - full-screen albo bottom-sheet na mobile,
  - spokojny motion 320ms ease-out, bez springów,
  - `role="dialog" aria-modal="true"` albo `<dialog>`,
  - focus trap,
  - ESC zamyka,
  - powrót focusu po zamknięciu,
  - `aria-labelledby`,
  - wiadomości w `role="log" aria-live="polite"`,
  - close button jako pierwszy focus po otwarciu,
  - input jako ostatni element w trapie.
- Zachować:
  - `chatWithAssistant`,
  - `useChatStore`,
  - tryb globalny i recipe,
  - historię wiadomości.

Checklist testowy:

- Otwieranie z headera, dashboardu i recipe.
- Global chat i recipe chat.
- Wysyłka Enter, nowa linia Shift+Enter.
- Loading state.
- Error state.
- ESC zamyka.
- Focus wraca do przycisku, który otworzył chat.
- Backdrop nie zamyka przypadkowo podczas pisania.
- Screen reader dostaje nowe wiadomości bez przerwania użytkownika.

### Etap 9 - Landing i MobilePage

Cel: dopracować powierzchnie marketingowe na końcu, gdy system UI jest już stabilny.

Zakres:

- `HomePage.tsx`:
  - hero Direction A,
  - nowy claim,
  - karta przepisu jako kartka z notesu,
  - sekcje poniżej w ciepłym stylu, bez dużych tech-gradientów.
- `MobilePage.tsx`:
  - dopasować kolory i typografię do Direction A,
  - nie wymieniać jeszcze `public/mobile-screens/*`, dopóki realne ekrany nie są gotowe.
- Zachować:
  - linki `/try`, `/login`, `/onboarding`,
  - APK download i QR.

Checklist testowy:

- Guest landing.
- Linki CTA.
- `/mobile` i download APK.
- QR i screenshoty nadal ładują się z `public/`.
- Mobile 320/375/768.
- Dark mode.

## 5. Proponowana kolejność PR-ów i commitów

### PR 1 - Plan redesignu

Zakres:

- Dodać `docs/redesign/MEALGENIE_UI_REDESIGN_PLAN.md`.
- Opcjonalnie w osobnym commicie/PR uaktualnić `AGENTS.md` o zasady redesignu.

Testy:

- Review dokumentu.
- Brak zmian runtime.

### PR 2 - Foundation Direction A

Zakres:

- Przed zmianami potwierdzić aktualny setup Tailwinda/Vite w repo: Tailwind v4, `@tailwindcss/vite`, `@import "tailwindcss"`, `@config "../tailwind.config.js"` i klasowy dark mode `.dark`.
- Tokeny, fonty, globalne style, `html lang="pl"`, focus ring, reduced motion.
- Bez zmian ekranów produktowych poza minimalnym tłem root.

Testy:

- `npm run build`.
- Light/dark reload.
- Mobile overflow.

### PR 3 - Atomy UI

Zakres:

- `Button`, `IconButton`, `Card`, `Input`, `Textarea`, `Switch`, `PillGroup`.
- `Eyebrow`, `HandwrittenKicker`, `FolkDivider`, `DottedRow`, `Badge`, `MealEmoji`.

Testy:

- Manual smoke w Story-like page nie jest wymagany, ale komponenty muszą być używalne bez side effects.
- Keyboard/focus.

### PR 4 - Logo, header, shell

Zakres:

- Logo.
- Header.
- Shell background.
- Skip-link, jeśli nie wszedł w PR 2.

Testy:

- Guest/auth nav.
- Mobile menu.
- Shared route bez headera.

### PR 5 - Karty

Zakres:

- `MealCard`.
- `MealHistoryCard`.
- Fallback obrazków.

Testy:

- Landing sample.
- Generator success.
- Dashboard.
- Recipes.

### PR 6 - Recipe

Zakres:

- `RecipePage`.
- `SharedRecipePage`.
- `RecipeSections`.
- Recipe loading polish pass, jeśli mieści się bezpiecznie.

Testy:

- Generate recipe.
- History recipe.
- Shared recipe.
- Favorite/share/PDF/shopping list.

### PR 7 - Generator

Zakres:

- `GeneratorPage`.
- `GuestGeneratorPage`.
- `MealGenerator`.
- `TagInput`.

Testy:

- Guest flow.
- Auth flow.
- Query params.
- Error/loading/success.

### PR 8 - Dashboard i Recipes

Zakres:

- `DashboardPage`.
- `RecipesPage`.
- Empty/error/loading states.

Testy:

- Historia, ulubione, lista zakupów, export, chat entry.

### PR 9 - Chat drawer

Zakres:

- `ChatDrawer` visual + a11y.
- Bez zmian store/API.

Testy:

- Global chat, recipe chat, keyboard trap, ESC, return focus, mobile.

### PR 10 - Landing i MobilePage

Zakres:

- `HomePage`.
- `MobilePage`.
- Finalny visual QA.

Testy:

- Guest acquisition flow.
- APK page.
- Mobile/dark/reduced motion.

## 6. Zasady bezpieczeństwa

Tych rzeczy redesign nie rusza bez osobnego planu i review:

- Backend: cały `backend/`.
- Prisma, migracje, baza danych.
- Endpointy i kontrakty API.
- `frontend/src/services/api.ts`.
- `frontend/src/types/meal.ts` i `frontend/src/types/chat.ts`.
- Store'y:
  - `frontend/src/store/authStore.ts`,
  - `frontend/src/store/chatStore.ts`,
  - `frontend/src/store/shoppingListStore.ts`,
  - `frontend/src/store/notificationStore.ts`.
- Routing i guardy w sensie kontraktu:
  - `/`,
  - `/login`,
  - `/try`,
  - `/mobile`,
  - `/shared/:shareId`,
  - `/dashboard`,
  - `/onboarding`,
  - `/settings`,
  - `/recipes`,
  - `/generator`,
  - `/recipe/:id`,
  - `/recipe`.
- `BrowserRouter` i SPA fallback.
- `VITE_API_URL`, Docker, Caddy, nginx, deployment.
- Składanie URL-i obrazków.
- `public/mobile-screens/*` do czasu zakończenia realnego redesignu.
- Instalowanie zależności.

Szczególne ryzyko produkcyjne: `VITE_API_URL`, `/api`, `/meal-images` i `handle_path` są powiązanym kontraktem. Nie zmieniać ich przy redesignie UI. Aplikacja może wyglądać poprawnie, ale logowanie, generowanie lub obrazki mogą przestać działać dopiero po deployu.

## 7. Checklisty testowe zbiorcze

### Foundation

- Build frontendu.
- Light/dark mode.
- Reload strony po zmianie motywu.
- Brak FOUC lub akceptowalny stan przejściowy przed osobnym no-FOUC fixem.
- `html lang="pl"`.
- Polskie znaki w display i body.
- Reduced motion.
- Focus ring na każdym focusable.

### Routing

- `/`.
- `/try`.
- `/login`.
- `/mobile`.
- `/dashboard`.
- `/generator`.
- `/recipes`.
- `/recipe`.
- `/recipe/:id`.
- `/shared/:shareId`.
- Direct refresh na trasach chronionych i publicznych.
- Fallback `path="*"` nadal przekierowuje zgodnie z obecnym zachowaniem.

### Generator

- Guest flow.
- Auth flow.
- Query paramy.
- Loading.
- Error.
- Success suggestions.
- Wybór dania.
- Brak zmian payloadów.

### Recipe

- Generowany przepis.
- Przepis z historii.
- Udostępniony przepis bez tokena.
- Favorite.
- Share enable/copy/disable.
- PDF export.
- Add/remove shopping items.
- Obrazek z backendu.

### Chat

- Open global chat.
- Open recipe chat.
- Send message.
- Error response.
- Clear session.
- Close button.
- ESC.
- Focus trap.
- Return focus.
- `role="log" aria-live="polite"`.

### Mobile i accessibility

- 320px.
- 375px.
- 768px.
- Touch targets minimum 44px.
- Brak poziomego overflow.
- Fixed CTA nie zakrywa treści.
- Forms mają programowe labelki.
- Recipe steps jako `<ol>`.
- Ingredient list jako `<ul role="list">`.
- Ikonowe buttony mają `aria-label`.

### Produkcja

- Build z produkcyjnym `VITE_API_URL`.
- Login/register w Network.
- Generator guest i auth w Network.
- Obrazki z historii i przepisu.
- `/shared/:shareId` w prywatnym oknie.
- PDF z obrazkiem.
- Dark mode na shared page.

## 8. Ryzyka i ograniczanie ryzyka

| Ryzyko | Objaw | Mitigacja |
|---|---|---|
| Hybryda starego i nowego UI | Ekrany mieszają indigo/fuchsia z parchment/terracotta | Najpierw foundation i atomy, potem ekrany. Nie robić page rewrite bez komponentów bazowych. |
| Kopiowanie prototypu 1:1 | Kod inline-style, Fraunces/Inter, niedopasowane do repo | Traktować JSX/HTML jako referencję. Implementować w obecnym React/Tailwind/TypeScript. |
| Słaba typografia polska | Nierówne diakrytyki, zły display | Użyć Source Serif 4 i Source Sans 3. Test `ąęćłńóśźż`. |
| Dark mode robi się zimny | Powrót do tech dark `#020617` i indigo glow | Użyć hearth dark: ciepłe brązy, kremowy tekst, jaśniejsza terracotta. |
| FOUC motywu | Flash jasnego/ciemnego motywu przed hydracją | W osobnym kroku dodać inline script w `index.html`, jeśli zmieniamy theme API. |
| Chat drawer niedostępny | Focus ucieka pod drawer, ESC nie działa | Potraktować chat jako osobny PR a11y z focus trap i `aria-modal`. |
| Zepsucie API/obrazków | `/api/api`, brak obrazków, błędy logowania | Nie dotykać `services/api.ts`, `VITE_API_URL`, Caddy/nginx i URL-i obrazków. |
| Duże PR-y trudne do review | Trudno znaleźć regresje | Małe PR-y według kolejności z tego planu. |
| Brak reduced motion | Animacje męczą lub łamią preferencje systemowe | Globalny CSS plus `useReducedMotion()` dla Framer Motion w ryzykownych miejscach. |
| Za małe mobile targety | Trudne tapnięcia i błędy a11y | Minimum 44x44px dla inputów, chipów i buttonów ikonowych. |
| Shared recipe przypadkiem chronione | Link publiczny wymaga logowania | Testować `/shared/:shareId` w prywatnym oknie po każdym recipe/shell PR. |

## 9. Plan pracy z subagentami

Środowisko Codex obsłużyło subagentów. Role wykonały audyt read-only i nie modyfikowały plików.

### `audytor_design_systemu`

Wnioski:

- Direction A to wymiana fundamentu UI, nie kosmetyczny reskin.
- Najpierw tokeny, fonty, dark mode i komponenty bazowe.
- W tokenach muszą być powierzchnie, ink, brand, border, radiusy, cienie, motion i fonty.
- Rekomendowany pierwszy krok: foundation plus atomy, dopiero potem ekrany.

Do planu trafia:

- Wdrożenie token-first.
- Source Serif 4 / Source Sans 3 zamiast Fraunces/Inter.
- Concept 02 jako domyślna rekomendacja logo.
- Unikanie mieszania starego indigo UI z nowym systemem.

### `mapper_frontendu`

Wnioski:

- Direction A mapuje się na istniejące pliki bez zmiany routingu i warstwy danych.
- `A_Suggestions` nie jest osobną trasą, tylko success state w `MealGenerator`.
- Największe punkty pracy: `MealGenerator`, `RecipePage`, `DashboardPage`, `ChatDrawer`.
- Najrozsądniejszy start: foundation + atomy + karty.

Do planu trafia:

- Szczegółowe mapowanie Direction A na realne pliki.
- Kolejność: foundation, atomy, header, karty, recipe, generator, dashboard, chat, landing.
- Zakaz ruszania store'ów, typów, API i zależności.

### `audytor_accessibility`

Wnioski:

- Największy blocker a11y to `ChatDrawer`.
- Formularze często mają wizualne labelki bez programowego powiązania.
- Recipe steps powinny być `<ol>`, obecnie są renderowane jako `div`.
- Brakuje globalnego reduced motion.
- `index.html` ma `lang="en"`, a aplikacja jest po polsku.

Do planu trafia:

- `html lang="pl"`.
- Globalny reduced motion.
- Focus ring jako część foundation.
- `IconButton`, `Input`, `Switch`, `PillGroup` z wbudowaną semantyką.
- Chat drawer jako dialog z focus trap, ESC i `aria-live`.
- Recipe steps jako `<ol>`, ingredients jako `<ul role="list">`.

### `audytor_ryzyka_produkcji`

Wnioski:

- Redesign jest bezpieczny, jeśli zostaje w warstwie JSX/Tailwind.
- Wysokie ryzyko zaczyna się przy `VITE_API_URL`, routingu, auth storage i URL-ach obrazków.
- Produkcyjny kontrakt `/api` i `/meal-images` jest delikatny.
- `/shared/:shareId` musi pozostać publiczne i bez globalnego headera.

Do planu trafia:

- Twarde zasady "czego nie ruszać".
- Produkcyjne checklisty dla API, obrazków, shared page i direct refresh.
- Zakaz zmian deploymentu w tym zadaniu.

## 10. Status prac

Ta sekcja powinna być aktualizowana po każdym etapie.

| Etap | Status | Data | Notatki |
|---|---|---|---|
| Plan redesignu | Gotowe do review | 2026-05-06 | Utworzono plan wdrożenia Direction A. |
| Etap 1 - Foundation | Gotowe do review | 2026-05-06 | Wprowadzono tokeny Direction A, fonty, globalny focus ring, reduced motion i ciepłe tło light/dark. |
| Etap 2 - Atomy UI | Gotowe do review | 2026-05-06 | Dodano bazowe atomy Direction A w `frontend/src/components/ui/`: Button, IconButton, Card, Input, Textarea, Switch, PillGroup, Eyebrow, HandwrittenKicker, FolkDivider, DottedRow, Badge i MealEmoji, plus lokalny helper `cn` oraz eksport barrel. |
| Etap 3 - Logo, header, shell | Nie rozpoczęto | - | Zależy od atomów. |
| Etap 4 - Karty | Nie rozpoczęto | - | `MealCard` i `MealHistoryCard`. |
| Etap 5 - Recipe | Nie rozpoczęto | - | Pierwszy pełny ekran produktowy. |
| Etap 6 - Generator | Nie rozpoczęto | - | Zachować payloady i mutacje. |
| Etap 7 - Dashboard i Recipes | Nie rozpoczęto | - | Zachować query/store. |
| Etap 8 - Chat drawer | Nie rozpoczęto | - | Osobny nacisk na a11y. |
| Etap 9 - Landing i MobilePage | Nie rozpoczęto | - | Na końcu, po stabilizacji komponentów. |

## 11. Pierwszy mały krok po zaakceptowaniu planu

Pierwszy mały krok implementacyjny:

W osobnym PR-ze wdrożyć tylko foundation Direction A w frontendzie:

- dodać tokeny CSS dla kolorów, fontów, radiusów, cieni, motion i focusu,
- załadować `Source Serif 4`, `Source Sans 3`, `Caveat`, `JetBrains Mono`,
- ustawić `html lang="pl"`,
- dodać globalny `prefers-reduced-motion`,
- ustawić ciepłe tło light/dark,
- nie zmieniać routingu, API, store'ów, payloadów, backendu ani deploymentu.

Akceptacja tego kroku:

- frontend buduje się poprawnie,
- dotychczasowe ekrany nadal działają,
- light/dark mode działa,
- nie ma zmian w kontraktach danych,
- `git diff` pokazuje tylko foundation i ewentualnie minimalny root styling.
