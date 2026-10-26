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
} from 'lucide-react';
import { MitraAccount, MitraStatus } from '../../types/mitra';
import {
  getAllMitra,
  approveMitra,
  rejectMitra,
  toggleBlockMitra,
  updateMitraProfile,
  deleteMitra,
} from '../../utils/mitraStorage';

export const AdminMitraManagement: React.FC<{
  onOpenMitraDashboard?: (mitra: MitraAccount) => void;
}> = ({ onOpenMitraDashboard }) => {
  const [mitraList, setMitraList] = useState<MitraAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal Edit State
  const [editingMitra, setEditingMitra] = useState<MitraAccount | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<MitraAccount>>({});

  // Confirmation Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Success Notice
  const [notice, setNotice] = useState<string | null>(null);

  const loadData = () => {
    setMitraList(getAllMitra());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  // Actions
  const handleApprove = (id: string) => {
    const ok = approveMitra(id);
    if (ok) {
      loadData();
      showNotification('Akun mitra berhasil disetujui (APPROVED)!');
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

  const pendingCount = mitraList.filter((m) => m.status === 'PENDING_APPROVAL').length;
  const approvedCount = mitraList.filter((m) => m.status === 'APPROVED').length;
  const blockedCount = mitraList.filter((m) => m.status === 'BLOCKED').length;

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#1D3582]" />
            <span>Manajemen &amp; Verifikasi Mitra Mandiri</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Kelola approval calon mitra, blokir akun, edit profil, dan pantau status perjanjian non-PKWT.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Segarkan Data</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
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

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-xs">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Approval</span>
          </div>
          <div className="text-2xl font-black text-amber-900 mt-1">{pendingCount}</div>
          <div className="text-[10px] text-amber-700 mt-0.5">Memerlukan persetujuan</div>
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
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg space-y-3 animate-fade-in border-2 border-amber-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-white text-amber-600 shadow-md font-black">
                <Clock className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h4 className="text-base font-black">
                  🚨 {pendingCount} Calon Mitra Membutuhkan Persetujuan (Approval) Segera!
                </h4>
                <p className="text-xs text-amber-100">
                  Calon mitra berikut telah mengisi formulir registrasi dan menunggu Anda menyetujui akun mereka agar dapat login dan mengakses dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {mitraList
              .filter((m) => m.status === 'PENDING_APPROVAL')
              .map((p) => (
                <div
                  key={p.id}
                  className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white shadow-sm"
                >
                  <div className="min-w-0">
                    <div className="font-black text-sm">{p.namaLengkap}</div>
                    <div className="text-xs text-amber-100 flex items-center gap-2 mt-0.5">
                      <span>WA: {p.noHpWa}</span>
                      <span>&bull;</span>
                      <span className="truncate max-w-[130px]">{p.email}</span>
                    </div>
                    <div className="text-[10px] text-amber-200 font-mono mt-0.5">
                      ID: {p.id} &bull; Domisili: {p.kotaDomisili || '-'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApprove(p.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui (Approve)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(p.id)}
                      className="px-2.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-white font-bold text-xs transition-all cursor-pointer"
                    >
                      Tolak
                    </button>
                  </div>
                </div>
              ))}
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
                ? 'bg-amber-500 text-white'
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
                ? 'bg-emerald-600 text-white'
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
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
            }`}
          >
            Blokir ({blockedCount})
          </button>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Mitra &amp; Kontak</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4">Domisili &amp; Rekening</th>
                <th className="py-3 px-4">Tgl Registrasi</th>
                <th className="py-3 px-4 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ada data mitra yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((m) => {
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
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
                              <span className="text-emerald-700 font-semibold">{m.noHpWa}</span>
                              <span>&bull;</span>
                              <span className="truncate max-w-[140px] text-slate-500">{m.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {m.status === 'PENDING_APPROVAL' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                            <Clock className="w-3 h-3" />
                            Pending Approval
                          </span>
                        )}
                        {m.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                            <CheckCircle2 className="w-3 h-3" />
                            Aktif / Approved
                          </span>
                        )}
                        {m.status === 'BLOCKED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold text-[10px] uppercase">
                            <Lock className="w-3 h-3" />
                            Diblokir (Suspend)
                          </span>
                        )}
                        {m.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                            <XCircle className="w-3 h-3" />
                            Ditolak
                          </span>
                        )}
                      </td>

                      {/* Domisili & Bank */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-semibold">
                          {m.kotaDomisili || 'Indonesia'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {m.namaBank ? `${m.namaBank} - ${m.nomorRekening || '-'}` : 'Belum diisi'}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {m.tanggalBergabung || new Date(m.createdAt).toLocaleDateString('id-ID')}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* If Pending: Approve / Reject */}
                          {m.status === 'PENDING_APPROVAL' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(m.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer"
                                title="Setujui Kemitraan"
                              >
                                <CheckCircle2 className="w-3 h-3" />
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
