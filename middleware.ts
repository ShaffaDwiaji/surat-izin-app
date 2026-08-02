import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminSession = request.cookies.get('admin_session');
  const isLoginPage = request.nextUrl.pathname === '/login';

  // ATURAN 1: Jika sudah login tapi iseng buka halaman /login lagi
  if (isLoginPage) {
    if (adminSession) {
      // Langsung belokkan ke ruang admin!
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Jika belum login, biarkan buka halaman form login
    return NextResponse.next();
  }

  // ATURAN 2: Jika mencoba masuk ruangan rahasia tapi belum login
  if (!adminSession) {
    // Tendang ke halaman login!
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika semua aman, silakan lewat
  return NextResponse.next();
}

// Konfigurasi area mana saja yang dijaga oleh Satpam
export const config = {
  matcher: [
    '/admin/:path*',
    '/monitoring/:path*',
    '/login'
  ],
};