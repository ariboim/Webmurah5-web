import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Link2,
  CreditCard,
  CheckCircle2,
  Globe,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Smartphone,
  QrCode,
  Building2,
  Store,
  Wallet,
  Clock,
  Send,
  MessageCircle,
  Check,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { ADMIN_WA_NUMBER, ADMIN_WA_DISPLAY } from '../types/order';

interface FlowStep {
  step: number;
  title: string;
  shortDesc: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  primaryColor: string;
  accentBg: string;
  details: {
    actionTitle: string;
    points: string[];
    tag: string;
  };
}

const FLOW_STEPS: FlowStep[] = [
  {
    step: 1,
    title: 'Isi Form Order & Kirim ke Admin',
    shortDesc: 'Lengkapi formulir pemesanan kilat di website lalu klik kirim langsung ke WhatsApp resmi Admin Indo Digital.',
    badge: 'Langkah 1 • Input Kebutuhan',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    icon: FileText,
    primaryColor: '#0284C7',
    accentBg: 'bg-sky-50',
    details: {
      actionTitle: 'Apa yang Anda lakukan:',
      points: [
        'Isi nama bisnis, jenis produk/jasa, kontak WA, dan target pasar.',
        'Klik tombol "Kirim Pesanan ke WhatsApp" di formulir.',
        'Format teks pesanan rapi otomatis terkirim ke WhatsApp Admin (0896-7368-6625).',
      ],
      tag: 'Cepat & Praktis (Hanya 2 Menit)',
    },
  },
  {
    step: 2,
    title: 'Admin Kirim Link Pembayaran',
    shortDesc: 'Admin Indo Digital memverifikasi pesanan dan mengirimkan link invoice pembayaran resmi.',
    badge: 'Langkah 2 • Invoice Resmi',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: Link2,
    primaryColor: '#4F46E5',
    accentBg: 'bg-indigo-50',
    details: {
      actionTitle: 'Apa yang Anda terima:',
      points: [
        'Admin mengirimkan tautan (link) pembayaran resmi terenkripsi aman.',
        'Buka link dan isi data: Jumlah Pembayaran (Rp 499.000 promo), Nama, Email, dan No. WA.',
        'Transparan tanpa biaya tersembunyi atau biaya langganan bulanan.',
      ],
      tag: 'Tautan Resmi & Terenkripsi SSL',
    },
  },
  {
    step: 3,
    title: 'Pilih Metode Pembayaran',
    shortDesc: 'Pilih kanal pembayaran favorit Anda: QRIS, Virtual Account (VA), Alfamart, atau E-Wallet.',
    badge: 'Langkah 3 • Bebas Pilih Metode',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: CreditCard,
    primaryColor: '#9333EA',
    accentBg: 'bg-purple-50',
    details: {
      actionTitle: 'Kanal pembayaran yang tersedia:',
      points: [
        'QRIS: Scan instan dari semua bank (BCA, Mandiri, BRI, BNI) & E-Wallet.',
        'Virtual Account (VA): Transfer antar bank dengan verifikasi otomatis 24 jam.',
        'Alfamart & Indomaret: Pembayaran tunai via kasir minimarket terdekat.',
        'E-Wallet: GoPay, OVO, DANA, ShopeePay, dan LinkAja.',
      ],
      tag: 'Mendukung QRIS, Semua Bank & E-Wallet',
    },
  },
  {
    step: 4,
    title: 'Konfirmasi Bukti Transfer',
    shortDesc: 'Kirimkan bukti/screenshot transfer ke WhatsApp Admin untuk diteruskan ke tim produksi web.',
    badge: 'Langkah 4 • Produksi Dimulai',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    icon: CheckCircle2,
    primaryColor: '#D97706',
    accentBg: 'bg-amber-50',
    details: {
      actionTitle: 'Apa yang terjadi setelah bayar:',
      points: [
        'Kirim screenshot struk / bukti sukses transfer ke WhatsApp Admin.',
        'Admin memverifikasi dan langsung menyerahkan brief ke Tim Produksi Webkilat.',
        'Pengerjaan coding, copywriting persuasif, dan desain mobile dimulai saat itu juga.',
      ],
      tag: 'Timer 24 Jam Kerja Langsung Berjalan',
    },
  },
  {
    step: 5,
    title: 'Cek Demo Web & Approval Domain',
    shortDesc: 'Admin mengirimkan link demo web untuk dicek & disetujui sebelum dipropagasikan ke domain pilihan Anda.',
    badge: 'Langkah 5 • Website Live!',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: Globe,
    primaryColor: '#059669',
    accentBg: 'bg-emerald-50',
    details: {
      actionTitle: 'Kepuasan & Garansi Anda:',
      points: [
        'Admin mengirimkan URL demo staging untuk Anda review di smartphone & laptop.',
        'Tersedia gratis 1x revisi minor (teks, foto, atau penataan tombol WhatsApp).',
        'Setelah Anda beri approval (persetujuan), web langsung dipropagasikan ke nama domain resmi Anda (.my.id/.biz.id)!',
      ],
      tag: '100% Kepuasan Terjamin',
    },
  },
];

