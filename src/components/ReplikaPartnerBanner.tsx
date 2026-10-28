import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  MessageCircle,
  FileEdit,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  UserCheck,
  Phone,
  X,
} from 'lucide-react';
import { MitraAccount } from '../types/mitra';

interface ReplikaPartnerBannerProps {
  partner: MitraAccount;
  onNavigateToOrder: () => void;
  onExitReplica?: () => void;
}

export const ReplikaPartnerBanner: React.FC<ReplikaPartnerBannerProps> = ({
  partner,
  onNavigateToOrder,
  onExitReplica,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const waMessage = encodeURIComponent(
    `Halo ${partner.namaLengkap}, saya tertarik dengan layanan pembuatan landing page di webmurah.biz.id dan ingin konsultasi pembuatan website.`
  );
  const waUrl = `https://wa.me/${partner.phoneInternational || partner.noHpWa.replace(/\D/g, '')}?text=${waMessage}`;

  return (
    <div className="sticky top-0 z-50 w-full shadow-lg">
      {/* Top Identity Strip */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0B1E48] to-[#1D3582] text-white border-b border-cyan-400/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Verified Consultant Badge & Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              {partner.fotoUrl ? (
                <img
                  src={partner.fotoUrl}
                  alt={partner.namaLengkap}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-cyan-400 shadow-cyan-500/30 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-cyan-600/30 border-2 border-cyan-400 flex items-center justify-center font-bold text-cyan-200">
                  {partner.namaLengkap.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center" title="Mitra Terverifikasi">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>KONSULTAN RESMI PT ITDI</span>
                </span>
                <span className="text-[11px] text-slate-300 font-mono hidden sm:inline">
                  ID: {partner.id}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="text-sm sm:text-base font-black text-white tracking-tight truncate">
                  {partner.namaLengkap}
                </h2>
                {partner.kotaDomisili && (
                  <span className="text-xs text-cyan-200/80 font-medium hidden md:inline">
                    &bull; Domisili: {partner.kotaDomisili}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions (Direct WhatsApp & Locked Order CTA) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto sm:ml-0">
            {/* Direct WhatsApp to Mitra with Custom Intro */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer transform hover:scale-102 active:scale-95"
              title={`Chat WhatsApp dengan ${partner.namaLengkap}`}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span className="hidden xs:inline">Chat WA Konsultan</span>
              <span className="xs:hidden">Chat WA</span>
            </a>

            {/* Scroll directly to locked order form */}
            <button
              type="button"
              onClick={onNavigateToOrder}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-black text-xs shadow-md shadow-cyan-400/20 transition-all cursor-pointer transform hover:scale-102 active:scale-95"
            >
              <FileEdit className="w-3.5 h-3.5 text-slate-950" />
              <span>Form Order (Terkunci)</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            {/* Exit Replica Link */}
            {onExitReplica && (
              <button
                type="button"
                onClick={onExitReplica}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors text-xs ml-1"
                title="Keluar dari Web Replika / Lihat Web Utama"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Replica URL Sub-banner Notification */}
        <div className="bg-cyan-950/70 border-t border-cyan-500/20 px-4 py-1 text-center text-[11px] text-cyan-200 font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-cyan-400 shrink-0 animate-pulse" />
          <span>
            Halaman ini adalah <strong>Web Replika Resmi</strong> (<code>/reff/{partner.slug}</code>). Pemesanan Anda otomatis terhubung &amp; didampingi langsung oleh <strong>{partner.namaLengkap}</strong>.
          </span>
        </div>
      </div>
    </div>
  );
};
