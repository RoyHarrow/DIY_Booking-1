## ADDED Requirements

### Requirement: Save customer profile and home address
The system SHALL allow a customer to save and update contact and home address details (street, city, state, postal code, country, phone).

#### Scenario: Update profile details
- **WHEN** authenticated customer submits valid profile updates
- **THEN** the system stores the updated data and returns the current profile

### Requirement: Retrieve customer profile
The system SHALL allow an authenticated customer to retrieve their own profile and home address details.

#### Scenario: Get profile details
- **WHEN** authenticated customer requests their profile
- **THEN** the system returns the customer profile and associated addresses
