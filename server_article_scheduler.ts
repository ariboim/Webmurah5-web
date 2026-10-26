import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface QueuedArticle {
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
  imageUrl?: string;
  metaDescription: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  content: {
    bodyText: string;
  };
  scheduledSlot?: string;
  status: 'queued' | 'published';
  publishedAt?: string;
}

export interface SchedulerConfig {
  enabled: boolean;
  postsPerDay: number;
  dailySlots: string[]; // e.g. ["08:00", "17:00"] WIB
  timezone: string;
  autoSendNewsletter: boolean;
  lastPostedAt: string | null;
  nextPostScheduledAt: string;
  totalPublishedCount: number;
}

const QUEUE_FILE = path.join(__dirname, 'data_article_queue.json');
const CONFIG_FILE = path.join(__dirname, 'data_scheduler_config.json');
const PUBLISHED_FILE = path.join(__dirname, 'data_published_articles.json');

// Initial articles in queue ready for scheduled automatic publication (minimal 2/hari)
const INITIAL_QUEUE: QueuedArticle[] = [
  {
    id: 'kopi-tuku-revolusi-kopi-susu',
    category: 'Kuliner & Makanan Kemasan',
    categoryColor: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Kopi Tuku: Kisah Pelopor Kopi Susu Gula Aren',
    subtitle: 'Revolusi Kedai Kopi Tetangga Menjadi Ikon Gerakan Bangga Buatan Indonesia',
    readTime: '5 Menit Baca',
    date: '2026',
    sourceName: 'Liputan Bisnis & Riset F&B Nusantara',
    sourceUrl: 'https://kompas.com',
    keyStat: '50.000+',
    keyStatLabel: 'Gelas Kopi / Hari',
    metaDescription: 'Pelajari kisah sukses Kopi Tuku mempelopori tren es kopi susu gula aren lewat digitalisasi pemesanan dan kedai ramah tetangga di sini!',
    targetKeyword: 'kisah sukses kopi tuku',
    secondaryKeywords: ['bisnis kopi susu kekinian', 'digitalisasi kedai kopi', 'strategi pemasaran F&B'],
    summary:
      'Didirikan oleh Andanu Prasetyo di Cipete, Toko Kopi Tuku mengubah lanskap industri kopi Indonesia dengan mempopulerkan es kopi susu gula aren yang terjangkau, memadukan komunitas lokal dengan pemesanan digital kilat.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    status: 'queued',
    content: {
      bodyText: `<h2>Awal Perjalanan: Menentang Stigma Kopi Mahal</h2>
<p>Sebelum tahun 2015, industri kopi di kota-kota besar Indonesia didominasi oleh jaringan kafe internasional dengan harga yang relatif mahal bagi masyarakat umum. <strong>Andanu Prasetyo</strong>, pendiri <strong>Toko Kopi Tuku</strong>, melihat adanya jurang pemisah antara petani kopi lokal dengan konsumen harian.</p>
<p>Bermula dari gerai kecil di Jalan Cipete Raya, Jakarta Selatan, tantangan terbesarnya adalah bagaimana meramu kopi berkualitas tinggi dari biji kopi lokal Indonesia namun dengan harga yang terjangkau oleh para tetangga di sekitar toko.</p>

<h2>Inovasi & Digitalisasi: Lahirnya "Es Kopi Susu Tetangga"</h2>
<p>Andanu meracik kombinasi kopi arabika-robusta dengan gula aren cair lokal yang kemudian diberi nama <em>Es Kopi Susu Tetangga</em>. Inovasi rasa ini memicu gelombang baru penikmat kopi di tanah air.</p>
<h3>1. Adopsi Pemesanan Ojek Online & Pembayaran QRIS Instan</h3>
<p>Tuku menjadi salah satu pelopor yang memanfaatkan integrasi pengiriman digital on-demand secara masif. Antrean pengemudi ojek online yang mengular di depan gerai Cipete menjadi pemandangan viral di media sosial, memicu publisitas organik yang sangat besar tanpa biaya iklan.</p>
<h3>2. Konsistensi Standar Rasa & Pelatihan Barista Lokal</h3>
<p>Dengan menerapkan sistem pencatatan inventaris digital terpusat, Tuku mampu menjaga konsistensi rasa kopi di seluruh gerai satelitnya di Jabodetabek, Surabaya, hingga Malang.</p>

<h2>Dampak & Hasil Nyata</h2>
<p>Kini Toko Kopi Tuku telah berkembang menjadi puluhan cabang dengan penjualan mencapai <strong>lebih dari 50.000 gelas per hari</strong>, menyerap hasil panen ratusan petani kopi di Aceh, Jawa, dan Flores, serta menjadi ikon nasional industri F&B Indonesia.</p>

<h2>Pelajaran untuk Pelaku UMKM</h2>
<ul>
  <li><strong>Fokus Menyelesaikan Kebutuhan Nyata:</strong> Buat produk yang dibutuhkan konsumen harian dengan harga masuk akal.</li>
  <li><strong>Manfaatkan Ekosistem Pengiriman Digital:</strong> Mudahkan pembeli mendapatkan produk Anda tanpa harus datang secara fisik.</li>
  <li><strong>Jaga Otentisitas dan Hubungan Komunitas:</strong> Pelanggan setia yang puas adalah duta pemasaran paling efektif.</li>
</ul>`,
    },
  },
  {
    id: 'noore-sport-hijab-internasional',
    category: 'Fashion & Retail',
    categoryColor: 'bg-rose-50 text-rose-800 border-rose-200',
    title: 'Noore Sport: Baju Olahraga Muslimah Mendunia',
    subtitle: 'Menjawab Kebutuhan Activewear Hijab Modern Melalui E-Commerce dan Kanal Digital Global',
    readTime: '4 Menit Baca',
    date: '2026',
    sourceName: 'Kemenkop UKM & Riset Modest Fashion',
    sourceUrl: 'https://kemenkopukm.go.id',
    keyStat: '300%',
    keyStatLabel: 'Lonjakan Ekspor Digital',
    metaDescription: 'Temukan bagaimana Noore Sportswear berhasil membawa activewear muslimah Indonesia ke kancah internasional lewat e-commerce dan website resmi!',
    targetKeyword: 'activewear hijab muslimah',
    secondaryKeywords: ['ekspor modest fashion', 'digitalisasi fashion lokal', 'e-commerce olahraga'],
    summary:
      'Melihat minimnya pakaian olahraga yang nyaman dan tertutup bagi wanita berhijab, Noore Sportswear hadir dengan inovasi bahan berteknologi UV Guard, menembus pasar internasional berkat website mandiri dan digital advertising.',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    status: 'queued',
    content: {
      bodyText: `<h2>Tantangan Awal: Keterbatasan Pakaian Olahraga Muslimah</h2>
<p>Bagi wanita berhijab di Indonesia, mencari pakaian olahraga yang nyaman, longgar, menyerap keringat, namun tetap modis dahulunya merupakan tantangan besar. Sebagian besar pakaian olahraga global berpotongan ketat dan terbuka.</p>
<p>Peluang inilah yang ditangkap oleh <strong>Noore Sportswear</strong> di Bandung pada tahun 2017 untuk memproduksi pakaian olahraga khusus muslimah (*modest activewear*).</p>

<h2>Strategi Digitalisasi & Penetrasi Pasar</h2>
<h3>1. Riset Bahan Khusus & Konten Edukasi Kesehatan</h3>
<p>Noore mengembangkan kain berteknologi *UV Guard* dan *Thermal Tech*. Di Instagram dan TikTok, mereka secara konsisten mengedukasi masyarakat mengenai gaya hidup sehat bagi muslimah aktif.</p>
<h3>2. Website Mandiri dengan Pengiriman Mancanegara</h3>
<p>Dengan membangun website e-commerce mandiri lengkap dengan kalkulator ongkos kirim internasional otomatis, Noore mampu melayani pembeli dari Malaysia, Singapura, Timur Tengah, hingga Eropa tanpa hambatan.</p>

<h2>Pencapaian Positif</h2>
<p>Noore dipercaya menjadi sponsor resmi kontingen Indonesia pada ajang Asian Games, serta mencatatkan kenaikan ekspor digital hingga <strong>300%</strong> melalui transaksi langsung di kanal web resmi mereka.</p>

<h2>Pelajaran bagi Pelaku Usaha</h2>
<ul>
  <li><strong>Temukan Ceruk Pasar (Niche Market) yang Belum Terlayani:</strong> Menjadi yang pertama dan terbaik di ceruk spesifik sering kali jauh lebih menguntungkan.</li>
  <li><strong>Investasi pada Kualitas Konten Digital:</strong> Tunjukkan foto dan video produk saat dipakai beraktivitas secara dinamis.</li>
  <li><strong>Buka Akses Pembayaran Internasional:</strong> Pastikan website Anda siap menerima transaksi lintas negara.</li>
</ul>`,
    },
  },
  {
    id: 'madu-uray-dari-hutan-ke-pasar-modern',
    category: 'Kuliner & Makanan Kemasan',
    categoryColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    title: 'Madu Uray: Madu Hutan Liar Kuasai Pasar Digital',
    subtitle: 'Membangun Kepercayaan Konsumen Terhadap Kemurnian Madu Nusantara Lewat Edukasi Online',
    readTime: '5 Menit Baca',
    date: '2026',
    sourceName: 'Riset Agribisnis & UMKM Mandiri',
    sourceUrl: 'https://kompas.com',
    keyStat: '+450%',
    keyStatLabel: 'Pertumbuhan Transaksi Daring',
    metaDescription: 'Kisah Madu Uray memenangkan kepercayaan konsumen Indonesia terhadap kemurnian madu hutan liar lewat digital branding dan sertifikasi transparan.',
    targetKeyword: 'bisnis madu hutan murni',
    secondaryKeywords: ['digital branding agribisnis', 'transparansi produk alami', 'penjualan madu online'],
    summary:
      'Di tengah maraknya madu oplosan di pasaran, Madu Uray membangun transparansi proses panen madu hutan liar lewat video digital dan verifikasi lab terbuka, melipatgandakan omzet daring hingga 450%.',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80',
    status: 'queued',
    content: {
      bodyText: `<h2>Tantangan: Keraguan Konsumen Terhadap Keaslian Madu</h2>
<p>Pasar madu di Indonesia selama bertahun-tahun diwarnai keraguan konsumen akibat maraknya produk madu sirup dan madu sintetis. Madu Uray yang memanen madu lebah hutan liar (*Apis dorsata*) menghadapi tantangan bagaimana membuktikan kemurnian 100% tanpa bahan pengawet kepada konsumen modern.</p>

<h2>Strategi Pemasaran Digital Berbasis Bukti (Evidence-Based)</h2>
<h3>1. Transparansi Panen dan Uji Laboratorium Terbuka</h3>
<p>Madu Uray memanfaatkan kanal digital untuk mendokumentasikan proses pemanjatan pohon sialang di hutan Sumatera oleh perajin lokal secara lestari. Hasil uji laboratorium berkala dipajang secara terbuka di website resmi mereka.</p>
<h3>2. Desain Kemasan Ikonik & Marketplace Mall</h3>
<p>Mengubah citra madu curah tradisional menjadi kemasan botol kaca dan sachet higienis berstandar modern, memudahkan distribusi melalui official store e-commerce.</p>

<h2>Hasil dan Dampak Bisnis</h2>
<p>Penjualan daring Madu Uray melonjak lebih dari <strong>450%</strong>, produknya kini tersedia di ribuan supermarket modern terkemuka di seluruh Indonesia, serta memberdayakan ratusan pemburu madu tradisional di pedalaman Sumatera.</p>

<h2>Pelajaran bagi Pelaku Usaha Alami</h2>
<ul>
  <li><strong>Kejujuran dan Transparansi adalah Mata Uang Digital:</strong> Tunjukkan proses produksi apa adanya untuk menumbuhkan keyakinan pembeli.</li>
  <li><strong>Modernisasi Kemasan:</strong> Produk tradisional dengan kemasan modern dapat dijual dengan nilai tambah berlipat ganda.</li>
</ul>`,
    },
  },
];

