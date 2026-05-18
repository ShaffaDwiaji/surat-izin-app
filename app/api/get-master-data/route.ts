import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function GET() {
  try {
    // 1. Membaca dan men-decode sandi Base64 dari .env.local
    const credentialsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;
    if (!credentialsBase64) {
      throw new Error("Kredensial Base64 tidak ditemukan!");
    }
    
    const credentialsString = Buffer.from(credentialsBase64, 'base64').toString('utf8');
    const credentials = JSON.parse(credentialsString);

    // 2. Setup Autentikasi dengan data yang sudah bersih
    const serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // 3. Hubungkan ke Spreadsheet
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Master'];
    if (!sheet) {
      throw new Error("Sheet dengan nama 'Master' tidak ditemukan!");
    }

    const rows = await sheet.getRows();
    const diklatSet = new Set<string>();
    const angkatanSet = new Set<string>();

    rows.forEach(row => {
      const diklatVal = row.get('Nama Diklat'); 
      const angkatanVal = row.get('Angkatan');
      
      if (diklatVal && diklatVal.trim() !== '') diklatSet.add(diklatVal.trim());
      if (angkatanVal && angkatanVal.trim() !== '') angkatanSet.add(angkatanVal.trim());
    });

    return NextResponse.json({
      diklat: Array.from(diklatSet),
      angkatan: Array.from(angkatanSet),
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error mengambil data master:", error);
    return NextResponse.json({ error: error.message || 'Gagal mengambil data' }, { status: 500 });
  }
}