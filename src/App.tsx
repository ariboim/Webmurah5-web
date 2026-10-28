import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TopFlashSaleBar } from './components/TopFlashSaleBar';
import { Navbar, PageTab } from './components/Navbar';
import { AnimatedMarqueeBanner } from './components/AnimatedMarqueeBanner';
import { HeroSection } from './components/HeroSection';
import { LiveActivityTicker } from './components/LiveActivityTicker';
import { TrustBadgesSection } from './components/TrustBadgesSection';
import { VideoLandingPageSection } from './components/VideoLandingPageSection';
import { UmkmBenefitsSection } from './components/UmkmBenefitsSection';
import { UmkmShowcaseSection } from './components/UmkmShowcaseSection';
import { PricingSection } from './components/PricingSection';
import { OrderFlowSection } from './components/OrderFlowSection';
import { OrderFormSection } from './components/OrderFormSection';
import { OrderPageSection } from './components/OrderPageSection';
import { ContactPageSection } from './components/ContactPageSection';
import { ArticlesPageSection } from './components/ArticlesPageSection';
import { KemitraanPageSection } from './components/KemitraanPageSection';
import { PanduanAgenSection } from './components/PanduanAgenSection';
import { AdminDashboard } from './components/AdminDashboard';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { FloatingShare } from './components/FloatingShare';
import { BackToTop } from './components/BackToTop';
import { PromoModal } from './components/PromoModal';
import { ReplikaPartnerBanner } from './components/ReplikaPartnerBanner';
import { MitraAccount } from './types/mitra';
import { findMitraBySlug, trackReferralVisit } from './utils/mitraStorage';
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  FileEdit,
  PhoneCall,
  ShieldCheck,
  Tag,
  Lock,
  Briefcase,
  GraduationCap,
  AlertCircle,
  X,
  ExternalLink,
  Globe,
  UserCheck,
} from 'lucide-react';
import { ADMIN_WA_NUMBER, ADMIN_WA_DISPLAY } from './types/order';

