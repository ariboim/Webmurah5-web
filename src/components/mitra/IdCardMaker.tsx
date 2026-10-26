import React, { useState, useRef } from 'react';
import {
  CreditCard,
  Download,
  Printer,
  Upload,
  RefreshCw,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Building,
  CheckCircle2,
  Calendar,
  User,
  QrCode,
  Loader2,
} from 'lucide-react';
import { MitraAccount } from '../../types/mitra';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

interface IdCardMakerProps {
  mitra: MitraAccount;
  onUpdateMitra?: (updates: Partial<MitraAccount>) => void;
}

export const IdCardMaker: React.FC<IdCardMakerProps> = ({ mitra, onUpdateMitra }) => {
  const [namaLengkap, setNamaLengkap] = useState(mitra.namaLengkap);
  const [jabatan, setJabatan] = useState('Official Digital Consultant');
  const [noWa, setNoWa] = useState(mitra.noHpWa);
  const [email, setEmail] = useState(mitra.email);
  const [photoUrl, setPhotoUrl] = useState(
    mitra.fotoUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  );
  const [validUntil, setValidUntil] = useState('31 Desember 2027');
  const [activeSide, setActiveSide] = useState<'both' | 'front' | 'back'>('both');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const cardFrontRef = useRef<HTMLDivElement | null>(null);
  const cardBackRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const referralUrl = `https://webmurah.biz.id/?ref=${encodeURIComponent(mitra.id)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(referralUrl)}`;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
          if (onUpdateMitra) {
            onUpdateMitra({ fotoUrl: reader.result });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadIdCardPdf = async () => {
    if (!cardFrontRef.current || !cardBackRef.current) return;
    setIsExporting(true);
    setDownloadNotice(null);

    const safeName = namaLengkap.replace(/[^a-zA-Z0-9]/g, '_') || 'Mitra';

    try {
      const canvasFront = await html2canvas(cardFrontRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });

      const canvasBack = await html2canvas(cardBackRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });

      // Standard CR80 is 85.6mm x 53.98mm
      const cardWidthMm = 85.6;
      const cardHeightMm = 53.98;

      // We generate an A4 sheet with cutting guides and both Front & Back side
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Title & instruction
      pdf.setFontSize(14);
      pdf.setTextColor(29, 53, 130);
      pdf.text('KARTU IDENTITAS MITRA RESMI (ID CARD CR80)', 20, 25);

      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text('PT INOVASI TEKNOLOGI DIGITAL INDONESIA • WEBMURAH.BIZ.ID', 20, 31);
      pdf.text(`Nama: ${namaLengkap} | ID: ${mitra.id}`, 20, 36);

      // Render Front Card
      const frontImgData = canvasFront.toDataURL('image/png');
      pdf.setDrawColor(203, 213, 225); // Border line for cutting
      pdf.rect(20, 45, cardWidthMm, cardHeightMm);
      pdf.addImage(frontImgData, 'PNG', 20, 45, cardWidthMm, cardHeightMm);

      // Render Back Card side by side or below
      const backImgData = canvasBack.toDataURL('image/png');
      pdf.rect(110, 45, cardWidthMm, cardHeightMm);
      pdf.addImage(backImgData, 'PNG', 110, 45, cardWidthMm, cardHeightMm);

      // Cutting guide note
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
      pdf.text(
        '*Gunakan kertas PVC Card atau Art Paper 260/310 gsm dengan laminasi glossy/doff untuk hasil terbaik.',
        20,
        110
      );

      pdf.save(`ID-Card-CR80-${safeName}.pdf`);
      setDownloadNotice('ID Card CR80 (Front & Back) berhasil diunduh dalam format PDF Siap Cetak!');
      setTimeout(() => setDownloadNotice(null), 4000);
    } catch (err) {
      console.error('Error generating ID card PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-100 text-[#1D3582]">
              <CreditCard className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-slate-900">
              Self-Service ID Card Maker (Standar CR80)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cetak kartu identitas resmi kemitraan mandiri PT INOVASI TEKNOLOGI DIGITAL INDONESIA. Lengkap dengan QR Code verifikasi dan garis potong standar cetak PVC/Art Paper.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadIdCardPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D3582] hover:bg-[#152764] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Membuat Dokumen...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh PDF ID Card CR80</span>
              </>
            )}
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Editor & Preview Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Customization Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
            Kustomisasi Data Kartu
          </h4>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Foto Profil Mitra
            </label>
            <div className="flex items-center gap-3">
              <img
                src={photoUrl}
                alt="Avatar Mitra"
                className="w-14 h-14 rounded-xl object-cover border border-slate-300 shadow-2xs shrink-0"
              />
              <div className="space-y-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Foto</span>
                </button>
                <div className="text-[10px] text-slate-400">
                  Format JPG/PNG rasio pas foto 3x4 / 1:1
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap &amp; Gelar
            </label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan / Role</label>
            <input
              type="text"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nomor WhatsApp Aktif
            </label>
            <input
              type="text"
              value={noWa}
              onChange={(e) => setNoWa(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Aktif</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Masa Berlaku (Valid Thru)
            </label>
            <input
              type="text"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D3582]"
            />
          </div>
        </div>

        {/* Right: Live Interactive Card Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 p-6 rounded-3xl flex flex-col items-center justify-center space-y-6 shadow-xl overflow-x-auto">
            {/* FRONT SIDE (CR80: 340px x 215px ratio) */}
            <div className="space-y-2 text-center">
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest">
                TAMPILAN DEPAN (FRONT SIDE)
              </span>

              <div
                ref={cardFrontRef}
                style={{ width: '340px', height: '215px' }}
                className="bg-gradient-to-br from-[#1D3582] via-[#152764] to-slate-950 text-white rounded-2xl p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between shrink-0 border border-blue-400/30"
              >
                {/* Background decorative circles & watermark */}
                <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-blue-500/10 pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-sky-400/10 pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-blue-400/30 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                      ★
                    </div>
                    <div className="text-left">
                      <div className="text-[9px] font-black tracking-tight leading-none text-white">
                        PT INOVASI TEKNOLOGI DIGITAL INDONESIA
                      </div>
                      <div className="text-[7px] text-amber-300 font-mono tracking-widest uppercase">
                        webmurah.biz.id &bull; Mitra Resmi
                      </div>
                    </div>
                  </div>
                  <div className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-blue-900/80 border border-blue-400/40 text-blue-200">
                    CR80
                  </div>
                </div>

                {/* Card Body: Photo & Identity */}
                <div className="flex items-center gap-3 my-1">
                  <div className="relative shrink-0">
                    <img
                      src={photoUrl}
                      alt={namaLengkap}
                      className="w-16 h-20 rounded-lg object-cover border-2 border-amber-400 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[7px] font-bold">
                      ✓
                    </div>
                  </div>

                  <div className="text-left space-y-0.5 min-w-0 flex-1">
                    <div className="text-[8px] uppercase tracking-wider text-amber-300 font-extrabold">
                      Mitra Konsultan
                    </div>
                    <div className="text-sm font-black text-white truncate leading-tight">
                      {namaLengkap}
                    </div>
                    <div className="text-[9px] text-blue-200 font-medium leading-tight truncate">
                      {jabatan}
                    </div>
                    <div className="text-[8px] font-mono text-slate-300 pt-1">
                      ID: <span className="font-bold text-amber-300">{mitra.id}</span>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-1 rounded-md shrink-0 shadow-xs text-center">
                    <img
                      src={qrCodeUrl}
                      alt="QR Mitra"
                      className="w-12 h-12 object-contain"
                    />
                    <div className="text-[6px] font-bold text-slate-900 mt-0.5">SCAN ME</div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between border-t border-blue-400/30 pt-1.5 text-[8px] text-blue-200 font-mono">
                  <span>VALID THRU: {validUntil}</span>
                  <span className="text-amber-300 font-bold uppercase">OFFICIAL ID</span>
                </div>
              </div>
            </div>

            {/* BACK SIDE (CR80: 340px x 215px ratio) */}
            <div className="space-y-2 text-center">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                TAMPILAN BELAKANG (BACK SIDE)
              </span>

              <div
                ref={cardBackRef}
                style={{ width: '340px', height: '215px' }}
                className="bg-slate-950 text-slate-100 rounded-2xl p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between shrink-0 border border-slate-800"
              >
                {/* Magnetic / Chip Simulation Strip */}
                <div className="absolute top-4 left-0 right-0 h-8 bg-slate-900 border-y border-slate-800" />

                <div className="pt-9 space-y-1 text-left">
                  <div className="text-[7.5px] text-slate-400 leading-tight">
                    1. Kartu ini merupakan bukti kemitraan mandiri resmi pada PT Inovasi Teknologi Digital Indonesia.
                  </div>
                  <div className="text-[7.5px] text-slate-400 leading-tight">
                    2. Digunakan untuk verifikasi keabsahan konsultasi digital &amp; pemesanan via webmurah.biz.id.
                  </div>
                  <div className="text-[7.5px] text-slate-400 leading-tight">
                    3. Jika menemukan kartu ini, harap mengembalikan ke kantor PT ITDI atau hubungi kontak tertera.
                  </div>
                </div>

                {/* Signature Bar & Contact */}
                <div className="flex items-end justify-between border-t border-slate-800 pt-2 text-left">
                  <div className="space-y-0.5">
                    <div className="text-[7px] text-slate-500 uppercase font-mono">
                      Kontak Terverifikasi:
                    </div>
                    <div className="text-[8px] font-bold text-emerald-400">WA: {noWa}</div>
                    <div className="text-[8px] text-slate-300 truncate max-w-[180px]">{email}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[7px] text-slate-500 font-mono">TTD RESMI MITRA</div>
                    <div className="w-24 h-6 border-b border-dashed border-slate-600 flex items-center justify-center text-[8px] italic text-slate-400">
                      {namaLengkap.split(' ')[0]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
