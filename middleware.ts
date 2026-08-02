import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminSession = request.cookies.get('admin_session');
  const isLoginPage = request.nextUrl.pathname === '/login';

  // ATURAN 1: Jika sudah login tapi buka halaman /login lagi
  if (isLoginPage) {
    if (adminSession) {
      // Langsung belokkan ke admin
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Jika belum login, buka halaman form login
    return NextResponse.next();
  }

  // ATURAN 2: Jika mencoba masuk admin tapi belum login
  if (!adminSession) {
    // Tendang ke halaman login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika semua aman, silakan lewat
  return NextResponse.next();
}

// Konfigurasi area mana saja yang dijaga
export const config = {
  matcher: [
    '/admin/:path*',
    '/login'
  ],
};