# Backend - MealGenie

## Scope

Ten plik dotyczy tylko `backend/`. Stack: Node.js + Express 5 + TypeScript,
Prisma 5 + PostgreSQL, Zod, JWT (jsonwebtoken), bcryptjs, OpenAI SDK.

Struktura `src/`:
- `controllers/` - obsługa HTTP (req/res/next), bez logiki biznesowej
- `services/` - logika biznesowa, integracje AI i DB
- `schemas/` - schematy Zod
- `middlewares/` - auth, error handling, rate limiting
- `__tests__/` - testy Jest + supertest

## Zasady pracy

- Każdy endpoint waliduje wejście przez schemat Zod przed użyciem danych.
- Nie ufaj payloadowi z frontendu.
- Logika biznesowa należy do `services/`, nie do `controllers/`.
- Błędy przekazuj przez `next(err)`, nie obsługuj w kontrolerze.
- `async/await` wszędzie - nigdy `.then()`.
- TypeScript ma aktualnie `strict: false` w tsconfig - nie zmieniaj,
  build produkcyjny tego wymaga.

## Bezpieczeństwo

- Nigdy nie zwracaj `passwordHash` w response.
- Błędy auth nie mogą zdradzać, czy email istnieje w bazie.
- Nie loguj sekretów, tokenów ani pełnych payloadów z danymi użytkownika.
- Nie zmieniaj logiki zapisu obrazów bez sprawdzenia produkcyjnego volume
  (`meal_images:/app/public/meal-images`).

## Prisma i baza danych

- Zmiany schematu wymagają osobnego planu migracji - zaproponuj, nie wykonuj.
- Przy migracji wskaż czy jest backward compatible z aktualną produkcją.
- Nigdy nie uruchamiaj `prisma migrate reset`.
- Nie usuwaj kolumn ani tabel bez planu dla istniejących danych.

## AI

- OpenAI SDK: tekst, czat, structured outputs.
- Together AI: generowanie obrazów.
- Schematy Zod trzymaj blisko structured outputs - muszą być zsynchronizowane.
- Prompty po polsku, konkretne i testowalne.
- Nie usuwaj reguł dotyczących alergenów.

## Komendy (tylko do referencji, nie uruchamiaj bez zgody)

- Dev: `npm run dev` (nodemon + ts-node)
- Testy: `npm test`
- Prisma Studio: `npx prisma studio`

## Po zmianie

Przy zmianie endpointu opisz: route, controller, schemat Zod, service, DB/AI,
response, obsługa błędów, wpływ na frontend.
Wskaż ryzyka i czy zmiana wymaga migracji lub dotyka produkcji.
