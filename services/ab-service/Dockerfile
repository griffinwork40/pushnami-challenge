FROM node:20-alpine AS base
RUN apk add --no-cache wget

WORKDIR /app

# ─── Install deps (monorepo-aware) ───────────────────────────────────────────
COPY package.json package-lock.json* ./
COPY packages/shared/package.json packages/shared/
COPY services/ab-service/package.json services/ab-service/

# Install from repo root so workspace symlinks resolve
RUN npm install --workspace=packages/shared --workspace=services/ab-service

# ─── Copy source ──────────────────────────────────────────────────────────────
COPY packages/shared packages/shared
COPY services/ab-service services/ab-service

WORKDIR /app/services/ab-service
EXPOSE 3001

CMD ["npx", "tsx", "src/index.ts"]
