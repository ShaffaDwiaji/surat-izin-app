'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Memanggil API logout untuk menghancurkan cookie
      await fetch('/api/logout', { method: 'POST' });
      // Setelah berhasil, arahkan kembali ke halaman utama publik
      router.push('/');
    } catch (error) {
      alert('Terjadi kesalahan saat logout.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-10 font-sans text-slate-800">
      
      {/* HEADER ADMIN */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-sm overflow-hidden mb-8 relative border border-slate-200 animate-[fadeIn_0.3s_ease-out]">
        <div className="h-2 w-full bg-slate-800"></div>
        <div className="flex flex-col md:flex-row items-center justify-between p-6 md:px-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Ruang Kerja Petugas</h1>
              <p className="text-sm text-slate-500 font-medium">Sistem Manajemen Terpadu Kampus</p>
            </div>
          </div>
          
          {/* GRUP TOMBOL KANAN ATAS */}
          <div className="flex gap-3">
            <Link href="/" className="px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-xl text-sm font-bold transition-colors">
              Portal Publik
            </Link>
            <button onClick={handleLogout} className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* MENU ADMIN */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-[fadeIn_0.5s_ease-out]">
        
        {/* MODUL 1: MONITORING */}
        <Link href="/admin/monitoring" className="group flex flex-col bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 border-l-[6px] border-l-emerald-500 relative overflow-hidden">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Manajemen Fasilitas</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">Kelola reservasi ruangan dan monitoring penggunaan fasilitas area kampus.</p>
          <div className="text-emerald-600 font-bold text-sm flex items-center">
            Buka Modul 
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </div>
        </Link>

        {/* MODUL 2: KELUHAN ADMIN */}
        <Link href="/admin/keluhan" className="group flex flex-col bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 border-l-[6px] border-l-red-500 relative overflow-hidden">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-600 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Tindak Lanjut Keluhan</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">Pantau laporan keluhan siswa dan perbarui status penanganannya.</p>
          <div className="text-red-600 font-bold text-sm flex items-center">
            Buka Modul
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </div>
        </Link>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}