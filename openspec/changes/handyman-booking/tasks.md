## 1. Infrastructure

- [x] 1.1 Define database schema and create migrations for customers, addresses, service types, bookings
- [x] 1.2 Setup authentication framework (password hashing, JWT generation, token refresh)
- [x] 1.3 Add API scaffolding and routing structure for auth, profiles, and bookings

## 2. User and profile features

- [x] 2.1 Implement registration endpoint (`POST /api/auth/register`)
- [x] 2.2 Implement login endpoint (`POST /api/auth/login`)
- [x] 2.3 Implement endpoints for customer profile CRUD (`GET/PUT /api/profile`)
- [x] 2.4 Implement endpoints for address management (`GET/POST/PUT/DELETE /api/profile/addresses`)

## 3. Booking workflows

- [x] 3.1 Implement booking creation endpoint (`POST /api/bookings`)
- [x] 3.2 Implement listing endpoint (`GET /api/bookings`)
- [x] 3.3 Implement status transition endpoint(s) and logic (accept/in-progress/complete/cancel)
- [x] 3.4 Enforce authorization so customers only access own bookings

## 4. Frontend UX

- [x] 4.1 Build registration and login pages with validation
- [x] 4.2 Build customer profile and address forms
- [x] 4.3 Build booking creation and booking list pages
- [x] 4.4 Add booking lifecycle status display and actions

## 5. QA and deployment

- [x] 5.1 Add unit and integration tests for auth, profile, and booking APIs
- [x] 5.2 Add end-to-end tests for customer registration and booking flow
- [x] 5.3 Setup monitoring/logging for production and roll-back plan
