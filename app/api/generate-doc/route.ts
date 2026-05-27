import { NextResponse } from 'next/server';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
// Import library baru
import ImageModule from 'docxtemplater-image-module-free';
import QRCode from 'qrcode'; 
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();

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

    const templatePath = path.resolve(process.cwd(), 'templates', templateName);
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    // ==========================================
    // LOGIKA QR CODE & IMAGE MODULE
    // ==========================================
    
    // 1. Buat teks yang akan disimpan di dalam QR Code
    const waktuTandaTangan = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const qrText = `Ditandatangani secara digital oleh:\nNama: ${body.nama}\nNIPP: ${body.nipp}\nPada: ${waktuTandaTangan}\nDokumen Valid Darman Prasetyo Campus`;

    // 2. Generate gambar QR Code berwujud Base64 String
    const qrBase64DataUrl = await QRCode.toDataURL(qrText, { margin: 1, width: 150 });
    
    // Hilangkan awalan "data:image/png;base64," agar tersisa murni biner
    const base64Data = qrBase64DataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

    // 3. Konfigurasi Image Module untuk Docxtemplater
    const imageOptions = {
      centered: false, // QR tidak diletakkan di tengah secara paksa
      getImage: function (tagValue: string) {
        // Mengubah string base64 kembali menjadi Buffer gambar
        return Buffer.from(tagValue, 'base64'); 
      },
      getSize: function () {
        // Ukuran QR Code di dalam Word (Lebar x Tinggi dalam pixel)
        return [64, 64]; 
      },
    };
    
    const imageModule = new ImageModule(imageOptions);

    // ==========================================
    // GENERATE DOCUMENT
    // ==========================================

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [imageModule], // Masukkan modul gambar ke sini
    });

    const dateBerangkatObj = new Date(body.tanggalKeluar);
    const dateKembaliObj = new Date(body.tanggalKembali);
    
    const getNamaHari = (date: Date) => {
      const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      return hari[date.getDay()];
    };

    const formatTanggal = (date: Date) => {
       const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
       return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
    };

    doc.render({
      nama: body.nama,
      nipp: body.nipp,
      diklat: body.diklat,
      angkatan: body.angkatan,
      noKamar: body.noKamar,
      hariKeluar: getNamaHari(dateBerangkatObj),
      tanggalKeluar: formatTanggal(dateBerangkatObj),
      jamKeluar: body.jamKeluar,
      keperluan: body.keperluan,
      alamatTujuan: body.alamatTujuan,
      hariKembali: getNamaHari(dateKembaliObj),
      tanggalKembali: formatTanggal(dateKembaliObj),
      jamKembali: body.jamKembali,
      tanggalCetak: formatTanggal(new Date()),
      
      // INI DIA: Masukkan data biner gambar QR ke tag {%qrPemohon}
      qrPemohon: base64Data 
    });

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

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