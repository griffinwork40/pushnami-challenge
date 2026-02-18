FROM node:20-alpine AS base
RUN apk add --no-cache wget

WORKDIR /app

# Install dependencies
COPY package.json ./
COPY packages/shared/package.json packages/shared/
COPY services/ab-service/package.json services/ab-service/

RUN cd packages/shared && npm install
RUN cd services/ab-service && npm install

# Copy source
COPY packages/shared packages/shared
COPY services/ab-service services/ab-service

WORKDIR /app/services/ab-service
EXPOSE 3001

CMD ["npx", "tsx", "src/index.ts"]
