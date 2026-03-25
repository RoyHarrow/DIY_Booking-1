import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { generateTokens } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName } = await req.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    const existing = await prisma.customer.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const customer = await prisma.customer.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
      },
    })

    const { accessToken, refreshToken } = generateTokens(customer.id)

    const response = NextResponse.json(
      {
        id: customer.id,
        email: customer.email,
        fullName: customer.fullName,
        accessToken,
      },
      { status: 201 }
    )

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
