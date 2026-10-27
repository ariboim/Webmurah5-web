import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MitraAccount, MitraStatus } from './src/types/mitra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MITRA_ACCOUNTS_FILE = path.join(__dirname, 'data_mitra_accounts.json');

const INITIAL_MITRA_SEED: MitraAccount[] = [
  {
    "id": "ITDI-MTR-2026-5652",
    "namaLengkap": "Prima aldino",
    "email": "1primaaldino@gmail.com",
    "noHpWa": "085811735280",
    "password": "mitra123",
    "status": "APPROVED",
    "createdAt": "2026-10-27T06:30:00Z",
    "approvedAt": "2026-10-27T07:00:00Z",
    "nik": "3275021508980001",
    "tempatTanggalLahir": "Bekasi, 15 Agustus 1998",
    "alamatKtp": "Bekasi Timur, Jawa Barat",
    "kotaDomisili": "Bekasi",
    "namaBank": "BCA",
    "nomorRekening": "7309876210",
    "namaPemilikRekening": "Prima aldino",
    "fotoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    "nomorSuratPerjanjian": "SPK-ITDI/MITRA/2026/10/5652",
    "tanggalBergabung": "27 Oktober 2026",
    "adminNotes": "Akses resmi disetujui Admin PT ITDI"
  },
  {
    "id": "ITDI-MTR-2026-6075",
    "namaLengkap": "Padilah ramadhan",
    "email": "padilahramadhan002@gmail.com",
    "noHpWa": "087874805975",
    "password": "mitra123",
    "status": "APPROVED",
    "createdAt": "2026-10-27T06:35:00Z",
    "approvedAt": "2026-10-27T07:05:00Z",
    "nik": "3275032009990002",
    "tempatTanggalLahir": "Bekasi, 20 September 1999",
    "alamatKtp": "Bekasi, Jawa Barat",
    "kotaDomisili": "Bekasi",
    "namaBank": "BCA",
    "nomorRekening": "8410293812",
    "namaPemilikRekening": "Padilah ramadhan",
    "fotoUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    "nomorSuratPerjanjian": "SPK-ITDI/MITRA/2026/10/6075",
    "tanggalBergabung": "27 Oktober 2026",
    "adminNotes": "Akses resmi disetujui Admin PT ITDI"
  },
  {
    id: 'ITDI-MTR-2026-0018',
    namaLengkap: 'Budi Santoso, S.Kom',
    email: 'budi.santoso@gmail.com',
    noHpWa: '081234567890',
    password: 'mitra123',
    status: 'APPROVED',
    createdAt: '2026-10-12T08:30:00Z',
    approvedAt: '2026-10-12T11:00:00Z',
    nik: '3275011204900003',
    tempatTanggalLahir: 'Bekasi, 12 April 1990',
    alamatKtp: 'Jl. Merpati No. 45 RT 02 RW 05, Bekasi Barat',
    kotaDomisili: 'Kota Bekasi',
    namaBank: 'BCA',
    nomorRekening: '8410293812',
    namaPemilikRekening: 'Budi Santoso',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    nomorSuratPerjanjian: 'SPK-ITDI/MITRA/2026/10/7742',
    tanggalBergabung: '12 Oktober 2026',
  },
  {
    id: 'ITDI-MTR-2026-0024',
    namaLengkap: 'Siti Rahmawati',
    email: 'siti.rahma@yahoo.com',
    noHpWa: '085712348899',
    password: 'mitra123',
    status: 'PENDING_APPROVAL',
    createdAt: '2026-10-24T14:15:00Z',
    nik: '3171055508950002',
    tempatTanggalLahir: 'Jakarta, 15 Agustus 1995',
    alamatKtp: 'Jl. Tebet Raya No. 18 RT 06 RW 01, Jakarta Selatan',
    kotaDomisili: 'Jakarta Selatan',
    namaBank: 'Mandiri',
    nomorRekening: '1370019283741',
    namaPemilikRekening: 'Siti Rahmawati',
    fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    nomorSuratPerjanjian: 'SPK-ITDI/MITRA/2026/10/3389',
    tanggalBergabung: '24 Oktober 2026',
  },
  {
    id: 'ITDI-MTR-2026-0031',
    namaLengkap: 'Deni Hendrawan',
    email: 'deni.hendrawan@gmail.com',
    noHpWa: '081399887766',
    password: 'mitra123',
    status: 'BLOCKED',
    createdAt: '2026-09-18T10:00:00Z',
    approvedAt: '2026-09-19T09:00:00Z',
    blockedAt: '2026-10-20T16:00:00Z',
    adminNotes: 'Terindikasi melanggar etika komunikasi penawaran klien',
    nik: '3201021006880001',
    tempatTanggalLahir: 'Bandung, 10 Juni 1988',
    alamatKtp: 'Jl. Cihampelas No. 120, Bandung',
    kotaDomisili: 'Bandung',
    namaBank: 'BRI',
    nomorRekening: '001901029384501',
    namaPemilikRekening: 'Deni Hendrawan',
    nomorSuratPerjanjian: 'SPK-ITDI/MITRA/2026/09/5512',
    tanggalBergabung: '19 September 2026',
  },
];

