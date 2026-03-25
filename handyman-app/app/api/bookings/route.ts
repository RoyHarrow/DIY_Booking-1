import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = verifyAccessToken(token)
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  try {
    const { addressId, serviceTypeId, description, preferredDate } =
      await req.json()

    if (!addressId || !serviceTypeId || !description || !preferredDate) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Verify address belongs to customer
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    })

    if (!address || address.customerId !== payload.customerId) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // Verify service type exists
    const serviceType = await prisma.serviceType.findUnique({
      where: { id: serviceTypeId },
    })

    if (!serviceType) {
      return NextResponse.json(
        { error: 'Service type not found' },
        { status: 404 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        customerId: payload.customerId,
        addressId,
        serviceTypeId,
        description,
        preferredDate: new Date(preferredDate),
      },
      include: { serviceType: true, address: true },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = verifyAccessToken(token)
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { customerId: payload.customerId },
      include: { serviceType: true, address: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
