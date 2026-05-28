import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function GET() {
  try {
    const credentialsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;
    if (!credentialsBase64) throw new Error("Kredensial Base64 tidak ditemukan!");
    
    const credentialsString = Buffer.from(credentialsBase64, 'base64').toString('utf8');
    const credentials = JSON.parse(credentialsString);

    const serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Master'];
    if (!sheet) throw new Error("Sheet dengan nama 'Master' tidak ditemukan!");

    const rows = await sheet.getRows();
    const diklatSet = new Set<string>();
    const angkatanSet = new Set<string>();
    const ruanganSet = new Set<string>(); // <-- SET BARU UNTUK RUANGAN

    rows.forEach(row => {
      const diklatVal = row.get('Nama Diklat'); 
      const angkatanVal = row.get('Angkatan');
      const ruanganVal = row.get('Ruangan'); // <-- AMBIL DATA DARI KOLOM "Ruangan"
      
      if (diklatVal && diklatVal.trim() !== '') diklatSet.add(diklatVal.trim());
      if (angkatanVal && angkatanVal.trim() !== '') angkatanSet.add(angkatanVal.trim());
      if (ruanganVal && ruanganVal.trim() !== '') ruanganSet.add(ruanganVal.trim());
    });

    return NextResponse.json({
      diklat: Array.from(diklatSet),
      angkatan: Array.from(angkatanSet),
      ruangan: Array.from(ruanganSet), // <-- KIRIM KE FRONTEND
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error mengambil data master:", error);
    return NextResponse.json({ error: error.message || 'Gagal mengambil data' }, { status: 500 });
  }
}