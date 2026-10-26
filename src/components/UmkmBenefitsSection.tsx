import React from 'react';
import { ShieldCheck, Target, Zap, TrendingUp, Users, Check, X, ArrowRight } from 'lucide-react';

export const UmkmBenefitsSection: React.FC = () => {
  const scrollToOrder = () => {
    const el = document.getElementById('formulir-order');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="keunggulan" className="py-20 bg-slate-50/60 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="text-xs font-semibold text-sky-700 tracking-wider uppercase">
            Mengapa Bisnis Anda Butuh Landing Page Resmi?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Tingkatkan Kredibilitas UMKM & Jangkau Pelanggan Seluruh Nusantara Lebih Mudah
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Di era digital saat ini, pembeli semakin cerdas dan selektif. Memiliki landing page profesional adalah cara paling cepat membedakan bisnis Anda dari kompetitor biasa dan melipatgandakan closing di WhatsApp.
          </p>
        </div>

        {/* 5 Deep Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Benefit 1 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Kredibilitas Bisnis Naik Drastis
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Calon pembeli sering ragu berbelanja jika hanya melihat akun Instagram atau nomor WA tanpa bukti legalitas. Dengan landing page berdomain resmi, bisnis Anda terlihat matang, terpercaya, dan aman dari keraguan penipuan.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Jangkau Pasar Lebih Luas 24/7
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Landing page Anda bekerja tanpa henti selama 24 jam sehari. Calon pelanggan dari Sabang sampai Merauke bisa membaca manfaat produk, melihat testimoni, dan melakukan pemesanan kapan saja bahkan saat Anda sedang istirahat.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Bebas dari Perang Harga Marketplace
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Di marketplace, pembeli sangat mudah tergiur produk tiruan kompetitor di sebelah yang banting harga. Di landing page mandiri, perhatian calon pembeli terfokus 100% pada nilai, kualitas, dan bonus penawaran unik brand Anda.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Desain Kustom, Bukan Template Pasaran
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Kami tidak menggunakan template kaku copy-paste. Tata letak, tipografi, warna, dan alur edukasi kami rancang khusus sesuai target audiens Anda, sehingga setiap kata dan elemen visual memiliki daya pikat tinggi untuk closing.
            </p>
          </div>

          {/* Benefit 5 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Order Otomatis Langsung ke WhatsApp
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pembeli yang mengklik tombol Call to Action akan langsung diarahkan ke WhatsApp admin dengan draf pesan yang sudah terisi otomatis (nama, alamat, paket yang dipilih). Tim admin Anda tinggal mengirimkan nomor rekening!
            </p>
          </div>

          {/* Benefit 6 - Action Card */}
          <div className="bg-gradient-to-br from-sky-600 to-sky-700 p-7 rounded-2xl text-white shadow-md flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
                Peluang Pertumbuhan Bisnis
              </span>
              <h3 className="text-xl font-bold leading-snug">
                Investasi Cuma Rp 499 Ribu, Manfaatnya Berkelanjutan
              </h3>
              <p className="text-xs text-sky-100 leading-relaxed">
                Biaya yang lebih murah dari makan bersama keluarga, namun menjadi aset digital resmi yang bisa Anda gunakan selamanya untuk promosi di Instagram, TikTok, Google, dan grup komunitas.
              </p>
            </div>
            <button
              onClick={scrollToOrder}
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-sky-900 bg-white hover:bg-sky-50 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Mulai Buat Sekarang (1 Hari Jadi)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Head-to-Head Comparison Table */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-6 sm:p-8 bg-sky-50/60 border-b border-slate-200 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Perbandingan Penjualan Online</h3>
              <p className="text-xs text-slate-600 mt-1">Lihat perbedaan nyata antara berjualan konvensional vs memiliki landing page resmi webkilat</p>
            </div>
            <div className="text-xs font-semibold px-3 py-1 bg-sky-200/60 text-sky-900 rounded-lg whitespace-nowrap">
              Standar Bisnis Modern 2026
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Aspek Bisnis</th>
                  <th className="py-4 px-6 text-slate-600">Hanya Mengandalkan Medsos / Marketplace</th>
                  <th className="py-4 px-6 text-sky-700 bg-sky-50/70">Pakai Landing Page Kustom Webkilat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Tingkat Kepercayaan Pembeli</td>
                  <td className="py-4 px-6 flex items-center gap-2 text-slate-500">
                    <X className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Rendah, pembeli takut akun palsu / penipuan transfer</span>
                  </td>
                  <td className="py-4 px-6 bg-sky-50/40 text-slate-900 font-medium">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Sangat tinggi dengan nama domain resmi & alamat jelas</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Efisiensi Customer Service</td>
                  <td className="py-4 px-6 flex items-center gap-2 text-slate-500">
                    <X className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Admin lelah menjawab pertanyaan harga & variasi berulang-ulang</span>
                  </td>
                  <td className="py-4 px-6 bg-sky-50/40 text-slate-900 font-medium">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Customer datang sudah teredukasi dan langsung siap bayar</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Kebebasan Desain & Brand</td>
                  <td className="py-4 px-6 flex items-center gap-2 text-slate-500">
                    <X className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Kaku dan terbatas aturan feed atau layout marketplace</span>
                  </td>
                  <td className="py-4 px-6 bg-sky-50/40 text-slate-900 font-medium">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>100% kustom disesuaikan dengan warna, estetika & target pasar</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Fokus Perhatian Pembeli</td>
                  <td className="py-4 px-6 flex items-center gap-2 text-slate-500">
                    <X className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Terganggu rekomendasi produk toko lain yang banting harga</span>
                  </td>
                  <td className="py-4 px-6 bg-sky-50/40 text-slate-900 font-medium">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Fokus 100% eksklusif hanya pada produk dan penawaran Anda</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Kesiapan Beriklan (Ads)</td>
                  <td className="py-4 px-6 flex items-center gap-2 text-slate-500">
                    <X className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Biaya iklan sering boncos karena conversion rate rendah</span>
                  </td>
                  <td className="py-4 px-6 bg-sky-50/40 text-slate-900 font-medium">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Optimal untuk Meta Ads, TikTok Ads & Google Ads dengan ROAS tinggi</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
