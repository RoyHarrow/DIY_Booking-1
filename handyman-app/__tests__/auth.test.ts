import { generateTokens, verifyAccessToken } from '../lib/auth'

describe('Auth', () => {
  it('should generate and verify tokens', () => {
    const customerId = 'test-customer-id'
    const { accessToken } = generateTokens(customerId)
    const payload = verifyAccessToken(accessToken)
    expect(payload?.customerId).toBe(customerId)
  })
})