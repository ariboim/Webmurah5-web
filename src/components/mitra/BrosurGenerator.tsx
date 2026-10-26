import React, { useState, useRef } from 'react';
import {
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Phone,
  Globe,
  Tag,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  Eye,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { MitraAccount, BrosurStyle } from '../../types/mitra';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

interface BrosurGeneratorProps {
  mitra: MitraAccount;
}

export const BrosurGenerator: React.FC<BrosurGeneratorProps> = ({ mitra }) => {
  const [selectedStyle, setSelectedStyle] = useState<BrosurStyle>('bold_conversion');
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const printContainerRef = useRef<HTMLDivElement | null>(null);

  const referralUrl = `https://webmurah.biz.id/?ref=${encodeURIComponent(mitra.id)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(referralUrl)}`;

  const handleDownloadPdf = async () => {
    if (!printContainerRef.current) return;
    setIsExporting(true);
    setExportNotice(null);

    const safeName = mitra.namaLengkap.replace(/[^a-zA-Z0-9]/g, '_') || 'Mitra';
    const filename = `Brosur-A4-${selectedStyle}-${safeName}.pdf`;

    try {
      const element = printContainerRef.current;

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
      pdf.save(filename);

      setExportNotice(`Brosur (${selectedStyle}) berhasil diunduh dalam format PDF Siap Cetak A4!`);
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error('Error generating brochure PDF:', err);
      // Fallback
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Selector & Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-slate-900">
              3 Style Brosur Promosi Full Color (Ukuran A4)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Materi promosi resmi PT INOVASI TEKNOLOGI DIGITAL INDONESIA siap cetak &amp; disebarkan secara digital. Data kontak &amp; QR code mitra otomatis terintegrasi.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Langsung</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D3582] hover:bg-[#152764] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh PDF A4 (300 DPI)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Style Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Style 1 Button */}
        <button
          type="button"
          onClick={() => setSelectedStyle('minimalist')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedStyle === 'minimalist'
              ? 'border-[#1D3582] bg-blue-50/60 ring-2 ring-blue-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Style 1
            </span>
            {selectedStyle === 'minimalist' && (
              <span className="w-2 h-2 rounded-full bg-[#1D3582]" />
            )}
          </div>
          <div className="text-sm font-black text-slate-900">Modern Minimalist &amp; Clean</div>
          <div className="text-xs text-slate-500 mt-1">
            Fokus tipografi tegas, whitespace rapi, infografis ringkas &amp; modern.
          </div>
        </button>

        {/* Style 2 Button */}
        <button
          type="button"
          onClick={() => setSelectedStyle('bold_conversion')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedStyle === 'bold_conversion'
              ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
              Style 2 (High Conversion)
            </span>
            {selectedStyle === 'bold_conversion' && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </div>
          <div className="text-sm font-black text-slate-900">Bold &amp; High Conversion</div>
          <div className="text-xs text-slate-500 mt-1">
            Warna kontras, headline promo 50% besar, badge garansi &amp; eye-catching.
          </div>
        </button>

        {/* Style 3 Button */}
        <button
          type="button"
          onClick={() => setSelectedStyle('elegant_corporate')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedStyle === 'elegant_corporate'
              ? 'border-slate-800 bg-slate-900 text-white ring-2 ring-slate-800/40'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider ${
                selectedStyle === 'elegant_corporate' ? 'text-amber-400' : 'text-slate-500'
              }`}
            >
              Style 3
            </span>
            {selectedStyle === 'elegant_corporate' && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </div>
          <div
            className={`text-sm font-black ${
              selectedStyle === 'elegant_corporate' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Professional &amp; Elegant
          </div>
          <div
            className={`text-xs mt-1 ${
              selectedStyle === 'elegant_corporate' ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Tata letak korporat, aksen emas/navy premium, tabel paket UMKM vs Elite.
          </div>
        </button>
      </div>

      {/* Live Preview Container (Scrollable on small screens, A4 aspect ratio 1:1.414) */}
      <div className="bg-slate-800/90 p-4 sm:p-8 rounded-3xl overflow-x-auto flex justify-center shadow-inner">
        <div
          ref={printContainerRef}
          style={{ width: '794px', minHeight: '1123px' }}
          className="bg-white text-slate-900 shadow-2xl relative shrink-0 p-8 flex flex-col justify-between font-sans leading-relaxed box-border"
        >
          {/* ================= STYLE 1: MODERN MINIMALIST & CLEAN ================= */}
          {selectedStyle === 'minimalist' && (
            <div className="h-full flex flex-col justify-between space-y-6">
              {/* Header Letterhead */}
              <div>
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#1D3582] text-white flex items-center justify-center font-black text-xl">
                      W
                    </div>
                    <div>
                      <div className="text-xl font-black tracking-tight text-slate-950">
                        WEBMURAH.BIZ.ID
                      </div>
                      <div className="text-[10px] tracking-widest uppercase font-bold text-[#1D3582]">
                        PT INOVASI TEKNOLOGI DIGITAL INDONESIA
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-extrabold uppercase tracking-wider">
                      Layanan Solusi Digital UMKM
                    </span>
                  </div>
                </div>

                {/* Hero Headline */}
                <div className="mt-8 space-y-3">
                  <div className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">
                    Tingkatkan Kredibilitas Usaha Anda Sekarang
                  </div>
                  <h1 className="text-4xl font-black text-slate-950 leading-tight">
                    Website Landing Page Bisnis Profesional <br />
                    <span className="text-[#1D3582]">1 Hari Jadi &bull; Bebas Ribet.</span>
                  </h1>
                  <p className="text-slate-600 text-sm max-w-2xl">
                    Jadikan bisnis Anda lebih dipercaya oleh calon pelanggan, mudah ditemukan di Google, dan siap menerima pesanan 24 jam nonstop dengan landing page berkecepatan tinggi.
                  </p>
                </div>
              </div>

              {/* 3 Main Highlights */}
              <div className="grid grid-cols-3 gap-4 border-y border-slate-200 py-6">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#1D3582] flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="font-black text-sm text-slate-900">Selesai 1x24 Jam</div>
                  <div className="text-xs text-slate-500 leading-snug">
                    Proses kilat, materi dibantu sampai online tanpa biaya tersembunyi.
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="font-black text-sm text-slate-900">Free Domain &amp; SSL</div>
                  <div className="text-xs text-slate-500 leading-snug">
                    Domain .biz.id / .com resmi, hosting cloud cepat, dan sertifikat keamanan.
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="font-black text-sm text-slate-900">WhatsApp Direct CTA</div>
                  <div className="text-xs text-slate-500 leading-snug">
                    Pengunjung langsung diarahkan memesan ke WhatsApp Anda secara praktis.
                  </div>
                </div>
              </div>

              {/* Price Cards Minimalist */}
              <div className="grid grid-cols-2 gap-6">
                {/* Paket UMKM */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-700">Paket UMKM</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                        Promo Diskon 50%
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-slate-400 line-through">Rp 499.000</div>
                      <div className="text-3xl font-black text-[#1D3582]">Rp 249.500</div>
                    </div>
                    <ul className="mt-4 space-y-2 text-xs text-slate-600">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Landing Page 1 Halaman Lengkap
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Gratis Domain &amp; Cloud Hosting
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Integrasi Tombol WhatsApp
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Selesai Cepat dalam 24 Jam
                      </li>
                    </ul>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 pt-2 border-t border-slate-200">
                    *Promo berlaku via kode referral mitra
                  </div>
                </div>

                {/* Paket Elite */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-amber-400">
                        Paket Elite (Web Custom)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                        Corporate Grade
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-slate-400">Fixed Net</div>
                      <div className="text-3xl font-black text-white">Rp 3.000.000</div>
                    </div>
                    <ul className="mt-4 space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Sampai 7 Halaman Custom
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Desain Eksklusif &amp; SEO On-Page
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Pengerjaan 5 - 7 Hari Kerja
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> DP 50%, Pelunasan Pas Selesai
                      </li>
                    </ul>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 pt-2 border-t border-slate-800">
                    *Garansi revisi &amp; pendampingan teknis
                  </div>
                </div>
              </div>

              {/* Footer / Partner Contact Bar */}
              <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[11px] font-extrabold uppercase text-[#1D3582] tracking-wider">
                    Official Digital Consultant / Mitra Resmi:
                  </div>
                  <div className="text-lg font-black text-slate-950">{mitra.namaLengkap}</div>
                  <div className="text-xs text-slate-600 flex items-center gap-3">
                    <span className="font-mono">ID: {mitra.id}</span>
                    <span>&bull;</span>
                    <span className="font-bold flex items-center gap-1 text-emerald-700">
                      <Phone className="w-3 h-3" /> WA: {mitra.noHpWa}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code Referral"
                    className="w-16 h-16 object-contain"
                  />
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase text-slate-800">Scan QR Code</div>
                    <div className="text-[9px] text-slate-500 leading-tight">
                      Konsultasi gratis &amp; <br /> klaim promo Anda
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STYLE 2: BOLD & HIGH CONVERSION ================= */}
          {selectedStyle === 'bold_conversion' && (
            <div className="h-full flex flex-col justify-between space-y-5 bg-gradient-to-b from-sky-50 via-white to-amber-50/40 p-2 rounded-2xl">
              {/* Top Banner Tagline */}
              <div className="bg-[#1D3582] text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                    ★
                  </div>
                  <div className="text-sm font-black uppercase tracking-wider">
                    PT INOVASI TEKNOLOGI DIGITAL INDONESIA &bull; WEBMURAH.BIZ.ID
                  </div>
                </div>
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
                  Flash Sale Hari Ini!
                </div>
              </div>

              {/* Bold Headline */}
              <div className="text-center space-y-3 py-2">
                <div className="inline-block px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xs">
                  DISKON SPESIAL 50% UNTUK PELAKU USAHA &amp; UMKM
                </div>
                <h1 className="text-4xl font-black text-slate-950 tracking-tight leading-none">
                  BIKIN BISNIS ANDA MAKIN MELEJIT <br />
                  DENGAN WEBSITE LANDING PAGE RESMI!
                </h1>
                <p className="text-slate-700 text-sm font-semibold max-w-xl mx-auto">
                  Jangan kalah saing dengan kompetitor. Dapatkan website siap jualan dalam 24 jam dengan harga super terjangkau!
                </p>
              </div>

              {/* Big Price Highlight Banner */}
              <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-amber-200">
                    Harga Normal Rp 499.000
                  </span>
                  <div className="text-5xl font-black tracking-tight text-white drop-shadow-sm">
                    Rp 249.500
                  </div>
                  <div className="text-xs text-white/90 font-medium">
                    *Bayar sekali untuk 1 tahun penuh, tanpa biaya tersembunyi!
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="inline-block px-3 py-1.5 rounded-xl bg-white text-red-600 font-black text-sm uppercase shadow-sm">
                    HEMAT 50%
                  </div>
                  <div className="text-xs text-amber-100 font-bold">1 Hari Kerja Selesai</div>
                </div>
              </div>

              {/* 6 Grid Benefits */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-sky-100 shadow-2xs space-y-1">
                  <div className="text-[#1D3582] font-black text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Siap Dalam 24 Jam
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Cepat tanpa perlu paham koding teknis yang ribet.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-sky-100 shadow-2xs space-y-1">
                  <div className="text-[#1D3582] font-black text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free Domain &amp; SSL
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Website aman berlogo gembok hijau di browser Google.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-sky-100 shadow-2xs space-y-1">
                  <div className="text-[#1D3582] font-black text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Desain Responsif HP
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Tampilan ringan &amp; nyaman dibuka di seluruh smartphone.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-sky-100 shadow-2xs space-y-1">
                  <div className="text-[#1D3582] font-black text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tombol WhatsApp Order
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Orderan langsung masuk ke nomor WhatsApp penjual.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-sky-100 shadow-2xs space-y-1">
                  <div className="text-[#1D3582] font-black text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> SEO Dasar Google
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Mudah dicari dan diindeks oleh calon pembeli di internet.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-sky-100 shadow-2xs space-y-1">
                  <div className="text-[#1D3582] font-black text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Bantuan Input Konten
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Foto produk &amp; kata-kata penawaran dibantu dirapikan.
                  </p>
                </div>
              </div>

              {/* Call to Action & Partner Profile */}
              <div className="bg-[#1D3582] text-white p-5 rounded-2xl shadow-lg flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-amber-400 font-extrabold text-[11px] uppercase tracking-wider">
                    HUBUNGI KONSULTAN RESMI KAMI:
                  </span>
                  <div className="text-xl font-black text-white">{mitra.namaLengkap}</div>
                  <div className="text-xs text-sky-200">
                    ID Mitra: <span className="font-mono font-bold text-white">{mitra.id}</span>
                  </div>
                  <div className="text-base font-extrabold text-amber-300 flex items-center gap-1.5 pt-1">
                    <Phone className="w-4 h-4 text-emerald-400" /> WhatsApp: {mitra.noHpWa}
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-2xl flex flex-col items-center text-slate-900 shadow-md">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code Mitra"
                    className="w-20 h-20 object-contain"
                  />
                  <span className="text-[9px] font-black uppercase text-slate-700 mt-1">
                    Scan Untuk Klaim Promo
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================= STYLE 3: PROFESSIONAL & ELEGANT ================= */}
          {selectedStyle === 'elegant_corporate' && (
            <div className="h-full flex flex-col justify-between space-y-6 bg-slate-950 text-slate-100 p-4 rounded-2xl border border-slate-800">
              {/* Top Corporate Bar */}
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs tracking-widest uppercase font-bold text-amber-400">
                    Corporate Digital Solution
                  </div>
                  <div className="text-xl font-black text-white tracking-tight">
                    PT INOVASI TEKNOLOGI DIGITAL INDONESIA
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-400 font-mono">
                  webmurah.biz.id &bull; Jakarta - Bekasi
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
                  Katalog Resmi Layanan Pembuatan Website
                </span>
                <h1 className="text-3xl font-black text-white leading-tight">
                  Arsitektur Web Modern, Cepat &amp; Berorientasi Konversi Tinggi
                </h1>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                  Dirancang khusus untuk membantu transformasi digital bisnis skala mikro, kecil, menengah, hingga level korporasi dengan standar keamanan tinggi dan performa optimal.
                </p>
              </div>

              {/* Comparison Table UMKM vs Elite */}
              <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden text-xs">
                <div className="grid grid-cols-3 bg-slate-800/80 p-3 font-black text-slate-300 uppercase tracking-wider text-[11px]">
                  <div>Fitur &amp; Spesifikasi</div>
                  <div className="text-center text-sky-400">Paket UMKM</div>
                  <div className="text-center text-amber-400">Paket Elite (Custom)</div>
                </div>

                <div className="divide-y divide-slate-800">
                  <div className="grid grid-cols-3 p-3 items-center">
                    <span className="font-semibold text-slate-300">Biaya Investasi</span>
                    <span className="text-center font-bold text-sky-300">Rp 249.500 (Promo)</span>
                    <span className="text-center font-bold text-amber-300">Rp 3.000.000 (Net)</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 items-center">
                    <span className="font-semibold text-slate-300">Jumlah Halaman</span>
                    <span className="text-center text-slate-400">1 Halaman (High-Convert)</span>
                    <span className="text-center text-slate-200">Hingga 7 Halaman Custom</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 items-center">
                    <span className="font-semibold text-slate-300">Waktu Pengerjaan</span>
                    <span className="text-center text-emerald-400">1x24 Jam Kerja</span>
                    <span className="text-center text-amber-400">5 - 7 Hari Kerja</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 items-center">
                    <span className="font-semibold text-slate-300">Skema Pembayaran</span>
                    <span className="text-center text-slate-400">Lunas di Awal</span>
                    <span className="text-center text-slate-200">DP 50%, Selesai 50%</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 items-center">
                    <span className="font-semibold text-slate-300">Domain &amp; SSL Cloud</span>
                    <span className="text-center text-emerald-400">Tersedia (Gratis)</span>
                    <span className="text-center text-emerald-400">Tersedia (Domain .com/.id)</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 items-center">
                    <span className="font-semibold text-slate-300">Optimasi SEO &amp; Speed</span>
                    <span className="text-center text-slate-400">Standar On-Page</span>
                    <span className="text-center text-amber-300">Lengkap + PageSpeed 90+</span>
                  </div>
                </div>
              </div>

              {/* Corporate Footer with Consultant Bio */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                    VERIFIED PARTNERSHIP SPECIALIST
                  </div>
                  <div className="text-lg font-black text-white">{mitra.namaLengkap}</div>
                  <div className="text-xs text-slate-400">
                    ID Akreditasi: <span className="font-mono text-slate-200 font-bold">{mitra.id}</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-400 pt-1">
                    Kontak WhatsApp: {mitra.noHpWa}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white text-slate-950 p-2.5 rounded-xl">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-16 h-16 object-contain"
                  />
                  <div className="text-[10px] font-bold">
                    <span>Scan Portal</span> <br />
                    <span className="text-slate-500 font-normal">Kemitraan Resmi</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