export const OrderFlowSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const scrollToSection = (id: string) => {
    window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'order' }));
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentStepData = FLOW_STEPS.find((s) => s.step === activeStep) || FLOW_STEPS[0];

  return (
    <section
      id="alur-pemesanan"
      className="py-20 bg-gradient-to-b from-white via-sky-50/40 to-white border-t border-b border-sky-100 relative overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-sky-200/30 via-indigo-200/20 to-emerald-200/20 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight text-balance">
            Alur Pemesanan Landing Page <span className="text-sky-600">5 Langkah Kilat</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Proses pemesanan di Indo Digital dirancang sangat mudah, transparan, dan aman. Anda bisa pesan sekarang dan bayar setelah website selesai dikerjakan!
          </p>
        </div>

        {/* Desktop Pipeline Diagram (5 Step Connected Nodes) */}
        <div className="hidden lg:block mb-12">
          <div className="relative">
            {/* Connecting Horizontal Line Behind Steps */}
            <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-gradient-to-r from-sky-400 via-indigo-400 via-purple-400 via-amber-400 to-emerald-400 rounded-full z-0 opacity-60" />

            <div className="grid grid-cols-5 gap-4 relative z-10">
              {FLOW_STEPS.map((s) => {
                const isSelected = activeStep === s.step;
                const IconComponent = s.icon;

                return (
                  <button
                    key={s.step}
                    onClick={() => setActiveStep(s.step)}
                    className={`group relative text-left p-5 rounded-2xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-white border-sky-500 shadow-xl ring-4 ring-sky-100 scale-105'
                        : 'bg-white/90 hover:bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-sky-300'
                    }`}
                  >
                    {/* Step Number Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md transition-transform group-hover:scale-110 ${
                          isSelected ? 'scale-110' : ''
                        }`}
                        style={{ backgroundColor: s.primaryColor }}
                      >
                        {s.step}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Step 0{s.step}
                      </span>
                    </div>

                    {/* Step Icon & Title */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-sm leading-snug">
                        <IconComponent className="w-4 h-4 shrink-0 text-sky-600" />
                        <span className="line-clamp-2">{s.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                        {s.shortDesc}
                      </p>
                    </div>

                    {/* Active Status Indicator */}
                    {isSelected && (
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-sky-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>Aktif Dilihat</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Stepper Cards (Full Visual Flow) */}
        <div className="lg:hidden space-y-3 mb-10">
          {FLOW_STEPS.map((s, idx) => {
            const isSelected = activeStep === s.step;
            const IconComponent = s.icon;

            return (
              <div key={s.step} className="relative">
                {/* Vertical Connector Line */}
                {idx < FLOW_STEPS.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-sky-200 -z-0" />
                )}

                <div
                  onClick={() => setActiveStep(s.step)}
                  className={`relative z-10 p-4.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-sky-500 shadow-lg ring-2 ring-sky-200'
                      : 'bg-white/90 border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-sm shrink-0"
                      style={{ backgroundColor: s.primaryColor }}
                    >
                      {s.step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${s.badgeColor}`}>
                          {s.badge}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">0{s.step}/05</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-snug flex items-center gap-1.5">
                        <IconComponent className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>{s.title}</span>
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {s.shortDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Detailed Diagram Focus Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Step Breakdown & Checklist */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white shadow-sm"
                  style={{ backgroundColor: currentStepData.primaryColor }}
                >
                  {currentStepData.step}
                </span>
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${currentStepData.badgeColor}`}>
                  {currentStepData.badge}
                </span>
                <span className="text-xs font-bold text-slate-400 ml-auto">
                  Langkah {currentStepData.step} dari 5
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {currentStepData.shortDesc}
                </p>
              </div>

              {/* Action Points Checklist */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{currentStepData.details.actionTitle}</span>
                </div>
                <ul className="space-y-2.5">
                  {currentStepData.details.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        ✓
                      </span>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tag highlight */}
              <div className="flex items-center gap-2 text-xs font-bold text-sky-800 bg-sky-50 px-3.5 py-2 rounded-xl border border-sky-200">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{currentStepData.details.tag}</span>
              </div>
            </div>

            {/* Right Col: Visual Interactive Graphic Simulation */}
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepData.step}
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl p-6 sm:p-7 shadow-lg border text-white relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)`,
                    borderColor: '#334155',
                  }}
                >
                  {/* Step 1 Visual Simulation: Form Order Sent to WhatsApp */}
                  {currentStepData.step === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-xs text-slate-200">Simulasi Form Pemesanan</span>
                        </div>
                        <span className="text-[10px] bg-sky-500 text-white font-extrabold px-2 py-0.5 rounded-full">
                          Draft Ready
                        </span>
                      </div>

                      <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2.5 text-xs">
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Paket:</span>
                          <span className="font-bold text-emerald-400">Flash Sale Rp 499.000 All-in</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Pengerjaan:</span>
                          <span className="font-bold text-white">1 Hari Kerja (24 Jam)</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Tujuan WA Admin:</span>
                          <span className="font-bold text-white">{ADMIN_WA_DISPLAY}</span>
                        </div>
                        <div className="p-2.5 bg-emerald-950/60 rounded-xl border border-emerald-800/60 flex items-center gap-2 text-emerald-300 text-[11px]">
                          <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Draf dikirim otomatis ke aplikasi WhatsApp Anda.</span>
                        </div>
                      </div>

                      <button
                        onClick={() => scrollToSection('formulir-order')}
                        className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <span>Ke Formulir Pemesanan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Step 2 Visual Simulation: Invoice Payment Link */}
                  {currentStepData.step === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                            <Link2 className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-xs text-slate-200">Invoice Link Indo Digital</span>
                        </div>
                        <span className="text-[10px] bg-indigo-500 text-white font-extrabold px-2 py-0.5 rounded-full">
                          SSL Secure
                        </span>
                      </div>

                      <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2.5 text-xs font-mono">
                        <div className="text-[11px] text-indigo-300 truncate p-2 bg-slate-900 rounded-lg border border-slate-700">
                          🔒 https://pay.indodigital.myr.id/inv/WK-499RB
                        </div>
                        <div className="space-y-1.5 text-slate-300 text-[11px] font-sans">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Jumlah Pembayaran:</span>
                            <span className="font-bold text-emerald-400">Rp 499.000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Penerima Resmi:</span>
                            <span className="font-bold text-white">Indo Digital Solution</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Data Dibutuhkan:</span>
                            <span className="text-white">Nama, Email, & No. WhatsApp</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-indigo-950/60 rounded-xl border border-indigo-800/60 flex items-center gap-2 text-indigo-200 text-[11px]">
                        <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>Sistem pembayaran otomatis langsung tercatat resmi.</span>
                      </div>
                    </div>
                  )}

                  {/* Step 3 Visual Simulation: Payment Channels (QRIS, VA, Minimarket, E-Wallet) */}
                  {currentStepData.step === 3 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-xs text-slate-200">Pilihan Kanal Pembayaran</span>
                        </div>
                        <span className="text-[10px] bg-purple-500 text-white font-extrabold px-2 py-0.5 rounded-full">
                          Multi-Channel
                        </span>
                      </div>

                      {/* Payment Grid Badges */}
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                            <QrCode className="w-4 h-4" />
                            <span>QRIS Instan</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Semua Bank & Dompet Digital</span>
                        </div>

                        <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                            <Building2 className="w-4 h-4" />
                            <span>Virtual Account</span>
                          </div>
                          <span className="text-[10px] text-slate-400">BCA, Mandiri, BRI, BNI</span>
                        </div>

                        <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                            <Store className="w-4 h-4" />
                            <span>Alfamart / Mart</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Bayar Tunai di Kasir</span>
                        </div>

                        <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <Wallet className="w-4 h-4" />
                            <span>E-Wallet</span>
                          </div>
                          <span className="text-[10px] text-slate-400">GoPay, OVO, DANA, Shopee</span>
                        </div>
                      </div>

                      {/* Bank Transfer Channels Logo Image */}
                      <div className="bg-white rounded-2xl p-2.5 border border-slate-700 shadow-sm">
                        <div className="text-[10px] font-bold text-slate-600 mb-1.5 flex items-center justify-between">
                          <span>Mendukung Transfer Bank & Virtual Account:</span>
                          <span className="text-emerald-700 font-extrabold text-[9px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Bebas Biaya Admin</span>
                        </div>
                        <img
                          src="/assets/aistudio/transfer-antar-bank-gratis-scaled-1_1561b3d5.jpg"
                          alt="Logo Metode Pembayaran Bank: BNI, BRI, Mandiri, BCA, CIMB Niaga, Muamalat, BTPN, Jenius, Permata, Digibank"
                          className="w-full h-auto object-contain rounded-lg max-h-24 sm:max-h-28 mx-auto"
                          loading="lazy"
                        />
                      </div>

                      <div className="text-[10px] text-slate-400 text-center">
                        🔒 Pembayaran otomatis terverifikasi tanpa biaya tambahan.
                      </div>
                    </div>
                  )}

                  {/* Step 4 Visual Simulation: Transfer Confirmation to Admin */}
                  {currentStepData.step === 4 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-xs text-slate-200">Konfirmasi Bukti Transfer</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Terverifikasi</span>
                        </span>
                      </div>

                      <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3 text-xs">
                        <div className="flex items-center gap-3 p-2.5 bg-emerald-950/60 rounded-xl border border-emerald-800/60">
                          <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs">
                            ✓
                          </div>
                          <div>
                            <div className="font-bold text-emerald-300 text-[11px]">Pembayaran Rp 499.000 Terverifikasi</div>
                            <div className="text-[10px] text-slate-400">Diteruskan ke Tim Produksi Web</div>
                          </div>
                        </div>

                        <div className="space-y-1 text-slate-300 text-[11px]">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Target Selesai: <strong>Maksimal 24 Jam Kerja</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span>Status: <strong>Dalam Proses Desain & Copywriting</strong></span>
                          </div>
                        </div>
                      </div>

                      <a
                        href={`https://wa.me/${ADMIN_WA_NUMBER}?text=Halo%20Admin%20Indo%20Digital,%20saya%20sudah%20melakukan%20pembayaran%20jasa%20landing%20page%20Rp%20499rb.%20Berikut%20bukti%20transfernya.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Kirim Bukti ke WhatsApp Admin</span>
                      </a>
                    </div>
                  )}

                  {/* Step 5 Visual Simulation: Demo Web Review & Domain Propagation */}
                  {currentStepData.step === 5 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <Globe className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-xs text-slate-200">Demo Web & Propagasi Domain</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full">
                          Live Active
                        </span>
                      </div>

                      <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2.5 text-xs">
                        <div className="text-[11px] text-emerald-300 font-mono p-2 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
                          <span>🔒 https://bisnisanda.my.id</span>
                          <span className="text-[9px] bg-emerald-900 text-emerald-300 px-1.5 py-0.5 rounded">Domain Aktif 1 Tahun</span>
                        </div>

                        <div className="space-y-1.5 text-slate-300 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>1x Revisi Minor Gratis (Teks & Foto Produk)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Form Order Terhubung ke WhatsApp Penjual</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Gratis SSL/HTTPS & Cloud Hosting Cepat</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-sky-950/60 rounded-xl border border-sky-800/60 text-center text-sky-200 text-[11px] font-semibold">
                        🚀 Website resmi Anda siap menerima pesanan 24 jam nonstop!
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Banner with Quick CTA to Step 1 */}
        <div className="p-6 bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Garansi 1 Hari Jadi • Promo Flash Sale Rp 499.000</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Siap Memulai Langkah 1 Sekarang?
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
              Cukup isi formulir singkat di bawah ini. Tim Indo Digital siap mendampingi Anda dari awal hingga website tayang!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => scrollToSection('formulir-order')}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Mulai Langkah 1 (Isi Formulir)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/${ADMIN_WA_NUMBER}?text=Halo%20Admin%20Indo%20Digital,%20saya%20ingin%20tanya%20seputar%20alur%20pemesanan%20landing%20page%20Rp%20499rb.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl transition-all border border-white/20 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Tanya Admin WA</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
