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

  // Partnership agreement metadata
  nomorSuratPerjanjian?: string;
  tanggalBergabung?: string;
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
