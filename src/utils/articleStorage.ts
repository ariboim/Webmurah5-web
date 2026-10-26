/**
 * Article & Admin Auth Storage Utility
 * Manages persistent articles and admin credentials in localStorage.
 */

export interface ArticleContent {
  background?: string;
  challenge?: string;
  strategy?: string[];
  result?: string;
  takeaway?: string;
  bodyText?: string; // Free-form article text / paragraphs
}

export interface Article {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  subtitle: string;
  readTime: string;
  date: string;
  sourceName: string;
  sourceUrl: string;
  keyStat: string;
  keyStatLabel: string;
  summary: string;
  imageUrl?: string; // Direct image URL, Google Drive image, or Base64 upload
  videoUrl?: string; // YouTube or Google Drive video URL
  videoType?: 'youtube' | 'drive' | 'direct' | 'none';
  content: ArticleContent;
  author?: string;
  isCustom?: boolean;
  createdAt?: number;
  metaDescription?: string;
  targetKeyword?: string;
  secondaryKeywords?: string[];
}

export const DEFAULT_ARTICLES: Article[] = [
  {
    id: 'aerostreet-klaten-sepatu-lokal',
    category: 'Fashion & Retail',
    categoryColor: 'bg-rose-50 text-rose-800 border-rose-200',
    title: 'Rahasia Aerostreet Merajai Pasar Sepatu Lokal',
    subtitle: 'Transformasi Pabrik Sepatu Klaten Bangkit Menjual Jutaan Pasang Lewat Live Shopping',
    readTime: '5 Menit Baca',
    date: '2026',
    sourceName: 'Studi Kasus Digitalisasi UMKM & E-Commerce',
    sourceUrl: 'https://kompas.id',
    keyStat: '2.5 Juta+',
    keyStatLabel: 'Pasang Sepatu / Tahun',
    metaDescription: 'Pelajari bagaimana Aerostreet bangkit dari krisis dan menjual jutaan pasang sepatu berkat live shopping. Simak strategi digitalnya di sini!',
    targetKeyword: 'digitalisasi UMKM sepatu',
    secondaryKeywords: ['live shopping e-commerce', 'strategi Aerostreet', 'pemasaran media sosial'],
    summary:
      'Dari pabrik sepatu konvensional di Klaten yang hampir gulung tikar akibat produk impor, Adhitya Caesarico mentransformasikan Aerostreet menjadi raksasa sepatu lokal lewat strategi live commerce TikTok Shop dan Shopee Live, menghasilkan jutaan pesanan per tahun.',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
    author: 'Adhitya Caesarico & Riset E-Commerce',
    isCustom: false,
    createdAt: 1713000000000,
    content: {
      bodyText: `<h2>Perjalanan Awal: Ancaman Gulung Tikar Pabrik Sepatu Klaten</h2>
<p>Sebelum dikenal luas oleh generasi muda di seluruh pelosok Nusantara, <strong>Aerostreet</strong> yang berbasis di Klaten, Jawa Tengah, beroperasi sebagai pabrik sepatu konvensional. Dipimpin oleh <strong>Adhitya Caesarico</strong>, bisnis ini mulanya sangat bergantung pada jaringan distribusi toko fisik tradisional (*offline*).</p>
<p>Namun, perubahan pola belanja masyarakat dan serbuan produk sepatu impor murah membuat bisnisnya sempat berada di ujung tanduk. Penjualan toko fisik merosot tajam, stok sepatu menumpuk di gudang, dan ancaman pemutusan hubungan kerja membayangi ratusan perajin lokal di daerah Klaten.</p>

<h2>Langkah Transformasi Digital: Menunggangi Gelombang Live Shopping</h2>
<p>Menyadari bahwa model bisnis lama tidak lagi relevan, Adhitya mengambil keputusan berani untuk merombak total strategi pemasaran dengan mengadopsi <strong>digitalisasi UMKM sepatu</strong> secara menyeluruh melalui ekosistem <em>social commerce</em> dan <em>live shopping</em> di TikTok Shop dan Shopee Live.</p>

<h3>1. Transparansi Kualitas Melalui Siaran Langsung (Live Streaming)</h3>
<p>Aerostreet tidak hanya sekadar memajang foto produk di katalog digital. Tim siaran langsung mendemonstrasikan kekuatan jahitan, fleksibilitas sol karet, dan kenyamanan sepatu secara nyata di depan kamera. Interaksi dua arah secara <em>real-time</em> menjawab keraguan calon pembeli yang selama ini ragu membeli sepatu tanpa mencobanya terlebih dahulu.</p>

<h3>2. Strategi Drop Culture dan Flash Sale yang Memicu FOMO</h3>
<p>Mengadopsi taktik rilis terbatas (*drop culture*), Aerostreet meluncurkan varian sepatu baru pada jam-jam tayang siaran langsung tertentu dengan kuota eksklusif. Pendekatan ini memicu antusiasme tinggi (*Fear of Missing Out*) di kalangan konsumen, di mana ribuan pasang sepatu kerap ludes hanya dalam hitungan menit.</p>

<h3>3. Kolaborasi Brand (Co-Branding) yang Viral</h3>
<p>Aerostreet menggandeng nama-nama besar dan ikon budaya populer Indonesia, mulai dari Indomie, Dagadu, hingga musisi lokal. Setiap kolaborasi dipromosikan secara masif di media sosial sehingga memicu percakapan organik (*viral marketing*) tanpa beban biaya iklan konvensional yang mahal.</p>

<h2>Hasil dan Pencapaian: Melipatgandakan Omzet dan Lapangan Kerja</h2>
<p>Transformasi digital ini membuahkan hasil fantastis. Aerostreet berhasil bertransformasi dari produsen lokal yang nyaris kolaps menjadi salah satu merek alas kaki terlaris di Indonesia dengan angka penjualan menembus <strong>lebih dari 2,5 juta pasang sepatu per tahun</strong>.</p>
<p>Pabrik di Klaten kini mempekerjakan ribuan karyawan dan perajin lokal, sekaligus membuktikan bahwa produk lokal dengan harga terjangkau mampu bersaing ketat dengan merek internasional di ranah daring.</p>

<h2>Pelajaran Berharga untuk Pelaku UMKM</h2>
<ul>
  <li><strong>Buktikan Kualitas Lewat Konten Video Interaktif:</strong> Konsumen era digital membutuhkan bukti visual nyata. Manfaatkan fitur siaran langsung (*live streaming*) untuk mendemonstrasikan keunggulan produk Anda secara transparan.</li>
  <li><strong>Ciptakan Momen Penjualan Terjadwal:</strong> Jangan biarkan etalase digital Anda pasif. Bangun jadwal promosi rutin yang dinantikan oleh pengikut setia Anda.</li>
  <li><strong>Miliki Aset Digital Mandiri:</strong> Sinergikan media sosial dan marketplace dengan aset web mandiri agar Anda memiliki kendali penuh atas identitas brand dan margin laba.</li>
</ul>

<p><em>Kisah Aerostreet menegaskan bahwa digitalisasi bukan sekadar opsi tambahan, melainkan penyelamat sekaligus mesin akselerasi bisnis bagi UMKM yang berani keluar dari zona nyaman.</em></p>`,
    },
  },
  {
    id: 'bittersweet-by-najla-kuliner-dessert',
    category: 'Kuliner & Makanan Kemasan',
    categoryColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Kisah Sukses Bittersweet by Najla Dominasi Pasar',
    subtitle: 'Inovasi Dessert Box Garasi Rumah Menjadi Bisnis Beromzet Miliaran dengan 1.000 Karyawan',
    readTime: '5 Menit Baca',
    date: '2026',
    sourceName: 'Warta Ekonomi & Riset Kuliner Digital',
    sourceUrl: 'https://wartaekonomi.co.id',
    keyStat: '1.000+',
    keyStatLabel: 'Karyawan & Puluhan Gerai',
    metaDescription: 'Dari garasi rumah hingga seribu karyawan! Temukan rahasia Bittersweet by Najla melejitkan omzet lewat live commerce dan e-commerce di sini.',
    targetKeyword: 'sukses bisnis dessert box',
    secondaryKeywords: ['e-commerce UMKM kuliner', 'live commerce makanan', 'pemasaran digital omnichannel'],
    summary:
      'Dimulai dari industri rumahan di garasi, Najla Bisyir mengatasi tantangan batas kedaluwarsa cake dengan logistik pendingin kilat dan pemasaran live shopping interaktif, mengantarkan Bittersweet by Najla mempekerjakan seribu karyawan dan menjual puluhan ribu box per hari.',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    author: 'Najla Bisyir & Liputan UMKM Kuliner',
    isCustom: false,
    createdAt: 1713100000000,
    content: {
      bodyText: `<h2>Awal Mula: Tantangan Bisnis Makanan Basah dari Dapur Rumah</h2>
<p>Pada tahun 2016, <strong>Najla Bisyir</strong> memulai usaha pembuatan kue manis (*dessert*) dari garasi rumahnya di Jakarta dengan nama <strong>Bittersweet by Najla</strong>. Sebagai pelopor konsep <em>dessert box</em> di Indonesia, tantangan terbesar yang dihadapi usaha kuliner ini adalah masa simpan produk (*shelf-life*) yang relatif singkat.</p>
<p>Kue basah berlapis krim cokelat rentan rusak jika terpapar suhu ruang dalam waktu lama. Akibatnya, jangkauan penjualan awalnya hanya terbatas pada pelanggan di sekitar area domisili yang memesan secara manual melalui pesan WhatsApp.</p>

<h2>Strategi Digitalisasi: Omnichannel & Logistik Terintegrasi</h2>
<p>Najla menyadari bahwa untuk mencapai <strong>sukses bisnis dessert box</strong> dalam skala nasional, ia harus memadukan kekuatan pemasaran digital dengan solusi logistik modern.</p>

<h3>1. Integrasi Multi-Platform E-Commerce & Logistik Rantai Dingin</h3>
<p>Bittersweet by Najla bermigrasi dari sistem pencatatan pesanan manual ke platform e-commerce terkemuka (seperti Tokopedia dan Shopee) serta menggandeng ekspedisi kurir kilat khusus makanan dingin (*cold-chain logistics* seperti Paxel). Langkah ini memungkinkan paket dessert terkirim dalam kondisi beku sempurna ke puluhan kota di Pulau Jawa, Bali, hingga Sumatra.</p>

<h3>2. Live Shopping Interaktif & Food Seduction Content</h3>
<p>Najla memanfaatkan fitur siaran langsung (*live streaming*) untuk berinteraksi langsung dengan para penikmat dessert. Sesi *live* menyajikan potongan dessert box lumer (*food porn visual*) yang memancing air liur penonton, disertai penawaran kupon diskon kilat dan gratis ongkos kirim yang mendorong transaksi impulsif seketika.</p>

<h3>3. Membangun Bukti Sosial (Social Proof) & Endorsement Massif</h3>
<p>Setiap ulasan positif dari konsumen diviralkan kembali melalui Instagram Stories dan TikTok. Kehadiran ulasan otentik dari ratusan selebritas dan ribuan pelanggan biasa menciptakan efek bola salju yang mengukuhkan posisi brand sebagai tolak ukur dessert box di Indonesia.</p>

<h2>Hasil Konkret: Ribuan Pesanan Harian dan 1.000+ Lapangan Kerja</h2>
<p>Kombinasi konten visual yang menggugah selera dan ekosistem digital yang kokoh membuahkan hasil luar biasa. Bisnis yang berawal dari garasi kini mempekerjakan <strong>lebih dari 1.000 karyawan</strong>, mendirikan pabrik produksi higienis, dan membuka puluhan outlet fisik di berbagai kota besar.</p>
<p>Pada festival kampanye belanja online (seperti 9.9 dan 12.12), Bittersweet by Najla rutin mencatatkan rekor penjualan puluhan ribu box hanya dalam kurun waktu beberapa jam sesi live shopping berlangsung.</p>

<h2>Pelajaran Aplikatif untuk Pengusaha Kuliner</h2>
<ul>
  <li><strong>Selesaikan Kendala Pengiriman dengan Kemitraan Digital:</strong> Jangan biarkan kendala fisik membatasi pasar Anda. Manfaatkan jaringan ekspedisi logistik kilat dan kurir instan untuk memperluas radius pemasaran.</li>
  <li><strong>Eksploitasi Visual Produk:</strong> Dalam bisnis makanan, daya pikat visual adalah 80% pemicu pembelian. Investasikan waktu untuk memproduksi foto dan video berkualitas tinggi yang menggugah selera.</li>
  <li><strong>Miliki Halaman Penawaran Khusus:</strong> Menyediakan halaman katalog digital mandiri mempermudah pelanggan memilih varian rasa dan melakukan pembayaran tanpa harus menunggu balasan admin chat yang lambat.</li>
</ul>

<p><em>Keberhasilan Bittersweet by Najla membuktikan bahwa komitmen menjaga kualitas rasa yang diimbangi keberanian memanfaatkan teknologi mampu mengangkat usaha rumahan menjadi industri berskala nasional.</em></p>`,
    },
  },
  {
    id: 'pala-nusantara-jam-kayu-ekspor',
    category: 'Jasa & Produk Kreatif',
    categoryColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    title: 'Pala Nusantara: Jam Kayu Lokal Tembus Ekspor Dunia',
    subtitle: 'Strategi Digital Storytelling & Website Mandiri Membawa Kriya Bandung ke Pasar Global',
    readTime: '5 Menit Baca',
    date: '2026',
    sourceName: 'Studi Kasus Kriya Nusantara & Ekspor Digital',
    sourceUrl: 'https://kompas.com',
    keyStat: '15+ Negara',
    keyStatLabel: 'Tujuan Ekspor Mancanegara',
    metaDescription: 'Kisah inspiratif Pala Nusantara menembus pasar ekspor dunia berkat digital storytelling dan website resmi. Baca strategi suksesnya di sini!',
    targetKeyword: 'ekspor kriya jam tangan kayu',
    secondaryKeywords: ['digital storytelling branding', 'website UMKM global', 'kerajinan nusantara'],
    summary:
      'Berangkat dari keterbatasan pasar kriya fisik di Bandung, Ilham Pinastiko membawa jam tangan kayu Pala Nusantara menembus pasar ekspor di 15 negara melalui kekuatan digital storytelling dan website profesional mandiri berstandar internasional.',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    author: 'Ilham Pinastiko & Studi Kasus Ekspor',
    isCustom: false,
    createdAt: 1713200000000,
    content: {
      bodyText: `<h2>Tantangan Produk Kriya: Nilai Seni Tinggi di Pasar Fisik yang Terbatas</h2>
<p>Banyak perajin kriya di Indonesia menghadapi kendala yang sama: produk mereka memiliki nilai estetika dan filosofi yang mendalam, namun sulit mendapatkan harga jual yang layak di pasar lokal konvensional. Kondisi ini dialami oleh <strong>Ilham Pinastiko</strong> saat mendirikan <strong>Pala Nusantara</strong> di Bandung, Jawa Barat.</p>
<p>Memproduksi jam tangan dan aksesori berbahan dasar kayu lokal (seperti kayu sonokeling dan maple) serta kulit nabati, produk Pala Nusantara bukan sekadar penunjuk waktu, melainkan karya seni. Namun saat hanya mengandalkan pameran fisik (*bazaar*), calon pembeli kerap menawar murah karena menganggapnya sekadar kerajinan tangan biasa.</p>

<h2>Strategi Transformasi Digital: Menjual Nilai Melalui Narasi Budaya</h2>
<p>Menolak untuk menurunkan harga dan menurunkan kualitas, Ilham memutar haluan strategi bisnis dengan menargetkan pasar penikmat produk desain bernilai seni tinggi, baik di dalam negeri maupun mancanegara.</p>

<h3>1. Pendekatan Digital Storytelling yang Otentik</h3>
<p>Setiap koleksi jam tangan diberi nama dan filosofi cerita rakyat Nusantara (seperti seri Toraja, Rinjani, dan Samudra). Di Instagram dan media digital, Pala Nusantara tidak menjual "fitur jam tangan", melainkan narasi identitas budaya dan gaya hidup berkelanjutan (*eco-friendly luxury*). Pendekatan ini berhasil menarik minat konsumen berdaya beli tinggi (*affluent market*).</p>

<h3>2. Membangun Website Resmi Mandiri Berstandar Global</h3>
<p>Alih-alih hanya bergantung pada marketplace domestik, Pala Nusantara membangun situs web mandiri dengan bahasa ganda (Inggris dan Indonesia), tampilan visual minimalis modern, serta integrasi sistem pembayaran internasional (kartu kredit dan payment gateway global). Website ini menjadi etalase profesional yang memverifikasi kredibilitas bisnis di mata pembeli luar negeri.</p>

<h3>3. Iklan Tertarget (Targeted Digital Ads) ke Pecinta Desain</h3>
<p>Melalui Meta Ads (Facebook & Instagram), Pala Nusantara menyasar target audiens spesifik: pecinta produk ramah lingkungan, arsitek, desainer, dan kolektor jam tangan unik di kota-kota besar Indonesia serta negara tetangga seperti Singapura, Malaysia, dan Jepang.</p>

<h2>Pencapaian: Menembus Pasar Ekspor di Lebih dari 15 Negara</h2>
<p>Strategi digitalisasi ini mengantarkan Pala Nusantara melompati batas geografis. Saat ini, produk jam tangan kayu asli Bandung ini telah berhasil diekspor secara rutin ke <strong>lebih dari 15 negara</strong>, meliputi Jepang, Korea Selatan, Australia, Jerman, hingga Amerika Serikat.</p>
<p>Selain mencatatkan pertumbuhan omzet hingga ratusan persen, kesuksesan ini berdampak langsung pada kesejahteraan puluhan perajin kayu dan kulit lokal di Jawa Barat yang mendapatkan penghasilan di atas rata-rata berkat tingginya nilai tambah produk kriya di pasar dunia.</p>

<h2>Pelajaran Kunci bagi Pelaku Usaha Kriya dan Kerajinan</h2>
<ul>
  <li><strong>Jual Makna, Bukan Sekadar Benda:</strong> Konsumen modern bersedia membayar mahal untuk cerita, filosofi, dan orisinalitas. Gunakan media digital untuk menceritakan proses pembuatan (*behind the scenes*) dan filosofi di balik produk Anda.</li>
  <li><strong>Website Mandiri adalah Paspor Ekspor:</strong> Calon pembeli luar negeri menuntut profesionalisme. Memiliki website dengan domain resmi sendiri adalah syarat mutlak untuk membangun rasa percaya (*trust*) pembeli internasional.</li>
  <li><strong>Bidik Segmen yang Tepat dengan Pemasaran Digital:</strong> Jika produk Anda bernilai premium, jangan bertarung harga di pasar umum. Gunakan alat analitik digital untuk menyasar audiens yang memang menghargai kualitas produk Anda.</li>
</ul>

<p><em>Kisah Pala Nusantara membuktikan bahwa kriya lokal Indonesia memiliki daya saing luar biasa di panggung global. Kuncinya terletak pada pengemasan narasi yang elegan dan pemanfaatan infrastruktur digital mandiri.</em></p>`,
    },
  },
  {
    id: 'metamorf-perawatan-sepatu',
    category: 'Jasa & Produk Kreatif',
    categoryColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    title: 'Kisah Sukses "Metamorf": Dari Garasi Rumah Meraup Lonjakan Omzet 800% Berkat Ekosistem Digital',
    subtitle: 'Bagaimana usaha perawatan sepatu DIY berhasil menembus pasar 38 kota di Indonesia melalui halaman katalog digital mandiri.',
    readTime: '4 Menit Baca',
    date: '2026',
    sourceName: 'Kompas.com & Liputan UMKM Go Digital',
    sourceUrl: 'https://kompas.com',
    keyStat: '+800%',
    keyStatLabel: 'Lonjakan Omzet Usaha',
    summary:
      'Senoaji, pemilik brand perawatan sepatu Metamorf, awalnya hanya melayani orderan sekitar lingkungan perumahan. Setelah membangun kehadiran digital dengan halaman penawaran khusus dan integrasi pemesanan instan via WhatsApp, bisnisnya berkembang pesat dengan lonjakan omzet hingga 800% dan pengiriman ratusan paket setiap hari ke seluruh Indonesia.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    content: {
      background:
        'Senoaji mengawali usaha perawatan sepatu DIY (Do-It-Yourself) dari garasi rumah dengan modal terbatas. Sebelum bertransformasi ke digital, tantangan terbesarnya adalah lingkup pasar yang sempit karena hanya mengandalkan pelanggan lokal sekitar domisili yang datang secara fisik.',
      challenge:
        'Pelanggan ragu membeli produk perawatan sepatu tanpa bukti hasil nyata (before-after), serta kebingungan calon pembeli memilih jenis formula pembersih yang cocok untuk bahan sepatu tertentu (canvas, suede, leather).',
      strategy: [
        'Membuat halaman website/landing page resmi yang menampilkan galeri transformasi sebelum & sesudah (before-after) secara detail dan meyakinkan.',
        'Menyediakan tombol konsultasi dan pemesanan cepat langsung ke WhatsApp, sehingga calon pembeli bisa berkonsultasi gratis mengenai jenis sepatu mereka sebelum membeli.',
        'Menerapkan paket hemat bundling (sabun pembersih + sikat bulu kuda + semprotan anti-air) dengan diskon khusus yang dipajang di halaman utama website.',
        'Memanfaatkan domain resmi sendiri (.my.id/.biz.id) yang meningkatkan reputasi usaha menjadi lebih tepercaya dan profesional di mata pelanggan luar pulau.',
      ],
      result:
        'Omzet bulanan melonjak hingga 800% dalam waktu kurang dari satu tahun. Jangkauan distribusi melebar ke 38 kota dari Sumatra, Jawa, hingga Sulawesi, dengan perputaran ratusan paket perawatan sepatu yang dikirim setiap minggunya.',
      takeaway:
        'Bagi pelaku usaha kreatif, halaman website mandiri adalah "etalase permanen" 24 jam. Kejelasan visual hasil kerja dan kemudahan order via WhatsApp menjadi kunci utama yang meruntuhkan keraguan pembeli baru.',
    },
    isCustom: false,
    createdAt: 1710000000000,
  },
  {
    id: 'kuliner-rasa-nusantara',
    category: 'Kuliner & Makanan Kemasan',
    categoryColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Transformasi "Rasa Nusantara": Penjualan Makanan Rumahan Melonjak 230% dan Tembus Pasar Antar-Kota',
    subtitle: 'Kisah UMKM kuliner Bandung yang melompat dari sekadar jualan antar tetangga menjadi produsen frozen food beromzet puluhan juta.',
    readTime: '5 Menit Baca',
    date: '2026',
    sourceName: 'Digima & Studi Kasus UMKM Bandung',
    sourceUrl: 'https://digima.id',
    keyStat: '+230%',
    keyStatLabel: 'Pertumbuhan Penjualan 12 Bulan',
    summary:
      'Usaha kuliner rumahan "Rasa Nusantara" asal Bandung mulanya hanya mengandalkan pesanan arisan tetangga. Begitu membuat landing page 1 halaman dengan menu paket frozen, testimoni pelanggan, dan jaminan pengiriman higienis, penjualan meroket 230% dalam 12 bulan dan 40% pesanan datang dari luar kota.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    content: {
      background:
        'Dimulai dari resep sambal cumi dan lauk pauk tradisional khas Jawa Barat oleh ibu rumah tangga, produk ini sangat disukai keluarga. Namun saat berniat menjadikannya bisnis serius, penjualan tersendat karena keterbatasan channel distribusi konvensional.',
      challenge:
        'Calon pembeli luar kota ragu mengenai ketahanan makanan, sertifikasi higienis, serta proses pengiriman makanan basah yang rawan basi jika tidak dikemas vakum dengan benar.',
      strategy: [
        'Membangun landing page khusus produk makanan dengan fokus pada foto produk asli berselera tinggi (high-appetite visual).',
        'Menyematkan informasi ketahanan makanan secara transparan: tahan 7 hari suhu ruang, 6 bulan beku di freezer, dengan sertifikat P-IRT & Halal MUI.',
        'Membuat paket promo bundling (Beli 3 Botol Sambal Gratis 1 Lauk Siap Saji) lengkap dengan hitung mundur penawaran terbatas.',
        'Menyediakan formulir pemesanan ringkas dengan integrasi alamat otomatis dan konfirmasi ongkos kirim ekspedisi kilat Paxel / JNE YES.',
      ],
      result:
        'Total transaksi bulanan meningkat 230% dalam waktu 12 bulan. Sebanyak 40% dari total pelanggan aktif kini berasal dari luar kota Bandung seperti Jakarta, Surabaya, Semarang, dan Denpasar, dengan pesanan rutin setiap awal bulan.',
      takeaway:
        'Bisnis kuliner yang memiliki landing page mandiri terlihat 10x lebih higienis dan tepercaya dibanding bisnis yang hanya berjualan di feed media sosial tanpa informasi spesifikasi produk yang jelas.',
    },
    isCustom: false,
    createdAt: 1711000000000,
  },
  {
    id: 'riset-kemenkop-data-digital',
    category: 'Riset & Data Nasional',
    categoryColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    title: 'Riset Kemenkop UKM & EzeeLink: Rata-Rata UMKM Digital Meraup Kenaikan Pendapatan 26% Hingga 5 Kali Lipat',
    subtitle: 'Data komprehensif adopsi teknologi: mengapa memiliki aset website mandiri membebaskan UMKM dari jebakan perang harga.',
    readTime: '4 Menit Baca',
    date: '2026',
    sourceName: 'Kemenkop UKM RI, Bank Indonesia & EzeeLink Research',
    sourceUrl: 'https://binus.ac.id',
    keyStat: '5X Lipat',
    keyStatLabel: 'Maksimal Kenaikan Omzet',
    summary:
      'Laporan riset Kemenkop UKM dan survei adopsi digital mencatat rata-rata pelaku usaha mikro yang mendigitalisasi operasional dan memiliki website sendiri mengalami kenaikan omzet 26% hingga 5 kali lipat, memangkas rantai distribusi panjang, serta mengamankan database pembeli tetap.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    content: {
      background:
        'Transformasi digital UMKM menjadi agenda prioritas nasional dengan target lebih dari 30 juta UMKM terhubung ekosistem digital. Riset membuktikan bahwa bisnis dengan aset digital mandiri memiliki ketahanan ekonomi 3x lipat lebih tinggi saat krisis.',
      challenge:
        'Banyak UMKM hanya bergantung pada marketplace pihak ketiga, yang kerap memotong biaya admin tinggi (6% - 12%) serta memicu perang harga (price war) yang menghabiskan margin laba bersih pedagang kecil.',
      strategy: [
        'Membangun aset digital milik sendiri (landing page & nama domain bisnis mandiri) agar memiliki kendali penuh atas harga dan identitas merek.',
        'Menghubungkan tombol pesan langsung ke kontak WhatsApp penjual, sehingga nomor ponsel pembeli tersimpan ke dalam database pelanggan bisnis.',
        'Memanfaatkan penawaran harga paket (bundling) dan garansi kepuasan yang tidak bisa ditiru oleh kompetitor di marketplace.',
        'Menerapkan pengerjaan kilat 24 jam untuk meluncurkan kampanye produk sebelum momen musiman (hari raya, gajian, atau event promo).',
      ],
      result:
        'Pelaku usaha yang menerapkan strategi landing page mandiri mencatatkan penghematan biaya komisi hingga 100%, kenaikan omzet rata-rata 26% hingga 5x lipat, dan tingkat pembelian ulang (repeat order) mencapai 35-45% karena komunikasi WhatsApp yang intim.',
      takeaway:
        'Website bukan sekadar biaya, melainkan aset investasi penjualan 24 jam. Dengan biaya awal terjangkau (promo Rp 499.000 all-in), ROI (Return on Investment) UMKM dapat tercapai hanya dari 5 sampai 10 transaksi pertama.',
    },
    isCustom: false,
    createdAt: 1712000000000,
  },
];

