import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = verifyAccessToken(token)
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  try {
    const serviceTypes = await prisma.serviceType.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(serviceTypes)
  } catch (error) {
    console.error('Service types fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
