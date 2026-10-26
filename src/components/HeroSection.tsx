import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  MessageCircle,
  Clock,
  Globe,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Monitor,
  CheckCircle2,
  TrendingUp,
  Zap,
  Flame,
} from 'lucide-react';
import { ADMIN_WA_NUMBER } from '../types/order';
import { CountdownDisplay } from './CountdownTimer';
import { IndoDigitalLogo } from './IndoDigitalLogo';

const LIVE_NOTIFICATIONS = [
  {
    icon: '🛒',
    title: 'Order Baru Masuk via WA',
    desc: 'Sambal Cumi Mak Nyoss · 3 Botol Bundling (Rp 105.000)',
    time: 'Baru saja',
  },
  {
    icon: '🌐',
    title: 'Domain Resmi Telah Aktif',
    desc: 'zahiramodest.my.id · Pengerjaan selesai 1 hari kilat',
    time: '2 menit lalu',
  },
  {
    icon: '📞',
    title: 'Booking Servis Diterima',
    desc: 'Sejuk Mandiri Teknik · Cuci 4 Unit AC Perkantoran',
    time: '5 menit lalu',
  },
  {
    icon: '✨',
    title: 'Konsultasi Kulit Lolos BPOM',
    desc: 'Dewi Ayu Herbal Care · Paket Glowing Rp 149.000',
    time: '7 menit lalu',
  },
];

