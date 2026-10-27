import { MitraAccount, MitraStatus } from '../types/mitra';

const MITRA_ACCOUNTS_STORAGE_KEY = 'itdi_mitra_accounts_v2';
const CURRENT_MITRA_SESSION_KEY = 'itdi_current_mitra_session_v2';

// Seed initial realistic partners for immediate testing
const INITIAL_MITRA_SEED: MitraAccount[] = [
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

let isSyncing = false;

/**
 * Merge two lists of mitra accounts, prioritizing newer or non-seed entries.
 */
function mergeMitraLists(primary: MitraAccount[], secondary: MitraAccount[]): MitraAccount[] {
  const map = new Map<string, MitraAccount>();

  // Add primary list first
  for (const item of primary) {
    if (item && item.id) {
      map.set(item.id, item);
    }
  }

  // Merge secondary list
  for (const item of secondary) {
    if (!item || !item.id) continue;
    if (!map.has(item.id)) {
      map.set(item.id, item);
    } else {
      // If already present, merge fields keeping newer approvedAt or status updates
      const existing = map.get(item.id)!;
      map.set(item.id, {
        ...existing,
        ...item,
        status: item.status || existing.status,
      });
    }
  }

  return Array.from(map.values());
}

export function getAllMitra(): MitraAccount[] {
  try {
    const raw = localStorage.getItem(MITRA_ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MITRA_ACCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_MITRA_SEED));
      // Background sync with central database
      syncMitraFromServer().catch(() => {});
      return INITIAL_MITRA_SEED;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(MITRA_ACCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_MITRA_SEED));
      syncMitraFromServer().catch(() => {});
      return INITIAL_MITRA_SEED;
    }

    // Trigger non-blocking background sync if not currently syncing
    if (!isSyncing) {
      syncMitraFromServer().catch(() => {});
    }

    return parsed;
  } catch (err) {
    console.error('Failed to get mitra accounts:', err);
    return INITIAL_MITRA_SEED;
  }
}

export function saveAllMitra(list: MitraAccount[]): void {
  try {
    localStorage.setItem(MITRA_ACCOUNTS_STORAGE_KEY, JSON.stringify(list));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mitra-updated', { detail: list }));
    }
  } catch (err) {
    console.error('Failed to save mitra accounts:', err);
  }
}

/**
 * Synchronize mitra accounts between Central Database API and browser localStorage.
 */
export async function syncMitraFromServer(): Promise<MitraAccount[]> {
  if (isSyncing) return getAllMitra();
  isSyncing = true;

  try {
    const response = await fetch('/api/mitra/list', {
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.mitra)) {
        const localList = (() => {
          try {
            const raw = localStorage.getItem(MITRA_ACCOUNTS_STORAGE_KEY);
            return raw ? JSON.parse(raw) : INITIAL_MITRA_SEED;
          } catch {
            return INITIAL_MITRA_SEED;
          }
        })();

        // Merge server and local lists (Server is master, local new ones added)
        const merged = mergeMitraLists(data.mitra, localList);
        localStorage.setItem(MITRA_ACCOUNTS_STORAGE_KEY, JSON.stringify(merged));

        // If local had new items not yet on server, push them to server in background
        const serverIds = new Set(data.mitra.map((m: MitraAccount) => m.id));
        for (const localItem of localList) {
          if (!serverIds.has(localItem.id)) {
            fetch('/api/mitra/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(localItem),
            }).catch(() => {});
          }
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mitra-updated', { detail: merged }));
        }

        return merged;
      }
    }
  } catch (err) {
    // Backend API might be unreachable (offline/client-only), fallback to local storage
  } finally {
    isSyncing = false;
  }

  return getAllMitra();
}

