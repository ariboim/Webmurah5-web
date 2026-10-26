export interface UmkmShowcase {
  id: string;
  category: string;
  industryTag: string;
  icon: string;
  name: string;
  city: string;
  tagline: string;
  problem: string;
  solution: string;
  ctaType: string;
  results: {
    label: string;
    value: string;
    note: string;
  }[];
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    cardBg: string;
    text: string;
  };
  mockup: {
    badge: string;
    headline: string;
    subheadline: string;
    offerBadge: string;
    ctaLabel: string;
    priceSnippet: string;
    features: string[];
    guarantee: string;
    socialProof: string;
    items?: {
      name: string;
      price: string;
      tag?: string;
    }[];
  };
}

export const UMKM_SHOWCASES: UmkmShowcase[] = [
  {
    id: 'fnb-sambal',
    category: 'Kuliner & F&B Kemasan',
    industryTag: 'Kuliner & F&B',
    icon: '🌶️',
    name: 'Sambal Cumi Juara Mak Nyoss',
    city: 'Sidoarjo, Jawa Timur',
    tagline: 'Sensasi Pedas Nagih dengan Cumi Segar Pilihan Tanpa Pengawet',
    problem: 'Sebelumnya jualan hanya lewat status WhatsApp & DM IG. Pelanggan ragu beli karena tidak ada legalitas P-IRT, review berceceran, dan admin capek ketik harga satu per satu.',
    solution: 'Landing page kustom 1 halaman dengan foto menggugah selera, sertifikat Halal & P-IRT, promo bundling beli 2 gratis 1, serta checkout WhatsApp otomatis.',
    ctaType: 'Pesan Paket Bundling via WhatsApp',
    results: [
      { label: 'Kenaikan Order WA', value: '+165%', note: 'Dalam 30 hari pasca rilis' },
      { label: 'Waktu Closing', value: '3x Cepat', note: 'Customer datang langsung pilih paket' },
      { label: 'Rating Kepuasan', value: '4.9 / 5.0', note: '400+ ulasan terverifikasi' },
    ],
    palette: {
      primary: '#DC2626',
      secondary: '#FEF2F2',
      accent: '#F59E0B',
      bg: '#FFF5F5',
      cardBg: '#FFFFFF',
      text: '#1F2937',
    },
    mockup: {
      badge: 'PRODUK TERLARIS MINGGU INI',
      headline: 'Sambal Cumi Asli Nusantara: Gurih, Pedas Nampol, dan Halal!',
      subheadline: 'Dibuat dari 100% rempah segar pilihan petani lokal. Sudah terjual 15.000+ botol ke seluruh Indonesia.',
      offerBadge: 'Promo Hari Ini: Beli 2 Gratis 1 Botol Sambal Bawang + Subsidi Ongkir',
      ctaLabel: 'Ambil Promo Beli 2 Gratis 1 di WhatsApp',
      priceSnippet: 'Promo Paket Hemat Rp 85.000 (Dapat 3 Botol)',
      socialProof: '⭐⭐⭐⭐⭐ 4.9/5 dari 1.420+ Pelanggan Setia di Seluruh Indonesia',
      features: [
        'Sudah Bersertifikat P-IRT & Halal MUI Resmi',
        'Potongan Cumi Segar Melimpah di Setiap Sendok',
        'Tahan 6 Bulan Suhu Ruang (Teknologi Retort Higienis)',
        'Garansi Kirim Ulang 100% Gratis Jika Botol Rusak',
      ],
      guarantee: 'Garansi Rasa Nagih atau Uang Kembali 100%',
      items: [
        { name: 'Paket Hemat Cumi & Bawang', price: 'Rp 65.000', tag: 'Hemat 20%' },
        { name: 'Paket Puas Sambal Nusantara 3 Rasa', price: 'Rp 85.000', tag: 'Best Seller' },
        { name: 'Paket Reseller 10 Botol', price: 'Rp 275.000', tag: 'Cuan Maksi' },
      ],
    },
  },
  {
    id: 'fashion-hijab',
    category: 'Fashion & Busana Muslim',
    industryTag: 'Fashion & Apparel',
    icon: '👗',
    name: 'Zahira Modest Wear',
    city: 'Bandung, Jawa Barat',
    tagline: 'Gamis Syar’i Elegan Nyaman untuk Pengajian & Acara Spesial',
    problem: 'Katalog di Instagram tenggelam. Calon pembeli membandingkan harga di marketplace dan tergiur tiruan murah yang bahannya tipis panas. Butuh presentasi visual eksklusif.',
    solution: 'Landing page bertema clean luxury dengan foto detail serat kain, panduan size chart interaktif, ribuan ulasan bunda, dan tombol konsultasi ukuran ke WhatsApp CS.',
    ctaType: 'Konsultasi Ukuran & Order via CS',
    results: [
      { label: 'Konversi Iklan Meta', value: '4.8%', note: 'Sebelumnya hanya 1.2% via bio link' },
      { label: 'Keranjang Rata-rata', value: 'Rp 420.000', note: 'Customer cenderung beli 2 set' },
      { label: 'Efisiensi CS', value: 'Hemat 5 Jam', note: 'Size chart jelas kurangi tanya jawab' },
    ],
    palette: {
      primary: '#0D9488',
      secondary: '#F0FDFA',
      accent: '#D97706',
      bg: '#F7FEFC',
      cardBg: '#FFFFFF',
      text: '#0F172A',
    },
    mockup: {
      badge: 'KOLEKSI EXCLUSIVE RAYA 2026',
      headline: 'Tampil Anggun Tanpa Gerah dengan Bahan Silk Premium Bandung',
      subheadline: 'Dirancang dengan potongan proporsional, wudhu friendly, dan busui friendly untuk muslimah modern berkelas.',
      offerBadge: 'Koleksi Lebaran Terbatas: Diskon 30% + Free Khimar Voal Khusus Hari Ini',
      ctaLabel: 'Klaim Diskon & Chat CS Zahira',
      priceSnippet: 'Harga Spesial Rp 189.000 (Normal Rp 270.000)',
      socialProof: '⭐⭐⭐⭐⭐ 4.95/5 dari 3.800+ Ibu & Muslimah Indonesia',
      features: [
        'Kain Adem Lembut Anti-Kusut Nyaman Seharian',
        'Jahitan Kerapihan Standar Butik Tailor Profesional',
        'Garansi Tukar Size 7 Hari Tanpa Ribet',
        'Mendukung Pembayaran COD (Bayar di Tempat)',
      ],
      guarantee: '100% Garansi Tukar Size Jika Kekecilan/Kebesaran',
      items: [
        { name: 'Gamis Madina Silk Silk', price: 'Rp 189.000', tag: 'Favorit' },
        { name: 'One Set Tunik Ayana', price: 'Rp 215.000', tag: 'Baru' },
        { name: 'Khimar Voal Premium Syar’i', price: 'Rp 65.000', tag: 'Free Promo' },
      ],
    },
  },
  {
    id: 'services-ac',
    category: 'Jasa & Teknisi Panggilan',
    industryTag: 'Jasa Servis & Teknik',
    icon: '🔧',
    name: 'Sejuk Mandiri Teknik 24 Jam',
    city: 'Jakarta Selatan & Depok',
    tagline: 'Service AC, Cuci AC, dan Bongkar Pasang Bergaransi Resmi 30 Hari',
    problem: 'Banyak calon klien takut teknisi tidak profesional, harga tidak transparan di awal, atau AC rusak lagi seminggu kemudian. Brosur fisik sudah ditinggalkan calon konsumen.',
    solution: 'Landing page transparan: tabel biaya servis jelas di awal tanpa nembak ongkos, foto teknisi berseragam rapi, sertifikat pelatihan, dan tombol panggilan teknisi cepat 1-klik.',
    ctaType: 'Panggil Teknisi Sekarang (Datang 30 Menit)',
    results: [
      { label: 'Booking Harian', value: '18-25 AC/hari', note: 'Stabil dari Google Ads & SEO lokal' },
      { label: 'Tingkat Kepuasan', value: '98%', note: 'Klien rumah tinggal & kantor' },
      { label: 'Repeat Order', value: '+75%', note: 'Penyimpanan kontak otomatis di HP klien' },
    ],
    palette: {
      primary: '#0284C7',
      secondary: '#F0F9FF',
      accent: '#059669',
      bg: '#F8FAFC',
      cardBg: '#FFFFFF',
      text: '#0F172A',
    },
    mockup: {
      badge: 'DARURAT 24 JAM · STANDBY SELURUH JAKARTA',
      headline: 'AC Rumah Panas atau Bocor? Teknisi Datang dalam 30 Menit!',
      subheadline: 'Layanan cuci steam uap anti-bakteri, tambah freon, dan perbaikan modul bergaransi resmi 30 hari. Teknisi jujur & ramah.',
      offerBadge: 'Paket Cuci Bersih Hemat: Cuma Rp 65.000 / unit (Gratis Cek Pipa & Tekanan Freon)',
      ctaLabel: 'Hubungi Teknisi Standby via WhatsApp',
      priceSnippet: 'Cuci AC Bersih Total Mulai Rp 65.000',
      socialProof: '⭐⭐⭐⭐⭐ 4.9/5 dari 2.100+ Rumah Tangga & Kantor se-Jabodetabek',
      features: [
        'Teknisi Tersertifikasi & Berpengalaman 8+ Tahun',
        'Peralatan Steam High-Pressure & Terpal Anti-Ciprat',
        'Harga Transparan di Muka, Tanpa Biaya Tersembunyi',
        'Garansi Dingin 30 Hari atau Servis Ulang 100% Gratis',
      ],
      guarantee: 'Garansi Servis Ulang Gratis Jika AC Kurang Dingin',
      items: [
        { name: 'Cuci AC Split 0.5 - 2 PK', price: 'Rp 65.000', tag: 'Populer' },
        { name: 'Isi / Tambah Freon R32 & R410', price: 'Rp 125.000', tag: 'Paket Dingin' },
        { name: 'Bongkar Pasang AC Bergaransi', price: 'Rp 275.000', tag: 'Rapi & Cepat' },
      ],
    },
  },
  {
    id: 'herbal-skincare',
    category: 'Kecantikan & Herbal Lokal',
    industryTag: 'Kecantikan & Skincare',
    icon: '🌿',
    name: 'Dewi Ayu Herbal Skincare',
    city: 'Yogyakarta',
    tagline: 'Formulasi Minyak Kelapa Murni & Ekstrak Bengkoang Tradisional',
    problem: 'Banyak konsumen khawatir produk skincare abal-abal bermerkuri. Butuh platform yang memajang barcode registrasi BPOM secara meyakinkan dan cerita kemurnian bahan.',
    solution: 'Landing page clean dengan nomor BPOM terverifikasi, sertifikat uji dermatologi, review sebelum-sesudah asli, dan konsultasi kulit gratis sebelum membeli.',
    ctaType: 'Konsultasi Kulit Gratis via WhatsApp',
    results: [
      { label: 'Kepercayaan BPOM', value: '100% Lolos Uji', note: 'Scan barcode resmi langsung di web' },
      { label: 'Kenaikan Omzet', value: '2.4x Lipat', note: '3 bulan pasca rilis landing page' },
      { label: 'Jangkauan Kirim', value: '34 Provinsi', note: 'Pesanan kirim ekspedisi se-Nusantara' },
    ],
    palette: {
      primary: '#16A34A',
      secondary: '#F0FDF4',
      accent: '#EA580C',
      bg: '#F7FEE7',
      cardBg: '#FFFFFF',
      text: '#14532D',
    },
    mockup: {
      badge: 'TERDAFTAR RESMI BPOM RI & HALAL MUI',
      headline: 'Wajah Cerah Alami Tanpa Ketergantungan Bahan Kimia Berbahaya',
      subheadline: 'Serum herbal tradisional yang telah membantu 20.000+ wanita Indonesia memudarkan flek hitam dan mengatasi kulit kusam.',
      offerBadge: 'Konsultasi Kulit Gratis + Bonus Mini Toner untuk 50 Pembeli Pertama',
      ctaLabel: 'Konsultasi Kulit & Dapatkan Bonus di WA',
      priceSnippet: 'Paket Perawatan Glowing Rp 149.000 (3 Produk)',
      socialProof: '⭐⭐⭐⭐⭐ 4.9/5 dari 5.200+ Testimoni Foto Before-After Pelanggan',
      features: [
        'Terdaftar Resmi BPOM RI No. NA1821010342',
        '100% Ekstrak Alami Halal & Aman Ibu Hamil/Menyusui',
        'Hasil Cerah Alami Mulai Hari ke-14 Pemakaian Rutin',
        'Didampingi Tim Beauty Advisor Berpengalaman',
      ],
      guarantee: 'Garansi 100% Asli BPOM atau Uang Kembali 2x Lipat',
      items: [
        { name: 'Serum Brightening Herbal 20ml', price: 'Rp 89.000', tag: 'BPOM Aman' },
        { name: 'Paket Glowing 3-in-1', price: 'Rp 149.000', tag: 'Terlaris' },
        { name: 'Sunscreen Alami SPF 50', price: 'Rp 75.000', tag: 'Ringan' },
      ],
    },
  },
  {
    id: 'coffee-roastery',
    category: 'Kafe & Artisan Coffee Roastery',
    industryTag: 'Kafe & Kopi Artisan',
    icon: '☕',
    name: 'Kopi Rimba Gayo Specialty',
    city: 'Takengon & Medan',
    tagline: 'Biji Kopi Arabika Pilihan dari Petani Dataran Tinggi 1.500 MDPL',
    problem: 'Penjualan biji kopi hanya mengandalkan pelanggan lokal di kedai. Menghadapi persaingan kopi kemasan pabrikan, butuh media untuk menceritakan tasting notes dan proses roasting segar.',
    solution: 'Landing page bertema warm artisan dengan profil cupping notes (fruity, chocolate, nutty), pilihan grind size (biji/giling halus/kasar), serta paket langganan kopi kantor & kedai.',
    ctaType: 'Order Fresh Roast Biji Kopi via WA',
    results: [
      { label: 'Order Luar Kota', value: '+210%', note: 'Pecinta kopi Jakarta & Surabaya' },
      { label: 'B2B Suplai Kafe', value: '14 Kafe Mitra', note: 'Rutin suplai biji kopi mingguan' },
      { label: 'Repeat Order', value: '82%', note: 'Sistem reminder biji kopi habis via WA' },
    ],
    palette: {
      primary: '#78350F',
      secondary: '#FEF3C7',
      accent: '#B45309',
      bg: '#FFFBEB',
      cardBg: '#FFFFFF',
      text: '#451A03',
    },
    mockup: {
      badge: 'FRESH ROAST · DIROASTING MAKSIMAL 3 HARI SEBELUM KIRIM',
      headline: 'Sensasi Kopi Specialty Gayo Asli Langsung dari Petani Dataran Tinggi',
      subheadline: 'Aroma floral semerbak dengan sentuhan cokelat karamel manis yang lembut di lambung. Tanpa campuran esens buatan.',
      offerBadge: 'Promo Tester Pack: 3 Varian Single Origin Cuma Rp 99.000 + Free Drip Bag',
      ctaLabel: 'Pesan Fresh Roast Hari Ini di WhatsApp',
      priceSnippet: 'Kemasan 250gr Mulai Rp 65.000',
      socialProof: '⭐⭐⭐⭐⭐ 4.96/5 dari 850+ Barista & Pecinta Kopi Nusantara',
      features: [
        'Single Origin 100% Arabika Gayo Organik Grade 1',
        'Roasting Profile Medium-Dark untuk Espresso & Manual Brew',
        'Bisa Pilih Grind Size Sesuai Alat Seduh Anda (French Press/V60/Tubruk)',
        'Kemasan Valve Alumunium Foil Segel Kedap Udara',
      ],
      guarantee: 'Garansi Kirim Ulang Jika Roast Date Melebihi 7 Hari',
      items: [
        { name: 'Gayo Wine Process 250g', price: 'Rp 85.000', tag: 'Aroma Mewah' },
        { name: 'Gayo Natural Anaerob 250g', price: 'Rp 75.000', tag: 'Best Seller' },
        { name: 'Bundling Drip Bag Kopi Travel (10 pcs)', price: 'Rp 65.000', tag: 'Praktis' },
      ],
    },
  },
  {
    id: 'automotive-care',
    category: 'Bengkel & Detailing Otomotif',
    industryTag: 'Otomotif & Detailing',
    icon: '🚗',
    name: 'AutoKilat Coating & Car Care',
    city: 'Surabaya, Jawa Timur',
    tagline: 'Salon Mobil & Nano Ceramic Coating 9H Bergaransi Kilap 3 Tahun',
    problem: 'Pemilik mobil mewah ragu mempercayakan kendaraannya pada bengkel salon sembarangan. Takut cat baret, obat poles murah yang mengikis pernis, atau pengerjaan asal-asalan.',
    solution: 'Landing page profesional dengan dokumentasi before-after cat teroksidasi vs hasil nano ceramic 9H, video proses paint correction 3-step, kartu garansi digital, dan booking jadwal online.',
    ctaType: 'Konsultasi Kondisi Cat & Booking Jadwal',
    results: [
      { label: 'Booking Paket Platinum', value: '+85%', note: 'Paket coating premium Rp 2.5jt' },
      { label: 'Closing Lead Iklan', value: '42%', note: 'Dari leads Google Search mobil' },
      { label: 'Ulasan Google Maps', value: '4.9 Star', note: '230+ review positif pemilik mobil' },
    ],
    palette: {
      primary: '#1E293B',
      secondary: '#E2E8F0',
      accent: '#2563EB',
      bg: '#F8FAFC',
      cardBg: '#FFFFFF',
      text: '#0F172A',
    },
    mockup: {
      badge: 'NANO CERAMIC COATING 9H JAPAN FORMULA',
      headline: 'Lindungi Cat Mobil Anda dari Jamur, Sinar UV, dan Baret Halus Selamanya',
      subheadline: 'Kilau basah mendalam (deep wet look) dengan efek hidrofobik daun talas anti-kotor. Dikerjakan oleh teknisi bersertifikasi di ruangan steril ber-AC.',
      offerBadge: 'Diskon Booking Awal: Potongan Rp 500.000 + Gratis Fogging Interior Anti-Bakteri',
      ctaLabel: 'Klaim Diskon & Booking Slot di WhatsApp',
      priceSnippet: 'Paket Full Coating Mulai Rp 1.499.000',
      socialProof: '⭐⭐⭐⭐⭐ 4.95/5 dari 600+ Pemilik Mobil di Surabaya & Sidoarjo',
      features: [
        '3-Step Paint Correction Hilangkan 95% Baret Swirl',
        'Ketahanan Lapisan Keras 9H Berlian Bergaransi 3 Tahun',
        'Ruang Pengerjaan Khusus Tertutup Bebas Debu & Partikel',
        'Gratis Perawatan Berkala (Maintenance) Setiap 6 Bulan',
      ],
      guarantee: 'Garansi 3 Tahun Kilau Basah atau Coating Ulang Gratis',
      items: [
        { name: 'Paket Express Glass Coating', price: 'Rp 650.000', tag: 'Cepat 4 Jam' },
        { name: 'Paket Diamond Coating 9H', price: 'Rp 1.499.000', tag: 'Paling Laris' },
        { name: 'Paket Ultimate Interior Deep Clean', price: 'Rp 450.000', tag: 'Segar Wangi' },
      ],
    },
  },
  {
    id: 'frozen-food',
    category: 'Frozen Food & Makanan Beku',
    industryTag: 'Frozen Food & Daging',
    icon: '🥟',
    name: 'Dapur Beku Nusantara Dimsum & Daging',
    city: 'Malang & Surabaya',
    tagline: 'Dimsum Ayam Udang Premium & Rendang Daging Vakum Siap Santap',
    problem: 'Frozen food lokal sering dicap murahan atau tidak higienis. Calon pembeli butuh kepastian kemasan vakum kedap udara dan ketahanan suhu beku selama pengiriman same-day.',
    solution: 'Landing page segar dengan informasi komposisi daging melimpah (85% daging asli), sertifikasi P-IRT, opsi pengiriman kilat Paxel / GoSend, dan paket reseller modal minim.',
    ctaType: 'Order Frozen Food Fresh via WhatsApp',
    results: [
      { label: 'Pesanan Grosir Reseller', value: '45 Mitra Baru', note: 'Dalam 60 hari pertama' },
      { label: 'Omzet Harian', value: '3.1x Lipat', note: 'Didukung bundling keluarga hemat' },
      { label: 'Tingkat Repeat', value: '78%', note: 'Keluarga pesan ulang tiap 2 minggu' },
    ],
    palette: {
      primary: '#B91C1C',
      secondary: '#FEE2E2',
      accent: '#15803D',
      bg: '#FFF7ED',
      cardBg: '#FFFFFF',
      text: '#431407',
    },
    mockup: {
      badge: '100% DAGING ASLI · TANPA PENGAWET · HALAL',
      headline: 'Sajikan Makanan Selezat Restoran Bintang Lima Hanya dalam 5 Menit!',
      subheadline: 'Dimsum kenyal padat daging dan olahan rendang bumbu warisan. Dikemas vakum higienis, tahan 6 bulan beku di freezer keluarga Anda.',
      offerBadge: 'Paket Komplit Keluarga: Beli 4 Pack Dimsum Gratis 1 Pack Saus Mentai Creamy',
      ctaLabel: 'Order Paket Dimsum Segar di WhatsApp',
      priceSnippet: 'Harga mulai Rp 35.000 / pack (isi 10 pcs)',
      socialProof: '⭐⭐⭐⭐⭐ 4.9/5 dari 1.800+ Ibu Rumah Tangga & Pecinta Kuliner',
      features: [
        'Daging Ayam & Udang Segar Pilihan 85% Komposisi',
        'Kemasan Vakum Tebal Anti-Bocor & Food Grade',
        'Tahan 24 Jam Suhu Perjalanan dengan Ice Gel Khusus',
        'Garansi Ganti Baru Jika Produk Basi Saat Diterima',
      ],
      guarantee: '100% Garansi Ganti Baru Jika Masam/Rusak Saat Sampai',
      items: [
        { name: 'Dimsum Mix Mentai (Isi 10)', price: 'Rp 45.000', tag: 'Best Seller' },
        { name: 'Rendang Sapi Vakum 250g', price: 'Rp 65.000', tag: 'Daging Empuk' },
        { name: 'Paket Pesta Frozen (40 pcs)', price: 'Rp 140.000', tag: 'Hemat 30rb' },
      ],
    },
  },
  {
    id: 'education-course',
    category: 'Edukasi & Bimbel Mandiri',
    industryTag: 'Edukasi & Kursus',
    icon: '📚',
    name: 'Akademi Prestasi Juara Mandiri',
    city: 'Surakarta & Yogyakarta',
    tagline: 'Bimbel Intensif Masuk PTN Favorit & Kedinasan dengan Mentor Juara',
    problem: 'Orang tua siswa cemas anak gagal ujian UTBK SNBT, sementara biaya bimbel konvensional mencapai belasan juta rupiah. Butuh media presentasi kurikulum terstruktur dan rekam jejak kelulusan alumni.',
    solution: 'Landing page kredibel dengan daftar nama siswa yang lolos UI/UGM/ITB, jadwal belajar fleksibel online/offline, bank soal ter-update, dan uji coba tryout gratis.',
    ctaType: 'Daftar Konsultasi Jurusan & Tryout Gratis',
    results: [
      { label: 'Pendaftar Baru', value: '380 Siswa', note: 'Dalam gelombang pendaftaran pertama' },
      { label: 'Kelulusan PTN', value: '91.4%', note: 'Lolos di universitas negeri impian' },
      { label: 'Biaya Marketing', value: 'Hemat 60%', note: 'Landing page ranking di kata kunci lokal' },
    ],
    palette: {
      primary: '#4338CA',
      secondary: '#EEF2FF',
      accent: '#D97706',
      bg: '#EEF2FF',
      cardBg: '#FFFFFF',
      text: '#1E1B4B',
    },
    mockup: {
      badge: 'TERBUKTI 91.4% SISWA LOLOS PTN TARGET',
      headline: 'Raih Kampus Impian Tanpa Stres dengan Metode Belajar Penalaran Kilat',
      subheadline: 'Bimbingan intensif dipandu langsung oleh mentor lulusan UGM, ITB, dan UI. Dilengkapi modul soal prediksi akurat dan tes bakat minat.',
      offerBadge: 'Gelombang 1: Diskon 40% + Gratis Tes Kepribadian Jurusan Kuliah',
      ctaLabel: 'Konsultasi Jurusan & Klaim Diskon di WhatsApp',
      priceSnippet: 'Investasi Program Bimbel Mulai Rp 499.000',
      socialProof: '⭐⭐⭐⭐⭐ 4.98/5 dari 920+ Orang Tua Siswa & Alumni Lolos Kampus Impian',
      features: [
        'Kelas Kecil Maksimal 8 Siswa untuk Perhatian Penuh',
        'Tryout Berbasis CAT dengan Sistem Penilaian IRT Asli',
        'Konsultasi Pemilihan Jurusan Berdasarkan Nilai Rapor',
        'Garansi Bimbingan Ulang Gratis Jika Target Tidak Tercapai',
      ],
      guarantee: 'Garansi Pendampingan Intensif Hingga Hari Ujian',
      items: [
        { name: 'Program Intensif UTBK-SNBT', price: 'Rp 499.000', tag: 'Paling Dicari' },
        { name: 'Paket Tryout CAT IRT (10x)', price: 'Rp 149.000', tag: 'Sistem Asli' },
        { name: 'Private 1-on-1 Bedah Soal', price: 'Rp 750.000', tag: 'Eksklusif' },
      ],
    },
  },
];
