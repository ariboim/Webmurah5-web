import React, { useState, useEffect } from 'react';
import {
  OrderFormData,
  ADMIN_WA_NUMBER,
  ADMIN_WA_DISPLAY,
  generateWhatsAppUrl,
  formatOrderToWhatsApp,
} from '../types/order';
import { trackOrderSubmission } from '../utils/analytics';
import {
  Send,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  FileText,
  Lock,
  Award,
  Zap,
  CheckCircle2,
  Clock,
  Globe,
  Search,
  Loader2,
  ArrowDown,
  ArrowRight,
  RefreshCw,
  Crown,
  Star,
  ExternalLink,
  HelpCircle,
  CreditCard,
  Calendar,
} from 'lucide-react';

export interface DomainCheckItem {
  domain: string;
  extension: string;
  isAvailable: boolean;
  isFreeWithPromo: boolean;
  badge: string;
  message: string;
}

const INITIAL_FORM: OrderFormData = {
  namaSalesKonsultan: '',
  pilihanPaket: 'umkm',
  namaLengkap: '',
  nomorWa: '',
  email: '',
  namaBisnis: '',
  domainPilihan: '',
  alamatBisnis: '',
  mediaSosial: '',
  namaProduk: '',
  deskripsiProduk: '',
  targetAudiens: '',
  hargaPenawaran: '',
  tujuanLandingPage: ['Penjualan langsung produk fisik / digital'],
  tujuanLainnya: '',
  ctaDiinginkan: ['Tombol langsung ke WhatsApp (chat pemesanan)'],
  ctaLainnya: '',
};

const SAMPLE_DEMO_DATA: OrderFormData = {
  namaSalesKonsultan: 'Rian (Konsultan Webkilat)',
  pilihanPaket: 'umkm',
  namaLengkap: 'Budi Santoso',
  nomorWa: '081234567890',
  email: 'budi.santoso@gmail.com',
  namaBisnis: 'Dapur Nusantara Frozen Food',
  domainPilihan: 'dapurnusantara.my.id',
  alamatBisnis: 'Jl. Rungkut Asri Timur No. 45, Surabaya, Jawa Timur',
  mediaSosial: '@dapurnusantara.id (Instagram) / TikTok: @dapurnusantara',
  namaProduk: 'Paket Frozen Sambal Cumi & Rendang Daging Sapi Kemasan Vakum',
  deskripsiProduk: 'Makanan beku siap saji dengan rempah asli tanpa bahan pengawet. Tahan 6 bulan beku, higienis, sertifikat P-IRT & Halal MUI.',
  targetAudiens: 'Ibu rumah tangga muda & pekerja kantoran usia 24-45 tahun yang sibuk namun ingin masakan lezat cepat saji.',
  hargaPenawaran: 'Harga normal Rp 65.000 / pack. Promo Hari Ini: Beli 3 Cuma Rp 150.000 + Subsidi Ongkir Rp 10.000 se-Pulau Jawa.',
  tujuanLandingPage: [
    'Penjualan langsung produk fisik / digital',
    'Pengumpulan kontak / lead (Nama, Email, WhatsApp)',
  ],
  tujuanLainnya: '',
  ctaDiinginkan: [
    'Tombol langsung ke WhatsApp (chat pemesanan)',
  ],
  ctaLainnya: '',
};