export default function App() {
  const detectReplicaSlug = (): string | null => {
    try {
      const hash = window.location.hash || '';
      const path = window.location.pathname || '';
      const search = window.location.search || '';

      // Match /reff/:slug in pathname
      const pathMatch = path.match(/\/reff\/([a-zA-Z0-9_-]+)/i);
      if (pathMatch && pathMatch[1]) return pathMatch[1].toLowerCase();

      // Match #/reff/:slug or #reff/:slug in hash
      const hashMatch = hash.match(/#\/?reff\/([a-zA-Z0-9_-]+)/i);
      if (hashMatch && hashMatch[1]) return hashMatch[1].toLowerCase();

      // Match query ?ref=:slug or ?reff=:slug
      const urlParams = new URLSearchParams(search);
      const queryRef = urlParams.get('ref') || urlParams.get('reff');
      if (queryRef) return queryRef.toLowerCase();

      return null;
    } catch {
      return null;
    }
  };

  const getTabFromHash = (): PageTab => {
    const hash = (window.location.hash || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();

    // If it's pure replica route, default to home tab
    if (hash.includes('reff/') || path.includes('/reff/')) {
      return 'home';
    }

    const isMatch = (keys: string[]) =>
      keys.some((k) => hash.includes(k) || search.includes(k) || path.includes('/' + k));

    if (isMatch(['admin', 'login-admin', 'dashboard'])) return 'admin';
    if (isMatch(['panduan', 'panduan-agen', 'agen', 'mt', 'training', 'sertifikasi'])) return 'panduan-agen';
    if (isMatch(['kemitraan', 'mitra', 'partnership'])) return 'kemitraan';
    if (isMatch(['artikel', 'article', 'blog'])) return 'artikel';
    if (isMatch(['order', 'pesan', 'formulir'])) return 'order';
    if (isMatch(['kontak', 'contact', 'hubungi'])) return 'kontak';
    return 'home';
  };

  const [activeTab, setActiveTab] = useState<PageTab>(getTabFromHash);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [fallbackWarning, setFallbackWarning] = useState<string | null>(null);

  // Active replica partner state
  const [activeReplikaPartner, setActiveReplikaPartner] = useState<MitraAccount | null>(() => {
    const slug = detectReplicaSlug();
    if (slug) {
      const partner = findMitraBySlug(slug);
      if (partner && partner.status === 'APPROVED') {
        trackReferralVisit(partner.slug);
        return partner;
      }
    }
    return null;
  });

  // Sync with browser hash / history (back/forward button & direct URL access)
  useEffect(() => {
    const handleUrlChange = () => {
      setActiveTab(getTabFromHash());
      const slug = detectReplicaSlug();
      if (slug) {
        const partner = findMitraBySlug(slug);
        if (partner) {
          if (partner.status === 'APPROVED') {
            setActiveReplikaPartner(partner);
            trackReferralVisit(partner.slug);
            setFallbackWarning(null);
          } else {
            setActiveReplikaPartner(null);
            setFallbackWarning(
              `Mitra rujukan "${slug}" berstatus ${partner.status === 'PENDING_APPROVAL' ? 'MENUNGGU PERSETUJUAN ADMIN' : 'DIBLOKIR/TIDAK AKTIF'}. Anda dialihkan ke landing page utama.`
            );
          }
        } else {
          setActiveReplikaPartner(null);
          setFallbackWarning(
            `Tautan Web Replika "/reff/${slug}" tidak ditemukan. Anda dialihkan ke landing page utama resmi PT INOVASI TEKNOLOGI DIGITAL INDONESIA.`
          );
        }
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);

    const handleCustomOpenReplica = (e: any) => {
      if (e.detail) {
        const partner = findMitraBySlug(e.detail);
        if (partner && partner.status === 'APPROVED') {
          setActiveReplikaPartner(partner);
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('open-replica-partner', handleCustomOpenReplica);

    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('open-replica-partner', handleCustomOpenReplica);
    };
  }, []);

  // Show promo pop-up overlay on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const alreadyDismissed = sessionStorage.getItem('promo_banner_dismissed') === 'true';
        if (!alreadyDismissed) {
          setIsPromoModalOpen(true);
        }
      } catch {
        setIsPromoModalOpen(true);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Listen to open-promo-modal event
  useEffect(() => {
    const handleOpenPromo = () => setIsPromoModalOpen(true);
    window.addEventListener('open-promo-modal', handleOpenPromo);
    return () => window.removeEventListener('open-promo-modal', handleOpenPromo);
  }, []);

  // Listen to custom navigation events from buttons across components
  useEffect(() => {
    const handleCustomNavigate = (e: CustomEvent<PageTab>) => {
      if (e.detail) {
        handleTabChange(e.detail);
      }
    };
    window.addEventListener('navigate-tab' as any, handleCustomNavigate);
    return () => window.removeEventListener('navigate-tab' as any, handleCustomNavigate);
  }, []);

  const handleTabChange = (tab: PageTab) => {
    setActiveTab(tab);
    window.location.hash = '#/' + tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClaimPromo = () => {
    try {
      sessionStorage.setItem('promo_50_active', 'true');
      sessionStorage.setItem('promo_banner_dismissed', 'true');
    } catch {}
    window.dispatchEvent(new CustomEvent('promo-50-claimed'));

    if (activeTab === 'artikel' || activeTab === 'kontak') {
      handleTabChange('order');
    }

    setTimeout(() => {
      const formEl = document.getElementById('form-order') || document.getElementById('formulir-order');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 250);
  };

  const handleClosePromo = () => {
    setIsPromoModalOpen(false);
    try {
      sessionStorage.setItem('promo_banner_dismissed', 'true');
    } catch {}
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden relative bg-white text-slate-900 flex flex-col font-sans selection:bg-sky-200 selection:text-sky-900">
      {/* Top Flash Sale Countdown Urgency Bar */}
      <TopFlashSaleBar />

      {/* Dynamic Web Replika Partner Profile Banner (If visiting via /reff/:namamitra) */}
      {activeReplikaPartner && (
        <ReplikaPartnerBanner
          partner={activeReplikaPartner}
          onNavigateToOrder={() => {
            handleTabChange('order');
            setTimeout(() => {
              const el = document.getElementById('form-order') || document.getElementById('formulir-order');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 250);
          }}
          onExitReplica={() => {
            setActiveReplikaPartner(null);
            window.location.hash = '#/home';
          }}
        />
      )}

      {/* Fallback Notification Toast if referral link was invalid or pending */}
      {fallbackWarning && (
        <div className="bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-bold flex items-center justify-between gap-3 shadow-md border-b border-amber-500 z-50">
          <div className="flex items-center gap-2 max-w-5xl mx-auto min-w-0">
            <AlertCircle className="w-4 h-4 text-slate-950 shrink-0" />
            <span className="truncate">{fallbackWarning}</span>
          </div>
          <button
            type="button"
            onClick={() => setFallbackWarning(null)}
            className="p-1 hover:bg-black/10 rounded-lg text-slate-950 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Light blue navbar with 3 Navigation Tabs: Home, Form Order, Kontak Kami */}
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Animated Vibrant Marquee Banner */}
      <AnimatedMarqueeBanner />


      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* ================= PAGE 1: HOME (BERANDA) ================= */}
        {activeTab === 'home' && (
          <div className="space-y-0">
            {/* Hero Section (Immediate entrance animation on top) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeroSection />
            </motion.div>

            {/* Live Activity Ticker (Real-Time Social Proof & Recent Sales) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <LiveActivityTicker />
            </motion.div>

            {/* Official Trust Badges & Guarantee Bar */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <TrustBadgesSection />
            </motion.div>

            {/* Video: 5 Alasan Kenapa Anda Harus Punya Landing Page */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <VideoLandingPageSection />
            </motion.div>

            {/* Benefits & Copywriting for UMKM */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <UmkmBenefitsSection />
            </motion.div>

            {/* Custom UMKM Showcase (8 Industri Interaktif) */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <UmkmShowcaseSection />
            </motion.div>

            {/* Pricing Section (Rp 499.000 all-in, 1 hari, free domain) */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <PricingSection />
            </motion.div>

            {/* 5-Step Order Flow Diagram */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <OrderFlowSection />
            </motion.div>

            {/* Formulir Pemesanan Lengkap dengan Box Cek Ketersediaan Domain Terintegrasi */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <OrderFormSection activePartner={activeReplikaPartner} />
            </motion.div>

            {/* Testimonials from UMKM Owners */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <TestimonialsSection />
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <FaqSection />
            </motion.div>

            {/* Home Bottom Action Navigation Banner */}
            <motion.section
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="py-16 bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white border-t border-slate-800"
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-balance">
                  Siap Naik Kelas & Buka Pintu Penjualan 24 Jam Nonstop?
                </h3>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
                  Jangan tunda lagi. Pilih halaman yang ingin Anda tuju: lengkapi formulir pesanan atau konsultasi gratis dengan Admin WhatsApp kami.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => handleTabChange('order')}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    <FileEdit className="w-4 h-4" />
                    <span>Buka Halaman Form Order (Rp 499rb)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleTabChange('kontak')}
                    className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span>Halaman Kontak Kami</span>
                  </button>

                  <a
                    href={`https://wa.me/${ADMIN_WA_NUMBER}?text=Halo%20Admin%20Indo%20Digital,%20saya%20tertarik%20dengan%20jasa%20landing%20page%20Rp%20499rb.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Chat WhatsApp Admin</span>
                  </a>
                </div>
              </div>
            </motion.section>
          </div>
        )}

        {/* ================= PAGE 2: FORM ORDER (PEMESANAN) ================= */}
        {activeTab === 'order' && (
          <motion.div
            key="order"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <OrderPageSection
              onNavigateToHome={() => handleTabChange('home')}
              onNavigateToContact={() => handleTabChange('kontak')}
              activePartner={activeReplikaPartner}
            />
          </motion.div>
        )}

        {/* ================= PAGE 3: ARTIKEL (KISAH SUKSES UMKM) ================= */}
        {activeTab === 'artikel' && (
          <motion.div
            key="artikel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <ArticlesPageSection
              onNavigateToOrder={() => handleTabChange('order')}
              onNavigateToAdmin={() => handleTabChange('admin')}
            />
          </motion.div>
        )}

        {/* ================= PAGE 4: KEMITRAAN MANDIRI (NON-PKWT) ================= */}
        {activeTab === 'kemitraan' && (
          <motion.div
            key="kemitraan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <KemitraanPageSection
              onNavigateToOrder={() => handleTabChange('order')}
              onNavigateToContact={() => handleTabChange('kontak')}
            />
          </motion.div>
        )}

        {/* ================= PAGE 5: PANDUAN AGEN (MT) - PORTAL SERTIFIKASI ================= */}
        {activeTab === 'panduan-agen' && (
          <motion.div
            key="panduan-agen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <PanduanAgenSection
              onNavigateToOrder={() => handleTabChange('order')}
              onNavigateToContact={() => handleTabChange('kontak')}
            />
          </motion.div>
        )}

        {/* ================= PAGE 6: KONTAK KAMI (HUBUNGI KAMI) ================= */}
        {activeTab === 'kontak' && (
          <motion.div
            key="kontak"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <ContactPageSection
              onNavigateToOrder={() => handleTabChange('order')}
            />
          </motion.div>
        )}

        {/* ================= PAGE 6: ADMIN DASHBOARD (INPUT BLOG & ARTIKEL) ================= */}
        {activeTab === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <AdminDashboard
              onNavigateToHome={() => handleTabChange('home')}
              onNavigateToPublicArticles={() => handleTabChange('artikel')}
            />
          </motion.div>
        )}
      </main>

      {/* Quick Test Toolbar for Web Replika & Referral Tracking */}
      <aside aria-label="Demo Bar Pengujian Web Replika" className="bg-slate-900 border-t border-cyan-500/30 text-white py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-black text-cyan-300 uppercase tracking-wider text-[11px]">
              Simulasi Web Replika (/reff/:namamitra):
            </span>
            {activeReplikaPartner ? (
              <span className="text-[10px] bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 px-2 py-0.5 rounded-full font-bold">
                Aktif: {activeReplikaPartner.namaLengkap}
              </span>
            ) : (
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                Mode: Web Utama Standar
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveReplikaPartner(null);
                handleTabChange('home');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                !activeReplikaPartner && activeTab === 'home'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🌐 Web Utama
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/reff/prima-aldino';
                const p = findMitraBySlug('prima-aldino');
                if (p) setActiveReplikaPartner(p);
                setActiveTab('home');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeReplikaPartner?.slug === 'prima-aldino'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
              }`}
            >
              ⭐ /reff/prima-aldino
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/reff/padilah-ramadhan';
                const p = findMitraBySlug('padilah-ramadhan');
                if (p) setActiveReplikaPartner(p);
                setActiveTab('home');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeReplikaPartner?.slug === 'padilah-ramadhan'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
              }`}
            >
              ⭐ /reff/padilah-ramadhan
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/reff/siti-rahmawati';
                // Trigger fallback since Siti is PENDING
                setActiveReplikaPartner(null);
                setFallbackWarning(
                  'Mitra rujukan "siti-rahmawati" berstatus MENUNGGU PERSETUJUAN ADMIN. Anda otomatis dialihkan ke halaman utama tanpa penanda referal.'
                );
                setActiveTab('home');
              }}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-600/50 hover:bg-amber-900 transition-all cursor-pointer"
              title="Uji coba fallback jika mitra belum di-approve"
            >
              ⚠️ Uji Fallback (Siti - Pending)
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('kemitraan')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-sky-300 hover:bg-slate-700 transition-all cursor-pointer"
            >
              👤 Dashboard Mitra
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-indigo-300 hover:bg-slate-700 transition-all cursor-pointer"
            >
              🛡️ Admin (Tabel Replika)
            </button>
          </div>
        </div>
      </aside>

      {/* Footer with 3 navtabs support */}
      <Footer onTabChange={handleTabChange} />

      {/* Floating WhatsApp Quick Action (Dynamically routed to partner if on replica page) */}
      <FloatingWhatsApp partner={activeReplikaPartner} />

      {/* Floating Web Share Button (WhatsApp, Telegram, Email, Sosmed) */}
      <FloatingShare />

      {/* Floating Promo 50% Badge Trigger (Clickable anytime) */}
      <button
        type="button"
        onClick={() => setIsPromoModalOpen(true)}
        className="fixed bottom-5 left-4 z-40 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-[11px] sm:text-xs shadow-xl border border-white/70 flex items-center gap-1.5 transform hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-amber-300/60"
        title="Buka Promo Diskon 50%"
        aria-label="Buka Banner Promo Diskon 50%"
      >
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current animate-pulse" />
        <span>Diskon 50%</span>
      </button>

      {/* Floating Back to Top Button (appears after 400px scroll) */}
      <BackToTop />

      {/* Promo 50% Pop-up Floating Overlay Banner with 3s Delay Close Button */}
      <PromoModal
        isOpen={isPromoModalOpen}
        onClose={handleClosePromo}
        onClaimPromo={handleClaimPromo}
        bannerSrc="/assets/aistudio/1792751270454_463fdeff.jpg"
      />
    </div>
  );
}
