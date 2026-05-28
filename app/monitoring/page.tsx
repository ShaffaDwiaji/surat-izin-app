'use client';

import { useState, useEffect, FormEvent } from 'react';

const initialForm = {
  unitPemohon: '',
  namaKegiatan: '',
  tanggalMulai: '',
  tanggalSelesai: '',
  kebutuhanKelas: [] as string[],
  jumlahPeserta: '',
  jumlahHari: 0,
  keterangan: ''
};

export default function MonitoringPage() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // State baru untuk menampung ruangan dari Google Sheets
  const [daftarRuangan, setDaftarRuangan] = useState<string[]>([]);
  const [isLoadingRuangan, setIsLoadingRuangan] = useState(true);

  // Fetch Data Master (Ruangan) saat web pertama kali dibuka
  useEffect(() => {
    async function fetchMasterData() {
      try {
        const res = await fetch('/api/get-master-data');
        const data = await res.json();
        if (res.ok && data.ruangan) {
          setDaftarRuangan(data.ruangan);
        }
      } catch (error) {
        console.error('Gagal memuat daftar ruangan', error);
      } finally {
        setIsLoadingRuangan(false);
      }
    }
    fetchMasterData();
  }, []);

  // Efek untuk menghitung otomatis Jumlah Hari
  useEffect(() => {
    if (formData.tanggalMulai && formData.tanggalSelesai) {
      const start = new Date(formData.tanggalMulai);
      const end = new Date(formData.tanggalSelesai);
      
      if (end < start) {
        setFormData(prev => ({ ...prev, tanggalSelesai: prev.tanggalMulai, jumlahHari: 1 }));
        return;
      }

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
      
      setFormData(prev => ({ ...prev, jumlahHari: diffDays }));
    }
  }, [formData.tanggalMulai, formData.tanggalSelesai]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (ruangan: string) => {
    setFormData(prev => {
      const isSelected = prev.kebutuhanKelas.includes(ruangan);
      if (isSelected) {
        return { ...prev, kebutuhanKelas: prev.kebutuhanKelas.filter(r => r !== ruangan) };
      } else {
        return { ...prev, kebutuhanKelas: [...prev.kebutuhanKelas, ruangan] };
      }
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.kebutuhanKelas.length === 0) {
      alert("Harap pilih minimal satu ruangan/kelas!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submit-monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setShowSuccessModal(true);
        setFormData(initialForm);
      } else {
        const errorData = await res.json();
        alert('Gagal: ' + errorData.error);
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan.');
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
            <h1 className="text-[22px] md:text-[28px] font-bold text-kai-blue mb-2">Monitoring Fasilitas</h1>
            <p className="text-[13px] md:text-[14px] text-gray-500 leading-relaxed">
              Sistem Reservasi & Penggunaan Ruang Darman Prasetyo Campus
            </p>
          </div>
          <div className="order-2 md:order-3">
            <img src="/kaicorpu.png" alt="Logo Kai Corporate University" className="h-[45px] md:h-[60px] rounded-lg p-2" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-[900px] bg-white p-8 md:p-12 rounded-[35px] shadow-[0_35px_90px_rgba(0,0,0,0.3)] relative overflow-hidden animate-[fadeIn_0.4s_ease-out]">
        <h2 className="text-[20px] font-bold text-kai-blue mb-4 pb-2 border-b-[3px] border-kai-orange inline-block">
          Formulir Reservasi
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 relative text-[#1e1e1e]">
          
          {/* Bagian A */}
          <div className="bg-kai-light p-6 md:p-8 rounded-[28px] mt-4 border-l-[6px] border-kai-blue shadow-sm">
            <h3 className="font-bold text-[16px] text-kai-blue mb-4">A. Detail Kegiatan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[14px] mb-2">Unit Pemohon</label>
                <input type="text" name="unitPemohon" value={formData.unitPemohon} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-kai-blue focus:ring-2 focus:ring-kai-blue/20 disabled:bg-gray-100 disabled:text-gray-500" placeholder="Contoh: BEM / Eksternal" />
              </div>
              <div>
                <label className="block font-semibold text-[14px] mb-2">Nama Kegiatan</label>
                <input type="text" name="namaKegiatan" value={formData.namaKegiatan} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-kai-blue focus:ring-2 focus:ring-kai-blue/20 disabled:bg-gray-100 disabled:text-gray-500" placeholder="Contoh: Rapat Koordinasi" />
              </div>
            </div>
          </div>

          {/* Bagian B */}
          <div className="bg-kai-light p-6 md:p-8 rounded-[28px] mt-6 border-l-[6px] border-kai-orange shadow-sm">
            <h3 className="font-bold text-[16px] text-kai-blue mb-4">B. Waktu Pelaksanaan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-[14px] mb-2">Tanggal Mulai</label>
                <input type="date" name="tanggalMulai" value={formData.tanggalMulai} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-kai-orange focus:ring-2 focus:ring-kai-orange/20 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>
              <div>
                <label className="block font-semibold text-[14px] mb-2">Tanggal Selesai</label>
                <input type="date" name="tanggalSelesai" value={formData.tanggalSelesai} onChange={handleChange} required disabled={isSubmitting} min={formData.tanggalMulai} className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-kai-orange focus:ring-2 focus:ring-kai-orange/20 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>
              <div>
                <label className="block font-semibold text-[14px] mb-2">Jumlah Hari</label>
                <div className="w-full bg-gray-100 border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] text-gray-500 font-bold text-center cursor-not-allowed">
                  {formData.jumlahHari} Hari
                </div>
              </div>
            </div>
          </div>

          {/* Bagian C */}
          <div className="bg-kai-light p-6 md:p-8 rounded-[28px] mt-6 border-l-[6px] border-kai-blue shadow-sm">
            <h3 className="font-bold text-[16px] text-kai-blue mb-4">C. Kebutuhan Kelas / Ruang</h3>
            <p className="text-[13px] text-gray-500 mb-4">*Bisa memilih lebih dari satu ruangan</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {/* Tampilkan Loading atau Checkbox */}
              {isLoadingRuangan ? (
                <div className="col-span-2 md:col-span-3 text-center py-6 text-gray-500 text-[14px] font-semibold animate-pulse">
                  Menarik data ruangan dari server...
                </div>
              ) : daftarRuangan.length === 0 ? (
                <div className="col-span-2 md:col-span-3 text-center py-6 text-red-500 text-[14px]">
                  Data ruangan kosong. Silakan isi di tab Master.
                </div>
              ) : (
                daftarRuangan.map((ruangan) => (
                  <label 
                    key={ruangan} 
                    className={`flex items-center gap-3 p-4 rounded-[18px] border-2 cursor-pointer transition-all duration-300 ${
                      formData.kebutuhanKelas.includes(ruangan) 
                        ? 'bg-white border-kai-blue shadow-md transform scale-[1.02]' 
                        : 'bg-white border-transparent shadow-sm hover:border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={formData.kebutuhanKelas.includes(ruangan)} 
                      onChange={() => handleCheckboxChange(ruangan)} 
                      disabled={isSubmitting} 
                      className="w-5 h-5 accent-kai-blue rounded-[6px] cursor-pointer outline-none focus:ring-0 border-gray-300" 
                    />
                    <span className={`text-[14px] font-semibold ${
                      formData.kebutuhanKelas.includes(ruangan) ? 'text-kai-blue' : 'text-gray-600'
                    }`}>
                      {ruangan}
                    </span>
                  </label>
                ))
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
              <div>
                <label className="block font-semibold text-[14px] mb-2">Jumlah Peserta</label>
                <input type="number" name="jumlahPeserta" value={formData.jumlahPeserta} onChange={handleChange} required disabled={isSubmitting} min="1" className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-kai-blue focus:ring-2 focus:ring-kai-blue/20 disabled:bg-gray-100 disabled:text-gray-500" placeholder="0" />
              </div>
              <div>
                <label className="block font-semibold text-[14px] mb-2">Keterangan Tambahan (Opsional)</label>
                <textarea name="keterangan" value={formData.keterangan} onChange={handleChange} disabled={isSubmitting} rows={1} className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-kai-blue focus:ring-2 focus:ring-kai-blue/20 resize-none disabled:bg-gray-100 disabled:text-gray-500" placeholder="Catatan tambahan..." />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button 
              type="submit" 
              disabled={isSubmitting || isLoadingRuangan}
              className={`w-full py-[16px] rounded-[22px] text-[15px] font-bold transition-all duration-250 shadow-lg ${isSubmitting || isLoadingRuangan ? 'bg-gray-400 cursor-not-allowed text-gray-200 transform-none shadow-none' : 'bg-gradient-to-r from-kai-blue to-[#4238a6] text-white hover:-translate-y-1'}`}
            >
              {isSubmitting ? 'Merekam Data...' : 'Kirim Reservasi Fasilitas'}
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease]">
          <div className="bg-white p-10 md:p-14 rounded-[35px] text-center shadow-[0_40px_100px_rgba(0,0,0,0.35)] max-w-[420px] w-full relative">
            <div className="w-[100px] h-[100px] rounded-full bg-kai-orange flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-[24px] font-bold text-kai-blue mb-4">Reservasi Berhasil!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Data penggunaan fasilitas Anda telah tercatat ke dalam sistem pengurus.
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