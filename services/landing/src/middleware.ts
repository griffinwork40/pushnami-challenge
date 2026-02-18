import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Ensure visitor_id cookie persists across sessions
  if (!req.cookies.get('visitor_id')) {
    res.cookies.set('visitor_id', uuidv4(), {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
