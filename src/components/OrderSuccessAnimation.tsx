import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  MessageCircle,
  Copy,
  CheckCheck,
  X,
  ExternalLink,
  ShieldCheck,
  Clock,
  Globe,
  Zap,
} from 'lucide-react';
import {
  OrderFormData,
  ADMIN_WA_DISPLAY,
  generateWhatsAppUrl,
  formatOrderToWhatsApp,
} from '../types/order';
import { MitraAccount } from '../types/mitra';

interface OrderSuccessAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  formData: OrderFormData;
  isPromoActive: boolean;
  selectedPackage: 'umkm' | 'elite';
  orderCode?: string;
  partner?: MitraAccount | null;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
  color: string;
  rotation: number;
  shape: 'circle' | 'square' | 'star' | 'strip';
  delay: number;
  duration: number;
}

export const OrderSuccessAnimation: React.FC<OrderSuccessAnimationProps> = ({
  isOpen,
  onClose,
  formData,
  isPromoActive,
  selectedPackage,
  orderCode,
  partner,
}) => {
  const [copied, setCopied] = useState(false);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  // Generate fallback order ID if not provided
  const generatedCode = useMemo(() => {
    if (orderCode) return orderCode;
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `WM-${dateStr}-${rand}`;
  }, [orderCode]);

  // Generate confetti burst particles
  const particles = useMemo<Particle[]>(() => {
    const colors = [
      '#10B981', // emerald
      '#06B6D4', // cyan
      '#F59E0B', // amber
      '#3B82F6', // blue
      '#EC4899', // pink
      '#8B5CF6', // violet
      '#14B8A6', // teal
      '#F43F5E', // rose
    ];
    const shapes: ('circle' | 'square' | 'star' | 'strip')[] = ['circle', 'square', 'star', 'strip'];

    const items: Particle[] = [];
    const count = 38;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 360 + (Math.random() * 15 - 7.5);
      const rad = (angle * Math.PI) / 180;
      const distance = 90 + Math.random() * 130;
      const x = Math.cos(rad) * distance;
      const y = Math.sin(rad) * distance;

      items.push({
        id: i,
        x,
        y,
        scale: 0.6 + Math.random() * 0.7,
        color: colors[i % colors.length],
        rotation: Math.random() * 360,
        shape: shapes[i % shapes.length],
        delay: 0.15 + Math.random() * 0.12,
        duration: 0.8 + Math.random() * 0.4,
      });
    }
    return items;
  }, []);

  // Soft celebratory chime using Web Audio API
  useEffect(() => {
    if (isOpen && !hasPlayedSound) {
      setHasPlayedSound(true);
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
          const playNote = (freq: number, start: number, duration: number, volume: number = 0.15) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
            gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
            gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + start);
            osc.stop(ctx.currentTime + start + duration);
          };

          // Joyful 4-note ascending chord progression (C5 -> E5 -> G5 -> C6)
          playNote(523.25, 0.05, 0.35, 0.15); // C5
          playNote(659.25, 0.18, 0.35, 0.16); // E5
          playNote(783.99, 0.32, 0.45, 0.18); // G5
          playNote(1046.5, 0.48, 0.7, 0.2); // C6
        }
      } catch {
        // Safe fallback if audio is blocked by user browser policy
      }
    }
    if (!isOpen) {
      setHasPlayedSound(false);
    }
  }, [isOpen, hasPlayedSound]);

  const handleCopy = () => {
    const text = formatOrderToWhatsApp(formData, isPromoActive, partner);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const finalPriceLabel =
    selectedPackage === 'elite'
      ? 'Rp 3.000.000 (DP 50% Rp 1.500.000)'
      : isPromoActive
      ? 'Rp 249.000 (Promo Terkunci)'
      : 'Rp 499.000 (Bayar Setelah Jadi)';

  const packageName =
    selectedPackage === 'elite'
      ? 'Paket Elite (Web Custom Multi-Halaman)'
      : 'Paket UMKM Kilat (Landing Page 1 Halaman)';

  const waUrl = generateWhatsAppUrl(formData, isPromoActive, partner);
  const partnerPhone = partner ? (partner.noHpWa || (partner as { phoneInternational?: string }).phoneInternational || '') : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Blur & Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 25 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 24,
              mass: 0.9,
            }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8"
          >
            {/* Top decorative gradient bar */}
            <div className="h-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer z-20"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Content */}
            <div className="p-6 sm:p-8 text-center space-y-6">
              {/* LOTTIE-STYLE ANIMATED BADGE & PARTICLES */}
              <div className="relative flex items-center justify-center pt-2 pb-2">
                {/* Expanding Concentric Ripple Shockwaves */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0.8 }}
                  animate={{ scale: [0.7, 1.8], opacity: [0.7, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  className="absolute w-28 h-28 rounded-full bg-emerald-400/30 pointer-events-none"
                />
                <motion.div
                  initial={{ scale: 0.7, opacity: 0.8 }}
                  animate={{ scale: [0.7, 2.2], opacity: [0.6, 0] }}
                  transition={{
                    duration: 2,
                    delay: 0.45,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  className="absolute w-28 h-28 rounded-full bg-teal-400/25 pointer-events-none"
                />

                {/* Confetti Explosion Burst */}
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                    animate={{
                      x: p.x,
                      y: p.y,
                      scale: [0, p.scale, 0],
                      opacity: [1, 1, 0],
                      rotate: p.rotation + 360,
                    }}
                    transition={{
                      duration: p.duration,
                      delay: p.delay,
                      ease: [0.2, 0.8, 0.2, 1],
                    }}
                    style={{
                      backgroundColor: p.color,
                      position: 'absolute',
                      pointerEvents: 'none',
                    }}
                    className={
                      p.shape === 'circle'
                        ? 'w-2.5 h-2.5 rounded-full'
                        : p.shape === 'star'
                        ? 'w-2 h-2 rotate-45 rounded-2xs'
                        : p.shape === 'strip'
                        ? 'w-3 h-1 rounded-full'
                        : 'w-2 h-2 rounded-xs'
                    }
                  />
                ))}

                {/* Central Bouncing Glowing Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: [0, 1.18, 1], rotate: [0, 8, 0] }}
                  transition={{
                    type: 'spring',
                    stiffness: 340,
                    damping: 18,
                    delay: 0.08,
                  }}
                  className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/35 border-4 border-white"
                >
                  {/* Subtle inner glow pulse */}
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse pointer-events-none" />

                  {/* Dynamic SVG Checkmark Stroke Draw Animation */}
                  <svg
                    viewBox="0 0 50 50"
                    className="w-13 h-13 text-white drop-shadow-md"
                    fill="none"
                    stroke="currentColor"
                  >
                    <motion.path
                      d="M13 26 L22 35 L37 16"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        duration: 0.65,
                        delay: 0.28,
                        ease: 'easeOut',
                      }}
                    />
                  </svg>
                </motion.div>
              </div>

              {/* Title & Instant Confirmation */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="space-y-1.5"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Pesanan Berhasil Disiapkan!</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Formulir Diterima Tim Kami
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
                  Langkah terakhir: Hubungkan langsung ke WhatsApp tim teknis kami untuk konfirmasi dan proses pembuatan kilat!
                </p>
              </motion.div>

              {/* Order Reference & Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/90 text-left space-y-3"
              >
                {/* Order Code Row */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Kode Referensi Pesanan
                    </span>
                    <div className="font-mono font-black text-sm text-slate-900">
                      {generatedCode}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <Clock className="w-3 h-3" />
                    <span>{selectedPackage === 'elite' ? '5 - 7 Hari' : 'Pengerjaan 24 Jam'}</span>
                  </span>
                </div>

                {/* Brief Details Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold">Nama Bisnis / Brand</span>
                    <span className="font-bold text-slate-900 truncate block">
                      {formData.namaBisnis || formData.namaLengkap || 'Pemesan'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold">Domain Dipilih</span>
                    <span className="font-bold text-sky-700 truncate block flex items-center gap-1">
                      <Globe className="w-3 h-3 shrink-0" />
                      <span>{formData.domainPilihan || 'Belum dipilih'}</span>
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block text-[10px] font-semibold">Paket Layanan</span>
                      <span className="font-bold text-slate-900 text-[11px]">{packageName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px] font-semibold">Biaya</span>
                      <span className="font-black text-emerald-700 text-xs sm:text-sm">{finalPriceLabel}</span>
                    </div>
                  </div>

                  {partner && (
                    <div className="col-span-2 pt-2 border-t border-emerald-200/80 bg-emerald-50/80 p-2.5 rounded-xl space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-emerald-800">
                        <span>Konsultan Sales Pendamping:</span>
                        <span className="text-emerald-700 font-bold">Terverifikasi Resmi</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-900">
                          {partner.namaLengkap} ({partner.id})
                        </span>
                        <span className="font-mono text-emerald-800 text-[11px] font-bold">
                          {partnerPhone}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Guarantees Mini Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                <div className="flex items-center gap-2 bg-emerald-50/70 p-2 rounded-xl border border-emerald-200/70">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-emerald-950 text-[11px]">Garansi Puas &amp; Revisi</span>
                </div>
                <div className="flex items-center gap-2 bg-sky-50/70 p-2 rounded-xl border border-sky-200/70">
                  <Zap className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="font-semibold text-sky-950 text-[11px]">Prioritas Antrian Aktif</span>
                </div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.35 }}
                className="space-y-2.5 pt-1"
              >
                {/* Primary CTA: WhatsApp */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>
                    {partner
                      ? `Kirim & Chat Konsultan (${partner.namaLengkap}) via WA`
                      : 'Kirim & Chat Tim via WhatsApp'}
                  </span>
                  <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
                </a>

                {/* Secondary Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                        <span>Salin Rincian Pesanan</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>

              {/* Assistance reminder */}
              {partner ? (
                <p className="text-[11px] text-emerald-900 pt-1 font-medium">
                  Terhubung ke WhatsApp Konsultan: <strong className="font-bold text-emerald-950">{partner.namaLengkap}</strong> ({partnerPhone}) &bull; CS Admin: {ADMIN_WA_DISPLAY}
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 pt-1">
                  WhatsApp resmi Customer Support: <span className="font-bold text-slate-700">{ADMIN_WA_DISPLAY}</span>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrderSuccessAnimation;
