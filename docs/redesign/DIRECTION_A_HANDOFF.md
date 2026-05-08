# Direction A - handoff i tracker prac

Ten plik jest zrodlem kontekstu dla kolejnych modeli pracujacych nad redesignem MealGenie w kierunku Direction A.

Cel pliku:

- pokazac aktualny status bez wklejania calego audytu do rozmowy,
- utrzymac kolejke kolejnych PR-ow,
- zapisac decyzje produktowe,
- jasno oznaczyc czego nie ruszac,
- dac kolejnemu modelowi gotowy kontekst do kontynuacji.

## 1. Aktualny status

Branch bazowy redesignu:

```text
redesign/direction-a
```

Aktualny branch roboczy:

```text
feat/pause-mobile-page
```

Zrobione:

| Obszar | Status | Uwagi |
| --- | --- | --- |
| Foundation Direction A | Gotowe | Tokeny, fonty, tlo, focus ring, reduced motion. |
| Atomy UI | Gotowe | `Button`, `Card`, `Input`, `Badge`, `HandwrittenKicker`, `FolkDivider`, itd. |
| Generator | Gotowe | UI Direction A, bez zmiany kontraktow API. |
| Dashboard i Recipes | Gotowe | UI Direction A. |
| Recipe | Gotowe | UI Direction A, zachowane favorite/share/PDF/chat/shared view. |
| Chat drawer | Gotowe | UI Direction A + focus trap, ESC, return focus. |
| Landing | Gotowe / merged | PR #22: `feat/ui-redesign-landing-page` -> `redesign/direction-a`. |
| Mobile roadmap | W trakcie | Branch `feat/pause-mobile-page`; mobile jako roadmap item, nie gotowa apka. |

Nastepny duzy etap po mobile:

```text
Auth redesign: /login i /login?mode=register
```

## 2. Decyzje produktowe

### Mobile

Pierwotna rekomendacja audytu brzmiala: schowac `/mobile` z UI i zostawic direct route z komunikatem paused.

Po rozmowie decyzja zostala doprecyzowana:

- `/mobile` zostaje jako route.
- Link `Mobile` wraca do headera.
- Desktop header pokazuje `Mobile` z malym badge'em `plan`.
- Mobile menu pokazuje `Aplikacja mobilna` z badge'em `w planach`.
- Footer nie linkuje do `/mobile`.
- Strona `/mobile` nie pokazuje APK, QR, screenshotow ani Google Play promise.
- Komunikat na `/mobile` ma mowic: mobile jest na roadmapie, ale web ma priorytet.
- Nie obiecywac daty, APK, sklepu ani premiery.
- Nie dodawac mechanizmu popytu, waitlisty, mailto, formularza, endpointu ani analityki.
- Assety zostaja w repo:
  - `public/downloads/mealgenie.apk`
  - `public/qr-mobile.png`
  - `public/mobile-screens/*`

### Ton komunikacji

Marek pracuje nad aplikacja samodzielnie.

Copy produktowe powinno uzywac liczby pojedynczej, gdy mowi o pracy autora:

- `pracuję`
- `dopracowuję`
- `skupiam się`

Unikac:

- `pracujemy`
- `dopracowujemy`
- `skupiamy się`
- `planujemy`

Wyjatek: neutralne, techniczne notatki w dokumentacji moga uzywac form zespolowych tylko jesli nie sa copy produktowym, ale preferowana jest konsekwencja jednoosobowa.

## 3. Pelny audyt - skrot wykonawczy

### 3.1. Co jest juz zrobione dobrze

Redesign nie jest tylko kosmetyka. Wdrozone sa fundamenty:

- tokeny Direction A,
- fonty,
- `html lang="pl"`,
- globalny focus ring,
- reduced motion,
- cieple tla light/dark,
- mapowanie tokenow w Tailwindzie.

Glowne ekrany produktowe sa juz w nowym kierunku:

- recipe,
- generator,
- dashboard,
- recipes,
- chat drawer,
- landing.

Wazne: dotychczasowe redesigny nie rozbily flow UI -> API -> baza/AI -> UI.

Landing jest nowym frontem produktu:

- spokojny, domowy, praktyczny ton,
- claim o codziennej decyzji posilkowej,
- zwykle skladniki,
- preferencje jako zasady,
- brak sponsorowanych dan,
- przepis/lista/asystent pod reka.

Istnieja bazowe atomy UI:

- `Button`
- `IconButton`
- `Card`
- `Input`
- `Textarea`
- `Switch`
- `PillGroup`
- `Eyebrow`
- `HandwrittenKicker`
- `FolkDivider`
- `DottedRow`
- `Badge`
- `MealEmoji`

Kolejne ekrany powinny korzystac z tych atomow zamiast pisac osobne style od zera.

