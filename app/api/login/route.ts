import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin } = body;
    
    // Mengambil PIN dari .env.local
    const correctPin = process.env.ADMIN_PIN;

    if (pin === correctPin) {
      // Jika benar, cetak Tiket Digital (Cookie) bernama 'admin_session'
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true, // Sangat aman, tidak bisa dicuri lewat JavaScript
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // Tiket berlaku selama 1 hari (24 Jam)
        path: '/',
      });
      
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Jika salah
    return NextResponse.json({ error: 'PIN yang Anda masukkan salah!' }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}