// Helper to compute next scheduled time based on 2 daily slots: 08:00 WIB and 17:00 WIB
export function calculateNextScheduledSlot(dailySlots: string[] = ['08:00', '17:00']): { nextIso: string; slotName: string } {
  const now = new Date();
  // WIB is UTC+7
  const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const currentHour = wibTime.getUTCHours();
  const currentMinute = wibTime.getUTCMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;

  for (const slot of dailySlots) {
    const [h, m] = slot.split(':').map((n) => parseInt(n, 10));
    const slotTotalMinutes = h * 60 + m;

    if (slotTotalMinutes > currentTotalMinutes) {
      // Today at this slot
      const targetWib = new Date(wibTime);
      targetWib.setUTCHours(h, m, 0, 0);
      const targetUtc = new Date(targetWib.getTime() - 7 * 60 * 60 * 1000);
      return { nextIso: targetUtc.toISOString(), slotName: `${slot} WIB (Hari ini)` };
    }
  }

  // Next day at first slot
  const [firstH, firstM] = dailySlots[0].split(':').map((n) => parseInt(n, 10));
  const targetWibNextDay = new Date(wibTime);
  targetWibNextDay.setUTCDate(targetWibNextDay.getUTCDate() + 1);
  targetWibNextDay.setUTCHours(firstH, firstM, 0, 0);
  const targetUtcNextDay = new Date(targetWibNextDay.getTime() - 7 * 60 * 60 * 1000);

  return { nextIso: targetUtcNextDay.toISOString(), slotName: `${dailySlots[0]} WIB (Besok)` };
}

