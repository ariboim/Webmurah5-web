export interface WebsitePackage {
  id: string;
  name: string;
  badge: string;
  normalPrice: string;
  promoPrice: string;
  priceNote: string;
  turnaroundTime: string;
  paymentTerms: string;
  domainHosting: string;
  pageCount: string;
  features: string[];
  comparativeAdvantage: string;
  uspPitch: string;
}

export interface DigitalProduct {
  id: string;
  slug: string;
  title: string;
  price: string;
  normalPrice?: string;
  category: 'E-Course' | 'E-Book' | 'Sistem & Bisnis' | 'Language & Skill';
  catalogUrl: string;
  shortDesc: string;
  usp: string;
  targetMarket: string;
  keySellingPoints: string[];
}

export interface BuyerPersona {
  id: string;
  segmentName: string;
  iconName: string;
  description: string;
  productFit: string;
  painPoints: string[];
  solutionPitch: string;
  recommendedPackage: string;
}

export interface ObjectionItem {
  id: string;
  objection: string;
  context: string;
  coreMindset: string;
  recommendedResponse: string;
  closingFollowUp: string;
}

export interface ColdScript {
  id: string;
  title: string;
  targetChannel: 'WhatsApp' | 'Instagram DM' | 'Facebook';
  context: string;
  scriptText: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  category: 'Paket Web' | 'Produk Digital' | 'Selling Skills & Handling';
}

// 1. KATALOG JASA PEMBUATAN WEBSITE
export const WEBSITE_PACKAGES: WebsitePackage[] = [
  {
    id: 'umkm',
    name: 'Paket UMKM (Landing Page Kilat)',
    badge: 'Diskon 50% Flash Sale',
    normalPrice: 'Rp 499.000',
    promoPrice: 'Rp 249.500',
    priceNote: 'All-In (Bayar sekali di tahun pertama)',
    turnaroundTime: '1x24 Jam Kilat Selesai (Langsung Online)',
    paymentTerms: 'Pesan Sekarang, Bayar Setelah Jadi! (100% Bebas Risiko)',
    domainHosting: 'Free Domain Resmi 1 Tahun (.biz.id / .my.id) + Cloud Hosting Cepat & SSL HTTPS',
    pageCount: '1 Halaman Landing Page Panjang Berfokus Konversi Penjualan',
    features: [
      '1 Halaman Landing Page konversi tinggi (Hero, Benefit, Produk, Testimoni, FAQ, Form)',
      'FREE Domain Resmi 1 Tahun (.biz.id & .my.id)',
      'Cloud Hosting Kecepatan Tinggi 1 Tahun + SSL Sertifikat Keamanan Resmi',
      'Desain Kustom Eksklusif (Bukan template kaku pasaran)',
      'Pengerjaan Kilat 1x24 Jam Langsung Online',
      'Copywriting Menjual yang persuasif memicu closing pembeli',
      'Integrasi Tombol WhatsApp interaktif & Form Pesanan langsung ke nomor pemilik',
      'Gratis Revisi 1x & Panduan Lengkap Penggunaan',
    ],
    comparativeAdvantage:
      'Dibanding jasa web lain yang meminta bayaran jutaan di awal dan pengerjaan berhari-hari, Paket UMKM webmurah.biz.id memberikan kepastian hasil: 1 hari jadi dan bayar hanya setelah website disetujui klien.',
    uspPitch:
      'Solusi website termurah & tercepat se-Indonesia dengan jaminan nol risiko tanpa DP untuk pelaku UMKM yang butuh validasi jualan online hari ini juga.',
  },
  {
    id: 'elite',
    name: 'Paket Elite (Web Custom Agensi)',
    badge: 'Recommended & Best Value',
    normalPrice: 'Rp 3.000.000',
    promoPrice: 'Rp 3.000.000 (Net)',
    priceNote: 'Harga Fixed / Tidak Berlaku Promo Diskon Banner 50%',
    turnaroundTime: '5 - 7 Hari Kerja Intensif',
    paymentTerms: 'Wajib DP 50% (Rp 1.500.000 di awal), sisa 50% dilunasi setelah pengerjaan tuntas & disetujui',
    domainHosting: 'Termasuk Domain Custom Pilihan + Cloud Server Dedicated Agensi + SSL Enterprise',
    pageCount: 'Hingga 7 Halaman Custom (Home, Profil, Layanan, Portofolio, Artikel, Kontak, dll.)',
    features: [
      'Arsitektur Multi-Halaman Kompleks hingga 7 halaman terstruktur rapi',
      'Wajib DP 50% di awal dan pelunasan bertahap saat serah terima',
      'Pengerjaan 5-7 Hari Kerja dengan Quality Assurance menyeluruh',
      'Desain UI/UX Custom Eksklusif mencerminkan identitas korporat & brand identity',
      'Optimasi Google PageSpeed kecepatan ultra kilat (90+ Skor Performa)',
      'Struktur SEO On-Page terintegrasi untuk memudahkan ranking Google pencarian lokal/nasional',
      'Formulir Kontak Lanjutan, Direct WhatsApp Lead, & Integrasi Peta Google Maps',
      'Garansi purna jual & maintenance pendampingan',
    ],
    comparativeAdvantage:
      'Setara dengan output agensi web enterprise bernilai 10-15 juta rupiah, namun dipangkas menjadi hanya 3 juta rupiah dengan SLA pengerjaan jelas dan standar kode modern yang sangat cepat.',
    uspPitch:
      'Fondasi digital berwibawa untuk bisnis berkembang yang ingin memenangkan tender, dipercaya calon mitra besar, dan mendominasi kata kunci Google.',
  },
  {
    id: 'enterprise',
    name: 'Paket Enterprise (Marketplace & Portal Niaga)',
    badge: 'Skala Besar & Marketplace',
    normalPrice: 'Rp 5.000.000',
    promoPrice: 'Rp 5.000.000 (Net)',
    priceNote: 'Wajib DP 50% (Rp 2.500.000) & Pelunasan Setelah Jadi',
    turnaroundTime: '15 - 30 Hari Kerja',
    paymentTerms: 'Wajib DP 50% (Rp 2.500.000 saat pemesanan), sisa 50% (Rp 2.500.000) dilunasi setelah web selesai & disetujui',
    domainHosting: 'Gratis Domain (.com, .id, .co.id) + Hosting 5 GB (120 Foto Kuota Kerja) + Bandwidth Unlimited',
    pageCount: '15 - 20 Menu / Halaman Interaktif Terintegrasi',
    features: [
      '15-20 Menu navigasi & katalog interaktif',
      'Gratis Domain .com, .id, .co.id resmi 1 tahun',
      'Hosting 5 GB (120 foto kuota kerja katalog produk)',
      'Free Whatsapp / Telepon langsung',
      'Integrasi Media Sosial lengkap',
      'Website SSL (Sertifikat Keamanan HTTPS)',
      'Template WP Premium berlisensi',
      'Perpanjang Setiap Tahun (Sistem terawat)',
      'User dan Video Panduan Edit mandiri',
      'Plugin Premium pendukung fungsionalitas niaga',
      'Free Banner dan Logo bisnis profesional',
      'Free 1 Email Bisnis profesional (@namabisnis.com)',
      'Pemasangan Google Map interaktif lokasi usaha',
      'Respon Server Rata-Rata 5 Mili Detik super cepat',
      'Bandwidth Unlimited tanpa batasan pengunjung',
      'Statistic Kunjungan Website (Traffic analytics)',
      'Standar Kontak Form terenkripsi',
      'Free Support teknis & pendampingan',
      'Garansi Selamanya selama berlangganan',
      'Integrasi Lapak Media',
      'Contoh model web marketplace / portal niaga (seperti Shopee, Lazada, Tokopedia, OLX, dsb.)',
      '*DISCLAIMER PENTING:* Harga belum termasuk pajak (PPN), biaya maintenance berkala, dan biaya revisi di luar kesepakatan awal.',
    ],
    comparativeAdvantage:
      'Solusi marketplace dan portal niaga lengkap berskala enterprise setara dengan software house puluhan juta rupiah, dapat dipesan dengan biaya hanya Rp 5 Juta (DP 50% Rp 2.5 Juta). Menghasilkan komisi mitra 60% sebesar Rp 3.000.000 per closing!',
    uspPitch:
      'Infrastruktur marketplace & portal niaga tangguh dengan fitur terlengkap (15-20 menu, hosting 5GB, garansi selamanya, server 5ms) untuk mendominasi pasar digital seperti Shopee/Tokopedia/OLX skala mandiri.',
  },
];

