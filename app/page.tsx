import React from 'react';
import { Mic, BarChart3, Target, Wallet, ArrowRight, Heart, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* --- Navigasi --- */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Wallet className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">SobatSaku</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
              <Link href="/blog" className="hover:text-blue-600 transition">Blog Keuangan</Link>
              <Link href="#fitur" className="hover:text-blue-600 transition">Fitur</Link>
              <Link href="#donasi" className="hover:text-blue-600 transition">Donasi</Link>
            </div>

            <Link 
              href="/sign-in" 
              className="bg-slate-900 text-white px-6 py-2 md:py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition shadow-lg"
            >
              Coba Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                <Zap className="w-4 h-4" /> Solusi Keuangan No. 1 Indonesia
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] mb-6">
                Atur Duit Jadi <br /> 
                <span className="text-blue-600 italic">Semudah Ngobrol</span>
              </h1>
              <p className="text-slate-500 text-lg lg:text-xl mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Gak perlu pusing ngetik tiap habis jajan. Tinggal ngomong, <span className="text-slate-900 font-semibold">SobatSaku</span> langsung catat. Lacak pengeluaran & budget secara otomatis.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-xl shadow-blue-200">
                  Mulai Sekarang <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="#donasi" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-slate-200 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 transition">
                   Dukung Kami
                </Link>
              </div>
            </div>

            {/* Visual Hero */}
            <div className="relative mt-12 lg:mt-0">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200/50 blur-[100px] rounded-full"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden border-[12px] border-slate-900 shadow-2xl mx-auto max-w-[300px] lg:max-w-[400px]">
                <img 
                  src="https://images.unsplash.com/photo-1512428559083-a400a3b8465a?auto=format&fit=crop&q=80&w=800" 
                  alt="App Interface" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-white/50">
                  <div className="bg-blue-600 p-2 rounded-full animate-pulse">
                    <Mic className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Voice Detected</p>
                    <p className="text-sm font-bold">"Beli kopi 25rb..."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3 Fitur Utama (Responsive Grid) --- */}
      <section id="fitur" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Satu Aplikasi, Semua Solusi.</h2>
            <p className="text-slate-500 md:text-lg">Fitur-fitur keren yang bikin kamu makin jago ngatur uang tanpa harus ribet buka Excel.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300">
              <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Mic className="text-blue-600 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Input Suara Pintar</h3>
              <p className="text-slate-500 leading-relaxed">
                Tekan satu tombol, bicara, dan biarkan AI kami mengenali jenis transaksi, nominal, hingga kategorinya.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-100 transition-all duration-300">
              <div className="bg-orange-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Target className="text-orange-600 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Target Budgeting</h3>
              <p className="text-slate-500 leading-relaxed">
                Tetapkan batas pengeluaran tiap bulan. SobatSaku akan kasih tau kamu sebelum budget mulai kritis.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-green-500 hover:shadow-2xl hover:shadow-green-100 transition-all duration-300">
              <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <BarChart3 className="text-green-600 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Grafik Cashflow</h3>
              <p className="text-slate-500 leading-relaxed">
                Visualisasi jujur ke mana perginya uang kamu. Grafik harian, mingguan, sampai bulanan tersedia lengkap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Donation (CTA Lebar) --- */}
      <section id="donasi" className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-10 md:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <Heart className="w-12 h-12 text-pink-500 mx-auto mb-6 fill-pink-500 animate-bounce" />
            <h2 className="text-3xl md:text-5xl font-black mb-6">Bantu SobatSaku Tetap <br className="hidden md:block"/> Gratis Untuk Indonesia</h2>
            <p className="text-slate-400 md:text-lg mb-10 max-w-xl mx-auto">
              Donasi kamu membantu biaya server dan pengembangan fitur AI agar SobatSaku bisa dinikmati siapa saja.
            </p>
            <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:scale-105 transition shadow-xl">
              Traktir Kopi ☕
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/10 blur-[100px] rounded-full"></div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 font-medium">© 2026 SobatSaku. Teman setia dompet sehat Indonesia.</p>
        </div>
      </footer>
    </div>
  );
}