const ARTICLES_STORAGE_KEY = 'webmurah_articles_v2';
const ADMIN_CREDS_STORAGE_KEY = 'webmurah_admin_credentials_v1';
const ADMIN_SESSION_STORAGE_KEY = 'webmurah_admin_logged_in';

export interface AdminCredentials {
  username: string;
  password: string;
  lastUpdated: string;
}

const DEFAULT_ADMIN_CREDS: AdminCredentials = {
  username: 'admin',
  password: 'admin123',
  lastUpdated: 'Default',
};

// ================= ADMIN CREDENTIALS & AUTH =================

export function getAdminCredentials(): AdminCredentials {
  try {
    const raw = localStorage.getItem(ADMIN_CREDS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username && parsed.password) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading admin creds:', e);
  }
  return DEFAULT_ADMIN_CREDS;
}

export function saveAdminCredentials(creds: AdminCredentials): boolean {
  try {
    localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(creds));
    return true;
  } catch (e) {
    console.error('Error saving admin creds:', e);
    return false;
  }
}

export function updateAdminCredentials(newUsername: string, newPassword: string): { success: boolean; message: string } {
  const trimmedUser = newUsername.trim();
  const trimmedPass = newPassword.trim();

  if (!trimmedUser || trimmedUser.length < 3) {
    return { success: false, message: 'Username minimal harus 3 karakter.' };
  }
  if (!trimmedPass || trimmedPass.length < 4) {
    return { success: false, message: 'Password minimal harus 4 karakter.' };
  }

  const updated: AdminCredentials = {
    username: trimmedUser,
    password: trimmedPass,
    lastUpdated: new Date().toLocaleString('id-ID'),
  };

  const ok = saveAdminCredentials(updated);
  if (ok) {
    return { success: true, message: `Username dan Password admin berhasil diperbarui menjadi "${trimmedUser}".` };
  }
  return { success: false, message: 'Gagal menyimpan perubahan ke browser.' };
}

