export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  businessName: string;
  city: string;
  avatarText: string;
  rating: number;
  content: string;
  metric: string;
  date: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'testi-1',
    name: 'Hendra Wijaya',
    role: 'Founder & Owner',
    businessName: 'Sambal Cumi Mak Nyoss',
    city: 'Sidoarjo',
    avatarText: 'HW',
    rating: 5,
    content: 'Awalnya sempat ragu karena biayanya cuma Rp 499 ribu, takut hasilnya murahan atau asal-asalan. Ternyata besok sorenya landing page saya sudah online dengan domain aktif! Desainnya bersih banget, foto sambal jadi kelihatan mahal, dan pembeli dari luar pulau langsung percaya transfer tanpa banyak tanya lagi.',
    metric: 'Omzet naik 165% dalam 1 bulan',
    date: 'Oktober 2026',
  },
  {
    id: 'testi-2',
    name: 'Siti Fatimah',
    role: 'Owner & Desainer',
    businessName: 'Zahira Modest Wear',
    city: 'Bandung',
    avatarText: 'SF',
    rating: 5,
    content: 'Beda banget sama template pasaran yang kaku. Tim webkilat tanya dulu target audiens dan bahan gamis saya. Pas jadi, copywriting-nya bener-bener menyentuh emosi para bunda. Pas saya pasang link landing page di bio Instagram dan iklan TikTok, chat masuk ke WhatsApp admin langsung banjir!',
    metric: 'Konversi iklan naik dari 1.2% jadi 4.8%',
    date: 'September 2026',
  },
  {
    id: 'testi-3',
    name: 'Agus Prasetyo',
    role: 'Pengelola Layanan',
    businessName: 'Sejuk Mandiri Teknik',
    city: 'Jakarta Selatan',
    avatarText: 'AP',
    rating: 5,
    content: 'Untuk jasa service AC, kepercayaan adalah nomor 1. Dulu orang takut kena tipu teknisi nakal. Setelah dibuatkan landing page resmi dengan daftar harga transparan dan garansi 30 hari, telepon orderan kantor dan perumahan mengalir tiap hari. Modal Rp 499rb balik modal di hari pertama!',
    metric: 'Order harian tembus 20+ unit AC',
    date: 'Oktober 2026',
  },
  {
    id: 'testi-4',
    name: 'Dr. Nadia Kusuma',
    role: 'Co-Founder',
    businessName: 'NaturaGlow Herbal Care',
    city: 'Yogyakarta',
    avatarText: 'NK',
    rating: 5,
    content: 'Prosesnya beneran 1 hari kilat. Formulir pemesanannya sangat detail, jadi tim webkilat langsung paham kebutuhan brand kami tanpa bolak-balik revisi rumit. Tombol WhatsApp-nya langsung terhubung ke CS dengan format order otomatis yang rapi. Sangat rekomen untuk UMKM yang butuh gerak cepat.',
    metric: 'Jangkau reseller di 18 kota baru',
    date: 'Agustus 2026',
  },
];
