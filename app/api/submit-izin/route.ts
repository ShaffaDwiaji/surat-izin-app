import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Decode Kredensial Base64
    const credentialsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;
    if (!credentialsBase64) {
      throw new Error("Kredensial Base64 tidak ditemukan!");
    }
    
    const credentialsString = Buffer.from(credentialsBase64, 'base64').toString('utf8');
    const credentials = JSON.parse(credentialsString);

    // 2. Setup Autentikasi
    const serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // 3. Hubungkan ke Spreadsheet
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
    await doc.loadInfo();

    // 4. Pilih sheet bernama "Data_Izin"
    const sheet = doc.sheetsByTitle['Data_Izin'];
    if (!sheet) {
      throw new Error("Sheet dengan nama 'Data_Izin' tidak ditemukan!");
    }

    // 5. Masukkan data ke dalam baris baru (Pastikan Header di Excel sama persis dengan ini)
    await sheet.addRow({
      'Nama Lengkap': body.nama,
      'NIPP': body.nipp,
      'No Telp': body.telp,
      'Diklat': body.diklat,
      'Angkatan': body.angkatan,
      'No Kamar': body.noKamar,
      'Jenis Pengajuan': body.jenisPengajuan,
      'Keperluan': body.keperluan,
      'Alamat Tujuan': body.alamatTujuan,
      'Waktu Keluar': `${body.tanggalKeluar} ${body.jamKeluar}`.trim(),
      'Waktu Kembali': `${body.tanggalKembali} ${body.jamKembali}`.trim(),
    });

    return NextResponse.json({ message: 'Data sukses tersimpan di Google Sheets!' }, { status: 200 });

  } catch (error: any) {
    console.error("Error menyimpan ke sheet:", error);
    return NextResponse.json({ error: error.message || 'Gagal memproses data' }, { status: 500 });
  }
}