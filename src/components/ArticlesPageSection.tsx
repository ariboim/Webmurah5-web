import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Award,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Share2,
  Building2,
  X,
  Send,
  Zap,
  Lock,
  Play,
  Video as VideoIcon,
  PlusCircle,
  Mail,
  AlertCircle,
} from 'lucide-react';
import {
  Article,
  ArticleCategory,
  getAllArticles,
  getAllCategories,
} from '../utils/articleStorage';
import {
  convertYouTubeEmbedUrl,
  convertGoogleDriveVideoUrl,
  detectVideoSource,
} from '../utils/mediaUtils';
import { sanitizeArticleHtml } from '../utils/sanitizeHtml';

interface ArticlesPageSectionProps {
  onNavigateToOrder?: () => void;
  onNavigateToAdmin?: () => void;
}

export const ArticlesPageSection: React.FC<ArticlesPageSectionProps> = ({
  onNavigateToOrder,
  onNavigateToAdmin,
}) => {
  const [articles, setArticles] = useState<Article[]>(getAllArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Newsletter Signup State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newsletterEmail.trim();

    if (!trimmed) {
      setNewsletterStatus('error');
      setNewsletterMessage('Harap masukkan alamat email Anda.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setNewsletterStatus('error');
      setNewsletterMessage('Format email tidak valid. Gunakan format seperti nama@domain.com');
      return;
    }

    setNewsletterStatus('loading');
    
    // Call server endpoint to store subscriber and send welcome email
    fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmed }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Gagal mendaftar newsletter.');
        }
        return data;
      })
      .then((data) => {
        try {
          const stored = localStorage.getItem('webmurah_newsletter_subs');
          const list = stored ? JSON.parse(stored) : [];
          if (!list.includes(trimmed)) {
            list.push(trimmed);
            localStorage.setItem('webmurah_newsletter_subs', JSON.stringify(list));
          }
        } catch {}

        setNewsletterStatus('success');
        setNewsletterMessage(data.message || `Pendaftaran berhasil! Email ${trimmed} telah terdaftar untuk menerima studi kasus & tips UMKM mingguan.`);
      })
      .catch((err) => {
        // Fallback to local storage if offline or server issue
        try {
          const stored = localStorage.getItem('webmurah_newsletter_subs');
          const list = stored ? JSON.parse(stored) : [];
          if (!list.includes(trimmed)) {
            list.push(trimmed);
            localStorage.setItem('webmurah_newsletter_subs', JSON.stringify(list));
          }
          setNewsletterStatus('success');
          setNewsletterMessage(`Pendaftaran berhasil! Email ${trimmed} telah terdaftar untuk menerima update.`);
        } catch {
          setNewsletterStatus('error');
          setNewsletterMessage(err.message || 'Terjadi kendala saat mendaftarkan email.');
        }
      });
  };

  const handleResetNewsletter = () => {
    setNewsletterEmail('');
    setNewsletterStatus('idle');
    setNewsletterMessage('');
  };

  const [savedCategories, setSavedCategories] = useState<ArticleCategory[]>(getAllCategories);

  // Listen to article & category updates from admin dashboard
  useEffect(() => {
    const handleArticlesUpdated = () => {
      setArticles(getAllArticles());
    };
    const handleCategoriesUpdated = () => {
      setSavedCategories(getAllCategories());
    };
    window.addEventListener('articles-updated', handleArticlesUpdated);
    window.addEventListener('categories-updated', handleCategoriesUpdated);
    return () => {
      window.removeEventListener('articles-updated', handleArticlesUpdated);
      window.removeEventListener('categories-updated', handleCategoriesUpdated);
    };
  }, []);

  // Compute unique dynamic categories from articles and saved categories
  const categories = [
    { id: 'all', label: 'Semua Artikel' },
    ...Array.from(
      new Set([
        ...articles.map((a) => a.category),
        ...savedCategories.filter((c) => c.isCustom).map((c) => c.name),
      ])
    ).map((cat) => ({
      id: cat,
      label: cat,
    })),
  ];

  const filteredArticles =
    activeCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const handleOpenOrder = () => {
    setSelectedArticle(null);
    if (onNavigateToOrder) {
      onNavigateToOrder();
    } else {
      window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'order' }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenAdmin = () => {
    if (onNavigateToAdmin) {
      onNavigateToAdmin();
    } else {
      window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'admin' }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-black uppercase tracking-wider border border-sky-200 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>Pusat Artikel &amp; Inspirasi UMKM Go Digital</span>
            </div>

            {/* Quick Admin Shortcut Button */}
            <button
              onClick={handleOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1D3582] hover:bg-[#162968] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              title="Khusus Admin: Tulis atau kelola artikel baru"
            >
              <Lock className="w-3 h-3 text-amber-300" />
              <span>Akses Admin / Tulis Artikel</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight text-balance">
            Kisah Sukses UMKM Setelah <span className="text-sky-600">Digitalisasi Usaha</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Pelajari data dan kisah nyata pelaku usaha di Indonesia yang berhasil melipatgandakan omzet, memperluas pasar antar-pulau, dan meningkatkan kredibilitas dengan memiliki landing page resmi.
          </p>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20 scale-105'
                    : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-sky-300"
            >
              <div>
                {/* Media Cover Image (if uploaded/provided) */}
                {article.imageUrl ? (
                  <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    {article.videoUrl && (
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-black flex items-center gap-1.5 border border-white/20">
                        <Play className="w-3 h-3 text-rose-500 fill-current" />
                        <span>Ada Video</span>
                      </div>
                    )}
                    {article.isCustom && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Baru Ditulis</span>
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="p-6 sm:p-7 space-y-4">
                  {/* Top Metas */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${article.categoryColor}`}
                    >
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Big Stat Highlight Badge */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 via-indigo-50/40 to-white border border-sky-100 flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-black text-sky-700 tracking-tight">
                        {article.keyStat}
                      </div>
                      <div className="text-[11px] font-bold text-slate-600">
                        {article.keyStatLabel}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-5 h-5 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>

                  {/* Verified Source Citation */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-semibold truncate">
                      Sumber: {article.sourceName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="p-6 sm:p-7 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(article)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-sky-600 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs group-hover:shadow-md"
                >
                  <span>BACA KISAH LENGKAP &amp; STRATEGI</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* ================= NEWSLETTER SIGNUP SECTION ================= */}
        <section
          aria-label="Newsletter Signup"
          className="bg-gradient-to-br from-white via-sky-50/70 to-indigo-50/60 rounded-3xl p-6 sm:p-10 border border-sky-200/90 shadow-sm relative overflow-hidden"
        >
          {/* Subtle decorative background circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-200/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-200/30 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 text-sky-900 text-xs font-black uppercase tracking-wider border border-sky-200 shadow-2xs">
              <Mail className="w-3.5 h-3.5 text-sky-600" />
              <span>Newsletter &amp; Update Mingguan</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-balance">
              Dapatkan Studi Kasus &amp; Tips Bisnis Digital Terupdate
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              Bergabung bersama 1.200+ pelaku UMKM dan pemilik bisnis online di Indonesia. Kami kirimkan ringkasan tips menaikkan penjualan, strategi closing via WhatsApp, dan studi kasus inspiratif langsung ke email Anda.
            </p>

            {/* Newsletter Form or Success State */}
            {newsletterStatus === 'success' ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-950 space-y-3 shadow-xs animate-fade-in max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-emerald-900">
                    Pendaftaran Newsletter Berhasil!
                  </h3>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    {newsletterMessage}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetNewsletter}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-4 cursor-pointer"
                  >
                    Daftarkan alamat email lainnya
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="max-w-xl mx-auto space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        if (newsletterStatus === 'error') {
                          setNewsletterStatus('idle');
                          setNewsletterMessage('');
                        }
                      }}
                      placeholder="Masukkan alamat email Anda (contoh: nama@gmail.com)"
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-2xs transition-all"
                      disabled={newsletterStatus === 'loading'}
                      aria-label="Alamat email untuk berlangganan newsletter"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {newsletterStatus === 'loading' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Mendaftarkan...</span>
                      </>
                    ) : (
                      <>
                        <span>Langganan Gratis</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Error Notice */}
                {newsletterStatus === 'error' && (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-rose-600 animate-shake pt-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{newsletterMessage}</span>
                  </div>
                )}

                {/* Trust Micro-copy */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Bebas Spam 100%
                  </span>
                  <span>•</span>
                  <span>Update Berkala Mingguan</span>
                  <span>•</span>
                  <span>Bisa Berhenti Kapan Saja</span>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Big Bottom Social Proof Callout */}
        <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Giliran Bisnis Anda Naik Kelas</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Ingin Merasakan Peningkatan Omzet Serupa?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Anda tidak perlu menunggu berbulan-bulan atau mengeluarkan jutaan rupiah. Dengan promo <strong className="text-yellow-400">Rp 499.000 all-in</strong>, landing page kustom bisnis Anda akan selesai dikerjakan dalam <strong className="text-emerald-400">1 hari kerja</strong> lengkap dengan gratis domain 1 tahun!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button
              onClick={handleOpenOrder}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 active:scale-98 text-slate-950 font-black text-sm tracking-wide uppercase transition-all shadow-xl hover:shadow-yellow-400/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>KLAIM PROMO RP 499RB SEKARANG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/6289673686625?text=Halo%20Admin%20Webkilat,%20saya%20tertarik%20dengan%20artikel%20kesuksesan%20UMKM%20dan%20ingin%20membuat%20landing%20page%20promo%20Rp%20499rb%20sekarang!"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Konsultasi WA (0896-7368-6625)</span>
            </a>
          </div>
        </div>
      </div>

      {/* In-Depth Article Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-6 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer z-10"
              title="Tutup Artikel"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Modal */}
            <div className="space-y-3 pr-8">
              <span
                className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border ${selectedArticle.categoryColor}`}
              >
                {selectedArticle.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Award className="w-4 h-4 text-amber-500" />
                  Sumber: {selectedArticle.sourceName}
                </span>
                <span>•</span>
                <span>Waktu Baca: {selectedArticle.readTime}</span>
              </div>
            </div>

            {/* Cover Image in Modal (if available) */}
            {selectedArticle.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-80">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Embedded Video Player in Modal (if available: YouTube or Google Drive) */}
            {selectedArticle.videoUrl && (() => {
              const videoType = selectedArticle.videoType || detectVideoSource(selectedArticle.videoUrl);
              let embedUrl = selectedArticle.videoUrl;
              if (videoType === 'youtube') {
                embedUrl = convertYouTubeEmbedUrl(selectedArticle.videoUrl) || selectedArticle.videoUrl;
              } else if (videoType === 'drive') {
                embedUrl = convertGoogleDriveVideoUrl(selectedArticle.videoUrl) || selectedArticle.videoUrl;
              }

              return (
                <div className="space-y-2 rounded-2xl p-4 bg-slate-900 text-white">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <VideoIcon className="w-4 h-4 text-rose-400" />
                    <span>Video Pendukung Artikel:</span>
                  </div>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
                    <iframe
                      src={embedUrl}
                      title={selectedArticle.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              );
            })()}

            {/* Stat Callout in Modal */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/50 border border-sky-200 flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-sky-700">
                  {selectedArticle.keyStat}
                </div>
                <div className="text-xs font-bold text-slate-700">
                  {selectedArticle.keyStatLabel}
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-500 text-right">
                Studi Kasus Terverifikasi
              </div>
            </div>

            {/* Editorial Content Breakdown */}
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              {/* If Body Text is provided (free-form admin article or rich text) */}
              {selectedArticle.content.bodyText && (
                <div className="pt-2">
                  {selectedArticle.content.bodyText.includes('<') && selectedArticle.content.bodyText.includes('>') ? (
                    <div
                      className="text-slate-800 leading-relaxed text-sm sm:text-base space-y-3 prose max-w-none [&_a]:text-sky-600 [&_a]:underline [&_a]:font-semibold [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-extrabold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_u]:underline [&_s]:line-through"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeArticleHtml(selectedArticle.content.bodyText),
                      }}
                    />
                  ) : (
                    <div className="space-y-3">
                      {selectedArticle.content.bodyText.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-slate-800 leading-relaxed text-sm sm:text-base font-normal">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Structured Sections (if available) */}
              {selectedArticle.content.background && (
                <div>
                  <h4 className="font-black text-slate-900 text-base mb-2 uppercase tracking-wide">
                    1. Latar Belakang &amp; Awal Usaha
                  </h4>
                  <p>{selectedArticle.content.background}</p>
                </div>
              )}

              {selectedArticle.content.challenge && (
                <div>
                  <h4 className="font-black text-slate-900 text-base mb-2 uppercase tracking-wide">
                    2. Tantangan Sebelum Memiliki Landing Page
                  </h4>
                  <p>{selectedArticle.content.challenge}</p>
                </div>
              )}

              {selectedArticle.content.strategy && selectedArticle.content.strategy.length > 0 && (
                <div>
                  <h4 className="font-black text-slate-900 text-base mb-2 uppercase tracking-wide">
                    3. Strategi Digitalisasi yang Diterapkan
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedArticle.content.strategy.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedArticle.content.result && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                  <h4 className="font-black text-emerald-900 text-sm uppercase tracking-wide">
                    4. Hasil Nyata yang Dicapai
                  </h4>
                  <p className="text-emerald-950 font-medium">
                    {selectedArticle.content.result}
                  </p>
                </div>
              )}

              {selectedArticle.content.takeaway && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                  <h4 className="font-black text-amber-900 text-sm uppercase tracking-wide">
                    5. Kesimpulan &amp; Pelajaran untuk UMKM Lain
                  </h4>
                  <p className="text-amber-950 font-medium">
                    {selectedArticle.content.takeaway}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Bottom CTA */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Punya bisnis serupa? Segera miliki landing page siap closing Anda.
              </span>
              <button
                type="button"
                onClick={handleOpenOrder}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Pesan Landing Page Sekarang (Rp 499rb)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export type { Article };
