# MealGenie Deployment Guide

## 1. Cel dokumentu

Skondensowana pamięć wdrożenia produkcyjnego MealGenie dla modeli LLM i przyszłych prac.
Pełne archiwum rozmowy/procesu zostaje w `mealgenie-proces-wdrożenia.md`; ten plik ma być krótkim, technicznym źródłem prawdy.

Cel wdrożenia: publiczna beta MealGenie dla kilku testerów.

## 2. Aktualny stan produkcji

- Produkcja działa na DigitalOcean Droplet.
- Finalna domena użyta w procesie: `mealgenie.pro`.
- Pierwotnie rozważana domena: `mealgenie.business`.
- Publiczny adres IP dropleta z procesu: `164.92.236.4`.
- System: Ubuntu 24.04 LTS x64.
- Region: Frankfurt, FRA1.
- Maszyna: DigitalOcean Basic, Premium AMD, 1 vCPU, 2 GB RAM.
- Użytkownik serwerowy do pracy i deployu: `deploy`.
- Lokalny skrót SSH: `ssh mealgenie`.
- Kod produkcyjny na serwerze: `/srv/mealgenie/app`.
- Pliki deployu na serwerze: `/srv/mealgenie/deploy`.
- Pierwszy działający release: `v0.1.0-beta.3`.

## 3. Architektura produkcyjna

Stack:

- `frontend`: React + Vite, budowany do statycznych plików i serwowany przez Nginx.
- `backend`: Node.js + Express + TypeScript + Prisma.
- `db`: PostgreSQL 16 Alpine.
- `caddy`: reverse proxy, automatyczne SSL, routing domeny.

Ruch HTTP:

- `https://mealgenie.pro` -> Caddy -> frontend `frontend:80`.
- `https://mealgenie.pro/api/*` -> Caddy -> backend `backend:3000`.
- `https://mealgenie.pro/meal-images/*` -> Caddy -> backend `backend:3000`.

Frontend powinien być budowany z:

```env
VITE_API_URL=https://mealgenie.pro/api
```

Uwaga: część kodu frontendu składa obrazki jako `${VITE_API_URL}${meal.imageUrl}`. Jeśli `meal.imageUrl` ma format `/meal-images/...`, to `VITE_API_URL=https://mealgenie.pro/api` dałoby `/api/meal-images/...`. W razie problemów z obrazkami sprawdzić, czy produkcyjnie lepsze nie jest:

```env
VITE_API_URL=https://mealgenie.pro
```

## 4. Serwer i bezpieczeństwo

DigitalOcean Cloud Firewall:

- SSH `22`: dopuszczone z internetu lub z wybranego IP administratora.
- HTTP `80`: publiczne.
- HTTPS `443`: publiczne.
- Outbound: domyślnie otwarte.

UFW na serwerze:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

SSH hardening w `/etc/ssh/sshd_config`:

```sshconfig
PermitRootLogin no
PasswordAuthentication no
```

Po zmianie:

```bash
sudo systemctl restart ssh
```

Zasada bezpieczeństwa: przed wyłączeniem roota i haseł zawsze sprawdzić w drugim terminalu, że logowanie jako `deploy` działa.

Lokalny SSH config w WSL:

```sshconfig
Host mealgenie
    HostName 164.92.236.4
    User deploy
    IdentityFile ~/.ssh/id_droplet
    IdentitiesOnly yes
```

Istotny problem z procesu: klucz SSH był wygenerowany w Windows 11, a komendy były uruchamiane w WSL. WSL ma osobny katalog `~/.ssh`, więc trzeba było skopiować właściwy klucz z Windowsa i używać go jawnie:

```bash
cp /mnt/c/Users/Maro/.ssh/id_ed25519 ~/.ssh/id_droplet
chmod 600 ~/.ssh/id_droplet
ssh -i ~/.ssh/id_droplet root@164.92.236.4
```

## 5. Docker / Compose

Docker zainstalowany z oficjalnego repo Dockera dla Ubuntu, razem z Compose pluginem.
Zweryfikowana wersja Compose w procesie:

```text
Docker Compose version v5.0.1
```

`deploy` został dodany do grupy `docker`:

```bash
sudo usermod -aG docker $USER
```

Po tej komendzie wymagane jest ponowne logowanie.

Repo zawiera:

- `backend/Dockerfile`
- `frontend/Dockerfile`
- `frontend/nginx.conf`

Plik produkcyjny `docker-compose.prod.yml` był tworzony ręcznie na serwerze w:

```text
/srv/mealgenie/deploy/docker-compose.prod.yml
```

Minimalny kształt produkcyjnego Compose:

```yaml
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - internal

  backend:
    build:
      context: ../app/backend
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - meal_images:/app/public/meal-images
    networks:
      - internal

  frontend:
    build:
      context: ../app/frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: https://mealgenie.pro/api
    restart: unless-stopped
    networks:
      - internal

  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - frontend
      - backend
    networks:
      - internal

volumes:
  postgres_data:
  meal_images:
  caddy_data:
  caddy_config:

networks:
  internal:
    driver: bridge
```

