FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY packages/shared/package.json packages/shared/
COPY services/admin/package.json services/admin/

RUN cd packages/shared && npm install
RUN cd services/admin && npm install

# Copy source
COPY packages/shared packages/shared
COPY services/admin services/admin

WORKDIR /app/services/admin

# Build Next.js
RUN npm run build

EXPOSE 3003

CMD ["npm", "start"]
