## Context

The current system has no customer-facing booking portal for handyman jobs. We need an internet-accessible web app where customers can register, store home/contact details, and schedule service appointments. The design assumes a modular web architecture (API backend + SPA frontend) with security, validation, and data persistence.

## Goals / Non-Goals

**Goals:**
- Provide secure customer registration, login, and profile management
- Store contact details and home address data for repeat bookings
- Allow customers to submit and review handyman job requests
- Implement booking state transitions (requested, accepted, in-progress, completed, canceled)
- Use API and DB patterns that scale for future marketplace features

**Non-Goals:**
- Implementing worker-side dispatch management or routing optimization
- Real-time chat/call between customer and handyman
- Payment processing and billing workflows (can be added later)

## Decisions

1. Auth architecture:
   - Use JWT-based authentication with refresh tokens (standard for SPA + API).
   - Store hashed passwords (bcrypt/Argon2).
   - Use role-based access (customer vs admin/service worker) from day one.

2. Data model:
   - Customer table for identity and contact info.
   - Address table separate with one-to-many relationship to Customer.
   - Booking table referring to Customer + Address + service details + status.
   - Service type reference table for categories (plumbing, electrical, carpentry).

3. APIs:
   - REST endpoints (e.g., `POST /api/auth/register`, `GET /api/bookings`).
   - Authorization middleware checks customer ownership of bookings.
   - Input validation via schema (e.g., JSON Schema or framework validators).

4. Frontend:
   - SPA with React/Vue/Svelte.
   - Pages: register/login, profile, home/address form, booking wizard, status view.
   - Consume backend API with auth header and refresh flow.

5. Security + operations:
   - Enforce HTTPS and CORS config for the origin.
   - Rate limit login and booking creation endpoints.
   - Apply server-side validation for all user data.

## Risks / Trade-offs

- [Risk] Imposing full RBAC now adds complexity.
  → Mitigation: Start with minimal customer role and simple checks; add worker/admin as separate step.
- [Risk] No payment controls means jobs can be requested without commitment.
  → Mitigation: Accept for MVP; add payment integration in next phase.
- [Risk] Improper address normalization may cause duplicate entries.
  → Mitigation: Add basic dedup logic and later extend with external address services.

## Migration Plan

1. Create DB schema migrations for users, addresses, service types, bookings.
2. Deploy API/backend with feature flags (e.g., booking module off until tested).
3. Deploy frontend and test on staging with real user flows.
4. Enable on production with monitoring of bookings and errors.
5. Rollback by disabling feature and backout migration (or keep read-only table state) if severe

## Open Questions

- Will there be a separate handyman/provider portal in this change or in a follow-up?
- Should customer home addresses support multiple properties per customer immediately?
- What are required fields for booking service details (estimated duration, materials, notes)?