Routing jest stabilny:

- `/`
- `/login`
- `/try`
- `/mobile`
- `/shared/:shareId`
- chronione trasy przez `ProtectedRoute` i `AuthenticatedLayout`

Nie ruszac routingu glebiej bez potrzeby.

### 3.2. Co nadal odstaje

Najwiekszy dysonans po landingu:

```text
/login i /login?mode=register
```

Obecny login ma dobra logike, ale stary wyglad:

- indigo/violet/fuchsia,
- glassmorphism,
- zewnetrzny noise URL,
- stare focusy,
- `ChefHat` jako stare logo,
- martwe `Zapomniałeś hasła?`.

Po rejestracji uzytkownik trafia dalej do onboardingu, wiec po auth nastepny zgrzyt to:

- `OnboardingPage`
- `OnboardingForm`
- `SettingsPage`
- `MultiSelectPills`

`OnboardingForm` jest szczegolnie wazny, bo zasila onboarding i settings.

Globalne resztki:

- `NotificationContainer` jest jeszcze w starszym stylu.
- `App.css` wyglada jak Vite boilerplate i powinno zostac sprawdzone pozniej.

## 4. Kolejka PR-ow

| Kolejnosc | PR | Branch | Status | Cel |
| --- | --- | --- | --- | --- |
| 1 | Landing redesign | `feat/ui-redesign-landing-page` | Merged | Pelny landing Direction A. |
| 2 | Mobile roadmap page | `feat/pause-mobile-page` | In progress | Mobile jako roadmap/web-first, bez APK/QR w UI. |
| 3 | Auth redesign | `feat/auth-direction-a` | Next | `/login` i `/login?mode=register` w Direction A. |
| 4 | Onboarding + Settings | TBD | Planned | Wspolny refaktor preferencji i formularzy. |
| 5 | Notifications + cleanup | TBD | Planned | Global polish i sprzatanie. |
| 6 | Final QA + release candidate | TBD | Planned | Pelny flow guest/auth/public/mobile/dark. |
| 7 | Merge Direction A do master | TBD | Later | Dopiero po QA. |
| 8 | Mobile comeback | TBD | Future | Osobny temat, jesli Marek zdecyduje sie budowac mobile. |

## 5. PR 2 - Mobile roadmap page

Aktualny branch:

```text
feat/pause-mobile-page
```

Zakres:

- Header:
  - link `Mobile`,
  - badge `plan` w desktop nav,
  - `Aplikacja mobilna` + `w planach` w mobile menu.
- Footer:
  - bez linku do mobile.
- `/mobile`:
  - nowy ekran Direction A,
  - roadmap/web-first,
  - bez APK, QR, screenshotow i Google Play.
- Docs:
  - `MEALGENIE_UI_REDESIGN_PLAN.md` zaktualizowany.

Acceptance:

- Desktop header pokazuje `Mobile` + `plan`.
- Mobile menu pokazuje `Aplikacja mobilna` + `w planach`.
- Footer nie pokazuje mobile.
- `/mobile` dziala z direct linka.
- `/mobile` nie linkuje do APK, QR ani screenshotow.
- Copy nie obiecuje daty, APK ani sklepu.
- Mobile 320/375/768 bez overflow.
- Dark mode wyglada spojnie.
- `git diff --check`.

## 6. PR 3 - Auth redesign

Nastepny rekomendowany PR:

```text
feat/auth-direction-a
```

Cel:

```text
Przebudowac /login i /login?mode=register na Direction A.
```

Zachowac:

- `useSearchParams`,
- `mode` jako `login | register`,
- obsluge `/login?mode=register`,
- `loginSchema`,
- `registerSchema`,
- `loginUser`,
- `registerUser`,
- `useAuthStore.setAuth`,
- `notify`,
- `showPassword`,
- obsluge bledow,
- kontrakty API.

Zmienic:

- usunac indigo/fuchsia gradienty,
- usunac glassmorphism,
- usunac zewnetrzny noise URL,
- usunac stare logo `ChefHat`,
- usunac stare klasy `slate`, `indigo`, `fuchsia`,
- usunac martwe `Zapomniałeś hasła?`,
- uzyc:
  - `Logo`,
  - `Card`,
  - `Badge`,
  - `Button`,
  - `Input`,
  - ewentualnie lokalnego wrappera dla password + eye toggle.

Redirect:

```ts
const hasCompletedOnboarding = Boolean(result.hasCompletedOnboarding);

setAuth(result.token, result.user, hasCompletedOnboarding);
navigate(hasCompletedOnboarding ? "/dashboard" : "/onboarding");
```

Acceptance:

