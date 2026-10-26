import React from 'react';
import { ADMIN_WA_DISPLAY, ADMIN_WA_NUMBER } from '../types/order';
import { MessageCircle, ShieldCheck, Heart, ExternalLink, Sparkles, ArrowRight, Home, FileEdit, PhoneCall, MapPin, BookOpen, Lock, Briefcase, Instagram } from 'lucide-react';
import { PageTab } from './Navbar';

interface FooterProps {
  onTabChange?: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  const scrollTo = (id: string) => {
    if (onTabChange) {
      onTabChange('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Value Statement */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-1.5 text-xl font-extrabold text-white tracking-tight">
              <span className="text-sky-400">web</span>kilat
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Jasa pembuatan landing page kustom 1 hari selesai untuk UMKM dan bisnis online Indonesia seharga Rp 499.000 all-in, gratis domain 1 tahun, dan langsung terhubung ke WhatsApp siap closing.
            </p>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>100% Desain Kustom · Bebas Template Pasaran</span>
            </div>
            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>Jl. Pangkalan 6 Raya No. 16 RT 003 RW 004, Ciketing Udik, Bantar Gebang, Kota Bekasi 17153</span>
              </div>
            </div>

            {/* Follow Our Page - Social Links */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <a
                href="https://www.facebook.com/profile.php?id=61595666643294"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-white font-bold text-xs transition-all group shadow-xs hover:shadow-[#1877F2]/20 cursor-pointer"
                title="Follow Our Facebook Page"
              >
                <span className="w-5 h-5 rounded-lg bg-[#1877F2] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                  <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </span>
                <span className="text-slate-200 group-hover:text-white transition-colors text-[11px]">
                  Facebook
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white transition-transform" />
              </a>

              <a
                href="https://www.instagram.com/indo_digital.2026?obrf=NnE1b3E5ZXBnOWc0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 hover:from-purple-500/20 hover:to-amber-500/20 border border-pink-500/30 text-white font-bold text-xs transition-all group shadow-xs hover:shadow-pink-500/20 cursor-pointer"
                title="Follow Instagram @indo_digital.2026"
              >
                <span className="w-5 h-5 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                  <Instagram className="w-3 h-3 text-white" />
                </span>
                <span className="text-slate-200 group-hover:text-pink-200 transition-colors text-[11px]">
                  Instagram
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links (3 Navtabs + Key Sections) */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-sm font-bold text-white uppercase tracking-wider">
              Navigasi Halaman
            </div>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onTabChange ? onTabChange('home') : scrollTo('root')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-slate-300 font-semibold"
                >
                  <Home className="w-3.5 h-3.5 text-sky-400" />
                  <span>Home (Beranda)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange ? onTabChange('order') : scrollTo('formulir-order')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-slate-300 font-semibold"
                >
                  <FileEdit className="w-3.5 h-3.5 text-amber-400" />
                  <span>Form Order (Rp 499rb)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange ? onTabChange('artikel') : scrollTo('root')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-slate-300 font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span>Artikel (Kisah Sukses UMKM)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange ? onTabChange('kemitraan') : (window.location.hash = '#/kemitraan')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-slate-300 font-semibold"
                >
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Kemitraan Mandiri (Non-PKWT)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange ? onTabChange('kontak') : scrollTo('root')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-slate-300 font-semibold"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kontak Kami (Studio & WA)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange ? onTabChange('admin') : (window.location.hash = '#/admin')}
                  className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-2 text-amber-400 font-bold"
                  title="Akses Login Admin"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Akses Admin (Kelola Blog)</span>
                </button>
              </li>
              <li className="pt-1 border-t border-slate-800">
                <button
                  onClick={() => scrollTo('paket-harga')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Paket Rp 499rb All-In
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('contoh-umkm')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Portfolio 8 Industri
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  FAQ & Tanya Jawab
                </button>
              </li>
              <li className="pt-2">
                <a
                  href="https://indo-digital.myr.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 text-[11px] font-black hover:bg-yellow-300 transition-all shadow-xs ring-1 ring-amber-300"
                >
                  <span>PRODUK INDODIGITAL LAINNYA</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Admin */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-sm font-bold text-white uppercase tracking-wider">
              Kontak Admin & Konsultasi
            </div>
            <p className="text-slate-400 leading-relaxed">
              Ada pertanyaan seputar pemesanan landing page kilat untuk usaha Anda? Hubungi tim Indo Digital:
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <a
                href={`https://wa.me/${ADMIN_WA_NUMBER}?text=Halo%20Admin%20Webkilat,%20saya%20mau%20konsultasi%20pembuatan%20landing%20page.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Admin: {ADMIN_WA_DISPLAY}</span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href="https://www.facebook.com/profile.php?id=61595666643294"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl font-bold text-xs transition-all shadow-md hover:shadow-blue-500/20 group cursor-pointer"
                  title="Follow Facebook Indo Digital"
                >
                  <svg className="w-4 h-4 fill-white shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                  <ExternalLink className="w-3 h-3 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="https://www.instagram.com/indo_digital.2026?obrf=NnE1b3E5ZXBnOWc0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white rounded-xl font-bold text-xs transition-all shadow-md hover:shadow-pink-500/20 group cursor-pointer"
                  title="Follow Instagram @indo_digital.2026"
                >
                  <Instagram className="w-4 h-4 text-white shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 text-pink-200 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {onTabChange && (
                <button
                  onClick={() => onTabChange('kontak')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                  <span>Buka Halaman Kontak Lengkap & Peta</span>
                </button>
              )}
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              Jam Operasional: Setiap Hari (08.00 - 22.00 WIB)
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} <strong>webkilat</strong> by Indo Digital Solution. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center sm:justify-end">
            <button
              onClick={() => onTabChange ? onTabChange('home') : scrollTo('root')}
              className="hover:text-slate-400 cursor-pointer"
            >
              Beranda
            </button>
            <span>•</span>
            <button
              onClick={() => onTabChange ? onTabChange('order') : scrollTo('formulir-order')}
              className="hover:text-slate-400 cursor-pointer"
            >
              Form Order
            </button>
            <span>•</span>
            <button
              onClick={() => onTabChange ? onTabChange('kontak') : scrollTo('root')}
              className="hover:text-slate-400 cursor-pointer"
            >
              Kontak Kami
            </button>
            <span>•</span>
            <button
              onClick={() => onTabChange ? onTabChange('admin') : (window.location.hash = '#/admin')}
              className="hover:text-amber-400 text-slate-400 cursor-pointer flex items-center gap-1 font-semibold"
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span>Login Admin</span>
            </button>
            <span>•</span>
            <a
              href="https://www.facebook.com/profile.php?id=61595666643294"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 text-slate-400 cursor-pointer flex items-center gap-1 font-semibold transition-colors"
              title="Follow our page di Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </a>
            <span>•</span>
            <a
              href="https://www.instagram.com/indo_digital.2026?obrf=NnE1b3E5ZXBnOWc0"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 text-slate-400 cursor-pointer flex items-center gap-1 font-semibold transition-colors"
              title="Follow kami di Instagram"
            >
              <span className="w-3.5 h-3.5 rounded bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] inline-flex items-center justify-center p-0.5">
                <Instagram className="w-2.5 h-2.5 text-white" />
              </span>
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
