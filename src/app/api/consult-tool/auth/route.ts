import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'ct_auth'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const password = String(body?.password ?? '')

  const expected = process.env.CONSULT_TOOL_PASSWORD ?? ''
  if (!expected || password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 4, // 8시간
  })
  return res
}