- `/login` startuje w trybie logowania.
- `/login?mode=register` startuje w trybie rejestracji.
- Przelaczanie trybu aktualizuje query param.
- Bledy Zod pokazuja sie pod polami.
- Toggle hasla dziala i ma `sr-only`.
- Login usera z onboardingiem -> `/dashboard`.
- Login usera bez onboardingu -> `/onboarding`.
- Rejestracja nowego usera -> `/onboarding`.
- Brak reset password UI.

## 7. PR 4 - Onboarding + Settings

Cel:

```text
Po rejestracji uzytkownik nie powinien trafic w stary design.
```

Pliki glowne:

- `OnboardingPage.tsx`
- `OnboardingForm.tsx`
- `MultiSelectPills.tsx`
- `SettingsPage.tsx`

Kierunek:

- `OnboardingPage`:
  - usunac indigo glow,
  - uzyc `bg-bg`, `Card`, `Badge`, `HandwrittenKicker`,
  - headline w `font-brand`,
  - teksty w `text-ink-soft`.
- `OnboardingForm`:
  - usunac lokalne `inputStyles`/`labelStyles` oparte o indigo,
  - uzyc `Input`, `Textarea`, `PillGroup`, `Button`, `Card`,
  - podzielic formularz na spokojne sekcje:
    - `Jak jesz?`
    - `Czego unikać?`
    - `Jak gotujesz?`
    - `Budżet i ostrość`
- `MultiSelectPills`:
  - przepiac na `PillGroup` albo przestylowac na tokeny Direction A.
- `SettingsPage`:
  - usunac stary sidebar slate/indigo,
  - zrobic spokojna karte `Profil kulinarny`,
  - usunac albo wyraznie oznaczyc disabled `Dane logowania`.

Acceptance:

- Nowy user po rejestracji widzi onboarding w Direction A.
- Zapis preferencji dziala.
- Po zapisie redirect do dashboardu dziala.
- `/settings` pobiera i zapisuje preferencje.
- `TagInput` nadal dziala.
- Multi selecty maja focus i touch targety.
- Mobile 320/375 bez overflow.

## 8. PR 5 - Notifications + cleanup

Cel:

```text
Wyczyscic globalne elementy, ktore pojawiaja sie wszedzie.
```

Zakres:

- `NotificationContainer`:
  - `bg-bg-elevated`,
  - `border-border`,
  - `text-ink`,
  - mapowanie typow na `basil`, `bordeaux`, `saffron`, `accent`,
  - `aria-live`/`role`.
- `App.css`:
  - sprawdzic czy jest importowany,
  - usunac albo wyczyscic Vite boilerplate, jesli nic nie wnosi.
- Stare home komponenty:
  - nie usuwac pochopnie,
  - mozna usunac pozniej, jesli build/importy sa czyste.

## 9. Final QA + release candidate

Scenariusze:

### Guest

- `/`
- CTA do `/try`
- generacja
- CTA do rejestracji
- `/login?mode=register`
- rejestracja
- onboarding
- dashboard

### Auth

- login
- generator
- wybor dania
- recipe
- favorite/share/PDF/chat
- dashboard
- recipes
- settings

### Public

- `/shared/:shareId` bez tokena
- dark mode
- direct refresh

### Mobile/responsive

- 320 px
- 375 px
- 768 px
- brak poziomego overflow
- touch targety min. 44 px

### Produkcja

- login/register w Network
- guest generator
- auth generator
- obrazki
- shared link
- PDF

## 10. Czego nie ruszac przy tych PR-ach

Nie dotykac bez osobnej decyzji:

- backendu,
- Prisma,
- migracji,
- endpointow,
- `frontend/src/services/api.ts`,
- store'ow,
- `VITE_API_URL`,
- Docker/Caddy/nginx,
- skladania URL-i obrazkow,
- routingu produkcyjnego,
- `/api`,
- `/meal-images`.

Redesign ma byc bezpieczny dopoki zostaje w JSX/Tailwind i nie zmienia kontraktow danych.

## 11. Jak pracowac z tym trackerem

Po kazdym PR:

1. Zaktualizowac sekcje `Aktualny status`.
2. Przesunac status w tabeli PR-ow.
3. Dopisac decyzje produktowe, jesli takie zapadly.
4. Zaktualizowac sekcje `Nastepny rekomendowany PR`.
5. Nie przepisywac calego pliku, tylko utrzymywac go jako zywy handoff.

## 12. Krotki prompt dla kolejnego modelu

Mozna wkleic modelowi:

```text
Pracujesz nad MealGenie Direction A. Najpierw przeczytaj docs/redesign/DIRECTION_A_HANDOFF.md oraz AGENTS.md. Nie instaluj zaleznosci. Nie ruszaj backendu/API/Prisma. Kontynuuj aktualny nastepny PR z trackera.
```
