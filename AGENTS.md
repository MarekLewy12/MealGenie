# AGENTS.md - MealGenie

## Cel

Ten plik ustawia zasady pracy Codex CLI w repozytorium MealGenie.

MealGenie to produkcyjna aplikacja end-to-end:
- frontend: React + Vite + TypeScript + Tailwind CSS,
- backend: Node.js + Express + TypeScript + Prisma + PostgreSQL,
- AI: OpenAI + Together AI,
- produkcja: Docker Compose, Caddy, VPS, domena publiczna.

Pracuj jak ostrożny Senior Product Engineer: małe zmiany, jasny plan, zero przypadkowych refaktorów i pełna świadomość wpływu na produkcję.

## Język i styl pracy

- Pisz odpowiedzi dla użytkownika po polsku.
- Najpierw zrozum flow, potem zmieniaj kod.
- Przy większych lub ryzykownych zadaniach zacznij od krótkiego planu.
- Nie rób dużych zmian "przy okazji".
- Preferuj małe, bezpieczne diffy zamiast szerokich refaktorów.
- Jeżeli zmiana dotyka produkcji, bazy danych, migracji, sekretów, AI albo deploymentu, nazwij ryzyko przed implementacją.
- Nie udawaj pewności. Jeśli czegoś nie wiesz, sprawdź pliki repo albo powiedz, co trzeba sprawdzić.

## Źródła prawdy w repo

Przed zmianami sprawdź właściwe pliki:

- Frontend:
  - `frontend/package.json`,
  - `frontend/src/services/api.ts`,
  - `frontend/src/types/*`,
  - właściwe komponenty, strony, store'y i hooki.

- Backend:
  - `backend/package.json`,
  - `backend/src/controllers/*`,
  - `backend/src/services/*`,
  - `backend/src/schemas/*`,
  - `backend/prisma/schema.prisma`,
  - `backend/prisma/migrations/*`.

- Deployment:
  - `mealgenie-deployment-guide.md`, jeśli istnieje,
  - `backend/Dockerfile`,
  - `frontend/Dockerfile`,
  - `frontend/nginx.conf`,
  - lokalny `docker-compose.yml`,
  - dokumentację lub pliki CI/CD, jeśli są obecne.

Jeśli w repo są spakowane pliki typu `mealgenie-client.md` lub `mealgenie-server.md`, traktuj je jako referencję/read-only. Zmiany kodu rób w oryginalnych plikach projektu, nie w plikach spakowanych.

## Granice zmian

Domyślnie zmieniaj tylko pliki potrzebne do wykonania zadania.

Nie zmieniaj bez wyraźnego powodu:
- kontraktów API,
- typów request/response,
- query keys TanStack Query,
- shape store'ów Zustand,
- routingu i guardów,
- `VITE_API_URL`,
- składania URL-i obrazków,
- konfiguracji Docker/Caddy/nginx,
- schematu Prisma,
- migracji,
- plików `.env`,
- ustawień produkcyjnych.

Nie instaluj nowych zależności bez uzasadnienia i zgody użytkownika.

## Frontend

Przy zmianach w frontendzie zachowaj:

- routing React Router,
- query keys TanStack Query,
- store'y Zustand: shape, nazwy pól i akcje,
- payloady i kontrakty w `frontend/src/services/api.ts`,
- flow generowania posiłku i przepisu,
- obsługę loading/error/empty states,
- dark mode,
- responsywność mobile-first,
- dostępność: focus states, aria-label dla icon-only buttons, reduced motion.

Nie zmieniaj kontraktów API bez zsynchronizowanej zmiany backendu.

Szczególnie ostrożnie obchodź się z:
- `frontend/src/services/api.ts`,
- `frontend/src/types/meal.ts`,
- `frontend/src/types/chat.ts`,
- `frontend/src/store/authStore.ts`,
- `frontend/src/store/chatStore.ts`,
- `frontend/src/store/shoppingListStore.ts`,
- `frontend/src/store/notificationStore.ts`,
- routingiem `/shared/:shareId`, który ma działać publicznie.

Build produkcyjny frontendu to `vite build`. Nie zmieniaj tego na `tsc -b` bez osobnej decyzji.

## Backend

Przy zmianach w backendzie trzymaj flow:

request -> Zod schema -> controller -> service -> DB/AI -> response -> error handling.

Zasady:

- Każdy endpoint waliduje wejście przez Zod przed użyciem danych.
- Nie ufaj payloadowi z frontendu.
- Logika biznesowa należy do `services/`, nie do `controllers/`.
- Controller obsługuje HTTP i przekazuje błędy przez `next(err)`.
- Nie zwracaj `passwordHash`.
- Nie zdradzaj w błędach auth, czy email istnieje.
- Nie loguj sekretów, tokenów ani pełnych payloadów użytkownika.
- Nie zmieniaj `strict: false` w backendowym `tsconfig` bez osobnej decyzji.
- Nie zmieniaj logiki zapisu obrazów bez sprawdzenia produkcyjnego volume `meal_images`.

