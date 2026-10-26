import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, ArrowRight } from 'lucide-react';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimPromo: () => void;
  bannerSrc?: string;
}

export const PromoModal: React.FC<PromoModalProps> = ({
  isOpen,
  onClose,
  onClaimPromo,
  bannerSrc = '/assets/aistudio/1792751270454_463fdeff.jpg',
}) => {
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isOpen) return;

    // Reset timer state when modal opens
    setCanClose(false);
    setCountdown(3);

    const intervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBannerClick = () => {
    onClaimPromo();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Promo Diskon 50% Khusus Hari Ini"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in transition-all overflow-y-auto"
    >
      {/* Click outside to close (only when canClose is true) */}
      <div
        className="fixed inset-0"
        onClick={() => {
          if (canClose) onClose();
        }}
      />

      <div className="relative w-full max-w-sm sm:max-w-md my-auto bg-gradient-to-b from-[#0F1E3D] via-[#122347] to-[#0A1428] rounded-3xl p-2 sm:p-3 shadow-2xl border-2 border-amber-400/80 transform transition-all animate-scale-up select-none">
        
        {/* Glow halo */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 opacity-30 blur-xl pointer-events-none" />

        {/* Top Header Floating Badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap z-20 border border-white/50">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>PROMO SPESIAL FLASH SALE HARI INI</span>
        </div>

        {/* Close Button 'X' with 3-second delay constraint */}
        <div className="absolute top-4 right-4 z-30">
          {canClose ? (
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-900/90 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg border border-white/30 transition-all transform hover:scale-110 active:scale-95 cursor-pointer group"
              aria-label="Tutup Banner Promo"
              title="Tutup (Lihat Website)"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </button>
          ) : (
            <div className="px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-300 text-[10px] font-bold border border-amber-400/40 flex items-center gap-1 backdrop-blur-xs shadow-md">
              <Clock className="w-3 h-3 animate-spin" />
              <span>Tutup ({countdown}s)</span>
            </div>
          )}
        </div>

        {/* Clickable Vertical Promo Banner Container */}
        <div
          onClick={handleBannerClick}
          className="relative rounded-2xl overflow-hidden cursor-pointer group transition-all"
        >
          {/* Banner Image */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900">
            <img
              src={bannerSrc}
              alt="Dapatkan Diskon 50% untuk Order Hari Ini - Indo Digital Solution"
              className="w-full h-auto max-h-[72vh] sm:max-h-[78vh] object-contain mx-auto transition-transform duration-500 group-hover:scale-102"
              loading="eager"
            />
            {/* Subtle animated overlay shine */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Bottom Interactive Claim Bar */}
          <div className="absolute bottom-2 left-2 right-2 p-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-xl shadow-xl text-center text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 group-hover:from-yellow-400 group-hover:to-amber-400 transition-all border border-white/40 transform group-hover:-translate-y-0.5">
            <span>KLIK UNTUK KLAIM DISKON 50% &amp; ORDER SEKARANG</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Micro Notice Below Banner */}
        <div className="pt-2 pb-1 text-center text-[10px] sm:text-[11px] text-amber-200/90 font-medium flex items-center justify-center gap-2">
          <span>⚡ Kuota promo terbatas untuk hari ini</span>
          <span>&bull;</span>
          <span className="font-bold text-white">Rp 499.000 &rarr; Rp 249.000</span>
        </div>

      </div>
    </div>
  );
};
