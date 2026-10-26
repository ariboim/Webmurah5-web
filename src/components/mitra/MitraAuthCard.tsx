import React, { useState } from 'react';
import {
  Lock,
  User,
  Mail,
  Phone,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Clock,
  Briefcase,
  X,
  FileCheck,
} from 'lucide-react';
import { MitraAccount } from '../../types/mitra';
import { registerMitra, loginMitra, getAllMitra } from '../../utils/mitraStorage';

interface MitraAuthCardProps {
  onLoginSuccess: (mitra: MitraAccount) => void;
  onNavigateToAdmin?: () => void;
}

export const MitraAuthCard: React.FC<MitraAuthCardProps> = ({
  onLoginSuccess,
  onNavigateToAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');

  // Register Form State
  const [regNama, setRegNama] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regKota, setRegKota] = useState('');
  const [regSetujuTarget, setRegSetujuTarget] = useState(false);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Alerts & Notifications
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successPopup, setSuccessPopup] = useState<string | null>(null);
  const [registeredMitra, setRegisteredMitra] = useState<MitraAccount | null>(null);

  // Handle Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regNama.trim()) {
      setErrorMsg('Nama Lengkap wajib diisi.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMsg('Alamat Email Aktif tidak valid.');
      return;
    }
    if (!regPhone.trim() || regPhone.trim().length < 9) {
      setErrorMsg('Nomor WhatsApp Aktif minimal 10 digit.');
      return;
    }
    if (!regSetujuTarget) {
      setErrorMsg('Anda harus menyetujui komitmen WFH dan target evaluasi kemitraan.');
      return;
    }

    const res = registerMitra({
      namaLengkap: regNama,
      email: regEmail,
      noHpWa: regPhone,
      password: regPassword || 'mitra123',
      kotaDomisili: regKota,
    });

    if (res.success && res.mitra) {
      setRegisteredMitra(res.mitra);
      setSuccessPopup(res.message); // "Anda telah terdaftar. Mohon menunggu persetujuan admin."
      // Reset fields
      setRegNama('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegKota('');
      setRegSetujuTarget(false);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginIdentifier.trim()) {
      setErrorMsg('Silakan masukkan Email atau Nomor WhatsApp yang terdaftar.');
      return;
    }

    const res = loginMitra(loginIdentifier, loginPassword);

    if (res.success && res.mitra) {
      onLoginSuccess(res.mitra);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Registration Success Modal Popup */}
      {successPopup && registeredMitra && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                STATUS: PENDING_APPROVAL
              </span>
              <h3 className="text-xl font-black text-slate-900 pt-2">
                Pendaftaran Berhasil Terkirim!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {successPopup}
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Registrasi:</span>
                <span className="font-mono font-bold text-slate-900">{registeredMitra.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Lengkap:</span>
                <span className="font-bold text-slate-900">{registeredMitra.namaLengkap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-900">{registeredMitra.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">WhatsApp:</span>
                <span className="text-slate-900">{registeredMitra.noHpWa}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              Admin PT INOVASI TEKNOLOGI DIGITAL INDONESIA akan segera meninjau permohonan Anda. Setelah disetujui, Anda dapat langsung login dan mengunduh seluruh tools kemitraan.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setSuccessPopup(null);
                  setActiveTab('login');
                  setLoginIdentifier(registeredMitra.email);
                }}
                className="w-full py-2.5 rounded-xl bg-[#1D3582] hover:bg-[#152764] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Tutup &amp; Masuk ke Form Login
              </button>

              {onNavigateToAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setSuccessPopup(null);
                    onNavigateToAdmin();
                  }}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Buka Panel Admin (Untuk Setujui Akun Ini)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Restricted Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Privacy Notice Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#1D3582] to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                Portal Privat &bull; Akses Terbatas
              </div>
              <div className="text-sm font-black text-white">
                Verifikasi Calon Mitra Mandiri
              </div>
            </div>
          </div>

          <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full text-slate-300 font-mono">
            Non-PKWT System
          </span>
        </div>

        {/* Tab Switcher: Register / Login */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-white text-[#1D3582] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Registrasi Calon Mitra</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'bg-white text-[#1D3582] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>2. Login Mitra Terdaftar</span>
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="m-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* ================= REGISTER VIEW ================= */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="text-left space-y-1 mb-2">
                <h4 className="text-base font-black text-slate-900">
                  Formulir Registrasi Mitra Mandiri
                </h4>
                <p className="text-xs text-slate-500">
                  Setelah mengirim formulir, akun Anda akan berstatus <strong>PENDING_APPROVAL</strong> menunggu verifikasi admin.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={regNama}
                    onChange={(e) => setRegNama(e.target.value)}
                    placeholder="Nama Lengkap Anda"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email Aktif <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0812xxxxxxx"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    required
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
                    value={regKota}
                    onChange={(e) => setRegKota(e.target.value)}
                    placeholder="Contoh: Bekasi / Jakarta"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kata Sandi / PIN Login
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    />
                  </div>
                </div>
              </div>

              {/* Checkbox Persetujuan Awal */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regSetujuTarget}
                    onChange={(e) => setRegSetujuTarget(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#1D3582] rounded border-slate-300 focus:ring-[#1D3582]"
                  />
                  <span>
                    Saya bersedia mengikuti sistem kemitraan perdata mandiri (Non-PKWT), skema kerja Work From Home (WFH), dan target evaluasi omzet minimal Rp 10.000.000/bulan konsisten 3 bulan.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1D3582] hover:bg-[#152764] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Daftar Kemitraan &amp; Ajukan Verifikasi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ================= LOGIN VIEW ================= */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="text-left space-y-1 mb-2">
                <h4 className="text-base font-black text-slate-900">
                  Masuk ke Portal Mitra Resmi
                </h4>
                <p className="text-xs text-slate-500">
                  Gunakan email atau nomor WhatsApp yang telah disetujui (APPROVED) oleh admin.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email atau Nomor WhatsApp Terdaftar
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="nama@email.com atau 0812xxxx"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi / PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi Anda"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  *Masukkan kata sandi atau PIN akun yang telah didaftarkan.
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1D3582] hover:bg-[#152764] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Masuk ke Dashboard Mitra</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Akses & Tanda Khusus: Login Dashboard Admin */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-slate-700">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-black">
                    <Lock className="w-4 h-4" />
                  </span>
                  <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Akses Khusus Admin &bull; PT ITDI
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  Panel pengelola untuk verifikasi/approval mitra baru, suspend akun, &amp; kelola artikel blog.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onNavigateToAdmin) {
                    onNavigateToAdmin();
                  } else {
                    window.location.hash = '#/admin';
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black tracking-wide transition-all shadow-md cursor-pointer shrink-0"
              >
                <KeyRound className="w-4 h-4 text-slate-950" />
                <span>Login Dashboard Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
