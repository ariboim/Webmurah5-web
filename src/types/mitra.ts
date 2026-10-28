export type MitraStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'BLOCKED';

export interface MitraAccount {
  id: string; // e.g. ITDI-MTR-2026-0042
  namaLengkap: string;
  email: string;
  noHpWa: string;
  password?: string;
  pin?: string;
  status: MitraStatus;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  blockedAt?: string;
  adminNotes?: string;

  // Profile data
  nik?: string;
  tempatTanggalLahir?: string;
  alamatKtp?: string;
  kotaDomisili?: string;
  namaBank?: string;
  nomorRekening?: string;
  namaPemilikRekening?: string;
  fotoUrl?: string;
  signatureDataUrl?: string;

  // Referral & Replica attributes
  slug: string; // e.g. "prima-aldino", used in www.webmurah.biz.id/reff/:namamitra
  phoneInternational: string; // e.g. "6285811735280"
  referralClicks?: number;
  referralLeads?: number;
  referralOrders?: number;
  totalKomisi?: number;

  // Partnership agreement metadata
  nomorSuratPerjanjian?: string;
  tanggalBergabung?: string;
}

export interface ReferralLeadRecord {
  id: string;
  mitraId: string;
  mitraSlug: string;
  mitraName: string;
  clientName: string;
  clientPhone: string;
  clientPackage: 'umkm' | 'elite' | 'enterprise';
  domainQuery?: string;
  timestamp: string;
  status: 'PENDING' | 'CLOSED_DEAL' | 'CANCELLED';
  commissionAmount: number;
}

export interface CopywritingTemplate {
  id: string;
  kategori: 'promo_diskon' | 'edukasi' | 'hardsell' | 'followup';
  judul: string;
  deskripsi: string;
  template: (vars: {
    namaProspek: string;
    namaBisnis: string;
    namaMitra: string;
    noWaMitra: string;
    linkReferral: string;
  }) => string;
}

export type BrosurStyle = 'minimalist' | 'bold_conversion' | 'elegant_corporate';
