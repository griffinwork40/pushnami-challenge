FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY packages/shared/package.json packages/shared/
COPY services/landing/package.json services/landing/

RUN cd packages/shared && npm install
RUN cd services/landing && npm install

# Copy source
COPY packages/shared packages/shared
COPY services/landing services/landing

WORKDIR /app/services/landing

# Build Next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