## 6. Zmienne środowiskowe

Produkcyjny plik sekretów:

```text
/srv/mealgenie/deploy/.env
```

Uprawnienia:

```bash
chmod 600 .env
```

Wymagane / ważne zmienne:

```env
NODE_ENV=production
PORT=3000

JWT_SECRET=...
JWT_EXPIRES_IN=7d

OPENAI_API_KEY=...
TOGETHER_API_KEY=...
GUEST_RATE_LIMIT_SALT=...
GUEST_IMAGE_TTL_MS=...

POSTGRES_DB=mealgenie
POSTGRES_USER=mealgenie
POSTGRES_PASSWORD=...
DATABASE_URL=postgresql://mealgenie:POSTGRES_PASSWORD@db:5432/mealgenie?schema=public
```

Backend nie wstanie bez:

- `JWT_SECRET`
- `DATABASE_URL`
- `TOGETHER_API_KEY`

OpenAI SDK oczekuje:

- `OPENAI_API_KEY`

Sekrety można wygenerować:

```bash
openssl rand -hex 32
```

## 7. Domeny, DNS i SSL

DNS w Name.com:

- `A` dla apex/root domeny -> `164.92.236.4`.
- `A` dla `www` -> `164.92.236.4` albo `CNAME www -> mealgenie.pro`.
- TTL w procesie: `300`.

Test DNS:

```bash
dig +short mealgenie.pro
dig +short www.mealgenie.pro
ping -c 4 mealgenie.pro
```

Caddyfile w `/srv/mealgenie/deploy/Caddyfile`:

```caddyfile
www.mealgenie.pro {
    redir https://mealgenie.pro{uri} permanent
}

mealgenie.pro {
    encode zstd gzip

    handle_path /api/* {
        reverse_proxy backend:3000 {
            header_up Host {host}
        }
    }

    handle_path /meal-images/* {
        reverse_proxy backend:3000 {
            header_up Host {host}
        }
    }

    handle {
        reverse_proxy frontend:80
    }
}
```

Caddy przechowuje certyfikaty w volume `caddy_data`, więc certyfikaty SSL przetrwają restart kontenerów.

## 8. Obrazki i trwałe dane

Backend zapisuje obrazy w:

```text
public/meal-images
```

W kontenerze backendu ścieżka produkcyjna:

```text
/app/public/meal-images
```

W Compose musi istnieć volume:

```yaml
volumes:
  - meal_images:/app/public/meal-images
```

Bez volume wygenerowane JPG znikną przy przebudowie lub odtworzeniu kontenera.

Trwałe dane:

- `postgres_data`: dane PostgreSQL.
- `meal_images`: wygenerowane obrazki.
- `caddy_data`: certyfikaty SSL.
- `caddy_config`: konfiguracja runtime Caddy.

## 9. GitHub, release i dostęp do prywatnego repo

Repo jest prywatne. Serwer dostał read-only Deploy Key.

Generowanie klucza na serwerze:

```bash
ssh-keygen -t ed25519 -C "mealgenie-prod"
cat ~/.ssh/id_ed25519.pub
```

GitHub:

- Repo -> Settings -> Deploy keys.
- Dodać public key.
- `Allow write access`: odznaczone.

Test z serwera:

```bash
ssh -T git@github.com
```

Klonowanie:

```bash
mkdir -p /srv/mealgenie/app /srv/mealgenie/deploy
cd /srv/mealgenie/app
git clone git@github.com:MarekLewy12/MealGenie.git .
git checkout v0.1.0-beta.3
```

Release history:

- `v0.1.0-beta.1`: pierwszy release z plikami Docker/Nginx, ale build frontendu padł na typach.
- `v0.1.0-beta.2`: hotfix frontendu, `frontend/package.json` zmienił build na `vite build`.
- `v0.1.0-beta.3`: hotfix backendu, `backend/tsconfig.json` poluzował typowanie potrzebne do buildu.

## 10. CI/CD

CI/CD było zaplanowane, ale po pierwszym wdrożeniu produkcja działała jeszcze w trybie manualnym.

Docelowy kierunek:

- GitHub Actions buduje obrazy.
- Obrazy trafiają do GHCR.
- Workflow przez SSH uruchamia na serwerze:

