import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const res = await fetch(`${BACKEND}/api/accounts/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: rawBody,
  })
  const data = await res.json()
  if (!res.ok) return NextResponse.json(data, { status: res.status })

  const backendCookie = res.headers.get('set-cookie')
  const response = NextResponse.json(data)
  if (backendCookie) {
    const jwtMatch = backendCookie.match(/karisma_user=([^;]+)/)
    if (jwtMatch) {
      response.cookies.set('karisma_user', jwtMatch[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      })
    }
  }
  return response
}
