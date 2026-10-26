import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  Zap,
  Clock,
  Award,
  Headphones,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Building2,
  Check,
  Users,
  TrendingUp,
  Star,
  MapPin,
  Flame,
} from 'lucide-react';

// Custom smooth ease-out count-up hook
const useCountUp = (end: number, duration: number = 2200, decimals: number = 0, isTriggered: boolean = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isTriggered) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Ease out cubic: 1 - (1 - progress)^3
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(easeOut * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isTriggered]);

  return count;
};

export const TrustBadgesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Start count-up on mount or when scrolled into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Fallback: trigger after 300ms if intersection observer doesn't fire immediately
    const fallbackTimer = setTimeout(() => {
      setIsInView(true);
    }, 300);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Animated counters
  const ordersCompleted = useCountUp(1284, 2200, 0, isInView);
  const satisfactionRate = useCountUp(98.7, 2400, 1, isInView);
  const deliveryHours = useCountUp(24, 1800, 0, isInView);
  const provincesCovered = useCountUp(34, 2000, 0, isInView);

  // Formatter for Indonesian number (1.284)
  const formatNumber = (num: number) => {
    return Math.floor(num).toLocaleString('id-ID');
  };

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 bg-gradient-to-b from-white via-sky-50/50 to-slate-50 border-b border-slate-200/80 relative overflow-hidden w-full max-w-full"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-40 bg-gradient-to-r from-sky-200/20 via-indigo-200/15 to-emerald-200/20 blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 w-full">
        {/* ========================================================= */}
        {/* DYNAMIC CLIENT COUNTER & ORDERS COMPLETED TICKER (SOCIAL PROOF) */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 border border-sky-100 shadow-xl shadow-sky-950/5 relative overflow-hidden w-full">
          {/* Top Header & Live Status Beacon */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider border border-emerald-300">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>PESAN SEKARANG, BAYAR SETELAH JADI</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200">
                  <span>100% Bebas Risiko &amp; Bergaransi</span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                Dipercaya oleh <span className="text-sky-600">1.280+ UMKM & Pebisnis</span> Seluruh Indonesia
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                Setiap angka di bawah ini adalah bukti nyata komitmen pengerjaan 1 hari kilat kami untuk membantu bisnis lokal closing lebih banyak lewat landing page resmi.
              </p>
            </div>

            {/* Live Order Activity Badge */}
            <div className="shrink-0 p-3 sm:p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 fill-emerald-400" />
              </div>
              <div className="text-left text-xs">
                <div className="font-extrabold text-white flex items-center gap-1.5">
                  <span>14 Order Aktif Hari Ini</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[11px] text-slate-400">
                  Sisa kuota promo Rp 499rb: <strong className="text-amber-400">4 Slot</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Counter Metrics Grid with Count-Up Animation */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 pt-6">
            {/* Metric 1: Orders Completed */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-50/80 via-white to-sky-50/40 border border-sky-100/90 shadow-2xs hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-md">
                  Pesanan Selesai
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans flex items-baseline">
                <span>{formatNumber(ordersCompleted)}</span>
                <span className="text-sky-600 text-2xl sm:text-3xl font-black ml-0.5">+</span>
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1">
                Landing Page Live & Aktif
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Selesai tepat waktu dalam 24 jam kerja
              </p>
            </div>

            {/* Metric 2: Client Satisfaction Rate */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 border border-amber-100/90 shadow-2xs hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
                  <Star className="w-5 h-5 stroke-[2.2] fill-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                  Kepuasan Klien
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans flex items-baseline">
                <span>{satisfactionRate.toFixed(1)}</span>
                <span className="text-amber-500 text-2xl sm:text-3xl font-black ml-0.5">%</span>
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1">
                Rating Kepuasan Konsumen
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Berdasarkan 1.200+ ulasan UMKM riil
              </p>
            </div>

            {/* Metric 3: Fast Delivery Time */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-rose-50/40 border border-rose-100/90 shadow-2xs hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 stroke-[2.2] fill-white/20" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md">
                  Waktu Selesai
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans flex items-baseline">
                <span className="text-rose-600 mr-1 text-2xl sm:text-3xl">&le;</span>
                <span>{Math.round(deliveryHours)}</span>
                <span className="text-slate-700 text-lg sm:text-xl font-bold ml-1.5">Jam</span>
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1">
                Pengerjaan Kilat 1 Hari Jadi
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Bebas molor, garansi revisi minor 1x
              </p>
            </div>

            {/* Metric 4: Nationwide Coverage */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 border border-emerald-100/90 shadow-2xs hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  Cakupan Wilayah
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans flex items-baseline">
                <span>{Math.round(provincesCovered)}</span>
                <span className="text-emerald-600 text-2xl sm:text-3xl font-black ml-0.5">+</span>
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1">
                Provinsi di Seluruh Indonesia
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Dari Sabang hingga Merauke
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 6 MAIN GUARANTEE & TRUST BADGES GRID */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Badge 1: 100% Garansi Kepuasan */}
          <div className="group p-4 bg-white rounded-2xl border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="text-[10px] uppercase font-black tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mb-1">
              Garansi Resmi
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
              100% Kepuasan
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              Free revisi 1x hingga tampilan sesuai karakter bisnis Anda.
            </p>
          </div>

          {/* Badge 2: Pengerjaan Kilat 24 Jam */}
          <div className="group p-4 bg-white rounded-2xl border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 mb-3 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 stroke-[2.2] fill-white/20" />
            </div>
            <div className="text-[10px] uppercase font-black tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full mb-1">
              Super Fast
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
              1 Hari Jadi (24 Jam)
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              Pengerjaan maraton, besok website langsung aktif & siap closing.
            </p>
          </div>

          {/* Badge 3: SSL 256-Bit & Domain Resmi */}
          <div className="group p-4 bg-white rounded-2xl border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 mb-3 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="text-[10px] uppercase font-black tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
              Keamanan Tinggi
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
              SSL 256-Bit Encrypted
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              HTTPS aman gembok hijau, server uptime 99.9% stabil & cepat.
            </p>
          </div>

          {/* Badge 4: 100% Desain Kustom */}
          <div className="group p-4 bg-white rounded-2xl border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="text-[10px] uppercase font-black tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full mb-1">
              Original Design
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
              100% Kustom Unik
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              Bukan template murahan, disesuaikan dengan psikologi pembeli Anda.
            </p>
          </div>

          {/* Badge 5: Pembayaran Terverifikasi */}
          <div className="group p-4 bg-white rounded-2xl border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-3 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="text-[10px] uppercase font-black tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full mb-1">
              Aman & Resmi
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
              Pembayaran Terverifikasi
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              Mendukung transfer BCA, Mandiri, BRI, QRIS, & e-Wallet resmi.
            </p>
          </div>

          {/* Badge 6: Support WhatsApp 24/7 */}
          <div className="group p-4 bg-white rounded-2xl border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20 mb-3 group-hover:scale-110 transition-transform">
              <Headphones className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="text-[10px] uppercase font-black tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full mb-1">
              Bantuan Cepat
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
              Support WA Responsif
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              Dukungan teknis & konsultasi via WA 0896-7368-6625 setiap hari.
            </p>
          </div>
        </div>

        {/* Secondary Trust & Security Seal Banner */}
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Keamanan & Kepercayaan Pembelian Terjamin
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  Verified UMKM Partner
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Semua proyek diproses langsung oleh tim Webkilat Indo Digital Solution dengan jaminan kerahasiaan data dan perlindungan konsumen.
              </p>
            </div>
          </div>

          {/* Payment & Security Logos / Chips */}
          <div className="flex items-center flex-wrap gap-2 justify-center lg:justify-end shrink-0">
            {/* BCA */}
            <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-extrabold text-blue-800 tracking-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              BCA
            </div>
            {/* Mandiri */}
            <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-extrabold text-amber-700 tracking-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              MANDIRI
            </div>
            {/* BRI */}
            <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-extrabold text-blue-900 tracking-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
              BRI
            </div>
            {/* QRIS */}
            <div className="px-2.5 py-1 bg-rose-50 border border-rose-200 rounded-lg text-[11px] font-black text-rose-700 tracking-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
              QRIS
            </div>
            {/* e-Wallet */}
            <div className="px-2.5 py-1 bg-sky-50 border border-sky-200 rounded-lg text-[11px] font-bold text-sky-800 tracking-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              GoPay / OVO / Dana
            </div>
            {/* SSL Badge */}
            <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] font-bold text-emerald-800 tracking-tight flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              256-Bit SSL
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