export function getSchedulerConfig(): SchedulerConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading scheduler config:', e);
  }

  const { nextIso } = calculateNextScheduledSlot(['08:00', '17:00']);
  const defaultConfig: SchedulerConfig = {
    enabled: true,
    postsPerDay: 2,
    dailySlots: ['08:00', '17:00'],
    timezone: 'Asia/Jakarta (WIB)',
    autoSendNewsletter: true,
    lastPostedAt: new Date().toISOString(),
    nextPostScheduledAt: nextIso,
    totalPublishedCount: 3,
  };
  saveSchedulerConfig(defaultConfig);
  return defaultConfig;
}

export function saveSchedulerConfig(config: SchedulerConfig): void {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving scheduler config:', e);
  }
}

export function getArticleQueue(): QueuedArticle[] {
  try {
    if (fs.existsSync(QUEUE_FILE)) {
      const data = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.error('Error reading article queue:', e);
  }

  // Seed with initial queue
  saveArticleQueue(INITIAL_QUEUE);
  return INITIAL_QUEUE;
}

export function saveArticleQueue(queue: QueuedArticle[]): void {
  try {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving article queue:', e);
  }
}

export function getPublishedArticles(): QueuedArticle[] {
  try {
    if (fs.existsSync(PUBLISHED_FILE)) {
      return JSON.parse(fs.readFileSync(PUBLISHED_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading published articles:', e);
  }
  return [];
}

export function savePublishedArticles(articles: QueuedArticle[]): void {
  try {
    fs.writeFileSync(PUBLISHED_FILE, JSON.stringify(articles, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving published articles:', e);
  }
}

/**
 * Execute automatic or manual publishing of next queued article
 */
export async function executeAutoPublishNext(
  onBroadcastNewsletter?: (article: QueuedArticle) => Promise<any>
): Promise<{ success: boolean; message: string; publishedArticle?: QueuedArticle }> {
  const queue = getArticleQueue();
  const unPublished = queue.filter((a) => a.status === 'queued');

  if (unPublished.length === 0) {
    return {
      success: false,
      message: 'Antrean artikel kosong. Silakan tambahkan draf artikel baru ke dalam antrean auto-post.',
    };
  }

  const nextArticle = unPublished[0];
  nextArticle.status = 'published';
  nextArticle.publishedAt = new Date().toISOString();

  // Update queue
  saveArticleQueue(queue);

  // Append to published storage
  const publishedList = getPublishedArticles();
  const updatedPublished = [nextArticle, ...publishedList.filter((a) => a.id !== nextArticle.id)];
  savePublishedArticles(updatedPublished);

  // Update scheduler config
  const config = getSchedulerConfig();
  const { nextIso, slotName } = calculateNextScheduledSlot(config.dailySlots);
  config.lastPostedAt = new Date().toISOString();
  config.nextPostScheduledAt = nextIso;
  config.totalPublishedCount += 1;
  saveSchedulerConfig(config);

  // Trigger newsletter broadcast if enabled
  if (config.autoSendNewsletter && onBroadcastNewsletter) {
    try {
      await onBroadcastNewsletter(nextArticle);
    } catch (err) {
      console.error('Auto broadcast error on scheduled post:', err);
    }
  }

  return {
    success: true,
    message: `Artikel "${nextArticle.title}" berhasil dipublikasikan otomatis! Jadwal auto-post berikutnya: ${slotName}`,
    publishedArticle: nextArticle,
  };
}