Przy zmianie endpointu opisz:
- route,
- request,
- Zod schema,
- controller,
- service,
- DB/AI,
- response,
- błędy,
- wpływ na frontend,
- wpływ na produkcję.

## Prisma, migracje i baza danych

Zmiany w `schema.prisma` lub `prisma/migrations/*` są ryzykowne.

Zasady:

- Najpierw przygotuj plan migracji.
- Wskaż, czy migracja jest backward compatible.
- Wskaż wpływ na istniejące dane.
- Nie usuwaj kolumn ani tabel bez planu zachowania lub migracji danych.
- Nie edytuj istniejących migracji, które mogły już wejść na produkcję.
- Nie uruchamiaj migracji produkcyjnych.
- Nie resetuj bazy.

Nigdy nie uruchamiaj:
- `prisma migrate reset`,
- `prisma db push --force-reset`,
- komend kasujących dane produkcyjne,
- komend usuwających volume PostgreSQL.

Backend produkcyjny uruchamia `prisma migrate deploy` przy starcie kontenera, więc błędna migracja może wejść na produkcję podczas deployu.

## AI i structured outputs

Przy zmianach AI:

- Trzymaj schematy Zod zsynchronizowane ze structured outputs.
- Nie usuwaj reguł dotyczących alergenów.
- Prompty mają być po polsku tam, gdzie dotyczą odpowiedzi dla użytkownika.
- `imagePromptEn` ma pozostać po angielsku, jeśli taki jest kontrakt.
- Nie loguj pełnych promptów z prywatnymi danymi użytkownika.
- Obsłuż przypadek pustej lub niepoprawnej odpowiedzi AI.
- Zachowaj praktyczny charakter MealGenie: zwykłe składniki, polski kontekst, realny czas przygotowania.

## Deployment i produkcja

Produkcja działa publicznie. Każda zmiana dotykająca deploymentu wymaga osobnego planu i sekcji "Wpływ na produkcję".

Za produkcyjnie wrażliwe uznawaj:

- `.env`,
- sekrety,
- `DATABASE_URL`,
- `JWT_SECRET`,
- klucze OpenAI/Together AI,
- `GUEST_RATE_LIMIT_SALT`,
- Dockerfile,
- Docker Compose,
- Caddy,
- nginx,
- `VITE_API_URL`,
- routing `/api/*`,
- routing `/meal-images/*`,
- volume `postgres_data`,
- volume `meal_images`,
- migracje Prisma,
- CI/CD,
- SSH,
- deploy na VPS.

Nie uruchamiaj komend SSH, deployu, restartu kontenerów produkcyjnych ani zmian na serwerze bez wyraźnej zgody użytkownika.

Jeśli zmiana może wpłynąć na produkcję, opisz:
- nowe lub zmienione zmienne środowiskowe,
- czy wymagany jest build frontendu,
- czy wymagany jest build backendu,
- czy wymagany jest restart/redeploy,
- czy jest migracja bazy,
- jak sprawdzić zmianę po wdrożeniu,
- ryzyko dla `/api`, `/meal-images`, logowania, generowania AI i obrazków.

## Sekrety i `.env`

Nigdy nie:
- commituj sekretów,
- pokazuj wartości sekretów,
- kopiuj wartości z produkcyjnego `.env`,
- zapisuj kluczy API w kodzie,
- loguj tokenów lub connection stringów,
- modyfikuj produkcyjnego `.env` bez osobnej zgody.

Możesz:
- dodać lub zmienić `.env.example`,
- opisać nazwę wymaganej zmiennej bez wartości,
- wskazać, że użytkownik musi ustawić sekret ręcznie.

## Destructive commands

Nie uruchamiaj bez wyraźnej zgody użytkownika:

- `rm -rf`,
- `git reset --hard`,
- `git clean -fd`,
- `docker compose down -v`,
- `docker volume rm`,
- `prisma migrate reset`,
- `prisma db push --force-reset`,
- usuwania migracji,
- usuwania tabel lub kolumn,
- masowego formatowania całych katalogów,
- komend SSH na produkcji,
- komend deploymentowych na serwerze,
- komend zmieniających production `.env`,
- komend dotykających `/srv/mealgenie/*`.

Jeśli taka komenda wydaje się potrzebna, najpierw wyjaśnij:
- po co jest potrzebna,
- co może usunąć lub zmienić,
- jak zrobić backup lub bezpieczniejszą alternatywę,
- jak potwierdzić, że user chce ją wykonać.

