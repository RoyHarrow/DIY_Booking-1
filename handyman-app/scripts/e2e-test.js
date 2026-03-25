// Basic E2E test script for registration and booking flow
// This would normally use a tool like Playwright

async function testRegistrationAndBooking() {
  // Simulate API calls
  const registerResponse = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User'
    })
  })

  if (!registerResponse.ok) {
    throw new Error('Registration failed')
  }

  const { accessToken } = await registerResponse.json()

  // Add address
  const addressResponse = await fetch('/api/profile/addresses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'USA'
    })
  })

  if (!addressResponse.ok) {
    throw new Error('Address creation failed')
  }

  const address = await addressResponse.json()

  // Create booking
  const bookingResponse = await fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      addressId: address.id,
      serviceTypeId: '1', // Assuming service type exists
      description: 'Fix leaky faucet',
      preferredDate: new Date().toISOString()
    })
  })

  if (!bookingResponse.ok) {
    throw new Error('Booking creation failed')
  }

  console.log('E2E test passed')
}

testRegistrationAndBooking().catch(console.error)