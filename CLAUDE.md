# MealGenie - instrukcje dla Claude Code

## Produkt

MealGenie to polska aplikacja webowa AI do generowania spersonalizowanych posiłków,
przepisów, obrazów dań, historii posiłków, ulubionych i czatu z asystentem kulinarnym.
Aplikacja jest na produkcji. Priorytet: działający produkt, małe bezpieczne zmiany,
brak regresji.

## Struktura repo (monorepo)

- `/frontend` - React + Vite + TypeScript (UI)
- `/backend` - Node.js + Express + TypeScript (API)
- `/mealgenie-deployment-guide.md` - źródło prawdy dla produkcji; czytaj przed
  każdą zmianą dotyczącą deploymentu

## Stack

**Frontend:**
- React + Vite + TypeScript
- Tailwind CSS v4 (konfiguracja przez CSS, brak `tailwind.config.js`)
- Zustand (stan globalny/kliencki)
- TanStack Query (stan serwerowy)
- React Router
- React Hook Form + Zod

**Backend:**
- Express.js + TypeScript
- Prisma ORM + PostgreSQL
- Zod (walidacja każdego requestu przed użyciem)
- JWT auth
- OpenAI (tekst/czat), Together AI (obrazy)
- Architektura: Controller-Service (`controllers/` obsługa HTTP, `services/` logika)

**Produkcja:**
- DigitalOcean Droplet (Ubuntu 24.04, Frankfurt, 2 GB RAM)
- Docker Compose (`/srv/mealgenie/deploy/docker-compose.prod.yml`)
- Caddy (reverse proxy + SSL)
- Nginx (serwowanie frontendu)
- Domena: `mealgenie.pro`
- Routing: `/api/*` i `/meal-images/*` -> backend, reszta -> frontend

## Czego nie robić bez wyraźnej zgody

**Instalowanie zależności** - środowisko jest już skonfigurowane:
- nie uruchamiaj `npm install`, `yarn add`, `pnpm install`, `npx ...`
- jeśli czegoś brakuje, zgłoś to Markowi

**Operacje Git** - Marek sam operuje Gitem:
- nie rób `git commit`, `git push`, `git merge`, `git rebase`, `git reset`
- dozwolone: `git status`, `git diff`, `git log`, `git branch`, `git switch`
- po zakończeniu pracy powiedz kiedy warto commitować i podaj gotowe commit message
  w formacie Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:` itd.)

**Produkcja** - bez zgody nie wykonuj:
- `ssh mealgenie` (deploy key w WSL `~/.ssh/id_droplet`)
- `docker compose -f docker-compose.prod.yml ...`
- `npx prisma migrate deploy` / `prisma migrate reset`
- zmian w `Caddyfile`, `nginx.conf`, `docker-compose.prod.yml`
- zmian `VITE_API_URL` lub routingów `/api/*`, `/meal-images/*`

**Sekrety** - nigdy nie czytaj, nie wypisuj:
- `.env`, `.env.*`
- kluczy SSH (`id_droplet`, `id_ed25519`, `id_rsa`)
- tokenów API, haseł, `DATABASE_URL`

## Workflow

Przed implementacją:
1. Przeczytaj zadanie i wskaż, czy to frontend, backend czy oba.
2. Zdefiniuj kontrakt danych: co wchodzi do API, co wraca.
3. Zaproponuj plan - pliki, kroki, ryzyka.
4. Poczekaj na akceptację przy nieoczywistych zmianach.

Podczas implementacji:
- Zmieniaj minimalny zestaw plików.
- Nie mieszaj refaktoru z nową funkcją.
- Nie zmieniaj kontraktów API bez zsynchronizowanej zmiany frontendu i backendu.
- TypeScript: backend ma aktualnie `strict: false` w tsconfig - nie zmieniaj bez
  potrzeby, build produkcyjny tego wymaga.

Po implementacji:
- Pokaż zmienione pliki.
- Wskaż ryzyka i czy zmiana dotyka produkcji.
- Podaj checklistę do ręcznego testu.

## PR description

Zawsze po angielsku. Format:

- `## What` - co zyskuje użytkownik lub system
- `## Changes` - pogrupowane: `**Frontend:**`, `**Backend:**`, `**Config:**` itp.
- `## What this does NOT change` - granice zakresu
- `## New dependencies` - lub `None`
- `## Database migration` - lub pominąć przy czysto frontendowych PR
- `## Testing` - konkretne scenariusze ręczne
- `## Deploy note` - tylko jeśli są konsekwencje deploymentu

## Definicja done

Zmiana jest gotowa, gdy:
- typy TypeScript się zgadzają
- brak niezamierzonych zmian w diffie
- kontrakt danych jest zachowany
- stany błędów są obsłużone
- Marek wie, jak sprawdzić zmianę ręcznie
- jeśli zmiana dotyka produkcji - opisany wpływ i kroki po deployu
