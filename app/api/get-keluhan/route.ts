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

    const sheet = doc.sheetsByTitle['Data_Keluhan'];
    if (!sheet) throw new Error("Sheet 'Data_Keluhan' tidak ditemukan!");

    const rows = await sheet.getRows();
    const headers = sheet.headerValues; // Membaca otomatis nama-nama kolommu
    
    // Membaca data menggunakan metode .get() resmi
    const data = rows.map(row => ({
      idKeluhan: row.get(headers[0]) || '',
      waktuPelaporan: row.get(headers[1]) || '',
      namaPelapor: row.get(headers[2]) || '',
      kategori: row.get(headers[3]) || '',
      lokasi: row.get(headers[4]) || '',
      deskripsi: row.get(headers[5]) || '',
      status: row.get(headers[6]) || 'Menunggu',
      tindakLanjut: row.get(headers[7]) || '',
      waktuPenanganan: row.get(headers[8]) || '',
      keterangan: row.get(headers[9]) || ''
    }));

    return NextResponse.json({ data: data.reverse() }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal mengambil data' }, { status: 500 });
  }
}