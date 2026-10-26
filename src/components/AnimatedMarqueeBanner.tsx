import React from 'react';
import { Sparkles, Zap, Globe, MessageCircle, ShieldCheck, Clock } from 'lucide-react';
import { ADMIN_WA_NUMBER } from '../types/order';

export const AnimatedMarqueeBanner: React.FC = () => {
  const items = [
    { icon: Zap, text: 'PROMO UMKM: HANYA RP 499.000 ALL-IN', highlight: 'HOT PROMO' },
    { icon: Globe, text: 'FREE DOMAIN 1 TAHUN (.MY.ID / .BIZ.ID / .COM)', highlight: 'GRATIS' },
    { icon: Clock, text: 'PENGERJAAN KILAT SELESAI DALAM 24 JAM', highlight: '1 HARI JADI' },
    { icon: Sparkles, text: 'DESAIN 100% KUSTOM SESUAI BRAND ANDA', highlight: 'BUKAN TEMPLATE' },
    { icon: MessageCircle, text: 'LEAD OTOMATIS KE WHATSAPP 0896-7368-6625', highlight: 'SIAP CLOSING' },
    { icon: ShieldCheck, text: 'GARANSI REVISI & PANDUAN PENGGUNAAN LENGKAP', highlight: 'TERPERCAYA' },
  ];

  return (
    <div className="relative bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 text-white overflow-hidden py-2.5 shadow-sm border-b border-sky-400/40 w-full max-w-full">
      {/* Background animated shine */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] animate-[shimmer_3s_infinite] pointer-events-none" />

      {/* Marquee Track */}
      <div className="flex items-center select-none overflow-hidden whitespace-nowrap">
        {/* We repeat the array twice for an endless CSS marquee loop */}
        <div className="flex items-center gap-8 animate-marquee shrink-0">
          {items.concat(items).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                  {item.highlight}
                </span>
                <span className="flex items-center gap-1.5 text-sky-50 tracking-wide">
                  <Icon className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                  {item.text}
                </span>
                <span className="text-white/40 text-sm ml-2">✦</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-8 animate-marquee2 shrink-0" aria-hidden="true">
          {items.concat(items).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                  {item.highlight}
                </span>
                <span className="flex items-center gap-1.5 text-sky-50 tracking-wide">
                  <Icon className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                  {item.text}
                </span>
                <span className="text-white/40 text-sm ml-2">✦</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
