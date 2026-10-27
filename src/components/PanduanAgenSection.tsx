import React, { useState, useId } from 'react';
import {
  GraduationCap,
  BookOpen,
  ShoppingBag,
  Target,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Zap,
  ShieldCheck,
  MessageCircle,
  Printer,
  ArrowRight,
  Layers,
  Search,
  Filter,
  DollarSign,
  Send,
  Lock,
  Crown,
  FileCheck2,
  Clock,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import {
  WEBSITE_PACKAGES,
  DIGITAL_PRODUCTS,
  BUYER_PERSONAS,
  COLD_SCRIPTS,
  OBJECTION_HANDLINGS,
  QUIZ_QUESTIONS,
  DigitalProduct,
} from '../data/panduanAgenData';

interface PanduanAgenSectionProps {
  onNavigateToOrder?: () => void;
  onNavigateToContact?: () => void;
}

export const PanduanAgenSection: React.FC<PanduanAgenSectionProps> = ({
  onNavigateToOrder,
  onNavigateToContact,
}) => {
  // Sub-tabs: 'katalog' | 'persona' | 'selling' | 'ujian'
  const [activeSubTab, setActiveSubTab] = useState<'katalog' | 'persona' | 'selling' | 'ujian'>('katalog');

  // Filter & Search states for Digital Products
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Copy states for scripts & direct portal link
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [copiedPortalLink, setCopiedPortalLink] = useState(false);

  // Accordion open states
  const [openObjectionId, setOpenObjectionId] = useState<string | null>('obj-mahal');

  // QUIZ STATES
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [showCertificateOnly, setShowCertificateOnly] = useState(false);

  // Calculate score
  const totalQuestions = QUIZ_QUESTIONS.length;
  let correctCount = 0;
  QUIZ_QUESTIONS.forEach((q) => {
    if (userAnswers[q.id] === q.correctAnswerIndex) {
      correctCount += 1;
    }
  });
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = scorePercentage >= 80;

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    if (isQuizSubmitted) return; // Prevent changing after submit
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setIsQuizSubmitted(false);
    setShowCertificateOnly(false);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCopyScript = (id: string, text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedScriptId(id);
        setTimeout(() => setCopiedScriptId(null), 2500);
      });
    } else {
      prompt('Salin teks script berikut:', text);
    }
  };

  const OFFICIAL_PORTAL_LINK = 'https://webmurah.biz.id/#/panduan-agen';

  const handleCopyPortalLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(OFFICIAL_PORTAL_LINK).then(() => {
        setCopiedPortalLink(true);
        setTimeout(() => setCopiedPortalLink(false), 2500);
      });
    } else {
      prompt('Salin link direct portal agen berikut:', OFFICIAL_PORTAL_LINK);
    }
  };

  const handleSendWaScript = (text: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Filter digital products
  const filteredProducts = DIGITAL_PRODUCTS.filter((prod) => {
    const matchSearch =
      prod.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      prod.shortDesc.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      prod.category.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchCategory =
      selectedCategory === 'all' || prod.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const uniqueCategories = ['all', ...new Set(DIGITAL_PRODUCTS.map((p) => p.category))];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-14 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* HEADER HERO PORTAL PANDUAN AGEN (MT)                                       */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#122256] via-[#1D3582] to-indigo-900 text-white p-6 sm:p-10 shadow-xl border border-blue-400/20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Portal Edukasi &amp; Uji Sertifikasi Internal Mitra</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Panduan Agen ( MT ) <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-sky-300">
                Management Trainee &amp; Mitra Terpilih
              </span>
            </h1>

            <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed">
              Selamat datang di akademi penjualan PT INOVASI TEKNOLOGI DIGITAL INDONESIA. Kuasai katalog produk webmurah.biz.id &amp; ekosistem produk Indo Digital, pahami buyer persona, praktekkan script closing, dan raih sertifikat kelulusan Product Knowledge (passing grade 80%).
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-blue-200 block text-[11px]">Paket Website</span>
                <span className="text-lg font-black text-white">2 Paket Inti</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-blue-200 block text-[11px]">Produk Digital</span>
                <span className="text-lg font-black text-amber-300">9 Produk Aktif</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-blue-200 block text-[11px]">Standar Kelulusan</span>
                <span className="text-lg font-black text-emerald-300">Min. 80% (12/15)</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-blue-200 block text-[11px]">Sertifikasi</span>
                <span className="text-lg font-black text-sky-300">E-Sertifikat Resmi</span>
              </div>
            </div>

            {/* Direct Link Share Bar (webmurah.biz.id) */}
            <div className="mt-4 pt-4 border-t border-blue-400/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-black/20 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] text-blue-200 font-semibold uppercase tracking-wider">Direct Link Portal Agen (Siap Dibagikan):</p>
                  <code className="text-xs sm:text-sm font-mono font-bold text-amber-300 truncate block">
                    https://webmurah.biz.id/#/panduan-agen
                  </code>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyPortalLink}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                    copiedPortalLink
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {copiedPortalLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Link Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-700" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const shareText = `Halo Rekan Mitra & Calon Agen! 👋\n\nSilakan akses langsung Portal Edukasi & Ujian Sertifikasi Agen Indo Digital di tautan resmi berikut:\n👉 https://webmurah.biz.id/#/panduan-agen\n\nPelajari katalog produk, script penjualan, dan ikuti kuis 15 soal untuk klaim E-Sertifikat resmi!`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Kirim WA</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUB-NAVIGATION TABS (MODULAR)                                              */}
        {/* ========================================================================= */}
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-md">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => setActiveSubTab('katalog')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeSubTab === 'katalog'
                  ? 'bg-[#1D3582] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>1. Katalog Produk</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('persona')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeSubTab === 'persona'
                  ? 'bg-[#1D3582] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Target className="w-4 h-4 shrink-0" />
              <span>2. Sasaran Prospek</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('selling')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeSubTab === 'selling'
                  ? 'bg-[#1D3582] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>3. Selling Skills</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('ujian')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer relative ${
                activeSubTab === 'ujian'
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400'
                  : 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Award className="w-4 h-4 text-amber-700 shrink-0" />
              <span>4. Ujian Online (MT)</span>
              {isQuizSubmitted && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPassed ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
              )}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: KATALOG PRODUK & LAYANAN                                        */}
        {/* ========================================================================= */}
        {activeSubTab === 'katalog' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            
            {/* Bagian 1A: Jasa Pembuatan Website (webmurah.biz.id) */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black uppercase tracking-wider mb-2">
                  <Zap className="w-3.5 h-3.5 text-sky-600" />
                  <span>Layanan Inti webmurah.biz.id</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Paket Jasa Pembuatan Website Profesional
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Dua pilihan paket strategis: Paket UMKM untuk penetrasi pasar masal dan Paket Elite untuk korporat/agensi.
                </p>
              </div>

              {/* Grid 2 Kartu Paket Website */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {WEBSITE_PACKAGES.map((pkg) => {
                  const isUmkm = pkg.id === 'umkm';
                  return (
                    <div
                      key={pkg.id}
                      className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all ${
                        isUmkm
                          ? 'bg-white border-sky-300 shadow-lg ring-1 ring-sky-200'
                          : 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-amber-400 shadow-xl ring-2 ring-amber-400/20'
                      }`}
                    >
                      <div className="space-y-5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                              isUmkm
                                ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            }`}
                          >
                            {pkg.badge}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                              isUmkm
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-800 text-amber-300 border border-slate-700'
                            }`}
                          >
                            {pkg.turnaroundTime}
                          </span>
                        </div>

                        <div>
                          <h3
                            className={`text-2xl font-black ${
                              isUmkm ? 'text-slate-900' : 'text-white'
                            }`}
                          >
                            {pkg.name}
                          </h3>
                          <p
                            className={`text-xs sm:text-sm mt-1 font-medium ${
                              isUmkm ? 'text-slate-600' : 'text-slate-300'
                            }`}
                          >
                            {pkg.pageCount}
                          </p>
                        </div>

                        {/* Price Box */}
                        <div
                          className={`p-4 rounded-2xl border ${
                            isUmkm
                              ? 'bg-sky-50/70 border-sky-200'
                              : 'bg-slate-800/80 border-amber-400/30'
                          }`}
                        >
                          <div className="flex items-baseline gap-2">
                            <span
                              className={`text-xs font-bold ${
                                isUmkm ? 'text-slate-500' : 'text-slate-400'
                              }`}
                            >
                              Harga Promo:
                            </span>
                            <span
                              className={`text-3xl font-black ${
                                isUmkm ? 'text-[#1D3582]' : 'text-amber-400'
                              }`}
                            >
                              {pkg.promoPrice}
                            </span>
                            {isUmkm && (
                              <span className="text-xs line-through text-slate-400">
                                {pkg.normalPrice}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs font-bold mt-1 ${
                              isUmkm ? 'text-emerald-700' : 'text-amber-200/90'
                            }`}
                          >
                            ✓ {pkg.paymentTerms}
                          </p>
                          <p
                            className={`text-[11px] mt-1 ${
                              isUmkm ? 'text-slate-500' : 'text-slate-400'
                            }`}
                          >
                            🌐 {pkg.domainHosting}
                          </p>
                        </div>

                        {/* Fitur Utama */}
                        <div className="space-y-2">
                          <span
                            className={`text-xs font-black uppercase tracking-wider block ${
                              isUmkm ? 'text-slate-700' : 'text-amber-300'
                            }`}
                          >
                            Fitur &amp; Nilai Tambah:
                          </span>
                          <ul className="space-y-2 text-xs">
                            {pkg.features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2
                                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                                    isUmkm ? 'text-emerald-600' : 'text-amber-400'
                                  }`}
                                />
                                <span className={isUmkm ? 'text-slate-700' : 'text-slate-200'}>
                                  {feat}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Keunggulan Komparatif */}
                        <div
                          className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                            isUmkm
                              ? 'bg-amber-50 text-amber-950 border-amber-200'
                              : 'bg-slate-950/80 text-slate-300 border-slate-800'
                          }`}
                        >
                          <strong className={isUmkm ? 'text-amber-900 block mb-1' : 'text-amber-300 block mb-1'}>
                            ⚔️ Keunggulan Komparatif (Vs Kompetitor):
                          </strong>
                          {pkg.comparativeAdvantage}
                        </div>
                      </div>

                      {/* CTA untuk tes order atau kirim ke klien */}
                      <div className="pt-6 mt-4 border-t border-slate-200/40">
                        <button
                          type="button"
                          onClick={onNavigateToOrder}
                          className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                            isUmkm
                              ? 'bg-[#1D3582] hover:bg-[#162968] text-white'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                          }`}
                        >
                          <span>Buka Form Pemesanan</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bagian 1B: Produk Indo Digital Lainnya (Etalase https://indo-digital.myr.id) */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2 border border-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ekosistem Produk Digital Tambahan</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Katalog Produk Indo Digital Lainnya
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Seluruh produk e-course, e-book, dan template yang bisa ditawarkan kepada calon pembeli via{' '}
                    <a
                      href="https://indo-digital.myr.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1D3582] font-black underline inline-flex items-center gap-1 hover:text-sky-700"
                    >
                      indo-digital.myr.id
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>

                {/* Direct visit button */}
                <a
                  href="https://indo-digital.myr.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer border border-amber-500"
                >
                  <span>Buka Etalase Resmi (myr.id)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Cari judul e-book, e-course, atau topik..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  />
                </div>

                <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {uniqueCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#1D3582] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat === 'all' ? 'Semua Produk' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid 9 Produk Indo Digital */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                            {prod.category}
                          </span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-emerald-600">
                              {prod.price}
                            </span>
                            {prod.normalPrice && (
                              <span className="text-[11px] line-through text-slate-400">
                                {prod.normalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <h4 className="text-base font-black text-slate-900 group-hover:text-[#1D3582] transition-colors leading-snug">
                          {prod.title}
                        </h4>

                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {prod.shortDesc}
                        </p>

                        {/* USP */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] space-y-1">
                          <strong className="text-indigo-900 font-bold block">
                            💡 Nilai Manfaat (USP):
                          </strong>
                          <p className="text-slate-700 leading-relaxed">{prod.usp}</p>
                        </div>

                        {/* Target Market */}
                        <div className="text-[11px] text-slate-500">
                          <strong className="text-slate-700">Target Pasar:</strong> {prod.targetMarket}
                        </div>
                      </div>

                      {/* Selling points */}
                      <div className="pt-3 border-t border-slate-100 space-y-1.5 mt-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Keunggulan Utama:
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-600">
                          {prod.keySellingPoints.map((pt, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Direct Link */}
                    <div className="p-3 bg-slate-50 border-t border-slate-100">
                      <a
                        href={prod.catalogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 transition-all flex items-center justify-center gap-1.5 group-hover:border-blue-300"
                      >
                        <span>Lihat di Toko Indo Digital</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: TARGET AUDIENCE & BUYER PERSONA                                */}
        {/* ========================================================================= */}
        {activeSubTab === 'persona' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border-b border-slate-200 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-black uppercase tracking-wider mb-2">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                <span>Pemetaan Segmen &amp; Profil Calon Pembeli</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Target Audience &amp; Buyer Persona
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Kenali siapa prospek Anda, apa ketakutan/rasa sakit (pain point) mereka, dan bagaimana solusi produk kita menyelesaikan masalah mereka secara spesifik.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BUYER_PERSONAS.map((persona) => (
                <div
                  key={persona.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                        {persona.recommendedPackage}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        {persona.segmentName}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                        {persona.description}
                      </p>
                    </div>

                    {/* Pain Points */}
                    <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-black text-rose-800 uppercase tracking-wider">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Pain Points (Masalah Utama Mereka):</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-rose-950/90 font-medium">
                        {persona.painPoints.map((pain, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-rose-500 font-bold shrink-0">•</span>
                            <span>{pain}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Solusi Spesifik */}
                    <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Solusi &amp; Sudut Pandang Pitching:</span>
                      </div>
                      <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                        {persona.solutionPitch}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Kesesuaian Produk:</span>
                    <strong className="text-[#1D3582]">{persona.productFit}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: SELLING SKILLS & STRATEGI PENJUALAN                             */}
        {/* ========================================================================= */}
        {activeSubTab === 'selling' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            
            {/* Bagian 3A: Script Cold Prospecting */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider mb-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Script Pendekatan Awal (Cold Outreach)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Script Penjualan Siap Pakai (Tinggal Salin &amp; Kirim)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Naskah teruji dengan tingkat respon di atas 35%. Sesuaikan variabel [Nama Pemilik] dan [Nama Bisnis] sebelum mengirim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {COLD_SCRIPTS.map((script) => (
                  <div
                    key={script.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {script.targetChannel}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                          {script.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 max-w-sm">{script.context}</p>
                    </div>

                    {/* Script Box */}
                    <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap select-all border border-slate-800 relative">
                      {script.scriptText}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleCopyScript(script.id, script.scriptText)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          copiedScriptId === script.id
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {copiedScriptId === script.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Tersalin ke Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Salin Teks Script</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendWaScript(script.scriptText)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        <Send className="w-4 h-4" />
                        <span>Kirim via WhatsApp Langsung</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bagian 3B: Handling Objections (Menangani Keberatan) */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              <div className="border-b border-slate-200 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Teknik Menjawab Keraguan Calon Klien</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Handling Objections (Cara Menangani Keberatan)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Keberatan calon pembeli bukanlah penolakan, melainkan tanda bahwa mereka butuh kepastian dan edukasi lebih mendalam.
                </p>
              </div>

              <div className="space-y-4">
                {OBJECTION_HANDLINGS.map((item) => {
                  const isOpen = openObjectionId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenObjectionId(isOpen ? null : item.id)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Keberatan Umum
                          </span>
                          <h4 className="text-base sm:text-lg font-black text-slate-900">
                            {item.objection}
                          </h4>
                        </div>
                        <div className="shrink-0 p-1.5 rounded-full bg-slate-100 text-slate-600">
                          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="p-5 pt-0 space-y-4 border-t border-slate-100 text-xs sm:text-sm leading-relaxed">
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                            <strong className="text-slate-900 block mb-0.5">🧠 Pola Pikir Agen (Mindset):</strong>
                            {item.coreMindset}
                          </div>

                          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-2">
                            <strong className="text-emerald-900 block font-bold">
                              🗣️ Contoh Jawaban Empati &amp; Edukasi:
                            </strong>
                            <p className="italic font-medium">"{item.recommendedResponse}"</p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 text-sky-950">
                            <strong className="text-sky-900 block mb-0.5 font-bold">🎯 Pertanyaan Pengunci (Closing Follow-up):</strong>
                            <p className="font-semibold">"{item.closingFollowUp}"</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bagian 3C: 3 Teknik Closing Ampuh */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <h3 className="text-xl font-black text-slate-900">
                3 Kaidah Utama Teknik Closing Etis &amp; Efektif
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 w-fit">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">
                    1. Risk-Reversal (Nol Risiko)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Selalu tekankan kalimat <em>"Pesan sekarang, bayar setelah landing page jadi &amp; disetujui"</em>. Hal ini melunturkan semua ketakutan pembeli pemula.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800 w-fit">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">
                    2. Urgency &amp; Scarcity (Keterbatasan)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sebutkan bahwa antrean pengerjaan 1 hari kilat dibatasi maksimal 3 slot per hari oleh tim teknis agar kualitas tetap terjaga maksimal.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="p-2 rounded-xl bg-sky-100 text-sky-800 w-fit">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">
                    3. Assumptive Close (Pilihan Pasti)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Jangan bertanya <em>"Mau beli atau tidak?"</em>, tapi tanyakan <em>"Untuk nomor WhatsApp di tombol ordernya mau pakai nomor pribadi ini atau nomor CS Kak?"</em>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: MODUL UJIAN ONLINE INTERAKTIF (PRODUCT KNOWLEDGE TEST)          */}
        {/* ========================================================================= */}
        {activeSubTab === 'ujian' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Ujian */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2 border border-amber-300">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Sertifikasi Standar Kompetensi Mitra</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Ujian Online Product Knowledge (MT)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Uji pemahaman Anda terhadap seluruh materi katalog website, produk digital, dan teknik selling skill.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center gap-4 text-xs font-bold text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Passing Grade</span>
                    <span className="text-base font-black text-[#1D3582]">80% (Min 12/15)</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Jumlah Soal</span>
                    <span className="text-base font-black text-slate-900">{totalQuestions} Butir</span>
                  </div>
                </div>
              </div>

              {/* Data Identitas Peserta Sebelum Submit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Nama Lengkap Peserta (Untuk Tertera di Sertifikat):
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    disabled={isQuizSubmitted && isPassed}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Nomor WhatsApp / ID Agen (Opsional):
                  </label>
                  <input
                    type="text"
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                    placeholder="Contoh: 081234567890 / AG-2026-001"
                    disabled={isQuizSubmitted && isPassed}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  />
                </div>
              </div>
            </div>

            {/* HASIL KUIS / SERTIFIKAT TAMPIL SETELAH SUBMIT */}
            {isQuizSubmitted && (
              <div className="space-y-6">
                {isPassed ? (
                  /* ================================================================= */
                  /* STATUS KELULUSAN: LULUS (SKOR >= 80%)                              */
                  /* ================================================================= */
                  <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border-2 border-emerald-400 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                      <Award className="w-9 h-9" />
                    </div>

                    <div className="space-y-2 max-w-xl mx-auto">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 text-xs font-black uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Status Resmi Kelulusan</span>
                      </div>
                      <h3 className="text-2xl sm:text-4xl font-black text-emerald-950">
                        SELAMAT! ANDA LULUS PRODUCT KNOWLEDGE
                      </h3>
                      <p className="text-xs sm:text-sm text-emerald-800 font-medium leading-relaxed">
                        Anda berhasil menjawab benar <strong>{correctCount} dari {totalQuestions} soal</strong> ({scorePercentage}%). Pemahaman produk dan kapabilitas selling skill Anda telah terverifikasi memenuhi standar kompetensi mitra PT INOVASI TEKNOLOGI DIGITAL INDONESIA.
                      </p>
                    </div>

                    {/* VIRTUAL DIGITAL CERTIFICATE (E-SERTIFIKAT) */}
                    <div
                      id="sertifikat-resmi-mt"
                      className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-amber-400/80 shadow-2xl text-slate-900 max-w-3xl mx-auto relative overflow-hidden"
                    >
                      {/* Decorative Borders */}
                      <div className="absolute top-2 left-2 right-2 bottom-2 border border-amber-300/60 rounded-2xl pointer-events-none" />
                      <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

                      <div className="space-y-6 relative z-10 text-center">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                          <div className="text-left">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1D3582] block">
                              PT INOVASI TEKNOLOGI DIGITAL INDONESIA
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              SK Kemenkumham: AHU-0072671.AH.01.01.TAHUN 2026
                            </span>
                          </div>
                          <div className="w-9 h-9 rounded-xl bg-[#1D3582] text-amber-300 flex items-center justify-center font-black text-sm">
                            ID
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-black uppercase tracking-widest text-amber-600 block">
                            CERTIFICATE OF PRODUCT KNOWLEDGE EXCELLENCE
                          </span>
                          <h4 className="text-xl sm:text-3xl font-serif font-black text-slate-900 mt-1">
                            SERTIFIKAT KELULUSAN
                          </h4>
                          <span className="text-xs text-slate-500 font-mono mt-1 block">
                            No. Registrasi: ID-MT-{candidateId ? candidateId.replace(/[^a-zA-Z0-9]/g, '').slice(-6) : '202601'}-{scorePercentage}
                          </span>
                        </div>

                        <div className="space-y-2 py-2">
                          <p className="text-xs text-slate-500">Diberikan secara resmi dan sah kepada:</p>
                          <div className="text-2xl sm:text-3xl font-black text-[#1D3582] font-serif border-b-2 border-slate-300 pb-1 max-w-md mx-auto">
                            {candidateName.trim() || 'MITRA TERPILIH (MT)'}
                          </div>
                          <p className="text-xs text-slate-600 max-w-md mx-auto pt-2 leading-relaxed">
                            Atas keberhasilan menyelesaikan seluruh kurikulum pembelajaran dan lulus evaluasi Uji Kompetensi Product Knowledge Jasa Pembuatan Website (webmurah.biz.id) serta Ekosistem Produk Indo Digital dengan predikat:
                          </p>
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider border border-emerald-300 mt-1">
                            <Crown className="w-4 h-4 text-emerald-600" />
                            <span>LULUS DENGAN PREDIKAT EXCELLENT (SKOR {scorePercentage}%)</span>
                          </div>
                        </div>

                        {/* Signatures & Date */}
                        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
                          <div className="text-center">
                            <span className="text-[11px] text-slate-500 block">Tanggal Kelulusan:</span>
                            <span className="font-bold text-slate-800">
                              {new Date().toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-mono block mt-1">
                              Status: TERVERIFIKASI AKTIF
                            </span>
                          </div>

                          <div className="text-center">
                            <span className="text-[11px] text-slate-500 block">Penguji &amp; Direksi:</span>
                            <span className="font-serif font-black text-[#1D3582] block text-sm mt-0.5">
                              Direktur Operasional
                            </span>
                            <span className="text-[9px] text-slate-500 block">
                              PT Inovasi Teknologi Digital Indonesia
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons for Certificate */}
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-wider shadow-md hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Cetak / Simpan PDF Sertifikat</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetQuiz}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Ulangi Ujian Kuis</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ================================================================= */
                  /* STATUS KELULUSAN: BELUM LULUS (SKOR < 80%)                         */
                  /* ================================================================= */
                  <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 sm:p-8 text-center space-y-4 animate-in zoom-in-95 duration-300">
                    <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-md">
                      <XCircle className="w-8 h-8" />
                    </div>

                    <div className="space-y-1.5 max-w-lg mx-auto">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-200 text-rose-900 text-xs font-black uppercase tracking-wider">
                        <span>Status Ujian</span>
                      </div>
                      <h3 className="text-2xl font-black text-rose-950">
                        BELUM LULUS PRODUCT KNOWLEDGE
                      </h3>
                      <p className="text-xs sm:text-sm text-rose-800 font-medium">
                        Skor Anda: <strong>{scorePercentage}%</strong> ({correctCount} dari {totalQuestions} benar).
                        <br />
                        Syarat minimal kelulusan sertifikasi adalah <strong>80% (minimal 12 soal benar)</strong>.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-rose-200 text-xs text-slate-700 max-w-md mx-auto text-left space-y-2">
                      <strong className="text-rose-900 block font-bold">
                        📋 Instruksi Perbaikan:
                      </strong>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                        <li>Buka kembali tab <strong>Katalog Produk</strong> untuk mengingat rincian harga paket dan e-book.</li>
                        <li>Pelajari kembali tab <strong>Selling Skills</strong> untuk memahami penanganan keberatan.</li>
                        <li>Cermati pembahasan jawaban di bawah ini, lalu klik tombol Ulangi Ujian.</li>
                      </ol>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetQuiz}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Ulangi Ujian Sekarang</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* DAFTAR SOAL KUIS PILIHAN GANDA (15 SOAL) */}
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Daftar Soal Uji Kompetensi ({totalQuestions} Butir Pilihan Ganda):</span>
                <span>Terjawab: {Object.keys(userAnswers).length} / {totalQuestions}</span>
              </div>

              {QUIZ_QUESTIONS.map((question, index) => {
                const selectedOption = userAnswers[question.id];
                const isAnswered = selectedOption !== undefined;
                const isCorrect = isAnswered && selectedOption === question.correctAnswerIndex;

                return (
                  <div
                    key={question.id}
                    className={`bg-white rounded-3xl border p-5 sm:p-6 transition-all ${
                      isQuizSubmitted
                        ? isCorrect
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : 'border-rose-300 bg-rose-50/20'
                        : 'border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          Soal #{question.id} &bull; {question.category}
                        </span>

                        {isQuizSubmitted && (
                          <span
                            className={`text-xs font-bold inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Benar (+1)</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>Salah</span>
                              </>
                            )}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {question.question}
                      </h4>

                      {/* Options List */}
                      <div className="space-y-2 pt-1">
                        {question.options.map((opt, optIdx) => {
                          const isOptionSelected = selectedOption === optIdx;
                          const isOptionCorrect = optIdx === question.correctAnswerIndex;

                          let optionStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700';

                          if (!isQuizSubmitted) {
                            if (isOptionSelected) {
                              optionStyle = 'bg-blue-50 border-[#1D3582] text-[#1D3582] font-bold ring-1 ring-[#1D3582]';
                            }
                          } else {
                            if (isOptionCorrect) {
                              optionStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                            } else if (isOptionSelected && !isOptionCorrect) {
                              optionStyle = 'bg-rose-100 border-rose-400 text-rose-950 line-through';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectAnswer(question.id, optIdx)}
                              disabled={isQuizSubmitted}
                              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                                  isOptionSelected
                                    ? 'bg-[#1D3582] text-white'
                                    : 'bg-white border border-slate-300 text-slate-500'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1 leading-snug">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Box After Submit */}
                      {isQuizSubmitted && (
                        <div className="pt-2 text-xs text-slate-600 bg-slate-100/80 p-3 rounded-xl border border-slate-200 leading-relaxed">
                          <strong className="text-slate-900 block mb-0.5">💡 Kunci Jawaban &amp; Pembahasan:</strong>
                          {question.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Submit Button */}
              {!isQuizSubmitted && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-center space-y-3">
                  <div className="text-xs text-slate-500">
                    Pastikan Anda telah mengisi seluruh {totalQuestions} pertanyaan sebelum menekan tombol evaluasi.
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!candidateName.trim()) {
                        alert('Silakan isi Nama Lengkap Anda terlebih dahulu di kolom formulir atas agar nama tertera di sertifikat.');
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                        return;
                      }
                      if (Object.keys(userAnswers).length < totalQuestions) {
                        const confirmProceed = confirm(
                          `Anda baru menjawab ${Object.keys(userAnswers).length} dari ${totalQuestions} soal. Apakah Anda yakin ingin mengumpulkan sekarang?`
                        );
                        if (!confirmProceed) return;
                      }
                      setIsQuizSubmitted(true);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-98"
                  >
                    <span>Kirim &amp; Hitung Skor Ujian Product Knowledge</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