## Komendy lokalne do walidacji

Dobieraj komendy do zakresu, ryzyka i typu zmiany. Nie uruchamiaj lint/build
automatycznie po każdej drobnej zmianie UI, np. po korekcie koloru, odstępu,
tekstu, klasy Tailwind albo jednego wariantu hover, jeśli diff jest mały i nie
zmienia logiki, kontraktów, routingu ani shared komponentów.

Przy małych zmianach wystarczy przejrzeć diff i opisać sensowny ręczny smoke
check. Jeśli nie uruchamiasz lint/build, napisz krótko dlaczego.

Uruchom lint/build/testy wtedy, gdy zmiana jest większa albo ma realne ryzyko:
- dotyka logiki, hooków, store'ów, API, typów, routingu lub guardów,
- zmienia shared komponenty, layout aplikacji, formularze, loading/error states,
- obejmuje wiele plików lub szeroki refactor,
- dotyka backendu, AI, DB, migracji, deploymentu albo produkcyjnych kontraktów,
- użytkownik wyraźnie prosi o pełną walidację,
- przed PR-em lub końcowym audytem gotowości.

Typowe komendy, gdy mają sens:

Frontend:
- `cd frontend && npm run lint`
- `cd frontend && npm run build`

Backend:
- `cd backend && npm test`
- `cd backend && npm run build`

- Nie używaj Playwrighta ani automatyzacji przeglądarki, chyba że użytkownik wyraźnie o to poprosi.

Nie uruchamiaj komend wymagających sieci, produkcji, SSH, Docker volume'ów lub sekretów bez zgody.

Jeśli nie możesz uruchomić testów/builda, napisz to jasno i podaj checklistę ręczną.

## Checklisty po zmianie

Po każdej zmianie podsumuj:

- co zmieniono,
- w jakich plikach,
- dlaczego,
- jakie ryzyka zostają,
- jakie testy/build/lint uruchomiono,
- czego nie udało się uruchomić,
- jak ręcznie sprawdzić zmianę.

Dla frontendu sprawdź, jeśli dotyczy:
- routing,
- loading/error/empty states,
- mobile,
- dark mode,
- focus states,
- `/shared/:shareId`,
- obrazki z backendu,
- brak regresji w API payloadach.

Dla backendu sprawdź, jeśli dotyczy:
- walidację Zod,
- statusy HTTP,
- response shape,
- błędy auth,
- brak wycieku `passwordHash`,
- wpływ na DB/AI,
- testy Jest, jeśli pasują do zmiany.

Dla deploymentu sprawdź, jeśli dotyczy:
- env vars,
- build args,
- Dockerfile,
- nginx/Caddy routing,
- volumes,
- migracje,
- smoke test po wdrożeniu.

## PR descriptions

Gdy użytkownik prosi o opis PR, przygotuj go po angielsku, w Markdown, w tym stylu:

```markdown
## What

One or two concise sentences describing the main purpose of the PR.

## Changes

### Frontend

- Concrete frontend change.
- Concrete frontend change.

### Backend

- Concrete backend change, if applicable.

### Docs

- Concrete docs change, if applicable.

## What this does NOT change

- Does not change routing contracts.
- Does not change API contracts.
- Does not change auth flow.
- Does not change deployment, Docker, Caddy, nginx, or `VITE_API_URL`.

## New dependencies

None, or list new dependencies.

## Database migration

None, or describe migration path and file.

## Testing

Verified:

- `command that was run`
- `command that was run`

Manual smoke recommended:

- Scenario to check manually.
- Scenario to check manually.
```

Zasady:
- Usuń sekcje, które ewidentnie nie pasują, ale zachowaj kolejność pozostałych.
- Jeśli nie ma nowych zależności albo migracji, napisz `None`.
- W sekcji "What this does NOT change" wymień tylko istotne kontrakty i obszary ryzyka dla danego PR.
- W "Testing" oddziel komendy faktycznie uruchomione od ręcznych scenariuszy rekomendowanych.
- Nie dopisuj twierdzeń o testach, których faktycznie nie uruchomiono.

## Branching i duże refaktory

Nie rób dużych refaktorów bez osobnego planu.

Duży refaktor wymaga:
- celu,
- zakresu,
- listy plików,
- ryzyk,
- planu rollbacku lub bezpiecznego podziału,
- checklisty regresji.

Jeśli pracujesz nad redesignem Direction A, nie zmieniaj strategii branchowania ani nie merge'uj do `master` bez osobnej decyzji użytkownika.

## Zasada końcowa

MealGenie ma działać jako realny produkt. Najpierw stabilność, dane użytkownika i produkcja; potem elegancja kodu. Jeśli istnieje prostsze, bezpieczniejsze rozwiązanie, zaproponuj je.
