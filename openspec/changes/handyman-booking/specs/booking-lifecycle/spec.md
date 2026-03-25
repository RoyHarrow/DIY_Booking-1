## ADDED Requirements

### Requirement: Booking status transitions
The system SHALL support booking status transitions: requested → accepted → in-progress → completed → canceled.

#### Scenario: Accept booking
- **WHEN** the system or admin marks a requested booking as accepted
- **THEN** the booking status changes to accepted

#### Scenario: Complete booking
- **WHEN** an in-progress booking is marked completed
- **THEN** the booking status changes to completed

#### Scenario: Cancel booking
- **WHEN** a customer cancels a requested or accepted booking
- **THEN** the booking status changes to canceled
