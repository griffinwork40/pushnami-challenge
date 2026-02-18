FROM node:20-alpine AS base
RUN apk add --no-cache wget

WORKDIR /app

# ─── Install deps (monorepo-aware) ───────────────────────────────────────────
COPY package.json package-lock.json* ./
COPY packages/shared/package.json packages/shared/
COPY services/metrics/package.json services/metrics/

RUN npm install --workspace=packages/shared --workspace=services/metrics

# ─── Copy source ──────────────────────────────────────────────────────────────
COPY packages/shared packages/shared
COPY services/metrics services/metrics

WORKDIR /app/services/metrics
EXPOSE 3002

CMD ["npx", "tsx", "src/index.ts"]
