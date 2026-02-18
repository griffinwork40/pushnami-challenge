FROM node:20-alpine AS base
WORKDIR /app

# ─── Install deps (monorepo-aware) ───────────────────────────────────────────
COPY package.json package-lock.json* ./
COPY packages/shared/package.json packages/shared/
COPY services/admin/package.json services/admin/

RUN npm install --workspace=packages/shared --workspace=services/admin

# ─── Copy source ──────────────────────────────────────────────────────────────
COPY packages/shared packages/shared
COPY services/admin services/admin

WORKDIR /app/services/admin

# ─── Build Next.js ────────────────────────────────────────────────────────────
ENV NEXT_TELEMETRY_DISABLED=1
ARG AB_SERVICE_URL=http://ab-service:3001
ARG METRICS_SERVICE_URL=http://metrics:3002
ENV AB_SERVICE_URL=$AB_SERVICE_URL
ENV METRICS_SERVICE_URL=$METRICS_SERVICE_URL

RUN npm run build

EXPOSE 3003
ENV PORT=3003

CMD ["npm", "start"]
