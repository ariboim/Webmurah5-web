export interface OrderFormData {
  namaSalesKonsultan: string;
  // Pilihan Paket
  pilihanPaket?: 'umkm' | 'elite';
  // 1. Data Klien
  namaLengkap: string;
  nomorWa: string;
  email: string;
  namaBisnis: string;
  domainPilihan?: string;
  alamatBisnis: string;
  mediaSosial: string;
  // 2. Informasi Produk / Layanan
  namaProduk: string;
  deskripsiProduk: string;
  targetAudiens: string;
  hargaPenawaran: string;
  catatanTambahan?: string;
  // 3. Kebutuhan & Tujuan Landing Page
  tujuanLandingPage: string[];
  tujuanLainnya: string;
  ctaDiinginkan: string[];
  ctaLainnya: string;
  // Status Promo 50%
  isPromoActive?: boolean;
}

export const ADMIN_WA_NUMBER = '6289673686625';
export const ADMIN_WA_DISPLAY = '0896-7368-6625';

export function formatOrderToWhatsApp(data: OrderFormData, isPromoActiveOverride?: boolean): string {
  const isPromo = isPromoActiveOverride ?? data.isPromoActive ?? false;
  const isElite = data.pilihanPaket === 'elite';
  const tujuanList = [...data.tujuanLandingPage];
  if (data.tujuanLainnya.trim()) {
    tujuanList.push(`Lainnya: ${data.tujuanLainnya.trim()}`);
  }

  const ctaList = [...data.ctaDiinginkan];
  if (data.ctaLainnya.trim()) {
    ctaList.push(`Lainnya: ${data.ctaLainnya.trim()}`);
  }

  const paketText = isElite
    ? `Paket: PAKET ELITE (Web Custom - Sampai 7 Halaman)`
    : isPromo
    ? `Paket: PAKET UMKM - PROMO DISKON 50% (Rp 499.000 -> Rp 249.500)`
    : `Paket: PAKET UMKM FLASH SALE (Rp 1.8 Juta -> Rp 499.000)`;

  const statusText = isElite
    ? `Status: HARGA NET TETAP (Promo Banner Tidak Berlaku)\nTotal Tagihan: Rp 3.000.000`
    : isPromo
    ? `Status Promo: YA (KLAIM PROMO DISKON 50% BANNER)\nTotal Tagihan: Rp 249.500`
    : `Status Promo: REGULER FLASH SALE\nTotal Tagihan: Rp 499.000`;

  const lines = [
    `*FORMULIR PEMESANAN JASA WEBSITE WEBMURAH.BIZ.ID*`,
    paketText,
    ``,
    `--------------------------------`,
    statusText,
    `--------------------------------`,
    `Tanggal: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}`,
    ``,
    data.namaSalesKonsultan ? `*Nama Sales Konsultan:* ${data.namaSalesKonsultan}` : `*Nama Sales Konsultan:* -`,
    ``,
    `*1. DATA KLIEN*`,
    `• *Nama Lengkap / PIC:* ${data.namaLengkap || '-'}`,
    `• *No. WhatsApp / Kontak:* ${data.nomorWa || '-'}`,
    `• *Email:* ${data.email || '-'}`,
    `• *Nama Bisnis / Brand:* ${data.namaBisnis || '-'}`,
    `• *Pilihan Nama Domain:* ${data.domainPilihan || '(Belum ditentukan / minta rekomendasi admin)'}`,
    `• *Alamat Pengiriman / Bisnis:* ${data.alamatBisnis || '-'}`,
    `• *Web / Medsos Saat Ini:* ${data.mediaSosial || '-'}`,
    ``,
    `*2. INFORMASI PRODUK / LAYANAN*`,
    `• *Nama Produk / Layanan:* ${data.namaProduk || '-'}`,
    `• *Deskripsi Singkat:* ${data.deskripsiProduk || '-'}`,
    `• *Target Audiens:* ${data.targetAudiens || '-'}`,
    `• *Harga & Penawaran Khusus:* ${data.hargaPenawaran || '-'}`,
    data.catatanTambahan ? `• *Catatan Tambahan:* ${data.catatanTambahan}` : null,
    ``,
    `*3. KEBUTUHAN & TUJUAN WEBSITE*`,
    `• *Tujuan Utama:*`,
    ...(tujuanList.length > 0 ? tujuanList.map(t => `   - ${t}`) : [`   - (Belum ditentukan)`]),
    `• *Call to Action (CTA) Diinginkan:*`,
    ...(ctaList.length > 0 ? ctaList.map(c => `   - ${c}`) : [`   - (Belum ditentukan)`]),
    ``,
    isElite
      ? `*4. SYARAT & KETENTUAN PAKET ELITE:*
• Skema Pembayaran: Wajib DP 50% (Rp 1.500.000) di awal, sisanya (Rp 1.500.000) setelah pengerjaan selesai & disetujui.
• Waktu Pengerjaan: 5 - 7 hari kerja.
• Fasilitas: Sampai 7 halaman custom, optimasi PageSpeed, SEO on-page, domain & hosting 1 tahun, dan free revisi 2x.

Halo Admin Webkilat, saya memesan *PAKET ELITE (Web Custom - Rp 3.000.000)* dengan komitmen DP 50% & estimasi pengerjaan 5-7 hari kerja. Mohon segera dipandu untuk sesi briefing materi & nomor rekening DP. Terima kasih!`
      : `*4. SYARAT & KETENTUAN PAKET UMKM:*
• Skema Pembayaran: PESAN SEKARANG, BAYAR SETELAH JADI (100% Bebas Risiko).
• Waktu Pengerjaan: Kilat 1 hari kerja (24 jam selesai).
• Setelah web jadi kami akan mengirimkan invoice dengan batas waktu 1 x 24 jam untuk pembayaran.
• Free revisi 1x, free domain .my.id/.biz.id 1 tahun, cloud hosting & tombol WhatsApp.

${
  isPromo
    ? 'Halo Admin Webkilat, saya memesan lewat *Promo Diskon 50% (Rp 249.500)*. Mohon segera diproses pengerjaannya 1 hari kilat. Terima kasih!'
    : 'Halo Admin Webkilat, saya sudah mengisi formulir order di atas dan menyetujui ketentuan paket UMKM (Rp 499.000). Mohon segera diproses pengerjaannya. Terima kasih!'
}`
  ].filter(line => line !== null) as string[];

  return lines.join('\n');
}

export function generateWhatsAppUrl(data: OrderFormData, isPromoActiveOverride?: boolean): string {
  const message = formatOrderToWhatsApp(data, isPromoActiveOverride);
  return `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
