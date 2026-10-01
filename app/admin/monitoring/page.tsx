'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

const initialFormData = {
  unitPemohon: '',
  namaKegiatan: '',
  tanggalMulai: '',
  tanggalSelesai: '',
  kebutuhanRuangan: [] as string[],
  jumlahPeserta: '',
  jumlahHari: '',
  keterangan: ''
};

export default function MonitoringPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [masterData, setMasterData] = useState({ kedudukan: [], ruangan: [] });
  const [isLoadingMaster, setIsLoadingMaster] = useState(true);

  useEffect(() => {
    async function fetchMasterData() {
      try {
        const res = await fetch('/api/get-master-fasilitas');
        if (res.ok) {
          const data = await res.json();
          setMasterData(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data master:", error);
      } finally {
        setIsLoadingMaster(false);
      }
    }
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (formData.tanggalMulai && formData.tanggalSelesai) {
      const start = new Date(formData.tanggalMulai);
      const end = new Date(formData.tanggalSelesai);

      // Pastikan tanggal selesai tidak lebih kecil dari tanggal mulai
      if (end >= start) {
        // Hitung selisih waktu dalam milidetik
        const diffTime = end.getTime() - start.getTime();
        // Konversi ke hari 
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        setFormData(prev => ({ ...prev, jumlahHari: diffDays.toString() }));
      } else {
        // Kosongkan jika tanggal tidak valid
        setFormData(prev => ({ ...prev, jumlahHari: '' }));
      }
    }
  }, [formData.tanggalMulai, formData.tanggalSelesai]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };

      if (name === 'tanggalMulai') {
        if (updatedData.tanggalSelesai && value > updatedData.tanggalSelesai) {
          updatedData.tanggalSelesai = value;
        }
      }

      return updatedData;
    });
  };

  const handleCheckboxChange = (ruang: string) => {
    setFormData(prev => {
      const isSelected = prev.kebutuhanRuangan.includes(ruang);
      if (isSelected) {
        return { ...prev, kebutuhanRuangan: prev.kebutuhanRuangan.filter(r => r !== ruang) };
      } else {
        return { ...prev, kebutuhanRuangan: [...prev.kebutuhanRuangan, ruang] };
      }
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.kebutuhanRuangan.length === 0) {
      alert("Pilih setidaknya satu kebutuhan ruangan.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/submit-monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Gagal menyimpan data ke database.');
      }

      setShowSuccessModal(true);
      setFormData(initialFormData);
    } catch (error: any) {
      alert('Terjadi kesalahan: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 font-sans text-slate-800">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl py-8 px-6 md:px-10 w-full max-w-[900px] shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-slate-400 hover:text-emerald-500 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Manajemen Fasilitas</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium">Sistem reservasi dan pemantauan penggunaan ruangan kampus</p>
          </div>
          <div className="w-8"></div>
        </div>
      </div>

      {/* FORM PAGE */}
      <div className="w-full max-w-[900px] bg-white p-8 md:p-12 rounded-[35px] shadow-sm border border-slate-200 relative overflow-hidden animate-[fadeIn_0.4s_ease-out]">
        <h2 className="text-[20px] font-bold text-slate-800 mb-4 pb-2 border-b-[3px] border-emerald-500 inline-block">
          Formulir Reservasi Ruangan
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 relative space-y-6">
          
          <div className="bg-slate-50 p-6 md:p-8 rounded-[28px] border-l-[6px] border-emerald-500 shadow-sm border border-slate-100">
            <h3 className="font-bold text-[16px] text-slate-800 mb-4">A. Detail Pemohon & Kegiatan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[14px] text-slate-700 mb-2">Unit Pemohon</label>
                <select name="unitPemohon" value={formData.unitPemohon} onChange={handleChange} required disabled={isSubmitting || isLoadingMaster} className="w-full bg-white border border-slate-300 rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100 cursor-pointer">
                  <option value="" disabled>{isLoadingMaster ? 'Memuat...' : '-- Pilih Unit --'}</option>
                  {masterData.kedudukan.map((item, idx) => (
                    <option key={idx} value={item as string}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[14px] text-slate-700 mb-2">Nama Kegiatan</label>
                <input type="text" name="namaKegiatan" value={formData.namaKegiatan} onChange={handleChange} required disabled={isSubmitting} placeholder="Diklat Dasar Perawatan Sarana Perkeretaapian" className="w-full bg-white border border-slate-300 rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 md:p-8 rounded-[28px] border-l-[6px] border-emerald-600 shadow-sm border border-slate-100">
            <h3 className="font-bold text-[16px] text-slate-800 mb-4">B. Waktu Pelaksanaan & Peserta</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block font-semibold text-[14px] text-slate-700 mb-2">Tanggal Mulai</label>
                <input type="date" name="tanggalMulai" value={formData.tanggalMulai} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-white border border-slate-300 rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100" />
              </div>
              <div>
                <label className="block font-semibold text-[14px] text-slate-700 mb-2">Tanggal Selesai</label>
                <input type="date" name="tanggalSelesai" value={formData.tanggalSelesai} onChange={handleChange} required disabled={isSubmitting} min={formData.tanggalMulai} className="w-full bg-white border border-slate-300 rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100" />
              </div>
              <div>
                <label className="block font-semibold text-[14px] text-slate-700 mb-2">Jumlah Hari</label>
                <input type="text" name="jumlahHari" value={formData.jumlahHari} readOnly placeholder="0" className="w-full bg-slate-200 border border-slate-300 rounded-[18px] px-4 py-3 text-[14px] text-slate-600 font-bold focus:outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block font-semibold text-[14px] text-slate-700 mb-2">Jumlah Peserta</label>
                <input type="number" min="1" name="jumlahPeserta" value={formData.jumlahPeserta} onChange={handleChange} required disabled={isSubmitting} placeholder="0" className="w-full bg-white border border-slate-300 rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 md:p-8 rounded-[28px] border-l-[6px] border-emerald-700 shadow-sm border border-slate-100">
            <h3 className="font-bold text-[16px] text-slate-800 mb-4">C. Kebutuhan Ruangan & Keterangan</h3>
            
            <div className="mb-6">
              <label className="block font-semibold text-[14px] text-slate-700 mb-3">Pilih Kebutuhan Ruangan (Bisa lebih dari satu)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-[18px] border border-slate-200">
                {isLoadingMaster ? (
                  <p className="text-sm text-slate-500">Memuat ruangan...</p>
                ) : (
                  masterData.ruangan.map((ruang, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.kebutuhanRuangan.includes(ruang as string)}
                        onChange={() => handleCheckboxChange(ruang as string)}
                        disabled={isSubmitting}
                        className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                      />
                      {ruang as string}
                    </label>
                  ))
                )}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[14px] text-slate-700 mb-2">Keterangan Tambahan</label>
              <textarea name="keterangan" value={formData.keterangan} onChange={handleChange} disabled={isSubmitting} rows={2} placeholder="Isi '-' jika tidak ada keterangan tambahan..." className="w-full bg-white border border-slate-300 rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none disabled:bg-slate-100" />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-[16px] rounded-[22px] text-[15px] font-bold transition-all duration-250 shadow-md ${isSubmitting ? 'bg-slate-300 cursor-not-allowed text-slate-500 transform-none shadow-none' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-1 hover:shadow-lg'}`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data Reservasi'}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL SUCCESS */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease]">
          <div className="bg-white p-10 md:p-14 rounded-[35px] text-center shadow-2xl max-w-[420px] w-full relative">
            <div className="w-[100px] h-[100px] rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-[24px] font-bold text-slate-800 mb-4">Reservasi Berhasil!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Jadwal penggunaan fasilitas telah berhasil dicatat ke dalam database sistem.
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="bg-emerald-600 text-white w-full py-[14px] rounded-[22px] font-bold text-[15px] hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-250"
            >
              Selesai & Tutup
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