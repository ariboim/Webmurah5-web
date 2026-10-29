import React, { useState, useRef } from 'react';
import {
  CreditCard,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Loader2,
  Copy,
  Check,
  Eye,
  Camera,
  FileCheck,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { MitraAccount } from '../../types/mitra';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

interface IdCardMakerProps {
  mitra: MitraAccount;
  onUpdateMitra?: (updates: Partial<MitraAccount>) => void;
}

export const IdCardMaker: React.FC<IdCardMakerProps> = ({ mitra, onUpdateMitra }) => {
  // Customizable Card Fields
  const [namaLengkap, setNamaLengkap] = useState(mitra.namaLengkap || 'NAMA MITRA');
  const [jabatan, setJabatan] = useState('OFFICIAL DIGITAL CONSULTANT');
  const [nik, setNik] = useState(mitra.nik || mitra.id || 'ITDI-2026-0042');
  const [photoUrl, setPhotoUrl] = useState(
    mitra.fotoUrl ||
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  );
  const [masaBerlaku, setMasaBerlaku] = useState('DESEMBER 2027');
  const [isExportingMockup, setIsExportingMockup] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // References for export capture
  const mockupContainerRef = useRef<HTMLDivElement | null>(null);
  const cardFrontRef = useRef<HTMLDivElement | null>(null);
  const cardBackRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const referralUrl = `https://webmurah.biz.id/?ref=${encodeURIComponent(mitra.id || nik)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=2&data=${encodeURIComponent(
    referralUrl
  )}`;

  // Sample formal avatar presets
  const sampleAvatars = [
    {
      label: 'Formal Pria 1',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    },
    {
      label: 'Formal Wanita 1',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    },
    {
      label: 'Formal Pria 2',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    },
    {
      label: 'Formal Hijab',
      url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&auto=format&fit=crop&q=80',
    },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
          if (onUpdateMitra) {
            onUpdateMitra({ fotoUrl: reader.result });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyVerifyLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(referralUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    } else {
      prompt('Salin tautan verifikasi mitra:', referralUrl);
    }
  };

  // Download High-Resolution 3D Mockup Scene (PNG)
  const handleDownloadMockupPng = async () => {
    if (!mockupContainerRef.current) return;
    setIsExportingMockup(true);
    setDownloadNotice(null);

    const safeName = namaLengkap.replace(/[^a-zA-Z0-9]/g, '_') || 'Mitra';

    try {
      const canvas = await html2canvas(mockupContainerRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#1b120c',
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `3D-Mockup-ID-Card-${safeName}.png`;
      link.click();

      setDownloadNotice('3D Product Mockup ID Card berhasil diunduh dalam format PNG resolusi tinggi!');
      setTimeout(() => setDownloadNotice(null), 4000);
    } catch (err) {
      console.error('Error generating 3D mockup image:', err);
      setDownloadNotice('Gagal mengunduh gambar mockup. Silakan coba lagi.');
    } finally {
      setIsExportingMockup(false);
    }
  };

  // Download Print-Ready CR80 Vertical PDF
  const handleDownloadPrintPdf = async () => {
    if (!cardFrontRef.current || !cardBackRef.current) return;
    setIsExportingPdf(true);
    setDownloadNotice(null);

    const safeName = namaLengkap.replace(/[^a-zA-Z0-9]/g, '_') || 'Mitra';

    try {
      const canvasFront = await html2canvas(cardFrontRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#060c1d',
      });

      const canvasBack = await html2canvas(cardBackRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#060c1d',
      });

      // Standard Vertical CR80 size: 54mm width x 85.6mm height
      const cardWidthMm = 54;
      const cardHeightMm = 85.6;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header Guide
      pdf.setFontSize(14);
      pdf.setTextColor(15, 23, 42);
      pdf.text('KARTU MITRA RESMI / OFFICIAL SMART ID CARD CR80', 20, 22);

      pdf.setFontSize(8.5);
      pdf.setTextColor(71, 85, 105);
      pdf.text('PT INOVASI TEKNOLOGI DIGITAL INDONESIA • MITRA INDODIGITAL', 20, 28);
      pdf.text(`Nama: ${namaLengkap.toUpperCase()} | ID: ${nik} | Berlaku: ${masaBerlaku}`, 20, 33);

      // Card Front (Left)
      const frontImg = canvasFront.toDataURL('image/png');
      pdf.setDrawColor(148, 163, 184); // Cutting border
      pdf.rect(35, 42, cardWidthMm, cardHeightMm);
      pdf.addImage(frontImg, 'PNG', 35, 42, cardWidthMm, cardHeightMm);

      // Card Back (Right)
      const backImg = canvasBack.toDataURL('image/png');
      pdf.rect(115, 42, cardWidthMm, cardHeightMm);
      pdf.addImage(backImg, 'PNG', 115, 42, cardWidthMm, cardHeightMm);

      // Cutting guide notes
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        'Petunjuk Cetak: Gunakan blanko PVC Card CR80 (54 x 85.6 mm) atau Art Paper 260-310 gsm laminasi doff/glossy.',
        20,
        140
      );
      pdf.text(
        'Potong tepat pada garis panduan batas luar kartu. Lubang lanyard standar berada di bagian tengah atas.',
        20,
        145
      );

      pdf.save(`ID-Card-CR80-Vertical-${safeName}.pdf`);
      setDownloadNotice('PDF ID Card Standar CR80 Siap Cetak berhasil diunduh!');
      setTimeout(() => setDownloadNotice(null), 4000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <CreditCard className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              Official Corporate ID Card (Vertical CR80 Mockup)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/40">
                MITRA INDODIGITAL
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Display 3D photorealistic kartu tanda pengenal resmi PT INOVASI TEKNOLOGI DIGITAL INDONESIA lengkap dengan gantungan lanyard navy, klip metal, dan QR Code verifikasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyVerifyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition-all"
            title="Salin tautan verifikasi mitra"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Link QR</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadMockupPng}
            disabled={isExportingMockup}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-950/50 cursor-pointer transition-all disabled:opacity-50"
          >
            {isExportingMockup ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses PNG...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Mockup 3D (PNG)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadPrintPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1D3582] hover:bg-[#152764] text-white text-xs font-bold shadow-md cursor-pointer transition-all disabled:opacity-50 border border-blue-400/30"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Membuat PDF...</span>
              </>
            ) : (
              <>
                <FileCheck className="w-3.5 h-3.5 text-cyan-300" />
                <span>Unduh PDF Cetak CR80</span>
              </>
            )}
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Main Grid: Customization Form & 3D Desk Presentation */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Editor (4 cols) */}
        <div className="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              Editor Data ID Card
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Standar CR80</span>
          </div>

          {/* Photo Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Foto Mitra (Formal Business Attire)
            </label>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <img
                  src={photoUrl}
                  alt={namaLengkap}
                  className="w-16 h-20 rounded-lg object-cover border-2 border-cyan-500 shadow-md bg-slate-100"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-950/60 text-white rounded-lg flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[9px] font-bold"
                >
                  <Camera className="w-4 h-4 mb-0.5" />
                  Ganti
                </button>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-600" />
                  <span>Unggah Foto Sendiri</span>
                </button>
                <div className="text-[10px] text-slate-500 leading-tight">
                  Pilih foto formal pakaian kerja rapi atau pilih preset di bawah:
                </div>
              </div>
            </div>

            {/* Quick avatar choices */}
            <div className="grid grid-cols-4 gap-1.5 mt-2.5">
              {sampleAvatars.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPhotoUrl(item.url);
                    if (onUpdateMitra) onUpdateMitra({ fotoUrl: item.url });
                  }}
                  className={`relative rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                    photoUrl === item.url
                      ? 'border-cyan-500 ring-2 ring-cyan-400/40'
                      : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                  }`}
                  title={item.label}
                >
                  <img src={item.url} alt={item.label} className="w-full h-10 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap Mitra ({'{{NAMA}}'})
            </label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              placeholder="Contoh: ARIES M HARDJASASMITA"
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 text-xs font-bold uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          {/* Role / Jabatan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Jabatan / Role ({'{{JABATAN}}'})
            </label>
            <input
              type="text"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              placeholder="Contoh: OFFICIAL DIGITAL CONSULTANT"
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 text-xs font-bold text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {[
                'OFFICIAL DIGITAL CONSULTANT',
                'SENIOR PARTNER CONSULTANT',
                'REGIONAL DIGITAL EXECUTIVE',
              ].map((rolePreset) => (
                <button
                  key={rolePreset}
                  type="button"
                  onClick={() => setJabatan(rolePreset)}
                  className="text-[9px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium cursor-pointer"
                >
                  {rolePreset.split(' ')[0]}...
                </button>
              ))}
            </div>
          </div>

          {/* NIK / Partner ID */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Partner ID / NIK ({'{{NIK}}'})
            </label>
            <input
              type="text"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              placeholder="Contoh: ITDI-2026-0042"
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          {/* Expiry / Masa Berlaku */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Masa Berlaku / EXP
            </label>
            <input
              type="text"
              value={masaBerlaku}
              onChange={(e) => setMasaBerlaku(e.target.value)}
              placeholder="DESEMBER 2027"
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              <span>Verifikasi Resmi Terjamin</span>
            </div>
            <p className="leading-relaxed">
              QR Code pada bagian belakang terhubung otomatis ke domain resmi <span className="font-semibold text-slate-700">webmurah.biz.id</span> untuk memvalidasi keaslian mitra dan proteksi dari pemalsuan.
            </p>
          </div>
        </div>

        {/* Right Column: 3D Product Mockup on Clean Wooden Office Table (8 cols) */}
        <div className="xl:col-span-8 space-y-4">
          {/* Mockup Outer Wrapper */}
          <div className="rounded-3xl border border-amber-900/40 shadow-2xl overflow-hidden relative">
            {/* The Wooden Table Stage (Capturable Container) */}
            <div
              ref={mockupContainerRef}
              className="relative p-6 sm:p-10 select-none overflow-x-auto min-h-[640px] flex flex-col items-center justify-center"
              style={{
                // Photorealistic Dark Walnut Wooden Table with fine woodgrain gradients & lighting
                background: `
                  radial-gradient(ellipse at 50% 20%, rgba(255, 235, 210, 0.12) 0%, transparent 60%),
                  radial-gradient(circle at 15% 85%, rgba(0, 0, 0, 0.4) 0%, transparent 50%),
                  radial-gradient(circle at 85% 85%, rgba(0, 0, 0, 0.4) 0%, transparent 50%),
                  repeating-linear-gradient(90deg, 
                    rgba(40, 22, 13, 0.95) 0px, 
                    rgba(49, 28, 17, 0.95) 4px, 
                    rgba(35, 18, 11, 0.95) 8px, 
                    rgba(45, 24, 15, 0.95) 12px, 
                    rgba(30, 16, 9, 0.95) 20px
                  ),
                  linear-gradient(180deg, #26160d 0%, #1a0e07 100%)
                `,
                backgroundBlendMode: 'screen, normal, normal, overlay, normal',
              }}
            >
              {/* Subtle Office Soft-Blurred Ambient Depth Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 0%, rgba(70, 130, 180, 0.18) 0%, transparent 70%), linear-gradient(180deg, rgba(20, 12, 7, 0.2) 0%, rgba(10, 6, 3, 0.7) 100%)',
                }}
              />

              {/* Wooden Table Soft Vignette Border */}
              <div className="absolute inset-0 ring-1 ring-inset ring-amber-500/10 pointer-events-none" />

              {/* Watermark Label in corner */}
              <div className="absolute top-4 left-5 flex items-center gap-2 z-10 pointer-events-none opacity-70">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest text-amber-100/70 uppercase">
                  PT INOVASI TEKNOLOGI DIGITAL INDONESIA • OFFICIAL CR80 SET
                </span>
              </div>

              {/* SIDE-BY-SIDE CARDS CONTAINER */}
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14 pt-8 pb-4">
                {/* ======================================================== */}
                {/* 1. FRONT CARD (LEFT SIDE) WITH LANYARD & SILVER CLIP    */}
                {/* ======================================================== */}
                <div className="flex flex-col items-center">
                  {/* Dark Navy Lanyard Strap (Top portion vanishing upwards) */}
                  <div className="relative flex flex-col items-center z-20 -mb-2">
                    {/* Lanyard Fabric */}
                    <div
                      className="w-7 h-16 rounded-t-sm shadow-xl relative overflow-hidden"
                      style={{
                        background:
                          'linear-gradient(90deg, #070e1c 0%, #0d1a33 30%, #132447 50%, #0d1a33 70%, #070e1c 100%)',
                        boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8), 0 4px 10px rgba(0,0,0,0.6)',
                      }}
                    >
                      {/* Lanyard Fine Woven Texture Lines */}
                      <div
                        className="absolute inset-0 opacity-25"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)',
                        }}
                      />
                      {/* Subtle center stitching */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] border-l border-dashed border-cyan-400/30" />
                    </div>

                    {/* Silver Metal Swivel Clip */}
                    <div className="flex flex-col items-center -mt-1">
                      {/* Upper Metal Ring */}
                      <div
                        className="w-5 h-3 rounded-t-sm border border-slate-300 shadow-md"
                        style={{
                          background:
                            'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 45%, #94a3b8 60%, #e2e8f0 100%)',
                        }}
                      />
                      {/* Silver Swivel Barrel */}
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-slate-400 shadow-md flex items-center justify-center"
                        style={{
                          background:
                            'radial-gradient(circle at 35% 35%, #ffffff 0%, #cbd5e1 50%, #64748b 100%)',
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700/60" />
                      </div>
                      {/* Lobster Claw / Spring Hook (Passes through slot) */}
                      <div
                        className="w-4 h-5 rounded-b-md border border-slate-300 shadow-lg -mt-0.5"
                        style={{
                          background:
                            'linear-gradient(180deg, #cbd5e1 0%, #f1f5f9 30%, #94a3b8 80%, #64748b 100%)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Card Front Elevation & 3D Shadow Container */}
                  <div
                    className="relative group transition-transform duration-300 hover:-translate-y-1"
                    style={{
                      // Photorealistic 3D drop shadows on wooden table
                      filter:
                        'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.85)) drop-shadow(0 10px 10px rgba(0, 0, 0, 0.6))',
                    }}
                  >
                    {/* THE CARD ITSELF: VERTICAL CR80 (280px x 445px ratio) */}
                    <div
                      ref={cardFrontRef}
                      className="relative rounded-[18px] text-white overflow-hidden flex flex-col justify-between shrink-0 select-none"
                      style={{
                        width: '280px',
                        height: '445px',
                        backgroundColor: '#060c1d',
                        border: '1px solid rgba(6, 182, 212, 0.35)',
                        boxShadow:
                          'inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -1px 1px rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      {/* ================= BACKGROUND CIRCUIT TRACES & GRID ================= */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {/* Deep Navy Gradient Base */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              'radial-gradient(circle at 80% 15%, #0d224d 0%, #071026 50%, #040814 100%)',
                          }}
                        />

                        {/* Glowing Cyan Circuit SVG Vector Traces */}
                        <svg
                          className="absolute inset-0 w-full h-full opacity-45"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 280 445"
                        >
                          <defs>
                            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="2" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                            <linearGradient id="traceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
                              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                            </linearGradient>
                          </defs>

                          {/* Digital Grid dots */}
                          <pattern
                            id="gridDots"
                            x="0"
                            y="0"
                            width="14"
                            height="14"
                            patternUnits="userSpaceOnUse"
                          >
                            <circle cx="2" cy="2" r="0.75" fill="#00f0ff" fillOpacity="0.15" />
                          </pattern>
                          <rect width="100%" height="100%" fill="url(#gridDots)" />

                          {/* Circuit Traces & Microchip Nodes */}
                          <g filter="url(#cyanGlow)" stroke="#00f0ff" strokeWidth="1" fill="none">
                            {/* Top right bus */}
                            <path d="M 200 15 L 255 15 L 270 30 L 270 95 L 255 110" />
                            <circle cx="200" cy="15" r="2" fill="#00f0ff" />
                            <circle cx="255" cy="110" r="1.5" fill="#00f0ff" />

                            <path d="M 180 32 L 235 32 L 250 47 L 250 75" />
                            <circle cx="180" cy="32" r="1.5" fill="#00f0ff" />

                            {/* Left side circuit traces */}
                            <path d="M 10 140 L 40 140 L 55 155 L 55 220 L 45 230 L 10 230" />
                            <circle cx="10" cy="140" r="1.5" fill="#00f0ff" />
                            <circle cx="10" cy="230" r="1.5" fill="#00f0ff" />

                            {/* Center-photo accent lines */}
                            <path d="M 25 310 L 60 310 L 75 325 L 120 325" />
                            <circle cx="25" cy="310" r="1.5" fill="#00f0ff" />
                            <circle cx="120" cy="325" r="2" fill="#00f0ff" />

                            <path d="M 270 340 L 220 340 L 205 355 L 160 355" />
                            <circle cx="270" cy="340" r="1.5" fill="#00f0ff" />
                            <circle cx="160" cy="355" r="2" fill="#00f0ff" />

                            {/* Bottom circuit traces */}
                            <path d="M 15 410 L 80 410 L 95 425 L 265 425" />
                            <circle cx="15" cy="410" r="1.5" fill="#00f0ff" />
                            <circle cx="265" cy="425" r="2" fill="#00f0ff" />
                          </g>

                          {/* Circuit Node Squares */}
                          <rect x="250" y="75" width="3" height="3" fill="#00f0ff" opacity="0.8" />
                          <rect x="55" y="180" width="3" height="3" fill="#00f0ff" opacity="0.8" />
                        </svg>

                        {/* PVC Smart Card Sheen Reflection (diagonal gloss highlight) */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              'linear-gradient(115deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 30%, transparent 45%, rgba(0,240,255,0.06) 75%, transparent 100%)',
                          }}
                        />
                      </div>

                      {/* Punched Lanyard Slot Hole at Top Center */}
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-11 h-2 rounded-full bg-slate-950 border border-slate-700/80 shadow-[inset_0_2px_3px_rgba(0,0,0,0.9)] z-20 flex items-center justify-center">
                        <div className="w-9 h-1 rounded-full bg-black/80" />
                      </div>

                      {/* ================= CARD FRONT CONTENT ================= */}
                      <div className="relative z-10 p-4 pt-6 flex flex-col justify-between h-full">
                        {/* TOP HEADER SECTION */}
                        <div>
                          {/* Brand Sub-Division Pill */}
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-[8px] font-extrabold tracking-widest text-cyan-300 uppercase shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                              MITRA INDODIGITAL
                            </span>

                            <span className="text-[7.5px] font-mono text-cyan-400/80 border border-cyan-500/30 px-1 rounded bg-cyan-950/40">
                              CR80 PVC
                            </span>
                          </div>

                          {/* Company Name & Geometric Tech Logo */}
                          <div className="flex items-start justify-between gap-2 border-b border-cyan-500/25 pb-2">
                            <div className="text-left">
                              <div className="text-[9px] font-black tracking-tight text-white uppercase leading-snug">
                                PT INOVASI TEKNOLOGI
                              </div>
                              <div className="text-[9.5px] font-black tracking-tight text-cyan-300 uppercase leading-snug">
                                DIGITAL INDONESIA
                              </div>
                            </div>

                            {/* Official IndoDigital Logo Emblem on upper right (Transparent, no frame border, matching cyan contour) */}
                            <div className="relative shrink-0 flex items-center justify-center">
                              <img
                                src="/assets/aistudio/indo_digital_card_logo_transparent.png"
                                alt="Logo Indo Digital"
                                className="w-9 h-9 object-contain select-none pointer-events-none drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                                style={{ background: 'transparent' }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* CENTER PHOTO FRAME WITH GLOWING NEON CYAN CORNER-BRACKETS */}
                        <div className="my-auto py-2 flex flex-col items-center">
                          <div className="relative p-1.5">
                            {/* Glowing Neon Cyan Corner Brackets (┌ ┐ └ ┘) */}
                            {/* Top Left Bracket */}
                            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                            {/* Top Right Bracket */}
                            <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                            {/* Bottom Left Bracket */}
                            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                            {/* Bottom Right Bracket */}
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_8px_#00f0ff]" />

                            {/* Photo Container */}
                            <div className="relative w-24 h-28 rounded-md overflow-hidden bg-slate-900 border border-cyan-500/40 shadow-inner">
                              <img
                                src={photoUrl}
                                alt={namaLengkap}
                                className="w-full h-full object-cover"
                              />

                              {/* Subtle scanline effect on photo */}
                              <div
                                className="absolute inset-0 pointer-events-none opacity-20"
                                style={{
                                  backgroundImage:
                                    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.4) 2px, rgba(0,240,255,0.4) 3px)',
                                }}
                              />

                              {/* Corner chip watermark */}
                              <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-slate-950/80 text-[6px] font-mono text-cyan-300 font-bold border border-cyan-500/40">
                                VERIFIED
                              </div>
                            </div>
                          </div>

                          {/* NAME IN LARGE BOLD CLEAN WHITE CAPITAL LETTERS */}
                          <div className="mt-3 text-center w-full px-2">
                            <h2 className="text-base sm:text-[17px] font-black tracking-wide text-white uppercase truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                              {namaLengkap}
                            </h2>

                            {/* ROLE / POSITION HIGHLIGHTED IN BRIGHT ELECTRIC CYAN TEXT */}
                            <div className="mt-0.5 text-[10px] sm:text-[10.5px] font-extrabold tracking-wider text-[#00f0ff] uppercase drop-shadow-[0_0_8px_rgba(0,240,255,0.7)] truncate">
                              {jabatan}
                            </div>

                            {/* PARTNER ID ROUNDED DARK BADGE */}
                            <div className="mt-2 inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                              <span className="text-[9px] font-mono font-bold tracking-wider text-cyan-300">
                                ID: <span className="text-white">{nik}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* BOTTOM FOOTER TEXT */}
                        <div className="border-t border-cyan-500/30 pt-2 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <p className="text-[7.5px] sm:text-[8px] font-extrabold tracking-widest text-white uppercase drop-shadow-xs">
                              KARTU MITRA RESMI / OFFICIAL PARTNER CARD
                            </p>
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          </div>
                          <div className="text-[6.5px] font-mono text-cyan-400/70 tracking-wider mt-0.5">
                            SECURE DIGITAL ENCRYPTION • EXP: {masaBerlaku}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Caption underneath card */}
                  <span className="mt-3 text-[11px] font-extrabold text-cyan-300 uppercase tracking-widest bg-slate-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                    TAMPILAN DEPAN (FRONT)
                  </span>
                </div>

                {/* ======================================================== */}
                {/* 2. BACK CARD (RIGHT SIDE) WITH LANYARD & SILVER CLIP     */}
                {/* ======================================================== */}
                <div className="flex flex-col items-center">
                  {/* Matching Dark Navy Lanyard Strap & Silver Metal Clip */}
                  <div className="relative flex flex-col items-center z-20 -mb-2">
                    {/* Lanyard Fabric */}
                    <div
                      className="w-7 h-16 rounded-t-sm shadow-xl relative overflow-hidden"
                      style={{
                        background:
                          'linear-gradient(90deg, #070e1c 0%, #0d1a33 30%, #132447 50%, #0d1a33 70%, #070e1c 100%)',
                        boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8), 0 4px 10px rgba(0,0,0,0.6)',
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-25"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)',
                        }}
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] border-l border-dashed border-cyan-400/30" />
                    </div>

                    {/* Silver Metal Swivel Clip */}
                    <div className="flex flex-col items-center -mt-1">
                      <div
                        className="w-5 h-3 rounded-t-sm border border-slate-300 shadow-md"
                        style={{
                          background:
                            'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 45%, #94a3b8 60%, #e2e8f0 100%)',
                        }}
                      />
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-slate-400 shadow-md flex items-center justify-center"
                        style={{
                          background:
                            'radial-gradient(circle at 35% 35%, #ffffff 0%, #cbd5e1 50%, #64748b 100%)',
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700/60" />
                      </div>
                      <div
                        className="w-4 h-5 rounded-b-md border border-slate-300 shadow-lg -mt-0.5"
                        style={{
                          background:
                            'linear-gradient(180deg, #cbd5e1 0%, #f1f5f9 30%, #94a3b8 80%, #64748b 100%)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Card Back Elevation & 3D Shadow Container */}
                  <div
                    className="relative group transition-transform duration-300 hover:-translate-y-1"
                    style={{
                      filter:
                        'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.85)) drop-shadow(0 10px 10px rgba(0, 0, 0, 0.6))',
                    }}
                  >
                    {/* THE CARD ITSELF: VERTICAL CR80 (280px x 445px ratio) */}
                    <div
                      ref={cardBackRef}
                      className="relative rounded-[18px] text-white overflow-hidden flex flex-col justify-between shrink-0 select-none"
                      style={{
                        width: '280px',
                        height: '445px',
                        backgroundColor: '#060c1d',
                        border: '1px solid rgba(6, 182, 212, 0.35)',
                        boxShadow:
                          'inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -1px 1px rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      {/* ================= BACKGROUND CIRCUIT TRACES & GRID ================= */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              'radial-gradient(circle at 20% 85%, #0d224d 0%, #071026 50%, #040814 100%)',
                          }}
                        />

                        {/* Circuit SVG Lines */}
                        <svg
                          className="absolute inset-0 w-full h-full opacity-35"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 280 445"
                        >
                          <defs>
                            <filter id="cyanGlowBack" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="2" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>

                          <g
                            filter="url(#cyanGlowBack)"
                            stroke="#00f0ff"
                            strokeWidth="0.8"
                            fill="none"
                          >
                            <path d="M 270 50 L 220 50 L 200 70 L 100 70" />
                            <circle cx="270" cy="50" r="1.5" fill="#00f0ff" />
                            <circle cx="100" cy="70" r="1.5" fill="#00f0ff" />

                            <path d="M 10 200 L 50 200 L 70 220 L 70 300" />
                            <circle cx="10" cy="200" r="1.5" fill="#00f0ff" />
                            <circle cx="70" cy="300" r="1.5" fill="#00f0ff" />

                            <path d="M 270 280 L 230 280 L 210 300 L 210 370" />
                            <circle cx="270" cy="280" r="1.5" fill="#00f0ff" />
                            <circle cx="210" cy="370" r="1.5" fill="#00f0ff" />
                          </g>
                        </svg>

                        {/* Sheen highlight */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(0,240,255,0.04) 80%, transparent 100%)',
                          }}
                        />
                      </div>

                      {/* Punched Lanyard Slot Hole at Top Center */}
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-11 h-2 rounded-full bg-slate-950 border border-slate-700/80 shadow-[inset_0_2px_3px_rgba(0,0,0,0.9)] z-20 flex items-center justify-center">
                        <div className="w-9 h-1 rounded-full bg-black/80" />
                      </div>

                      {/* ================= CARD BACK CONTENT ================= */}
                      <div className="relative z-10 p-4 pt-6 flex flex-col justify-between h-full">
                        {/* TOP SECTION: KETENTUAN & PENGGUNAAN WITH CYAN UNDERLINE */}
                        <div>
                          <div className="flex items-center justify-between text-[7.5px] font-mono text-slate-400 mb-1">
                            <span>MITRA INDODIGITAL</span>
                            <span>OFFICIAL TERMS</span>
                          </div>

                          <div className="border-b-2 border-cyan-400 pb-1 mb-2.5">
                            <h3 className="text-xs font-black tracking-wide text-white uppercase text-center drop-shadow-[0_0_6px_rgba(0,240,255,0.5)]">
                              KETENTUAN &amp; PENGGUNAAN
                            </h3>
                          </div>

                          {/* TERMS TEXT (LEGIBLE, NEAT INDONESIAN) */}
                          <div className="space-y-1.5 text-left bg-slate-950/70 p-2.5 rounded-xl border border-cyan-500/20 text-slate-200">
                            <div className="flex items-start gap-1.5 text-[8px] leading-tight">
                              <span className="font-bold text-cyan-400 shrink-0">1.</span>
                              <span>Kartu ini adalah tanda pengenal resmi Mitra Indodigital.</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-[8px] leading-tight">
                              <span className="font-bold text-cyan-400 shrink-0">2.</span>
                              <span>Wajib ditunjukkan saat menjalankan aktivitas kemitraan resmi.</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-[8px] leading-tight">
                              <span className="font-bold text-cyan-400 shrink-0">3.</span>
                              <span>
                                Dilarang menyalahgunakan identitas ini di luar ketentuan kemitraan.
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* CENTER FEATURE: CRISP HIGH-CONTRAST QR CODE WITH TEXT "SCAN FOR VERIFICATION" */}
                        <div className="my-auto py-1 flex flex-col items-center">
                          <div className="relative p-1 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                            <div className="bg-white p-1.5 rounded-[10px]">
                              <img
                                src={qrCodeUrl}
                                alt="QR Code Verifikasi Mitra"
                                className="w-24 h-24 object-contain rounded"
                              />
                            </div>
                          </div>

                          <div className="mt-2 text-center">
                            <div className="text-[9px] font-black tracking-widest text-[#00f0ff] uppercase drop-shadow-[0_0_6px_rgba(0,240,255,0.7)] flex items-center justify-center gap-1">
                              <QrCode className="w-3 h-3 text-cyan-400" />
                              SCAN FOR VERIFICATION
                            </div>
                            <div className="text-[7px] font-mono text-slate-400 mt-0.5">
                              ID KEMITRAAN: {nik}
                            </div>
                          </div>
                        </div>

                        {/* FOOTER DETAILS (COMPANY INFO) */}
                        <div className="border-t border-cyan-500/30 pt-2 text-left space-y-1">
                          <div className="flex items-center gap-1.5">
                            <img
                              src="/assets/aistudio/indo_digital_card_logo_transparent.png"
                              alt="IndoDigital Emblem"
                              className="w-4 h-4 object-contain shrink-0"
                              style={{ background: 'transparent' }}
                            />
                            <div className="text-[7.5px] font-bold text-white leading-tight">
                              PT INOVASI TEKNOLOGI DIGITAL INDONESIA
                            </div>
                          </div>

                          <div className="text-[7px] text-slate-300 leading-snug">
                            Jl. Pangkalan 6 Raya No. 16, RT 003 / RW 004, Ciketing Udik, Bekasi 17153
                          </div>

                          <div className="text-[7px] text-cyan-300 font-mono flex items-center justify-between border-t border-slate-800/80 pt-1">
                            <span>Email: admin@webmurah.biz.id</span>
                            <span>Web: webmurah.biz.id</span>
                          </div>

                          <div className="flex items-center justify-between pt-0.5 text-[7.5px] font-mono font-bold text-amber-300">
                            <span>Masa Berlaku / EXP:</span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300">
                              {masaBerlaku}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Caption underneath card */}
                  <span className="mt-3 text-[11px] font-extrabold text-slate-300 uppercase tracking-widest bg-slate-950/60 px-3 py-1 rounded-full border border-slate-700/60">
                    TAMPILAN BELAKANG (BACK)
                  </span>
                </div>
              </div>

              {/* Desk Presentation Bottom Shadow / Lighting Bar */}
              <div className="mt-4 text-center z-10">
                <span className="text-[9px] font-mono text-amber-200/50 uppercase tracking-widest">
                  &bull; 3D Photorealistic Corporate ID Card Presentation Set &bull;
                </span>
              </div>
            </div>
          </div>

          {/* Quick Print & Material Guide Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-left">
                <div className="font-bold text-white text-xs">
                  Spesifikasi Bahan Cetak Resmi CR80 (PVC Smart Card)
                </div>
                <div className="text-[11px] text-slate-400">
                  Ukuran standar: 54 mm &times; 85.6 mm (Vertical). Ketebalan 0.76mm (30 mil PVC).
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadPrintPdf}
                disabled={isExportingPdf}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Cetak (A4)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
