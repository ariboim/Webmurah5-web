import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lock,
  Unlock,
  Edit3,
  Trash2,
  Search,
  Filter,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Building,
  Save,
  X,
  Plus,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  UserPlus,
  Copy,
  Check,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { MitraAccount, MitraStatus } from '../../types/mitra';
import {
  getAllMitra,
  syncMitraFromServer,
  registerMitra,
  approveMitra,
  rejectMitra,
  toggleBlockMitra,
  updateMitraProfile,
  deleteMitra,
} from '../../utils/mitraStorage';

export const AdminMitraManagement: React.FC<{
  onOpenMitraDashboard?: (mitra: MitraAccount) => void;
}> = ({ onOpenMitraDashboard }) => {
  const [mitraList, setMitraList] = useState<MitraAccount[]>(() => getAllMitra());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedRekeningId, setCopiedRekeningId] = useState<string | null>(null);

  // Modal Manual Add State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addNama, setAddNama] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addKota, setAddKota] = useState('');
  const [addBank, setAddBank] = useState('BCA');
  const [addRekening, setAddRekening] = useState('');
  const [addNamaRekening, setAddNamaRekening] = useState('');
  const [addStatus, setAddStatus] = useState<MitraStatus>('PENDING_APPROVAL');
  const [addNotes, setAddNotes] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  // Modal Edit State
  const [editingMitra, setEditingMitra] = useState<MitraAccount | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<MitraAccount>>({});

  // Confirmation Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Success Notice
  const [notice, setNotice] = useState<string | null>(null);

  const loadData = async () => {
    setIsRefreshing(true);
    // Instant local state
    setMitraList(getAllMitra());

    // Background server sync
    try {
      const fresh = await syncMitraFromServer();
      if (fresh && fresh.length > 0) {
        setMitraList(fresh);
      }
    } catch {
      // Offline fallback
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen to real-time events triggered whenever any tab/registration updates
    const handleMitraUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setMitraList(e.detail);
      } else {
        setMitraList(getAllMitra());
      }
    };
    window.addEventListener('mitra-updated', handleMitraUpdated);

    // Auto-poll server every 8 seconds so incoming phone registrations appear live
    const interval = setInterval(() => {
      syncMitraFromServer()
        .then((fresh) => {
          if (fresh && Array.isArray(fresh)) {
            setMitraList(fresh);
          }
        })
        .catch(() => {});
    }, 8000);

    return () => {
      window.removeEventListener('mitra-updated', handleMitraUpdated);
      clearInterval(interval);
    };
  }, []);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleCopyRegLink = () => {
    const link = 'https://webmurah.biz.id/#/kemitraan';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }).catch(() => {
        prompt('Salin link registrasi mitra:', link);
      });
    } else {
      prompt('Salin link registrasi mitra:', link);
    }
  };

  const handleCopyRekening = (id: string, rekening: string) => {
    if (!rekening) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(rekening).then(() => {
        setCopiedRekeningId(id);
        setTimeout(() => setCopiedRekeningId(null), 2000);
      }).catch(() => {
        prompt('Salin nomor rekening:', rekening);
      });
    } else {
      prompt('Salin nomor rekening:', rekening);
    }
  };

  // Actions
  const handleApprove = (id: string) => {
    const ok = approveMitra(id);
    if (ok) {
      loadData();
      showNotification('Akun mitra berhasil disetujui (APPROVED)! Mitra sekarang dapat login.');
    }
  };

  const handleReject = (id: string) => {
    const ok = rejectMitra(id);
    if (ok) {
      loadData();
      showNotification('Pendaftaran mitra berhasil ditolak (REJECTED).');
    }
  };

  const handleToggleBlock = (id: string) => {
    const { newStatus, success } = toggleBlockMitra(id);
    if (success) {
      loadData();
      showNotification(
        newStatus === 'BLOCKED'
          ? 'Akun mitra telah DIBLOKIR. Akses ke portal dicabut.'
          : 'Blokir akun telah dicabut (APPROVED).'
      );
    }
  };

  // Submit Manual Add Mitra
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    if (!addNama.trim()) {
      setAddError('Nama lengkap calon mitra wajib diisi.');
      return;
    }
    if (!addEmail.trim() || !addEmail.includes('@')) {
      setAddError('Email aktif tidak valid.');
      return;
    }
    if (!addPhone.trim() || addPhone.trim().length < 8) {
      setAddError('Nomor WhatsApp minimal 9 digit.');
      return;
    }

    const res = registerMitra({
      namaLengkap: addNama.trim(),
      email: addEmail.trim(),
      noHpWa: addPhone.trim(),
      kotaDomisili: addKota.trim() || 'Indonesia',
      namaBank: addBank.trim() || 'BCA',
      nomorRekening: addRekening.trim(),
      namaPemilikRekening: addNamaRekening.trim() || addNama.trim(),
      status: addStatus,
      adminNotes: addNotes.trim() || 'Diinput manual oleh admin',
    });

    if (res.success && res.mitra) {
      setIsAddModalOpen(false);
      setAddNama('');
      setAddEmail('');
      setAddPhone('');
      setAddKota('');
      setAddBank('BCA');
      setAddRekening('');
      setAddNamaRekening('');
      setAddNotes('');
      setAddStatus('PENDING_APPROVAL');
      loadData();
      showNotification(
        addStatus === 'APPROVED'
          ? `Mitra "${res.mitra.namaLengkap}" berhasil ditambahkan dan langsung AKTIF!`
          : `Mitra "${res.mitra.namaLengkap}" berhasil ditambahkan ke antrean approval!`
      );
    } else {
      setAddError(res.message);
    }
  };

  const handleStartEdit = (m: MitraAccount) => {
    setEditingMitra(m);
    setEditFormData({
      namaLengkap: m.namaLengkap,
      email: m.email,
      noHpWa: m.noHpWa,
      status: m.status,
      kotaDomisili: m.kotaDomisili || '',
      namaBank: m.namaBank || 'BCA',
      nomorRekening: m.nomorRekening || '',
      namaPemilikRekening: m.namaPemilikRekening || m.namaLengkap,
      adminNotes: m.adminNotes || '',
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMitra) return;

    const ok = updateMitraProfile(editingMitra.id, editFormData);
    if (ok) {
      setEditingMitra(null);
      loadData();
      showNotification('Data mitra berhasil diperbarui!');
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    const ok = deleteMitra(deletingId);
    if (ok) {
      setDeletingId(null);
      loadData();
      showNotification('Akun mitra berhasil dihapus dari sistem.');
    }
  };

  // Filtered List
  const filteredList = mitraList.filter((m) => {
    const matchesSearch =
      m.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.noHpWa.includes(searchTerm) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingList = mitraList.filter((m) => m.status === 'PENDING_APPROVAL');
  const pendingCount = pendingList.length;
  const approvedCount = mitraList.filter((m) => m.status === 'APPROVED').length;
  const blockedCount = mitraList.filter((m) => m.status === 'BLOCKED').length;

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live Database Terhubung (Auto-Sync)
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mt-1">
            <Users className="w-6 h-6 text-[#1D3582]" />
            <span>Manajemen &amp; Verifikasi Mitra Mandiri</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Pantau dan setujui pendaftaran calon mitra dari seluruh perangkat secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Button Input Manual (Solves missing offline/phone registrations) */}
          <button
            type="button"
            onClick={() => {
              setAddError(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1D3582] hover:bg-[#152764] text-white text-xs font-black shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Calon Mitra (Input Manual)</span>
          </button>

          {/* Copy Reg Link */}
          <button
            type="button"
            onClick={handleCopyRegLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Salin Link Registrasi Mitra untuk dikirim ke prospek"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedLink ? 'Link Tersalin!' : 'Link Pendaftaran'}</span>
          </button>

          {/* Refresh Data */}
          <button
            type="button"
            onClick={loadData}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
            <span>{isRefreshing ? 'Sinkronisasi...' : 'Segarkan Data'}</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Pendaftar
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{mitraList.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Semua riwayat registrasi</div>
        </div>

        <div className={`p-4 rounded-2xl border shadow-xs transition-all ${
          pendingCount > 0 
            ? 'bg-amber-100/80 border-amber-300 ring-2 ring-amber-400/40' 
            : 'bg-amber-50/70 border-amber-200'
        }`}>
          <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
            <Clock className={`w-3.5 h-3.5 ${pendingCount > 0 ? 'animate-pulse text-amber-700' : ''}`} />
            <span>Menunggu Approval</span>
          </div>
          <div className="text-2xl font-black text-amber-950 mt-1">{pendingCount}</div>
          <div className="text-[10px] text-amber-800 font-medium mt-0.5">
            {pendingCount > 0 ? '⚠️ Butuh tindakan segera!' : 'Tidak ada antrean'}
          </div>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mitra Aktif (Approved)</span>
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{approvedCount}</div>
          <div className="text-[10px] text-emerald-700 mt-0.5">Akses penuh dashboard</div>
        </div>

        <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200 shadow-xs">
          <div className="text-[11px] font-bold text-red-800 uppercase tracking-wider flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Akun Diblokir</span>
          </div>
          <div className="text-2xl font-black text-red-900 mt-1">{blockedCount}</div>
          <div className="text-[10px] text-red-700 mt-0.5">Akses dinonaktifkan</div>
        </div>
      </div>

      {/* High-Priority Pending Approval Alert Banner */}
      {pendingCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-4 animate-fade-in border-2 border-amber-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-white text-amber-600 shadow-md font-black">
                <Clock className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h4 className="text-base font-black flex items-center gap-2">
                  <span>🚨 {pendingCount} Calon Mitra Menunggu Persetujuan (Approval)</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Perlu Diverifikasi
                  </span>
                </h4>
                <p className="text-xs text-amber-100 mt-0.5">
                  Klik <strong>"Setujui (Approve)"</strong> agar mitra dapat langsung login ke portal dan mengunduh tools penjualan, atau hubungi via WhatsApp untuk konfirmasi berkas.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {pendingList.map((p) => {
              const cleanPhone = p.noHpWa.replace(/\D/g, '');
              const waLink = `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(
                `Halo ${p.namaLengkap}, kami dari Tim Manajemen Kemitraan PT INOVASI TEKNOLOGI DIGITAL INDONESIA (webmurah.biz.id). Pendaftaran kemitraan Anda (ID: ${p.id}) sedang kami tinjau. Apakah ada pertanyaan sebelum kami aktifkan akun Anda?`
              )}`;

              return (
                <div
                  key={p.id}
                  className="bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-4 flex flex-col justify-between gap-3 text-white shadow-sm hover:bg-white/20 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-black text-sm text-white">{p.namaLengkap}</div>
                      <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md shrink-0">
                        PENDING
                      </span>
                    </div>

                    <div className="text-xs text-amber-100 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="font-semibold text-white">WA: {p.noHpWa}</span>
                      <span>&bull;</span>
                      <span className="truncate max-w-[150px]">{p.email}</span>
                    </div>

                    <div className="text-[11px] text-amber-200 font-mono">
                      ID: {p.id} &bull; Domisili: {p.kotaDomisili || '-'}
                    </div>

                    {p.adminNotes && (
                      <div className="text-[11px] text-amber-100/90 italic bg-black/20 p-1.5 rounded-lg mt-1">
                        Catatan: {p.adminNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/20">
                    <button
                      type="button"
                      onClick={() => handleApprove(p.id)}
                      className="flex-1 min-w-[120px] py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui (Approve)</span>
                    </button>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Chat WhatsApp calon mitra"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Chat WA</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleReject(p.id)}
                      className="py-2 px-3 rounded-xl bg-black/30 hover:bg-black/50 text-white font-bold text-xs transition-all cursor-pointer"
                    >
                      Tolak
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan nama, email, no WA, atau ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({mitraList.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('PENDING_APPROVAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
              statusFilter === 'PENDING_APPROVAL'
                ? 'bg-amber-500 text-white font-black'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            Pending ({pendingCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
              statusFilter === 'APPROVED'
                ? 'bg-emerald-600 text-white font-black'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Aktif ({approvedCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('BLOCKED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
              statusFilter === 'BLOCKED'
                ? 'bg-red-600 text-white font-black'
                : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
            }`}
          >
            Blokir ({blockedCount})
          </button>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Mobile Horizontal Scroll Indicator Banner */}
        <div className="sm:hidden px-4 py-2 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-sky-100 text-sky-800 text-[11px] font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span>👉 Geser tabel ke kanan untuk melihat nomor rekening &amp; aksi</span>
          </span>
          <span className="text-[10px] bg-sky-200/60 px-2 py-0.5 rounded-full font-black text-[#1D3582]">
            {filteredList.length} Mitra
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[820px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 min-w-[230px]">Mitra &amp; Kontak</th>
                <th className="py-3 px-4 min-w-[140px]">Status Akun</th>
                <th className="py-3 px-4 min-w-[250px]">Domisili &amp; Rekening</th>
                <th className="py-3 px-4 min-w-[120px]">Tgl Registrasi</th>
                <th className="py-3 px-4 min-w-[170px] text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <div>Tidak ada data mitra yang sesuai dengan pencarian atau filter.</div>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D3582] text-white text-xs font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Input Calon Mitra Manual</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredList.map((m) => {
                  const cleanPhone = m.noHpWa.replace(/\D/g, '');
                  const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

                  // Normalize bank and account fields across all potential property names
                  const bankName = m.namaBank || (m as any).bank || 'BCA';
                  const rawRek = m.nomorRekening || (m as any).noRekening || (m as any).rekening || (m as any).accountNumber || '';
                  const rekNum = typeof rawRek === 'string' ? rawRek.trim() : String(rawRek || '').trim();
                  const pemRek = m.namaPemilikRekening || (m as any).atasNama || (m as any).namaRekening || '';
                  const hasRekening = Boolean(rekNum && rekNum !== '-' && rekNum !== 'undefined' && rekNum !== 'null' && rekNum.length > 2);
                  const isCopied = copiedRekeningId === m.id;

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4 min-w-[230px]">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              m.fotoUrl ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                            }
                            alt={m.namaLengkap}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-black text-slate-900 text-xs">{m.namaLengkap}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{m.id}</div>
                            <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5">
                              <a
                                href={`https://wa.me/${waNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                                title="Chat WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3 text-emerald-600" />
                                <span>{m.noHpWa}</span>
                              </a>
                              <span>&bull;</span>
                              <span className="truncate max-w-[140px] text-slate-500">{m.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 min-w-[140px]">
                        {m.status === 'PENDING_APPROVAL' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] uppercase border border-amber-200 animate-pulse">
                            <Clock className="w-3 h-3 text-amber-700" />
                            Pending Approval
                          </span>
                        )}
                        {m.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-[10px] uppercase border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            Aktif / Approved
                          </span>
                        )}
                        {m.status === 'BLOCKED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-900 font-bold text-[10px] uppercase border border-red-200">
                            <Lock className="w-3 h-3 text-red-700" />
                            Diblokir (Suspend)
                          </span>
                        )}
                        {m.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] uppercase border border-slate-200">
                            <XCircle className="w-3 h-3 text-slate-500" />
                            Ditolak
                          </span>
                        )}
                      </td>

                      {/* Domisili & Bank Rekening */}
                      <td className="py-3.5 px-4 min-w-[250px]">
                        {/* Domisili */}
                        <div className="flex items-center gap-1.5 text-slate-900 font-black text-xs">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{m.kotaDomisili || (m as any).domisili || 'Indonesia'}</span>
                        </div>

                        {/* Rekening Info - High Contrast & Never Truncated */}
                        {hasRekening ? (
                          <div className="mt-1.5 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-xl p-2 transition-colors space-y-1">
                            <div className="flex items-center justify-between gap-1.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="px-1.5 py-0.5 rounded bg-sky-100 text-[#1D3582] font-black text-[10px] tracking-wide uppercase border border-sky-200 shrink-0">
                                  {bankName}
                                </span>
                                <span className="font-mono font-bold text-xs text-slate-900 select-all tracking-wider">
                                  {rekNum}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyRekening(m.id, rekNum)}
                                className="p-1 rounded-md text-slate-400 hover:text-[#1D3582] hover:bg-white transition-all cursor-pointer shrink-0"
                                title="Salin nomor rekening ke clipboard"
                              >
                                {isCopied ? (
                                  <span className="flex items-center text-[10px] text-emerald-600 font-bold gap-0.5">
                                    <Check className="w-3 h-3" />
                                    <span>Tersalin</span>
                                  </span>
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <div className="text-[10px] text-slate-500 truncate" title={pemRek || m.namaLengkap}>
                              a.n. <span className="font-semibold text-slate-800">{pemRek || m.namaLengkap}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center justify-between gap-2 bg-amber-50/80 border border-amber-200/80 rounded-xl px-2.5 py-1.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800">
                              <CreditCard className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Belum Isi Rekening</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(m)}
                              className="text-[10px] font-black text-[#1D3582] bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs hover:bg-slate-50 cursor-pointer"
                              title="Input nomor rekening mitra ini"
                            >
                              + Isi Rek
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 min-w-[120px] text-slate-500 text-[11px] font-medium">
                        {m.tanggalBergabung || new Date(m.createdAt).toLocaleDateString('id-ID')}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 min-w-[170px] text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* If Pending: Approve / Reject */}
                          {m.status === 'PENDING_APPROVAL' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(m.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black shadow-xs transition-all cursor-pointer"
                                title="Setujui Kemitraan"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Setujui</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(m.id)}
                                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition-all cursor-pointer"
                                title="Tolak Pendaftaran"
                              >
                                <XCircle className="w-3 h-3 text-red-500" />
                                <span>Tolak</span>
                              </button>
                            </>
                          )}

                          {/* If Approved: Toggle Block */}
                          {m.status === 'APPROVED' && (
                            <button
                              type="button"
                              onClick={() => handleToggleBlock(m.id)}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-semibold transition-all cursor-pointer"
                              title="Putus akses / Blokir mitra"
                            >
                              <Lock className="w-3 h-3" />
                              <span>Blokir</span>
                            </button>
                          )}

                          {/* If Blocked: Unblock */}
                          {m.status === 'BLOCKED' && (
                            <button
                              type="button"
                              onClick={() => handleToggleBlock(m.id)}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all cursor-pointer"
                              title="Buka blokir mitra"
                            >
                              <Unlock className="w-3 h-3" />
                              <span>Buka Blokir</span>
                            </button>
                          )}

                          {/* Edit Modal */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(m)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-all cursor-pointer"
                            title="Edit Data Mitra"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                          </button>

                          {/* Delete Modal */}
                          <button
                            type="button"
                            onClick={() => setDeletingId(m.id)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 transition-all cursor-pointer"
                            title="Hapus Akun Mitra"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Preview Dashboard Mitra */}
                          {m.status === 'APPROVED' && onOpenMitraDashboard && (
                            <button
                              type="button"
                              onClick={() => onOpenMitraDashboard(m)}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 text-[11px] font-semibold transition-all cursor-pointer"
                              title="Buka Portal Mitra sebagai pengguna ini"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Buka Portal</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL MANUAL ADD MITRA ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-scale-up max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-[#1D3582] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">
                    Input Calon Mitra Baru (Manual)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Gunakan formulir ini untuk memasukkan 2 calon mitra yang sudah mendaftar sebelumnya.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Calon Mitra <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addNama}
                  onChange={(e) => setAddNama(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    placeholder="ahmad@gmail.com"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kota / Domisili
                  </label>
                  <input
                    type="text"
                    value={addKota}
                    onChange={(e) => setAddKota(e.target.value)}
                    placeholder="Contoh: Jakarta / Surabaya"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Pendaftaran
                  </label>
                  <select
                    value={addStatus}
                    onChange={(e) => setAddStatus(e.target.value as MitraStatus)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  >
                    <option value="PENDING_APPROVAL">Pending Approval (Perlu Disetujui)</option>
                    <option value="APPROVED">Langsung Disetujui (Approved Aktif)</option>
                  </select>
                </div>
              </div>

              {/* Data Rekening Bank Mitra */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#1D3582]" />
                  <span>Data Rekening Bank (Bagi Hasil)</span>
                  <span className="text-[10px] text-slate-400 font-normal">(Opsional)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Bank</label>
                    <select
                      value={addBank}
                      onChange={(e) => setAddBank(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    >
                      <option value="BCA">BCA</option>
                      <option value="Mandiri">Bank Mandiri</option>
                      <option value="BRI">BRI</option>
                      <option value="BNI">BNI</option>
                      <option value="BSI">BSI (Syariah)</option>
                      <option value="CIMB">CIMB Niaga</option>
                      <option value="Permata">Permata</option>
                      <option value="Jago">Bank Jago</option>
                      <option value="SeaBank">SeaBank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">No. Rekening</label>
                    <input
                      type="text"
                      value={addRekening}
                      onChange={(e) => setAddRekening(e.target.value)}
                      placeholder="8410293812"
                      className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Pemilik</label>
                    <input
                      type="text"
                      value={addNamaRekening}
                      onChange={(e) => setAddNamaRekening(e.target.value)}
                      placeholder="Atas nama rekening"
                      className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Admin
                </label>
                <textarea
                  rows={2}
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                  placeholder="Contoh: Sudah registrasi via HP mandiri sebelumnya..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1D3582] hover:bg-[#152764] text-white text-xs font-black shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan ke Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editingMitra && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-black text-slate-900">Edit Data Mitra</h4>
                <div className="text-xs font-mono text-slate-500">ID: {editingMitra.id}</div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMitra(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editFormData.namaLengkap || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, namaLengkap: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={editFormData.noHpWa || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, noHpWa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Akun</label>
                  <select
                    value={editFormData.status || 'PENDING_APPROVAL'}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, status: e.target.value as MitraStatus })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  >
                    <option value="PENDING_APPROVAL">Pending Approval</option>
                    <option value="APPROVED">Approved (Aktif)</option>
                    <option value="BLOCKED">Blocked (Diblokir)</option>
                    <option value="REJECTED">Rejected (Ditolak)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Domisili</label>
                  <input
                    type="text"
                    value={editFormData.kotaDomisili || ''}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, kotaDomisili: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  />
                </div>
              </div>

              {/* Data Rekening Bank Edit */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#1D3582]" />
                  <span>Informasi Rekening Bank (Bagi Hasil)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Bank</label>
                    <select
                      value={editFormData.namaBank || 'BCA'}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, namaBank: e.target.value })
                      }
                      className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    >
                      <option value="BCA">BCA</option>
                      <option value="Mandiri">Bank Mandiri</option>
                      <option value="BRI">BRI</option>
                      <option value="BNI">BNI</option>
                      <option value="BSI">BSI (Syariah)</option>
                      <option value="CIMB">CIMB Niaga</option>
                      <option value="Permata">Permata</option>
                      <option value="Jago">Bank Jago</option>
                      <option value="SeaBank">SeaBank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nomor Rekening</label>
                    <input
                      type="text"
                      value={editFormData.nomorRekening || ''}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, nomorRekening: e.target.value })
                      }
                      placeholder="Contoh: 7309876210"
                      className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Pemilik</label>
                    <input
                      type="text"
                      value={editFormData.namaPemilikRekening || ''}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, namaPemilikRekening: e.target.value })
                      }
                      placeholder="Nama di buku tabungan"
                      className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Admin (Internal)
                </label>
                <textarea
                  rows={2}
                  value={editFormData.adminNotes || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, adminNotes: e.target.value })
                  }
                  placeholder="Catatan peninjauan, alasan suspend, atau verifikasi rekening..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMitra(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#1D3582] hover:bg-[#152764] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-900">Hapus Akun Mitra?</h4>
              <p className="text-xs text-slate-500">
                Tindakan ini permanen. Seluruh hak akses, histori perjanjian, dan ID kemitraan akan dihapus dari sistem.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
