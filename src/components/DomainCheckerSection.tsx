import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Globe,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Loader2,
  ShieldCheck,
  Check,
  Zap,
} from 'lucide-react';

export interface DomainCheckResult {
  domain: string;
  extension: string;
  isAvailable: boolean;
  isFreeWithPromo: boolean;
  badge: string;
  message: string;
}

interface DomainCheckerSectionProps {
  onSelectDomain?: (domain: string) => void;
}

export const DomainCheckerSection: React.FC<DomainCheckerSectionProps> = ({
  onSelectDomain,
}) => {
  const [inputDomain, setInputDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<DomainCheckResult[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const performCheck = async (queryDomain: string) => {
    const trimmed = queryDomain.trim().toLowerCase();
    if (!trimmed) return;

    setIsLoading(true);
    setHasSearched(true);
    setSelectedDomain(null);

    try {
      // 1. Try server backend endpoint
      const response = await fetch(`/api/check-domain?domain=${encodeURIComponent(trimmed)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.results && Array.isArray(data.results)) {
          setResults(data.results);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Fallback to client-side DoH
    }

    // Client-side fallback via Google DNS over HTTPS
    try {
      let clean = trimmed
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '')
        .replace(/\/.*$/, '')
        .replace(/[^a-z0-9.-]/g, '');

      const extensions = ['.my.id', '.biz.id', '.com', '.id'];
      let baseName = clean;
      let specifiedExt = '';

      for (const ext of extensions) {
        if (clean.endsWith(ext)) {
          baseName = clean.slice(0, -ext.length);
          specifiedExt = ext;
          break;
        }
      }

      if (baseName.includes('.')) {
        baseName = baseName.split('.')[0];
      }

      let extList = [...extensions];
      if (specifiedExt) {
        extList = [specifiedExt, ...extensions.filter((e) => e !== specifiedExt)];
      }

      const clientResults: DomainCheckResult[] = await Promise.all(
        extList.map(async (ext) => {
          const fullDomain = `${baseName}${ext}`;
          let isAvailable = false;
          try {
            const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(fullDomain)}&type=NS`, {
              headers: { Accept: 'application/dns-json' },
            });
            if (res.ok) {
              const data = await res.json();
              if (data.Status === 3) {
                isAvailable = true;
              } else if (
                data.Status === 0 &&
                (!data.Answer || data.Answer.length === 0) &&
                (!data.Authority || data.Authority.length === 0)
              ) {
                isAvailable = true;
              } else {
                isAvailable = false;
              }
            } else {
              isAvailable = true;
            }
          } catch {
            isAvailable = true;
          }

          const isFree = ext === '.my.id' || ext === '.biz.id';
          return {
            domain: fullDomain,
            extension: ext,
            isAvailable,
            isFreeWithPromo: isFree,
            badge: isFree ? 'Gratis 1 Tahun Promo' : 'Ekstensi Populer',
            message: isAvailable
              ? `${fullDomain} TERSEDIA! Siap digunakan untuk landing page Anda.`
              : `${fullDomain} sudah dipakai. Coba nama lain ya.`,
          };
        })
      );

      setResults(clientResults);
    } catch {
      // Final fallback
      setResults([
        {
          domain: `${trimmed}.my.id`,
          extension: '.my.id',
          isAvailable: true,
          isFreeWithPromo: true,
          badge: 'Gratis 1 Tahun Promo',
          message: `${trimmed}.my.id TERSEDIA! Siap digunakan untuk landing page Anda.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performCheck(inputDomain);
  };

  const handleSelectAndProceed = (domain: string) => {
    setSelectedDomain(domain);
    // Store in session storage for persistence across reloads/pages
    try {
      sessionStorage.setItem('selected_domain', domain);
    } catch {}

    // Dispatch global custom event for any listeners (e.g., OrderFormSection)
    window.dispatchEvent(new CustomEvent('domain-selected', { detail: domain }));
    window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'order' }));

    if (onSelectDomain) {
      onSelectDomain(domain);
    }

    // Scroll to order form smoothly
    setTimeout(() => {
      const orderElement = document.getElementById('formulir-order');
      if (orderElement) {
        orderElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <section id="cek-domain" className="py-14 bg-gradient-to-b from-sky-50/50 via-white to-slate-50/60 border-y border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black uppercase tracking-wider border border-sky-200 shadow-2xs">
            <Globe className="w-3.5 h-3.5 text-sky-600" />
            <span>Cek Instan Domain Bisnis</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Cek Ketersediaan Nama Domain Anda
          </h2>

          <p className="text-sm text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            Cek instan sebelum order — temukan nama domain yang pas untuk bisnis Anda. Gratis domain <strong className="text-sky-700">.my.id</strong> dan <strong className="text-sky-700">.biz.id</strong> 1 tahun penuh khusus promo Rp 499rb!
          </p>
        </div>

        {/* Main Domain Search Box (Styled matching the user screenshot) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-xl shadow-sky-900/5 relative">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                placeholder="namabisnis.com"
                className="w-full text-base sm:text-xl font-bold text-slate-800 placeholder-slate-400 px-5 py-4 sm:py-5 rounded-2xl bg-white border-2 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none transition-all shadow-inner"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hidden sm:inline">
                .my.id / .biz.id / .com
              </span>
            </div>

            {/* Cyan Search Button matching the image */}
            <button
              type="submit"
              disabled={isLoading || !inputDomain.trim()}
              className="w-full py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 active:scale-99 text-white font-black text-base sm:text-lg tracking-wider uppercase transition-all shadow-lg hover:shadow-sky-500/30 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>MEMERIKSA KETERSEDIAAN...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 stroke-[2.5]" />
                  <span>SEARCH</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Idea Chips */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-bold text-slate-600">Contoh Coba:</span>
            {['kedaiayam', 'hijabcantik', 'sejukac', 'berkahshop'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setInputDomain(sample);
                  performCheck(sample);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 font-medium transition-colors cursor-pointer text-[11px]"
              >
                {sample}.my.id
              </button>
            ))}
          </div>

          {/* Search Results Area */}
          <AnimatePresence>
            {hasSearched && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-6 space-y-3 pt-4 border-t border-slate-100"
              >
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500 px-1">
                  <span>Hasil Pengecekan Domain:</span>
                  <span>Promo All-In Rp 499rb</span>
                </div>

                {results.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      item.isAvailable
                        ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                        : 'bg-rose-50/70 border-rose-200'
                    }`}
                  >
                    {/* Status Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {item.isAvailable ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <span className="text-xs font-black leading-none">✕</span>
                          </div>
                        )}

                        <span className={`text-base sm:text-lg font-black tracking-tight ${
                          item.isAvailable ? 'text-emerald-950' : 'text-rose-900'
                        }`}>
                          {item.domain}
                        </span>

                        {item.isFreeWithPromo && (
                          <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Gratis 1 Tahun
                          </span>
                        )}
                      </div>

                      <p className={`text-xs sm:text-sm pl-8 font-medium ${
                        item.isAvailable ? 'text-emerald-800' : 'text-rose-700'
                      }`}>
                        {item.isAvailable ? (
                          <span>
                            <strong>Domain ini TERSEDIA!</strong> {item.isFreeWithPromo ? 'Termasuk gratis pada paket promo Rp 499.000 all-in.' : 'Dapat digunakan untuk landing page bisnis Anda.'}
                          </span>
                        ) : (
                          <span>
                            <strong>{item.domain}</strong> sudah dipakai. Coba nama lain ya.
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Action Button: Teruskan dengan domain ini (Only when available) */}
                    {item.isAvailable && (
                      <button
                        type="button"
                        onClick={() => handleSelectAndProceed(item.domain)}
                        className="shrink-0 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs sm:text-sm tracking-wide transition-all shadow-md hover:shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Teruskan dengan domain ini</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Selected notification banner */}
                {selectedDomain && (
                  <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      Domain <strong>{selectedDomain}</strong> berhasil dipilih! Anda diarahkan ke Formulir Pemesanan...
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