export function verifyAdminLogin(usernameAttempt: string, passwordAttempt: string): boolean {
  const creds = getAdminCredentials();
  return (
    usernameAttempt.trim().toLowerCase() === creds.username.trim().toLowerCase() &&
    passwordAttempt.trim() === creds.password.trim()
  );
}

export function isAdminLoggedIn(): boolean {
  try {
    return (
      sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === 'true' ||
      localStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === 'true'
    );
  } catch {
    return false;
  }
}

export function setAdminSession(loggedIn: boolean, remember: boolean = true) {
  try {
    if (loggedIn) {
      sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, 'true');
      if (remember) {
        localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, 'true');
      }
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Error toggling admin session:', e);
  }
}

// ================= ARTICLES MANAGEMENT =================

const DELETED_ARTICLES_STORAGE_KEY = 'webmurah_deleted_article_ids_v2';
const CATEGORIES_STORAGE_KEY = 'webmurah_article_categories_v2';

export interface ArticleCategory {
  id: string;
  name: string;
  color: string;
  isCustom?: boolean;
  createdAt?: number;
}

export const DEFAULT_CATEGORIES: ArticleCategory[] = [
  { id: 'tips-bisnis', name: 'Tips Bisnis & Marketing', color: 'bg-sky-50 text-sky-800 border-sky-200' },
  { id: 'kuliner-fnb', name: 'Kuliner & Makanan Kemasan', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'jasa-kreatif', name: 'Jasa & Produk Kreatif', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'fashion-retail', name: 'Fashion & Retail', color: 'bg-rose-50 text-rose-800 border-rose-200' },
  { id: 'riset-data', name: 'Riset & Data Nasional', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { id: 'kisah-umkm', name: 'Kisah Sukses UMKM', color: 'bg-purple-50 text-purple-800 border-purple-200' },
];

function getDeletedArticleIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_ARTICLES_STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch (e) {
    console.error(e);
  }
  return new Set();
}

