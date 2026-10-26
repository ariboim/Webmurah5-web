import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  MessageCircle,
  Sparkles,
  ExternalLink,
  Home,
  FileEdit,
  PhoneCall,
  Flame,
  BookOpen,
  Lock,
  Briefcase,
} from 'lucide-react';
import { ADMIN_WA_NUMBER, ADMIN_WA_DISPLAY } from '../types/order';
import { IndoDigitalLogo } from './IndoDigitalLogo';

export type PageTab = 'home' | 'order' | 'artikel' | 'kemitraan' | 'kontak' | 'admin';

interface NavbarProps {
  activeTab: PageTab;
  onTabChange: (tab: PageTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const progress = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectTab = (tab: PageTab) => {
    setMobileMenuOpen(false);
    onTabChange(tab);
  };

  const scrollToSectionOnHome = (id: string) => {
    setMobileMenuOpen(false);
    if (activeTab !== 'home') {
      onTabChange('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };


  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-8 h-16 sm:h-20">
          {/* Zone 1: Official INDO DIGITAL Logo (Seamless, Zero White-Frame/Tile Artifacts) */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => handleSelectTab('home')}
              className="flex items-center cursor-pointer text-left focus:outline-none"
              title="INDO DIGITAL - Inovasi Digital Indonesia"
            >
              <div className="block sm:hidden">
                <IndoDigitalLogo size="sm" variant="full" />
              </div>
              <div className="hidden sm:block">
                <IndoDigitalLogo size="md" variant="full" />
              </div>
            </button>
          </div>

          {/* Zone 2: 4 Primary Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs">
            {/* Tab 1: Home */}
            <button
              onClick={() => handleSelectTab('home')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#1D3582] text-white shadow-md shadow-[#1D3582]/25 scale-[1.02]'
                  : 'text-slate-700 hover:text-[#1D3582] hover:bg-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {/* Tab 2: Form Order */}
            <button
              onClick={() => handleSelectTab('order')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer relative ${
                activeTab === 'order'
                  ? 'bg-[#1D3582] text-white shadow-md shadow-[#1D3582]/25 scale-[1.02]'
                  : 'text-slate-700 hover:text-[#1D3582] hover:bg-white'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>Form Order</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1 ${
                  activeTab === 'order'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-rose-100 text-rose-700 border border-rose-200'
                }`}
              >
                <Flame className="w-3 h-3 fill-current" />
                <span>Rp 499rb</span>
              </span>
            </button>

            {/* Tab 3: Artikel */}
            <button
              onClick={() => handleSelectTab('artikel')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'artikel'
                  ? 'bg-[#1D3582] text-white shadow-md shadow-[#1D3582]/25 scale-[1.02]'
                  : 'text-slate-700 hover:text-[#1D3582] hover:bg-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Artikel</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Kisah UMKM
              </span>
            </button>

            {/* Tab 4: Kemitraan (Non-PKWT / WFH) */}
            <button
              onClick={() => handleSelectTab('kemitraan')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'kemitraan'
                  ? 'bg-[#1D3582] text-white shadow-md shadow-[#1D3582]/25 scale-[1.02]'
                  : 'text-slate-700 hover:text-[#1D3582] hover:bg-white'
              }`}
            >
              <Briefcase className="w-4 h-4 text-indigo-500" />
              <span>Kemitraan</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
                Non-PKWT
              </span>
            </button>

            {/* Tab 5: Kontak Kami */}
            <button
              onClick={() => handleSelectTab('kontak')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'kontak'
                  ? 'bg-[#1D3582] text-white shadow-md shadow-[#1D3582]/25 scale-[1.02]'
                  : 'text-slate-700 hover:text-[#1D3582] hover:bg-white'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Kontak Kami</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* Tab 5: Post Artikel (Admin Login) - Mudah terlihat di navtab */}
            <button
              onClick={() => handleSelectTab('admin')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer relative ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-amber-300 shadow-md ring-2 ring-amber-400/50 scale-[1.02]'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 shadow-2xs'
              }`}
              title="Akses Login Admin: Tulis & Publikasikan Artikel / Blog Baru"
            >
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Post Artikel</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-black bg-amber-400 text-slate-950 uppercase tracking-wider shadow-2xs">
                Admin
              </span>
            </button>
          </nav>

          {/* Zone 3: Actions (Produk Lainnya, Tanya AI, CTA) */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {/* Highlighted Direct Link: PRODUK INDODIGITAL LAINNYA */}
            <a
              href="https://indo-digital.myr.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-amber-950 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 hover:from-amber-400 hover:to-yellow-400 rounded-xl shadow-xs border border-amber-400/90 transition-all transform hover:scale-102 active:scale-95 whitespace-nowrap group ring-2 ring-amber-300/60"
              title="Kunjungi Produk Indo Digital Lainnya"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              <span>PRODUK INDODIGITAL</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>


            {/* Highly Visible Admin Login & Blog Input Trigger */}
            <button
              onClick={() => handleSelectTab('admin')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-sky-400/40'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
              title="Akses Admin: Input & Kelola Artikel / Blog"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </button>

            {activeTab !== 'order' && (
              <button
                onClick={() => handleSelectTab('order')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#1D3582] hover:bg-[#162968] rounded-xl shadow-sm transition-all transform active:scale-98 whitespace-nowrap cursor-pointer"
              >
                <span>Pesan Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile hamburger button & quick actions - GUARANTEED 100% VISIBLE */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            <button
              onClick={() => handleSelectTab('admin')}
              className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10.5px] font-black transition-all cursor-pointer shadow-2xs shrink-0 ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-amber-300 ring-2 ring-amber-400'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
              }`}
              title="Dashboard Admin (Verifikasi Mitra & Artikel)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => handleSelectTab('order')}
              className="px-2.5 py-1.5 text-[11px] font-black text-white bg-[#1D3582] hover:bg-[#162968] active:scale-95 rounded-lg shadow-xs shrink-0 whitespace-nowrap"
            >
              Rp 499rb
            </button>

            {/* HAMBURGER MENU BUTTON (Guaranteed Visible, Always Available) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-sky-100 active:bg-sky-200 text-slate-800 border border-slate-300/90 focus:outline-none shrink-0 flex items-center justify-center cursor-pointer shadow-xs transition-colors"
              aria-label="Toggle menu"
              title="Menu Navigasi"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-rose-600 stroke-[2.5]" />
              ) : (
                <Menu className="w-5 h-5 text-slate-900 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          {/* 4 Main Page Tabs on Mobile */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
              Pilih Halaman Website:
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleSelectTab('home')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                  activeTab === 'home'
                    ? 'bg-[#1D3582] text-white shadow-md'
                    : 'bg-slate-50 text-slate-800 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Home className="w-4 h-4" />
                  <span>1. Home (Beranda)</span>
                </div>
                {activeTab === 'home' && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Aktif</span>}
              </button>

              <button
                onClick={() => handleSelectTab('order')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                  activeTab === 'order'
                    ? 'bg-[#1D3582] text-white shadow-md'
                    : 'bg-slate-50 text-slate-800 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileEdit className="w-4 h-4 text-amber-500" />
                  <span>2. Form Order (Pemesanan Kilat)</span>
                </div>
                <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                  Rp 499rb
                </span>
              </button>

              <button
                onClick={() => handleSelectTab('artikel')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                  activeTab === 'artikel'
                    ? 'bg-[#1D3582] text-white shadow-md'
                    : 'bg-slate-50 text-slate-800 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#00A3E0]" />
                  <span>3. Artikel (Kisah Sukses UMKM)</span>
                </div>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  Tips & Data
                </span>
              </button>

              <button
                onClick={() => handleSelectTab('kemitraan')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                  activeTab === 'kemitraan'
                    ? 'bg-[#1D3582] text-white shadow-md'
                    : 'bg-slate-50 text-slate-800 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>4. Kemitraan Mandiri (Non-PKWT)</span>
                </div>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-black px-2 py-0.5 rounded-full border border-indigo-200">
                  Fee 60% WFH
                </span>
              </button>

              <button
                onClick={() => handleSelectTab('kontak')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                  activeTab === 'kontak'
                    ? 'bg-[#1D3582] text-white shadow-md'
                    : 'bg-slate-50 text-slate-800 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>5. Kontak Kami (WhatsApp & Studio)</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              <button
                onClick={() => handleSelectTab('admin')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                  activeTab === 'admin'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-amber-50/70 text-slate-800 border border-amber-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>6. Dashboard Admin (Verifikasi Mitra &amp; Artikel)</span>
                </div>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black shadow-2xs">
                  Akses Admin
                </span>
              </button>
            </div>
          </div>

          {/* Sub-sections links when on Home */}
          {activeTab === 'home' && (
            <div className="pt-2 border-t border-sky-200/60">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 mb-2">
                Bagian Halaman Home:
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-700">
                <button
                  onClick={() => scrollToSectionOnHome('alasan-landing-page')}
                  className="text-left px-3 py-2 rounded-lg bg-white/80 hover:bg-sky-100"
                >
                  5 Alasan
                </button>
                <button
                  onClick={() => scrollToSectionOnHome('keunggulan')}
                  className="text-left px-3 py-2 rounded-lg bg-white/80 hover:bg-sky-100"
                >
                  Keunggulan
                </button>
                <button
                  onClick={() => scrollToSectionOnHome('contoh-umkm')}
                  className="text-left px-3 py-2 rounded-lg bg-white/80 hover:bg-sky-100"
                >
                  Portfolio 8 Sektor
                </button>
                <button
                  onClick={() => scrollToSectionOnHome('paket-harga')}
                  className="text-left px-3 py-2 rounded-lg bg-white/80 hover:bg-sky-100 font-bold text-sky-800"
                >
                  Harga Rp 499rb
                </button>
                <button
                  onClick={() => scrollToSectionOnHome('alur-pemesanan')}
                  className="text-left px-3 py-2 rounded-lg bg-white/80 hover:bg-sky-100"
                >
                  Alur Pemesanan
                </button>
                <button
                  onClick={() => scrollToSectionOnHome('faq')}
                  className="text-left px-3 py-2 rounded-lg bg-white/80 hover:bg-sky-100"
                >
                  FAQ Tanya Jawab
                </button>
              </div>
            </div>
          )}

          {/* Action Links & External */}
          <div className="pt-2 border-t border-sky-200/60 flex flex-col gap-2">
            <a
              href="https://indo-digital.myr.id"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black text-amber-950 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 rounded-lg shadow-sm border border-amber-400"
            >
              <span>PRODUK INDODIGITAL LAINNYA</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>


            <a
              href={`https://wa.me/${ADMIN_WA_NUMBER}?text=Halo%20Admin%20Webkilat,%20saya%20mau%20konsultasi%20jasa%20landing%20page%201%20hari%20Rp%20499rb.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-sky-200 rounded-lg hover:bg-sky-50"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Admin ({ADMIN_WA_DISPLAY})</span>
            </a>
          </div>
        </div>
      )}

      {/* Thin Fixed Scroll Progress Bar below Navbar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-sky-200/40 overflow-hidden pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-sky-500 via-blue-600 to-rose-500 transition-all duration-75 ease-out shadow-xs"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </header>
  );
};
