import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function GET() {
  try {
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
    const headers = sheet.headerValues;
    
    // Ambil data (Index sesuai kolom: A=0, B=1, dst)
    const data = rows.map(row => ({
      no: row.get(headers[0]) || '',
      kodeBarang: row.get(headers[1]) || '',
      namaBarang: row.get(headers[2]) || '',
      kategori: row.get(headers[3]) || '',
      satuan: row.get(headers[4]) || '',
      stok: row.get(headers[5]) || '0', // Nilai F2 yang dihitung rumus
    }));

    return NextResponse.json({ data }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}