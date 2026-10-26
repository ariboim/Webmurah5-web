import React, { useState, useRef } from 'react';
import {
  User,
  FileText,
  Layers,
  MessageCircle,
  CreditCard,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Copy,
  Check,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  Sparkles,
  TrendingUp,
  Award,
  ShieldCheck,
  ExternalLink,
  Loader2,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { MitraAccount } from '../../types/mitra';
import { updateMitraProfile, clearMitraSession } from '../../utils/mitraStorage';
import { BrosurGenerator } from './BrosurGenerator';
import { CopywritingBlastGenerator } from './CopywritingBlastGenerator';
import { IdCardMaker } from './IdCardMaker';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

interface MitraDashboardProps {
  mitra: MitraAccount;
  onLogout: () => void;
  onNavigateToOrder?: () => void;
}

type MitraDashboardTab = 'profile' | 'agreement' | 'brosur' | 'copywriting' | 'idcard';

export const MitraDashboard: React.FC<MitraDashboardProps> = ({
  mitra: initialMitra,
  onLogout,
  onNavigateToOrder,
}) => {
  const [mitra, setMitra] = useState<MitraAccount>(initialMitra);
  const [activeTab, setActiveTab] = useState<MitraDashboardTab>('profile');
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [isExportingDoc, setIsExportingDoc] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    namaLengkap: mitra.namaLengkap,
    email: mitra.email,
    noHpWa: mitra.noHpWa,
    nik: mitra.nik || '',
    tempatTanggalLahir: mitra.tempatTanggalLahir || '',
    alamatKtp: mitra.alamatKtp || '',
    kotaDomisili: mitra.kotaDomisili || '',
    namaBank: mitra.namaBank || 'BCA',
    nomorRekening: mitra.nomorRekening || '',
    namaPemilikRekening: mitra.namaPemilikRekening || mitra.namaLengkap,
  });

  const agreementContainerRef = useRef<HTMLDivElement | null>(null);

  const referralLink = `https://webmurah.biz.id/?ref=${encodeURIComponent(mitra.id)}`;

  const handleCopyReferral = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(referralLink).then(() => {
        setCopiedReferral(true);
        setTimeout(() => setCopiedReferral(false), 2500);
      });
    } else {
      prompt('Salin link rujukan Anda:', referralLink);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const success = updateMitraProfile(mitra.id, profileForm);
    if (success) {
      setMitra((prev) => ({ ...prev, ...profileForm }));
      setSaveNotice('Data profil berhasil diperbarui!');
      setTimeout(() => setSaveNotice(null), 3000);
    }
  };

  const handleDownloadAgreementPdf = async () => {
    if (!agreementContainerRef.current) return;
    setIsExportingDoc(true);

    const safeName = mitra.namaLengkap.replace(/[^a-zA-Z0-9]/g, '_') || 'Mitra';
    const filename = `Surat-Perjanjian-Kemitraan-${safeName}.pdf`;

    try {
      const element = agreementContainerRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
      const margin = 10;
      const printWidth = pageWidth - margin * 2;
      const availablePageHeight = pageHeight - margin * 2;

      const totalPrintHeight = (canvas.height * printWidth) / canvas.width;

      if (totalPrintHeight <= availablePageHeight) {
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(imgData, 'JPEG', margin, margin, printWidth, totalPrintHeight);
      } else {
        const pageCanvasHeight = (availablePageHeight * canvas.width) / printWidth;
        let renderedHeight = 0;
        let pageIndex = 0;

        while (renderedHeight < canvas.height) {
          if (pageIndex > 0) pdf.addPage();
          const currentSliceHeight = Math.min(pageCanvasHeight, canvas.height - renderedHeight);

          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = currentSliceHeight;
          const sliceCtx = sliceCanvas.getContext('2d');

          if (sliceCtx) {
            sliceCtx.drawImage(
              canvas,
              0,
              renderedHeight,
              canvas.width,
              currentSliceHeight,
              0,
              0,
              canvas.width,
              currentSliceHeight
            );

            const sliceImgData = sliceCanvas.toDataURL('image/jpeg', 0.98);
            const slicePrintHeight = (currentSliceHeight * printWidth) / canvas.width;
            pdf.addImage(sliceImgData, 'JPEG', margin, margin, printWidth, slicePrintHeight);
          }

          renderedHeight += currentSliceHeight;
          pageIndex++;
        }
      }

      pdf.save(filename);
    } catch (err) {
      console.error('Error generating agreement PDF:', err);
      window.print();
    } finally {
      setIsExportingDoc(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Partner Header Hero Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-[#1D3582] to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Bio */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={
                    mitra.fotoUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                  }
                  alt={mitra.namaLengkap}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold uppercase tracking-wider">
                    MITRA AKTIF (VERIFIED NON-PKWT)
                  </span>
                  <span className="font-mono text-xs text-sky-200">
                    ID: <strong className="text-white">{mitra.id}</strong>
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{mitra.namaLengkap}</h1>
                <p className="text-xs text-slate-300 flex items-center gap-3">
                  <span>Domisili: {mitra.kotaDomisili || 'Indonesia'}</span>
                  <span>&bull;</span>
                  <span>Bergabung: {mitra.tanggalBergabung || 'Oktober 2026'}</span>
                </p>
              </div>
            </div>

            {/* Referral & Logout Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Copy Referral Link */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                <div className="text-left overflow-hidden">
                  <div className="text-[9px] uppercase tracking-wider text-sky-200 font-bold">
                    Link Rujukan Anda:
                  </div>
                  <div className="text-xs font-mono font-bold text-white truncate max-w-[180px]">
                    {referralLink}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyReferral}
                  className="shrink-0 p-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white transition-all cursor-pointer"
                  title="Salin Link Rujukan"
                >
                  {copiedReferral ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Portal</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <div className="text-[10px] text-sky-200 font-bold uppercase">Hak Bagi Hasil Fee</div>
              <div className="text-xl font-black text-white mt-0.5">60% Mitra</div>
              <div className="text-[10px] text-slate-300">Pencairan mingguan ke rekening</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <div className="text-[10px] text-sky-200 font-bold uppercase">Sistem Kerja</div>
              <div className="text-xl font-black text-amber-300 mt-0.5">Full WFH</div>
              <div className="text-[10px] text-slate-300">Bebas dari mana saja</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <div className="text-[10px] text-sky-200 font-bold uppercase">Target Evaluasi</div>
              <div className="text-xl font-black text-emerald-300 mt-0.5">Rp 10 Juta/bln</div>
              <div className="text-[10px] text-slate-300">Konsisten 3 bulan &rarr; PKWTT</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <div className="text-[10px] text-sky-200 font-bold uppercase">Status Kontrak</div>
              <div className="text-xl font-black text-sky-300 mt-0.5">Sah &amp; Legal</div>
              <div className="text-[10px] text-slate-300">PT Inovasi Teknologi Digital</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#1D3582] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil &amp; Data Saya</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('agreement')}
            className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'agreement'
                ? 'bg-[#1D3582] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Dokumen Perjanjian (PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('brosur')}
            className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'brosur'
                ? 'bg-[#1D3582] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3 Style Brosur A4</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('copywriting')}
            className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'copywriting'
                ? 'bg-[#1D3582] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Generator Copywriting</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('idcard')}
            className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'idcard'
                ? 'bg-[#1D3582] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>ID Card Maker CR80</span>
          </button>
        </div>

        {/* ================= TAB 1: PROFIL & EDIT DATA ================= */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Data Identitas &amp; Rekening Bank Mitra
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Perbarui nomor WhatsApp dan rekening pencairan bagi hasil fee mingguan Anda di sini.
                </p>
              </div>

              {saveNotice && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{saveNotice}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap (Sesuai KTP)
                  </label>
                  <input
                    type="text"
                    value={profileForm.namaLengkap}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, namaLengkap: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor NIK / KTP
                  </label>
                  <input
                    type="text"
                    value={profileForm.nik}
                    onChange={(e) => setProfileForm({ ...profileForm, nik: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Email Aktif
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / HP Aktif
                  </label>
                  <input
                    type="tel"
                    value={profileForm.noHpWa}
                    onChange={(e) => setProfileForm({ ...profileForm, noHpWa: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tempat &amp; Tanggal Lahir
                  </label>
                  <input
                    type="text"
                    value={profileForm.tempatTanggalLahir}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, tempatTanggalLahir: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kota / Kabupaten Domisili
                  </label>
                  <input
                    type="text"
                    value={profileForm.kotaDomisili}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, kotaDomisili: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Lengkap Sesuai KTP
                  </label>
                  <textarea
                    rows={2}
                    value={profileForm.alamatKtp}
                    onChange={(e) => setProfileForm({ ...profileForm, alamatKtp: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  />
                </div>
              </div>

              {/* Data Rekening Bank */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#1D3582]" />
                  Rekening Penerimaan Bagi Hasil (Settlement Mingguan)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Bank
                    </label>
                    <select
                      value={profileForm.namaBank}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, namaBank: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    >
                      <option value="BCA">BCA (Bank Central Asia)</option>
                      <option value="Mandiri">Bank Mandiri</option>
                      <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                      <option value="BNI">BNI (Bank Negara Indonesia)</option>
                      <option value="BSI">BSI (Bank Syariah Indonesia)</option>
                      <option value="CIMB">CIMB Niaga</option>
                      <option value="Permata">Bank Permata</option>
                      <option value="Jago">Bank Jago</option>
                      <option value="SeBank">SeaBank</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nomor Rekening
                    </label>
                    <input
                      type="text"
                      value={profileForm.nomorRekening}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, nomorRekening: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                      placeholder="Contoh: 8410293812"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Pemilik Rekening
                    </label>
                    <input
                      type="text"
                      value={profileForm.namaPemilikRekening}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, namaPemilikRekening: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                      placeholder="Wajib sama dengan nama mitra"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#1D3582] hover:bg-[#152764] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Data</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 2: DOKUMEN PERJANJIAN (PDF) ================= */}
        {activeTab === 'agreement' && (
          <div className="space-y-6">
            {/* Control Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Surat Perjanjian Kerjasama Kemitraan Mandiri (Non-PKWT)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dokumen hukum sah yang memuat klausul bagi hasil 60:40, skema WFH, target evaluasi, dan tanda tangan digital dua pihak.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadAgreementPdf}
                disabled={isExportingDoc}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1D3582] hover:bg-[#152764] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isExportingDoc ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengekspor Dokumen PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Unduh Surat Perjanjian Resmi (PDF)</span>
                  </>
                )}
              </button>
            </div>

            {/* Agreement Printable Document Container */}
            <div className="bg-slate-800/80 p-4 sm:p-8 rounded-3xl overflow-x-auto flex justify-center shadow-inner">
              <div
                ref={agreementContainerRef}
                style={{ width: '800px' }}
                className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl space-y-6 font-sans text-xs leading-relaxed shrink-0 box-border"
              >
                {/* Header Kop Surat */}
                <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                  <div className="text-xs uppercase tracking-widest text-[#1D3582] font-black">
                    PT INOVASI TEKNOLOGI DIGITAL INDONESIA
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-950 uppercase">
                    SURAT PERJANJIAN KERJASAMA KEMITRAAN MANDIRI (NON-PKWT)
                  </h2>
                  <div className="text-[11px] text-slate-600 font-mono">
                    Nomor: {mitra.nomorSuratPerjanjian || `SPK-ITDI/MITRA/2026/10/7742`}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    PT INOVASI TEKNOLOGI DIGITAL INDONESIA, jl pangkalan 6 raya no 16 rt 003 rw 004 ,ciketing udik Bekasi 17153
                  </div>
                </div>

                <p className="text-justify indent-6">
                  Pada hari ini, tanggal <strong>{mitra.tanggalBergabung || 'Oktober 2026'}</strong>, telah dibuat dan disepakati bersama Perjanjian Kerjasama Kemitraan Mandiri (selanjutnya disebut sebagai <em>"Perjanjian"</em>), oleh dan antara pihak-pihak di bawah ini:
                </p>

                {/* PIHAK PERTAMA */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="font-black text-slate-900 text-xs uppercase text-[#1D3582]">
                    I. PIHAK PERTAMA (PRINCIPLE / PERUSAHAAN):
                  </div>
                  <table className="w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="w-36 font-bold text-slate-600 py-0.5">Nama Lengkap</td>
                        <td className="w-3">:</td>
                        <td className="font-bold text-slate-900">Aries M Hardjasasmita,S,kom</td>
                      </tr>
                      <tr>
                        <td className="font-bold text-slate-600 py-0.5">Jabatan</td>
                        <td>:</td>
                        <td>Principle</td>
                      </tr>
                      <tr>
                        <td className="font-bold text-slate-600 py-0.5">Badan Usaha</td>
                        <td>:</td>
                        <td className="font-bold">PT INOVASI TEKNOLOGI DIGITAL INDONESIA</td>
                      </tr>
                      <tr>
                        <td className="font-bold text-slate-600 py-0.5">Alamat Kantor</td>
                        <td>:</td>
                        <td>
                          PT INOVASI TEKNOLOGI DIGITAL INDONESIA, jl pangkalan 6 raya no 16 rt 003 rw 004 ,ciketing udik Bekasi 17153
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Dalam hal ini bertindak untuk dan atas nama <strong>PT INOVASI TEKNOLOGI DIGITAL INDONESIA</strong>, yang selanjutnya disebut sebagai <strong>"PIHAK PERTAMA"</strong>.
                  </p>
                </div>

                {/* PIHAK KEDUA */}
                <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-200 space-y-1.5">
                  <div className="font-black text-sky-950 text-xs uppercase">
                    II. PIHAK KEDUA (MITRA MANDIRI):
                  </div>
                  <table className="w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="w-36 font-bold text-slate-600 py-0.5">Nama Lengkap</td>
                        <td className="w-3">:</td>
                        <td className="font-bold text-slate-900">{mitra.namaLengkap}</td>
                      </tr>
                      <tr>
                        <td className="font-bold text-slate-600 py-0.5">NIK / No. KTP</td>
                        <td>:</td>
                        <td>{mitra.nik || '3275011204900003'}</td>
                      </tr>
                      <tr>
                        <td className="font-bold text-slate-600 py-0.5">Nomor WhatsApp</td>
                        <td>:</td>
                        <td>{mitra.noHpWa}</td>
                      </tr>
                      <tr>
                        <td className="font-bold text-slate-600 py-0.5">Rekening Bank</td>
                        <td>:</td>
                        <td>
                          {mitra.namaBank || 'BCA'} - {mitra.nomorRekening || '8410293812'} (a.n {mitra.namaPemilikRekening || mitra.namaLengkap})
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Dalam hal ini bertindak atas nama pribadi, yang selanjutnya disebut sebagai <strong>"PIHAK KEDUA"</strong> atau <strong>"MITRA MANDIRI"</strong>.
                  </p>
                </div>

                {/* Klausul Pokok */}
                <div className="space-y-3 pt-2 text-justify">
                  <div>
                    <strong className="block text-slate-900">PASAL 1: STATUS HUBUNGAN HUKUM</strong>
                    <p className="text-slate-700">
                      Hubungan hukum antara PIHAK PERTAMA dan PIHAK KEDUA adalah murni hubungan kemitraan perdata mandiri (Non-PKWT / Bukan Karyawan Kontrak). PIHAK KEDUA menjalankan aktivitas penawaran jasa pembuatan website secara fleksibel dari rumah (Work From Home / WFH).
                    </p>
                  </div>

                  <div>
                    <strong className="block text-slate-900">PASAL 2: HAK BAGI HASIL FEE (60% : 40%)</strong>
                    <p className="text-slate-700">
                      PIHAK KEDUA berhak atas bagi hasil sebesar <strong>60% (enam puluh persen)</strong> dari setiap realisasi transaksi klien yang didapatkan melalui rujukan langsung PIHAK KEDUA, dan 40% (empat puluh persen) untuk PIHAK PERTAMA sebagai biaya teknis server, domain, hosting, dan pengerjaan development. Fee dicairkan berkala setiap mingguan langsung ke rekening PIHAK KEDUA.
                    </p>
                  </div>

                  <div>
                    <strong className="block text-slate-900">PASAL 3: TARGET EVALUASI &amp; JALUR PKWTT</strong>
                    <p className="text-slate-700">
                      PIHAK KEDUA bersedia dievaluasi dengan target omzet penjualan minimal Rp 10.000.000,- (sepuluh juta rupiah) per bulan konsisten selama 3 (tiga) bulan berturut-turut. Apabila target terpenuhi secara konsisten, PIHAK KEDUA berhak diajukan untuk diangkat menjadi Karyawan Tetap (PKWTT) dengan gaji pokok bulanan Rp 3.000.000 s/d Rp 5.800.000 per bulan.
                    </p>
                  </div>
                </div>

                {/* Tanda Tangan Resmi Dua Pihak */}
                <div className="pt-8 border-t border-slate-200">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    {/* Pihak Pertama */}
                    <div className="space-y-3">
                      <div className="font-bold text-xs text-slate-600">
                        PIHAK PERTAMA<br />
                        <span className="font-extrabold text-slate-900">
                          PT INOVASI TEKNOLOGI DIGITAL INDONESIA
                        </span>
                      </div>

                      <div className="relative h-24 flex items-center justify-center">
                        <div className="absolute w-20 h-20 rounded-full border-2 border-dashed border-blue-600/60 flex flex-col items-center justify-center text-[7px] font-black text-blue-700 tracking-tighter uppercase rotate-[-12deg] pointer-events-none opacity-80">
                          <span>PT INOVASI TEKNOLOGI</span>
                          <span className="text-[9px] font-black text-red-600">★ RESMI ★</span>
                          <span>DIGITAL INDONESIA</span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 320 140"
                          width="160"
                          height="70"
                          className="relative z-10"
                        >
                          <path
                            d="M 35 105 C 40 75, 55 25, 75 22 C 90 20, 95 65, 80 115 M 50 78 Q 75 72, 105 76 C 118 78, 128 62, 132 85 C 136 100, 142 68, 150 82 C 156 94, 162 70, 172 80 C 182 90, 192 65, 202 78 C 215 95, 235 60, 245 108 Q 220 118, 140 114 C 70 110, 45 116, 120 102 Q 220 85, 295 90"
                            fill="none"
                            stroke="#0f2b5c"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle cx="282" cy="74" r="2.5" fill="#0f2b5c" />
                        </svg>
                      </div>

                      <div className="border-t border-slate-400 pt-1 inline-block min-w-[180px]">
                        <div className="font-black text-xs text-slate-950">Aries M Hardjasasmita,S,kom</div>
                        <div className="text-[10px] text-slate-500">Principle</div>
                      </div>
                    </div>

                    {/* Pihak Kedua */}
                    <div className="space-y-3">
                      <div className="font-bold text-xs text-slate-600">
                        PIHAK KEDUA<br />
                        <span className="font-extrabold text-slate-900">MITRA MANDIRI</span>
                      </div>

                      <div className="h-24 flex items-center justify-center">
                        <div className="w-32 h-14 border border-dashed border-sky-300 rounded-lg bg-sky-50/50 flex flex-col items-center justify-center text-sky-800">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span className="text-[9px] font-bold mt-0.5">Tervalidasi Digital</span>
                          <span className="text-[8px] font-mono text-slate-500">{mitra.id}</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-400 pt-1 inline-block min-w-[180px]">
                        <div className="font-black text-xs text-slate-950">{mitra.namaLengkap}</div>
                        <div className="text-[10px] text-slate-500">ID Mitra: {mitra.id}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footnote Barcode */}
                <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Dokumen Digital Resmi &bull; UU ITE No. 11/2008 Ps. 5</span>
                  <span>Verifikasi Hash: {btoa(mitra.id + mitra.namaLengkap).slice(0, 16)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: BROSUR PROMOSI A4 ================= */}
        {activeTab === 'brosur' && <BrosurGenerator mitra={mitra} />}

        {/* ================= TAB 4: GENERATOR COPYWRITING ================= */}
        {activeTab === 'copywriting' && <CopywritingBlastGenerator mitra={mitra} />}

        {/* ================= TAB 5: ID CARD MAKER CR80 ================= */}
        {activeTab === 'idcard' && (
          <IdCardMaker
            mitra={mitra}
            onUpdateMitra={(updates) => {
              setMitra((prev) => ({ ...prev, ...updates }));
              updateMitraProfile(mitra.id, updates);
            }}
          />
        )}
      </div>
    </div>
  );
};