// 2. KATALOG PRODUK INDO DIGITAL LAINNYA (DARI https://indo-digital.myr.id)
export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'cyber-sec',
    slug: 'e-course-mahir-cyber-security',
    title: 'E-Course Mahir Cyber Security',
    price: 'Rp 249.000',
    category: 'E-Course',
    catalogUrl: 'https://indo-digital.myr.id/catalog/e-course-mahir-cyber-security',
    shortDesc: 'Kursus video komprehensif menguasai pertahanan siber, ethical hacking, dan audit celah sistem.',
    usp: 'Materi terstruktur dari nol hingga mahir siap praktek tanpa teori bertele-tele.',
    targetMarket: 'Mahasiswa IT, programmer, teknisi jaringan, dan siapa saja yang ingin berkarir di bidang Cybersecurity dengan gaji tinggi.',
    keySellingPoints: [
      'Akses video selamanya dengan studi kasus real-world hacking defense',
      'Membahas mitigasi malware, serangan phishing, dan enkripsi data',
      'Sertifikat digital kelulusan materi',
    ],
  },
  {
    id: 'mesin-cuan',
    slug: 'sistem-mesin-cuan-otomatis',
    title: 'SISTEM MESIN CUAN OTOMATIS',
    price: 'Rp 200.000',
    category: 'Sistem & Bisnis',
    catalogUrl: 'https://indo-digital.myr.id/catalog/sistem-mesin-cuan-otomatis',
    shortDesc: 'Blueprint otomasi sistem funneling digital untuk mencetak penjualan online 24 jam nonstop.',
    usp: 'Sistem siap contek dan dijalankan secara autopilot menggunakan tool dan template terintegrasi.',
    targetMarket: 'Pebisnis online, affiliate marketer, reseller, dan pembuat produk digital.',
    keySellingPoints: [
      'Strategi email automation & WhatsApp sequence yang terbukti menghasilkan penjualan otomatis',
      'Peta funnel konversi dari traffic gratisan menjadi pembeli loyal',
      'Template siap deploy tanpa perlu keahlian teknis rumit',
    ],
  },
  {
    id: 'buku-hacker',
    slug: 'buku-sakti-hacker-full-praktek',
    title: 'Buku Sakti Hacker Full Praktek',
    price: 'Rp 75.000',
    category: 'E-Book',
    catalogUrl: 'https://indo-digital.myr.id/catalog/buku-sakti-hacker-full-praktek',
    shortDesc: 'E-book teknis panduan praktis pentesting, simulasi eksploitasi, dan teknik pengamanan sistem.',
    usp: 'Penjelasan bahasa Indonesia yang mudah dipahami disertai baris perintah (command line) siap pakai.',
    targetMarket: 'Penggemar teknologi, praktisi IT support, sysadmin pemula, dan siswa SMK/Mahasiswa Informatika.',
    keySellingPoints: [
      'Langkah praktis menggunakan Linux dan tools pengujian keamanan',
      'Panduan melindungi data pribadi dari kebocoran akun',
      'Harga sangat terjangkau hanya Rp 75.000 sekali beli',
    ],
  },
  {
    id: '100-ide-bisnis',
    slug: '100-ide-bisnis-tanpa-modal',
    title: '100 IDE BISNIS TANPA MODAL',
    price: 'Rp 75.000',
    category: 'E-Book',
    catalogUrl: 'https://indo-digital.myr.id/catalog/100-ide-bisnis-tanpa-modal',
    shortDesc: 'Daftar 100 model bisnis terverifikasi yang bisa dimulai tanpa perlu modal awal uang sepeserpun.',
    usp: 'Daftar actionable lengkap dengan analisa target pasar, cara mulai, dan estimasi potensi keuntungan.',
    targetMarket: 'Pencari kerja, pemula yang bingung mau jualan apa, karyawan yang ingin punya side-income, dan ibu rumah tangga.',
    keySellingPoints: [
      'Kumpulan ide orisinil di bidang jasa, digital agency, dropship, dan konten kreator',
      'Tips validasi pasar agar tidak boncos di awal',
      'Bahasa lugas langsung praktik di lapangan',
    ],
  },
  {
    id: 'cuan-1juta',
    slug: 'cara-mendapatkan-1-juta-per-minggu',
    title: 'Cara Mendapatkan Cuan 1 Juta Per Minggu',
    price: 'Rp 59.000',
    category: 'E-Book',
    catalogUrl: 'https://indo-digital.myr.id/catalog/cara-mendapatkan-1-juta-per-minggu',
    shortDesc: 'Panduan taktis step-by-step meraih penghasilan mingguan Rp 1.000.000 secara konsisten dari internet.',
    usp: 'Fokus pada strategi realistis jangka pendek yang bisa dieksekusi dengan smartphone dan kuota internet.',
    targetMarket: 'Pelajar, mahasiswa, pekerja lepas (freelancer pemula), dan siapapun yang butuh penghasilan tambahan cepat.',
    keySellingPoints: [
      'Skema pembagian target harian yang mudah dicapai',
      'Platform micro-income terpercaya tanpa scam',
      'Simulasi perhitungan dan studi kasus orang awam yang berhasil',
    ],
  },
  {
    id: 'gaji-dollar',
    slug: 'gaji-dollar-dari-kamar',
    title: 'GAJI DOLLAR DARI KAMAR',
    price: 'Rp 49.000',
    category: 'E-Book',
    catalogUrl: 'https://indo-digital.myr.id/catalog/gaji-dollar-dari-kamar',
    shortDesc: 'Rahasia mendapatkan bayaran Dollar USD dari rumah melalui pasar remote work dan freelance global.',
    usp: 'Membongkar situs micro-gig tersembunyi yang mau membayar mahal orang Indonesia tanpa harus lancar bahasa Inggris rumit.',
    targetMarket: 'Milenial, Gen-Z, desainer grafis pemula, data entry worker, dan mereka yang ingin bebas jam kerja konvensional.',
    keySellingPoints: [
      'Panduan mendaftar rekening internasional (PayPal, Wise, Payoneer) dengan mudah',
      'Contoh template proposal penawaran bahasa Inggris yang siap disalin',
      'Strategi menghindari penipuan lowongan kerja fiktif internasional',
    ],
  },
  {
    id: 'panen-cuan-mhs',
    slug: 'panen-cuan-untuk-mahasiswa-dan-pemula',
    title: 'Panen Cuan untuk Mahasiswa dan Pemula',
    price: 'Rp 49.000',
    category: 'E-Book',
    catalogUrl: 'https://indo-digital.myr.id/catalog/panen-cuan-untuk-mahasiswa-dan-pemula',
    shortDesc: 'E-book inspiratif & panduan praktis membiayai kuliah sendiri serta mandiri finansial sejak bangku kuliah.',
    usp: 'Formula membagi waktu antara tugas kuliah dan usaha sampingan tanpa mengorbankan IPK.',
    targetMarket: 'Mahasiswa aktif, siswa SMA/SMK tingkat akhir, dan pemuda yang ingin meringankan beban orang tua.',
    keySellingPoints: [
      'Pilihan bisnis modal dengkul dan keterampilan ringan',
      'Trik networking dan mencari klien pertama dari lingkungan kampus',
      'Manajemen cashflow sederhana agar uang jajan tidak tekor',
    ],
  },
  {
    id: 'belajar-jepang',
    slug: 'belajar-jepang-edisi-30-hari-lancar',
    title: 'Belajar Jepang Edisi 30 Hari Lancar',
    price: 'Rp 49.000',
    normalPrice: 'Rp 149.000',
    category: 'Language & Skill',
    catalogUrl: 'https://indo-digital.myr.id/catalog/belajar-jepang-edisi-30-hari-lancar',
    shortDesc: 'Metode kilat menguasai Hiragana, Katakana, kosakata vital, dan percakapan praktis Jepang dalam 30 hari.',
    usp: 'Disusun sistematis per hari (Day 1 - Day 30) untuk persiapan wawancara kerja magang (Tokutei Ginou/Kenshusei) atau wisata.',
    targetMarket: 'Peminat bahasa Jepang, calon tenaga kerja magang ke Jepang, wibu/pecinta anime, dan mahasiswa sastra/budaya.',
    keySellingPoints: [
      'Audio & cheat sheet karakter huruf yang mudah diingat',
      'Percakapan kontekstual di dunia kerja & kehidupan sehari-hari di Tokyo',
      'Diskon spesial dari harga normal Rp 149.000 menjadi Rp 49.000',
    ],
  },
  {
    id: 'ngonten-pensiun',
    slug: '7-hari-mulai-ngonten-persiapan-pensiun',
    title: '7 Hari Mulai Ngonten - Persiapan Pensiun',
    price: 'Rp 49.000',
    category: 'E-Book',
    catalogUrl: 'https://indo-digital.myr.id/catalog/7-hari-mulai-ngonten-persiapan-pensiun',
    shortDesc: 'Panduan bersahabat bagi usia 40+ dan pensiunan untuk membangun kesibukan positif & aset digital lewat media sosial.',
    usp: 'Instruksi bertahap yang ramah pemula tanpa istilah teknologi yang memusingkan.',
    targetMarket: 'Karyawan menjelang pensiun, bapak/ibu usia 45-65 tahun, dan profesional senior yang ingin berbagi pengalaman hidup.',
    keySellingPoints: [
      'Cara menggunakan kamera HP dan aplikasi edit video simpel',
      'Menemukan ide konten dari hobi berkebun, memasak, keluarga, atau keahlian masa kerja',
      'Menghasilkan pemasukan dari endorsement atau penjualan produk sendiri saat purna tugas',
    ],
  },
];

