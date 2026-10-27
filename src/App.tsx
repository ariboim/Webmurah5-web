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
import { Sparkles, ArrowRight, MessageCircle, FileEdit, PhoneCall, ShieldCheck, Tag, Lock, Briefcase, GraduationCap } from 'lucide-react';
import { ADMIN_WA_NUMBER, ADMIN_WA_DISPLAY } from './types/order';

export default function App() {
  const getTabFromHash = (): PageTab => {
    const hash = (window.location.hash || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();

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

  // Sync with browser hash / history (back/forward button & direct URL access)
  useEffect(() => {
    const handleUrlChange = () => {
      setActiveTab(getTabFromHash());
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
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
              <OrderFormSection />
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

      {/* Footer with 3 navtabs support */}
      <Footer onTabChange={handleTabChange} />

      {/* Floating WhatsApp Quick Action */}
      <FloatingWhatsApp />

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
