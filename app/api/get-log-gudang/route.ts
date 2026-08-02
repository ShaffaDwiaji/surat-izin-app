import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function GET(req: Request) {
  try {
    // Menangkap parameter 'limit' dari URL, jika tidak ada default-nya 50
    const url = new URL(req.url);
    const limitParams = url.searchParams.get('limit');
    const limit = limitParams ? parseInt(limitParams) : 50;

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
    const rows = await sheet.getRows();
    const headers = sheet.headerValues;
    
    // Ambil data (Index sesuai kolom: A=0, B=1, dst)
    const data = rows.map(row => ({
      no: row.get(headers[0]) || '',
      tanggal: row.get(headers[1]) || '',
      jam: row.get(headers[2]) || '',
      idTransaksi: row.get(headers[3]) || '',
      kodeBarang: row.get(headers[4]) || '',
      namaBarang: row.get(headers[5]) || '',
      petugas: row.get(headers[6]) || '',
      aktivitas: row.get(headers[7]) || '',
      jumlah: row.get(headers[8]) || '',
      keterangan: row.get(headers[9]) || ''
    }));

    // Dibalik (Terbaru di atas), lalu dipotong (slice) agar tidak membebani server
    const limitedData = data.reverse().slice(0, limit);

    return NextResponse.json({ data: limitedData, totalData: data.length }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}