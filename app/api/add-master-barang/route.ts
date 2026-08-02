import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { kodeBarang, namaBarang, kategori, satuan } = body;

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
    
    const sheet = doc.sheetsByTitle['Master_Barang'];
    const rows = await sheet.getRows();
    
    // Menghitung nomor urut
    const nextNo = rows.length + 1;
    
    // Menghitung baris (Row) ke berapa di Google Sheets. 
    // Header = baris 1, Data yang ada = rows.length, jadi baris baru = rows.length + 2
    const rowIndex = rows.length + 2;
    
    // Menyuntikkan rumus langsung dari API!
    const formulaStok = `=SUMIFS(Log_Gudang!I:I; Log_Gudang!E:E; B${rowIndex}; Log_Gudang!H:H; "Terima") - SUMIFS(Log_Gudang!I:I; Log_Gudang!E:E; B${rowIndex}; Log_Gudang!H:H; "Muat") - SUMIFS(Log_Gudang!I:I; Log_Gudang!E:E; B${rowIndex}; Log_Gudang!H:H; "Pindah")`;

    await sheet.addRow([
      nextNo,         // Kolom A: No
      kodeBarang,     // Kolom B: Kode
      namaBarang,     // Kolom C: Nama
      kategori,       // Kolom D: Kategori
      satuan,         // Kolom E: Satuan
      formulaStok     // Kolom F: Rumus Stok Otomatis
    ]);

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}