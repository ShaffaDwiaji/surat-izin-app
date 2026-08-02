'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });

      if (res.ok) {
        // Jika berhasil, arahkan ke Dashboard Admin (yang akan kita buat nanti)
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal login');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a237e] to-[#0a0f3d] flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Tombol Kembali ke Beranda */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-white/60 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Kembali
        </Link>
      </div>

      <div className="w-full max-w-[400px] bg-white p-8 md:p-10 rounded-[30px] shadow-2xl relative overflow-hidden animate-[fadeIn_0.4s_ease-out]">
        <div className="absolute top-0 left-0 h-[5px] w-full bg-gradient-to-r from-kai-orange to-red-500"></div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#1a237e]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1a237e] mb-1">Akses Petugas</h1>
          <p className="text-sm text-gray-500">Masukkan Master PIN untuk masuk</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input 
              type="password" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full bg-[#fafbff] border border-[#e0e0e0] rounded-[16px] px-4 py-4 text-center tracking-[0.3em] text-lg font-bold text-[#1a237e] focus:outline-none focus:border-kai-orange focus:ring-2 focus:ring-kai-orange/20 transition-all" 
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 rounded-[16px] text-[15px] font-bold transition-all duration-300 shadow-md ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-gradient-to-r from-[#1a237e] to-[#283593] text-white hover:shadow-lg hover:-translate-y-1'
            }`}
          >
            {isLoading ? 'Memverifikasi...' : 'Masuk Sistem'}
          </button>
        </form>
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