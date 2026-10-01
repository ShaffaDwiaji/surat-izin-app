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

    const sheet = doc.sheetsByTitle['Master'];
    if (!sheet) throw new Error("Sheet 'Master' tidak ditemukan!");

    const rows = await sheet.getRows();
    const headers = sheet.headerValues;

    const kedudukanIdx = headers.indexOf('Kedudukan');
    const ruanganIdx = headers.indexOf('Ruangan');

    const kedudukanList = [...new Set(rows.map(row => row.get(headers[kedudukanIdx])).filter(Boolean))];
    const ruanganList = [...new Set(rows.map(row => row.get(headers[ruanganIdx])).filter(Boolean))];

    return NextResponse.json({ kedudukan: kedudukanList, ruangan: ruanganList }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}