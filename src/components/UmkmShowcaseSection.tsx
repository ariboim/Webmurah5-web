import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UMKM_SHOWCASES, UmkmShowcase } from '../data/umkmShowcase';
import {
  Sparkles,
  MessageCircle,
  Check,
  ArrowRight,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Globe,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Monitor,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Flame,
  Info,
} from 'lucide-react';
import { ADMIN_WA_NUMBER } from '../types/order';

const INSPIRATION_SITES = [
  { domain: 'bucini.id', desc: 'Produk Kulit Asli & Kerajinan Nusantara', category: 'Craft & Leather' },
  { domain: 'ladanglima.com', desc: 'Tepung Singkong Sehat & Gluten Free', category: 'Healthy Food & F&B' },
  { domain: 'chocolatemonggo.com', desc: 'Cokelat Artisan Asli Khas Yogyakarta', category: 'Kuliner Premium' },
  { domain: 'bengokcraft.com', desc: 'Kreasi Anyaman Eceng Gondok Ramah Lingkungan', category: 'Eco Creative Craft' },
  { domain: 'gayolandcofee.com', desc: 'Kopi Arabika Premium Dataran Gayo', category: 'Specialty Coffee' },
  { domain: 'lapisbogor.co.id', desc: 'Oleh-Oleh Khas Lapis Talas Sangkuriang', category: 'Kuliner Ikonik' },
  { domain: 'seamwork.com', desc: 'Komunitas & Pola Desain Busana Mandiri', category: 'Fashion & Apparel' },
  { domain: 'barkismet.com', desc: 'Nutrisi & Perawatan Hewan Peliharaan', category: 'Pet Supplies' },
];

