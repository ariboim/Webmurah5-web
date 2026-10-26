import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Pause,
  Play,
  Globe,
  Zap,
} from 'lucide-react';

export interface RecentSale {
  id: string;
  buyerName: string;
  businessName: string;
  location: string;
  text: string;
  packageName: string;
  price: string;
  timeAgo: string;
  domainPreview: string;
  category: string;
  initials: string;
}

// Curated list of randomized recent sales with social proof,
// featuring "Baru saja memesan landing page dari Jakarta" and key cities across Indonesia
const INITIAL_SALES: RecentSale[] = [
  {
    id: 'sale-1',
    buyerName: 'Budi Santoso',
    businessName: 'Kopi Kenangan Senopati',
    location: 'Jakarta',
    text: 'Baru saja memesan landing page dari Jakarta',
    packageName: 'Paket Kilat UMKM 1 Hari Jadi',
    price: 'Rp 499.000',
    timeAgo: 'Baru saja',
    domainPreview: 'kopinusantara.my.id',
    category: 'Kuliner & F&B',
    initials: 'BS',
  },
  {
    id: 'sale-2',
    buyerName: 'dr. Amanda Putri',
    businessName: 'Glow Aesthetic Clinic',
    location: 'Jakarta Selatan',
    text: 'Baru saja memesan landing page dari Jakarta',
    packageName: 'Landing Page Bisnis + Domain Resmi',
    price: 'Rp 499.000',
    timeAgo: '1 menit lalu',
    domainPreview: 'glowclinic.my.id',
    category: 'Klinik Kecantikan',
    initials: 'AP',
  },
  {
    id: 'sale-3',
    buyerName: 'Hendra Wijaya',
    businessName: 'Berkah Mandiri Logistik',
    location: 'Jakarta Barat',
    text: 'Baru saja memesan landing page dari Jakarta',
    packageName: 'Paket Usaha Jasa & Ekspedisi',
    price: 'Rp 499.000',
    timeAgo: '2 menit lalu',
    domainPreview: 'berkahlogistik.biz.id',
    category: 'Jasa & Ekspedisi',
    initials: 'HW',
  },
  {
    id: 'sale-4',
    buyerName: 'Siti Rahmawati',
    businessName: 'Zahira Modest Hijab',
    location: 'Bandung',
    text: 'Baru saja memesan landing page dari Bandung',
    packageName: 'Paket Fashion UMKM Kilat',
    price: 'Rp 499.000',
    timeAgo: '3 menit lalu',
    domainPreview: 'zahiramodest.my.id',
    category: 'Fashion Muslimah',
    initials: 'SR',
  },
  {
    id: 'sale-5',
    buyerName: 'Ahmad Fauzi',
    businessName: 'Sejuk Mandiri Teknik AC',
    location: 'Jakarta Timur',
    text: 'Baru saja memesan landing page dari Jakarta',
    packageName: 'Landing Page Kilat 24 Jam Jadi',
    price: 'Rp 499.000',
    timeAgo: '4 menit lalu',
    domainPreview: 'sejukmandiri.biz.id',
    category: 'Servis AC & Bengkel',
    initials: 'AF',
  },
  {
    id: 'sale-6',
    buyerName: 'Rina Marlina',
    businessName: 'Dapur Sambal Mak Nyoss',
    location: 'Surabaya',
    text: 'Baru saja memesan landing page dari Surabaya',
    packageName: 'Paket Kuliner All-In 1 Hari',
    price: 'Rp 499.000',
    timeAgo: '5 menit lalu',
    domainPreview: 'sambalmaknyoss.id',
    category: 'Kuliner Nusantara',
    initials: 'RM',
  },
  {
    id: 'sale-7',
    buyerName: 'Bambang Irawan',
    businessName: 'Prima Interior & Custom Kitchen',
    location: 'Jakarta Utara',
    text: 'Baru saja memesan landing page dari Jakarta',
    packageName: 'Landing Page Portofolio + WhatsApp Direct',
    price: 'Rp 499.000',
    timeAgo: '6 menit lalu',
    domainPreview: 'primainterior.my.id',
    category: 'Interior & Mebel',
    initials: 'BI',
  },
  {
    id: 'sale-8',
    buyerName: 'Dewi Lestari',
    businessName: 'Organic Herbal Glow',
    location: 'Tangerang',
    text: 'Baru saja memesan landing page dari Tangerang',
    packageName: 'Paket Kilat UMKM Promo 499rb',
    price: 'Rp 499.000',
    timeAgo: '7 menit lalu',
    domainPreview: 'organicherbal.biz.id',
    category: 'Herbal BPOM',
    initials: 'DL',
  },
  {
    id: 'sale-9',
    buyerName: 'Rian Pratama',
    businessName: 'Solusi Digital Kreatif',
    location: 'Jakarta Pusat',
    text: 'Baru saja memesan landing page dari Jakarta',
    packageName: 'Paket Kilat 1 Hari Jadi (Free Domain)',
    price: 'Rp 499.000',
    timeAgo: '8 menit lalu',
    domainPreview: 'solusikreatif.my.id',
    category: 'Agency & Creative',
    initials: 'RP',
  },
  {
    id: 'sale-10',
    buyerName: 'Kadek Mahendra',
    businessName: 'Bali Tour & Rent Car Express',
    location: 'Denpasar',
    text: 'Baru saja memesan landing page dari Denpasar',
    packageName: 'Landing Page Wisata & Rental',
    price: 'Rp 499.000',
    timeAgo: '10 menit lalu',
    domainPreview: 'balitourkilat.com',
    category: 'Travel & Wisata',
    initials: 'KM',
  },
];

