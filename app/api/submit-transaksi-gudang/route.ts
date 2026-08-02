import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { kodeBarang, namaBarang, aktivitas, jumlah, keterangan, petugas } = body;

    const credentialsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;
    const credentialsString = Buffer.from(credentialsBase64!, 'base64').toString('utf8');
    const credentials = JSON.parse(credentialsString);

    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Log_Gudang'];
    
    // Hitung Nomor urut berdasarkan jumlah baris yang ada
    const rowsCount = (await sheet.getRows()).length;
    const no = rowsCount + 1;

    // Menyiapkan Tanggal dan Jam saat ini (Otomatis)
    const now = new Date();
    const tanggal = now.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' }); // cth: 2/8/2026
    const jam = now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute:'2-digit' }) + ' WIB';
    
    // Generate ID Transaksi acak
    const idTransaksi = `TRX-${Math.floor(10000 + Math.random() * 90000)}`;

    // Menyimpan ke Log_Gudang sesuai kolom (A sampai J)
    await sheet.addRow([
      no,              // A: No
      tanggal,         // B: Tanggal
      jam,             // C: Jam
      idTransaksi,     // D: ID_Transaksi
      kodeBarang,      // E: Kode_Barang
      namaBarang,      // F: Nama_Barang
      petugas,         // G: Petugas
      aktivitas,       // H: Jenis_Aktivitas (Terima/Pindah/Muat)
      jumlah,          // I: Jumlah
      keterangan       // J: Keterangan
    ]);

    return NextResponse.json({ success: true, idTransaksi }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}