// 3. TARGET AUDIENCE & BUYER PERSONA
export const BUYER_PERSONAS: BuyerPersona[] = [
  {
    id: 'umkm-kuliner',
    segmentName: 'Pelaku Usaha Kuliner & Makanan Minuman (F&B)',
    iconName: 'Utensils',
    description: 'Pemilik cafe, catering, bakery, frozen food, dan resto yang selama ini hanya mengandalkan Instagram atau GoFood/GrabFood.',
    productFit: 'Paket UMKM (Landing Page Kilat Rp 249.500)',
    painPoints: [
      'Potongan komisi aplikasi ojek online terlalu besar (hingga 20-30%).',
      'Capek membalas chat WA satu per satu untuk kirim foto menu dan pricelist yang sama.',
      'Sering diragukan pelanggan katering baru karena belum punya link profil resmi.',
    ],
    solutionPitch:
      'Dengan landing page kilat, Anda punya daftar menu digital interaktif dengan foto menggugah selera dan tombol pesan langsung ke WhatsApp tanpa potongan komisi aplikasi sepeserpun!',
    recommendedPackage: 'Paket UMKM (1 Halaman Sat-Set)',
  },
  {
    id: 'jasa-profesional',
    segmentName: 'Jasa Profesional & Kontraktor / Konsultan',
    iconName: 'Briefcase',
    description: 'Arsitek, kontraktor renovasi rumah, kantor hukum, konsultan pajak, travel umroh, dan klinik estetika.',
    productFit: 'Paket Elite (Web Custom Agensi Rp 3.000.000)',
    painPoints: [
      'Klien proyek bernilai puluhan/ratusan juta menuntut kredibilitas perusahaan yang meyakinkan.',
      'Kalah bersaing dengan kompetitor besar yang tampil di halaman 1 pencarian Google.',
      'Proposal PDF sering tidak dibaca atau terhapus di ponsel calon klien.',
    ],
    solutionPitch:
      'Paket Elite memberikan website multi-halaman berstandar agensi korporat dengan portofolio galeri proyek, profil tim, testimoni klien VIP, dan struktur SEO agar mudah ditemukan saat klien mencari jasa di Google.',
    recommendedPackage: 'Paket Elite (Multi-Halaman 5-7 Hari)',
  },
  {
    id: 'toko-online-pemula',
    segmentName: 'Toko Online & Reseller / Toko Fisik Lokal',
    iconName: 'ShoppingBag',
    description: 'Penjual baju, kosmetik, sparepart motor, mebel, toko oleh-oleh, dan produk kerajinan daerah.',
    productFit: 'Paket UMKM + E-Book Sistem Mesin Cuan Otomatis',
    painPoints: [
      'Penjualan di media sosial sepi karena algoritma sering berubah dan akun bisa kena suspend sewaktu-waktu.',
      'Calon pembeli ragu mentransfer uang karena marak penipuan online di Instagram/Facebook.',
      'Tidak punya dana jutaan rupiah untuk bayar tim IT bikin website.',
    ],
    solutionPitch:
      'Hanya dengan Rp 249.500 (bisa bayar setelah web jadi), toko Anda langsung punya website dengan domain resmi ber-SSL gembok hijau yang memancarkan rasa aman 100% bagi pembeli.',
    recommendedPackage: 'Paket UMKM (Rp 249.500)',
  },
  {
    id: 'mahasiswa-freshgrad',
    segmentName: 'Mahasiswa, Pencari Kerja, & Karir Digital',
    iconName: 'GraduationCap',
    description: 'Anak muda yang butuh skill menghasilkan uang cepat, modal minim, dan ingin mempersiapkan diri di era digital.',
    productFit: 'Katalog Produk Indo Digital (E-Course Cyber Security, 100 Ide Bisnis, Gaji Dollar, dll.)',
    painPoints: [
      'Uang kiriman orang tua pas-pasan, ingin bayar kos atau kuliah mandiri.',
      'Bingung memulai bisnis karena tidak punya modal kapital besar.',
      'Kuliah jurusan komputer/IT tapi materinya terlalu teoritis di kampus.',
    ],
    solutionPitch:
      'E-book dan e-course Indo Digital memberikan ilmu daging langsung praktik mulai Rp 49.000 yang bisa diterapkan detik ini juga untuk menghasilkan penghasilan tambahan tanpa mengganggu jam kuliah.',
    recommendedPackage: 'E-Book Cuan 1 Juta / Panen Cuan Mahasiswa / E-Course Cyber Security',
  },
];