// Helper pool to randomize real-time events dynamically
const RANDOM_BUYERS = [
  { name: 'Bpk. Hendro', business: 'Warung Soto Betawi 99', loc: 'Jakarta' },
  { name: 'Ibu Ratna', business: 'Catering Berkah Bunda', loc: 'Jakarta Selatan' },
  { name: 'drg. Farhan', business: 'Klinik Gigi Senyum Indah', loc: 'Jakarta Barat' },
  { name: 'Sdr. Kevin', business: 'Sneakers Clean & Care', loc: 'Jakarta' },
  { name: 'Ibu Megawati', business: 'Batik Tulis Kencana', loc: 'Jakarta Pusat' },
  { name: 'Bpk. Ridwan', business: 'Jasa Desain Arsitek', loc: 'Bandung' },
  { name: 'dr. Satria', business: 'Apotek Sehat Sejahtera', loc: 'Jakarta' },
  { name: 'Ibu Ningsih', business: 'Toko Kue Bolu Gulung', loc: 'Surabaya' },
  { name: 'Bpk. Faisal', business: 'Bengkel Mobil Bergaransi', loc: 'Jakarta Timur' },
];

export const LiveActivityTicker: React.FC = () => {
  const [sales, setSales] = useState<RecentSale[]>(INITIAL_SALES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [todayOrdersCount, setTodayOrdersCount] = useState<number>(27);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-cycle through recent sales every 4.5 seconds with randomization
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sales.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, sales.length]);

  // Occasionally simulate a fresh random order coming in from Jakarta / Indonesia
  useEffect(() => {
    const randomOrderTimer = setInterval(() => {
      const randomBuyer = RANDOM_BUYERS[Math.floor(Math.random() * RANDOM_BUYERS.length)];
      const isJakarta = Math.random() > 0.3; // 70% chance to be Jakarta
      const loc = isJakarta ? 'Jakarta' : randomBuyer.loc;

      const newSale: RecentSale = {
        id: `sale-dyn-${Date.now()}`,
        buyerName: randomBuyer.name,
        businessName: randomBuyer.business,
        location: loc,
        text: `Baru saja memesan landing page dari ${loc}`,
        packageName: 'Paket Kilat UMKM (Rp 499rb)',
        price: 'Rp 499.000',
        timeAgo: 'Baru saja',
        domainPreview: `${randomBuyer.business.toLowerCase().replace(/[^a-z0-9]/g, '')}.my.id`,
        category: 'UMKM Mandiri',
        initials: randomBuyer.name.slice(0, 2).toUpperCase(),
      };

      setSales((prev) => [newSale, ...prev.slice(0, 14)]);
      setTodayOrdersCount((prev) => prev + 1);
    }, 28000);

    return () => clearInterval(randomOrderTimer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? sales.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sales.length);
  };

  const handleOrderClick = () => {
    window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'order' }));
    setTimeout(() => {
      const el = document.getElementById('formulir-order') || document.getElementById('form-order');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const currentSale = sales[currentIndex] || sales[0];

  return (
    <section
      aria-label="Aktivitas Pemesanan Real-Time"
      className="relative z-20 w-full max-w-full overflow-hidden bg-slate-900 border-y border-sky-900/60 shadow-lg text-white"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial-[at_top_right] from-sky-900/30 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="absolute -left-20 top-0 w-72 h-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 top-0 w-72 h-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Live Status Badge & Counter */}
          <div className="flex items-center justify-between sm:justify-start gap-3 shrink-0">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
                LIVE ACTIVITY
              </span>
            </div>

            {/* Daily Counter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              <span>
                <strong className="text-white font-bold">{todayOrdersCount}</strong> UMKM pesan hari ini
              </span>
            </div>

            {/* Mobile Play / Pause toggle */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="lg:hidden p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={isPaused ? 'Lanjutkan Auto-Play' : 'Jeda Sementara'}
              aria-label={isPaused ? 'Lanjutkan' : 'Jeda'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Center: Dynamic Animated Sale Notification */}
          <div
            className="flex-1 min-w-0 py-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSale.id + currentIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex items-center gap-3 min-w-0"
              >
                {/* Initial Avatar */}
                <div className="hidden sm:flex w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 text-white font-bold text-xs items-center justify-center shrink-0 shadow-sm border border-sky-400/30">
                  {currentSale.initials}
                </div>

                {/* Content Box */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
                    {/* Buyer & Key Action Text */}
                    <div className="flex items-center gap-1.5 font-bold text-white truncate">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-sky-200 font-medium">{currentSale.buyerName}</span>
                      <span className="text-slate-500 font-normal">·</span>
                      <span className="text-white font-semibold">
                        {currentSale.text}
                      </span>
                    </div>

                    {/* Time indicator */}
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{currentSale.timeAgo}</span>
                    </div>
                  </div>

                  {/* Secondary Details: Business / Domain / Package */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate mt-0.5">
                    <span className="text-slate-300 font-medium truncate">
                      {currentSale.businessName}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-sky-400 font-mono truncate hidden md:inline">
                      {currentSale.domainPreview}
                    </span>
                    <span className="text-slate-600 hidden md:inline">·</span>
                    <span className="text-amber-400 font-medium hidden sm:inline">
                      {currentSale.packageName}
                    </span>
                    <span className="text-slate-600 hidden sm:inline">·</span>
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px]">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      Verified
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Controls & CTA Button */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 lg:pt-0 border-t border-slate-800/80 lg:border-t-0">
            {/* Desktop Carousel Controls */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
              <button
                onClick={handlePrev}
                className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Pesanan Sebelumnya"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isPaused ? 'Putar Otomatis' : 'Jeda Otomatis'}
                aria-label={isPaused ? 'Putar' : 'Jeda'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleNext}
                className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Pesanan Selanjutnya"
                aria-label="Selanjutnya"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick CTA to Claim Rp 499rb Slot */}
            <button
              onClick={handleOrderClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-sm hover:shadow-sky-500/25 transition-all cursor-pointer group"
            >
              <span>Pesan Sekarang (Rp 499rb)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </div>

      {/* Horizontal Continuous Scrolling Mini-Ticker (Social Proof Stream) */}
      <div className="border-t border-slate-800/80 bg-slate-950/70 py-1.5 overflow-hidden">
        <div className="flex items-center select-none overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-8 animate-marquee shrink-0">
            {sales.concat(sales).map((item, idx) => (
              <div
                key={`stream-${item.id}-${idx}`}
                className="inline-flex items-center gap-2 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                onClick={handleOrderClick}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-semibold text-slate-200">{item.buyerName}</span>
                <span className="text-slate-400">—</span>
                <span className="text-sky-300 font-medium">{item.text}</span>
                <span className="text-slate-500">({item.timeAgo})</span>
                <span className="text-slate-600 text-[10px]">✦</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-8 animate-marquee2 shrink-0" aria-hidden="true">
            {sales.concat(sales).map((item, idx) => (
              <div
                key={`stream-dup-${item.id}-${idx}`}
                className="inline-flex items-center gap-2 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                onClick={handleOrderClick}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-semibold text-slate-200">{item.buyerName}</span>
                <span className="text-slate-400">—</span>
                <span className="text-sky-300 font-medium">{item.text}</span>
                <span className="text-slate-500">({item.timeAgo})</span>
                <span className="text-slate-600 text-[10px]">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
