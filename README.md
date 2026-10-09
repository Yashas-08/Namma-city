# Namma City — One City. One Platform. Multiple Services.

**Namma City** is a mobile-first unified civic services application engineered for city residents. It centralizes municipal grievance reporting, utility bill payments, public transit lookup, certificates, and nearby civic amenities in a single, accessible, trustworthy interface.

---

## 🏛️ Key Features

- **Civic Grievance Management (End-to-End)**:
  - 3-step reporting workflow: Issue Category → Interactive GPS Map Selection → Review & Submission
  - Supports photo attachments and landmark identification
  - Unique tracking ID generation (e.g. `#REQ-2048`)
  - Real-time status progression (`SUBMITTED` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED`)
  - Citizen and municipal staff comments and timeline audit log
- **Utility Bill Settlement**:
  - Electricity (BESCOM), Water (BWSSB), and BBMP Property Tax lookup
  - Consumer number validation and due-date tracking
  - Sandbox payment processing with verifiable transaction receipts (`TXN...` and `REC...`)
  - Real-time user notification and payment history logging
- **Interactive Civic Map & Nearby Services**:
  - Interactive Leaflet-powered map with custom Civic Teal location pins
  - Directory of BBMP Ward Offices, Police Stations, Hospitals, BMTC Bus Depots, and Post Offices
  - Approximate straight-line distance calculations and operating hours
- **Municipal Staff & Administrator Portal**:
  - Departmental complaint queue and reassignment
  - Official staff lifecycle status publishing with citizen notifications
- **Transit & Civic Information**:
  - BMTC bus routes, Vayu Vajra airport shuttles, and Namma Metro schedules
  - Digital vital records application workflow (Birth/Death Certificates, Trade Licenses)

---

## 🎨 Design System: Civic Teal

Built following strict municipal design guidelines from `design.md` and `UI.md` and the 12-screen Namma City mobile specification:
- **Primary Teal**: `#176B68`
- **Primary Dark**: `#125452`
- **Background**: `#F7F9F8`
- **Surface**: `#FFFFFF`
- **Border**: `#DCE4E2`
- **Semantic Badges**:
  - `In Progress`: `#FDF5EC` / `#A66A25`
  - `Resolved`: `#EAF5EF` / `#287A50`
  - `Due Alert`: `#FCEEED` / `#C4473F`
- **Restrained Anti-AI Aesthetics**: Clean typography, high-contrast accessible touch targets (≥44px), subtle shadows, and zero flashy gradients.

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Leaflet
- **Backend API**: Node.js, Express, TypeScript, Zod, JWT Session Management, Cookie-Parser, CORS
- **Database**: SQLite (via Prisma ORM for zero-config portable local persistence) / PostgreSQL compatible
- **Architecture**: Monorepo with `apps/web`, `apps/api`, `packages/database`, and `packages/shared`

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation & Database Setup
```bash
# 1. Install dependencies across all workspaces
npm install

# 2. Build shared packages and generate Prisma client
npm run build --workspace=@namma-city/shared
npm run prisma:generate --workspace=@namma-city/database

# 3. Synchronize database schema and seed authentic civic records
npm run prisma:migrate --workspace=@namma-city/database
npm run prisma:seed --workspace=@namma-city/database

# 4. Build API and start backend
npm run build --workspace=@namma-city/api
node apps/api/dist/index.js # Runs on http://localhost:5000

# 5. Start frontend web app
npm run dev --workspace=@namma-city/web # Runs on http://localhost:3000
```

---

## 👥 Demo Accounts (Pre-Seeded)

| Role | Name | Email | Credentials / Switcher |
|---|---|---|---|
| **Citizen** | Yashas K | `yashas@example.com` | Default / One-click header switcher |
| **Municipal Staff** | Officer Ramesh | `ramesh@bbmp.gov.in` | Header Switcher: Staff |
| **Administrator** | Municipal Admin | `admin@nammacity.gov.in` | Header Switcher: Admin |

---

## 📱 The 12 Screen Reference Walkthrough

1. **Splash (`/`)**: Vidhana Soudha SVG civic branding with smooth progressive entrance
2. **Home (`/home`)**: Location selector, contextual greeting, 3x3 quick services grid, "Clean City" banner
3. **All Services (`/services`)**: Category pills, service rows with colored badges
4. **Report Issue Step 1 (`/report`)**: 9 issue categories, photo upload counter, 500-char description
5. **Select Location Step 2 (`/report/location`)**: Interactive map, search bar, GPS marker, address card
6. **Request Preview Step 3 (`/report/review`)**: Summary card, map thumbnail, photo preview, submit CTA
7. **Utility Payments (`/payments`)**: Category tabs, consumer number, bill amount, due date alert
8. **Payment Status (`/payments/result/[id]`)**: Success icon, payment metadata card, printable receipt modal
9. **My Requests (`/requests`)**: Filter tabs (All, In Progress, Resolved), photo cards with status badges
10. **Request Details (`/requests/[id]`)**: Full status banner, photo preview, location, audit timeline, comments
11. **Nearby Services (`/nearby`)**: Category markers on map, distance and operating hours list
12. **Profile (`/profile`)**: User information, edit mode, service history menu, logout button
