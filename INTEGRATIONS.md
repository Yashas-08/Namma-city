# Namma City — External Integrations & Service Classification

Per Part 12 of the Namma City Master Specification, all urban capabilities must be transparently designated to prevent false claims of government integration:

---

## 1. Classification Definitions

- **LIVE**: Connected and verified against a live production external API.
- **SANDBOX**: Connected to an authorized provider staging or sandbox environment.
- **DEMO**: Simulated internally with seeded accounts, realistic API contracts, and real database persistence.
- **INFORMATIONAL**: Provides verified public information and directories without direct transactional processing.
- **UNAVAILABLE**: Planned but not yet integrated.

---

## 2. Capability Matrix

| Capability / Provider | Mode | Implementation Description |
|---|---|---|
| **Civic Grievance Management (BBMP)** | **LIVE (Internal Database)** | Persisted directly to PostgreSQL/SQLite via Prisma; full end-to-end multi-step workflow. |
| **Electricity Payments (BESCOM)** | **DEMO / SANDBOX** | Seeded consumer accounts (`1234567890`), realistic bill calculation (`₹ 1,240`), verifiable receipt generation (`TXN...`). |
| **Water Supply (BWSSB)** | **DEMO / SANDBOX** | Seeded consumer accounts (`BWSSB-77291`), bill calculation (`₹ 680`). |
| **Property Tax (BBMP)** | **DEMO / SANDBOX** | SAS property tax assessment lookup (`SAS-2026-9812`). |
| **Payment Gateway (UPI / Cards)** | **SANDBOX SIMULATOR** | Safe sandbox simulation; does not collect actual banking credentials or debit cards. |
| **Maps & Reverse Geocoding** | **LIVE (OpenStreetMap)** | Real Leaflet tile integration, OpenStreetMap base layer, distance calculations. |
| **Public Transit (BMTC / Metro)** | **INFORMATIONAL** | Real schedules for BMTC KIA-8, G-2, 500-D, and Namma Metro Purple & Green lines. |
| **Vital Certificates (Birth/Death/Trade)**| **DEMO WORKFLOW** | Demonstration application intake and tracking without claiming legal certification. |
| **Municipal Directory** | **LIVE / VERIFIED** | Real addresses and contact numbers for BBMP Ward offices, police stations, and health centers. |
