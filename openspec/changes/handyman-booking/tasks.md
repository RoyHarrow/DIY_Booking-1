## 1. Infrastructure

- [ ] 1.1 Define database schema and create migrations for customers, addresses, service types, bookings
- [ ] 1.2 Setup authentication framework (password hashing, JWT generation, token refresh)
- [ ] 1.3 Add API scaffolding and routing structure for auth, profiles, and bookings

## 2. User and profile features

- [ ] 2.1 Implement registration endpoint (`POST /api/auth/register`)
- [ ] 2.2 Implement login endpoint (`POST /api/auth/login`)
- [ ] 2.3 Implement endpoints for customer profile CRUD (`GET/PUT /api/profile`)
- [ ] 2.4 Implement endpoints for address management (`GET/POST/PUT/DELETE /api/profile/addresses`)

## 3. Booking workflows

- [ ] 3.1 Implement booking creation endpoint (`POST /api/bookings`)
- [ ] 3.2 Implement listing endpoint (`GET /api/bookings`)
- [ ] 3.3 Implement status transition endpoint(s) and logic (accept/in-progress/complete/cancel)
- [ ] 3.4 Enforce authorization so customers only access own bookings

## 4. Frontend UX

- [ ] 4.1 Build registration and login pages with validation
- [ ] 4.2 Build customer profile and address forms
- [ ] 4.3 Build booking creation and booking list pages
- [ ] 4.4 Add booking lifecycle status display and actions

## 5. QA and deployment

- [ ] 5.1 Add unit and integration tests for auth, profile, and booking APIs
- [ ] 5.2 Add end-to-end tests for customer registration and booking flow
- [ ] 5.3 Setup monitoring/logging for production and roll-back plan
