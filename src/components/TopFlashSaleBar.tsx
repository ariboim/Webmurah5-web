import React from 'react';
import { useCountdown } from './CountdownTimer';
import { Flame, ArrowRight, ShieldCheck } from 'lucide-react';

export const TopFlashSaleBar: React.FC = () => {
  const { hours, minutes, seconds } = useCountdown();
  const pad = (n: number) => n.toString().padStart(2, '0');

  const scrollToOrder = () => {
    // Navigate to order form smoothly
    window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'order' }));
    const el = document.getElementById('form-order') || document.getElementById('formulir-order');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-white text-slate-800 py-2.5 px-3 sm:px-4 shadow-[0_2px_10px_rgba(29,53,130,0.06)] border-b border-sky-100 z-50 overflow-hidden w-full max-w-full">
      {/* Decorative Brand Background Pattern (Clean White with Indo Digital Soft Blue & Cyan Tech Accents) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft radial gradients aligned to brand palette */}
        <div className="absolute -top-12 -left-12 w-64 h-32 bg-sky-200/25 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 right-1/4 w-80 h-28 bg-[#00A3E0]/10 rounded-full blur-2xl" />
        <div className="absolute top-0 right-4 w-48 h-24 bg-[#F58220]/10 rounded-full blur-2xl" />

        {/* Abstract Digital Network Nodes / Lines (Indo Digital DNA) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07] stroke-[#1D3582]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="indo-digital-pattern" width="60" height="28" patternUnits="userSpaceOnUse">
              <path d="M 0 14 Q 15 0 30 14 T 60 14" fill="none" strokeWidth="1" />
              <circle cx="15" cy="7" r="1.5" fill="#00A3E0" />
              <circle cx="45" cy="21" r="1.5" fill="#F58220" />
              <line x1="15" y1="7" x2="30" y2="14" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="30" y1="14" x2="45" y2="21" strokeWidth="0.8" strokeDasharray="2,2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#indo-digital-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2.5 text-xs">
        {/* Left: Badges & High-Contrast Pricing Hierarchy */}
        <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start text-center lg:text-left">
          {/* Badge 1: FLASH SALE HEMAT 1.3 JT (Navy + Orange Fire) */}
          <span className="inline-flex items-center gap-1.5 bg-[#1D3582] text-white font-extrabold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs border border-[#2D4DA7]">
            <Flame className="w-3.5 h-3.5 fill-[#F58220] text-[#F58220] animate-pulse" />
            FLASH SALE HEMAT 1.3 JT
          </span>

          {/* Badge 2: PESAN SEKARANG, BAYAR SETELAH JADI (Soft Cyan/Navy Pill) */}
          <span className="inline-flex items-center gap-1.5 bg-[#EBF5FB] text-[#1D3582] font-black text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs border border-[#BAE6FD]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00A3E0]" />
            PESAN SEKARANG, BAYAR SETELAH JADI
          </span>

          {/* Headline: PROMO TERBATAS: Rp 1.8 Juta -> CUMA RP 499.000! */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="font-extrabold text-[#1D3582] tracking-tight text-xs sm:text-sm">
              PROMO TERBATAS:
            </span>

            {/* Dark/Clear Strikethrough Box on White */}
            <span className="inline-flex items-center bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              <span className="line-through text-slate-500 decoration-[#EA580C] decoration-[2.5px] text-xs sm:text-sm font-bold">
                Rp 1.8 Juta
              </span>
            </span>

            {/* Cyan Arrow */}
            <span className="text-[#00A3E0] font-black text-sm">➔</span>

            {/* Highlighted Promo Price in Brand Orange/Gold */}
            <span className="text-[#EA580C] text-sm sm:text-base font-black underline decoration-[#F58220] underline-offset-2 tracking-tight">
              CUMA RP 499.000!
            </span>
          </div>

          {/* Optional Extra Saving Benefit Tag */}
          <span className="hidden xl:inline-flex items-center bg-sky-50 text-[#0369A1] px-2 py-0.5 rounded-full text-[10.5px] font-bold border border-sky-200">
            (HEMAT RP 1.301.000 + FREE DOMAIN 1 TAHUN)
          </span>
        </div>

        {/* Right: Navy Countdown & Brand Orange Action CTA */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto">
          {/* Countdown Container (Dark Navy with Glowing Amber/White Digits) */}
          <div className="flex items-center gap-1.5 bg-[#0F2454] px-2 sm:px-2.5 py-1 rounded-lg border border-[#1D3582] shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-black text-[#7DD3FC] uppercase tracking-wider">
              BERAKHIR:
            </span>
            <div className="flex items-center gap-1 font-mono text-xs font-black">
              <span className="bg-[#1D3582] text-yellow-300 px-1.5 py-0.5 rounded shadow-xs border border-[#3052B3]">
                {pad(hours)}
              </span>
              <span className="text-[#38BDF8] font-bold">:</span>
              <span className="bg-[#1D3582] text-yellow-300 px-1.5 py-0.5 rounded shadow-xs border border-[#3052B3]">
                {pad(minutes)}
              </span>
              <span className="text-[#38BDF8] font-bold">:</span>
              <span className="bg-[#1D3582] text-amber-400 px-1.5 py-0.5 rounded shadow-xs border border-[#3052B3] animate-pulse">
                {pad(seconds)}
              </span>
            </div>
          </div>

          {/* Prominent CTA Button with Indo Digital Orange-Gold Gradient */}
          <button
            onClick={scrollToOrder}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-black bg-gradient-to-r from-[#F58220] via-[#FA8C16] to-[#E65100] hover:from-[#EA580C] hover:to-[#D96B00] text-white rounded-lg shadow-sm hover:shadow-md hover:shadow-orange-500/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <span>AMBIL PROMO RP 499RB</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
