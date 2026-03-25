import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const backendResponse = await fetch(`${backendUrl}/auth/gate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await backendResponse.json()

  if (!backendResponse.ok) {
    return NextResponse.json(data, { status: backendResponse.status })
  }

  const setCookieHeader = backendResponse.headers.get('set-cookie')
  let sessionToken = ''

  if (setCookieHeader) {
    const match = setCookieHeader.match(/karisma_session=([^;]+)/)
    if (match) {
      sessionToken = match[1]
    }
  }

  const response = NextResponse.json(data)

  if (sessionToken) {
    response.cookies.set('karisma_session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
  }

  return response
}
