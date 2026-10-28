import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, ShieldCheck } from 'lucide-react';
import { ADMIN_WA_NUMBER, ADMIN_WA_DISPLAY } from '../types/order';
import { trackWhatsAppClick } from '../utils/analytics';
import { MitraAccount } from '../types/mitra';

interface FloatingWhatsAppProps {
  partner?: MitraAccount | null;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ partner }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    // 1-second delay before entrance animation triggers
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Compute recipient WhatsApp & message
  const isReplicaMode = !!partner && partner.status === 'APPROVED';
  const targetWaNumber = isReplicaMode
    ? partner.phoneInternational || partner.noHpWa.replace(/\D/g, '')
    : ADMIN_WA_NUMBER;

  const targetWaDisplay = isReplicaMode
    ? partner.namaLengkap
    : ADMIN_WA_DISPLAY;

  const defaultMessage = isReplicaMode
    ? encodeURIComponent(
        `Halo ${partner.namaLengkap}, saya tertarik dengan layanan di webmurah.biz.id dan ingin konsultasi pembuatan landing page bisnis.`
      )
    : encodeURIComponent('Halo Admin Webkilat, saya mau konsultasi jasa landing page 1 hari Rp 499rb.');

  const waHref = `https://wa.me/${targetWaNumber}?text=${defaultMessage}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.2, y: 60 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{ opacity: 0, scale: 0.5, y: 30 }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 18,
            mass: 0.9,
          }}
          className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2"
        >
          {/* Notification bubble with a delayed spring entrance */}
          {!minimized && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl shadow-xl text-xs border ${
                isReplicaMode
                  ? 'bg-slate-900 text-white border-cyan-400/50 shadow-cyan-900/20'
                  : 'bg-white text-slate-800 border-emerald-100'
              }`}
            >
              <span className="flex h-2.5 w-2.5 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isReplicaMode ? 'bg-cyan-400' : 'bg-emerald-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isReplicaMode ? 'bg-cyan-500' : 'bg-emerald-500'
                }`}></span>
              </span>

              {isReplicaMode ? (
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    Konsultan Resmi: <strong className="text-cyan-300 font-bold">{partner.namaLengkap}</strong>
                  </span>
                </div>
              ) : (
                <span>
                  Butuh bantuan? Chat Admin di <strong>{ADMIN_WA_DISPLAY}</strong>
                </span>
              )}

              <button
                onClick={() => setMinimized(true)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer transition-colors ml-1"
                aria-label="Tutup notifikasi"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {/* Floating WhatsApp Action Button with Bounce */}
          <motion.a
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => trackWhatsAppClick(isReplicaMode ? `replica_${partner.slug}` : 'floating_button')}
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2.5 px-4 py-3 text-white font-bold text-xs rounded-full shadow-2xl transition-all border group ${
              isReplicaMode
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 border-cyan-300/40 shadow-emerald-500/30'
                : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 border-emerald-400/30 hover:shadow-emerald-500/30'
            }`}
            title={`Chat WhatsApp ${targetWaDisplay}`}
          >
            <span className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
              <MessageCircle className="w-5 h-5 fill-white text-emerald-600 group-hover:rotate-12 transition-transform" />
            </span>
            <span className="hidden sm:inline tracking-wide">
              {isReplicaMode ? `Chat WA Konsultan (${partner.namaLengkap})` : `WhatsApp Admin (${ADMIN_WA_DISPLAY})`}
            </span>
            <span className="sm:hidden">
              {isReplicaMode ? 'Chat Konsultan' : 'Chat WA'}
            </span>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
