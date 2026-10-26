import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Unlink,
  Eraser,
  Code,
  Eye,
  FileCode,
  Check,
  ExternalLink,
  Compass,
  X,
  Type,
} from 'lucide-react';
import { sanitizeArticleHtml } from '../utils/sanitizeHtml';

interface RichTextEditorProps {
  value: string;
  onChange: (htmlContent: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Mulai tulis isi artikel Anda di sini... Gunakan toolbar di atas untuk menebalkan teks, membuat miring, garis bawah, menambahkan judul, daftar, atau menyisipkan tautan (link).',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'visual' | 'code' | 'preview'>('visual');
  const [htmlSource, setHtmlSource] = useState(value);
  
  // Link Dialog Modal State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkTab, setLinkTab] = useState<'external' | 'internal'>('internal');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkOpenNewTab, setLinkOpenNewTab] = useState(true);
  const [savedSelectionRange, setSavedSelectionRange] = useState<Range | null>(null);

  // Sync editor innerHTML when external value changes
  useEffect(() => {
    if (editorRef.current && viewMode === 'visual') {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setHtmlSource(value || '');
  }, [value, viewMode]);

  // Handle content change in visual mode
  const handleContentInput = () => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      setHtmlSource(currentHtml);
      const sanitized = sanitizeArticleHtml(currentHtml);
      onChange(sanitized);
    }
  };

