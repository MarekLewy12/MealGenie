FROM node:20-alpine AS builder

WORKDIR /app


COPY package*.json ./
COPY prisma ./prisma/

# zależności
RUN npm ci

COPY . .


RUN npx prisma generate
RUN npm run build

# Etap 2: Produkcja (Runner)
FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

RUN mkdir -p public/meal-images && chown -R node:node /app

USER node

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
