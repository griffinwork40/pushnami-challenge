FROM node:20-alpine AS base
RUN apk add --no-cache wget

WORKDIR /app

# Install dependencies
COPY package.json ./
COPY packages/shared/package.json packages/shared/
COPY services/metrics/package.json services/metrics/

RUN cd packages/shared && npm install
RUN cd services/metrics && npm install

# Copy source
COPY packages/shared packages/shared
COPY services/metrics services/metrics

WORKDIR /app/services/metrics
EXPOSE 3002

CMD ["npx", "tsx", "src/index.ts"]
