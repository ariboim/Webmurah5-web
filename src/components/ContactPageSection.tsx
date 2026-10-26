import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageCircle,
  MapPin,
  Mail,
  Clock,
  Phone,
  ShieldCheck,
  Send,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { ADMIN_WA_NUMBER, ADMIN_WA_DISPLAY } from '../types/order';
import { trackWhatsAppClick } from '../utils/analytics';

interface ContactPageSectionProps {
  onNavigateToOrder?: () => void;
}

export const ContactPageSection: React.FC<ContactPageSectionProps> = ({ onNavigateToOrder }) => {
  const [senderName, setSenderName] = useState('');
  const [senderWa, setSenderWa] = useState('');
  const [subject, setSubject] = useState('Konsultasi Paket Promo Rp 499rb');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleQuickSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    trackWhatsAppClick('contact_page_form');
    setSubmitted(true);

    const formattedText = `*Halo Admin Indo Digital / Webkilat!*

Saya ingin menghubungi tim Anda dari halaman Kontak:
• *Nama Pengirim:* ${senderName || '-'}
• *Nomor WhatsApp:* ${senderWa || '-'}
• *Topik:* ${subject}
• *Pesan:*
${message || 'Saya ingin konsultasi seputar jasa pembuatan landing page 1 hari Rp 499.000.'}

Mohon responnya ya Admin. Terima kasih!`;

    const waUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(formattedText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const quickTemplates = [
    {
      title: 'Tanya Promo Rp 499rb',
      desc: 'Ingin tahu kuota promo & rincian all-in',
      text: 'Halo Admin Webkilat, apakah kuota Flash Sale Landing Page Rp 499.000 masih tersedia hari ini? Saya mau tanya rinciannya.',
      color: 'border-sky-200 hover:border-sky-400 hover:bg-sky-50/80',
      badge: 'Promo Terbatas',
    },
    {
      title: 'Konsultasi Ide Bisnis',
      desc: 'Bahas struktur landing page cocok untuk produk Anda',
      text: 'Halo Admin, saya punya bisnis [sebutkan produk/jasa]. Ingin konsultasi struktur landing page apa yang paling efektif menghasilkan closing WhatsApp.',
      color: 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/80',
      badge: 'Gratis 100%',
    },
    {
      title: 'Cek Status Pengerjaan',
      desc: 'Tanyakan progres web yang sedang dibuat',
      text: 'Halo Admin Indo Digital, saya ingin menanyakan progres pembuatan landing page untuk bisnis saya. Terima kasih.',
      color: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/80',
      badge: 'Layanan Klien',
    },
    {
      title: 'Tanya Domain & Hosting',
      desc: 'Cek ketersediaan nama domain pilihan Anda',
      text: 'Halo Admin, saya mau cek apakah nama domain [sebutkan nama].my.id atau .biz.id masih tersedia untuk paket landing page saya?',
      color: 'border-amber-200 hover:border-amber-400 hover:bg-amber-50/80',
      badge: 'Free 1 Tahun',
    },
  ];

  return (
    <div className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider border border-emerald-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Customer Service & Tim Indo Digital Online 24 Jam</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight text-balance">
            Hubungi Kami & Konsultasi <span className="text-sky-600">Gratis</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Punya pertanyaan mengenai paket Flash Sale Rp 499.000, kebutuhan desain khusus, atau butuh bantuan teknis? Tim Indo Digital Solution siap merespon pertanyaan Anda dengan cepat dan ramah.
          </p>
        </div>

        {/* 3 Core Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: WhatsApp Official */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
                <MessageCircle className="w-6 h-6 fill-emerald-600 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                  Respon Tercepat (&lt; 5 Menit)
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  WhatsApp Admin Resmi
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Konsultasikan produk, klaim promo, hingga verifikasi bukti bayar langsung dengan PIC admin.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/70 space-y-1">
                <div className="text-[11px] text-emerald-800 font-bold">Nomor Kontak Resmi:</div>
                <div className="text-lg font-black text-emerald-950 font-mono tracking-tight">
                  {ADMIN_WA_DISPLAY}
                </div>
                <div className="text-[10px] text-emerald-700 flex items-center gap-1.5 pt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Aktif setiap hari (Senin - Minggu)</span>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${ADMIN_WA_NUMBER}?text=Halo%20Admin%20Indo%20Digital,%20saya%20mau%20konsultasi%20jasa%20landing%20page%201%20hari%20Rp%20499rb.`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('contact_card_primary')}
              className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group-hover:shadow-emerald-600/30"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat WhatsApp Sekarang</span>
            </a>
          </div>

          {/* Card 2: Kantor & Studio */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shadow-sm">
                <MapPin className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <div className="text-xs font-black text-sky-700 uppercase tracking-wider">
                  Alamat Kantor & Studio
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Indo Digital Solution
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Studio kreatif dan pengembangan aplikasi web untuk UMKM Indonesia.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs text-slate-700 leading-relaxed">
                <div className="font-semibold text-slate-900">
                  Jl. Pangkalan 6 Raya No. 16 RT 003 RW 004
                </div>
                <div>Kelurahan Ciketing Udik, Kecamatan Bantar Gebang</div>
                <div className="font-medium text-slate-500">Kota Bekasi, Jawa Barat 17153</div>
                <div className="text-[11px] text-sky-700 font-bold pt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Jam Operasional: 08:00 - 22:00 WIB</span>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=-6.3312,106.9942"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-slate-500" />
              <span>Petunjuk Arah Google Maps</span>
            </a>
          </div>

          {/* Card 3: Email & Legalitas */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs font-black text-indigo-700 uppercase tracking-wider">
                  Legalitas & Keamanan
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  100% Terpercaya & Bergaransi
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Layanan terdaftar dengan faktur pembayaran resmi dan jaminan garansi 1 hari jadi.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Email Korespondensi:</div>
                    <a
                      href="mailto:admin@webmurah.biz.id"
                      className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      admin@webmurah.biz.id
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                  <Building2 className="w-4 h-4 text-slate-600 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Layanan Utama:</div>
                    <div className="font-semibold text-slate-900">Jasa Landing Page Kilat & Web UMKM</div>
                  </div>
                </div>
              </div>
            </div>

            {onNavigateToOrder && (
              <button
                onClick={onNavigateToOrder}
                className="mt-6 w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buka Formulir Pemesanan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Message Templates */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-sky-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Template Pesan Cepat 1-Klik</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pilih Topik Chat WhatsApp yang Anda Butuhkan:
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Klik salah satu topik di bawah ini untuk langsung membuka draf pesan siap kirim di aplikasi WhatsApp Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTemplates.map((item, idx) => (
              <a
                key={idx}
                href={`https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(item.text)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick(`quick_template_${idx + 1}`)}
                className={`p-4.5 rounded-2xl border bg-white shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer ${item.color}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {item.badge}
                    </span>
                    <MessageCircle className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-sky-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700 group-hover:text-sky-900">
                  <span>Kirim ke WA</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Contact Form + Map Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Quick Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                <Send className="w-3.5 h-3.5" />
                <span>Form Kirim Pertanyaan Kilat</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Tulis Pesan Anda Langsung ke Admin
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Isi form di bawah, teks akan otomatis tersusun rapi untuk dikirimkan ke WhatsApp resmi kami.
              </p>
            </div>

            <form onSubmit={handleQuickSendMessage} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Nama Anda / Usaha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Contoh: Pak Budi / Kedai Kopi"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Nomor WhatsApp Anda <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderWa}
                    onChange={(e) => setSenderWa(e.target.value)}
                    placeholder="Contoh: 0812-3456-7890"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Topik Pertanyaan
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-slate-800 text-xs bg-white"
                >
                  <option value="Konsultasi Paket Promo Rp 499rb">Konsultasi Paket Promo Rp 499rb All-In</option>
                  <option value="Tanya Ketersediaan Domain & Nama Web">Tanya Ketersediaan Domain & Nama Web</option>
                  <option value="Permintaan Desain Kustom Khusus">Permintaan Desain Kustom Khusus</option>
                  <option value="Konfirmasi Bukti Pembayaran">Konfirmasi Bukti Pembayaran</option>
                  <option value="Bantuan Teknis / Pertanyaan Lainnya">Bantuan Teknis / Pertanyaan Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Isi Pesan / Pertanyaan
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan detail pertanyaan atau produk usaha yang ingin Anda buatkan landing page-nya..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-slate-800 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Kirim Pesan ke WhatsApp Admin ({ADMIN_WA_DISPLAY})</span>
              </button>
            </form>
          </div>

          {/* Right: Map & Studio Location Embed */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Lokasi Studio & Operasional</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Peta Studio Indo Digital
              </h3>
              <p className="text-xs text-slate-500">
                Bekasi, Jawa Barat · Buka Setiap Hari (08.00 - 22.00 WIB)
              </p>
            </div>

            {/* Simulated Interactive Map Card */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative bg-slate-900 aspect-video sm:aspect-4/3 flex flex-col justify-end p-4">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="absolute top-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-white text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold">Studio Indo Digital Official</span>
                </div>
                <span className="text-[10px] text-sky-400">Terverifikasi</span>
              </div>

              <div className="relative z-10 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 text-slate-800 text-xs space-y-1">
                <div className="font-extrabold text-slate-900">
                  Jl. Pangkalan 6 Raya No. 16 RT 003 RW 004
                </div>
                <div className="text-[11px] text-slate-600">
                  Ciketing Udik, Bantar Gebang, Kota Bekasi
                </div>
                <a
                  href="https://maps.google.com/?q=-6.3312,106.9942"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-800 pt-1"
                >
                  <span>Buka di Google Maps App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs">
              <div className="font-extrabold text-sky-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Konsultasi Online Fleksibel</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Untuk efisiensi dan kecepatan respon pengerjaan 1 hari kerja, 95% komunikasi dan review desain dilakukan secara praktis melalui WhatsApp resmi dan link demo staging interaktif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
