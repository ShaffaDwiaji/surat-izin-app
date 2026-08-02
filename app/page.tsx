import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a237e] to-[#0a0f3d] flex flex-col items-center justify-between p-4 md:p-10 font-sans">
      
      {/* WRAPPER KONTEN UTAMA */}
      <div className="w-full flex flex-col items-center flex-grow justify-center mt-4 md:mt-8">
        
        {/* HEADER SECTION */}
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mb-10 relative animate-[fadeIn_0.5s_ease-out]">
          <div className="h-2 w-full bg-gradient-to-r from-orange-400 to-orange-600"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between p-8 md:px-12 gap-6">
            <img src="/kai.png" alt="Logo KAI" className="h-12 md:h-16 object-contain" />
            
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a237e] mb-2 tracking-tight">
                Portal Digital Campus
              </h1>
              <p className="text-sm md:text-base text-gray-500 font-medium">
                Darman Prasetyo Corporate University
              </p>
            </div>
            
            <img src="/kaicorpu.png" alt="Logo KAI Corpu" className="h-12 md:h-16 object-contain" />
          </div>
        </div>

        {/* MENU CARDS GRID (Sekarang 2 Kolom untuk Publik) */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-[fadeIn_0.7s_ease-out]">
          
          {/* KARTU 1: IZIN */}
          <Link href="/izin" className="group flex flex-col bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-b-4 border-transparent hover:border-orange-500 relative overflow-hidden">
            <div className="w-16 h-16 min-h-[64px] min-w-[64px] bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-[#1a237e] group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-100 shadow-sm flex-shrink-0">
              <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1a237e] mb-3">Pengajuan Izin</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
              Layanan perizinan keluar kampus, asrama, dan berlibur bagi peserta diklat.
            </p>
            <div className="flex items-center text-orange-500 font-bold text-sm mt-auto">
              <span>Masuk Layanan</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
          </Link>

          {/* KARTU 2: KELUHAN (PUBLIK) */}
          <Link href="/keluhan" className="group flex flex-col bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-b-4 border-transparent hover:border-red-500 relative overflow-hidden">
            <div className="w-16 h-16 min-h-[64px] min-w-[64px] bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-600 group-hover:scale-110 transition-transform duration-300 group-hover:bg-red-100 shadow-sm flex-shrink-0">
              <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1a237e] mb-3">Lapor Keluhan (Kritik & Saran)</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
              Formulir pelaporan jika terdapat kendala pada fasilitas, kebersihan, atau pelayanan area kampus.
            </p>
            <div className="flex items-center text-red-600 font-bold text-sm mt-auto">
              <span>Buat Laporan</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
          </Link>

        </div>
      </div>

      {/* FOOTER - LINK LOGIN RAHASIA */}
      <div className="mt-12 mb-4 animate-[fadeIn_1s_ease-out]">
        <Link href="/login" className="text-white/20 hover:text-white/80 text-sm font-medium transition-colors duration-300 tracking-wider">
          Login Petugas &rarr;
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}