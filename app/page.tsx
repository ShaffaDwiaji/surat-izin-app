'use client';

import { useState, useEffect, FormEvent } from 'react';

// Pisahkan nilai default form ke variabel agar mudah dikosongkan (reset) nanti
const initialFormData = {
  nama: '',
  nipp: '',
  telp: '',
  diklat: '',
  angkatan: '',
  noKamar: '',
  jenisPengajuan: 'keluar_kampus',
  keperluan: '',
  alamatTujuan: '',
  tanggalKeluar: '',
  jamKeluar: '',
  tanggalKembali: '',
  jamKembali: '',
};

export default function Home() {
  const [currentView, setCurrentView] = useState<'landing' | 'form'>('landing');

  // State Data Master
  const [masterOptions, setMasterOptions] = useState({ diklat: [], angkatan: [] });
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  // State Form & UI/UX
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false); // Mengontrol tombol loading
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Mengontrol pop-up sukses

  // Fetch Master Data
  useEffect(() => {
    async function fetchMasterData() {
      try {
        const res = await fetch('/api/get-master-data');
        const data = await res.json();
        if (res.ok) {
          setMasterOptions(data);
        }
      } catch (error) {
        console.error('Gagal memuat data master', error);
      } finally {
        setIsLoadingOptions(false);
      }
    }
    fetchMasterData();
  }, []);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Kita buat salinan data sementara
    let updatedData = { ...formData, [name]: value };

    // Logika 1: Jika berlibur, jam kembali otomatis 22:00
    if (name === 'jenisPengajuan' && value === 'berlibur') {
      updatedData.jamKembali = '22:00';
    }

    // Logika 2: Validasi Tanggal (PENTING)
    if (name === 'tanggalKeluar') {
      // Jika tanggal kembali sudah diisi, DAN tanggal kembali ternyata lebih kecil dari tanggal keluar baru
      if (updatedData.tanggalKembali && value > updatedData.tanggalKembali) {
        // Otomatis samakan tanggal kembali dengan tanggal keluar
        updatedData.tanggalKembali = value;
      }
    }

    // Simpan data yang sudah divalidasi ke state
    setFormData(updatedData);
  };
  // Fungsi Submit yang Diperbarui
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Kirim data ke Google Sheets (API Lama)
      const sheetResponse = await fetch('/api/submit-izin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!sheetResponse.ok) {
        throw new Error('Gagal menyimpan data ke database.');
      }

      // 2. Jika sukses tersimpan, Panggil API Generate Dokumen
      const docResponse = await fetch('/api/generate-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!docResponse.ok) {
         throw new Error('Gagal mencetak dokumen.');
      }

      // 3. Proses File Unduhan (Blob)
      const blob = await docResponse.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Membuat elemen <a> sementara untuk memicu download paksa
      const a = document.createElement('a');
      a.href = url;
      // Nama file default, backend tetap akan memberikan nama spesifik
      a.download = `Surat_Izin_${formData.nama.replace(/\s+/g, '_')}.docx`; 
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Bersihkan memori browser

      // 4. Tampilkan Modal Sukses
      setShowSuccessModal(true);

    } catch (error: any) {
      alert('Terjadi kesalahan: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-kai-blue to-kai-dark flex flex-col items-center py-12 px-4 font-sans text-kai-text">
      
      {/* HEADER WRAPPER */}
      <div className="bg-white rounded-[35px] py-10 px-6 md:px-12 w-full max-w-[900px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 h-[6px] w-full bg-gradient-to-r from-kai-orange to-[#ff9b5a]"></div>
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 md:gap-5">
          <div className="order-1">
            <img src="/kai.png" alt="Logo Kai" className="h-[45px] md:h-[60px] rounded-lg p-2" />
          </div>
          <div className="order-3 md:order-2 text-center flex-1 w-full md:w-auto mt-4 md:mt-0">
            <h1 className="text-[22px] md:text-[28px] font-bold text-kai-blue mb-2">Portal Izin Darman Prasetyo</h1>
            <p className="text-[13px] md:text-[14px] text-gray-500 leading-relaxed">
              Sistem Pengajuan Izin Keluar Kampus, Asrama, dan Berlibur
            </p>
          </div>
          <div className="order-2 md:order-3">
            <img src="/kaicorpu.png" alt="Logo Kai Corporate University" className="h-[45px] md:h-[60px] rounded-lg p-2" />
          </div>
        </div>
      </div>

      {currentView === 'landing' ? (
        /* ================= LANDING PAGE ================= */
        <div className="w-full max-w-[900px] bg-white p-8 md:p-12 rounded-[35px] shadow-[0_35px_90px_rgba(0,0,0,0.3)] relative overflow-hidden animate-[fadeIn_0.4s_ease-out]">
          <div className="absolute -bottom-[80px] -right-[80px] w-[220px] h-[220px] bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-kai-orange to-transparent opacity-10 rounded-full"></div>
          
          <div className="text-center relative z-10 py-10">
            <h2 className="text-2xl font-bold text-kai-blue mb-4">Pengajuan Izin Peserta Diklat</h2>
            <p className="text-gray-600 mb-10 max-w-lg mx-auto">
              Silakan isi formulir pengajuan dengan data yang valid. Dokumen surat izin akan digenerate secara otomatis sesuai dengan format resmi kampus.
            </p>
            <button 
              onClick={() => setCurrentView('form')}
              className="bg-gradient-to-r from-kai-orange to-[#ff9b5a] text-white w-full md:w-auto px-12 py-4 rounded-[22px] text-[15px] font-bold hover:-translate-y-1 hover:opacity-90 transition-all duration-250 shadow-lg"
            >
              Mulai Pengajuan
            </button>
          </div>
        </div>

      ) : (

        /* ================= FORM PAGE ================= */
        <div className="w-full max-w-[900px] bg-white p-8 md:p-12 rounded-[35px] shadow-[0_35px_90px_rgba(0,0,0,0.3)] relative overflow-hidden animate-[fadeIn_0.4s_ease-out]">
          <h2 className="text-[20px] font-bold text-kai-blue mb-4 pb-2 border-b-[3px] border-kai-orange inline-block">
            Formulir Pengajuan Izin
          </h2>

          {/* Form dipanggil ke handleSubmit */}
          <form onSubmit={handleSubmit} className="mt-4 relative">
            
            <div className="bg-kai-light p-6 md:p-8 rounded-[28px] mt-4 border-l-[6px] border-kai-blue shadow-sm">
              <h3 className="font-bold text-[16px] text-kai-blue mb-4">A. Data Peserta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[14px] mb-2">Nama Lengkap</label>
                  <input type="text" name="nama" value={formData.nama} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-kai-blue focus:ring-2 focus:ring-kai-blue/20 disabled:bg-gray-100 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block font-semibold text-[14px] mb-2">NIPP Peserta Diklat</label>
                  <input type="text" name="nipp" value={formData.nipp} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-kai-blue focus:ring-2 focus:ring-kai-blue/20 disabled:bg-gray-100 disabled:text-gray-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold text-[14px] mb-2">No. Telepon / WA Aktif</label>
                  <input type="tel" name="telp" value={formData.telp} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-kai-blue focus:ring-2 focus:ring-kai-blue/20 disabled:bg-gray-100 disabled:text-gray-500" />
                </div>
              </div>
            </div>

            <div className="bg-kai-light p-6 md:p-8 rounded-[28px] mt-6 border-l-[6px] border-kai-orange shadow-sm">
              <h3 className="font-bold text-[16px] text-kai-blue mb-4">B. Detail Pendidikan & Kamar</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[14px] mb-2">Diklat</label>
                  <select name="diklat" value={formData.diklat} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-kai-orange focus:ring-2 focus:ring-kai-orange/20 cursor-pointer disabled:bg-gray-100 disabled:text-gray-500">
                    <option value="">{isLoadingOptions ? 'Memuat data...' : 'Pilih Diklat...'}</option>
                    {masterOptions.diklat.map((item, index) => (
                      <option key={index} value={item as string}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[14px] mb-2">Angkatan (Akt)</label>
                  <select name="angkatan" value={formData.angkatan} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-kai-orange focus:ring-2 focus:ring-kai-orange/20 cursor-pointer disabled:bg-gray-100 disabled:text-gray-500">
                    <option value="">{isLoadingOptions ? 'Memuat data...' : 'Pilih Angkatan...'}</option>
                    {masterOptions.angkatan.map((item, index) => (
                      <option key={index} value={item as string}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[14px] mb-2">No. Kamar Asrama</label>
                  <input type="text" name="noKamar" value={formData.noKamar} onChange={handleChange} required disabled={isSubmitting} placeholder="" className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-kai-orange focus:ring-2 focus:ring-kai-orange/20 disabled:bg-gray-100 disabled:text-gray-500" />
                </div>
              </div>
            </div>

            <div className="bg-kai-light p-6 md:p-8 rounded-[28px] mt-6 border-l-[6px] border-kai-blue shadow-sm">
              <h3 className="font-bold text-[16px] text-kai-blue mb-4">C. Detail Keperluan Izin</h3>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="jenisPengajuan" value="keluar_kampus" checked={formData.jenisPengajuan === 'keluar_kampus'} onChange={handleChange} disabled={isSubmitting} className="w-5 h-5 accent-kai-blue" />
                  <span className="font-semibold text-[14px]">Izin Keluar Kampus</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="jenisPengajuan" value="keluar_asrama" checked={formData.jenisPengajuan === 'keluar_asrama'} onChange={handleChange} disabled={isSubmitting} className="w-5 h-5 accent-kai-blue" />
                  <span className="font-semibold text-[14px]">Izin Keluar Asrama</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="jenisPengajuan" value="berlibur" checked={formData.jenisPengajuan === 'berlibur'} onChange={handleChange} disabled={isSubmitting} className="w-5 h-5 accent-kai-orange" />
                  <span className="font-semibold text-[14px]">Izin Berlibur (Bermalam)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[13px] text-gray-500 mb-3 uppercase tracking-wider">Waktu Meninggalkan</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[13px] mb-1">Tanggal Keluar</label>
                      <input type="date" name="tanggalKeluar" value={formData.tanggalKeluar} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[12px] px-3 py-2 text-[14px] focus:outline-none focus:border-kai-blue disabled:bg-gray-100 disabled:text-gray-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1">Pukul Berangkat</label>
                      <input type="time" name="jamKeluar" value={formData.jamKeluar} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[12px] px-3 py-2 text-[14px] focus:outline-none focus:border-kai-blue disabled:bg-gray-100 disabled:text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-[13px] text-gray-500 mb-3 uppercase tracking-wider">Waktu Kembali</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[13px] mb-1">Tanggal Kembali</label>
                      <input 
                        type="date" 
                        name="tanggalKembali" 
                        value={formData.tanggalKembali} 
                        onChange={handleChange} 
                        required 
                        disabled={isSubmitting} 
                        min={formData.tanggalKeluar}
                        className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[12px] px-3 py-2 text-[14px] focus:outline-none focus:border-kai-blue disabled:bg-gray-100 disabled:text-gray-500"/>
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1">Pukul Kembali</label>
                      <input 
                        type="time" 
                        name="jamKembali" 
                        value={formData.jamKembali} 
                        onChange={handleChange} 
                        required 
                        disabled={isSubmitting || formData.jenisPengajuan === 'berlibur'}
                        className={`w-full border rounded-[12px] px-3 py-2 text-[14px] focus:outline-none focus:border-kai-blue ${(isSubmitting || formData.jenisPengajuan === 'berlibur') ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#fafbff] border-[#e0e0e0]'}`} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-[14px] mb-2">Keperluan Secara Detail</label>
                  <textarea name="keperluan" value={formData.keperluan} onChange={handleChange} required disabled={isSubmitting} rows={2} placeholder="Jelaskan keperluan Anda secara spesifik..." className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-kai-blue focus:ring-2 focus:ring-kai-blue/20 resize-none disabled:bg-gray-100 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block font-semibold text-[14px] mb-2">Alamat Tujuan Secara Lengkap</label>
                  <textarea name="alamatTujuan" value={formData.alamatTujuan} onChange={handleChange} required disabled={isSubmitting} rows={2} placeholder="Sebutkan alamat lengkap tempat tujuan..." className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-kai-blue focus:ring-2 focus:ring-kai-blue/20 resize-none disabled:bg-gray-100 disabled:text-gray-500" />
                </div>
              </div>
            </div>

            {/* Tombol Action */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <button 
                type="button" 
                onClick={() => setCurrentView('landing')} 
                disabled={isSubmitting}
                className="bg-[#1e1e1e] text-white w-full md:w-1/3 py-[16px] rounded-[22px] text-[15px] font-bold hover:-translate-y-1 transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Kembali
              </button>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full md:w-2/3 py-[16px] rounded-[22px] text-[15px] font-bold transition-all duration-250 shadow-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed text-gray-200 transform-none shadow-none' : 'bg-gradient-to-r from-kai-blue to-[#4238a6] text-white hover:-translate-y-1'}`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Proses Dokumen'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL SUCCESS (GAYA BIMSUH) ================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease]">
          <div className="bg-white p-10 md:p-14 rounded-[35px] text-center shadow-[0_40px_100px_rgba(0,0,0,0.35)] max-w-[420px] w-full relative">
            
            {/* Lingkaran Checkmark Orange */}
            <div className="w-[100px] h-[100px] rounded-full bg-kai-orange flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-[24px] font-bold text-kai-blue mb-4">Pengajuan Berhasil!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Data perizinan Anda telah tercatat ke dalam sistem. Dokumen surat izin akan segera diproses.
            </p>
            
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="bg-kai-blue text-white w-full py-[14px] rounded-[22px] font-bold text-[15px] hover:opacity-90 hover:-translate-y-1 transition-all duration-250"
            >
              Tutup & Isi Form Lagi
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}