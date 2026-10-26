import React, { useState } from 'react';
import {
  Briefcase,
  TrendingUp,
  Award,
  PenTool,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Building,
  HelpCircle,
} from 'lucide-react';
import { MitraAccount } from '../types/mitra';
import { getCurrentMitraSession, clearMitraSession } from '../utils/mitraStorage';
import { MitraDashboard } from './mitra/MitraDashboard';
import { MitraAuthCard } from './mitra/MitraAuthCard';

export const KemitraanPageSection: React.FC<{
  onNavigateToOrder?: () => void;
  onNavigateToContact?: () => void;
}> = ({ onNavigateToOrder, onNavigateToContact }) => {
  const [loggedMitra, setLoggedMitra] = useState<MitraAccount | null>(() => getCurrentMitraSession());
  const [copiedLink, setCopiedLink] = useState(false);

  const getDirectLink = () => {
    if (typeof window !== 'undefined' && window.location.origin) {
      return `${window.location.origin}/#/kemitraan`;
    }
    return 'https://webmurah.biz.id/#/kemitraan';
  };

  const handleCopyLink = () => {
    const link = getDirectLink();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }).catch(() => {
        prompt('Salin link kemitraan berikut:', link);
      });
    } else {
      prompt('Salin link kemitraan berikut:', link);
    }
  };

  const handleShareWaLink = () => {
    const link = getDirectLink();
    const text = `Halo! Berikut adalah link pendaftaran resmi Program Kemitraan Mandiri (Non-PKWT) PT INOVASI TEKNOLOGI DIGITAL INDONESIA:\n\n${link}\n\nSilakan buka tautan di atas untuk melengkapi formulir registrasi kemitraan secara online.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // If already authenticated as an approved partner, show Mitra Dashboard directly
  if (loggedMitra) {
    return (
      <MitraDashboard
        mitra={loggedMitra}
        onLogout={() => {
          clearMitraSession();
          setLoggedMitra(null);
        }}
        onNavigateToOrder={onNavigateToOrder}
      />
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-black uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-indigo-700" />
            <span>Program Karir &amp; Kemitraan Mandiri (Non-PKWT)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Kerjasama Kemitraan Digital <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D3582] via-sky-600 to-indigo-600">
              PT Inovasi Teknologi Digital Indonesia
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Sistem onboarding kemitraan mandiri berkeabsahan hukum. Bebas bekerja dari mana saja (Full WFH) dengan pembagian fee 60% : 40% dan peluang pengangkatan karyawan tetap (PKWTT).
          </p>

          {/* Direct Link Share & Copy Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xl mx-auto">
            <div className="w-full sm:flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2 overflow-hidden text-left min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                <span className="text-xs font-mono font-bold text-slate-700 truncate select-all">
                  {typeof window !== 'undefined' ? `${window.location.origin}/#/kemitraan` : 'https://webmurah.biz.id/#/kemitraan'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-all border border-sky-200 cursor-pointer"
                title="Salin Direct Link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-sky-700" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={handleShareWaLink}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan WhatsApp</span>
            </button>
          </div>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center text-center space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black">
              60%
            </div>
            <div className="text-xs font-extrabold text-slate-900">Hak Fee Mitra</div>
            <div className="text-[11px] text-slate-500">60% Mitra : 40% Principle</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center text-center space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-slate-900">Pencairan Mingguan</div>
            <div className="text-[11px] text-slate-500">Weekly settlement rekening</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center text-center space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-slate-900">Jalur PKWTT Tetap</div>
            <div className="text-[11px] text-slate-500">Gaji Rp 3jt - Rp 5.8jt/bln</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center text-center space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <PenTool className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-slate-900">Digital Signature</div>
            <div className="text-[11px] text-slate-500">Tanda tangan online &amp; PDF</div>
          </div>
        </div>

        {/* PRIVACY RESTRICTED GATE: Register Calon Mitra (Pending Approval) / Login Portal & Akses Admin */}
        <MitraAuthCard
          onLoginSuccess={(m) => {
            setLoggedMitra(m);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToAdmin={() => {
            window.location.hash = '#/admin';
          }}
        />
      </div>
    </div>
  );
};
