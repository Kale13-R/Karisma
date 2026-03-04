import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('karisma_session')
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/gate') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  if (!session) {
    const gateUrl = new URL('/gate', request.url)
    return NextResponse.redirect(gateUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|videos|images).*)'],
}
