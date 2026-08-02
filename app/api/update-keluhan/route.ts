import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idKeluhan, status, tindakLanjut, keterangan } = body;

    const credentialsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;
    const credentialsString = Buffer.from(credentialsBase64!, 'base64').toString('utf8');
    const credentials = JSON.parse(credentialsString);

    const serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Data_Keluhan'];
    const rows = await sheet.getRows();
    const headers = sheet.headerValues; // Membaca otomatis nama-nama kolommu

    // Cari baris yang ID Keluhannya cocok menggunakan .get()
    const rowToUpdate = rows.find(r => r.get(headers[0]) === idKeluhan);

    if (!rowToUpdate) {
      return NextResponse.json({ error: 'Data keluhan tidak ditemukan' }, { status: 404 });
    }

    const waktuPenanganan = new Date().toLocaleString('id-ID', { 
      timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' 
    });

    // Update kolom menggunakan metode .set() resmi yang bersih dari error Typescript
    rowToUpdate.set(headers[6], status);
    rowToUpdate.set(headers[7], tindakLanjut);
    rowToUpdate.set(headers[8], waktuPenanganan);
    rowToUpdate.set(headers[9], keterangan);
    
    await rowToUpdate.save(); // Simpan perubahan ke GSheets

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal update data' }, { status: 500 });
  }
}