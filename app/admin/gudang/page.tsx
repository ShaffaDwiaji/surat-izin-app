'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Barang = { no: string, kodeBarang: string, namaBarang: string, kategori: string, satuan: string, stok: string };
type SortConfig = { key: keyof Barang; direction: 'asc' | 'desc' } | null;

export default function GudangPage() {
  const [dataBarang, setDataBarang] = useState<Barang[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Sorting State
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  // States Modal (Sama seperti sebelumnya)
  const [isModalTransaksiOpen, setIsModalTransaksiOpen] = useState(false);
  const [isSubmittingTransaksi, setIsSubmittingTransaksi] = useState(false);
  const [formTransaksi, setFormTransaksi] = useState({
    barangTerpilih: '', aktivitas: 'Terima', jumlah: '', keterangan: '', petugas: 'Admin Kampus'
  });

  const [isModalMasterOpen, setIsModalMasterOpen] = useState(false);
  const [isSubmittingMaster, setIsSubmittingMaster] = useState(false);
  const [formMaster, setFormMaster] = useState({
    kodeBarang: '', namaBarang: '', kategori: '', satuan: ''
  });

  const fetchBarang = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/get-barang');
      const json = await res.json();
      if (res.ok) setDataBarang(json.data);
    } catch (error) {
      console.error('Gagal mengambil data Master Barang');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  // --- LOGIKA SORTING ---
  const requestSort = (key: keyof Barang) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...dataBarang].sort((a, b) => {
    if (!sortConfig) return 0;
    
    let aValue: any = a[sortConfig.key];
    let bValue: any = b[sortConfig.key];

    // Jika mengurutkan STOK, ubah tipe datanya jadi angka agar 10 lebih besar dari 2
    if (sortConfig.key === 'stok') {
      aValue = parseInt(aValue) || 0;
      bValue = parseInt(bValue) || 0;
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Ikon Panah untuk Header Tabel (Membantu visualisasi Sorting)
  const getSortIcon = (key: keyof Barang) => {
    if (!sortConfig || sortConfig.key !== key) return <span className="opacity-20 ml-1">⇅</span>;
    return sortConfig.direction === 'asc' ? <span className="text-blue-500 ml-1">↑</span> : <span className="text-blue-500 ml-1">↓</span>;
  };
  // -----------------------

  const getPrefixKategori = (kategori: string) => {
    switch (kategori) {
      case 'Alat Tulis': return 'ATK';
      case 'Elektronik': return 'ELK';
      case 'Kebersihan': return 'KBR';
      case 'Fasilitas Asrama': return 'ASR';
      case 'Makanan' : return 'MKN';
      case 'Minuman' : return 'MNM';
      default: return 'UMM';
    }
  };

  const handleKategoriChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKategori = e.target.value;
    const prefix = getPrefixKategori(selectedKategori);
    const barangSejenis = dataBarang.filter(b => b.kodeBarang.startsWith(prefix));
    const nextNumber = barangSejenis.length + 1;
    const generateKode = `${prefix}-${String(nextNumber).padStart(3, '0')}`;
    setFormMaster({ ...formMaster, kategori: selectedKategori, kodeBarang: generateKode });
  };

  const handleSubmitTransaksi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTransaksi(true);
    const [kodeBarang, namaBarang] = formTransaksi.barangTerpilih.split('|');

    try {
      const res = await fetch('/api/submit-transaksi-gudang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kodeBarang, namaBarang, aktivitas: formTransaksi.aktivitas, 
          jumlah: formTransaksi.jumlah, keterangan: formTransaksi.keterangan, petugas: formTransaksi.petugas
        })
      });

      if (res.ok) {
        setIsModalTransaksiOpen(false);
        setFormTransaksi({ ...formTransaksi, barangTerpilih: '', jumlah: '', keterangan: '' });
        fetchBarang();
        setSuccessMessage('Data arus logistik berhasil dicatat ke dalam buku gudang!');
      } else alert('Gagal memproses transaksi.');
    } catch (error) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmittingTransaksi(false);
    }
  };

  const handleSubmitMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingMaster(true);
    try {
      const res = await fetch('/api/add-master-barang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formMaster)
      });

      if (res.ok) {
        setIsModalMasterOpen(false);
        setFormMaster({ kodeBarang: '', namaBarang: '', kategori: '', satuan: '' });
        fetchBarang();
        setSuccessMessage('Barang baru berhasil ditambahkan ke dalam database Master!');
      } else alert('Gagal menambahkan barang.');
    } catch (error) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmittingMaster(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-10 font-sans text-slate-800">
      
      {/* HEADER GUDANG */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-[fadeIn_0.3s_ease-out]">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sistem Gudang (ATPSM)</h1>
          <p className="text-slate-500 text-sm">Dashboard Simpan & Arus Barang Logistik</p>
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <Link href="/admin" className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-bold shadow-sm transition-colors">
            &larr; Dashboard
          </Link>
          
          {/* Buku Log */}
          <Link href="/admin/gudang/logbook" className="px-4 py-2.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Buku Log (Riwayat)
          </Link>

          <button onClick={() => { setIsModalMasterOpen(true); setFormMaster({ kodeBarang: '', namaBarang: '', kategori: '', satuan: '' }); }} className="px-4 py-2.5 bg-slate-800 text-white hover:bg-slate-700 rounded-xl text-sm font-bold shadow-md transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Barang Baru
          </button>
          <button onClick={() => setIsModalTransaksiOpen(true)} className="px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-sm font-bold shadow-md transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Catat Transaksi
          </button>
        </div>
      </div>

      {/* TABEL STOK */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
        <div className="bg-blue-50/50 p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-700">Daftar Stok Tersedia (Buku Simpan)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/50 text-slate-500 text-sm uppercase tracking-wider select-none">
                {/* Header Klikable untuk Sorting */}
                <th className="p-4 md:p-5 font-semibold cursor-pointer hover:bg-slate-200/50 transition-colors" onClick={() => requestSort('kodeBarang')}>
                  Kode {getSortIcon('kodeBarang')}
                </th>
                <th className="p-4 md:p-5 font-semibold cursor-pointer hover:bg-slate-200/50 transition-colors" onClick={() => requestSort('namaBarang')}>
                  Nama Barang {getSortIcon('namaBarang')}
                </th>
                <th className="p-4 md:p-5 font-semibold cursor-pointer hover:bg-slate-200/50 transition-colors" onClick={() => requestSort('kategori')}>
                  Kategori {getSortIcon('kategori')}
                </th>
                <th className="p-4 md:p-5 font-semibold text-right cursor-pointer hover:bg-slate-200/50 transition-colors" onClick={() => requestSort('stok')}>
                  Stok Aktual {getSortIcon('stok')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={4} className="text-center py-10 text-slate-400">Memuat Master Barang...</td></tr>
              ) : sortedData.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-slate-400">Belum ada barang di Master.</td></tr>
              ) : (
                // Menggunakan array sortedData yang sudah diproses sorting
                sortedData.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 md:p-5"><span className="font-mono text-sm font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">{b.kodeBarang}</span></td>
                    <td className="p-4 md:p-5 font-bold text-slate-800 text-sm">{b.namaBarang}</td>
                    <td className="p-4 md:p-5 text-sm text-slate-600">{b.kategori}</td>
                    <td className="p-4 md:p-5 text-right">
                      <span className={`text-lg font-black mr-1 ${b.stok === '#ERROR!' ? 'text-red-500' : 'text-blue-600'}`}>
                        {b.stok || '0'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium uppercase">{b.satuan}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: TAMBAH MASTER BARANG BARU */}
      {isModalMasterOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-lg w-full relative border-t-8 border-slate-800">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Pendaftaran Barang Baru</h2>
            <p className="text-sm text-slate-500 mb-6 pb-4 border-b">Tambahkan jenis barang ke dalam database Master.</p>

            <form onSubmit={handleSubmitMaster} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 mb-2">Kategori</label>
                  <select required value={formMaster.kategori} onChange={handleKategoriChange} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-slate-800 outline-none cursor-pointer">
                    <option value="" disabled>-- Pilih Kategori --</option>
                    <option value="Alat Tulis">Alat Tulis</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Kebersihan">Kebersihan</option>
                    <option value="Fasilitas Asrama">Fasilitas Asrama</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 mb-2">Kode (Otomatis)</label>
                  <input type="text" readOnly value={formMaster.kodeBarang} className="w-full bg-slate-200 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-500 font-mono font-bold cursor-not-allowed outline-none" placeholder="Pilih kategori..." />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 mb-2">Nama Barang</label>
                <input type="text" required value={formMaster.namaBarang} onChange={e => setFormMaster({...formMaster, namaBarang: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-slate-800 outline-none" placeholder="Contoh: Tinta Printer Epson" />
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 mb-2">Satuan (Kemasan)</label>
                <select required value={formMaster.satuan} onChange={e => setFormMaster({...formMaster, satuan: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-slate-800 outline-none cursor-pointer">
                  <option value="" disabled>-- Pilih Satuan --</option>
                  <option value="Pcs">Pcs (Buah)</option>
                  <option value="Rim">Rim</option>
                  <option value="Dus">Dus / Box</option>
                  <option value="Botol">Botol</option>
                  <option value="Pack">Pack</option>
                  <option value="Set">Set</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalMasterOpen(false)} disabled={isSubmittingMaster} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                <button type="submit" disabled={isSubmittingMaster || !formMaster.kodeBarang} className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed">
                  {isSubmittingMaster ? 'Menyimpan...' : 'Daftarkan Barang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CATAT TRANSAKSI */}
      {isModalTransaksiOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-lg w-full relative border-t-8 border-blue-600">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Form Transaksi Gudang</h2>
            <p className="text-sm text-slate-500 mb-6 pb-4 border-b">Catat arus masuk/keluar barang dari gudang.</p>

            <form onSubmit={handleSubmitTransaksi} className="space-y-4">
              <div>
                <label className="block font-bold text-sm text-slate-700 mb-2">Jenis Aktivitas (Arus)</label>
                <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                  {['Terima', 'Pindah', 'Muat'].map(akt => (
                    <button 
                      key={akt} type="button" 
                      onClick={() => setFormTransaksi({...formTransaksi, aktivitas: akt})}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${formTransaksi.aktivitas === akt ? (akt === 'Terima' ? 'bg-emerald-500 text-white' : akt === 'Muat' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white') : 'text-slate-500 hover:bg-slate-200'}`}
                    >
                      {akt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 mb-2">Pilih Barang</label>
                <select required value={formTransaksi.barangTerpilih} onChange={e => setFormTransaksi({...formTransaksi, barangTerpilih: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none">
                  <option value="" disabled>-- Pilih Barang Tersedia --</option>
                  {/* Gunakan array sortedData agar dropdown juga ikut terurut! */}
                  {sortedData.map((b, idx) => (
                    <option key={idx} value={`${b.kodeBarang}|${b.namaBarang}`}>
                      [{b.kodeBarang}] {b.namaBarang} - (Sisa: {b.stok} {b.satuan})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm text-slate-700 mb-2">Jumlah</label>
                  <input type="number" min="1" required value={formTransaksi.jumlah} onChange={e => setFormTransaksi({...formTransaksi, jumlah: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none" placeholder="0" />
                </div>
                <div>
                  <label className="block font-bold text-sm text-slate-700 mb-2">Nama Petugas</label>
                  <input type="text" required value={formTransaksi.petugas} onChange={e => setFormTransaksi({...formTransaksi, petugas: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-slate-700 mb-2">Keterangan / Tujuan</label>
                <textarea required rows={2} value={formTransaksi.keterangan} onChange={e => setFormTransaksi({...formTransaksi, keterangan: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none resize-none" placeholder="Contoh: Pembelian dari supplier / Diambil staf..." />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalTransaksiOpen(false)} disabled={isSubmittingTransaksi} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                <button type="submit" disabled={isSubmittingTransaksi} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                  {isSubmittingTransaksi ? 'Memproses...' : 'Simpan Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: NOTIFIKASI SUKSES */}
      {successMessage && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease]">
          <div className="bg-white p-10 rounded-3xl text-center shadow-2xl max-w-sm w-full relative">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Berhasil!</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">{successMessage}</p>
            <button onClick={() => setSuccessMessage('')} className="bg-slate-800 text-white w-full py-3 rounded-xl font-bold text-sm hover:-translate-y-1 transition-transform">
              Tutup
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