export function generateMitraId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ITDI-MTR-${year}-${randomNum}`;
}

export interface RegisterMitraPayload {
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

export function registerMitra(payload: RegisterMitraPayload): { success: boolean; message: string; mitra?: MitraAccount } {
  const currentList = getAllMitra();

  // Validate duplicate email or phone
  const cleanEmail = payload.email.trim().toLowerCase();
  const cleanPhone = payload.noHpWa.trim().replace(/\D/g, '');

  const duplicate = currentList.find(
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

  const updatedList = [newMitra, ...currentList];
  saveAllMitra(updatedList);

  // Asynchronously send to Central Server Database API
  fetch('/api/mitra/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMitra),
  }).catch((err) => {
    console.warn('Backend sync notice (saved locally):', err);
  });

  return {
    success: true,
    message: payload.status === 'APPROVED' 
      ? 'Data mitra berhasil ditambahkan dengan status Aktif (APPROVED).' 
      : 'Pendaftaran kemitraan Anda berhasil terkirim. Mohon menunggu persetujuan admin.',
    mitra: newMitra,
  };
}

export function loginMitra(identifier: string, passwordInput: string): {
  success: boolean;
  message: string;
  mitra?: MitraAccount;
} {
  const currentList = getAllMitra();
  const cleanId = identifier.trim().toLowerCase();
  const cleanPhone = identifier.trim().replace(/\D/g, '');

  const account = currentList.find(
    (m) =>
      m.email.toLowerCase() === cleanId ||
      m.noHpWa.replace(/\D/g, '') === cleanPhone ||
      m.id.toLowerCase() === cleanId
  );

  if (!account) {
    return {
      success: false,
      message: 'Akun mitra tidak ditemukan. Pastikan email atau nomor WhatsApp sudah terdaftar.',
    };
  }

  if (account.password && passwordInput && account.password !== passwordInput.trim()) {
    return {
      success: false,
      message: 'Kata sandi / PIN yang Anda masukkan salah.',
    };
  }

  // STATUS RESTRICTIONS
  if (account.status === 'PENDING_APPROVAL') {
    return {
      success: false,
      message: 'Akun Anda sedang dalam proses peninjauan oleh admin. Mohon menunggu persetujuan.',
    };
  }

  if (account.status === 'BLOCKED') {
    return {
      success: false,
      message: 'Akun Anda telah dinonaktifkan/diblokir oleh admin. Silakan hubungi admin kami untuk informasi lebih lanjut.',
    };
  }

  if (account.status === 'REJECTED') {
    return {
      success: false,
      message: 'Mohon maaf, pendaftaran kemitraan Anda belum dapat disetujui oleh admin.',
    };
  }

  // APPROVED
  setCurrentMitraSession(account);
  return {
    success: true,
    message: 'Login berhasil! Selamat datang di Portal Kemitraan.',
    mitra: account,
  };
}

export function approveMitra(id: string): boolean {
  const list = getAllMitra();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return false;

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

  saveAllMitra(list);

  // Sync to backend API
  fetch('/api/mitra/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  }).catch(() => {});

  // If currently active session is this user, update session
  const currentSession = getCurrentMitraSession();
  if (currentSession && currentSession.id === id) {
    setCurrentMitraSession(list[idx]);
  }

  return true;
}

export function rejectMitra(id: string, reason?: string): boolean {
  const list = getAllMitra();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return false;

  list[idx] = {
    ...list[idx],
    status: 'REJECTED',
    rejectedAt: new Date().toISOString(),
    adminNotes: reason || 'Pendaftaran ditolak oleh admin',
  };

  saveAllMitra(list);

  // Sync to backend API
  fetch('/api/mitra/reject', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, reason }),
  }).catch(() => {});

  return true;
}

export function toggleBlockMitra(id: string): { newStatus: MitraStatus; success: boolean } {
  const list = getAllMitra();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return { newStatus: 'BLOCKED', success: false };

  const current = list[idx].status;
  const newStatus: MitraStatus = current === 'BLOCKED' ? 'APPROVED' : 'BLOCKED';

  list[idx] = {
    ...list[idx],
    status: newStatus,
    blockedAt: newStatus === 'BLOCKED' ? new Date().toISOString() : undefined,
  };

  saveAllMitra(list);

  // Sync to backend API
  fetch('/api/mitra/toggle-block', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  }).catch(() => {});

  // If blocked user is currently logged in, sync or logout
  const currentSession = getCurrentMitraSession();
  if (currentSession && currentSession.id === id) {
    if (newStatus === 'BLOCKED') {
      clearMitraSession();
    } else {
      setCurrentMitraSession(list[idx]);
    }
  }

  return { newStatus, success: true };
}

export function updateMitraProfile(id: string, updates: Partial<MitraAccount>): boolean {
  const list = getAllMitra();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return false;

  list[idx] = {
    ...list[idx],
    ...updates,
  };

  saveAllMitra(list);

  // Sync to backend API
  fetch('/api/mitra/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, updates }),
  }).catch(() => {});

  const currentSession = getCurrentMitraSession();
  if (currentSession && currentSession.id === id) {
    setCurrentMitraSession(list[idx]);
  }

  return true;
}

export function deleteMitra(id: string): boolean {
  const list = getAllMitra();
  const filtered = list.filter((m) => m.id !== id);
  if (filtered.length === list.length) return false;

  saveAllMitra(filtered);

  // Sync to backend API
  fetch(`/api/mitra/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }).catch(() => {});

  const currentSession = getCurrentMitraSession();
  if (currentSession && currentSession.id === id) {
    clearMitraSession();
  }

  return true;
}

// Current Session Helpers
export function getCurrentMitraSession(): MitraAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_MITRA_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Double check with latest state in storage
    const all = getAllMitra();
    const fresh = all.find((m) => m.id === session.id);
    if (!fresh || fresh.status !== 'APPROVED') {
      clearMitraSession();
      return null;
    }
    return fresh;
  } catch {
    return null;
  }
}

export function setCurrentMitraSession(mitra: MitraAccount): void {
  try {
    localStorage.setItem(CURRENT_MITRA_SESSION_KEY, JSON.stringify(mitra));
  } catch (err) {
    console.error('Failed to set mitra session:', err);
  }
}

export function clearMitraSession(): void {
  try {
    localStorage.removeItem(CURRENT_MITRA_SESSION_KEY);
  } catch {}
}