function saveDeletedArticleIds(ids: Set<string>) {
  try {
    localStorage.setItem(DELETED_ARTICLES_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch (e) {
    console.error(e);
  }
}

export function getAllArticles(): Article[] {
  try {
    const deletedIds = getDeletedArticleIds();
    const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
    let list: Article[] = [];

    if (raw) {
      const customArticles: Article[] = JSON.parse(raw);
      if (Array.isArray(customArticles)) {
        const customIds = new Set(customArticles.map((a) => a.id));
        const filteredDefaults = DEFAULT_ARTICLES.filter((a) => !customIds.has(a.id));
        list = [...customArticles, ...filteredDefaults];
      }
    } else {
      list = [...DEFAULT_ARTICLES];
    }

    // Filter out any articles marked as deleted by admin
    return list.filter((a) => !deletedIds.has(a.id));
  } catch (e) {
    console.error('Error loading articles from storage:', e);
  }
  return DEFAULT_ARTICLES;
}

export function getCustomArticlesOnly(): Article[] {
  try {
    const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (raw) {
      const parsed: Article[] = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveArticle(article: Article): boolean {
  try {
    const currentCustom = getCustomArticlesOnly();
    const existingIndex = currentCustom.findIndex((a) => a.id === article.id);

    // If it was in deleted IDs list, remove from deleted
    const deletedIds = getDeletedArticleIds();
    if (deletedIds.has(article.id)) {
      deletedIds.delete(article.id);
      saveDeletedArticleIds(deletedIds);
    }

    let updatedList: Article[];
    if (existingIndex >= 0) {
      updatedList = [...currentCustom];
      updatedList[existingIndex] = { ...article, isCustom: true };
    } else {
      updatedList = [{ ...article, isCustom: true, createdAt: Date.now() }, ...currentCustom];
    }

    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(updatedList));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('articles-updated', { detail: updatedList }));
    }
    return true;
  } catch (e) {
    console.error('Failed to save article:', e);
    return false;
  }
}

export function deleteArticle(articleId: string): boolean {
  try {
    // 1. Remove from custom articles if present
    const currentCustom = getCustomArticlesOnly();
    const filtered = currentCustom.filter((a) => a.id !== articleId);
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(filtered));

    // 2. Mark as deleted in deleted set so default articles can also be removed
    const deletedIds = getDeletedArticleIds();
    deletedIds.add(articleId);
    saveDeletedArticleIds(deletedIds);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('articles-updated', { detail: filtered }));
    }
    return true;
  } catch (e) {
    console.error('Failed to delete article:', e);
    return false;
  }
}