// 4. SCRIPT PENJUALAN (COLD PROSPECTING)
export const COLD_SCRIPTS: ColdScript[] = [
  {
    id: 'cold-wa-umkm',
    title: 'Script WA Cold Prospecting ke Pemilik Usaha (UMKM / Kuliner / Jasa)',
    targetChannel: 'WhatsApp',
    context: 'Gunakan saat menghubungi nomor WhatsApp bisnis yang Anda temukan di Google Maps, Instagram bio, atau direktori bisnis lokal.',
    scriptText: `Halo Kak [Nama Pemilik / Admin] [Nama Bisnis], salam kenal saya [Nama Anda] dari webmurah.biz.id (PT Inovasi Teknologi Digital Indonesia) 🙏

Saya perhatikan produk [Nama Bisnis] sangat menarik dan punya ulasan yang bagus sekali di media sosial.

Kebetulan hari ini kami ada program khusus UMKM: pembuatan Website Landing Page Resmi Siap Jualan dalam 24 Jam dengan harga promo Rp 249.500 (Diskon 50%).

Menariknya, kami menggunakan sistem: PESAN SEKARANG, BAYAR SETELAH JADI & DISETUJUI. Jadi Kakak 100% bebas risiko tanpa keluar uang sepeserpun di awal.

Apakah boleh saya kirimkan contoh tampilan website yang cocok untuk usaha [Nama Bisnis] Kak? Cukup 1 menit untuk melihatnya. Terima kasih banyak ya Kak! 😊`,
  },
  {
    id: 'cold-dm-ig',
    title: 'Script DM Instagram / TikTok ke Olshop & Kreator',
    targetChannel: 'Instagram DM',
    context: 'Kirim via DM ke akun Instagram toko online yang bio-nya masih memakai link bit.ly atau nomor WA polos tanpa landing page.',
    scriptText: `Halo Kak @[Username]! Suka banget lihat postingan katalog produknya yang rapi dan aktif banget 🔥

Btw Kak, saya lihat di link bio-nya belum pakai Landing Page Website resmi ya? Sayang banget lho Kak, riset membuktikan olshop yang punya website resmi berdomain sendiri conversion rate orderannya naik hingga 3x lipat karena pembeli merasa jauh lebih percaya (anti-tipu).

Di tempat kami (webmurah.biz.id), bikin website kilat 24 jam cuma Rp 249.500 all-in (sudah dapat domain resmi .biz.id / .my.id + hosting 1 tahun). Dan kerennya: BAYAR SETELAH WEB JADI!

Boleh saya kirimkan portofolio contoh web toko online yang serupa dengan produk Kakak? Siapa tahu bisa bantu dongkrak penjualan bulan ini! 🙏✨`,
  },
  {
    id: 'cold-digital-product',
    title: 'Script Promosi Produk Digital Indo Digital ke Teman / Komunitas',
    targetChannel: 'WhatsApp',
    context: 'Cocok dibagikan ke grup alumni, komunitas mahasiswa, atau status WhatsApp untuk mempromosikan produk digital Indo Digital.',
    scriptText: `Teman-teman yang mau nambah penghasilan sampingan atau lagi cari ide usaha tanpa modal di tahun ini, rekomendasi baca ini deh:

Di Indo Digital lagi ada e-book & panduan teruji:
📘 100 Ide Bisnis Tanpa Modal (Cuma Rp 75rb)
💵 Cara Dapat 1 Juta Per Minggu (Cuma Rp 59rb)
💻 E-Course Mahir Cyber Security (Rp 249rb)
🌐 Gaji Dollar dari Kamar (Rp 49rb)

Ilmunya praktis banget langsung to the point tanpa teori ribet. Bisa langsung diakses di: https://indo-digital.myr.id

Kalo ada yang mau tanya-tanya materinya boleh japri aku yaa! 👍`,
  },
];

