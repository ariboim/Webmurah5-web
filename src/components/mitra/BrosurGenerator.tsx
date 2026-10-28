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
  Share2,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { MitraAccount, BrosurStyle } from '../../types/mitra';
import { IndoDigitalLogo } from '../IndoDigitalLogo';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

interface BrosurGeneratorProps {
  mitra: MitraAccount;
}

export const BrosurGenerator: React.FC<BrosurGeneratorProps> = ({ mitra }) => {
  const [selectedStyle, setSelectedStyle] = useState<BrosurStyle>('bold_conversion');
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const printContainerRef = useRef<HTMLDivElement | null>(null);

  const replicaUrl = mitra.slug
    ? `https://www.webmurah.biz.id/reff/${mitra.slug}`
    : `https://webmurah.biz.id/?ref=${encodeURIComponent(mitra.id)}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(replicaUrl)}`;

  // Download high-resolution PNG for online promotion (WhatsApp Status, Instagram, Facebook)
  const handleDownloadImage = async () => {
    if (!printContainerRef.current) return;
    setIsExporting(true);
    setExportNotice(null);

    const safeName = mitra.namaLengkap.replace(/[^a-zA-Z0-9]/g, '_') || 'Mitra';
    const filename = `Brosur-Online-A5-${selectedStyle}-${safeName}.png`;

    try {
      const element = printContainerRef.current;
      const canvas = await html2canvas(element, {
        scale: 3, // 3x sharp resolution for mobile & social media posting
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      setExportNotice(`Brosur (${selectedStyle}) berhasil diunduh dalam format Gambar PNG HD untuk Promosi Online!`);
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error('Error generating brochure image:', err);
      setExportNotice('Gagal mengunduh gambar. Silakan coba kembali.');
    } finally {
      setIsExporting(false);
    }
  };

  // Download PDF Half-A4 (A5 format standard: 148mm x 210mm)
  const handleDownloadPdf = async () => {
    if (!printContainerRef.current) return;
    setIsExporting(true);
    setExportNotice(null);

    const safeName = mitra.namaLengkap.replace(/[^a-zA-Z0-9]/g, '_') || 'Mitra';
    const filename = `Brosur-SetengahA4-A5-${selectedStyle}-${safeName}.pdf`;

    try {
      const element = printContainerRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // A5 is standard half-A4: 148 mm × 210 mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5',
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 148mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 210mm

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
      pdf.save(filename);

      setExportNotice(`Brosur (${selectedStyle}) berhasil diunduh dalam format PDF Setengah A4 (A5)!`);
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error('Error generating brochure PDF:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCaption = () => {
    const caption = `🚀 *PROMO PEMBUATAN WEBSITE LANDING PAGE KILAT 24 JAM!*

Punya bisnis tapi belum punya website resmi? Bikin calon pelanggan lebih percaya dan siap closing 24 jam nonstop!

✨ *Keunggulan Layanan Kami:*
✅ Pengerjaan Kilat 1 Hari Selesai
✅ Gratis Domain Resmi (.my.id/.biz.id) & Cloud Hosting 1 Tahun
✅ Tombol WhatsApp Order Langsung
✅ Desain Responsif & Ramah Handphone
✅ Bayar Setelah Jadi (100% Bebas Risiko!)

🔥 *Promo Spesial UMKM Hari Ini:*
Hanya *Rp 249.500* (Diskon 50% dari harga normal Rp 499.000)

Konsultasi gratis & pesan langsung melalui web resmi saya:
👉 ${replicaUrl}

Atau hubungi WhatsApp: https://wa.me/${mitra.phoneInternational || mitra.noHpWa.replace(/\D/g, '')}
*Konsultan Resmi:* ${mitra.namaLengkap} (ID: ${mitra.id})
PT INOVASI TEKNOLOGI DIGITAL INDONESIA`;

    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Selector & Controls */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-100 text-sky-800">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                3 Model Brosur Setengah A4 (Pola Putih &amp; Biru Muda)
              </h3>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 inline-block mt-0.5">
                Format Pas Layar HP &bull; Siap Download untuk Promosi Online
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Materi promosi resmi dari <strong>PT INOVASI TEKNOLOGI DIGITAL INDONESIA</strong> dengan Logo Resmi Indo Digital. Didesain proporsional ukuran <strong>Setengah A4 (A5)</strong> dengan pola warna dasar putih dan biru muda, dilengkapi QR code dan kontak WhatsApp Anda.
          </p>
        </div>

        {/* Action Buttons for Online Promotion */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyCaption}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-bold transition-all cursor-pointer"
            title="Salin teks caption promosi medsos"
          >
            {copiedCaption ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-sky-700" />}
            <span>{copiedCaption ? 'Caption Tersalin!' : 'Salin Caption'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-black shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title="Download gambar PNG HD untuk WA Status, IG Story & Facebook"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Unduh Gambar (PNG HD)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1D3582] hover:bg-[#152764] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title="Unduh format PDF Setengah A4 (A5)"
          >
            <Printer className="w-4 h-4" />
            <span>Unduh PDF (A5)</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* 3 Model Selection Tabs (White & Light Blue Variations) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Model 1 Button */}
        <button
          type="button"
          onClick={() => setSelectedStyle('minimalist')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedStyle === 'minimalist'
              ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-400/30 shadow-xs'
              : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/30'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-800">
              Model 1 &bull; Sky Clean
            </span>
            {selectedStyle === 'minimalist' && (
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse" />
            )}
          </div>
          <div className="text-sm font-black text-slate-900">Modern Clean &amp; Infografis</div>
          <div className="text-xs text-slate-600 mt-1">
            Dasar putih bersih dengan aksen biru langit lembut, 3 pilar fitur kilat &amp; rincian harga transparan.
          </div>
        </button>

        {/* Model 2 Button */}
        <button
          type="button"
          onClick={() => setSelectedStyle('bold_conversion')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedStyle === 'bold_conversion'
              ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-400/30 shadow-xs'
              : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/30'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-800">
              Model 2 &bull; Promo 50% Flash
            </span>
            {selectedStyle === 'bold_conversion' && (
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse" />
            )}
          </div>
          <div className="text-sm font-black text-slate-900">Fresh High-Conversion</div>
          <div className="text-xs text-slate-600 mt-1">
            Gradien biru muda ke putih, banner harga promo Rp 249.500 eye-catching, 6 poin benefit UMKM.
          </div>
        </button>

        {/* Model 3 Button */}
        <button
          type="button"
          onClick={() => setSelectedStyle('elegant_corporate')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedStyle === 'elegant_corporate'
              ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-400/30 shadow-xs'
              : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/30'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-800">
              Model 3 &bull; Corporate Blue
            </span>
            {selectedStyle === 'elegant_corporate' && (
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse" />
            )}
          </div>
          <div className="text-sm font-black text-slate-900">Corporate Trust &amp; Katalog</div>
          <div className="text-xs text-slate-600 mt-1">
            Frame biru muda elegan, tabel perbandingan Paket UMKM vs Elite, lencana garansi resmi PT ITDI.
          </div>
        </button>
      </div>

      {/* Live Preview Container (Proportional Half-A4 / A5 size, fully responsive on mobile) */}
      <div className="bg-slate-900/80 p-3 sm:p-6 rounded-3xl flex flex-col items-center justify-center shadow-inner overflow-hidden">
        <div className="text-center mb-3 text-slate-300 text-xs flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-sky-400" />
          <span>Pratinjau Brosur Setengah A4 (148 x 210 mm) &bull; Format Promosi Online</span>
        </div>

        {/* The Brochure Canvas (Half A4 proportional width max-w-[430px]) */}
        <div
          ref={printContainerRef}
          className="w-full max-w-[430px] bg-white text-slate-900 shadow-2xl rounded-2xl relative p-4 sm:p-5 flex flex-col justify-between font-sans leading-relaxed box-border border-2 border-sky-100"
          style={{ minHeight: '610px' }}
        >
          {/* ========================================================================= */}
          {/* MODEL 1: MODERN CLEAN & INFOGRAFIS (PUTIH & BIRU LANGIT)                  */}
          {/* ========================================================================= */}
          {selectedStyle === 'minimalist' && (
            <div className="flex flex-col justify-between h-full space-y-3.5 bg-gradient-to-b from-sky-50/60 via-white to-sky-50/40 p-1 rounded-xl">
              {/* Header: IndoDigital Logo & Official Identity */}
              <div>
                <div className="flex items-center justify-between border-b-2 border-sky-200 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <IndoDigitalLogo size="sm" showTagline={false} />
                    <div>
                      <div className="text-xs font-black text-[#1D3582] tracking-tight leading-none">
                        PT INOVASI TEKNOLOGI DIGITAL INDONESIA
                      </div>
                      <div className="text-[10px] font-black text-sky-600 font-mono mt-0.5">
                        WEBMURAH.BIZ.ID
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 text-[9px] font-extrabold uppercase border border-sky-200">
                    Official UMKM Solution
                  </span>
                </div>

                {/* Hero Headline */}
                <div className="mt-3.5 space-y-1.5 text-left">
                  <span className="inline-block px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[9px] font-black uppercase tracking-wider">
                    Solusi Cepat &bull; Bebas Ribet
                  </span>
                  <h1 className="text-lg sm:text-xl font-black text-slate-950 leading-tight">
                    Website Landing Page Bisnis &amp; UMKM <br />
                    <span className="text-[#1D3582]">1 Hari Jadi &bull; Siap Jualan 24 Jam</span>
                  </h1>
                  <p className="text-slate-600 text-[11px] leading-snug font-medium">
                    Tingkatkan omzet dan kepercayaan pelanggan dengan website berkecepatan tinggi, aman, dan langsung terhubung ke WhatsApp.
                  </p>
                </div>
              </div>

              {/* 3 Core Highlights in Light Blue Box */}
              <div className="grid grid-cols-3 gap-2 bg-sky-50/90 p-2.5 rounded-xl border border-sky-200/80 text-center">
                <div className="space-y-0.5">
                  <div className="w-6 h-6 mx-auto rounded-lg bg-sky-200/80 text-[#1D3582] flex items-center justify-center font-bold">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-black text-[10px] text-slate-900">Selesai 24 Jam</div>
                  <div className="text-[8px] text-slate-500 leading-tight">Bebas ribet koding</div>
                </div>

                <div className="space-y-0.5 border-x border-sky-200 px-1">
                  <div className="w-6 h-6 mx-auto rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-black text-[10px] text-slate-900">Free Domain &amp; SSL</div>
                  <div className="text-[8px] text-slate-500 leading-tight">Gembok aman Google</div>
                </div>

                <div className="space-y-0.5">
                  <div className="w-6 h-6 mx-auto rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-black text-[10px] text-slate-900">WhatsApp Order</div>
                  <div className="text-[8px] text-slate-500 leading-tight">Closing order cepat</div>
                </div>
              </div>

              {/* Pricing Cards (White & Light Blue) */}
              <div className="bg-white p-3 rounded-xl border border-sky-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                    Paket UMKM Kilat
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase border border-emerald-300">
                    Promo Diskon 50%
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-slate-400 line-through">Rp 499.000</span>
                    <span className="text-2xl font-black text-[#1D3582]">Rp 249.500</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Bayar Setelah Jadi!
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-700 font-medium pt-0.5">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Domain &amp; Cloud Hosting</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Desain Responsif HP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Copywriting Siap Pakai</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Free Revisi &amp; Garansi</span>
                  </div>
                </div>
              </div>

              {/* Partner Contact & QR Code Footer */}
              <div className="bg-sky-50/90 p-2.5 rounded-xl border border-sky-200 flex items-center justify-between gap-2.5">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-[9px] font-black uppercase text-[#1D3582] tracking-wider">
                    Konsultan Resmi Mitra PT ITDI:
                  </div>
                  <div className="text-sm font-black text-slate-900 truncate">
                    {mitra.namaLengkap}
                  </div>
                  <div className="text-[10px] text-slate-600 flex items-center gap-1.5">
                    <span className="font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 font-bold">
                      {mitra.id}
                    </span>
                  </div>
                  <div className="text-[11px] font-extrabold text-emerald-700 flex items-center gap-1 pt-0.5">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>WA: {mitra.noHpWa}</span>
                  </div>
                </div>

                <div className="bg-white p-1.5 rounded-lg border border-sky-200 shadow-2xs flex flex-col items-center shrink-0">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-14 h-14 object-contain"
                  />
                  <span className="text-[7.5px] font-black text-slate-600 uppercase mt-0.5">
                    Scan Konsultasi
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODEL 2: FRESH PROMO 50% FLASH (GRADASI BIRU MUDA KE PUTIH)                */}
          {/* ========================================================================= */}
          {selectedStyle === 'bold_conversion' && (
            <div className="flex flex-col justify-between h-full space-y-3 bg-gradient-to-b from-sky-100/70 via-white to-sky-50/70 p-1 rounded-xl">
              {/* Header: IndoDigital Logo & Official Identity */}
              <div>
                <div className="flex items-center justify-between border-b-2 border-sky-300 pb-2">
                  <div className="flex items-center gap-2">
                    <IndoDigitalLogo size="sm" showTagline={false} />
                    <div>
                      <div className="text-xs font-black text-[#1D3582] tracking-tight leading-none">
                        PT INOVASI TEKNOLOGI DIGITAL INDONESIA
                      </div>
                      <div className="text-[10px] font-bold text-sky-700 font-mono">
                        WEBMURAH.BIZ.ID
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse shadow-xs">
                    Flash Sale
                  </span>
                </div>

                {/* Bold Promo Headline */}
                <div className="mt-3 text-center space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-2xs">
                    Diskon Spesial 50% Pelaku Usaha &amp; UMKM
                  </span>
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                    Bikin Bisnis Anda Makin Melejit dengan Website Landing Page Resmi!
                  </h1>
                </div>
              </div>

              {/* Price Highlight Banner in Light Sky Gradient */}
              <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 text-white p-3 rounded-xl shadow-md flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-sky-100 tracking-wider">
                    Harga Normal Rp 499.000
                  </span>
                  <div className="text-2xl font-black tracking-tight text-white drop-shadow-xs">
                    Rp 249.500
                  </div>
                  <div className="text-[8.5px] text-sky-100 font-medium">
                    *Bayar setelah jadi &bull; 100% Bebas Risiko
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="inline-block px-2 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs uppercase shadow-xs">
                    HEMAT 50%
                  </span>
                  <div className="text-[9px] text-white font-bold">1 Hari Selesai</div>
                </div>
              </div>

              {/* 4 Feature Cards (White on Light Blue Grid) */}
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-white p-2 rounded-lg border border-sky-200/80 shadow-2xs space-y-0.5">
                  <div className="text-[#1D3582] font-black text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Free Domain &amp; SSL</span>
                  </div>
                  <p className="text-[8.5px] text-slate-600 leading-snug">
                    Alamat web resmi &amp; gembok aman Google.
                  </p>
                </div>

                <div className="bg-white p-2 rounded-lg border border-sky-200/80 shadow-2xs space-y-0.5">
                  <div className="text-[#1D3582] font-black text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Pengerjaan 24 Jam</span>
                  </div>
                  <p className="text-[8.5px] text-slate-600 leading-snug">
                    Kilat, materi langsung dibantu susun.
                  </p>
                </div>

                <div className="bg-white p-2 rounded-lg border border-sky-200/80 shadow-2xs space-y-0.5">
                  <div className="text-[#1D3582] font-black text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Tombol WhatsApp</span>
                  </div>
                  <p className="text-[8.5px] text-slate-600 leading-snug">
                    Pengunjung langsung chat dan order.
                  </p>
                </div>

                <div className="bg-white p-2 rounded-lg border border-sky-200/80 shadow-2xs space-y-0.5">
                  <div className="text-[#1D3582] font-black text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Desain Responsif HP</span>
                  </div>
                  <p className="text-[8.5px] text-slate-600 leading-snug">
                    Ringan &amp; mulus dibuka di smartphone.
                  </p>
                </div>
              </div>

              {/* Call to Action & Partner Profile */}
              <div className="bg-[#1D3582] text-white p-2.5 rounded-xl shadow-md flex items-center justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-amber-300 font-extrabold text-[8.5px] uppercase tracking-wider block">
                    KONSULTASI RESMI MITRA:
                  </span>
                  <div className="text-sm font-black text-white truncate">
                    {mitra.namaLengkap}
                  </div>
                  <div className="text-[9.5px] text-sky-200">
                    ID: <strong className="text-white">{mitra.id}</strong>
                  </div>
                  <div className="text-xs font-black text-emerald-300 flex items-center gap-1 pt-0.5">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>WA: {mitra.noHpWa}</span>
                  </div>
                </div>

                <div className="bg-white p-1.5 rounded-lg flex flex-col items-center shrink-0 text-slate-900 shadow-xs">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-14 h-14 object-contain"
                  />
                  <span className="text-[7px] font-black uppercase text-slate-700 mt-0.5">
                    Scan Klaim Promo
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODEL 3: CORPORATE SHOWCASE & KATALOG (PUTIH & BIRU ELEGAN)               */}
          {/* ========================================================================= */}
          {selectedStyle === 'elegant_corporate' && (
            <div className="flex flex-col justify-between h-full space-y-3 bg-gradient-to-b from-sky-50/80 via-white to-sky-100/50 p-1 rounded-xl">
              {/* Header: IndoDigital Logo & Official Identity */}
              <div>
                <div className="flex items-center justify-between border-b-2 border-sky-200 pb-2">
                  <div className="flex items-center gap-2">
                    <IndoDigitalLogo size="sm" showTagline={false} />
                    <div>
                      <div className="text-xs font-black text-[#1D3582] tracking-tight leading-none">
                        PT INOVASI TEKNOLOGI DIGITAL INDONESIA
                      </div>
                      <div className="text-[9px] font-bold text-sky-700 font-mono mt-0.5">
                        Katalog Resmi Pembuatan Website
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#1D3582] text-white text-[8.5px] font-black uppercase tracking-wider">
                    Verified
                  </span>
                </div>

                {/* Corporate Headline */}
                <div className="mt-2.5 space-y-1 text-left">
                  <span className="text-[9px] font-extrabold uppercase text-[#1D3582] tracking-wider">
                    Paket Solusi Digital Terpadu
                  </span>
                  <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Pilihan Paket Website Profesional untuk Pertumbuhan Usaha Anda
                  </h1>
                </div>
              </div>

              {/* Package Comparison Grid (White & Light Blue) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Paket 1: UMKM */}
                <div className="bg-white p-2.5 rounded-xl border border-sky-300 shadow-2xs space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-black uppercase text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded">
                      Paket UMKM
                    </span>
                    <div className="mt-1">
                      <div className="text-[10px] text-slate-400 line-through">Rp 499.000</div>
                      <div className="text-lg font-black text-[#1D3582]">Rp 249.500</div>
                    </div>
                    <ul className="text-[9px] text-slate-600 space-y-1 mt-1 font-medium">
                      <li className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        <span>1 Halaman Landing Page</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        <span>Selesai 1 Hari Kerja</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        <span>Free Domain 1 Tahun</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        <span>Bayar Setelah Jadi</span>
                      </li>
                    </ul>
                  </div>
                  <div className="text-[8px] text-emerald-700 font-bold bg-emerald-50 p-1 rounded text-center">
                    ✓ Garansi Revisi
                  </div>
                </div>

                {/* Paket 2: Elite */}
                <div className="bg-sky-50/90 p-2.5 rounded-xl border border-sky-300 shadow-2xs space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-black uppercase text-blue-900 bg-blue-200/80 px-1.5 py-0.5 rounded">
                      Paket Elite Custom
                    </span>
                    <div className="mt-1">
                      <div className="text-[10px] text-slate-500">Fixed Net (DP 50%)</div>
                      <div className="text-lg font-black text-slate-900">Rp 3.000.000</div>
                    </div>
                    <ul className="text-[9px] text-slate-700 space-y-1 mt-1 font-medium">
                      <li className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-blue-700 shrink-0" />
                        <span>Hingga 7 Halaman Custom</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-blue-700 shrink-0" />
                        <span>Pengerjaan 5 - 7 Hari</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-blue-700 shrink-0" />
                        <span>Domain .com / .id Resmi</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-blue-700 shrink-0" />
                        <span>Optimasi SEO Google</span>
                      </li>
                    </ul>
                  </div>
                  <div className="text-[8px] text-blue-800 font-bold bg-blue-100 p-1 rounded text-center">
                    ✓ Standar Korporat
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="p-2 bg-white rounded-lg border border-sky-200 text-center flex items-center justify-around text-[9px] text-slate-700 font-bold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Legal &amp; Resmi</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-sky-600" />
                  <span>Dukungan Teknis</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Server Cloud Cepat</span>
                </span>
              </div>

              {/* Partner Consultant Bio */}
              <div className="bg-white p-2.5 rounded-xl border border-sky-200 flex items-center justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[8.5px] uppercase font-bold text-sky-800 tracking-wider">
                    Digital Sales Consultant:
                  </span>
                  <div className="text-sm font-black text-slate-900 truncate">
                    {mitra.namaLengkap}
                  </div>
                  <div className="text-[9.5px] text-slate-500">
                    ID: <strong className="text-slate-800">{mitra.id}</strong>
                  </div>
                  <div className="text-xs font-black text-emerald-700 flex items-center gap-1 pt-0.5">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>WA: {mitra.noHpWa}</span>
                  </div>
                </div>

                <div className="bg-sky-50 p-1.5 rounded-lg border border-sky-200 flex flex-col items-center shrink-0">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-13 h-13 object-contain"
                  />
                  <span className="text-[7px] font-black uppercase text-slate-600 mt-0.5">
                    Konsultasi
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrosurGenerator;
