import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  // Forward the raw body text to avoid any re-serialization issues
  const rawBody = await request.text()
  const res = await fetch(`${BACKEND}/api/accounts/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: rawBody,
  })
  const data = await res.json()
  if (!res.ok) return NextResponse.json(data, { status: res.status })

  // Forward the JWT cookie the backend set
  const backendCookie = res.headers.get('set-cookie')
  const response = NextResponse.json(data)
  if (backendCookie) {
    // Re-set with dev-safe secure flag
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
