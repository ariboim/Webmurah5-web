import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, X, Copy, Check, ExternalLink, Mail } from 'lucide-react';

export const FloatingShare: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // Check Web Share API capability & clean up static HTML fallback
  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
    const staticBtn = document.getElementById('static-floating-share');
    if (staticBtn) {
      staticBtn.remove();
    }
  }, []);

  // Official canonical URL & message - strictly https://webmurah.biz.id (no dev url/tokens)
  const OFFICIAL_SHARE_URL = 'https://webmurah.biz.id';
  const OFFICIAL_SHARE_MESSAGE = 'Garansi Resmi 1 Hari Selesai (24 Jam) & Bayar Setelah Jadi! Jasa landing page UMKM cuma Rp 499rb, cek di https://webmurah.biz.id';

  // Handle native mobile share
  const handleNativeShare = async () => {
    if (canNativeShare) {
      try {
        await navigator.share({
          title: 'Garansi 1 Hari Jadi! Jasa Landing Page UMKM - Indo Digital',
          text: 'Garansi Resmi 1 Hari Selesai & Bayar Setelah Jadi! Jasa landing page UMKM cuma Rp 499rb, cek di',
          url: OFFICIAL_SHARE_URL,
        });
        setIsOpen(false);
      } catch {
        // User cancelled or share failed, fallback to modal
      }
    }
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(OFFICIAL_SHARE_MESSAGE);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = OFFICIAL_SHARE_MESSAGE;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  // Share channels configuration using strict official domain https://webmurah.biz.id
  const shareChannels = [
    {
      name: 'WhatsApp',
      desc: 'Kirim ke chat / grup WA',
      color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
      badgeBg: 'bg-[#25D366]',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(OFFICIAL_SHARE_MESSAGE)}`,
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.586 1.761.88 2.79.88 3.181 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.766-5.767-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.849 0-3.585-.503-5.083-1.381l-6.917 1.812 1.848-6.757c-.987-1.545-1.548-3.364-1.548-5.274 0-5.514 4.486-10 10-10s10 4.486 10 10z" />
        </svg>
      ),
    },
    {
      name: 'Telegram',
      desc: 'Bagikan via Telegram',
      color: 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-200',
      badgeBg: 'bg-[#0088cc]',
      url: `https://t.me/share/url?url=${encodeURIComponent(OFFICIAL_SHARE_URL)}&text=${encodeURIComponent('Garansi Resmi 1 Hari Selesai (24 Jam) & Bayar Setelah Jadi! Jasa landing page UMKM cuma Rp 499rb, cek di')}`,
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
        </svg>
      ),
    },
    {
      name: 'Email',
      desc: 'Kirim via pesan Email',
      color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200',
      badgeBg: 'bg-[#1D3582]',
      url: `mailto:?subject=${encodeURIComponent('Jasa Pembuatan Landing Page UMKM')}&body=${encodeURIComponent(OFFICIAL_SHARE_MESSAGE)}`,
      icon: <Mail className="w-5 h-5 text-white" />,
    },
    {
      name: 'Facebook',
      desc: 'Posting di Beranda FB',
      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
      badgeBg: 'bg-[#1877F2]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(OFFICIAL_SHARE_URL)}&quote=${encodeURIComponent(OFFICIAL_SHARE_MESSAGE)}`,
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'X (Twitter)',
      desc: 'Tweet ke pengikut Anda',
      color: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200',
      badgeBg: 'bg-black',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent('Garansi Resmi 1 Hari Selesai (24 Jam) & Bayar Setelah Jadi! Jasa landing page UMKM cuma Rp 499rb, cek di')}&url=${encodeURIComponent(OFFICIAL_SHARE_URL)}`,
      icon: (
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      desc: 'Bagikan ke jaringan profesional',
      color: 'bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200',
      badgeBg: 'bg-[#0A66C2]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(OFFICIAL_SHARE_URL)}`,
      icon: (
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24M7.86 18.5V10.1H5.07v8.4h2.79z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* 
        FLOATING SHARE BUTTON (RESILIENT - NEVER DISAPPEARS)
        Positioned along the left screen edge with high z-index (9999).
        Includes inline style fallbacks so it renders 100% reliably in any environment.
      */}
      <div
        className="floating-share-btn-wrap fixed left-0 select-none z-[9999]"
        style={{
          position: 'fixed',
          left: 0,
          top: '48%',
          transform: 'translateY(-50%)',
          zIndex: 9999,
        }}
      >
        <button
          type="button"
          id="open-share-modal-btn"
          onClick={() => setIsOpen(true)}
          className="floating-share-btn group flex items-center gap-1.5 py-2.5 px-2.5 sm:px-3 text-white rounded-r-2xl cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #F58220 50%, #EA580C 100%)',
            color: '#FFFFFF',
            borderTopRightRadius: '16px',
            borderBottomRightRadius: '16px',
            borderTopLeftRadius: '0',
            borderBottomLeftRadius: '0',
            border: '1px solid rgba(254, 215, 170, 0.85)',
            borderLeft: 'none',
            boxShadow: '0 4px 18px rgba(245, 130, 32, 0.45), 0 2px 6px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Bagikan Halaman ini (WhatsApp, Telegram, Email, Sosmed)"
          aria-label="Bagikan ke Media Sosial"
        >
          {/* Animated Share Icon with clean contrast badge */}
          <span
            className="relative flex items-center justify-center w-6 h-6 rounded-full bg-slate-950/20 group-hover:bg-slate-950/30 transition-colors shadow-xs"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.22)' }}
          >
            <Share2 className="w-3.5 h-3.5 text-white stroke-[2.5] group-hover:rotate-12 transition-transform" />
          </span>
          {/* Label */}
          <span className="hidden sm:inline-block font-black text-[11px] tracking-wider uppercase text-white drop-shadow-xs">
            Share
          </span>
        </button>
      </div>

      {/* SHARE MODAL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 320, damping: 25 }}
              className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-sky-100 overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-sky-50 via-white to-sky-50 border-b border-sky-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#1D3582] text-white flex items-center justify-center shadow-xs">
                    <Share2 className="w-4 h-4 text-[#00A3E0]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#1D3582] leading-tight">
                      Bagikan ke Media Sosial
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Bantu kenalan UMKM dapat website bayar setelah jadi
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Tutup popup share"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 overflow-y-auto">
                {/* Share Preview Quote Box */}
                <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-3.5 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1D3582]">
                    Format Pesan yang Akan Dibagikan:
                  </span>
                  <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-xl border border-sky-100 leading-relaxed font-medium">
                    &ldquo;{OFFICIAL_SHARE_MESSAGE}&rdquo;
                  </p>
                </div>

                {/* Native Mobile Share Button (if supported) */}
                {canNativeShare && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#1D3582] to-[#00A3E0] hover:from-[#152763] hover:to-[#0284C7] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Buka Pilihan Share di Smartphone</span>
                  </button>
                )}

                {/* Social Share Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {shareChannels.map((channel) => (
                    <a
                      key={channel.name}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${channel.color} group`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg ${channel.badgeBg} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                      >
                        {channel.icon}
                      </span>
                      <div className="text-left overflow-hidden">
                        <div className="font-extrabold text-xs leading-tight truncate">
                          {channel.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate leading-none mt-0.5">
                          {channel.desc}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Copy Link & Full Message Bar */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={OFFICIAL_SHARE_MESSAGE}
                      className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 truncate focus:outline-none select-all"
                    />
                    <button
                      onClick={handleCopy}
                      className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                        copied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#1D3582] hover:bg-[#152763] text-white'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-[11px] text-emerald-600 font-semibold text-center mt-1.5 animate-fadeIn">
                      ✓ Pesan & link berhasil disalin ke clipboard! Siap di-paste ke media sosial manapun.
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400">
                  INDO DIGITAL • Solusi Website UMKM Cepat & Terpercaya
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
