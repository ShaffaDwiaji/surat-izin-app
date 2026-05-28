import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(request: Request) {
  try {
    const body = await request.json();

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

    const sheet = doc.sheetsByTitle['Monitoring_Fasilitas'];
    if (!sheet) throw new Error("Sheet 'Monitoring_Fasilitas' tidak ditemukan!");

    // Menangkap waktu sistem secara otomatis saat form diproses
    const waktuRequest = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

    // Menyimpan array checkbox menjadi string (contoh: "Aula, 204, Simulator")
    const kelasString = body.kebutuhanKelas.join(', ');

    await sheet.addRow({
      'Tanggal Request': waktuRequest,
      'Unit Pemohon': body.unitPemohon,
      'Nama Kegiatan': body.namaKegiatan,
      'Tanggal Mulai': body.tanggalMulai,
      'Tanggal Selesai': body.tanggalSelesai,
      'Kebutuhan Kelas': kelasString,
      'Jumlah Peserta': body.jumlahPeserta,
      'Jumlah Hari': body.jumlahHari,
      'Keterangan': body.keterangan || '-',
    });

    return NextResponse.json({ message: 'Data fasilitas berhasil direkam!' }, { status: 200 });

  } catch (error: any) {
    console.error("Error monitoring:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}