---
description: Generuje PR description dla MealGenie w ustalonym formacie.
---

## Branch info

!`git log main..HEAD --oneline 2>/dev/null || git log master..HEAD --oneline`

## Zmiany

!`git diff main...HEAD 2>/dev/null || git diff master...HEAD`

## Instrukcje

WAŻNE: PR description pisz wyłącznie po angielsku, nawet jeśli bieżąca sesja
jest po polsku.

Format:

**## What**
Co zyskuje użytkownik lub system.

**## Changes**
Pogrupowane według obszarów: `**Frontend:**`, `**Backend:**`, `**Config:**`, `**Docs:**`.
Wymieniaj pliki w backtickach. Krótkie zdania, listy punktowane.

**## What this does NOT change**
Granice zakresu - co świadomie zostało pominięte.

**## New dependencies**
Lista nowych paczek lub `None`.

**## Database migration**
Opis migracji lub pomiń jeśli PR jest wyłącznie frontendowy.

**## Testing**
Konkretne scenariusze do ręcznego sprawdzenia.

**## Deploy note**
Tylko jeśli zmiana ma konsekwencje deploymentowe. Pomiń jeśli nie ma.

Bez marketingowego języka.