export const HeroSection: React.FC = () => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('desktop');
  const [currentNotifIndex, setCurrentNotifIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNotifIndex((prev) => (prev + 1) % LIVE_NOTIFICATIONS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollToOrder = () => {
    window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'order' }));
    const el = document.getElementById('formulir-order');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const currentNotif = LIVE_NOTIFICATIONS[currentNotifIndex];

  return (
    <section className="relative pt-8 pb-20 overflow-hidden bg-white w-full max-w-full">
      {/* Dynamic ambient gradient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] max-w-[100vw] h-[500px] bg-gradient-to-b from-sky-200/50 via-sky-100/30 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/3 -right-20 w-[450px] max-w-[80vw] h-[450px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-[450px] max-w-[80vw] h-[450px] bg-sky-100/50 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Hard Selling Flash Sale Urgency Box in Hero */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6 w-full"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-3.5 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white shadow-lg border border-amber-300 text-xs font-black max-w-full text-center">
            <span className="flex items-center gap-1 bg-yellow-400 text-slate-950 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              FLASH SALE 6 JAM
            </span>
            <span className="tracking-wide">
              PROMO TERBATAS:{' '}
              <span className="inline-flex items-center bg-black/40 px-2 py-0.5 rounded border border-rose-400/40">
                <span className="line-through text-white/90 decoration-red-500 decoration-[3px] text-sm font-black">
                  Rp 1.8 Juta
                </span>
              </span>{' '}
              ➔{' '}
              <span className="text-yellow-300 text-base font-black">
                CUMA RP 499.000
              </span>{' '}
              (HEMAT RP 1.301.000!)
            </span>
            <div className="hidden sm:flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-lg border border-white/20">
              <span className="text-[10px] text-amber-300 uppercase font-bold">Sisa Waktu:</span>
              <CountdownDisplay variant="compact" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & Copywriting */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Eye-Catching Animated Guarantee Badge: PESAN SEKARANG BAYAR SETELAH JADI */}
            <div>
              <motion.button
                type="button"
                onClick={scrollToOrder}
                animate={{
                  y: [0, -4, 0],
                  boxShadow: [
                    '0 10px 25px -5px rgba(5, 150, 105, 0.4), 0 0 0 1px rgba(110, 231, 183, 0.5)',
                    '0 18px 38px -6px rgba(5, 150, 105, 0.75), 0 0 0 3px rgba(110, 231, 183, 0.95)',
                    '0 10px 25px -5px rgba(5, 150, 105, 0.4), 0 0 0 1px rgba(110, 231, 183, 0.5)',
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.6,
                  ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="group relative inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-xs sm:text-sm uppercase tracking-wide border-2 border-emerald-300 overflow-hidden cursor-pointer shadow-xl text-left"
                title="Klik untuk Pesan Sekarang - Bayar Setelah Web Selesai"
              >
                {/* Sweeping shimmer light beam across badge */}
                <motion.div
                  animate={{ x: ['-140%', '260%'] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    ease: 'easeInOut',
                    repeatDelay: 1,
                  }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent skew-x-12 pointer-events-none"
                />

                {/* Animated Pulsing Radar Beacon */}
                <span className="flex h-3.5 w-3.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-90" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white shadow-xs" />
                </span>

                {/* Animated Shield with subtle heartbeat wiggle */}
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -5, 5, 0],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.8,
                    repeatDelay: 1.8,
                    ease: 'easeInOut',
                  }}
                  className="shrink-0 w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30"
                >
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-100" />
                </motion.div>

                {/* Glowing Text */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="tracking-wider text-white font-black drop-shadow-sm">
                    PESAN SEKARANG,{' '}
                    <span className="text-yellow-300 underline decoration-yellow-400 decoration-2 underline-offset-2">
                      BAYAR SETELAH JADI!
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-black/25 text-[10px] font-extrabold px-2 py-0.5 rounded-full text-emerald-100 border border-emerald-300/40 w-fit">
                    <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>100% Bebas Risiko</span>
                  </span>
                </div>
              </motion.button>
            </div>

            {/* Trust Pill & Brand Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 text-xs font-bold text-slate-800 shadow-2xs">
              <span className="flex items-center gap-1.5 text-[#1D3582] font-black">
                <span className="w-2 h-2 rounded-full bg-[#00A3E0] animate-pulse"></span>
                INDO DIGITAL
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium">Inovasi Digital Indonesia</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-600 font-black flex items-center gap-1">
                <span>★ 4.9/5</span>
                <span className="text-slate-500 font-medium hidden sm:inline">(1.280+ UMKM)</span>
              </span>
            </div>

            {/* Unboxed editorial kicker */}
            <div className="flex items-center gap-2 text-xs font-black text-[#1D3582] tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#F97316] animate-ping"></span>
              <span className="text-[#F97316]">PROMO FLASH SALE RP 499RB</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>1 HARI SELESAI</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>FREE DOMAIN 1 TAHUN</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-black text-slate-900 tracking-tight leading-[1.12] text-balance">
              Jasa Pembuatan Landing Page &amp; Website Bisnis bersama{' '}
              <span className="inline-block text-[#1D3582]">
                INDO<span className="text-[#00A3E0] ml-1">DIGITAL</span>
              </span>
            </h1>

            {/* Corporate Value Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="text-xs font-black text-[#1D3582] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00A3E0]"></span>
                <span>SOLUSI EKOSISTEM DIGITAL BERKELAS KORPORAT UNTUK BISNIS ANDA</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                Hadirkan website profil dan landing page kustom berkecepatan tinggi (0.4 detik) yang dirancang khusus untuk memikat calon konsumen dan meningkatkan rasa percaya. Khusus hari ini, nikmati paket all-in <strong className="text-slate-900 font-bold">Rp 499.000</strong> (diskon dari harga normal <span className="line-through text-red-600 decoration-red-600 decoration-2">Rp 1.8 Juta</span>), lengkap dengan domain resmi 1 tahun dan <strong className="text-emerald-700 font-bold">bayar setelah website selesai Anda review</strong>.
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={scrollToOrder}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-black text-white bg-gradient-to-r from-[#1D3582] via-[#0284C7] to-[#1D3582] hover:from-[#162968] hover:to-[#0284C7] rounded-2xl shadow-xl hover:shadow-[#0284C7]/25 transition-all cursor-pointer whitespace-nowrap active:scale-98 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                <span className="relative">MULAI PROYEK DIGITAL (RP 499RB)</span>
                <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={`https://wa.me/${ADMIN_WA_NUMBER}?text=Halo%20Admin%20INDO%20DIGITAL,%20saya%20mau%20konsultasi%20jasa%20website%20dan%20landing%20page%201%20hari%20Rp%20499rb!`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl transition-all whitespace-nowrap shadow-xs hover:shadow-md"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>Konsultasi Solusi (089673686625)</span>
              </a>
            </div>

            {/* Reassurance Banner: PESAN SEKARANG BAYAR SETELAH JADI with Tilted Seal */}
            <div className="flex items-center gap-3.5 p-3.5 sm:p-4 bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 rounded-2xl border-2 border-emerald-300 text-emerald-950 text-xs font-bold shadow-xs relative overflow-hidden group">
              <div className="shrink-0 relative">
                <img
                  src="/assets/aistudio/IMG_20261023_134231_44224f1d.jpg"
                  alt="Logo Garansi Terjamin 100% Aman Tanpa DP Bebas Resiko"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-full border-2 border-red-300/80 shadow-md bg-white p-0.5 transform -rotate-12 group-hover:-rotate-3 group-hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={scrollToOrder}
                  title="Garansi Terjamin 100% Aman - Tanpa DP Bebas Resiko"
                />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-emerald-900 font-black text-xs sm:text-sm uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>GARANSI 100% AMAN &amp; BEBAS RESIKO</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed font-medium">
                  Pesan Sekarang, Bayar Setelah Web Selesai &amp; Anda Review! Tanpa DP sepeserpun di awal.
                </p>
              </div>
            </div>


            {/* Official Trust Badges Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Garansi Kepuasan</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200/80 text-[11px] font-bold shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-rose-600" />
                <span>Garansi 1 Hari Jadi</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200/80 text-[11px] font-bold shadow-2xs">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <span>Free Domain Resmi 1 Thn</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-bold shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>500+ UMKM Terdaftar</span>
              </div>
            </div>

            {/* Proof checklist with modern pill badges */}
            <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="font-semibold text-slate-800">Rp 499rb All-In</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="font-semibold text-slate-800">Free Domain 1 Thn</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="font-semibold text-slate-800">Bukan Template</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="font-semibold text-slate-800">Garansi Revisi</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Device Simulator Anchor with Animated Floating Badges */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col items-center relative"
          >
            {/* Live Floating Animated Notification Banner */}
            <div className="w-full mb-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNotifIndex}
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-sky-200 shadow-md flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-base shrink-0">{currentNotif.icon}</span>
                    <div className="truncate">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{currentNotif.title}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{currentNotif.desc}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-sky-600 font-semibold shrink-0 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                    {currentNotif.time}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Viewport switch controls */}
            <div className="flex items-center gap-1 p-1 bg-sky-50 border border-sky-200/70 rounded-xl mb-3 self-end shadow-2xs">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  deviceMode === 'desktop'
                    ? 'bg-white text-sky-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Tampilan Komputer</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  deviceMode === 'mobile'
                    ? 'bg-white text-sky-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Tampilan HP</span>
              </button>
            </div>

            {/* Device Container */}
            {deviceMode === 'desktop' ? (
              <div className="w-full max-w-full bg-slate-900 rounded-3xl p-3 shadow-2xl border border-slate-800 transition-all duration-300 relative group">
                {/* Floating Micro Badge */}
                <div className="absolute -top-3 right-1 sm:-right-3 z-20 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 animate-float">
                  <TrendingUp className="w-3 h-3" />
                  <span>Konversi Naik 3.4x</span>
                </div>

                {/* Browser top chrome */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-800 rounded-t-2xl mb-1 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="px-4 py-0.5 bg-slate-900/90 rounded text-[11px] font-mono text-slate-300 flex items-center gap-1.5 border border-slate-700/50">
                    <Globe className="w-3 h-3 text-sky-400" />
                    <span>https://usahaanda.my.id</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">SSL Aktif</span>
                </div>

                {/* Simulated Custom Landing Page Canvas */}
                <div className="bg-white rounded-b-2xl p-3 sm:p-5 text-slate-900 space-y-4 max-h-[380px] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <IndoDigitalLogo size="sm" variant="full" />
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Cloud Uptime 99.9%
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-slate-50 via-sky-50/40 to-slate-50 p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                    <div className="text-[10px] font-bold text-[#1D3582] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]"></span>
                      <span>Solusi Ekosistem Digital Berkecepatan Tinggi</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      Tingkatkan Omzet Penjualan dengan Landing Page yang Bikin Pembeli Langsung Percaya
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Jelaskan keunggulan produk Anda dengan visual bersih, testimoni asli, dan tombol order otomatis ke WhatsApp.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat Pesan Sekarang (WA)</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">Garansi 100% Bebas Risiko</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-xs font-bold text-slate-900">1 Hari Jadi</div>
                      <div className="text-[10px] text-slate-500">24 Jam Aktif</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-xs font-bold text-slate-900">Free Domain</div>
                      <div className="text-[10px] text-slate-500">1 Tahun Resmi</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-xs font-bold text-slate-900">Tanpa DP</div>
                      <div className="text-[10px] text-slate-500">Bayar Setelah Jadi</div>
                    </div>
                  </div>
                </div>

                {/* Official Guarantee Seal (Logo Garansi Terjamin - Agak Miring) */}
                <motion.div
                  initial={{ scale: 0.8, rotate: -22, opacity: 0 }}
                  animate={{ scale: 1, rotate: -12, opacity: 1 }}
                  transition={{ duration: 0.7, type: 'spring', bounce: 0.35, delay: 0.2 }}
                  whileHover={{ scale: 1.05, rotate: -5 }}
                  className="absolute -bottom-6 right-0 sm:-bottom-8 sm:-right-4 md:-bottom-9 md:-right-6 z-30 cursor-pointer select-none"
                  onClick={scrollToOrder}
                  title="Garansi Terjamin 100% Aman - Tanpa DP, Bebas Resiko (Klik untuk Pesan)"
                >
                  <div className="relative group">
                    <div className="absolute inset-0 rounded-full bg-rose-500/30 blur-xl group-hover:bg-rose-500/45 transition-all duration-300 animate-pulse" />
                    <img
                      src="/assets/aistudio/IMG_20261023_134231_44224f1d.jpg"
                      alt="Logo Garansi Terjamin 100% Aman Tanpa DP Bebas Resiko"
                      className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain rounded-full shadow-2xl border-4 border-white bg-white p-0.5 transform transition-transform duration-300 ring-2 ring-red-200/90 drop-shadow-2xl"
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-950 text-yellow-300 text-[9px] sm:text-[10px] font-black uppercase px-2 sm:px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap border border-yellow-400/50 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-2.5 h-2.5 text-yellow-400" />
                      <span>GARANSI RESMI</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="w-[280px] max-w-full bg-slate-900 rounded-[38px] p-3 shadow-2xl border-4 border-slate-800 transition-all duration-300 relative">
                {/* Floating badge for mobile */}
                <div className="absolute -top-3 right-0 sm:-right-2 z-20 bg-sky-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg border border-white/20 animate-float">
                  ⚡ 1 Hari Jadi
                </div>

                {/* Phone speaker notch */}
                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-slate-950"></div>
                </div>

                <div className="bg-white rounded-[26px] p-4 text-slate-900 space-y-3 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <IndoDigitalLogo size="sm" variant="lockup" showTagline={false} />
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-medium">Online</span>
                  </div>

                  <div className="bg-sky-50/90 p-3 rounded-xl border border-sky-100">
                    <div className="text-[9px] font-bold text-sky-800 uppercase">Promo Spesial Hari Ini</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">Produk Pilihan Terbaik untuk Keluarga</div>
                    <div className="text-[10px] text-slate-600 mt-1">Diskon 30% + Subsidi Ongkir Se-Indonesia</div>
                  </div>

                  <div className="bg-emerald-600 text-white text-center py-2.5 px-2 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Pesan Langsung di WhatsApp</span>
                  </div>

                  <div className="text-[9px] text-center text-slate-400">
                    *Domain aktif 1 tahun & bebas konsultasi
                  </div>
                </div>

                {/* Official Guarantee Seal (Logo Garansi Terjamin - Agak Miring on Mobile) */}
                <motion.div
                  initial={{ scale: 0.8, rotate: -22, opacity: 0 }}
                  animate={{ scale: 1, rotate: -12, opacity: 1 }}
                  transition={{ duration: 0.7, type: 'spring', bounce: 0.35 }}
                  whileHover={{ scale: 1.05, rotate: -5 }}
                  className="absolute -bottom-6 right-0 sm:-right-4 z-30 cursor-pointer select-none"
                  onClick={scrollToOrder}
                  title="Garansi Terjamin 100% Aman - Tanpa DP, Bebas Resiko (Klik untuk Pesan)"
                >
                  <div className="relative group">
                    <div className="absolute inset-0 rounded-full bg-rose-500/30 blur-lg group-hover:bg-rose-500/45 transition-all duration-300 animate-pulse" />
                    <img
                      src="/assets/aistudio/IMG_20261023_134231_44224f1d.jpg"
                      alt="Logo Garansi Terjamin 100% Aman Tanpa DP Bebas Resiko"
                      className="w-18 h-18 sm:w-24 sm:h-24 object-contain rounded-full shadow-2xl border-4 border-white bg-white p-0.5 transform transition-transform duration-300 ring-2 ring-red-200/90 drop-shadow-xl"
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-950 text-yellow-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-yellow-400/50 flex items-center gap-0.5 opacity-90">
                      <span>GARANSI RESMI</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>

        {/* 4 Feature Value Pillars below hero with interactive hover */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center mb-4 transition-colors shadow-2xs">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">1 Hari Jadi (24 Jam)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tak perlu menunggu berminggu-minggu. Begitu data dikirim, tim kami langsung mengerjakannya maraton sampai tayang.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center mb-4 transition-colors shadow-2xs">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Free Domain 1 Tahun</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sudah termasuk nama domain bisnis resmi (.my.id / .biz.id / promo .com) aktif setahun penuh atas nama usaha Anda.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center mb-4 transition-colors shadow-2xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">100% Desain Kustom</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bukan template pasaran murahan. Layout, pilihan warna, dan copywriting kami susun khusus sesuai karakter bisnis Anda.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center mb-4 transition-colors shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Cuma Rp 499 Ribu All-In</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Harga hemat yang sangat ramah kantong UMKM. Tanpa biaya bulanan siluman, langsung siap untuk promosi medsos dan iklan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
