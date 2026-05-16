---
description: Review aktualnych zmian pod kątem regresji, ryzyk i produkcji.
---

## Status

!`git status --short`

## Diff

!`git diff HEAD`

## Instrukcje

Zrób review tego diffa jako senior developer znający MealGenie.

Sprawdź:
- zmiany kontraktów API (payload request/response)
- spójność frontend + backend przy zmianach po obu stronach
- ryzyka produkcyjne (env, Docker, Caddy, nginx, Prisma, routing)
- regresje auth i zarządzania sesją
- brakujące stany loading / error / empty
- ryzyka dla Direction A (tokeny, dark mode, responsywność)
- dostępność (aria-label, focus, reduced motion)

Nie edytuj plików.

Zwróć:
1. Co się zmieniło (krótko).
2. Ryzyka z oceną ważności.
3. Co warto ręcznie sprawdzić.
4. Czy zmiana dotyka produkcji.
