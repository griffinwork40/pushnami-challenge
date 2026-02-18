# Landing Page A/B Testing Platform

A multi-service system for running A/B experiments on a landing page, tracking user interactions, and analyzing variant performance — with statistical significance testing.

## Architecture

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Landing Page │────▶│  A/B Test       │     │  Admin Dashboard  │
│  (Next.js)   │     │  Service         │◀────│  (Next.js)        │
│  :3000       │     │  (Fastify) :3001 │     │  :3003            │
└──────┬───────┘     └─────────────────┘     └────────┬─────────┘
       │                                               │
       │             ┌─────────────────┐               │
       └────────────▶│  Metrics        │◀──────────────┘
                     │  Service         │
                     │  (Fastify) :3002 │
                     └────────┬────────┘
                              │
                     ┌────────▼────────┐
                     │   PostgreSQL    │
                     │   :5432        │
                     └─────────────────┘
```

**Four services connected via Docker network:**

| Service | Tech | Port | Purpose |
|---------|------|------|---------|
| **Landing Page** | Next.js 15 (App Router) | 3000 | Visitor-facing page with A/B variant rendering |
| **A/B Test Service** | Fastify + PostgreSQL | 3001 | Experiment management, variant assignment, feature toggles |
| **Metrics Service** | Fastify + PostgreSQL | 3002 | Event ingestion, aggregated stats, statistical significance |
| **Admin Dashboard** | Next.js 15 (App Router) | 3003 | Feature toggles, experiment management, stats visualization |

## Quick Start

```bash
docker compose up --build
```

Then visit:
- **Landing Page:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3003

The system seeds itself with a default experiment ("Homepage Hero Test" with control + variant_a) and three feature toggles.

## How It Works

1. **Visitor arrives** at the landing page → middleware sets a persistent `visitor_id` cookie
2. **Server-side assignment** → page.tsx calls the A/B service to get a deterministic variant assignment (no flash of wrong content)
3. **Variant-specific rendering** → hero messaging, CTA style, and social proof adjust based on assigned variant + feature toggles
4. **Event tracking** → client-side, non-blocking tracking fires for `page_view`, `cta_click`, `scroll_depth`, and `form_submit` events
5. **Admin monitors** → dashboard shows real-time variant performance with chi-squared statistical significance testing

## Design Decisions

### Technology Choices
- **TypeScript everywhere** — type safety across all services with shared type definitions
- **Fastify over Express** — 2-5x throughput, built-in schema validation, structured logging via pino
- **Next.js App Router** — server components for zero-flash variant rendering, API routes as service proxies
- **PostgreSQL** — ACID compliance, `uuid-ossp` for ID generation, `FILTER` clauses for efficient aggregation
- **Monorepo with shared types** — `@pushnami/shared` package ensures API contracts are enforced at compile time

### Assignment Algorithm
Deterministic SHA-256 hashing: `SHA256(visitorId + experimentId)` → first 8 hex chars → `parseInt(hex, 16) % 100` → maps to variant via cumulative traffic split. Same visitor always gets the same variant. Race conditions handled with `ON CONFLICT DO NOTHING` + re-fetch pattern.

### Statistical Significance
Custom chi-squared test implementation (no external stats library):
- Lanczos approximation for the gamma function
- Regularized incomplete gamma via series expansion + continued fraction
- Compares observed vs expected conversion rates across variants
- Reports p-value and significance threshold (p < 0.05)

### Proxy Pattern
Browser traffic only hits Next.js servers. API routes proxy to internal services via Docker network hostnames — no CORS issues, no internal service exposure.

## Why This Is Production-Ready

### Security
- **Helmet** security headers on all backend services
- **Rate limiting** — 100 req/min (A/B service), 200 req/min events / 50 req/min stats (Metrics)
- **Input validation** — Zod schemas validate every request body and query parameter
- **No internal service exposure** — browser talks only to Next.js; services communicate over Docker network

### Reliability
- **Graceful shutdown** — SIGTERM/SIGINT handlers close DB pools and drain connections
- **Health checks** — every service exposes `/api/health`; Docker `depends_on` uses health conditions
- **Connection pooling** — PostgreSQL pools with max 10 connections per service
- **Race-safe assignments** — `UNIQUE` constraint + `ON CONFLICT DO NOTHING` prevents duplicate assignments under concurrent load

### Observability
- **Structured logging** — pino JSON logs with request/response timing
- **Health endpoints** — report service name, version, uptime, and database connectivity
- **Error boundaries** — landing page gracefully degrades if services are temporarily unavailable

### Code Quality
- **Every file under 300 lines** — clean separation of concerns, no monolith files
- **Shared type definitions** — compile-time enforcement of API contracts
- **Efficient SQL** — `GROUP BY` with `FILTER` clauses for single-query aggregation (no N+1 queries, no client-side computation of stats)
- **Proper indexes** — composite indexes on `(experiment_id, variant_id)` for the events table

### What AI Gets Wrong (And How This Addresses It)
- **Surface-level error handling** → Every service has typed error responses, proper HTTP status codes, and Zod validation errors that return structured 400 responses
- **Missing edge cases** → Race conditions in assignment handled explicitly; chi-squared test handles zero-visitor and single-variant edge cases
- **Hallucinated APIs** → All service contracts defined in shared types and validated with Zod — if it compiles, the contract is correct
- **Context drift** → Monorepo with shared package means a type change in one place propagates compilation errors everywhere it matters

## Project Structure

```
pushnami-challenge/
├── docker-compose.yml          # Orchestrates all services + PostgreSQL
├── init.sql                    # Database schema, indexes, seed data
├── packages/
│   └── shared/src/             # Shared types, Zod schemas, constants
├── services/
│   ├── ab-service/             # Variant assignment + experiment CRUD + toggles
│   ├── metrics/                # Event ingestion + aggregated stats + chi-squared
│   ├── landing/                # Next.js landing page with A/B rendering
│   └── admin/                  # Next.js admin dashboard with charts
└── README.md
```