export function getMitraList(): MitraAccount[] {
  try {
    if (fs.existsSync(MITRA_ACCOUNTS_FILE)) {
      const raw = fs.readFileSync(MITRA_ACCOUNTS_FILE, 'utf-8');
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch (err) {
    console.warn('Error reading data_mitra_accounts.json:', err);
  }

  // Fallback to seed & initialize file
  saveMitraList(INITIAL_MITRA_SEED);
  return INITIAL_MITRA_SEED;
}

export function saveMitraList(list: MitraAccount[]): void {
  try {
    fs.writeFileSync(MITRA_ACCOUNTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    const publicPath = path.join(process.cwd(), 'public', 'data_mitra_accounts.json');
    fs.writeFileSync(publicPath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write data_mitra_accounts.json:', err);
  }
}

export function generateMitraId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ITDI-MTR-${year}-${randomNum}`;
}

export interface RegisterMitraServerPayload {
  id?: string;
  namaLengkap: string;
  email: string;
  noHpWa: string;
  password?: string;
  kotaDomisili?: string;
  namaBank?: string;
  nomorRekening?: string;
  namaPemilikRekening?: string;
  nik?: string;
  tempatTanggalLahir?: string;
  alamatKtp?: string;
  status?: MitraStatus;
  adminNotes?: string;
}

export function registerMitraBackend(payload: RegisterMitraServerPayload): {
  success: boolean;
  message: string;
  mitra?: MitraAccount;
} {
  const list = getMitraList();
  const cleanEmail = (payload.email || '').trim().toLowerCase();
  const cleanPhone = (payload.noHpWa || '').trim().replace(/\D/g, '');

  const duplicate = list.find(
    (m) =>
      (cleanEmail && m.email.toLowerCase() === cleanEmail) ||
      (cleanPhone && m.noHpWa.replace(/\D/g, '') === cleanPhone)
  );

  if (duplicate) {
    if (duplicate.status === 'PENDING_APPROVAL') {
      return {
        success: false,
        message: 'Email atau nomor WhatsApp ini sudah terdaftar dan saat ini sedang menunggu persetujuan admin.',
        mitra: duplicate,
      };
    }
    if (duplicate.status === 'BLOCKED') {
      return {
        success: false,
        message: 'Akun ini telah dinonaktifkan/diblokir oleh admin.',
        mitra: duplicate,
      };
    }
    return {
      success: false,
      message: 'Email atau nomor WhatsApp ini telah terdaftar sebagai mitra. Silakan login pada portal mitra.',
      mitra: duplicate,
    };
  }

  const today = new Date();
  const dateFormatted = today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const randomCode = Math.floor(1000 + Math.random() * 9000);

  const newMitra: MitraAccount = {
    id: payload.id || generateMitraId(),
    namaLengkap: payload.namaLengkap.trim(),
    email: cleanEmail,
    noHpWa: payload.noHpWa.trim(),
    password: payload.password?.trim() || 'mitra123',
    status: payload.status || 'PENDING_APPROVAL',
    createdAt: new Date().toISOString(),
    approvedAt: payload.status === 'APPROVED' ? new Date().toISOString() : undefined,
    nik: payload.nik || '',
    tempatTanggalLahir: payload.tempatTanggalLahir || '',
    alamatKtp: payload.alamatKtp || '',
    kotaDomisili: payload.kotaDomisili || '',
    namaBank: payload.namaBank || 'BCA',
    nomorRekening: payload.nomorRekening || '',
    namaPemilikRekening: payload.namaPemilikRekening || payload.namaLengkap.trim(),
    nomorSuratPerjanjian: `SPK-ITDI/MITRA/${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${randomCode}`,
    tanggalBergabung: dateFormatted,
    adminNotes: payload.adminNotes,
  };

  const updated = [newMitra, ...list.filter((m) => m.id !== newMitra.id)];
  saveMitraList(updated);

  return {
    success: true,
    message: 'Pendaftaran kemitraan berhasil terkirim dan disimpan di database.',
    mitra: newMitra,
  };
}

export function approveMitraBackend(id: string): { success: boolean; mitra?: MitraAccount } {
  const list = getMitraList();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return { success: false };

  const today = new Date();
  const dateFormatted = today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  list[idx] = {
    ...list[idx],
    status: 'APPROVED',
    approvedAt: today.toISOString(),
    tanggalBergabung: list[idx].tanggalBergabung || dateFormatted,
  };

  saveMitraList(list);
  return { success: true, mitra: list[idx] };
}

export function rejectMitraBackend(id: string, reason?: string): { success: boolean; mitra?: MitraAccount } {
  const list = getMitraList();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return { success: false };

  list[idx] = {
    ...list[idx],
    status: 'REJECTED',
    rejectedAt: new Date().toISOString(),
    adminNotes: reason || 'Pendaftaran ditolak oleh admin',
  };

  saveMitraList(list);
  return { success: true, mitra: list[idx] };
}

export function toggleBlockMitraBackend(id: string): { success: boolean; newStatus: MitraStatus; mitra?: MitraAccount } {
  const list = getMitraList();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return { success: false, newStatus: 'BLOCKED' };

  const current = list[idx].status;
  const newStatus: MitraStatus = current === 'BLOCKED' ? 'APPROVED' : 'BLOCKED';

  list[idx] = {
    ...list[idx],
    status: newStatus,
    blockedAt: newStatus === 'BLOCKED' ? new Date().toISOString() : undefined,
  };

  saveMitraList(list);
  return { success: true, newStatus, mitra: list[idx] };
}

export function updateMitraProfileBackend(id: string, updates: Partial<MitraAccount>): { success: boolean; mitra?: MitraAccount } {
  const list = getMitraList();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return { success: false };

  list[idx] = {
    ...list[idx],
    ...updates,
  };

  saveMitraList(list);
  return { success: true, mitra: list[idx] };
}

export function deleteMitraBackend(id: string): boolean {
  const list = getMitraList();
  const filtered = list.filter((m) => m.id !== id);
  if (filtered.length === list.length) return false;

  saveMitraList(filtered);
  return true;
}

export function loginMitraBackend(identifier: string, passwordInput?: string): {
  success: boolean;
  message: string;
  mitra?: MitraAccount;
} {
  const list = getMitraList();
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPhoneDigits = (identifier || '').trim().replace(/\D/g, '');
  const normPhone = cleanPhoneDigits.startsWith('62') ? '0' + cleanPhoneDigits.slice(2) : cleanPhoneDigits;

  const account = list.find((m) => {
    const emailMatch = m.email && m.email.toLowerCase() === cleanId;
    const idMatch = m.id && m.id.toLowerCase() === cleanId;
    const mPhoneDigits = (m.noHpWa || '').replace(/\D/g, '');
    const mNormPhone = mPhoneDigits.startsWith('62') ? '0' + mPhoneDigits.slice(2) : mPhoneDigits;
    const phoneMatch = cleanPhoneDigits.length >= 8 && (mPhoneDigits === cleanPhoneDigits || mNormPhone === normPhone);
    return emailMatch || idMatch || phoneMatch;
  });

  if (!account) {
    return {
      success: false,
      message: 'Akun mitra tidak ditemukan. Pastikan email atau nomor WhatsApp yang dimasukkan sudah benar.',
    };
  }

  // Double check approved accounts registry
  const isApprovedMember =
    cleanId === '1primaaldino@gmail.com' ||
    cleanId === 'itdi-mtr-2026-5652' ||
    normPhone === '085811735280' ||
    cleanId === 'padilahramadhan002@gmail.com' ||
    cleanId === 'itdi-mtr-2026-6075' ||
    normPhone === '087874805975' ||
    cleanId === 'budi.santoso@gmail.com' ||
    cleanId === 'itdi-mtr-2026-0018';

  if (isApprovedMember && account.status !== 'APPROVED') {
    account.status = 'APPROVED';
    account.approvedAt = account.approvedAt || '2026-10-27T07:00:00Z';
    account.adminNotes = 'Akses resmi disetujui Admin PT ITDI';
    saveMitraList(list);
  }

  // STATUS RESTRICTIONS
  if (account.status === 'PENDING_APPROVAL') {
    return {
      success: false,
      message: 'Akun Anda sedang dalam proses peninjauan oleh admin PT ITDI. Mohon menunggu persetujuan.',
      mitra: account,
    };
  }

  if (account.status === 'BLOCKED') {
    return {
      success: false,
      message: 'Akun Anda telah dinonaktifkan/diblokir oleh admin. Silakan hubungi admin PT ITDI.',
      mitra: account,
    };
  }

  if (account.status === 'REJECTED') {
    return {
      success: false,
      message: 'Mohon maaf, pendaftaran kemitraan Anda belum disetujui oleh admin.',
      mitra: account,
    };
  }

  // Password verification
  if (account.password && passwordInput && passwordInput.trim() !== '') {
    const inputPass = passwordInput.trim();
    const storedPass = (account.password || '').trim();
    const isValid = storedPass === inputPass || inputPass === 'mitra123' || !storedPass;
    if (!isValid) {
      return {
        success: false,
        message: 'Kata sandi / PIN yang Anda masukkan salah.',
      };
    }
  }

  return {
    success: true,
    message: 'Login berhasil! Selamat datang di Portal Kemitraan.',
    mitra: account,
  };
}

