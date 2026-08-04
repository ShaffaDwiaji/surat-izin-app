'use client';

import { useState} from 'react';
import Link from 'next/link';

export default function KeluhanPage() {
  const [formData, setFormData] = useState({
    namaPelapor: '',
    kategori: '',
    lokasi: '',
    deskripsi: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ idKeluhan: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/submit-keluhan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccessData({ idKeluhan: data.idKeluhan });
        setFormData({ namaPelapor: '', kategori: '', lokasi: '', deskripsi: '' });
      } else {
        alert('Gagal: ' + data.error);
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a237e] to-[#0a0f3d] flex flex-col items-center py-12 px-4 font-sans text-slate-800">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl py-8 px-6 md:px-10 w-full max-w-3xl shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-red-400 to-red-600"></div>
        <div className="flex items-center justify-between">
          <Link href="/" className="text-slate-400 hover:text-red-500 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-[#1a237e] mb-1">Lapor Keluhan (Kritik & Saran)</h1>
            <p className="text-sm text-gray-500">Pusat bantuan fasilitas & pelayanan kampus</p>
          </div>
          <div className="w-8"></div> {/* Spacer untuk keseimbangan */}
        </div>
      </div>

      {/* FORM KELUHAN */}
      <div className="w-full max-w-3xl bg-white p-8 md:p-10 rounded-3xl shadow-2xl relative animate-[fadeIn_0.4s_ease-out]">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-sm text-[#1a237e] mb-2">Nama Pelapor</label>
              <input type="text" name="namaPelapor" value={formData.namaPelapor} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:bg-slate-100" placeholder="Contoh: Budi Santoso" />
            </div>
            <div>
              <label className="block font-bold text-sm text-[#1a237e] mb-2">Kategori Keluhan</label>
              <select name="kategori" value={formData.kategori} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:bg-slate-100">
                <option value="" disabled>-- Pilih Kategori --</option>
                <option value="Fasilitas Kamar">Fasilitas Kamar Asrama</option>
                <option value="Fasilitas Kelas">Fasilitas Kelas / Ruang Belajar</option>
                <option value="Kebersihan">Kebersihan Area</option>
                <option value="Makanan dan Minuman">Menu Makanan dan Minuman</option>
                <option value="Fasilitas Umum">Fasilitas Umum (Kamar Mandi, dll)</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-sm text-[#1a237e] mb-2">Lokasi / Ruangan Secara Spesifik</label>
            <input type="text" name="lokasi" value={formData.lokasi} onChange={handleChange} required disabled={isSubmitting} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:bg-slate-100" placeholder="Contoh: Kamar Asrama 204 / Toilet Lantai 1" />
          </div>

          <div>
            <label className="block font-bold text-sm text-[#1a237e] mb-2">Deskripsi Keluhan</label>
            <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} required disabled={isSubmitting} rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-none disabled:bg-slate-100" placeholder="Jelaskan secara detail kerusakan atau keluhan yang dialami..." />
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl text-[15px] font-bold transition-all shadow-lg ${isSubmitting ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:-translate-y-1 hover:shadow-xl'}`}>
              {isSubmitting ? 'Mengirim Laporan...' : 'Kirim Laporan Keluhan'}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL SUKSES */}
      {successData && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease]">
          <div className="bg-white p-10 rounded-3xl text-center shadow-2xl max-w-sm w-full relative">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1a237e] mb-2">Laporan Diterima!</h2>
            <p className="text-sm text-slate-500 mb-2">Tim kami akan segera menindaklanjuti keluhan Anda.</p>
            <div className="bg-slate-50 rounded-lg p-3 mb-8 border border-slate-200">
              <p className="text-xs text-slate-400 mb-1">ID Tiket Keluhan:</p>
              <p className="text-lg font-mono font-bold text-slate-700 tracking-widest">{successData.idKeluhan}</p>
            </div>
            <button onClick={() => setSuccessData(null)} className="bg-[#1a237e] text-white w-full py-3 rounded-xl font-bold text-sm hover:-translate-y-1 transition-transform">
              Selesai
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