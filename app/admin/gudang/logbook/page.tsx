'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Log = { idTransaksi: string; tanggal: string; jam: string; kodeBarang: string; namaBarang: string; aktivitas: string; jumlah: string; petugas: string; keterangan: string; };

export default function LogbookGudangPage() {
  const [dataLog, setDataLog] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(50); // Default memuat 50 data terakhir

  const fetchLog = async (currentLimit: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/get-log-gudang?limit=${currentLimit}`);
      const json = await res.json();
      if (res.ok) setDataLog(json.data);
    } catch (error) {
      console.error('Gagal mengambil data log');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLog(limit);
  }, [limit]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-10 font-sans text-slate-800">
      
      {/* HEADER LOGBOOK */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-[fadeIn_0.3s_ease-out]">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Buku Riwayat Arus (Logbook)</h1>
          <p className="text-slate-500 text-sm">Catatan seluruh transaksi keluar/masuk barang gudang</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/gudang" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-bold shadow-sm transition-colors">
            &larr; Kembali ke Dashboard Gudang
          </Link>
        </div>
      </div>

      {/* TABEL LOGBOOK */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-bold text-slate-700">Tabel Transaksi Terkini</h2>
          
          <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
            Tampilkan: 
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value={20}>20 Terakhir</option>
              <option value={50}>50 Terakhir</option>
              <option value={100}>100 Terakhir</option>
              <option value={500}>500 Terakhir (Berat)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Waktu & ID</th>
                <th className="p-4 font-semibold">Aktivitas</th>
                <th className="p-4 font-semibold">Barang</th>
                <th className="p-4 font-semibold">Jumlah</th>
                <th className="p-4 font-semibold">Petugas & Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400">Memuat Buku Log...</td></tr>
              ) : dataLog.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400">Belum ada transaksi sama sekali.</td></tr>
              ) : (
                dataLog.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-700">{log.tanggal} <span className="text-slate-400 font-normal">{log.jam}</span></p>
                      <p className="font-mono text-xs text-slate-400 mt-1">{log.idTransaksi}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${log.aktivitas === 'Terima' ? 'bg-emerald-100 text-emerald-700' : log.aktivitas === 'Muat' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {log.aktivitas}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{log.namaBarang}</p>
                      <p className="text-xs text-slate-500">[{log.kodeBarang}]</p>
                    </td>
                    <td className="p-4 font-black text-slate-700 text-base">{log.jumlah}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-700">{log.petugas}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 max-w-xs">{log.keterangan}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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