import React, { useState } from 'react';
import {
  Play,
  Clock,
  Globe2,
  TrendingUp,
  LineChart,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { ADMIN_WA_NUMBER } from '../types/order';

interface ReasonItem {
  number: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ReactNode;
  highlight: string;
  color: string;
}

const REASONS: ReasonItem[] = [
  {
    number: '#1',
    title: 'Landing Page Online 24 Jam Non-Stop',
    subtitle: 'Otomatisasi Penjualan',
    desc: 'Bekerja aktif menjelaskan produk dan menerima pesanan selama 24 jam sehari 7 hari seminggu, bahkan di saat Anda sedang tidur. Anda tidak perlu lagi capek mengetik penjelasan yang sama berkali-kali ke calon pembeli.',
    icon: <Clock className="w-5 h-5 text-sky-600" />,
    highlight: 'Jualan tetap jalan meski Anda sedang istirahat',
    color: 'border-sky-200 bg-sky-50/50',
  },
  {
    number: '#2',
    title: 'Dapat Diakses Di Mana Saja & Kapan Saja',
    subtitle: 'Satu Kali Klik Langsung Buka',
    desc: 'Calon konsumen cukup klik satu link dari WhatsApp, bio Instagram, TikTok, Facebook, atau Google. Seluruh info produk, foto, garansi, dan tombol beli langsung terbuka dalam hitungan detik.',
    icon: <Globe2 className="w-5 h-5 text-indigo-600" />,
    highlight: 'Sangat praktis tanpa instal aplikasi apa pun',
    color: 'border-indigo-200 bg-indigo-50/50',
  },
  {
    number: '#3',
    title: 'Unlimited Jangkauan Pemasaran',
    subtitle: 'Tembus Batas Wilayah & Daerah',
    desc: 'Jangkauan produk Anda melampaui batas geografis kota maupun provinsi. Siapa saja dari Sabang sampai Merauke bisa menemukan produk unggulan Anda, melipatgandakan potensi omset bisnis.',
    icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
    highlight: 'Pasar Anda terbuka selebar-lebarnya',
    color: 'border-emerald-200 bg-emerald-50/50',
  },
  {
    number: '#4',
    title: 'Bisa Melacak Data Pengunjung Akurat',
    subtitle: 'Tracking Facebook Pixel & Analytics',
    desc: 'Metode konvensional (sebar brosur/baliho) tidak bisa mendeteksi siapa yang membaca. Di landing page, Anda bisa pasang pixel analitik untuk melacak data audiens dan retargeting iklan yang sangat efisien.',
    icon: <LineChart className="w-5 h-5 text-amber-600" />,
    highlight: 'Segmentasi pembeli potensial lebih tajam',
    color: 'border-amber-200 bg-amber-50/50',
  },
  {
    number: '#5',
    title: 'Aset Database Calon Konsumen (Money is in the List)',
    subtitle: 'Aset Berharga Jangka Panjang',
    desc: 'Membangun daftar nama dan kontak calon pembeli melalui form opt-in penawaran. Anda memiliki database sendiri yang bisa di-follow up dan dikirimi penawaran produk baru kapan saja tanpa biaya iklan berulang.',
    icon: <Users className="w-5 h-5 text-rose-600" />,
    highlight: 'Makin banyak database, makin besar potensi omset',
    color: 'border-rose-200 bg-rose-50/50',
  },
];

export const VideoLandingPageSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeReason, setActiveReason] = useState<number>(0);

  const scrollToOrder = () => {
    const el = document.getElementById('formulir-order');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWhatsAppConsult = () => {
    const text = encodeURIComponent(
      'Halo Admin Webkilat, saya baru saja menonton video 5 alasan harus punya landing page. Saya ingin konsultasi pembuatan landing page promo Rp 499.000 untuk bisnis saya.'
    );
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <section id="alasan-landing-page" className="py-20 bg-gradient-to-b from-sky-50/50 via-white to-slate-50 border-y border-slate-200/70 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold tracking-wide border border-sky-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Edukasi & Strategi Bisnis Online</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            5 Alasan Kenapa Anda Harus Punya Landing Page
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
            Jualan Anda masih manual lewat WA atau media sosial? Simak video penjelasan praktis berikut tentang bagaimana landing page bekerja otomatis melipatgandakan omset dan menghemat waktu berharga Anda.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-950 ring-1 ring-slate-900/10">
            {/* Aspect Ratio 16:9 responsive frame */}
            <div className="relative w-full aspect-video">
              {!isPlaying ? (
                /* Poster Thumbnail with Play Button */
                <div className="relative w-full h-full bg-slate-900 overflow-hidden group cursor-pointer" onClick={() => setIsPlaying(true)}>
                  {/* YouTube high quality thumbnail */}
                  <img
                    src="https://img.youtube.com/vi/yYahtmbdjII/maxresdefault.jpg"
                    alt="5 Alasan Kenapa Anda Harus Punya Landing Page Sebagai Web Jualan"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-95 transition-opacity group-hover:scale-102 duration-500"
                    loading="lazy"
                  />
                  {/* Dark overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/40" />

                  {/* Center Play Button with ripple effect */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-sky-500/30 animate-ping" />
                      <button
                        type="button"
                        className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-xl shadow-sky-500/40 transition-all duration-300 transform group-hover:scale-110 cursor-pointer"
                        aria-label="Putar Video"
                      >
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white translate-x-0.5" />
                      </button>
                    </div>
                  </div>

                  {/* Top Video Header Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white text-xs sm:text-sm">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md font-semibold border border-white/20 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Video Rekomendasi Bisnis
                    </span>
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-slate-300 border border-white/10 hidden sm:inline">
                      Durasi: ~9 menit edukatif
                    </span>
                  </div>

                  {/* Bottom Video Caption */}
                  <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white">
                    <p className="text-sm sm:text-base font-bold drop-shadow-md text-slate-100 line-clamp-1">
                      5 Alasan Kenapa Anda Perlu Landing Page Sebagai Web Jualan — Inne Lie
                    </p>
                    <p className="text-xs text-sky-300 flex items-center gap-1 mt-0.5">
                      <span>Klik untuk memutar langsung</span>
                      <span>·</span>
                      <span>Resolusi HD Audio Jelas</span>
                    </p>
                  </div>
                </div>
              ) : (
                /* YouTube Embed Iframe */
                <iframe
                  className="w-full h-full border-0"
                  src="https://www.youtube-nocookie.com/embed/yYahtmbdjII?autoplay=1&rel=0"
                  title="5 Alasan Kenapa Anda Harus Punya Landing Page Sebagai Web Jualan"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>

            {/* Video Footer Banner */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-semibold text-white">Topik Utama:</span>
                <span className="text-sky-400">Otomatisasi WA, Jangkauan Luas, Pixel Data & Database</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.youtube.com/watch?v=yYahtmbdjII"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white underline transition-colors"
                >
                  Buka di YouTube ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Points Detailed Grid */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Rangkuman 5 Poin Krusial dari Video:
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Klik setiap poin di bawah ini untuk melihat ulasan detailnya:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {REASONS.map((reason, index) => {
              const isSelected = activeReason === index;
              return (
                <div
                  key={reason.number}
                  onClick={() => setActiveReason(index)}
                  className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 relative ${
                    isSelected
                      ? 'border-sky-500 bg-white shadow-xl ring-2 ring-sky-400/20 -translate-y-1'
                      : 'border-slate-200 bg-white/80 hover:bg-white hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="inline-flex items-center justify-center font-black text-sm px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800">
                      {reason.number}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {reason.icon}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                    {reason.title}
                  </h4>
                  <div className="text-xs font-semibold text-sky-700 mb-2">
                    {reason.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {reason.desc}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{reason.highlight}</span>
                  </div>
                </div>
              );
            })}

            {/* Final Summary Card & CTA in the 6th slot of the 3x2 grid */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-xl flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wide mb-3">
                  KESIMPULAN
                </span>
                <h4 className="text-lg font-extrabold mb-2 leading-snug">
                  Jangan Tunda Lagi, Miliki Landing Page Anda Sekarang!
                </h4>
                <p className="text-xs sm:text-sm text-sky-100 leading-relaxed mb-4">
                  Dengan Webkilat, Anda tidak perlu pusing mikir koding atau bayar jutaan rupiah. Cukup Rp 499.000, tim profesional kami kerjakan landing page siap pakai dalam 1 hari!
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={scrollToOrder}
                  className="w-full py-2.5 px-4 rounded-xl bg-white text-sky-900 font-bold text-xs sm:text-sm hover:bg-sky-50 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Pesan Sekarang (Rp 499.000)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppConsult}
                  className="w-full py-2 px-4 rounded-xl bg-sky-800/80 hover:bg-sky-800 text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Konsultasi WA Dulu</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Callout Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Siap Menerapkan 5 Manfaat Ini pada Bisnis Anda Hari Ini?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Domain aktif, desain kustom khusus produk Anda, copywriting persuasif, dan tombol WhatsApp otomatis.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={scrollToOrder}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Order Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
