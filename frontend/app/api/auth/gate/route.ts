import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const backendUrl = process.env.API_URL ||
                     process.env.NEXT_PUBLIC_API_URL ||
                     'http://localhost:8000'

  console.log('[PROXY] Forwarding to:', `${backendUrl}/auth/gate`)

  const backendResponse = await fetch(`${backendUrl}/auth/gate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await backendResponse.json()
  console.log('[PROXY] Backend status:', backendResponse.status)
  console.log('[PROXY] Backend data:', JSON.stringify(data))

  if (!backendResponse.ok) {
    return NextResponse.json(data, { status: backendResponse.status })
  }

  // Log all headers from Railway response
  const setCookieHeader = backendResponse.headers.get('set-cookie')
  console.log('[PROXY] Set-Cookie header from Railway:', setCookieHeader)

  let sessionToken = ''

  if (setCookieHeader) {
    const match = setCookieHeader.match(/karisma_session=([^;]+)/)
    console.log('[PROXY] Regex match result:', match)
    if (match) {
      sessionToken = match[1]
    }
  }

  console.log('[PROXY] Extracted token length:', sessionToken.length)

  const response = NextResponse.json(data)

  if (sessionToken) {
    response.cookies.set('karisma_session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
    console.log('[PROXY] Cookie set on Vercel domain successfully')
  } else {
    console.log('[PROXY] WARNING: No session token extracted — cookie not set')
  }

  return response
}
