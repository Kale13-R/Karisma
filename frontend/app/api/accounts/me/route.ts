import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  const userCookie = request.cookies.get('karisma_user')
  if (!userCookie) return NextResponse.json({ success: false }, { status: 401 })

  const res = await fetch(`${BACKEND}/api/accounts/me`, {
    headers: { Cookie: `karisma_user=${userCookie.value}` },
  })
  const data = await res.json()
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}
