---
description: Ustrukturyzowane debugowanie problemu w MealGenie.
---

## Instrukcje

Debuguj problem przechodząc przez cały flow:

1. Stan UI i komunikat błędu
2. Payload requestu
3. Endpoint i routing
4. Walidacja Zod
5. Logika controller / service
6. Integracja DB lub AI
7. Kształt response
8. Obsługa błędu po stronie frontendu
9. Środowisko: env, CORS, routing Caddy, lokalne vs produkcja

Poproś o brakujące dane tylko gdy są niezbędne:
- komunikat z konsoli lub sieci
- status HTTP i treść response
- logi backendu
- dokładna ścieżka i środowisko

Nie implementuj jeszcze.

Zwróć: najbardziej prawdopodobną przyczynę, pierwsze kroki do sprawdzenia,
minimalny fix i sposób weryfikacji.
