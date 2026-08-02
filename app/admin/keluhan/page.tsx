'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Definisi Tipe Data Keluhan
type Keluhan = {
  idKeluhan: string; waktuPelaporan: string; namaPelapor: string; 
  kategori: string; lokasi: string; deskripsi: string; 
  status: string; tindakLanjut: string; waktuPenanganan: string; keterangan: string;
};

export default function AdminKeluhanPage() {
  const [dataKeluhan, setDataKeluhan] = useState<Keluhan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // State untuk Modal Update
  const [selectedKeluhan, setSelectedKeluhan] = useState<Keluhan | null>(null);
  const [updateForm, setUpdateForm] = useState({ status: '', tindakLanjut: '', keterangan: '' });

  const fetchKeluhan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/get-keluhan');
      const json = await res.json();
      if (res.ok) setDataKeluhan(json.data);
    } catch (error) {
      console.error('Gagal mengambil data keluhan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeluhan();
  }, []);

  const openUpdateModal = (keluhan: Keluhan) => {
    setSelectedKeluhan(keluhan);
    setUpdateForm({
      status: keluhan.status === 'Menunggu' ? 'Diproses' : keluhan.status,
      tindakLanjut: keluhan.tindakLanjut || '',
      keterangan: keluhan.keterangan || ''
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKeluhan) return;
    setIsUpdating(true);

    try {
      const res = await fetch('/api/update-keluhan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idKeluhan: selectedKeluhan.idKeluhan, ...updateForm })
      });
      if (res.ok) {
        setSelectedKeluhan(null);
        fetchKeluhan(); // Refresh tabel setelah berhasil
      } else {
        alert('Gagal memperbarui data.');
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-10 font-sans text-slate-800">
      
      {/* HEADER */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-[fadeIn_0.3s_ease-out]">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tindak Lanjut Keluhan</h1>
          <p className="text-slate-500 text-sm">Manajemen pelaporan fasilitas & layanan kampus</p>
        </div>
        <Link href="/admin" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-bold shadow-sm transition-colors">
          &larr; Kembali ke Dashboard
        </Link>
      </div>

      {/* TABEL DATA */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 md:p-5 font-semibold">Tiket</th>
                <th className="p-4 md:p-5 font-semibold">Pelapor & Waktu</th>
                <th className="p-4 md:p-5 font-semibold">Lokasi & Kategori</th>
                <th className="p-4 md:p-5 font-semibold">Status</th>
                <th className="p-4 md:p-5 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400">Memuat data keluhan dari server...</td></tr>
              ) : dataKeluhan.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400">Belum ada data keluhan yang masuk.</td></tr>
              ) : (
                dataKeluhan.map((k) => (
                  <tr key={k.idKeluhan} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 md:p-5">
                      <span className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{k.idKeluhan}</span>
                    </td>
                    <td className="p-4 md:p-5">
                      <p className="font-bold text-slate-800 text-sm mb-0.5">{k.namaPelapor}</p>
                      <p className="text-xs text-slate-500">{k.waktuPelaporan}</p>
                    </td>
                    <td className="p-4 md:p-5">
                      <p className="font-semibold text-slate-700 text-sm mb-0.5">{k.lokasi}</p>
                      <p className="text-xs text-slate-500">{k.kategori}</p>
                    </td>
                    <td className="p-4 md:p-5">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        k.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                        k.status === 'Diproses' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {k.status}
                      </span>
                    </td>
                    <td className="p-4 md:p-5 text-center">
                      <button onClick={() => openUpdateModal(k)} className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors shadow-sm">
                        Tindak Lanjut
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL UPDATE */}
      {selectedKeluhan && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-lg w-full relative">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Tindak Lanjut Laporan</h2>
            
            {/* Rangkuman Laporan */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-sm text-slate-600">
              <p><strong>Lokasi:</strong> {selectedKeluhan.lokasi}</p>
              <p><strong>Keluhan:</strong> {selectedKeluhan.deskripsi}</p>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-sm text-slate-700 mb-2">Update Status</label>
                <select value={updateForm.status} onChange={e => setUpdateForm({...updateForm, status: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
                  <option value="Menunggu">Menunggu</option>
                  <option value="Diproses">Sedang Diproses</option>
                  <option value="Selesai">Telah Selesai</option>
                </select>
              </div>
              
              <div>
                <label className="block font-bold text-sm text-slate-700 mb-2">Tindakan yang Dilakukan</label>
                <textarea value={updateForm.tindakLanjut} onChange={e => setUpdateForm({...updateForm, tindakLanjut: e.target.value})} required rows={2} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none" placeholder="Contoh: Mengganti keran air yang bocor..." />
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 mb-2">Keterangan / Hasil (Opsional)</label>
                <textarea value={updateForm.keterangan} onChange={e => setUpdateForm({...updateForm, keterangan: e.target.value})} rows={2} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none" placeholder="Catatan tambahan untuk pelapor atau arsip..." />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setSelectedKeluhan(null)} disabled={isUpdating} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isUpdating} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                  {isUpdating ? 'Menyimpan...' : 'Simpan Update'}
                </button>
              </div>
            </form>
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