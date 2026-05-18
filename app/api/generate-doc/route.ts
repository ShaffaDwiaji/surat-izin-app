import { NextResponse } from 'next/server';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Tentukan template mana yang harus dipakai berdasarkan pilihan pengguna
    let templateName = '';
    if (body.jenisPengajuan === 'keluar_kampus') {
      templateName = 'template_keluar_kampus.docx';
    } else if (body.jenisPengajuan === 'keluar_asrama') {
      templateName = 'template_keluar_asrama.docx';
    } else if (body.jenisPengajuan === 'berlibur') {
      templateName = 'template_berlibur.docx';
    } else {
      throw new Error("Jenis pengajuan tidak valid.");
    }

    // 2. Cari file template di folder "templates" yang sudah kamu buat
    const templatePath = path.resolve(process.cwd(), 'templates', templateName);
    
    // Baca isi file template secara biner
    const content = fs.readFileSync(templatePath, 'binary');

    // 3. Muat template ke dalam PizZip
    const zip = new PizZip(content);

    // 4. Inisialisasi docxtemplater
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // 5. Olah Tanggal agar menjadi Hari dan Tanggal yang terpisah
    const dateBerangkatObj = new Date(body.tanggalKeluar);
    const dateKembaliObj = new Date(body.tanggalKembali);
    
    // Fungsi kecil untuk mendapatkan nama hari dalam bahasa Indonesia
    const getNamaHari = (date: Date) => {
      const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      return hari[date.getDay()];
    };

    // Fungsi kecil untuk memformat tanggal (misal: 14 Mei 2026)
    const formatTanggal = (date: Date) => {
       const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
       return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
    };

    // 6. Masukkan semua data ke dalam template
    doc.render({
      nama: body.nama,
      nipp: body.nipp,
      diklat: body.diklat,
      angkatan: body.angkatan,
      noKamar: body.noKamar,
      
      // Data keberangkatan yang diolah
      hariKeluar: getNamaHari(dateBerangkatObj),
      tanggalKeluar: formatTanggal(dateBerangkatObj),
      jamKeluar: body.jamKeluar,
      
      keperluan: body.keperluan,
      alamatTujuan: body.alamatTujuan,

      // Data kembali yang diolah
      hariKembali: getNamaHari(dateKembaliObj),
      tanggalKembali: formatTanggal(dateKembaliObj),
      jamKembali: body.jamKembali,
      
      // Opsional jika kamu pakai {tanggalCetak}
      tanggalCetak: formatTanggal(new Date()) 
    });

    // 7. Hasilkan dokumen baru (Kembali gunakan 'nodebuffer' yang paling stabil)
    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    // 8. Kirim file dan beri tahu TypeScript untuk tidak perlu protes dengan "as any"
    return new NextResponse(buf as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="Surat_Izin_${body.nama.replace(/\s+/g, '_')}.docx"`,
      },
    });

  } catch (error: any) {
    console.error("Gagal generate dokumen:", error);
    return NextResponse.json({ error: 'Gagal membuat dokumen: ' + error.message }, { status: 500 });
  }
}