// 5. HANDLING OBJECTIONS (PENANGANAN KEBERATAN)
export const OBJECTION_HANDLINGS: ObjectionItem[] = [
  {
    id: 'obj-mahal',
    objection: '"Harganya kemahalan mas / Belum ada budget."',
    context: 'Prospek merasa mengeluarkan uang untuk website adalah beban biaya, bukan investasi yang menghasilkan uang kembali.',
    coreMindset: 'Bandingkan dengan biaya sewa ruko fisik, biaya makan harian, atau biaya boncos pasang iklan.',
    recommendedResponse:
      'Saya sangat paham Kak. Namun boleh saya tunjukkan hitung-hitungannya? Dengan promo Rp 249.500 all-in untuk 1 tahun penuh, jika dibagi 365 hari, biayanya hanya sekitar Rp 680 perak per hari—bahkan jauh lebih murah dari sebatang kerupuk atau uang parkir motor. Dengan Rp 680 perak per hari itu, usaha Kakak terlihat seperti bisnis mapan dan profesional yang buka 24 jam nonstop melayani pesanan dari seluruh Indonesia.',
    closingFollowUp: 'Apalagi pembayarannya baru dilakukan setelah web selesai dan Kakak cocok dengan hasilnya. Jadi tidak ada risiko rugi sama sekali. Mau kita mulai siapkan hari ini Kak?',
  },
  {
    id: 'obj-sosmed',
    objection: '"Saya sudah jualan di Instagram / TikTok / Facebook, buat apa website lagi?"',
    context: 'Prospek merasa media sosial sudah cukup untuk berjualan.',
    coreMindset: 'Media sosial adalah "tanah sewa" yang algoritmanya bisa berubah kapan saja atau diblokir. Website adalah "aset toko milik sendiri".',
    recommendedResponse:
      'Betul sekali Kak, sosmed itu senjata luar biasa untuk mendatangkan orang (traffic). Tapi ibaratnya, Instagram atau TikTok itu seperti brosur di pinggir jalan raya, sedangkan Website adalah Toko Resminya. Ketika orang melihat postingan Kakak di sosmed lalu klik link website di bio, mereka langsung melihat menu harga rapi, testimoni, dan kejelasan alamat tanpa terdistraksi video reels lain. Website juga membuat akun sosmed Kakak terverifikasi lebih terpercaya di mata pembeli baru.',
    closingFollowUp: 'Bisa dibayangkan kalau calon pembeli ragu beli karena tidak ada web resmi, mereka bisa lari ke kompetitor. Yuk kita pasang landing page kilat 24 jam ini untuk melengkapi akun IG Kakak?',
  },
  {
    id: 'obj-belum-butuh',
    objection: '"Usaha saya masih kecil / belum butuh website."',
    context: 'Prospek merasa website hanya diperuntukkan bagi perusahaan multinasional atau konglomerat.',
    coreMindset: 'Justru bisnis kecil paling butuh website agar cepat terlihat besar dan dipercaya pembeli baru.',
    recommendedResponse:
      'Justru di situ rahasianya Kak! Brand-brand yang sekarang besar, dulunya menyiapkan pondasi digital sejak masih merintis. Banyak UMKM sulit naik kelas karena pembeli menganggap mereka hanya usaha rumahan yang belum terjamin keamanannya. Begitu Kakak punya website berdomain resmi seperti www.namabisnis.biz.id, nilai jual produk Kakak langsung naik kelas dan bisa menjual dengan harga lebih pantas.',
    closingFollowUp: 'Apalagi mumpung ada kuota promo 50% hari ini, sayang sekali kalau dilewatkan Kak. Boleh minta nama usaha dan nomor WA yang mau dipasang di tombol ordernya?',
  },
  {
    id: 'obj-takut-tipu',
    objection: '"Saya takut penipuan / nanti webnya tidak sesuai harapan."',
    context: 'Calon pembeli pernah trauma kena tipu freelancer yang kabur setelah transfer DP.',
    coreMindset: 'Hancurkan risiko secara total dengan jaminan fitur "Pesan Sekarang, Bayar Setelah Jadi".',
    recommendedResponse:
      'Kami sangat mengerti kekhawatiran Kakak, apalagi sekarang banyak oknum online yang tidak bertanggung jawab. Karena itulah PT Inovasi Teknologi Digital Indonesia menerapkan kebijakan khusus: KAKAK TIDAK PERLU TRANSFER UANG SEPESERPUN DI AWAL. Kami kerjakan dulu rancangan websitenya sampai online, Kakak cek dan coba tombol-tombolnya di HP sendiri. Jika Kakak sudah 100% puas dan cocok, barulah Kakak membayar.',
    closingFollowUp: 'Kalau Kakak merasa tidak cocok, tidak ada kewajiban bayar sama sekali. Benar-benar nol risiko kan Kak? Mari kita mulai proses pengerjaannya sekarang!',
  },
];