export const UmkmShowcaseSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isPaused, setIsPaused] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [mockupOrderSuccess, setMockupOrderSuccess] = useState(false);

  const totalCases = UMKM_SHOWCASES.length;
  const activeCase: UmkmShowcase = UMKM_SHOWCASES[currentIndex] || UMKM_SHOWCASES[0];

  // Auto-play runs automatically every 5 seconds, pauses when isPaused is true (upon touching business name)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % totalCases);
      setMockupOrderSuccess(false);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, currentIndex, totalCases]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalCases);
    setMockupOrderSuccess(false);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalCases) % totalCases);
    setMockupOrderSuccess(false);
  };

  const handleSelectCase = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setMockupOrderSuccess(false);
  };

  const scrollToOrder = (caseName?: string) => {
    const el = document.getElementById('formulir-order');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // If a specific case is selected, prefill notes or business field if possible
      if (caseName) {
        try {
          const inputBisnis = document.querySelector('input[name="namaBisnis"]') as HTMLInputElement;
          if (inputBisnis && !inputBisnis.value) {
            inputBisnis.placeholder = `Contoh: Terinspirasi model ${caseName}`;
          }
        } catch {
          // ignore
        }
      }
    }
  };

  // Filter cases for the category pills
  const categories = [
    { id: 'all', label: 'Semua Desain (8 Industri)', icon: '✨' },
    ...UMKM_SHOWCASES.map((item) => ({
      id: item.id,
      label: item.industryTag,
      icon: item.icon,
    })),
  ];

  return (
    <section id="contoh-umkm" className="py-20 bg-slate-50/70 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-black uppercase tracking-wider border border-sky-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Interactive Portfolio Carousel · 100% Desain Kustom</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight text-balance">
            Eksplorasi Desain Landing Page Lintas Industri
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Setiap industri memiliki psikologi pembeli yang berbeda. Klik dan geser carousel di bawah ini untuk melihat contoh struktur visual, penulisan copywriting, dan strategi closing per sektor UMKM Indonesia.
          </p>
        </div>

        {/* Notice Banner: No Generic Templates */}
        <div className="mb-8 p-4.5 bg-gradient-to-r from-sky-50 via-blue-50/60 to-indigo-50/50 border border-sky-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs text-sky-950 leading-relaxed">
              <strong className="font-extrabold text-sky-900 uppercase">Kenapa Kami Tolak Template Murahan?</strong> Bisnis F&B butuh visual gurih & legalitas Halal, sedangkan jasa teknisi butuh garansi darurat 30 menit. Template pasaran tidak dapat mewakili produk Anda. Di <strong>Webkilat</strong>, website Anda didesain <em>100% tailor-made</em> seharga <strong>Rp 499.000 all-in</strong>!
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isPaused
                  ? 'bg-amber-100/90 text-amber-950 border-amber-300 shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-ping'
                }`}
              />
              <span>
                {isPaused
                  ? '⏸️ Dijeda (Lepas sentuhan untuk lanjut)'
                  : '▶️ Otomatis Berputar (Sentuh nama untuk jeda)'}
              </span>
            </div>
          </div>
        </div>

        {/* Category Quick Jump Chips (Scrollable Bar) */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
            {categories.map((cat, idx) => {
              const isSelected =
                cat.id === 'all'
                  ? activeCategoryFilter === 'all'
                  : activeCase.id === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (cat.id === 'all') {
                      setActiveCategoryFilter('all');
                    } else {
                      setActiveCategoryFilter(cat.id);
                      const targetIdx = UMKM_SHOWCASES.findIndex((c) => c.id === cat.id);
                      if (targetIdx !== -1) {
                        handleSelectCase(targetIdx);
                      }
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-600/25 scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-100/90 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Carousel Frame */}
        <div className="relative bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-12">
          {/* Top Carousel Navigation Toolbar */}
          <div className="px-5 sm:px-8 py-4 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <div className="text-xs font-black tracking-wider text-sky-400 uppercase flex items-center gap-2">
                  <span>DESAIN PORTFOLIO #{currentIndex + 1} DARI {totalCases}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-bold">{activeCase.category}</span>
                </div>
                <div
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  onTouchStart={() => setIsPaused(true)}
                  onTouchEnd={() => setIsPaused(false)}
                  className="text-sm font-extrabold text-white flex items-center gap-1.5 cursor-pointer hover:text-sky-300 transition-colors select-none group/topname"
                  title="Sentuh untuk menjeda putaran"
                >
                  <span className="text-base">{activeCase.icon}</span>
                  <span className="underline decoration-dotted decoration-white/40 group-hover/topname:decoration-sky-400">
                    {activeCase.name}
                  </span>
                  {isPaused && (
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded ml-1 animate-pulse">
                      Dijeda
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Carousel Control Buttons & Mode Switch */}
            <div className="flex items-center gap-3">
              {/* Device Mode Switcher (Desktop vs Mobile) */}
              <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    deviceMode === 'desktop'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Lihat Tampilan Desktop"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    deviceMode === 'mobile'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Lihat Tampilan Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">HP / Mobile</span>
                </button>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                  aria-label="Desain Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-9 h-9 rounded-xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md shadow-sky-600/30"
                  aria-label="Desain Selanjutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Slide Content with AnimatePresence */}
          <div className="p-6 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeCase.id}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
              >
                {/* Left Column: Business Insights & Custom Strategy */}
                <div className="lg:col-span-5 space-y-6">
                  <div
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                    className="group/biz cursor-pointer p-3 -m-3 rounded-2xl hover:bg-sky-50/60 transition-all select-none border border-transparent hover:border-sky-200"
                    title="Sentuh nama usaha untuk menjeda putaran carousel"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
                      <span className="px-2.5 py-1 bg-sky-50 text-sky-700 rounded-lg border border-sky-200">
                        {activeCase.industryTag}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {activeCase.city}
                      </span>
                      {isPaused && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300 animate-pulse ml-auto">
                          ⏸️ Dijeda
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight group-hover/biz:text-sky-600 transition-colors flex items-center gap-2">
                      <span>{activeCase.name}</span>
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1.5 italic">
                      "{activeCase.tagline}"
                    </p>
                    <div className="text-[10px] text-sky-600 font-bold mt-1.5 flex items-center gap-1">
                      <span>👆 Sentuh nama usaha untuk menjeda putaran</span>
                    </div>
                  </div>

                  {/* Problem & Solution Comparison Cards */}
                  <div className="space-y-3.5 text-xs">
                    <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 shadow-2xs">
                      <div className="font-extrabold text-rose-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                        <span>Tantangan Awal Bisnis:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {activeCase.problem}
                      </p>
                    </div>

                    <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 shadow-2xs">
                      <div className="font-extrabold text-sky-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>
                        <span>Solusi Landing Page Kustom Webkilat:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {activeCase.solution}
                      </p>
                    </div>
                  </div>

                  {/* Quantified Real Results */}
                  <div className="space-y-2">
                    <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Hasil Nyata Pasca Website Live:</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      {activeCase.results.map((res, rIdx) => (
                        <div
                          key={rIdx}
                          className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center shadow-2xs"
                        >
                          <div className="text-base sm:text-lg font-black text-sky-600 leading-none">
                            {res.value}
                          </div>
                          <div className="text-[11px] font-bold text-slate-800 mt-1">
                            {res.label}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                            {res.note}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color Palette Demonstration */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-500" />
                      <span className="font-bold text-slate-700">Palet Warna Kustom:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: activeCase.palette.primary }}
                        title="Primary Color"
                      />
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: activeCase.palette.accent }}
                        title="Accent Color"
                      />
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: activeCase.palette.secondary }}
                        title="Secondary Color"
                      />
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">
                        {activeCase.palette.primary}
                      </span>
                    </div>
                  </div>

                  {/* Action CTA Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => scrollToOrder(activeCase.name)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-black text-white bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-98"
                    >
                      <span>Pesan Desain Kustom Industri Ini</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href={`https://wa.me/${ADMIN_WA_NUMBER}?text=Halo%20Admin%20Webkilat,%20saya%20tertarik%20dengan%20contoh%20landing%20page%20${encodeURIComponent(activeCase.category)}%20(${encodeURIComponent(activeCase.name)}).%20Bisa%20buatkan%20untuk%20usaha%20saya?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      <span>Konsultasi WA</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>

                {/* Right Column: Realistic Interactive Device Simulator */}
                <div className="lg:col-span-7 flex justify-center">
                  <div
                    className={`transition-all duration-300 w-full ${
                      deviceMode === 'mobile' ? 'max-w-[340px]' : 'max-w-full'
                    }`}
                  >
                    {/* Device Shell */}
                    <div className="bg-slate-900 rounded-3xl p-3 sm:p-4 shadow-2xl border-4 border-slate-800">
                      {/* Browser Chrome Header */}
                      <div className="flex items-center justify-between px-3 py-2 bg-slate-800/90 rounded-t-2xl mb-2 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-300 truncate max-w-[200px] sm:max-w-xs flex items-center gap-1">
                          <span className="text-emerald-400">🔒</span>
                          <span>https://{activeCase.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.my.id</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800 shrink-0">
                          Live Active
                        </span>
                      </div>

                      {/* Webpage Screen Body */}
                      <div
                        className="rounded-b-2xl p-4 sm:p-6 text-slate-900 space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300"
                        style={{ backgroundColor: activeCase.palette.bg }}
                      >
                        {/* Client Website Navbar */}
                        <div className="flex items-center justify-between border-b border-black/10 pb-3">
                          <div
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            onTouchStart={() => setIsPaused(true)}
                            onTouchEnd={() => setIsPaused(false)}
                            className="flex items-center gap-2 cursor-pointer p-1 -m-1 rounded-lg hover:bg-black/5 transition-colors select-none"
                            title="Sentuh untuk menjeda"
                          >
                            <span className="text-xl">{activeCase.icon}</span>
                            <div>
                              <div
                                className="font-black text-sm tracking-tight leading-none"
                                style={{ color: activeCase.palette.primary }}
                              >
                                {activeCase.name}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                {activeCase.city}
                              </div>
                            </div>
                          </div>
                          <div className="text-[10px] font-bold text-slate-600 bg-white/80 px-2 py-1 rounded-md border border-black/5">
                            Menu ☰
                          </div>
                        </div>

                        {/* Client Website Hero Section */}
                        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-black/5 space-y-3">
                          <div
                            className="inline-block text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider"
                            style={{
                              backgroundColor: activeCase.palette.secondary,
                              color: activeCase.palette.primary,
                            }}
                          >
                            {activeCase.mockup.offerBadge}
                          </div>

                          <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                            {activeCase.mockup.headline}
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            {activeCase.mockup.subheadline}
                          </p>

                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900">
                              {activeCase.mockup.priceSnippet}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              Stok Terbatas
                            </span>
                          </div>

                          {/* Social Proof */}
                          <div className="text-[11px] font-semibold text-slate-700 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60">
                            {activeCase.mockup.socialProof}
                          </div>

                          {/* Feature Bullet Points */}
                          <div className="space-y-1.5 pt-1">
                            {activeCase.mockup.features.map((feat, fIdx) => (
                              <div
                                key={fIdx}
                                className="flex items-start gap-2 text-[11px] text-slate-700 font-medium"
                              >
                                <Check
                                  className="w-3.5 h-3.5 shrink-0 mt-0.5"
                                  style={{ color: activeCase.palette.primary }}
                                />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>

                          {/* Industry Products / Menu Items if any */}
                          {activeCase.mockup.items && (
                            <div className="pt-2 border-t border-slate-100 space-y-2">
                              <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                                Pilihan Paket Unggulan:
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {activeCase.mockup.items.map((item, itIdx) => (
                                  <div
                                    key={itIdx}
                                    className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-left"
                                  >
                                    <div className="text-[11px] font-bold text-slate-800 truncate">
                                      {item.name}
                                    </div>
                                    <div className="text-xs font-black text-slate-900 mt-0.5">
                                      {item.price}
                                    </div>
                                    {item.tag && (
                                      <span
                                        className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-1"
                                        style={{
                                          backgroundColor: activeCase.palette.secondary,
                                          color: activeCase.palette.primary,
                                        }}
                                      >
                                        {item.tag}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Interactive WhatsApp CTA Button Inside Simulator */}
                          <div className="pt-2 space-y-2">
                            <button
                              type="button"
                              onClick={() => setMockupOrderSuccess(true)}
                              className="w-full text-white text-center py-3 px-4 rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:brightness-105 active:scale-98"
                              style={{ backgroundColor: '#16A34A' }}
                            >
                              <MessageCircle className="w-4 h-4 fill-white" />
                              <span>{activeCase.mockup.ctaLabel}</span>
                            </button>

                            {mockupOrderSuccess && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-900 font-semibold"
                              >
                                ✨ Simulasi Berhasil! Pada landing page riil, tombol ini langsung membuka aplikasi WhatsApp pelanggan dengan teks draf order otomatis siap kirim.
                              </motion.div>
                            )}

                            <div className="text-[10px] text-center text-slate-500 font-medium">
                              🛡️ {activeCase.mockup.guarantee}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Thumbnail Strip: Click Any Industry to Jump */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Pilih Industri Untuk Melihat Desain Kustom:
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Sentuh nama usaha untuk menjeda putaran
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {UMKM_SHOWCASES.map((item, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectCase(idx)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                    className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                      isActive
                        ? 'bg-white border-sky-500 shadow-md ring-2 ring-sky-400/30'
                        : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{item.icon}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                      )}
                    </div>
                    <div className="mt-1">
                      <div className="text-[11px] font-black text-slate-900 leading-tight truncate">
                        {item.industryTag}
                      </div>
                      <div className="text-[9px] text-slate-500 truncate mt-0.5">
                        {item.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Inspirasi Brand Lokal & Nasional */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>Inspirasi Brand Lokal & Nasional</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Berikut adalah beberapa contoh landing page umkm yang sukses sebagai inspirasi anda :
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Brand-brand ini membuktikan bahwa website mandiri dengan penataan visual rapi dan copywriting terarah mampu mengubah bisnis lokal menjadi brand bernilai tinggi dan dipercaya ribuan pelanggan.
            </p>
          </div>

          {/* Grid of 8 inspiration links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INSPIRATION_SITES.map((site, sIdx) => (
              <a
                key={sIdx}
                href={`https://${site.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 bg-white hover:bg-sky-50/70 border border-slate-200 hover:border-sky-300 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                      {site.category}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition-colors" />
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 group-hover:text-sky-700 transition-colors flex items-center gap-1.5 pt-1">
                    <span className="font-mono">{site.domain}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug font-medium">
                    {site.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-sky-600 font-bold group-hover:underline">
                  <span>Lihat Website</span>
                  <span>→</span>
                </div>
              </a>
            ))}
          </div>

          {/* Call to action connecting to our Rp 499rb custom service */}
          <div className="mt-8 p-6 bg-gradient-to-r from-sky-50 via-blue-50/60 to-sky-50 rounded-2xl border border-sky-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                Ingin Punya Landing Page Sebagus & Seefektif Brand-Brand di Atas?
              </h4>
              <p className="text-xs text-slate-600 max-w-xl font-medium">
                Tim Webkilat siap mendesain landing page kustom eksklusif untuk bisnis Anda hanya dalam 1 hari kerja seharga Rp 499.000 all-in sudah termasuk domain aktif 1 tahun!
              </p>
            </div>
            <button
              onClick={() => scrollToOrder()}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-black text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer active:scale-98 whitespace-nowrap"
            >
              <span>Mulai Buat Website Saya Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