export const OrderFormSection: React.FC = () => {
  const [formData, setFormData] = useState<OrderFormData>(() => {
    try {
      const saved = localStorage.getItem('webkilat_saved_form');
      return saved ? JSON.parse(saved) : INITIAL_FORM;
    } catch {
      return INITIAL_FORM;
    }
  });

  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Pilihan Paket: 'umkm' vs 'elite'
  const [selectedPackage, setSelectedPackage] = useState<'umkm' | 'elite'>(() => {
    try {
      const stored = sessionStorage.getItem('selected_package');
      if (stored === 'elite' || stored === 'umkm') return stored;
      const saved = localStorage.getItem('webkilat_saved_form');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pilihanPaket === 'elite' || parsed.pilihanPaket === 'umkm') return parsed.pilihanPaket;
      }
      return 'umkm';
    } catch {
      return 'umkm';
    }
  });

  const handleSelectPackageMode = (pkg: 'umkm' | 'elite') => {
    setSelectedPackage(pkg);
    setFormData((prev) => ({ ...prev, pilihanPaket: pkg }));
    try {
      sessionStorage.setItem('selected_package', pkg);
    } catch {}
  };

  // Unified Domain Checker states
  const [domainSearchInput, setDomainSearchInput] = useState('');
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [hasCheckedDomain, setHasCheckedDomain] = useState(false);
  const [domainResults, setDomainResults] = useState<DomainCheckItem[]>([]);
  const [isSearchingAgain, setIsSearchingAgain] = useState(false);
  const [orderInstruction, setOrderInstruction] = useState<string | null>(null);

  // Promo 50% state
  const [isPromoActive, setIsPromoActive] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('promo_50_active') === 'true';
    } catch {
      return false;
    }
  });

  // Sync with global events / session storage
  useEffect(() => {
    const handleDomainSelected = (e: CustomEvent<string>) => {
      if (e.detail) {
        setFormData((prev) => ({
          ...prev,
          domainPilihan: e.detail,
          namaBisnis: prev.namaBisnis || e.detail.split('.')[0],
        }));
        setOrderInstruction(`Domain "${e.detail}" telah dipilih! Silakan lanjutkan melengkapi formulir di bawah ini.`);
      }
    };

    const handlePromoClaimed = () => {
      setIsPromoActive(true);
      setFormData((prev) => ({ ...prev, isPromoActive: true }));
      try {
        sessionStorage.setItem('promo_50_active', 'true');
      } catch {}
      setOrderInstruction(
        '🎉 SELAMAT! PROMO DISKON 50% AKTIF. Khusus Paket UMKM otomatis menjadi Rp 249.500 (Hemat Rp 249.500).'
      );
    };

    const handlePackageSelected = (e: CustomEvent<'umkm' | 'elite'>) => {
      if (e.detail && (e.detail === 'umkm' || e.detail === 'elite')) {
        setSelectedPackage(e.detail);
        setFormData((prev) => ({ ...prev, pilihanPaket: e.detail }));
      }
    };

    try {
      const stored = sessionStorage.getItem('selected_domain');
      if (stored) {
        setFormData((prev) => ({
          ...prev,
          domainPilihan: stored,
        }));
        setOrderInstruction(`Domain "${stored}" telah dipilih! Silakan lanjutkan melengkapi formulir di bawah ini.`);
      }

      if (sessionStorage.getItem('promo_50_active') === 'true') {
        setIsPromoActive(true);
      }

      const storedPkg = sessionStorage.getItem('selected_package');
      if (storedPkg === 'elite' || storedPkg === 'umkm') {
        setSelectedPackage(storedPkg);
        setFormData((prev) => ({ ...prev, pilihanPaket: storedPkg }));
      }
    } catch {}

    window.addEventListener('domain-selected' as any, handleDomainSelected);
    window.addEventListener('promo-50-claimed' as any, handlePromoClaimed);
    window.addEventListener('package-selected' as any, handlePackageSelected);
    return () => {
      window.removeEventListener('domain-selected' as any, handleDomainSelected);
      window.removeEventListener('promo-50-claimed' as any, handlePromoClaimed);
      window.removeEventListener('package-selected' as any, handlePackageSelected);
    };
  }, []);

  // Persist form to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('webkilat_saved_form', JSON.stringify(formData));
    } catch {}
  }, [formData]);

  // Perform domain availability check
  const checkDomainAvailability = async (queryDomain: string) => {
    const trimmed = queryDomain.trim().toLowerCase();
    if (!trimmed) return;

    setIsCheckingDomain(true);
    setHasCheckedDomain(true);
    setOrderInstruction(null);

    try {
      const response = await fetch(`/api/check-domain?domain=${encodeURIComponent(trimmed)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.results && Array.isArray(data.results)) {
          setDomainResults(data.results);
          setIsCheckingDomain(false);
          return;
        }
      }
    } catch {
      // Fallback to client DoH
    }

    try {
      let clean = trimmed
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '')
        .replace(/\/.*$/, '')
        .replace(/[^a-z0-9.-]/g, '');

      const extensions = ['.my.id', '.biz.id', '.com', '.id'];
      let baseName = clean;
      let specifiedExt = '';

      for (const ext of extensions) {
        if (clean.endsWith(ext)) {
          baseName = clean.slice(0, -ext.length);
          specifiedExt = ext;
          break;
        }
      }

      if (baseName.includes('.')) {
        baseName = baseName.split('.')[0];
      }

      let extList = [...extensions];
      if (specifiedExt) {
        extList = [specifiedExt, ...extensions.filter((e) => e !== specifiedExt)];
      }

      const clientResults: DomainCheckItem[] = await Promise.all(
        extList.map(async (ext) => {
          const fullDomain = `${baseName}${ext}`;
          let isAvailable = false;
          try {
            const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(fullDomain)}&type=NS`, {
              headers: { Accept: 'application/dns-json' },
            });
            if (res.ok) {
              const data = await res.json();
              if (data.Status === 3) {
                isAvailable = true;
              } else if (
                data.Status === 0 &&
                (!data.Answer || data.Answer.length === 0) &&
                (!data.Authority || data.Authority.length === 0)
              ) {
                isAvailable = true;
              } else {
                isAvailable = false;
              }
            } else {
              isAvailable = true;
            }
          } catch {
            isAvailable = true;
          }

          const isFree = ext === '.my.id' || ext === '.biz.id';
          return {
            domain: fullDomain,
            extension: ext,
            isAvailable,
            isFreeWithPromo: isFree,
            badge: isFree ? 'Gratis 1 Tahun Promo' : 'Ekstensi Populer',
            message: isAvailable
              ? `${fullDomain} TERSEDIA! Siap digunakan untuk landing page Anda.`
              : `${fullDomain} sudah dipakai. Coba nama lain ya.`,
          };
        })
      );

      setDomainResults(clientResults);
    } catch {
      setDomainResults([
        {
          domain: `${trimmed}.my.id`,
          extension: '.my.id',
          isAvailable: true,
          isFreeWithPromo: true,
          badge: 'Gratis 1 Tahun Promo',
          message: `${trimmed}.my.id TERSEDIA! Siap digunakan untuk landing page Anda.`,
        },
      ]);
    } finally {
      setIsCheckingDomain(false);
    }
  };

  const handleDomainSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkDomainAvailability(domainSearchInput);
  };

  // Handler when user chooses an available domain
  const handleSelectAvailableDomain = (domain: string) => {
    const cleanBase = domain.split('.')[0];
    const autoBizName = cleanBase ? cleanBase.charAt(0).toUpperCase() + cleanBase.slice(1) : '';

    setFormData((prev) => ({
      ...prev,
      domainPilihan: domain,
      namaBisnis: prev.namaBisnis || autoBizName,
    }));

    try {
      sessionStorage.setItem('selected_domain', domain);
    } catch {}

    setIsSearchingAgain(false);
    setOrderInstruction(
      `🎉 Domain "${domain}" TERSEDIA dan telah otomatis terpasang di formulir order! Silakan lanjutkan melengkapi Data Klien & Rincian Produk di bawah ini.`
    );

    // Smoothly scroll and focus to Data Klien
    setTimeout(() => {
      const klienSection = document.getElementById('section-data-klien');
      if (klienSection) {
        klienSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      const namaInput = document.querySelector('input[name="namaLengkap"]') as HTMLInputElement;
      if (namaInput) {
        namaInput.focus();
      }
    }, 250);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCheckboxToggle = (
    field: 'tujuanLandingPage' | 'ctaDiinginkan',
    item: string
  ) => {
    setFormData((prev) => {
      const currentList = prev[field];
      const exists = currentList.includes(item);
      const updated = exists
        ? currentList.filter((x) => x !== item)
        : [...currentList, item];
      return { ...prev, [field]: updated };
    });
  };

  const fillSampleData = () => {
    setFormData(SAMPLE_DEMO_DATA);
    setOrderInstruction('Data demo telah dimasukkan ke formulir! Anda dapat meninjau dan mengirimkannya via WhatsApp.');
    setErrors({});
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setSubmittedSuccess(false);
    setAgreedTerms(true);
    setOrderInstruction(null);
    setHasCheckedDomain(false);
    setDomainResults([]);
    setIsSearchingAgain(false);
    try {
      localStorage.removeItem('webkilat_saved_form');
      sessionStorage.removeItem('selected_domain');
    } catch {}
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.namaLengkap.trim()) {
      newErrors.namaLengkap = 'Nama Lengkap / PIC wajib diisi';
    }
    if (!formData.nomorWa.trim()) {
      newErrors.nomorWa = 'Nomor WhatsApp aktif wajib diisi';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    }
    if (!formData.namaBisnis.trim()) {
      newErrors.namaBisnis = 'Nama Bisnis / Brand wajib diisi';
    }
    if (!formData.alamatBisnis.trim()) {
      newErrors.alamatBisnis = 'Alamat usaha wajib diisi';
    }
    if (!formData.namaProduk.trim()) {
      newErrors.namaProduk = 'Nama Produk / Layanan wajib diisi';
    }
    if (!formData.deskripsiProduk.trim()) {
      newErrors.deskripsiProduk = 'Deskripsi produk wajib diisi';
    }
    if (!agreedTerms) {
      newErrors.agreedTerms = 'Anda wajib menyetujui syarat dan ketentuan promo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSubmittedSuccess(true);
    const finalPrice = isPromoActive ? 249000 : 499000;
    trackOrderSubmission(formData.namaBisnis, finalPrice);
    const waUrl = generateWhatsAppUrl(formData, isPromoActive);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = () => {
    const text = formatOrderToWhatsApp(formData, isPromoActive);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="form-order" className="scroll-mt-16">
      <div id="formulir-order" className="py-16 sm:py-20 bg-slate-50/50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Header matching user brief */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-black uppercase tracking-wider border border-sky-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Pengerjaan Kilat 24 Jam &bull; Rp 499.000 All-In &bull; Bayar Setelah Jadi</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight text-balance">
            Formulir Pemesanan Jasa Pembuatan Landing Page
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Mulai dengan memeriksa domain bisnis Anda pada kotak pencarian di bawah, lalu lengkapi rincian produk Anda untuk langsung diproses tim desainer kami.
          </p>

          {/* Quick Helper Tools */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={fillSampleData}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Contoh Isi Otomatis (Demo)</span>
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Formulir</span>
            </button>
          </div>
        </div>

        {/* Global Order Instruction Banner (When domain selected or demo loaded) */}
        {orderInstruction && (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-2xl border-2 border-emerald-400 text-emerald-950 shadow-md animate-fade-in flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="space-y-1">
              <div className="font-black text-xs sm:text-sm uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Instruksi Kelanjutan Pengisian:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                {orderInstruction}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN FORM CONTAINER (UNIFIED DOMAIN CHECKER + CLIENT & PRODUCT DETAILS) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-10 space-y-10">

          {/* ========================================================================= */}
          {/* STEP 0: PILIH PAKET LAYANAN (PAKET UMKM vs PAKET ELITE)                   */}
          {/* ========================================================================= */}
          <div id="pilih-paket-section" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                  ★
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    Pilih Paket Layanan Website
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Tentukan skala website yang Anda butuhkan (bisa diubah kapan saja)
                  </p>
                </div>
              </div>
              <span className="inline-block text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 w-fit">
                Paket Terpilih:{' '}
                <strong className="text-slate-900 uppercase">
                  {selectedPackage === 'elite'
                    ? 'Paket Elite (Rp 3.000.000)'
                    : isPromoActive
                    ? 'Paket UMKM (Diskon Rp 249.500)'
                    : 'Paket UMKM (Rp 499.000)'}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Paket UMKM */}
              <div
                onClick={() => handleSelectPackageMode('umkm')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedPackage === 'umkm'
                    ? 'border-sky-500 bg-sky-50/50 shadow-md ring-2 ring-sky-300/60'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                {selectedPackage === 'umkm' && (
                  <span className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                      1 Halaman Kilat 24 Jam
                    </span>
                    {isPromoActive && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 animate-pulse">
                        Diskon 50% Banner
                      </span>
                    )}
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900">
                    PAKET UMKM
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Landing page fokus konversi penjualan kilat 24 jam. Termasuk free domain (.my.id/.biz.id), cloud hosting 1 tahun, copywriting, &amp; tombol WA.
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-200/80 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Total Investasi:</span>
                  <div className="text-right">
                    {isPromoActive ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-slate-400 line-through">Rp 499.000</span>
                        <span className="text-xl font-black text-emerald-700">Rp 249.500</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-slate-400 line-through">Rp 1.800.000</span>
                        <span className="text-xl font-black text-sky-600">Rp 499.000</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Option 2: Paket Elite */}
              <div
                onClick={() => handleSelectPackageMode('elite')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedPackage === 'elite'
                    ? 'border-amber-500 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white shadow-xl ring-2 ring-amber-400/60'
                    : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50/60'
                }`}
              >
                {selectedPackage === 'elite' ? (
                  <span className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs font-black">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                ) : (
                  <span className="absolute top-3.5 right-3.5 text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    Recommended
                  </span>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      selectedPackage === 'elite'
                        ? 'text-amber-300 bg-amber-400/20 border border-amber-400/40'
                        : 'text-amber-800 bg-amber-100'
                    }`}>
                      Multi-Halaman &bull; Sampai 7 Hal
                    </span>
                    <span className={`text-[10px] font-bold ${
                      selectedPackage === 'elite' ? 'text-amber-300' : 'text-slate-500'
                    }`}>
                      Harga Net
                    </span>
                  </div>
                  <h4 className={`text-base sm:text-lg font-black ${
                    selectedPackage === 'elite' ? 'text-white' : 'text-slate-900'
                  }`}>
                    PAKET ELITE (Web Custom)
                  </h4>
                  <p className={`text-xs leading-relaxed font-medium ${
                    selectedPackage === 'elite' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Website custom korporat sampai 7 halaman, desain eksklusif responsif, optimasi PageSpeed tinggi, form kontak &amp; WA, dasar SEO on-page, dan gratis revisi 2x.
                  </p>
                  
                  {/* Terms badge highlight */}
                  <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      selectedPackage === 'elite'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      Wajib DP 50% (Rp 1.5 Jt)
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      selectedPackage === 'elite'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      Pengerjaan: 5 - 7 Hari Kerja
                    </span>
                  </div>

                  {/* Education link */}
                  <div className="pt-1">
                    <a
                      href="https://share.google/87klge8DoF7cqlByM"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`text-[11px] font-bold hover:underline inline-flex items-center gap-1 ${
                        selectedPackage === 'elite' ? 'text-amber-300' : 'text-blue-600'
                      }`}
                    >
                      <span>Apa itu Web Custom? Pelajari disini</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className={`pt-3 mt-3 border-t flex items-baseline justify-between ${
                  selectedPackage === 'elite' ? 'border-slate-800' : 'border-slate-200/80'
                }`}>
                  <span className={`text-xs font-semibold ${
                    selectedPackage === 'elite' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Harga Tetap (Net):
                  </span>
                  <div className="text-right">
                    <span className={`text-xl font-black ${
                      selectedPackage === 'elite' ? 'text-amber-400' : 'text-slate-900'
                    }`}>
                      Rp 3.000.000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 1: UNIFIED BOX CEK KETERSEDIAAN DOMAIN (MATCHING USER SCREENSHOT)     */}
          {/* ========================================================================= */}
          <div id="cek-domain" className="space-y-4 pt-1">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
              <span className="w-8 h-8 rounded-xl bg-sky-500 text-white text-xs font-black flex items-center justify-center shadow-xs">
                1
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  1. Cek Ketersediaan Nama Domain Website
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Gratis domain <strong>.my.id</strong> dan <strong>.biz.id</strong> 1 tahun penuh khusus promo Rp 499rb!
                </p>
              </div>
            </div>

            {/* If domain is already selected and user is not currently re-searching */}
            {formData.domainPilihan && !isSearchingAgain ? (
              <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-50 to-teal-50/70 rounded-2xl border-2 border-emerald-400 text-emerald-950 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 block">
                        Domain Terpilih &bull; Siap Didaftarkan
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <span>{formData.domainPilihan}</span>
                        <span className="text-[10px] bg-emerald-600 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Tersedia
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800 font-medium mt-0.5">
                        Gratis 1 Tahun Promo All-In Rp 499.000 (Langsung terhubung ke formulir pemesanan).
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchingAgain(true);
                      setDomainSearchInput(formData.domainPilihan ? formData.domainPilihan.split('.')[0] : '');
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 shadow-2xs transition-all cursor-pointer shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Cek / Ganti Domain Lain</span>
                  </button>
                </div>

                {/* Instruction to proceed to next step */}
                <div className="pt-3 border-t border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900">
                  <div className="flex items-center gap-2 font-semibold">
                    <ArrowDown className="w-4 h-4 text-emerald-700 animate-bounce" />
                    <span>Domain sudah tersimpan! Silakan lanjutkan melengkapi <strong>Data Klien (Langkah 2)</strong> di bawah.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const klien = document.getElementById('section-data-klien');
                      if (klien) klien.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lompat ke Data Klien &darr;</span>
                  </button>
                </div>
              </div>
            ) : (
              /* The Box matching screenshot with light blue border, input, SEARCH button, and Contoh Coba pills */
              <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-sky-100 shadow-md space-y-4">
                <form onSubmit={handleDomainSearchSubmit} className="space-y-4">
                  {/* Large Input with placeholder "namabisnis.com" matching screenshot */}
                  <div className="relative">
                    <input
                      type="text"
                      value={domainSearchInput}
                      onChange={(e) => setDomainSearchInput(e.target.value)}
                      placeholder="namabisnis.com"
                      className="w-full text-base sm:text-xl font-bold text-slate-800 placeholder-slate-400 px-5 py-3.5 sm:py-4 rounded-2xl bg-white border-2 border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all shadow-inner"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hidden sm:inline">
                      .my.id / .biz.id / .com
                    </span>
                  </div>

                  {/* Bright Sky-Blue / Cyan SEARCH Button matching user's screenshot */}
                  <button
                    type="submit"
                    disabled={isCheckingDomain || !domainSearchInput.trim()}
                    className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-sky-400 hover:bg-sky-500 active:scale-99 text-white font-black text-base sm:text-lg tracking-wider uppercase transition-all shadow-md hover:shadow-sky-400/30 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isCheckingDomain ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>MEMERIKSA KETERSEDIAAN...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 stroke-[2.5]" />
                        <span>SEARCH</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Example pills matching screenshot: kedaiayam.my.id, hijabcantik.my.id, sejukac.my.id, berkahshop.my.id */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Contoh Coba:</span>
                  {[
                    'kedaiayam.my.id',
                    'hijabcantik.my.id',
                    'sejukac.my.id',
                    'berkahshop.my.id',
                  ].map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => {
                        setDomainSearchInput(sample);
                        checkDomainAvailability(sample);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-semibold transition-colors cursor-pointer text-xs"
                    >
                      {sample}
                    </button>
                  ))}
                </div>

                {/* Cancel search if already had a domain */}
                {formData.domainPilihan && isSearchingAgain && (
                  <div className="pt-2 text-right">
                    <button
                      type="button"
                      onClick={() => setIsSearchingAgain(false)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                    >
                      Batal &bull; Tetap gunakan {formData.domainPilihan}
                    </button>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* DOMAIN CHECK RESULTS AREA WITH CLEAR INSTRUCTIONS TO CONTINUE ORDER       */}
                {/* ========================================================================= */}
                {hasCheckedDomain && !isCheckingDomain && (
                  <div className="pt-4 space-y-3 border-t border-slate-100 animate-fade-in">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500 px-1">
                      <span>Hasil Pengecekan Ketersediaan:</span>
                      <span>Promo All-In Rp 499rb</span>
                    </div>

                    {domainResults.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          item.isAvailable
                            ? 'bg-emerald-50/90 border-2 border-emerald-400 shadow-xs'
                            : 'bg-rose-50/70 border border-rose-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Domain Details */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {item.isAvailable ? (
                                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                                  <span className="text-xs font-black leading-none">✕</span>
                                </div>
                              )}

                              <span
                                className={`text-base sm:text-lg font-black tracking-tight ${
                                  item.isAvailable ? 'text-emerald-950' : 'text-rose-900'
                                }`}
                              >
                                {item.domain}
                              </span>

                              {item.isFreeWithPromo && (
                                <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Gratis 1 Tahun
                                </span>
                              )}
                            </div>

                            <p
                              className={`text-xs pl-8 font-medium ${
                                item.isAvailable ? 'text-emerald-800' : 'text-rose-700'
                              }`}
                            >
                              {item.isAvailable ? (
                                <span>
                                  <strong>Domain TERSEDIA!</strong>{' '}
                                  {item.isFreeWithPromo
                                    ? 'Termasuk gratis pada paket promo Rp 499.000 all-in.'
                                    : 'Dapat digunakan untuk landing page bisnis Anda.'}
                                </span>
                              ) : (
                                <span>
                                  <strong>{item.domain}</strong> sudah dipakai orang lain. Coba alternatif nama lain.
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* ========================================================================= */}
                        {/* INSTRUCTION BLOCK & PROCEED BUTTON (AS REQUESTED BY USER)                 */}
                        {/* ========================================================================= */}
                        {item.isAvailable && (
                          <div className="mt-3.5 pt-3.5 border-t border-emerald-300/80 bg-white/90 p-4 rounded-xl border border-emerald-200 space-y-2.5">
                            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900 uppercase tracking-wide">
                              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>Instruksi Melanjutkan Pengisian Order:</span>
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed font-medium">
                              Domain <strong>"{item.domain}"</strong> dapat langsung digunakan! Silakan tekan tombol hijau di bawah untuk memasukkan domain ini ke formulir pemesanan, kemudian lanjutkan melengkapi rincian usaha Anda di bawah.
                            </p>

                            <button
                              type="button"
                              onClick={() => handleSelectAvailableDomain(item.domain)}
                              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-98 text-white font-black text-xs sm:text-sm tracking-wide shadow-md hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <span>Gunakan Domain "{item.domain}" &amp; Lanjutkan Pengisian Order</span>
                              <ArrowDown className="w-4 h-4 animate-bounce" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Sales Consultant (optional) */}
            <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama sales konsultan : <span className="text-slate-400 font-normal">( optional )</span>
              </label>
              <input
                type="text"
                name="namaSalesKonsultan"
                value={formData.namaSalesKonsultan}
                onChange={handleInputChange}
                placeholder="Contoh: Rian / Dikosongkan jika langsung order web"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-hidden text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* ========================================================================= */}
            {/* STEP 2: DATA KLIEN & KONTAK                                               */}
            {/* ========================================================================= */}
            <div id="section-data-klien" className="space-y-5 pt-2">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                  2
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    2. Data Klien &amp; Kontak Pemesan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lengkapi identitas penanggung jawab dan nama brand bisnis Anda.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Nama Lengkap / PIC <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleInputChange}
                    placeholder="Contoh: Budi Santoso"
                    className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-hidden text-slate-900 ${
                      errors.namaLengkap ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {errors.namaLengkap && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.namaLengkap}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Nomor WhatsApp / Kontak Aktif <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nomorWa"
                    value={formData.nomorWa}
                    onChange={handleInputChange}
                    placeholder="Contoh: 081234567890"
                    className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-hidden text-slate-900 ${
                      errors.nomorWa ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {errors.nomorWa && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.nomorWa}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="nama@email.com"
                    className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-hidden text-slate-900 ${
                      errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Nama Bisnis / Brand / Perusahaan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaBisnis"
                    value={formData.namaBisnis}
                    onChange={handleInputChange}
                    placeholder="Contoh: Sambal Juara Bu Lina"
                    className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-hidden text-slate-900 ${
                      errors.namaBisnis ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {errors.namaBisnis && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.namaBisnis}
                    </p>
                  )}
                </div>

                {/* Domain Input linked with the checker box above */}
                <div className="sm:col-span-2">
                  <div className="mb-1.5">
                    <label className="block text-xs font-bold text-slate-800 flex items-center gap-2">
                      <span>Pilihan Nama Domain Website</span>
                      {formData.domainPilihan ? (
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 font-black px-2 py-0.5 rounded-full border border-emerald-300">
                          ✓ Terisi dari Cek Domain
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">(Gratis .my.id / .biz.id)</span>
                      )}
                    </label>
                  </div>

                  <input
                    type="text"
                    name="domainPilihan"
                    value={formData.domainPilihan || ''}
                    onChange={handleInputChange}
                    placeholder="Contoh: namabisnis.my.id (otomatis terisi saat Anda klik hasil Cek Domain di atas)"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-hidden text-slate-900 border-slate-200"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Free domain 1 tahun untuk ekstensi <strong>.my.id</strong> dan <strong>.biz.id</strong> (untuk .com atau .id dikenakan biaya tambahan registrar).
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Alamat bisnis / usaha <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    name="alamatBisnis"
                    value={formData.alamatBisnis}
                    onChange={handleInputChange}
                    placeholder="Contoh: Jl. Diponegoro No. 12, Kel. Menteng, Jakarta Pusat (atau kota operasional Anda)"
                    className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-hidden text-slate-900 ${
                      errors.alamatBisnis ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {errors.alamatBisnis && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.alamatBisnis}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Website / Akun Media Sosial Saat Ini <span className="text-slate-400 font-normal">(jika ada)</span>
                  </label>
                  <input
                    type="text"
                    name="mediaSosial"
                    value={formData.mediaSosial}
                    onChange={handleInputChange}
                    placeholder="Contoh: @sambaljuara (Instagram / TikTok) atau link Shopee / Tokopedia"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-hidden text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* STEP 3: INFORMASI PRODUK / LAYANAN                                        */}
            {/* ========================================================================= */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                  3
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    3. Informasi Produk / Layanan yang Ditawarkan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Materi ini akan dirangkai menjadi teks copywriting persuasif oleh tim kami.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Nama Produk / Layanan yang Dipromosikan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaProduk"
                    value={formData.namaProduk}
                    onChange={handleInputChange}
                    placeholder="Contoh: Paket Sambal Cumi Kemasan Botol 200gr"
                    className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-hidden text-slate-900 ${
                      errors.namaProduk ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {errors.namaProduk && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.namaProduk}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Deskripsi Singkat Produk/Layanan: <span className="text-slate-500 font-normal">(Jelaskan apa yang Anda tawarkan, manfaat utama, dan keunggulannya)</span> <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    name="deskripsiProduk"
                    value={formData.deskripsiProduk}
                    onChange={handleInputChange}
                    placeholder="Contoh: Sambal olahan cumi segar dengan bumbu rempah pilihan khas Jawa Timur, tanpa bahan pengawet, tahan 6 bulan di suhu ruang. Keunggulannya cumi melimpah, rasa gurih pedas nampol, dan sudah tersertifikasi Halal & P-IRT."
                    className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-hidden text-slate-900 ${
                      errors.deskripsiProduk ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {errors.deskripsiProduk && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.deskripsiProduk}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Target Audiens: <span className="text-slate-500 font-normal">(Contoh: usia, profesi, masalah atau kebutuhan utama yang ingin diselesaikan)</span>
                  </label>
                  <textarea
                    rows={2}
                    name="targetAudiens"
                    value={formData.targetAudiens}
                    onChange={handleInputChange}
                    placeholder="Contoh: Pria & Wanita usia 20-45 tahun, pecinta makanan pedas, anak kos/pekerja kantoran yang ingin makan enak praktis tanpa ribet masak."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-hidden text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Harga &amp; Penawaran Khusus: <span className="text-slate-500 font-normal">(Harga normal, harga promo, bonus/diskon jika ada)</span>
                  </label>
                  <input
                    type="text"
                    name="hargaPenawaran"
                    value={formData.hargaPenawaran}
                    onChange={handleInputChange}
                    placeholder="Contoh: Normal Rp 45.000 / botol. Promo: Beli 3 botol hanya Rp 100.000 + gratis 1 sachet sambal bawang!"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-hidden text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Catatan Tambahan untuk Desainer / Admin <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>
                  <textarea
                    rows={2}
                    name="catatanTambahan"
                    value={formData.catatanTambahan || ''}
                    onChange={handleInputChange}
                    placeholder="Contoh: Tolong gunakan aksen warna biru navy, logo sudah siap di link Drive, target launching hari Sabtu..."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-hidden text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* STEP 4: KEBUTUHAN & TUJUAN LANDING PAGE                                   */}
            {/* ========================================================================= */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                <span className="w-8 h-8 rounded-xl bg-sky-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                  4
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    4. Kebutuhan &amp; Tujuan Landing Page
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sesuaikan sasaran utama dan tipe aksi konversi yang diharapkan dari pengunjung.
                  </p>
                </div>
              </div>

              {/* A: Tujuan Utama */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Tujuan Utama Landing Page (Pilih salah satu/lebih):
                </label>
                <div className="space-y-2.5">
                  {[
                    'Penjualan langsung produk fisik / digital',
                    'Pengumpulan kontak / lead (Nama, Email, WhatsApp)',
                    'Pendaftaran webinar / event / kursus',
                    'Portofolio / Company profile satu halaman',
                  ].map((option) => {
                    const isChecked = formData.tujuanLandingPage.includes(option);
                    return (
                      <label
                        key={option}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-sky-50/70 border-sky-300 text-slate-900'
                            : 'bg-slate-50/40 border-slate-200 text-slate-700 hover:bg-slate-100/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxToggle('tujuanLandingPage', option)}
                          className="mt-0.5 h-4 w-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
                        />
                        <span className="text-xs font-medium">{option}</span>
                      </label>
                    );
                  })}

                  {/* Tujuan Lainnya */}
                  <div className="pt-1">
                    <label className="block text-xs text-slate-600 mb-1">
                      Lainnya: [........................]
                    </label>
                    <input
                      type="text"
                      name="tujuanLainnya"
                      value={formData.tujuanLainnya}
                      onChange={handleInputChange}
                      placeholder="Tuliskan tujuan spesifik lainnya jika ada..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-hidden text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* B: Call to Action (CTA) yang Diinginkan */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800">
                  Call to Action (CTA) yang Diinginkan:
                </label>
                <div className="space-y-2.5">
                  {[
                    'Tombol langsung ke WhatsApp (chat pemesanan)',
                    'Formulir checkout / order otomatis',
                    'Registrasi email / formulir pendaftaran',
                  ].map((ctaOption) => {
                    const isChecked = formData.ctaDiinginkan.includes(ctaOption);
                    return (
                      <label
                        key={ctaOption}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-sky-50/70 border-sky-300 text-slate-900'
                            : 'bg-slate-50/40 border-slate-200 text-slate-700 hover:bg-slate-100/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxToggle('ctaDiinginkan', ctaOption)}
                          className="mt-0.5 h-4 w-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
                        />
                        <span className="text-xs font-medium">{ctaOption}</span>
                      </label>
                    );
                  })}

                  {/* CTA Lainnya */}
                  <div className="pt-1">
                    <label className="block text-xs text-slate-600 mb-1">
                      Pembayaran gateway / link checkout eksternal lainnya [........................]
                    </label>
                    <input
                      type="text"
                      name="ctaLainnya"
                      value={formData.ctaLainnya}
                      onChange={handleInputChange}
                      placeholder="Contoh: Link Shopee / Mayar / Midtrans / Tokopedia..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-hidden text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* STEP 5: SYARAT & KETENTUAN LAYANAN                                        */}
            {/* ========================================================================= */}
            <div className={`p-5 sm:p-6 rounded-2xl border-2 space-y-3.5 shadow-xs ${
              selectedPackage === 'elite'
                ? 'bg-amber-50/70 border-amber-400'
                : 'bg-amber-50/90 border-amber-300'
            }`}>
              <div className="flex items-center gap-2 text-amber-950 font-black text-xs sm:text-sm uppercase tracking-wider">
                <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  {selectedPackage === 'elite'
                    ? 'Syarat & Ketentuan Layanan Paket Elite (Rp 3.000.000)'
                    : isPromoActive
                    ? 'Syarat & Ketentuan Paket UMKM (Promo Diskon 50% - Rp 249.500)'
                    : 'Syarat & Ketentuan Paket UMKM (Harga Flash Sale - Rp 499.000)'}
                </span>
              </div>

              {selectedPackage === 'elite' ? (
                <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">&bull;</span>
                    <span><strong className="text-amber-900 font-bold">Wajib DP 50% (Rp 1.500.000) di awal</strong>, sisanya (Rp 1.500.000) dilunasi setelah seluruh pengerjaan website selesai &amp; disetujui.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">&bull;</span>
                    <span><strong className="text-amber-900 font-bold">Waktu Pengerjaan: 5 - 7 hari kerja</strong> intensif (termasuk arsitektur kustom, copywriting, dan optimasi menyeluruh).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">&bull;</span>
                    <span><strong>Gratis revisi 2 kali</strong> untuk memastikan seluruh desain, konten, dan fungsionalitas berjalan optimal.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">&bull;</span>
                    <span><strong>Mencakup hingga 7 halaman</strong> terintegrasi (Home, Tentang Kami, Layanan, Galeri/Portfolio, Blog, Kontak, dll.).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">&bull;</span>
                    <span><strong>Optimasi PageSpeed &amp; Dasar SEO On-page</strong> disertakan untuk kecepatan dan pengindeksan Google.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">&bull;</span>
                    <span><strong>Termasuk setup domain &amp; cloud hosting</strong> selama 1 tahun penuh dengan sertifikat keamanan SSL HTTPS.</span>
                  </li>
                  <li className="flex items-start gap-2 p-2.5 bg-amber-100/90 rounded-xl border border-amber-300">
                    <span className="text-amber-800 font-black shrink-0 text-sm">💡</span>
                    <span className="text-amber-950 font-bold leading-relaxed">
                      Belum tahu apa itu Web Custom? Pelajari edukasi dan panduan resminya di{' '}
                      <a
                        href="https://share.google/87klge8DoF7cqlByM"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-800 hover:text-blue-900 inline-flex items-center gap-1 font-black"
                      >
                        https://share.google/87klge8DoF7cqlByM
                        <ExternalLink className="w-3 h-3 inline" />
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start gap-2 p-2.5 bg-amber-100/80 rounded-xl border border-amber-300">
                    <span className="text-amber-800 font-black shrink-0 text-sm">⚠️</span>
                    <span className="text-amber-950 font-bold leading-relaxed">
                      Setelah website selesai dikembangkan, kami akan mengirimkan invoice pelunasan sisa 50% dengan batas waktu <strong>1 x 24 jam</strong>.
                    </span>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">&bull;</span>
                    <span><strong>Free revisi 1 kali</strong>, untuk revisi kedua dan seterusnya dikenakan biaya Rp 50.000 per revisi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">&bull;</span>
                    <span><strong>Tidak mendapatkan email bisnis</strong> resmi (nama_bisnis@domain).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">&bull;</span>
                    <span><strong>Free domain</strong> berlaku untuk ekstensi <strong>.my.id</strong> dan <strong>.biz.id</strong> (ekstensi .com / .net / .id dikenakan biaya domain reguler).</span>
                  </li>
                  <li className="flex items-start gap-2 p-2.5 bg-amber-100/80 rounded-xl border border-amber-300">
                    <span className="text-amber-800 font-black shrink-0 text-sm">⚠️</span>
                    <span className="text-amber-950 font-bold leading-relaxed">
                      Setelah web jadi kami akan mengirimkan invoice dengan batas waktu <strong>1 x 24 jam</strong> untuk pembayaran, jika sudah melewati batas waktu status web akan kami pending.
                    </span>
                  </li>
                </ul>
              )}

              <div className="pt-3 border-t border-amber-200/80">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded text-sky-600 focus:ring-sky-500 border-amber-300 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-amber-950">
                    Semua pemesanan dianggap telah membaca dan menyetujui syarat dan ketentuan ini (termasuk batas pembayaran 1x24 jam setelah web jadi).
                  </span>
                </label>
                {errors.agreedTerms && (
                  <p className="text-[11px] text-rose-600 mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.agreedTerms}
                  </p>
                )}
              </div>
            </div>

            {/* Admin Target WA Notice */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950">
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Formulir ini akan otomatis terhubung ke WhatsApp Admin di nomor{' '}
                  <strong className="font-bold text-emerald-800">{ADMIN_WA_DISPLAY}</strong> untuk verifikasi kilat.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs font-bold text-emerald-700 hover:underline shrink-0 cursor-pointer"
              >
                {showPreview ? 'Tutup Pratinjau' : 'Lihat Format Pesan'}
              </button>
            </div>

            {/* Message Preview Drawer if toggled */}
            {showPreview && (
              <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <span>Pratinjau Draf Pesan WhatsApp:</span>
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                  </button>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto text-[11px] text-slate-200">
                  {formatOrderToWhatsApp(formData, isPromoActive)}
                </pre>
              </div>
            )}

            {/* ========================================================================= */}
            {/* RINGKASAN HARGA & STATUS PROMO OTOMATIS                                   */}
            {/* ========================================================================= */}
            <div
              className={`p-5 sm:p-6 rounded-2xl border-2 transition-all ${
                selectedPackage === 'elite'
                  ? 'bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-amber-400 text-white shadow-xl ring-2 ring-amber-400/30'
                  : isPromoActive
                  ? 'bg-gradient-to-r from-amber-50 via-yellow-50/80 to-emerald-50 border-amber-400 shadow-md ring-2 ring-amber-300/60'
                  : 'bg-sky-50/60 border-sky-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      selectedPackage === 'elite' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Ringkasan Total Tagihan:
                    </span>

                    {selectedPackage === 'elite' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-xs border border-amber-500">
                        <Crown className="w-3.5 h-3.5 fill-current" />
                        <span>PAKET ELITE &bull; HARGA NET (TIDAK BERLAKU PROMO BANNER)</span>
                      </span>
                    ) : isPromoActive ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-xs animate-pulse border border-amber-600/30">
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>PROMO DISKON 50% AKTIF</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-200 text-sky-900 font-bold text-[10px] uppercase">
                        Harga Flash Sale UMKM
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-3">
                    {selectedPackage === 'elite' ? (
                      <>
                        <span className="text-3xl sm:text-4xl font-black text-amber-400">
                          Rp 3.000.000
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          / project all-in (sampai 7 halaman)
                        </span>
                      </>
                    ) : isPromoActive ? (
                      <>
                        <span className="text-3xl sm:text-4xl font-black text-emerald-700">
                          Rp 249.500
                        </span>
                        <span className="text-base sm:text-lg font-bold text-slate-400 line-through">
                          Rp 499.000
                        </span>
                        <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                          HEMAT 50% (Rp 249.500)
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl sm:text-4xl font-black text-slate-900">
                          Rp 499.000
                        </span>
                        <span className="text-base font-bold text-slate-400 line-through">
                          Rp 1.800.000
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          / all-in
                        </span>
                      </>
                    )}
                  </div>

                  <p className={`text-xs font-medium ${
                    selectedPackage === 'elite' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {selectedPackage === 'elite' ? (
                      <span className="text-amber-200">
                        ✓ Paket Elite (Rp 3.000.000): Wajib DP 50% (Rp 1.500.000) di awal, sisanya dilunasi setelah web selesai &amp; disetujui. Estimasi pengerjaan: 5 - 7 hari kerja. Mencakup sampai 7 halaman custom, PageSpeed 90+, SEO on-page, dan gratis revisi 2x. Promo banner 50% tidak berlaku untuk paket ini.
                      </span>
                    ) : isPromoActive ? (
                      <span className="text-emerald-900 font-semibold">
                        ✓ Diskon 50% via banner diterapkan! Nota WhatsApp otomatis menyertakan status promo untuk verifikasi Admin.
                      </span>
                    ) : (
                      <span>
                        All-in termasuk pengerjaan kilat 1 hari, free domain 1 tahun, dan form order WhatsApp.
                      </span>
                    )}
                  </p>
                </div>

                {selectedPackage === 'umkm' && (
                  <div className="shrink-0 flex items-center gap-2">
                    {!isPromoActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsPromoActive(true);
                          setFormData((prev) => ({ ...prev, isPromoActive: true }));
                          try {
                            sessionStorage.setItem('promo_50_active', 'true');
                          } catch {}
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer transform hover:scale-102 active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>Klaim Diskon 50%</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsPromoActive(false);
                          setFormData((prev) => ({ ...prev, isPromoActive: false }));
                          try {
                            sessionStorage.removeItem('promo_50_active');
                          } catch {}
                        }}
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        Gunakan Harga Normal (Rp 499rb)
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Main Submit Button: Order Sekarang */}
            <div className="space-y-4 pt-2">
              <button
                type="submit"
                className={`relative group w-full py-4 px-6 text-base font-extrabold text-white rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3 overflow-hidden active:scale-99 ${
                  selectedPackage === 'elite'
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25'
                    : isPromoActive
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-green-700 hover:shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 hover:shadow-emerald-500/25'
                }`}
              >
                <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                <Send className="relative w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                <span className="relative tracking-wide">
                  {selectedPackage === 'elite'
                    ? 'KIRIM PESANAN PAKET ELITE VIA WHATSAPP (RP 3.000.000)'
                    : isPromoActive
                    ? 'KIRIM PESANAN VIA WHATSAPP (PROMO RP 249.500)'
                    : 'KIRIM PESANAN SEKARANG VIA WHATSAPP (RP 499.000)'}
                </span>
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Data Anda aman &bull; Bayar setelah website jadi dan Anda review (tanpa DP)</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-800 font-semibold cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Berhasil Tersalin ke Clipboard' : 'Salin Rincian Pesanan'}</span>
                </button>
              </div>

              {/* Order Form Trust & Security Badges Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wide">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Jaminan Keamanan &amp; Garansi Transaksi</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
                    100% Terverifikasi
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-700 font-medium">
                  <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200/70">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Garansi 100% Puas</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200/70">
                    <Zap className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>24 Jam Siap Pakai</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200/70">
                    <Lock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>SSL 256-Bit Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Bebas Template Pasaran</span>
                  </div>
                </div>

                {/* Accepted Payment Channels */}
                <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-600">Metode Pembayaran Resmi:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-blue-800 font-bold">BCA</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-amber-700 font-bold">MANDIRI</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-blue-900 font-bold">BRI</span>
                    <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 rounded text-rose-700 font-black">QRIS</span>
                    <span className="px-2 py-0.5 bg-sky-50 border border-sky-200 rounded text-sky-700 font-bold">GoPay/OVO</span>
                  </div>
                </div>

                {/* Bank Transfer Channels Logo Image */}
                <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-700 font-bold">
                    <span>Mendukung Transfer Bank &amp; Virtual Account Seluruh Indonesia:</span>
                    <span className="text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-extrabold">Bebas Biaya Transfer</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
                    <img
                      src="/assets/aistudio/transfer-antar-bank-gratis-scaled-1_1561b3d5.jpg"
                      alt="Logo Berbagai Metode Pembayaran Bank di Indonesia: BNI, BRI, Mandiri, BCA, CIMB Niaga, Muamalat, BTPN, Jenius, Permata, Digibank"
                      className="w-full h-auto object-contain rounded-lg max-h-24 sm:max-h-28 mx-auto"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {submittedSuccess && (
                  <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-center text-xs text-sky-900 font-medium">
                    WhatsApp sedang dibuka! Jika jendela WhatsApp tidak terbuka otomatis karena diblokir browser, silakan{' '}
                    <a
                      href={generateWhatsAppUrl(formData, isPromoActive)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline text-sky-700"
                    >
                      klik tautan langsung ini
                    </a>{' '}
                    atau salin rincian pesanan di atas lalu kirimkan manual ke <strong>0896-7368-6625</strong>.
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
