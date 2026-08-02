import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Memanggil brankas cookie dan menghapus tiket 'admin_session'
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal melakukan logout' }, { status: 500 });
  }
}