// 6. SOAL UJIAN ONLINE PRODUCT KNOWLEDGE (15 SOAL PILIHAN GANDA)
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Berapakah harga promo flash sale Paket UMKM pembuatan website di webmurah.biz.id setelah klaim diskon 50%?',
    options: ['Rp 499.000', 'Rp 249.500', 'Rp 1.800.000', 'Rp 150.000'],
    correctAnswerIndex: 1,
    explanation: 'Harga normal Paket UMKM adalah Rp 499.000, dan dengan diskon banner promo 50% menjadi Rp 249.500.',
    category: 'Paket Web',
  },
  {
    id: 2,
    question: 'Berapa lama standar estimasi waktu pengerjaan untuk Paket UMKM hingga selesai dan siap online?',
    options: ['1x24 Jam (1 Hari Jadi)', '3 - 5 Hari Kerja', '7 Hari Kalender', '2 Minggu'],
    correctAnswerIndex: 0,
    explanation: 'Paket UMKM memiliki keunggulan kilat yaitu selesai dalam 1x24 jam (1 hari kerja).',
    category: 'Paket Web',
  },
  {
    id: 3,
    question: 'Bagaimanakah sistem pembayaran yang menjadi garansi bebas risiko utama untuk Paket UMKM?',
    options: [
      'Wajib bayar lunas di muka sebelum dikerjakan',
      'Wajib DP 50% di awal',
      'Pesan Sekarang, Bayar Setelah Jadi & Disetujui (100% Bebas Risiko)',
      'Sistem cicilan kartu kredit 12 bulan',
    ],
    correctAnswerIndex: 2,
    explanation: 'Paket UMKM mengusung sistem "Pesan Sekarang, Bayar Setelah Jadi!" sehingga klien tidak perlu bayar uang di awal.',
    category: 'Paket Web',
  },
  {
    id: 4,
    question: 'Ekstensi domain resmi apakah yang diberikan secara GRATIS selama 1 tahun pada Paket UMKM?',
    options: ['.biz.id dan .my.id', '.com dan .id', '.org dan .edu', '.gov.id'],
    correctAnswerIndex: 0,
    explanation: 'Paket UMKM sudah include Free Domain Resmi 1 Tahun (.biz.id & .my.id) serta Cloud Hosting dan SSL.',
    category: 'Paket Web',
  },
  {
    id: 5,
    question: 'Berapakah harga investasi untuk Paket Elite (Web Custom Agensi) dan bagaimana skema pembayarannya?',
    options: [
      'Rp 1.000.000 (Bayar setelah jadi)',
      'Rp 3.000.000 (Wajib DP 50% Rp 1.5 Jt di awal, pelunasan setelah selesai)',
      'Rp 249.500 (Dapat promo diskon banner 50%)',
      'Rp 5.000.000 (Bayar lunas di awal)',
    ],
    correctAnswerIndex: 1,
    explanation: 'Paket Elite berharga Net Rp 3.000.000 (tidak berlaku promo banner) dengan skema wajib DP 50% di awal dan 50% saat serah terima.',
    category: 'Paket Web',
  },
  {
    id: 6,
    question: 'Berapa kapasitas halaman dan estimasi pengerjaan untuk Paket Elite?',
    options: [
      'Hanya 1 halaman, selesai dalam 24 jam',
      'Hingga 7 halaman multi-page, selesai dalam 5 - 7 hari kerja intensif',
      'Hingga 50 halaman, selesai dalam 1 bulan',
      '2 halaman, selesai dalam 3 hari',
    ],
    correctAnswerIndex: 1,
    explanation: 'Paket Elite mencakup hingga 7 halaman terstruktur (Home, Profil, Layanan, Portofolio, Artikel, Kontak, dll.) dengan pengerjaan 5-7 hari kerja.',
    category: 'Paket Web',
  },
  {
    id: 7,
    question: 'Dimanakah calon pembeli atau agen dapat mengakses seluruh katalog produk digital tambahan Indo Digital?',
    options: ['https://indo-digital.myr.id', 'https://google.com', 'https://facebook.com', 'https://shopee.co.id'],
    correctAnswerIndex: 0,
    explanation: 'Seluruh produk digital tambahan Indo Digital terdaftar di etalase resmi https://indo-digital.myr.id.',
    category: 'Produk Digital',
  },
  {
    id: 8,
    question: 'Berapakah harga produk digital "E-Course Mahir Cyber Security" di portal Indo Digital?',
    options: ['Rp 49.000', 'Rp 75.000', 'Rp 249.000', 'Rp 500.000'],
    correctAnswerIndex: 2,
    explanation: 'E-Course Mahir Cyber Security dibanderol seharga Rp 249.000 dengan akses materi video komprehensif.',
    category: 'Produk Digital',
  },
  {
    id: 9,
    question: 'Berapakah harga e-book "100 IDE BISNIS TANPA MODAL" di portal Indo Digital?',
    options: ['Rp 25.000', 'Rp 75.000', 'Rp 150.000', 'Rp 249.000'],
    correctAnswerIndex: 1,
    explanation: 'E-book 100 IDE BISNIS TANPA MODAL dibanderol seharga Rp 75.000.',
    category: 'Produk Digital',
  },
  {
    id: 10,
    question: 'E-book manakah yang dibanderol dengan harga Rp 59.000 dan berfokus pada panduan meraih penghasilan mingguan?',
    options: [
      'SISTEM MESIN CUAN OTOMATIS',
      'Cara Mendapatkan Cuan 1 Juta Per Minggu',
      'Buku Sakti Hacker Full Praktek',
      'Belajar Jepang Edisi 30 Hari Lancar',
    ],
    correctAnswerIndex: 1,
    explanation: 'E-book "Cara Mendapatkan Cuan 1 Juta Per Minggu" berharga Rp 59.000.',
    category: 'Produk Digital',
  },
  {
    id: 11,
    question: 'Produk digital berikut yang dibanderol dengan harga Rp 49.000 adalah...',
    options: [
      'GAJI DOLLAR DARI KAMAR, Panen Cuan Mahasiswa, dan 7 Hari Mulai Ngonten Pensiun',
      'E-Course Mahir Cyber Security dan Sistem Mesin Cuan',
      'Paket UMKM dan Paket Elite',
      '100 Ide Bisnis Tanpa Modal dan Buku Sakti Hacker',
    ],
    correctAnswerIndex: 0,
    explanation: 'Tiga e-book tersebut dibanderol Rp 49.000 (termasuk Belajar Jepang promo Rp 49.000).',
    category: 'Produk Digital',
  },
  {
    id: 12,
    question: 'Jika calon pembeli berkata: "Saya sudah jualan di Instagram, buat apa website lagi?", jawaban terbaik agen adalah...',
    options: [
      'Mengejek calon pembeli karena dianggap kuno.',
      'Menjelaskan bahwa sosmed adalah tanah sewa (traffic), sedangkan website adalah toko resmi untuk meningkatkan konversi dan kepercayaan tanpa distraksi.',
      'Menyerah dan langsung memutus percakapan.',
      'Menyarankan mereka menutup akun Instagramnya.',
    ],
    correctAnswerIndex: 1,
    explanation: 'Edukasi peran sinergi antara media sosial sebagai traffic generator dan landing page website sebagai conversion closer yang meningkatkan trust.',
    category: 'Selling Skills & Handling',
  },
  {
    id: 13,
    question: 'Apa solusi paling jitu jika calon klien ragu membeli karena takut kena tipu online?',
    options: [
      'Meminta mereka transfer DP 100% agar mereka percaya.',
      'Menekankan garansi "Pesan Sekarang, Bayar Setelah Jadi & Disetujui" sehingga mereka 100% nol risiko.',
      'Mengirimkan ancaman bahwa harga akan naik 10 kali lipat besok.',
      'Mengabaikan pesan mereka.',
    ],
    correctAnswerIndex: 1,
    explanation: 'Fitur risk-reversal "Bayar Setelah Jadi" menghilangkan hambatan ketakutan penipuan secara total.',
    category: 'Selling Skills & Handling',
  },
  {
    id: 14,
    question: 'Siapakah target segmen yang paling cocok untuk penawaran Paket Elite (Rp 3.000.000)?',
    options: [
      'Siswa SD yang ingin belajar ngetik',
      'Jasa Profesional, Kontraktor, Klinik, Perusahaan yang butuh portofolio multi-halaman dan branding berwibawa di Google',
      'Penjual gorengan gerobak keliling pemula',
      'Pengguna yang hanya ingin coba-coba 1 hari',
    ],
    correctAnswerIndex: 1,
    explanation: 'Paket Elite dirancang untuk bisnis yang butuh kredibilitas korporat, SEO mendalam, dan portofolio multi-halaman.',
    category: 'Selling Skills & Handling',
  },
  {
    id: 15,
    question: 'Berapakah passing grade minimal yang harus dicapai mitra untuk mendapatkan status LULUS PRODUCT KNOWLEDGE pada ujian ini?',
    options: ['50%', '65%', '80%', '100%'],
    correctAnswerIndex: 2,
    explanation: 'Sesuai standar operasional kemitraan internal, passing grade minimal kelulusan adalah 80% (minimal 12 dari 15 soal benar).',
    category: 'Selling Skills & Handling',
  },
];
