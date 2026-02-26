import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'ct_auth'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // consult-tool 하위에서만 동작
  if (!pathname.startsWith('/consult-tool')) return NextResponse.next()

  // 인증 페이지/인증 API는 통과
  if (pathname === '/consult-tool/auth' || pathname.startsWith('/api/consult-tool/auth')) {
    return NextResponse.next()
  }

  // 쿠키 없으면 auth로
  const authed = req.cookies.get(COOKIE_NAME)?.value === '1'
  if (!authed) {
    const url = req.nextUrl.clone()
    url.pathname = '/consult-tool/auth'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/consult-tool/:path*'],
}
