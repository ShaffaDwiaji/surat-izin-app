'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

const initialFormData = {
  namaPemohon: '',
  ruangan: '',
  tanggal: '',
  waktuMulai: '',
  waktuSelesai: '',
  keperluan: ''
};

export default function MonitoringPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Sesuaikan dengan endpoint API monitoring-mu
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
      
      {/* HEADER (Disamakan dengan Keluhan & Izin, tapi aksen Emerald/Admin) */}
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
          <div className="w-8"></div> {/* Spacer untuk keseimbangan */}
        </div>
      </div>

      {/* FORM PAGE */}
      <div className="w-full max-w-[900px] bg-white p-8 md:p-12 rounded-[35px] shadow-sm border border-slate-200 relative overflow-hidden animate-[fadeIn_0.4s_ease-out]">
        <h2 className="text-[20px] font-bold text-slate-800 mb-4 pb-2 border-b-[3px] border-emerald-500 inline-block">
          Formulir Reservasi Ruangan
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 relative">
          
          <div className="bg-slate-50 p-6 md:p-8 rounded-[28px] mt-4 border-l-[6px] border-emerald-500 shadow-sm border border-slate-100">
            <h3 className="font-bold text-[16px] text-slate-800 mb-4">A. Data Peminjam</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[14px] text-slate-700 mb-2">Nama Penanggung Jawab</label>
                <input type="text" name="namaPemohon" value={formData.namaPemohon} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-white border border-slate-300 rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100" />
              </div>
              <div>
                <label className="block font-semibold text-[14px] text-slate-700 mb-2">Ruangan yang Dipinjam</label>
                <select name="ruangan" value={formData.ruangan} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-white border border-slate-300 rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100 cursor-pointer">
                  <option value="" disabled>-- Pilih Ruangan --</option>
                  <option value="Kelas A">Ruang Kelas A</option>
                  <option value="Kelas B">Ruang Kelas B</option>
                  <option value="Aula Utama">Aula Utama</option>
                  <option value="Lab Komputer">Laboratorium Komputer</option>
                  <option value="Ruang Rapat">Ruang Rapat VIP</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 md:p-8 rounded-[28px] mt-6 border-l-[6px] border-emerald-600 shadow-sm border border-slate-100">
            <h3 className="font-bold text-[16px] text-slate-800 mb-4">B. Waktu & Keperluan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block font-semibold text-[14px] text-slate-700 mb-2">Tanggal Penggunaan</label>
                <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-white border border-slate-300 rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100" />
              </div>
              <div>
                <label className="block font-semibold text-[14px] text-slate-700 mb-2">Waktu Mulai</label>
                <input type="time" name="waktuMulai" value={formData.waktuMulai} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-white border border-slate-300 rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100" />
              </div>
              <div>
                <label className="block font-semibold text-[14px] text-slate-700 mb-2">Waktu Selesai</label>
                <input type="time" name="waktuSelesai" value={formData.waktuSelesai} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-white border border-slate-300 rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[14px] text-slate-700 mb-2">Keperluan Secara Detail</label>
              <textarea name="keperluan" value={formData.keperluan} onChange={handleChange} required disabled={isSubmitting} rows={3} placeholder="Jelaskan untuk kegiatan apa ruangan ini digunakan..." className="w-full bg-white border border-slate-300 rounded-[18px] px-4 py-3 text-[14px] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none disabled:bg-slate-100" />
            </div>
          </div>

          {/* Tombol Action (Penuh) */}
          <div className="pt-8">
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
              <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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