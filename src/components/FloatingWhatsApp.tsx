import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';
import { ADMIN_WA_NUMBER, ADMIN_WA_DISPLAY } from '../types/order';
import { trackWhatsAppClick } from '../utils/analytics';

export const FloatingWhatsApp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    // 2-second delay before entrance animation triggers
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
              className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl shadow-xl border border-emerald-100 text-xs text-slate-800"
            >
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Butuh bantuan? Chat Admin di <strong>{ADMIN_WA_DISPLAY}</strong></span>
              <button
                onClick={() => setMinimized(true)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer transition-colors"
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
            onClick={() => trackWhatsAppClick('floating_button')}
            href={`https://wa.me/${ADMIN_WA_NUMBER}?text=Halo%20Admin%20Webkilat,%20saya%20mau%20konsultasi%20jasa%20landing%20page%201%20hari%20Rp%20499rb.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs rounded-full shadow-2xl hover:shadow-emerald-500/30 transition-all border border-emerald-400/30 group"
            title="Chat WhatsApp Admin 089673686625"
          >
            <span className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
              <MessageCircle className="w-5 h-5 fill-white text-emerald-600 group-hover:rotate-12 transition-transform" />
            </span>
            <span className="hidden sm:inline tracking-wide">WhatsApp Admin (0896-7368-6625)</span>
            <span className="sm:hidden">Chat WA</span>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
