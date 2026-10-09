# Namma City — Architecture & System Design

## 1. System Overview

Namma City is organized as a domain-driven monorepo separating presentation, business logic, persistence, and shared contracts:

```text
namma-city/
├── apps/
│   ├── web/               # Next.js 14 App Router (Mobile-First Civic Client)
│   └── api/               # Express + TypeScript REST API
├── packages/
│   ├── database/          # Prisma Schema, Migrations, Client, Seed Data
│   └── shared/            # Common TypeScript Interfaces & DTOs
```

---

## 2. Layered Architecture

### Client Layer (`apps/web`)
- **App Router**: Dynamic file-system based routing matching mobile paths (`/home`, `/report/*`, `/requests/*`, `/payments/*`, etc.).
- **MobileShell**: Provides responsive presentation simulating native mobile behavior (390px default viewport on desktop, full viewport on mobile devices) and iOS system status bars.
- **Client State**:
  - `AuthProvider`: Encapsulates user session, unread notifications badge, and one-click role switching between Citizen, Staff, and Admin.
  - Form drafts stored in `sessionStorage` across multi-step complaint reporting flows.
- **Maps**: Dynamic client-only Leaflet wrapper with OpenStreetMap tiles and custom SVG pins.

### Service & API Layer (`apps/api`)
- **Express + TypeScript**: Versioned REST API with `/api/v1` prefix.
- **Middleware**:
  - `authenticate`: Extracts JWT from HTTP-only cookie or `Authorization: Bearer` header.
  - `requireAuth`: Enforces login.
  - `requireRole`: Enforces Role-Based Access Control (`CITIZEN`, `STAFF`, `ADMIN`).
  - `errorHandler`: Converts Zod and database exceptions into standardized JSON responses.

### Domain Modules:
1. `auth`: Session verification, login, registration, and evaluator role switching.
2. `users`: Profile management, saved locations, and preferences.
3. `services`: Civic service discovery catalog and category filtering.
4. `requests`: Citizen complaint creation, detail view, timeline status history, and comments.
5. `admin`: Staff complaint routing, department assignments, and lifecycle status transitions.
6. `payments`: Sandbox bill lookup, simulated payment transaction generation, and receipts.
7. `locations`: Nearby public amenities lookup with Haversine distance calculations and search.
8. `notifications`: Persistent in-app notifications with unread tracking.
9. `certificates`: Civic vital records demonstration request catalog and application flow.
10. `transport`: BMTC and Namma Metro schedule and route catalog.

### Persistence Layer (`packages/database`)
- **Prisma ORM**: Relational schema with strict foreign keys and cascading relationships.
- **Database Engine**: Relational SQLite database (`dev.db`) for portable local execution; easily configurable to PostgreSQL by updating `provider = "postgresql"` in `schema.prisma`.
