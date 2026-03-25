## ADDED Requirements

### Requirement: Customer registration and authentication
The system SHALL allow a customer to register with email, password, and full name. The system SHALL store passwords securely using strong hashing (e.g., bcrypt or Argon2).

#### Scenario: Register new customer
- **WHEN** a user submits a valid registration form
- **THEN** the system creates a new customer record and returns a success response

#### Scenario: Login existing customer
- **WHEN** a user submits valid credentials
- **THEN** the system returns an auth token and the user is authenticated
