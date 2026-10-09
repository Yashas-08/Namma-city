# Namma City — API Specification

Base URL: `http://localhost:5000/api/v1`

All responses follow the standardized contract:
```json
{
  "success": true,
  "data": { ... }
}
```
Or for errors:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error description"
  }
}
```

---

## 1. Authentication & Session

- `GET /auth/session` — Retrieve active session, user profile, and unread notification counts.
- `POST /auth/login` — Log in with email and password.
- `POST /auth/register` — Citizen registration.
- `POST /auth/switch-demo` — Switch between CITIZEN, STAFF, and ADMIN roles for testing.
- `POST /auth/logout` — Invalidate session and clear auth cookie.

---

## 2. Civic Grievances & Requests

- `GET /requests?status=...` — Retrieve citizen's submitted complaints.
- `GET /requests/:id` — Retrieve full details, attachments, timeline audit events, and comments.
- `POST /requests` — Submit a new civic grievance with category, description, coordinates, address, and photos.
- `POST /requests/:id/comments` — Post a public comment on a request.

---

## 3. Municipal Staff & Administrator Actions

- `GET /admin/requests?departmentId=...&status=...` — Retrieve city-wide complaints queue.
- `PATCH /admin/requests/:id/assign` — Assign request to specific department and field staff.
- `PATCH /admin/requests/:id/status` — Update lifecycle status (`SUBMITTED` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED` → `REJECTED`) with an official note.
- `GET /admin/departments` — List municipal departments and staff counts.

---

## 4. Utility Payments

- `GET /payments/providers` — List supported utility providers (BESCOM, BWSSB, BBMP_TAX).
- `POST /payments/bill-lookup` — Lookup current due bill by provider code and consumer number.
- `POST /payments/pay` — Process sandbox utility payment with idempotency, receipt generation, and notification.
- `GET /payments/history` — List user's payment transaction history.
- `GET /payments/:id` — Retrieve specific transaction receipt details.

---

## 5. Locations & Directory

- `GET /locations/nearby?category=...&lat=...&lng=...` — List nearby municipal offices, hospitals, police stations, and transport hubs sorted by approximate distance.
- `GET /locations/search?q=...` — Search city places and addresses.
- `GET /locations/reverse?lat=...&lng=...` — Reverse geocode coordinates into a human-readable street address.

---

## 6. Notifications

- `GET /notifications` — List persistent in-app notifications and unread badge count.
- `PATCH /notifications/:id/read` — Mark notification as read.
- `PATCH /notifications/read-all` — Mark all user notifications as read.

---

## 7. Extended Services

- `GET /certificates/services` — List available vital record certificate categories.
- `POST /certificates/requests` — Submit demonstration certificate application.
- `GET /certificates/requests` — Track user's certificate applications.
- `GET /transport/routes?q=...` — Search BMTC bus routes and Namma Metro lines.
- `GET /health` — API health check and uptime.