```bash
cd /srv/mealgenie/deploy
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Alternatywa prostsza, ale cięższa dla dropleta:

```bash
cd /srv/mealgenie/app
git fetch --all --tags
git checkout <tag>
cd /srv/mealgenie/deploy
docker compose -f docker-compose.prod.yml up -d --build
```

W CI/CD nie trzymać sekretów w repo. Sekrety powinny być w GitHub Secrets albo dalej w `/srv/mealgenie/deploy/.env`.

## 11. Procedura deployu manualnego

Nowy release z istniejącego serwera:

```bash
ssh mealgenie
cd /srv/mealgenie/app
git fetch --all --tags
git checkout <nowy-tag>
cd /srv/mealgenie/deploy
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
```

Spodziewany zdrowy stan:

- `deploy-db-1`: `Up`, najlepiej `healthy`.
- `deploy-backend-1`: `Up`, bez restart loop.
- `deploy-frontend-1`: `Up`.
- `deploy-caddy-1`: `Up`, porty `80` i `443` wystawione publicznie.

## 12. Odtworzenie deployu od zera

Checklist:

1. Utworzyć DigitalOcean Droplet: Ubuntu 24.04 LTS, Frankfurt, 2 GB RAM.
2. Dodać SSH key przy tworzeniu dropleta.
3. Ustawić DO Cloud Firewall: `22`, `80`, `443`.
4. Zalogować się jako root.
5. Utworzyć usera `deploy`.
6. Dodać `deploy` do `sudo`.
7. Skopiować klucze SSH z roota do `deploy`.
8. Sprawdzić logowanie jako `deploy` w drugim terminalu.
9. Włączyć UFW.
10. Wyłączyć `PermitRootLogin` i `PasswordAuthentication`.
11. Zainstalować Docker + Compose plugin.
12. Dodać `deploy` do grupy `docker`, przelogować się.
13. Utworzyć `/srv/mealgenie/app` i `/srv/mealgenie/deploy`.
14. Ustawić DNS domeny na IP dropleta.
15. Dodać deploy key serwera do GitHuba.
16. Sklonować repo do `/srv/mealgenie/app`.
17. Checkout stabilnego taga, np. `v0.1.0-beta.3`.
18. Utworzyć `/srv/mealgenie/deploy/.env`.
19. Utworzyć `/srv/mealgenie/deploy/Caddyfile`.
20. Utworzyć `/srv/mealgenie/deploy/docker-compose.prod.yml`.
21. Uruchomić `docker compose -f docker-compose.prod.yml up -d --build`.
22. Sprawdzić `docker compose -f docker-compose.prod.yml ps`.
23. Wejść na domenę po HTTPS.

## 13. Debugowanie produkcji

Podstawowy status:

```bash
ssh mealgenie
cd /srv/mealgenie/deploy
docker compose -f docker-compose.prod.yml ps
```

Logi:

```bash
docker compose -f docker-compose.prod.yml logs -f caddy
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f db
```

Restart:

```bash
docker compose -f docker-compose.prod.yml restart backend
docker compose -f docker-compose.prod.yml restart frontend
docker compose -f docker-compose.prod.yml restart caddy
```

Pełne przebudowanie:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Sprawdzenie DNS:

```bash
dig +short mealgenie.pro
dig +short www.mealgenie.pro
```

Sprawdzenie portów/firewalla:

```bash
sudo ufw status
docker compose -f docker-compose.prod.yml ps
```

Najczęstsze problemy:

- `Permission denied (publickey)`: zły klucz SSH, szczególnie Windows vs WSL; użyć właściwego `IdentityFile`.
- Caddy nie wystawia SSL: DNS nie wskazuje na droplet, port `80/443` zamknięty w DO Firewall/UFW, albo Caddy ma zły `Caddyfile`.
- Backend restartuje: brak `JWT_SECRET`, `DATABASE_URL`, `TOGETHER_API_KEY`, `OPENAI_API_KEY` albo błędny `DATABASE_URL`.
- DB niezdrowa: sprawdzić `POSTGRES_*`, volume `postgres_data`, logi `db`.
- Obrazki znikają: brak volume `meal_images:/app/public/meal-images`.
- Obrazki 404: sprawdzić routing Caddy `/meal-images/*` i wartość `VITE_API_URL`.
- Build frontendu pada na typach: w `frontend/package.json` produkcyjny build aktualnie używa `vite build`.
- Build backendu pada na `exactOptionalPropertyTypes`: w `backend/tsconfig.json` aktualnie ustawiono `exactOptionalPropertyTypes: false`, `strict: false`, `noEmitOnError: false`.

## 14. Historia ważnych decyzji

- Wybrano DigitalOcean Droplet zamiast platformy PaaS, bo aplikacja ma backend, frontend, Postgres w Dockerze oraz trwały zapis JPG.
- Wybrano 2 GB RAM, bo Docker build i Node potrafią przekroczyć 1 GB.
- Wybrano Ubuntu 24.04 LTS i Frankfurt.
- Użytkownik `deploy` zastąpił pracę na roocie.
- SSH zostało zabezpieczone przez klucze, bez logowania hasłem i bez roota.
- Caddy został wybrany jako reverse proxy, bo automatyzuje SSL.
- Produkcyjny katalog rozdzielono na `/srv/mealgenie/app` i `/srv/mealgenie/deploy`.
- Obrazki przeniesiono na Docker volume, żeby przetrwały rebuild.
- Pierwsza działająca beta wymagała hotfixów TypeScript: frontend build bez `tsc -b`, backend z luźniejszym `tsconfig`.
- CI/CD przez GitHub Actions zostało zaplanowane jako następny etap, po ręcznym uruchomieniu produkcji.
