import React, { useState } from 'react';
import {
  MessageCircle,
  Copy,
  Check,
  Send,
  Sparkles,
  Zap,
  BookOpen,
  TrendingUp,
  RotateCcw,
  User,
  Building,
  HelpCircle,
} from 'lucide-react';
import { MitraAccount } from '../../types/mitra';

interface CopywritingBlastGeneratorProps {
  mitra: MitraAccount;
}

export const CopywritingBlastGenerator: React.FC<CopywritingBlastGeneratorProps> = ({ mitra }) => {
  const [prospekName, setProspekName] = useState('Bapak/Ibu');
  const [bisnisName, setBisnisName] = useState('Usaha Anda');
  const [activeCategory, setActiveCategory] = useState<'promo' | 'edukasi' | 'hardsell' | 'followup'>('promo');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const referralLink = `https://webmurah.biz.id/?ref=${encodeURIComponent(mitra.id)}`;

  const templates = [
    {
      id: 'promo_50',
      category: 'promo',
      title: 'Pemberitahuan Promo Diskon 50% (Flash Sale)',
      subtitle: 'Sangat cocok untuk broadcast calon klien UMKM & relasi bisnis.',
      getText: () =>
        `Halo ${prospekName}, salam kenal dari saya *${mitra.namaLengkap}* (Digital Consultant PT INOVASI TEKNOLOGI DIGITAL INDONESIA).\n\nApakah saat ini ${bisnisName} sudah memiliki website resmi sendiri?\n\nKabar baik untuk para pelaku usaha, hari ini kami sedang membuka program *Flash Sale Diskon 50%* pembuatan Website Landing Page Profesional:\n\n🔥 *Harga Promo Khusus:* Hanya *Rp 249.500* (Normal Rp 499.000)\n⚡ *Selesai Kilat:* Cuma butuh 1x24 jam langsung online!\n🌐 *Fasilitas Lengkap:* Gratis domain resmi .biz.id / .com, Cloud Hosting cepat, sertifikat keamanan SSL, dan tombol order langsung ke WhatsApp Anda.\n\nSlot promo ini sangat terbatas karena dikerjakan secara langsung oleh tim web developer kami. Boleh saya bantu buatkan pratinjau rancangan web untuk *${bisnisName}* hari ini, ${prospekName}?\n\nInfo selengkapnya bisa cek di: ${referralLink}\n\nTerima kasih! 🙏`,
    },
    {
      id: 'edukasi_landingpage',
      category: 'edukasi',
      title: 'Edukasi: Mengapa Bisnis Wajib Punya Landing Page',
      subtitle: 'Format soft-selling edukatif yang membangun trust calon klien.',
      getText: () =>
        `Selamat pagi/siang ${prospekName},\n\nPernahkah Anda memperhatikan kenapa brand atau kompetitor di bidang yang sama dengan *${bisnisName}* terkesan jauh lebih terpercaya dan laris?\n\nSalah satu rahasia terbesarnya adalah mereka memiliki *Website Landing Page Resmi*. Dengan landing page:\n1. Calon pembeli percaya 10x lipat karena bisnis Anda resmi dan berdomain jelas.\n2. Informasi produk, daftar harga, dan testimoni tertata rapi tanpa perlu Anda ketik berulang kali.\n3. Link web bisa dipasang di bio Instagram, TikTok, Facebook Ads, maupun status WA.\n\nKabar baiknya, kini memiliki website tidak perlu keluar biaya jutaan rupiah. Di *webmurah.biz.id*, Anda bisa memiliki website bisnis siap jualan hanya dengan *Rp 249.500* (sudah termasuk domain & hosting 1 tahun).\n\nBoleh saya kirimkan contoh portofolio landing page yang sudah kami buatkan untuk jenis usaha seperti ${bisnisName}, ${prospekName}?\n\nSalam sukses,\n*${mitra.namaLengkap}*\nWhatsApp: ${mitra.noHpWa}\nPortal: ${referralLink}`,
    },
    {
      id: 'hardsell_urgency',
      category: 'hardsell',
      title: 'Hard Selling: Kuota Terbatas & Siap Pakai 24 Jam',
      subtitle: 'Memicu aksi cepat (FOMO) bagi calon pelanggan yang menunda-nunda.',
      getText: () =>
        `*KHUSUS HARI INI: BIKIN WEBSITE CUMA RP 240 RIBU-AN!* 🚨\n\nHalo ${prospekName}, kesempatan terbatas untuk memajukan *${bisnisName}* ke tingkat profesional!\n\nKami membuka kuota pengerjaan kilat 1 HARI JADI untuk pembuatan landing page bisnis:\n\n✅ Gratis Domain Resmi\n✅ Gratis Cloud Hosting 1 Tahun\n✅ Desain Modern & Responsif HP\n✅ Integrasi Chat WhatsApp Penjual\n✅ Bayar sekali tanpa iuran bulanan!\n\nInvestasi normal Rp 499.000, khusus kuota rujukan saya diskon 50% menjadi *Rp 249.500* saja!\n\nKuota sisa 3 slot antrean hari ini. Jika berminat, langsung balas pesan ini atau klik link rujukan resmi saya:\n👉 ${referralLink}\n\nHubungi: *${mitra.namaLengkap}* (${mitra.noHpWa})`,
    },
    {
      id: 'followup_prospek',
      category: 'followup',
      title: 'Follow-Up Prospek Hangat / Tanya-Tanya Sebelumnya',
      subtitle: 'Menyapa kembali prospek yang belum sempat menyelesaikan pemesanan.',
      getText: () =>
        `Halo ${prospekName}, semoga harinya menyenangkan.\n\nMenyambung obrolan kita sebelumnya mengenai pembuatan website landing page untuk *${bisnisName}*, saya ingin memastikan apakah promo diskon 50% ini masih ingin Anda amankan?\n\nTim teknis kami sedang memiliki jadwal luang untuk pengerjaan prioritas hari ini sehingga bisa langsung tayang online besok pagi.\n\nJika ada materi atau foto produk yang ingin saya bantu rapikan terlebih dahulu, jangan sungkan beri tahu saya ya ${prospekName}. Kami siap bantu sampai selesai tuntas!\n\nCek kembali rinciannya di: ${referralLink}\n\nSalam hangat,\n*${mitra.namaLengkap}*`,
    },
  ];

  const filteredTemplates = templates.filter((t) => t.category === activeCategory);

  const handleCopyText = (id: string, text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2500);
      });
    } else {
      prompt('Salin teks promosi di bawah:', text);
    }
  };

  const handleSendWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
            <MessageCircle className="w-5 h-5" />
          </span>
          <h3 className="text-lg font-black text-slate-900">
            Generator Copywriting Blast Promosi (WhatsApp &amp; Sosmed)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Koleksi naskah penawaran siap pakai dengan copywriting berdaya konversi tinggi. Cukup isi nama prospek dan nama bisnisnya, teks akan otomatis terisi rapi beserta identitas dan link rujukan Anda.
        </p>

        {/* Dynamic Parameter Inputs */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Sapaan / Nama Calon Klien (Prospek)
            </label>
            <input
              type="text"
              value={prospekName}
              onChange={(e) => setProspekName(e.target.value)}
              placeholder="Contoh: Kak Budi / Ibu Maya"
              className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              Nama Bisnis / Usaha Prospek
            </label>
            <input
              type="text"
              value={bisnisName}
              onChange={(e) => setBisnisName(e.target.value)}
              placeholder="Contoh: Resto Soto Sedap / Toko Baju Zahra"
              className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory('promo')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeCategory === 'promo'
              ? 'bg-[#1D3582] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          🔥 Pemberitahuan Promo 50%
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('edukasi')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeCategory === 'edukasi'
              ? 'bg-[#1D3582] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          💡 Edukasi Manfaat Landing Page
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('hardsell')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeCategory === 'hardsell'
              ? 'bg-[#1D3582] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          ⚡ Hard Selling (Flash Sale)
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('followup')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeCategory === 'followup'
              ? 'bg-[#1D3582] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          🤝 Follow-Up Prospek
        </button>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {filteredTemplates.map((item) => {
          const generatedText = item.getText();
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleCopyText(item.id, generatedText)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Teks</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendWhatsApp(generatedText)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim ke WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Text Area Preview */}
              <div className="relative">
                <pre className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {generatedText}
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