export function resetArticlesToDefault(): void {
  try {
    localStorage.removeItem(ARTICLES_STORAGE_KEY);
    localStorage.removeItem(DELETED_ARTICLES_STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('articles-updated', { detail: DEFAULT_ARTICLES }));
    }
  } catch (e) {
    console.error(e);
  }
}

// ================= CATEGORIES MANAGEMENT =================

export function getAllCategories(): ArticleCategory[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw) {
      const customCats: ArticleCategory[] = JSON.parse(raw);
      if (Array.isArray(customCats) && customCats.length > 0) {
        // Merge custom categories with defaults (avoiding duplicate names)
        const customNames = new Set(customCats.map((c) => c.name.toLowerCase()));
        const uniqueDefaults = DEFAULT_CATEGORIES.filter(
          (d) => !customNames.has(d.name.toLowerCase())
        );
        return [...customCats, ...uniqueDefaults];
      }
    }
  } catch (e) {
    console.error('Error reading categories:', e);
  }
  return DEFAULT_CATEGORIES;
}

export function saveCategory(
  name: string,
  colorVariant: string
): { success: boolean; message: string; category?: ArticleCategory } {
  const trimmedName = name.trim();
  if (!trimmedName || trimmedName.length < 2) {
    return { success: false, message: 'Nama kategori minimal 2 karakter.' };
  }

  try {
    const all = getAllCategories();
    const existing = all.find((c) => c.name.toLowerCase() === trimmedName.toLowerCase());
    if (existing) {
      return { success: false, message: `Kategori "${trimmedName}" sudah ada.` };
    }

    const newCat: ArticleCategory = {
      id: 'cat-' + trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
      name: trimmedName,
      color: colorVariant || 'bg-sky-50 text-sky-800 border-sky-200',
      isCustom: true,
      createdAt: Date.now(),
    };

    const currentCustomRaw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    const currentCustom: ArticleCategory[] = currentCustomRaw ? JSON.parse(currentCustomRaw) : [];
    const updatedCustom = [newCat, ...currentCustom];

    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCustom));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('categories-updated', { detail: updatedCustom }));
    }

    return {
      success: true,
      message: `Kategori "${trimmedName}" berhasil disimpan dan langsung aktif!`,
      category: newCat,
    };
  } catch (e) {
    console.error('Failed to save category:', e);
    return { success: false, message: 'Gagal menyimpan kategori ke browser.' };
  }
}

export function deleteCategory(categoryId: string): boolean {
  try {
    const currentCustomRaw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!currentCustomRaw) return false;
    const currentCustom: ArticleCategory[] = JSON.parse(currentCustomRaw);
    const filtered = currentCustom.filter((c) => c.id !== categoryId);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(filtered));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('categories-updated', { detail: filtered }));
    }
    return true;
  } catch (e) {
    console.error('Failed to delete category:', e);
    return false;
  }
}

export function resetCategoriesToDefault(): void {
  try {
    localStorage.removeItem(CATEGORIES_STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('categories-updated', { detail: DEFAULT_CATEGORIES }));
    }
  } catch (e) {
    console.error(e);
  }
}