  // Execute standard formatting commands
  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (viewMode !== 'visual') return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleContentInput();
  };

  // Open Link Modal and preserve text selection
  const handleOpenLinkModal = () => {
    if (viewMode !== 'visual') return;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSavedSelectionRange(range);
      const selectedText = range.toString().trim();
      setLinkText(selectedText);
    } else {
      setSavedSelectionRange(null);
      setLinkText('');
    }

    setLinkUrl('');
    setLinkOpenNewTab(true);
    setLinkTab('internal');
    setShowLinkModal(true);
  };

  // Apply Link from Modal
  const handleApplyLink = () => {
    if (!linkUrl.trim()) return;

    editorRef.current?.focus();

    // Restore saved selection
    const selection = window.getSelection();
    if (savedSelectionRange && selection) {
      selection.removeAllRanges();
      selection.addRange(savedSelectionRange);
    }

    let finalHref = linkUrl.trim();
    const isExternal = finalHref.startsWith('http://') || finalHref.startsWith('https://');

    // Create anchor element
    const a = document.createElement('a');
    a.href = finalHref;
    if (isExternal && linkOpenNewTab) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    a.className = 'text-sky-600 hover:text-sky-800 underline font-semibold';
    a.textContent = linkText.trim() || finalHref;

    if (savedSelectionRange && !savedSelectionRange.collapsed && savedSelectionRange.toString().trim().length > 0) {
      // Wrap selected text
      const selectedContent = savedSelectionRange.extractContents();
      a.innerHTML = '';
      a.appendChild(selectedContent);
      savedSelectionRange.insertNode(a);
    } else if (savedSelectionRange) {
      savedSelectionRange.insertNode(a);
    } else {
      // Fallback insert at current caret or end
      document.execCommand(
        'insertHTML',
        false,
        `<a href="${finalHref}" ${isExternal && linkOpenNewTab ? 'target="_blank" rel="noopener noreferrer"' : ''} class="text-sky-600 hover:text-sky-800 underline font-semibold">${linkText.trim() || finalHref}</a>`
      );
    }

    handleContentInput();
    setShowLinkModal(false);
  };

  // Remove active link around caret
  const handleRemoveLink = () => {
    executeCommand('unlink');
  };

  // Quick internal links presets
  const INTERNAL_LINKS = [
    { label: 'Beranda Website', href: '#/beranda', desc: 'Arahkan pengunjung ke halaman utama' },
    { label: 'Paket Promo Rp 499rb', href: '#/harga', desc: 'Arahkan langsung ke bagian harga promo' },
    { label: 'Portofolio & Fitur', href: '#/fitur', desc: 'Arahkan ke galeri demo website' },
    { label: 'Koleksi Artikel UMKM', href: '#/artikel', desc: 'Arahkan ke daftar artikel & studi kasus' },
    { label: 'Formulir Pemesanan', href: '#/order', desc: 'Arahkan ke form order kilat' },
    { label: 'Konsultasi WhatsApp', href: 'https://wa.me/6289673686625?text=Halo%20Admin%20Webkilat,%20saya%20tertarik%20dengan%20artikel%20website%20Anda', desc: 'Buka chat langsung dengan admin WA' },
  ];

  // Word count & Char count
  const textContent = htmlSource.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent ? textContent.split(' ').filter(Boolean).length : 0;
  const charCount = textContent.length;

  return (
    <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 transition-all">
      {/* Top Toolbar */}
      <div className="bg-slate-50/90 border-b border-slate-200 p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2 select-none">
        {/* Left: Formatting buttons (WordPress / Blogger style) */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Style: Bold, Italic, Underline, Strike */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              title="Tebal / Bold (Ctrl+B)"
              className="p-1.5 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-slate-100 cursor-pointer active:scale-95 transition-all"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              title="Miring / Italic (Ctrl+I)"
              className="p-1.5 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-slate-100 cursor-pointer active:scale-95 transition-all"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              title="Garis Bawah / Underline (Ctrl+U)"
              className="p-1.5 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-slate-100 cursor-pointer active:scale-95 transition-all"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('strikeThrough')}
              title="Coret / Strikethrough"
              className="p-1.5 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-slate-100 cursor-pointer active:scale-95 transition-all"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          {/* Heading controls */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => executeCommand('formatBlock', '<h2>')}
              title="Judul Bab / Heading 2"
              className="px-2 py-1.5 rounded-lg text-xs font-black text-slate-700 hover:text-sky-700 hover:bg-slate-100 cursor-pointer flex items-center gap-0.5"
            >
              <Heading2 className="w-4 h-4" />
              <span className="hidden sm:inline">H2</span>
            </button>
            <button
              type="button"
              onClick={() => executeCommand('formatBlock', '<h3>')}
              title="Subjudul / Heading 3"
              className="px-2 py-1.5 rounded-lg text-xs font-black text-slate-700 hover:text-sky-700 hover:bg-slate-100 cursor-pointer flex items-center gap-0.5"
            >
              <Heading3 className="w-4 h-4" />
              <span className="hidden sm:inline">H3</span>
            </button>
            <button
              type="button"
              onClick={() => executeCommand('formatBlock', '<p>')}
              title="Paragraf Biasa"
              className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-sky-700 hover:bg-slate-100 cursor-pointer"
            >
              Normal
            </button>
          </div>

          {/* Lists & Quote */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              title="Daftar Poin (Bullet List)"
              className="p-1.5 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-slate-100 cursor-pointer active:scale-95 transition-all"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('insertOrderedList')}
              title="Daftar Angka (Numbered List)"
              className="p-1.5 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-slate-100 cursor-pointer active:scale-95 transition-all"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('formatBlock', '<blockquote>')}
              title="Kutipan / Blockquote"
              className="p-1.5 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-slate-100 cursor-pointer active:scale-95 transition-all"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* Link Controls */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handleOpenLinkModal}
              title="Sisipkan Tautan (Link Internal / Eksternal)"
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-sky-700 hover:bg-sky-50 cursor-pointer flex items-center gap-1.5"
            >
              <Link2 className="w-4 h-4 text-sky-600" />
              <span>Pasang Link</span>
            </button>
            <button
              type="button"
              onClick={handleRemoveLink}
              title="Hapus Link pada teks ini"
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 cursor-pointer"
            >
              <Unlink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clear Format */}
          <button
            type="button"
            onClick={() => executeCommand('removeFormat')}
            title="Hapus Pemformatan Teks"
            className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* Right: View Mode Toggle (Visual vs HTML Code vs Preview) */}
        <div className="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode('visual')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === 'visual'
                ? 'bg-white text-sky-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Visual</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('code')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === 'code'
                ? 'bg-white text-sky-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>HTML</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === 'preview'
                ? 'bg-white text-sky-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau</span>
          </button>
        </div>
      </div>

      {/* Editor Body Area */}
      <div className="relative min-h-[280px] p-4 bg-white">
        {/* MODE 1: VISUAL WYSIWYG EDITOR */}
        {viewMode === 'visual' && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentInput}
            onBlur={handleContentInput}
            className="outline-none min-h-[260px] text-slate-800 text-sm sm:text-base leading-relaxed space-y-3 prose max-w-none focus:outline-hidden"
            data-placeholder={placeholder}
          />
        )}

        {/* MODE 2: RAW HTML CODE EDITOR */}
        {viewMode === 'code' && (
          <div className="space-y-2">
            <div className="text-[11px] text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-sky-600" />
              <span>Kode HTML Sumber (Dapat diedit langsung atau disalin dari WordPress/Blogger):</span>
            </div>
            <textarea
              value={htmlSource}
              onChange={(e) => {
                setHtmlSource(e.target.value);
                const sanitized = sanitizeArticleHtml(e.target.value);
                onChange(sanitized);
              }}
              rows={12}
              className="w-full p-3.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 bg-slate-900 text-emerald-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden leading-relaxed"
            />
          </div>
        )}

        {/* MODE 3: LIVE PREVIEW */}
        {viewMode === 'preview' && (
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-4">
            <div className="text-xs font-black text-sky-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <Eye className="w-4 h-4 text-sky-600" />
              <span>Tampilan Yang Akan Dilihat Pembaca:</span>
            </div>
            <div
              className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(htmlSource) || '<p className="text-slate-400 italic">Belum ada teks artikel...</p>' }}
            />
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <div className="flex items-center gap-3">
          <span>{wordCount} kata</span>
          <span>•</span>
          <span>{charCount} karakter</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-slate-600 font-semibold">Sanitasi XSS Aktif (DOMPurify)</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POPUP MODAL: PASANG TAUTAN / LINK (INTERNAL & EKSTERNAL) */}
      {/* ========================================================================= */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative border border-slate-200">
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowLinkModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Sisipkan Tautan (Link)</h3>
                <p className="text-xs text-slate-500">Pilih link internal website atau link eksternal ke situs luar</p>
              </div>
            </div>

            {/* Tab: Internal vs Eksternal */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setLinkTab('internal')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  linkTab === 'internal'
                    ? 'bg-white text-sky-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>Link Halaman Internal</span>
              </button>
              <button
                type="button"
                onClick={() => setLinkTab('external')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  linkTab === 'external'
                    ? 'bg-white text-sky-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                <span>Link Eksternal (Website Luar)</span>
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Teks yang ditampilkan */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Teks Tautan (Anchor Text)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Contoh: Klik di sini untuk melihat promo Rp 499rb"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              {/* TAB 1: INTERNAL LINKS PRESETS */}
              {linkTab === 'internal' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Pilih Tujuan Halaman Internal Website:
                  </label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {INTERNAL_LINKS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setLinkUrl(preset.href);
                          if (!linkText.trim()) setLinkText(preset.label);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          linkUrl === preset.href
                            ? 'bg-sky-50 border-sky-300 text-sky-900'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{preset.label}</div>
                          <div className="text-[10px] text-slate-500">{preset.desc} ({preset.href})</div>
                        </div>
                        {linkUrl === preset.href && (
                          <Check className="w-4 h-4 text-sky-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      Atau ketik URL tujuan internal:
                    </label>
                    <input
                      type="text"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="#/harga atau /tentang-kami"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: EXTERNAL LINK */}
              {linkTab === 'external' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      URL Link Eksternal <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://instagram.com/akunbisnis atau https://situsanda.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={linkOpenNewTab}
                        onChange={(e) => setLinkOpenNewTab(e.target.checked)}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                      />
                      <span>Buka di tab baru (<code>target="_blank"</code>)</span>
                    </label>
                    <p className="text-[10px] text-slate-500 pl-6">
                      Secara otomatis disematkan atribut keamanan <code>rel="noopener noreferrer"</code> untuk mencegah serangan tabnabbing.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!linkUrl.trim()}
                onClick={handleApplyLink}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-98 disabled:opacity-50 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Terapkan Tautan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
