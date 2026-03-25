## ADDED Requirements

### Requirement: Create handyman booking
The system SHALL allow an authenticated customer to create a booking request with service type, date/time window, home address, and description.

#### Scenario: Submit valid booking request
- **WHEN** an authenticated customer submits a complete booking payload
- **THEN** the system creates a booking in status `requested` and returns the booking ID

### Requirement: List customer bookings
The system SHALL allow an authenticated customer to list their own bookings.

#### Scenario: List bookings
- **WHEN** an authenticated customer requests their bookings
- **THEN** the system returns bookings associated with that customer
