import React from 'react';
import { Sparkles, ShieldCheck, Clock, MessageCircle, ArrowLeft } from 'lucide-react';
import { OrderFlowSection } from './OrderFlowSection';
import { OrderFormSection } from './OrderFormSection';
import { ADMIN_WA_NUMBER, ADMIN_WA_DISPLAY } from '../types/order';

interface OrderPageSectionProps {
  onNavigateToHome?: () => void;
  onNavigateToContact?: () => void;
}

export const OrderPageSection: React.FC<OrderPageSectionProps> = ({
  onNavigateToHome,
  onNavigateToContact,
}) => {
  return (
    <div className="py-8 sm:py-12 bg-slate-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md border-2 border-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>PESAN SEKARANG, BAYAR SETELAH JADI! (100% BEBAS RISIKO)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight text-balance">
            Formulir Pemesanan <span className="text-sky-600">Landing Page</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Lengkapi data produk dan bisnis Anda pada formulir di bawah ini. Tim Indo Digital Solution akan langsung menyusun materi, copywriting, dan desain landing page siap pakai dalam 1 hari kerja.
          </p>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-slate-700">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Gratis Domain 1 Tahun</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-2xs">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Selesai 1 Hari Kerja</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-2xs">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Siap Closing WhatsApp</span>
            </span>
          </div>
        </div>

        {/* Notice 1x24 Jam Box */}
        <div className="max-w-4xl mx-auto p-4 sm:p-4.5 bg-amber-50 rounded-2xl border-2 border-amber-300 text-amber-950 text-xs sm:text-[13px] flex items-start gap-3 shadow-xs">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-extrabold text-amber-900 uppercase">Ketentuan Invoice &amp; Pembayaran: </strong>
            Setelah web jadi kami akan mengirimkan invoice dengan batas waktu <strong>1 x 24 jam</strong> untuk pembayaran, jika sudah melewati batas waktu kami belum menerima pembayaran maka status web akan kami pending (tidak bisa online).
          </div>
        </div>

        {/* 5-Step Order Flow Diagram */}
        <OrderFlowSection />

        {/* The Exact Order Form with Unified Domain Checker */}
        <OrderFormSection />

        {/* Help Banner */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-900 text-sm">
              Ragu atau Butuh Tanya-Tanya Terlebih Dahulu?
            </h4>
            <p className="text-xs text-slate-500">
              Konsultasikan ide bisnis Anda dengan tim kami via WhatsApp atau buka halaman Kontak Kami.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onNavigateToContact && (
              <button
                onClick={onNavigateToContact}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Halaman Kontak
              </button>
            )}
            <a
              href={`https://wa.me/${ADMIN_WA_NUMBER}?text=Halo%20Admin%20Indo%20Digital,%20saya%20mau%20tanya%20sebelum%20isi%20form%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm"
            >
              Chat WhatsApp Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
