import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { namaPelapor, kategori, lokasi, deskripsi } = body;

    // 1. Persiapkan Kredensial Google
    const credentialsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;
    if (!credentialsBase64) throw new Error("Kredensial Base64 tidak ditemukan!");
    
    const credentialsString = Buffer.from(credentialsBase64, 'base64').toString('utf8');
    const credentials = JSON.parse(credentialsString);

    const serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // 2. Hubungkan ke Spreadsheet
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Data_Keluhan'];
    if (!sheet) throw new Error("Sheet dengan nama 'Data_Keluhan' tidak ditemukan di Google Sheets!");

    // 3. Generate ID Keluhan (Contoh: TKT-8492)
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const idKeluhan = `TKT-${randomNum}`;
    
    // 4. Catat Waktu (Zona Waktu WIB)
    const waktuPelaporan = new Date().toLocaleString('id-ID', { 
      timeZone: 'Asia/Jakarta',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    // 5. Simpan ke Google Sheets sesuai urutan kolom
    await sheet.addRow([
      idKeluhan,           // Kolom A
      waktuPelaporan,      // Kolom B
      namaPelapor,         // Kolom C
      kategori,            // Kolom D
      lokasi,              // Kolom E
      deskripsi,           // Kolom F
      'Menunggu',          // Kolom G (Status Default)
      '',                  // Kolom H (Tindak Lanjut - Kosong)
      '',                  // Kolom I (Waktu Penanganan - Kosong)
      ''                   // Kolom J (Keterangan - Kosong)
    ]);

    return NextResponse.json({ success: true, idKeluhan }, { status: 200 });

  } catch (error: any) {
    console.error("Error submit keluhan:", error);
    return NextResponse.json({ error: error.message || 'Gagal mengirim keluhan' }, { status: 500 });
  }
}