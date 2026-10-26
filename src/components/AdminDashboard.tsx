import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  PlusCircle,
  FileText,
  Settings,
  LogOut,
  Image as ImageIcon,
  Video as VideoIcon,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit3,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Youtube,
  FolderOpen,
  TrendingUp,
  Clock,
  Calendar,
  Save,
  RotateCcw,
  Mail,
  Send,
  Users,
  Copy,
  Inbox,
  X,
  Tag,
  Search,
  Zap,
  Play,
} from 'lucide-react';
import {
  Article,
  ArticleCategory,
  getAllArticles,
  getCustomArticlesOnly,
  saveArticle,
  deleteArticle,
  resetArticlesToDefault,
  getAllCategories,
  saveCategory,
  deleteCategory,
  resetCategoriesToDefault,
  getAdminCredentials,
  verifyAdminLogin,
  updateAdminCredentials,
  isAdminLoggedIn,
  setAdminSession,
} from '../utils/articleStorage';
import {
  convertGoogleDriveImageUrl,
  convertGoogleDriveVideoUrl,
  convertYouTubeEmbedUrl,
  detectVideoSource,
  readFileAsDataUrl,
  extractGoogleDriveId,
  extractYouTubeId,
} from '../utils/mediaUtils';
import { IndoDigitalLogo } from './IndoDigitalLogo';
import { RichTextEditor } from './RichTextEditor';
import { AdminMitraManagement } from './mitra/AdminMitraManagement';
import { getAllMitra } from '../utils/mitraStorage';

interface AdminDashboardProps {
  onNavigateToPublicArticles: () => void;
  onNavigateToHome: () => void;
}

type AdminTab = 'mitra' | 'create' | 'list' | 'categories' | 'autopost' | 'newsletter' | 'settings';

export const CATEGORY_COLOR_PRESETS = [
  { id: 'sky', label: 'Biru (Sky)', color: 'bg-sky-50 text-sky-800 border-sky-200', dot: 'bg-sky-500' },
  { id: 'amber', label: 'Kuning / Emas (Amber)', color: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  { id: 'indigo', label: 'Ungu Indigo', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-600' },
  { id: 'emerald', label: 'Hijau Zamrud (Emerald)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  { id: 'rose', label: 'Merah Mawar (Rose)', color: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-500' },
  { id: 'purple', label: 'Ungu Violet (Purple)', color: 'bg-purple-50 text-purple-800 border-purple-200', dot: 'bg-purple-500' },
  { id: 'teal', label: 'Teal / Toska', color: 'bg-teal-50 text-teal-800 border-teal-200', dot: 'bg-teal-500' },
  { id: 'slate', label: 'Abu-Abu Netral (Slate)', color: 'bg-slate-100 text-slate-800 border-slate-300', dot: 'bg-slate-500' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateToPublicArticles,
  onNavigateToHome,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAdminLoggedIn);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccessNotice, setLoginSuccessNotice] = useState('');

  // Active Admin Sub-tab (Defaults to 'mitra' for quick partner approval)
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    try {
      const hash = (window.location.hash || '').toLowerCase();
      if (hash.includes('artikel') || hash.includes('blog') || hash.includes('post')) return 'create';
    } catch {}
    return 'mitra';
  });

  // Mitra live counts for badges
  const [mitraStats, setMitraStats] = useState(() => {
    const list = getAllMitra();
    return {
      total: list.length,
      pending: list.filter((m) => m.status === 'PENDING_APPROVAL').length,
    };
  });

  const refreshMitraStats = () => {
    const list = getAllMitra();
    setMitraStats({
      total: list.length,
      pending: list.filter((m) => m.status === 'PENDING_APPROVAL').length,
    });
  };

  useEffect(() => {
    refreshMitraStats();
  }, [activeTab]);

  // Articles State
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [articleDeleteModal, setArticleDeleteModal] = useState<{ id: string; title: string; isCustom?: boolean } | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  // Categories State
  const [categories, setCategories] = useState<ArticleCategory[]>(getAllCategories);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('bg-sky-50 text-sky-800 border-sky-200');
  const [categoryNotice, setCategoryNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State for Article Input
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState('Tips Bisnis & Marketing');
  const [formCustomCategory, setFormCustomCategory] = useState('');
  const [formReadTime, setFormReadTime] = useState('4 Menit Baca');
  const [formSourceName, setFormSourceName] = useState('Admin Indo Digital');
  const [formKeyStat, setFormKeyStat] = useState('+350%');
  const [formKeyStatLabel, setFormKeyStatLabel] = useState('Kenaikan Pesanan');
  const [formSummary, setFormSummary] = useState('');

  // Media: Image
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'drive' | 'url'>('upload');
  const [imageFilePreview, setImageFilePreview] = useState<string>('');
  const [imageDriveUrl, setImageDriveUrl] = useState('');
  const [imageDirectUrl, setImageDirectUrl] = useState('');
  const [finalImageUrl, setFinalImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Media: Video
  const [videoInputMode, setVideoInputMode] = useState<'none' | 'youtube' | 'drive'>('none');
  const [videoRawUrl, setVideoRawUrl] = useState('');
  const [finalVideoEmbedUrl, setFinalVideoEmbedUrl] = useState<string>('');
  const [videoSourceType, setVideoSourceType] = useState<'youtube' | 'drive' | 'direct' | 'none'>('none');

  // Content mode: simple (body text) vs structured
  const [contentMode, setContentMode] = useState<'simple' | 'structured'>('simple');
  const [formBodyText, setFormBodyText] = useState('');
  const [formBackground, setFormBackground] = useState('');
  const [formChallenge, setFormChallenge] = useState('');
  const [formStrategies, setFormStrategies] = useState<string>('');
  const [formResult, setFormResult] = useState('');
  const [formTakeaway, setFormTakeaway] = useState('');

  // Notifications
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');

  // Settings State: Change Username & Password
  const [currentAdminUser, setCurrentAdminUser] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsNotice, setSettingsNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Newsletter & Subscribers State
  const [subscribers, setSubscribers] = useState<Array<{ email: string; subscribedAt: string; status: string }>>([]);
  const [sendNewsletterOnPost, setSendNewsletterOnPost] = useState<boolean>(true);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastModal, setBroadcastModal] = useState<any | null>(null);
  const [newManualEmail, setNewManualEmail] = useState<string>('');
  const [manualBroadcastArticleId, setManualBroadcastArticleId] = useState<string>('');
  const [smtpConfig, setSmtpConfig] = useState<any>({
    host: 'smtp.gmail.com',
    port: 465,
    user: '',
    pass: '',
    fromName: 'Webkilat / Indo Digital',
    fromEmail: '',
    isConfigured: false,
  });
  const [smtpNotice, setSmtpNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingSmtp, setIsSavingSmtp] = useState<boolean>(false);

  // Delivery Logs & Test Send State
  const [deliveryLogs, setDeliveryLogs] = useState<any[]>([]);
  const [testEmailTarget, setTestEmailTarget] = useState<string>('bca.ccpl@gmail.com');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState<boolean>(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string; error?: string } | null>(null);

  // Auto-Scheduler State (2 Articles / Day)
  const [schedulerStatus, setSchedulerStatus] = useState<any>(null);
  const [isTriggeringAutoPost, setIsTriggeringAutoPost] = useState(false);
  const [autoPostNotice, setAutoPostNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSubscribers = () => {
    fetch('/api/newsletter/subscribers')
      .then((r) => r.json())
      .then((data) => {
        if (data.subscribers) setSubscribers(data.subscribers);
      })
      .catch((err) => console.error('Fetch subscribers error:', err));
  };

  const fetchDeliveryLogs = () => {
    fetch('/api/newsletter/logs')
      .then((r) => r.json())
      .then((data) => {
        if (data.logs) setDeliveryLogs(data.logs);
      })
      .catch((err) => console.error('Fetch delivery logs error:', err));
  };

  const fetchSmtpConfig = () => {
    fetch('/api/newsletter/smtp-config')
      .then((r) => r.json())
      .then((data) => {
        if (data) setSmtpConfig((prev: any) => ({ ...prev, ...data }));
      })
      .catch((err) => console.error('Fetch SMTP error:', err));
  };

  const fetchSchedulerStatus = () => {
    fetch('/api/articles/auto-scheduler')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setSchedulerStatus(data);
        }
      })
      .catch((err) => console.error('Fetch scheduler error:', err));
  };

  const handleTriggerAutoPostNow = () => {
    setIsTriggeringAutoPost(true);
    setAutoPostNotice(null);
    fetch('/api/articles/auto-scheduler/trigger-now', {
      method: 'POST',
    })
      .then((r) => r.json())
      .then((data) => {
        setIsTriggeringAutoPost(false);
        if (data.success) {
          setAutoPostNotice({ type: 'success', text: data.message });
          fetchSchedulerStatus();
          refreshArticles();
        } else {
          setAutoPostNotice({ type: 'error', text: data.message || 'Gagal auto-post artikel.' });
        }
      })
      .catch((err) => {
        setIsTriggeringAutoPost(false);
        setAutoPostNotice({ type: 'error', text: err.message || 'Error auto-post.' });
      });
  };

  const handleToggleScheduler = (enabled: boolean) => {
    fetch('/api/articles/auto-scheduler/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    })
      .then((r) => r.json())
      .then(() => fetchSchedulerStatus())
      .catch((err) => console.error(err));
  };

  // Load articles & categories on mount & sync admin username & newsletter data
  useEffect(() => {
    refreshArticles();
    setCategories(getAllCategories());
    const creds = getAdminCredentials();
    setCurrentAdminUser(creds.username);
    if (isAuthenticated) {
      fetchSubscribers();
      fetchSmtpConfig();
      fetchSchedulerStatus();
      fetchDeliveryLogs();
    }

    const onCatsUpdated = () => setCategories(getAllCategories());
    const onArtsUpdated = () => refreshArticles();
    window.addEventListener('categories-updated', onCatsUpdated);
    window.addEventListener('articles-updated', onArtsUpdated);
    return () => {
      window.removeEventListener('categories-updated', onCatsUpdated);
      window.removeEventListener('articles-updated', onArtsUpdated);
    };
  }, [isAuthenticated]);

  const refreshArticles = () => {
    setArticles(getAllArticles());
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryNotice(null);
    if (!newCatName.trim()) {
      setCategoryNotice({ type: 'error', text: 'Nama kategori wajib diisi.' });
      return;
    }
    const res = saveCategory(newCatName, newCatColor);
    if (res.success) {
      setCategoryNotice({ type: 'success', text: res.message });
      setNewCatName('');
      setCategories(getAllCategories());
    } else {
      setCategoryNotice({ type: 'error', text: res.message });
    }
  };

  const handleDeleteCategory = (catId: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus kategori "${name}"? Kategori ini tidak akan lagi muncul di pilihan baru.`)) {
      deleteCategory(catId);
      setCategories(getAllCategories());
      setCategoryNotice({ type: 'success', text: `Kategori "${name}" berhasil dihapus.` });
    }
  };

  const handleResetCategories = () => {
    if (window.confirm('Reset daftar kategori ke setelan bawaan sistem? Kategori kustom akan dihapus.')) {
      resetCategoriesToDefault();
      setCategories(getAllCategories());
      setCategoryNotice({ type: 'success', text: 'Kategori berhasil direset ke bawaan sistem.' });
    }
  };

  // Sync Final Image URL based on chosen mode
  useEffect(() => {
    if (imageInputMode === 'upload') {
      setFinalImageUrl(imageFilePreview);
    } else if (imageInputMode === 'drive') {
      setFinalImageUrl(convertGoogleDriveImageUrl(imageDriveUrl));
    } else if (imageInputMode === 'url') {
      setFinalImageUrl(imageDirectUrl.trim());
    }
  }, [imageInputMode, imageFilePreview, imageDriveUrl, imageDirectUrl]);

  // Sync Final Video Embed URL
  useEffect(() => {
    if (videoInputMode === 'none' || !videoRawUrl.trim()) {
      setFinalVideoEmbedUrl('');
      setVideoSourceType('none');
      return;
    }

    const detected = detectVideoSource(videoRawUrl);
    setVideoSourceType(detected);

    if (detected === 'youtube') {
      const embed = convertYouTubeEmbedUrl(videoRawUrl);
      setFinalVideoEmbedUrl(embed || '');
    } else if (detected === 'drive') {
      const embed = convertGoogleDriveVideoUrl(videoRawUrl);
      setFinalVideoEmbedUrl(embed || '');
    } else {
      setFinalVideoEmbedUrl(videoRawUrl.trim());
    }
  }, [videoInputMode, videoRawUrl]);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('Harap isi username dan password admin.');
      return;
    }

    const isValid = verifyAdminLogin(loginUsername, loginPassword);
    if (isValid) {
      setAdminSession(true, true);
      setIsAuthenticated(true);
      setLoginSuccessNotice('Login berhasil!');
      const creds = getAdminCredentials();
      setCurrentAdminUser(creds.username);
    } else {
      setLoginError('Username atau password yang Anda masukkan salah.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setAdminSession(false);
    setIsAuthenticated(false);
    setLoginUsername('');
    setLoginPassword('');
    setLoginError('');
  };

  // Handle File Upload from device
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setImageFilePreview(dataUrl);
      setFormErrorMessage('');
    } catch (err: any) {
      setFormErrorMessage(err.message || 'Gagal mengupload gambar.');
    }
  };

  // Clear Form
  const resetForm = () => {
    setEditingArticleId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormCategory('Tips Bisnis & Marketing');
    setFormCustomCategory('');
    setFormReadTime('4 Menit Baca');
    setFormSourceName('Admin Indo Digital');
    setFormKeyStat('+350%');
    setFormKeyStatLabel('Kenaikan Pesanan');
    setFormSummary('');
    setImageFilePreview('');
    setImageDriveUrl('');
    setImageDirectUrl('');
    setFinalImageUrl('');
    setVideoInputMode('none');
    setVideoRawUrl('');
    setFinalVideoEmbedUrl('');
    setFormBodyText('');
    setFormBackground('');
    setFormChallenge('');
    setFormStrategies('');
    setFormResult('');
    setFormTakeaway('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Populate form for editing
  const handleStartEdit = (article: Article) => {
    setEditingArticleId(article.id);
    setFormTitle(article.title);
    setFormSubtitle(article.subtitle || '');
    setFormCategory(article.category);
    setFormReadTime(article.readTime || '4 Menit Baca');
    setFormSourceName(article.sourceName || 'Admin Indo Digital');
    setFormKeyStat(article.keyStat || '+100%');
    setFormKeyStatLabel(article.keyStatLabel || 'Pertumbuhan');
    setFormSummary(article.summary || '');

    // Image
    if (article.imageUrl) {
      if (article.imageUrl.startsWith('data:')) {
        setImageInputMode('upload');
        setImageFilePreview(article.imageUrl);
      } else if (article.imageUrl.includes('drive.google.com') || article.imageUrl.includes('googleusercontent.com')) {
        setImageInputMode('drive');
        setImageDriveUrl(article.imageUrl);
      } else {
        setImageInputMode('url');
        setImageDirectUrl(article.imageUrl);
      }
      setFinalImageUrl(article.imageUrl);
    }

    // Video
    if (article.videoUrl) {
      setVideoRawUrl(article.videoUrl);
      if (article.videoType === 'youtube' || article.videoUrl.includes('youtube')) {
        setVideoInputMode('youtube');
      } else if (article.videoType === 'drive' || article.videoUrl.includes('drive')) {
        setVideoInputMode('drive');
      }
    } else {
      setVideoInputMode('none');
      setVideoRawUrl('');
    }

    // Content
    if (article.content.bodyText) {
      setContentMode('simple');
      setFormBodyText(article.content.bodyText);
    } else {
      setContentMode('structured');
      setFormBackground(article.content.background || '');
      setFormChallenge(article.content.challenge || '');
      setFormStrategies((article.content.strategy || []).join('\n'));
      setFormResult(article.content.result || '');
      setFormTakeaway(article.content.takeaway || '');
    }

    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Article (Create or Edit)
  const handleSubmitArticle = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMessage('');
    setFormSuccessMessage('');

    if (!formTitle.trim()) {
      setFormErrorMessage('Judul artikel wajib diisi.');
      return;
    }
    if (!formSummary.trim()) {
      setFormErrorMessage('Ringkasan singkat wajib diisi.');
      return;
    }

    const selectedCategory =
      formCategory === 'Lainnya' && formCustomCategory.trim()
        ? formCustomCategory.trim()
        : formCategory;

    // Determine category badge style from saved categories or presets
    const foundCategory = categories.find(
      (c) => c.name.toLowerCase() === selectedCategory.toLowerCase()
    );
    let categoryColor = foundCategory ? foundCategory.color : 'bg-sky-50 text-sky-800 border-sky-200';
    if (!foundCategory) {
      if (selectedCategory.includes('Kuliner')) {
        categoryColor = 'bg-amber-50 text-amber-800 border-amber-200';
      } else if (selectedCategory.includes('Kreatif') || selectedCategory.includes('Jasa')) {
        categoryColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      } else if (selectedCategory.includes('Riset') || selectedCategory.includes('Data')) {
        categoryColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      } else if (selectedCategory.includes('Fashion')) {
        categoryColor = 'bg-rose-50 text-rose-800 border-rose-200';
      }
      // If user typed a custom category on the fly, auto-save it to persistent categories
      if (formCategory === 'Lainnya' && formCustomCategory.trim()) {
        saveCategory(formCustomCategory.trim(), categoryColor);
      }
    }

    // Prepare strategies array if in structured mode
    const strategyArray = formStrategies
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const generatedId =
      editingArticleId ||
      'art-' +
        formTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 40) +
        '-' +
        Date.now().toString().slice(-4);

    const newArticle: Article = {
      id: generatedId,
      category: selectedCategory,
      categoryColor,
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || formTitle.trim(),
      readTime: formReadTime.trim() || '4 Menit Baca',
      date: new Date().getFullYear().toString(),
      sourceName: formSourceName.trim() || 'Admin Indo Digital',
      sourceUrl: '#',
      keyStat: formKeyStat.trim() || '+100%',
      keyStatLabel: formKeyStatLabel.trim() || 'Kenaikan Bisnis',
      summary: formSummary.trim(),
      imageUrl: finalImageUrl || undefined,
      videoUrl: videoRawUrl.trim() || undefined,
      videoType: videoInputMode !== 'none' ? videoSourceType : undefined,
      content: {
        bodyText: contentMode === 'simple' ? formBodyText.trim() : undefined,
        background: formBackground.trim() || undefined,
        challenge: formChallenge.trim() || undefined,
        strategy: strategyArray.length > 0 ? strategyArray : undefined,
        result: formResult.trim() || undefined,
        takeaway: formTakeaway.trim() || undefined,
      },
      isCustom: true,
      createdAt: Date.now(),
    };

    const saved = saveArticle(newArticle);
    if (saved) {
      setFormSuccessMessage(
        editingArticleId
          ? 'Artikel berhasil diperbarui dan langsung tayang di Navtab Artikel!'
          : 'Artikel baru berhasil diterbitkan dan otomatis muncul di Navtab Artikel!'
      );
      refreshArticles();

      // Push article to server-side central store & trigger verified newsletter pipeline
      if (sendNewsletterOnPost) {
        setIsBroadcasting(true);
      }
      fetch('/api/articles/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newArticle.id,
          title: newArticle.title,
          subtitle: newArticle.subtitle,
          category: newArticle.category,
          categoryColor: newArticle.categoryColor,
          readTime: newArticle.readTime,
          summary: newArticle.summary,
          imageUrl: newArticle.imageUrl,
          videoUrl: newArticle.videoUrl,
          videoType: newArticle.videoType,
          content: newArticle.content,
          status: 'published',
          source: 'admin_manual',
          sendNewsletter: sendNewsletterOnPost,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setIsBroadcasting(false);
          fetchDeliveryLogs();
          if (sendNewsletterOnPost && data.newsletter) {
            setBroadcastModal({
              title: newArticle.title,
              count: data.newsletter.recipientCount,
              recipients: data.newsletter.recipients,
              smtpSent: data.newsletter.status === 'DELIVERED',
              smtpError: data.newsletter.error,
              mailtoUrl: data.newsletter.mailtoUrl,
              subject: `[Artikel Baru] ${newArticle.title} - Webkilat`,
              preview: newArticle.summary,
            });
          }
        })
        .catch((err) => {
          setIsBroadcasting(false);
          console.error('Server publish sync notice:', err);
        });

      if (!editingArticleId) {
        resetForm();
      }
    } else {
      setFormErrorMessage('Gagal menyimpan artikel ke penyimpanan browser.');
    }
  };

  // Handle Delete Article
  const promptDeleteArticle = (id: string, title: string, isCustom?: boolean) => {
    setArticleDeleteModal({ id, title, isCustom });
  };

  const confirmDeleteArticle = (id: string) => {
    const found = articles.find((a) => a.id === id);
    const title = found?.title || 'Artikel';
    deleteArticle(id);
    refreshArticles();
    if (editingArticleId === id) {
      resetForm();
    }
    setDeleteNotice(`Artikel "${title}" berhasil dihapus dari website.`);
    setArticleDeleteModal(null);
    setTimeout(() => setDeleteNotice(null), 5000);
  };

  const handleDeleteArticle = (id: string, title: string, isCustom?: boolean) => {
    promptDeleteArticle(id, title, isCustom);
  };

  // Handle Reset Articles
  const handleResetToDefault = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mereset daftar artikel ke default bawaan? Semua artikel buatan admin akan dihapus.'
      )
    ) {
      resetArticlesToDefault();
      refreshArticles();
      resetForm();
    }
  };

  // Handle Update Admin Credentials
  const handleUpdateCreds = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsNotice(null);

    const creds = getAdminCredentials();
    if (oldPassword.trim() !== creds.password.trim()) {
      setSettingsNotice({ type: 'error', text: 'Password lama salah. Verifikasi gagal.' });
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setSettingsNotice({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    const res = updateAdminCredentials(newUsername || creds.username, newPassword);
    if (res.success) {
      setSettingsNotice({ type: 'success', text: res.message });
      setCurrentAdminUser(newUsername.trim() || creds.username);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setSettingsNotice({ type: 'error', text: res.message });
    }
  };

  // -------------------------------------------------------------
  // VIEW: IF NOT AUTHENTICATED -> SHOW SECURE LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-md w-full space-y-6">
          {/* Header Brand */}
          <div className="text-center space-y-3">
            <button
              onClick={onNavigateToHome}
              className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda Website</span>
            </button>
            <div className="flex justify-center pt-2">
              <IndoDigitalLogo size="lg" variant="full" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Portal Admin & Kelola Konten
            </h1>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Masuk untuk input blog, artikel inspirasi UMKM, dan upload media gambar/video.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Autentikasi Admin</h2>
                <p className="text-[11px] text-slate-500">Akses terbatas hanya untuk pengelola web</p>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Username Admin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Masukkan username admin"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan password admin"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#1D3582] hover:bg-[#162968] active:scale-98 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Masuk ke Dashboard</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: LOGGED IN ADMIN DASHBOARD
  // -------------------------------------------------------------
  const customCount = articles.filter((a) => a.isCustom).length;
  const defaultCount = articles.filter((a) => !a.isCustom).length;

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 pb-20">
      {/* Top Admin Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToHome}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 cursor-pointer bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Webkilat</span>
            </button>
            <div className="h-5 w-px bg-slate-700 hidden sm:block" />
            <div>
              <span className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Admin Panel • Kelola Blog &amp; Artikel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Link to User-facing Articles tab */}
            <button
              onClick={onNavigateToPublicArticles}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Buka Navtab Artikel Publik"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Tab Artikel</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Keluar dari Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Subheader & Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-amber-300 text-[10px] font-black uppercase tracking-wider shadow-2xs">
                <span>DASHBOARD ADMIN RESMI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-white">PT ITDI</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Panel Kontrol Admin: Kemitraan &amp; Artikel
              </h1>
              <p className="text-xs text-slate-500">
                Login aktif: <strong className="text-sky-700">{currentAdminUser}</strong> &bull; {mitraStats.total} Mitra ({mitraStats.pending} Butuh Approval) &bull; {articles.length} Artikel
              </p>
            </div>

            {/* Primary Main Menu Buttons (Kelola Mitra vs Kelola Artikel) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
              {/* PRIMARY TAB 1: KELOLA MITRA (APPROVAL) */}
              <button
                onClick={() => {
                  setActiveTab('mitra');
                  setFormSuccessMessage('');
                }}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer text-xs font-black shadow-xs ${
                  activeTab === 'mitra'
                    ? 'bg-[#1D3582] text-white shadow-md ring-2 ring-blue-500/30 scale-[1.02]'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-2 border-emerald-300'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>1. KELOLA MITRA (APPROVAL)</span>
                {mitraStats.pending > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse">
                    {mitraStats.pending} Butuh Approval
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-extrabold">
                    {mitraStats.total} Mitra
                  </span>
                )}
              </button>

              {/* PRIMARY TAB 2: KELOLA ARTIKEL & BLOG */}
              <button
                onClick={() => {
                  setActiveTab(activeTab === 'mitra' || activeTab === 'settings' ? 'list' : activeTab);
                  setFormSuccessMessage('');
                }}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer text-xs font-black shadow-xs ${
                  activeTab !== 'mitra' && activeTab !== 'settings'
                    ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-500/30 scale-[1.02]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                }`}
              >
                <BookOpen className="w-4 h-4 text-sky-500" />
                <span>2. KELOLA ARTIKEL &amp; BLOG ({articles.length})</span>
              </button>

              {/* PRIMARY TAB 3: AKUN ADMIN */}
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setFormSuccessMessage('');
                }}
                className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer text-xs font-black ${
                  activeTab === 'settings'
                    ? 'bg-slate-900 text-amber-300 shadow-md ring-2 ring-amber-400/40'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                }`}
                title="Pengaturan Akun Admin"
              >
                <Settings className="w-4 h-4" />
                <span>Akun</span>
              </button>
            </div>
          </div>

          {/* Sub-Tabs for Articles when in Article Mode */}
          {activeTab !== 'mitra' && activeTab !== 'settings' && (
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto animate-fade-in">
              <span className="text-[10px] uppercase font-black text-slate-400 px-2 shrink-0">
                Menu Artikel:
              </span>
              <button
                onClick={() => {
                  setActiveTab('create');
                  setFormSuccessMessage('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'create'
                    ? 'bg-sky-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-white'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{editingArticleId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('list');
                  setFormSuccessMessage('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'list'
                    ? 'bg-sky-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-white'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Daftar Artikel ({articles.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('categories');
                  setFormSuccessMessage('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'categories'
                    ? 'bg-sky-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-white'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-emerald-500" />
                <span>Kategori ({categories.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('autopost');
                  setFormSuccessMessage('');
                  fetchSchedulerStatus();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'autopost'
                    ? 'bg-sky-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Auto-Post 2x/Hari</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('newsletter');
                  setFormSuccessMessage('');
                  fetchSubscribers();
                  fetchSmtpConfig();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'newsletter'
                    ? 'bg-sky-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>Newsletter ({subscribers.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ========================================================= */}
        {/* TAB 1: FORM INPUT / EDIT ARTIKEL */}
        {/* ========================================================= */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            {formSuccessMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold">{formSuccessMessage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onNavigateToPublicArticles}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Buka Tab Artikel</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {formErrorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2 shadow-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span className="font-semibold">{formErrorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitArticle} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Article Meta & Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                        <Edit3 className="w-4 h-4" />
                      </div>
                      <h2 className="text-base font-extrabold text-slate-900">
                        {editingArticleId ? 'Ubah Artikel' : 'Data Pokok Artikel'}
                      </h2>
                    </div>
                    {editingArticleId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Batal Edit</span>
                      </button>
                    )}
                  </div>

                  {/* Judul Artikel */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                      Judul Artikel <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Contoh: Strategi UMKM Frozen Food Tembus Omzet Puluhan Juta Berkat Landing Page"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-semibold"
                    />
                  </div>

                  {/* Subjudul */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Subjudul / Tagline Pendukung
                    </label>
                    <input
                      type="text"
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      placeholder="Contoh: Kisah nyata adaptasi digital dan integrasi pemesanan kilat via WhatsApp"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Kategori & Waktu Baca */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          Kategori
                        </label>
                        <button
                          type="button"
                          onClick={() => setActiveTab('categories')}
                          className="text-[11px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Tag className="w-3 h-3 text-emerald-500" />
                          <span>+ Kelola Kategori</span>
                        </button>
                      </div>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name} {cat.isCustom ? '★ (Kategori Admin)' : ''}
                          </option>
                        ))}
                        <option value="Lainnya">+ Tambah Kategori Lainnya (Ketik Manual)</option>
                      </select>
                      {formCategory === 'Lainnya' && (
                        <input
                          type="text"
                          value={formCustomCategory}
                          onChange={(e) => setFormCustomCategory(e.target.value)}
                          placeholder="Ketik kategori baru (otomatis tersimpan)..."
                          className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                        />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Estimasi Waktu Baca
                      </label>
                      <input
                        type="text"
                        value={formReadTime}
                        onChange={(e) => setFormReadTime(e.target.value)}
                        placeholder="Contoh: 4 Menit Baca"
                        className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Penulis & Key Stat */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Penulis / Sumber
                      </label>
                      <input
                        type="text"
                        value={formSourceName}
                        onChange={(e) => setFormSourceName(e.target.value)}
                        placeholder="Admin Indo Digital"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Highlight Angka (Stat)
                      </label>
                      <input
                        type="text"
                        value={formKeyStat}
                        onChange={(e) => setFormKeyStat(e.target.value)}
                        placeholder="+350%"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-sky-700 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Label Angka
                      </label>
                      <input
                        type="text"
                        value={formKeyStatLabel}
                        onChange={(e) => setFormKeyStatLabel(e.target.value)}
                        placeholder="Kenaikan Omzet"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Ringkasan Singkat (Summary for card) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                      Ringkasan Singkat (Muncul di Kartu Depan) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formSummary}
                      onChange={(e) => setFormSummary(e.target.value)}
                      placeholder="Tulis 2-3 kalimat menarik yang menggambarkan inti artikel agar pembaca tertarik membaca selengkapnya..."
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs leading-relaxed focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-normal"
                    />
                  </div>
                </div>

                {/* Article Full Content (Mode Switcher) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <h2 className="text-base font-extrabold text-slate-900">
                        Isi Konten Artikel Lengkap
                      </h2>
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setContentMode('simple')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                          contentMode === 'simple'
                            ? 'bg-white text-indigo-700 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Rich Text Editor (WordPress/Blogger)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setContentMode('structured')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          contentMode === 'structured'
                            ? 'bg-white text-indigo-700 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Format Studi Kasus
                      </button>
                    </div>
                  </div>

                  {contentMode === 'simple' ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          Isi Lengkap Artikel (Mendukung Bold, Italic, Underline, Judul, &amp; Tautan)
                        </label>
                        <span className="text-[11px] text-slate-400">
                          Format WYSIWYG otomatis terkonversi ke HTML aman
                        </span>
                      </div>
                      <RichTextEditor
                        value={formBodyText}
                        onChange={setFormBodyText}
                        placeholder="Mulai tulis artikel Anda di sini... Anda bisa memformat teks menjadi Tebal (Bold), Miring (Italic), Garis Bawah (Underline), menambahkan Heading H2/H3, membuat daftar poin, serta menyisipkan tautan (link internal halaman atau link eksternal web)."
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">
                          1. Latar Belakang &amp; Profil Awal Usaha
                        </label>
                        <textarea
                          rows={2}
                          value={formBackground}
                          onChange={(e) => setFormBackground(e.target.value)}
                          placeholder="Bagaimana usaha ini dirintis dan kondisi sebelum punya landing page..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">
                          2. Tantangan &amp; Kendala Usaha
                        </label>
                        <textarea
                          rows={2}
                          value={formChallenge}
                          onChange={(e) => setFormChallenge(e.target.value)}
                          placeholder="Kendala pembeli ragu, perang harga di marketplace, biaya admin tinggi..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">
                          3. Strategi Digital (Tulis 1 Poin per Baris)
                        </label>
                        <textarea
                          rows={3}
                          value={formStrategies}
                          onChange={(e) => setFormStrategies(e.target.value)}
                          placeholder="Membuat landing page resmi promo Rp 499rb&#10;Menghubungkan tombol pesan WhatsApp langsung&#10;Menampilkan testimoni pelanggan asli"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">
                          4. Hasil Nyata yang Dicapai
                        </label>
                        <textarea
                          rows={2}
                          value={formResult}
                          onChange={(e) => setFormResult(e.target.value)}
                          placeholder="Omzet melonjak 300% dalam waktu 6 bulan dan pesanan datang rutin..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">
                          5. Kesimpulan / Pesan Utama untuk Pembaca
                        </label>
                        <textarea
                          rows={2}
                          value={formTakeaway}
                          onChange={(e) => setFormTakeaway(e.target.value)}
                          placeholder="Pesan moral penting bagi UMKM lainnya agar segera bertransformasi..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Media (Image & Video) & Live Preview */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. MEDIA GAMBAR (Photo / Illustration) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        Upload Gambar / Foto Artikel
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Dukung dengan gambar menarik untuk sampul
                      </p>
                    </div>
                  </div>

                  {/* Mode Selector Gambar */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                        imageInputMode === 'upload'
                          ? 'bg-white text-slate-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('drive')}
                      className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                        imageInputMode === 'drive'
                          ? 'bg-white text-slate-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Google Drive
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                        imageInputMode === 'url'
                          ? 'bg-white text-slate-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Link Web (URL)
                    </button>
                  </div>

                  {/* Option A: Direct File Upload */}
                  {imageInputMode === 'upload' && (
                    <div className="space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="article-image-upload"
                      />
                      <label
                        htmlFor="article-image-upload"
                        className="border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-sky-50/40 hover:bg-sky-50 transition-all text-center"
                      >
                        <Upload className="w-6 h-6 text-sky-600" />
                        <span className="text-xs font-bold text-sky-900">
                          Pilih Gambar dari Perangkat (HP/Laptop)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Format JPG, PNG, WEBP (Maksimal 4MB)
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Option B: Google Drive Link */}
                  {imageInputMode === 'drive' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Tempel Link Gambar dari Google Drive:
                      </label>
                      <input
                        type="url"
                        value={imageDriveUrl}
                        onChange={(e) => setImageDriveUrl(e.target.value)}
                        placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                      <div className="p-2 rounded-lg bg-blue-50 text-[10px] text-blue-800 leading-snug">
                        💡 <strong>Tips:</strong> Pastikan setelan berbagi di Google Drive adalah <em>"Siapa saja yang memiliki link / Anyone with link"</em>. Sistem otomatis mengonversi ke tautan gambar langsung.
                      </div>
                    </div>
                  )}

                  {/* Option C: Direct Image URL */}
                  {imageInputMode === 'url' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Tempel Link Gambar (URL):
                      </label>
                      <input
                        type="url"
                        value={imageDirectUrl}
                        onChange={(e) => setImageDirectUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... atau domain Anda"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                  )}

                  {/* Image Live Preview */}
                  {finalImageUrl && (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50">
                      <img
                        src={finalImageUrl}
                        alt="Preview Gambar Artikel"
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="p-2 bg-white flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Gambar Siap
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFilePreview('');
                            setImageDriveUrl('');
                            setImageDirectUrl('');
                            setFinalImageUrl('');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. MEDIA VIDEO (YouTube or Google Drive) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                      <VideoIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        Sematkan Video (Opsional)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Link YouTube atau Google Drive Video
                      </p>
                    </div>
                  </div>

                  {/* Video Type Selector */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setVideoInputMode('none');
                        setVideoRawUrl('');
                      }}
                      className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                        videoInputMode === 'none'
                          ? 'bg-white text-slate-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tanpa Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoInputMode('youtube')}
                      className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                        videoInputMode === 'youtube'
                          ? 'bg-white text-rose-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Youtube className="w-3.5 h-3.5 text-rose-600" />
                      <span>YouTube</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoInputMode('drive')}
                      className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                        videoInputMode === 'drive'
                          ? 'bg-white text-blue-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Drive Video</span>
                    </button>
                  </div>

                  {/* Video Input Box */}
                  {videoInputMode !== 'none' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        {videoInputMode === 'youtube'
                          ? 'Tempel Link Video YouTube (Watch/Shorts/Share):'
                          : 'Tempel Link Video Google Drive:'}
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={videoRawUrl}
                          onChange={(e) => setVideoRawUrl(e.target.value)}
                          placeholder={
                            videoInputMode === 'youtube'
                              ? 'https://www.youtube.com/watch?v=... atau https://youtu.be/...'
                              : 'https://drive.google.com/file/d/.../view'
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                        />
                      </div>

                      {/* Video Player Preview */}
                      {finalVideoEmbedUrl && (
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Preview Player Video:
                          </span>
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-300 bg-black">
                            <iframe
                              src={finalVideoEmbedUrl}
                              title="Preview Video Player"
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Final Action Submission Box */}
                <div className="bg-gradient-to-br from-[#1D3582] to-sky-900 rounded-3xl p-6 text-white space-y-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <h3 className="font-extrabold text-sm">
                      {editingArticleId ? 'Perbarui Artikel' : 'Publikasikan ke Website'}
                    </h3>
                  </div>
                  <p className="text-xs text-sky-100 leading-relaxed">
                    Artikel akan otomatis tersimpan dan langsung muncul di Navtab Artikel (bagian atas) untuk dibaca semua pengunjung website.
                  </p>

                  {/* Push Newsletter Broadcast Checkbox */}
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 space-y-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-white">
                      <input
                        type="checkbox"
                        checked={sendNewsletterOnPost}
                        onChange={(e) => setSendNewsletterOnPost(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-sky-500 focus:ring-sky-400 cursor-pointer"
                      />
                      <div>
                        <span className="block text-amber-300 font-extrabold flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          Push Email Newsletter Otomatis ({subscribers.length} Subscriber)
                        </span>
                        <span className="text-[11px] text-sky-100 font-normal leading-tight block pt-0.5">
                          Kirim notifikasi email otomatis ke subscriber newsletter (termasuk bca.ccpl@gmail.com) saat artikel dipublikasikan.
                        </span>
                      </div>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isBroadcasting}
                    className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-yellow-300 active:scale-98 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {editingArticleId ? 'Simpan Perubahan Artikel' : 'Publikasikan Artikel Sekarang'}
                    </span>
                  </button>

                  {editingArticleId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Batal / Buat Artikel Baru
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DAFTAR & MENU HAPUS ARTIKEL */}
        {/* ========================================================= */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-rose-500" />
                    <span>Menu Manajemen &amp; Hapus Artikel ({articles.length})</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola, edit, atau hapus artikel apa pun (baik artikel buatan admin maupun artikel bawaan sistem) agar website selalu mutakhir.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab('create');
                    }}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Tulis Artikel Baru</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    title="Reset semua artikel ke bawaan sistem"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Bawaan</span>
                  </button>
                </div>
              </div>

              {deleteNotice && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{deleteNotice}</span>
                </div>
              )}

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={articleSearchQuery}
                  onChange={(e) => setArticleSearchQuery(e.target.value)}
                  placeholder="Cari artikel berdasarkan judul, kategori, atau isi ringkasan..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-slate-50/50"
                />
              </div>

              {/* Table or Cards of Articles */}
              <div className="space-y-3">
                {articles
                  .filter((a) => {
                    if (!articleSearchQuery.trim()) return true;
                    const q = articleSearchQuery.toLowerCase();
                    return (
                      a.title.toLowerCase().includes(q) ||
                      a.category.toLowerCase().includes(q) ||
                      (a.summary && a.summary.toLowerCase().includes(q))
                    );
                  })
                  .map((article) => (
                  <div
                    key={article.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      article.isCustom
                        ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                      {/* Thumbnail */}
                      <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                        {article.imageUrl ? (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                            <BookOpen className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Text info */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${article.categoryColor}`}
                          >
                            {article.category}
                          </span>
                          {article.isCustom ? (
                            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                              Diterbitkan Admin
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                              Artikel Bawaan
                            </span>
                          )}
                          {article.videoUrl && (
                            <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <VideoIcon className="w-2.5 h-2.5" />
                              Ada Video
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                          {article.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl">
                          {article.summary}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Edit & Universal Hapus Button */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => handleStartEdit(article)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        title="Edit Artikel"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => promptDeleteArticle(article.id, article.title, article.isCustom)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs group"
                        title="Hapus Artikel dari Website"
                      >
                        <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}

                {articles.length === 0 && (
                  <div className="text-center py-12 text-slate-500 space-y-2">
                    <p className="text-sm font-bold">Semua artikel telah dihapus.</p>
                    <button
                      onClick={handleResetToDefault}
                      className="text-xs text-sky-600 hover:underline cursor-pointer font-bold"
                    >
                      Klik di sini untuk mengembalikan artikel bawaan sistem
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: KELOLA & TAMBAH KATEGORI ARTIKEL */}
        {/* ========================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            {/* Header info */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Kelola Kategori Artikel
                    </h2>
                    <p className="text-xs text-slate-500">
                      Tambah kategori baru dengan warna badge pilihan. Kategori tersimpan permanen dan otomatis muncul di formulir artikel dan filter pembaca.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetCategories}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Kembalikan kategori ke setelan bawaan sistem"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Kategori Default</span>
                </button>
              </div>

              {categoryNotice && (
                <div
                  className={`p-4 rounded-2xl text-xs flex items-center gap-2 font-bold animate-fade-in ${
                    categoryNotice.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {categoryNotice.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{categoryNotice.text}</span>
                </div>
              )}

              {/* Form Tambah Kategori Baru */}
              <form onSubmit={handleAddCategory} className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/80 space-y-5">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-black text-slate-900">Tambah Kategori Baru</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Nama Kategori <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="Contoh: Tutorial WordPress, Tips Finansial UMKM..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                    />
                    <p className="text-[10px] text-slate-400">
                      Nama kategori yang akan tertera pada badge artikel dan filter pembaca.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Pilih Warna Badge
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {CATEGORY_COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setNewCatColor(preset.color)}
                          className={`p-2 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            newCatColor === preset.color
                              ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-white'
                              : 'border-slate-200 bg-white/70 hover:bg-white'
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full shrink-0 ${preset.dot}`} />
                          <span className="truncate">{preset.label.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview Badge */}
                <div className="pt-3 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Pratinjau Badge:</span>
                    <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-md border ${newCatColor}`}>
                      {newCatName.trim() || 'Contoh Kategori'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Kategori Baru</span>
                  </button>
                </div>
              </form>

              {/* Daftar Kategori Aktif */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-sky-600" />
                    <span>Daftar Kategori Tersimpan ({categories.length})</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    {categories.filter((c) => c.isCustom).length} Kategori Dibuat Admin
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const articleCount = articles.filter(
                      (a) => a.category.toLowerCase() === cat.name.toLowerCase()
                    ).length;

                    return (
                      <div
                        key={cat.id}
                        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                          cat.isCustom
                            ? 'bg-emerald-50/30 border-emerald-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="space-y-1 min-w-0">
                          <span
                            className={`inline-block text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md border truncate max-w-full ${cat.color}`}
                          >
                            {cat.name}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span>{articleCount} Artikel</span>
                            <span>•</span>
                            <span>{cat.isCustom ? 'Kategori Admin' : 'Kategori Bawaan'}</span>
                          </div>
                        </div>

                        {cat.isCustom ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs"
                            title="Hapus Kategori Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold px-2 py-1 bg-slate-100 rounded-lg shrink-0">
                            Sistem
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: JADWAL & AUTO-POST ARTIKEL (MINIMAL 2 ARTIKEL / HARI) */}
        {/* ========================================================= */}
        {activeTab === 'autopost' && (
          <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            {/* Top Cards: Status & Schedule Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Otomatisasi</span>
                  <div className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${schedulerStatus?.config?.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    <span>{schedulerStatus?.config?.enabled ? 'Aktif Berjalan' : 'Dinonaktifkan'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleScheduler(!schedulerStatus?.config?.enabled)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    schedulerStatus?.config?.enabled
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {schedulerStatus?.config?.enabled ? 'Matikan' : 'Aktifkan'}
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Frekuensi Publikasi</div>
                  <div className="text-sm font-black text-slate-900">2 Artikel / Hari</div>
                  <div className="text-[11px] text-slate-500">Slot: 08:00 &amp; 17:00 WIB</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jadwal Slot Berikutnya</div>
                  <div className="text-sm font-black text-sky-700 truncate max-w-[180px]">
                    {schedulerStatus?.config?.nextSlotName || '08:00 WIB (Besok)'}
                  </div>
                  <div className="text-[11px] text-slate-500">Antrean: {schedulerStatus?.pendingQueueCount || 0} artikel</div>
                </div>
              </div>
            </div>

            {/* Notification Banner */}
            {autoPostNotice && (
              <div
                className={`p-4 rounded-2xl text-xs flex items-center gap-2 font-bold animate-fade-in ${
                  autoPostNotice.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {autoPostNotice.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{autoPostNotice.text}</span>
              </div>
            )}

            {/* Main Action Panel */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 fill-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Sistem Otomatisasi Post Artikel (Minimal 2x Sehari)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Server secara otomatis menerbitkan artikel dari antrean pada slot jam 08:00 WIB dan 17:00 WIB setiap hari, serta otomatis mengirimkan push email ke subscriber newsletter.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isTriggeringAutoPost}
                  onClick={handleTriggerAutoPostNow}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-yellow-300 active:scale-98 text-slate-950 text-xs font-black flex items-center gap-2 cursor-pointer shadow-md transition-all shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{isTriggeringAutoPost ? 'Mempublikasikan...' : 'Jalankan Auto-Post Sekarang'}</span>
                </button>
              </div>

              {/* Antrean Artikel Siap Terbit */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Antrean Artikel Terjadwal ({schedulerStatus?.queue?.filter((a: any) => a.status === 'queued').length || 0})</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">Siap diposting secara berkala</span>
                </div>

                <div className="space-y-3">
                  {schedulerStatus?.queue
                    ?.filter((a: any) => a.status === 'queued')
                    .map((queued: any, idx: number) => (
                      <div
                        key={queued.id}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center shrink-0">
                            #{idx + 1}
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${queued.categoryColor}`}>
                                {queued.category}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500">
                                Target Keyword: <code className="text-sky-700 bg-sky-50 px-1 py-0.5 rounded">{queued.targetKeyword}</code>
                              </span>
                            </div>
                            <h4 className="text-sm font-black text-slate-900 leading-snug">
                              {queued.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-1">
                              {queued.summary}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-lg">
                            Slot Antrean #{idx + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Riwayat Artikel Auto-Post yang Telah Terbit */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Riwayat Publikasi Otomatis ({schedulerStatus?.published?.length || 0})</span>
                  </h3>
                  <button
                    onClick={onNavigateToPublicArticles}
                    className="text-xs text-sky-600 hover:text-sky-800 font-bold underline cursor-pointer"
                  >
                    Lihat di Tab Artikel Publik &rarr;
                  </button>
                </div>

                <div className="space-y-2">
                  {schedulerStatus?.published?.map((pub: any) => (
                    <div
                      key={pub.id}
                      className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-bold text-slate-900 truncate">{pub.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                        {pub.publishedAt ? new Date(pub.publishedAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Terbit'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PENGATURAN AKUN (GANTI USERNAME & PASSWORD) */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Pengaturan Akun &amp; Kredensial Admin
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ubah username dan password agar hanya Anda yang dapat mengakses panel ini
                  </p>
                </div>
              </div>

              {settingsNotice && (
                <div
                  className={`p-4 rounded-2xl text-xs flex items-center gap-2 font-bold ${
                    settingsNotice.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {settingsNotice.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{settingsNotice.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateCreds} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Username Saat Ini
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentAdminUser}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black text-slate-800">
                    Username Baru (Bisa Disesuaikan)
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Contoh: pemilik_web atau nama Anda"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-medium"
                  />
                  <p className="text-[10px] text-slate-400">
                    Kosongkan jika hanya ingin mengubah password saja.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-slate-800">
                      Password Lama (Verifikasi) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Masukkan password saat ini (default: admin123)"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-black text-slate-800">
                      Password Baru <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan password baru (minimal 4 karakter)"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-black text-slate-800">
                      Konfirmasi Password Baru <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru Anda"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Akun</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: NEWSLETTER & SUBSCRIBER MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'newsletter' && (
          <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            {/* Top Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{subscribers.length}</div>
                  <div className="text-xs font-semibold text-slate-500">Subscriber Aktif</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  smtpConfig.isConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">
                    {smtpConfig.isConfigured ? 'SMTP Terhubung' : 'Mode Siap / Gmail'}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    {smtpConfig.isConfigured ? 'Otomatis via Server' : 'Konfigurasi SMTP di bawah'}
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">Push Otomatis</div>
                  <div className="text-xs font-semibold text-slate-500">Aktif saat Post Artikel</div>
                </div>
              </div>
            </div>

            {/* Section 1: Daftar Subscriber & Tambah Manual */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-sky-600" />
                    <span>Daftar Email Pelanggan Newsletter</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Semua email yang mendaftar melalui form artikel akan muncul di sini dan menerima update
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const all = subscribers.map((s) => s.email).join(', ');
                      navigator.clipboard.writeText(all);
                      alert(`Berhasil menyalin ${subscribers.length} email ke clipboard!`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Semua Email</span>
                  </button>
                </div>
              </div>

              {/* Form Tambah Email Manual */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newManualEmail.trim()) return;
                  fetch('/api/newsletter/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: newManualEmail.trim() }),
                  })
                    .then((r) => r.json())
                    .then(() => {
                      setNewManualEmail('');
                      fetchSubscribers();
                    });
                }}
                className="flex flex-col sm:flex-row gap-2 max-w-xl"
              >
                <input
                  type="email"
                  required
                  value={newManualEmail}
                  onChange={(e) => setNewManualEmail(e.target.value)}
                  placeholder="Tambahkan email subscriber baru (contoh: pelanggan@gmail.com)"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
                >
                  + Tambahkan Email
                </button>
              </form>

              {/* Tabel Subscriber */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-100 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-black tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Email Subscriber</th>
                      <th className="p-3">Tanggal Terdaftar</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subscribers.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="p-3 font-bold text-slate-900">
                          {sub.email}
                          {sub.email === 'bca.ccpl@gmail.com' && (
                            <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-extrabold">
                              Akun Anda
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-500">
                          {new Date(sub.subscribedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                            {sub.status || 'active'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Hapus subscriber ${sub.email}?`)) {
                                fetch(`/api/newsletter/subscribers/${encodeURIComponent(sub.email)}`, {
                                  method: 'DELETE',
                                }).then(() => fetchSubscribers());
                              }
                            }}
                            className="text-rose-600 hover:text-rose-800 font-bold text-xs cursor-pointer"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Manual Broadcast Tool */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-600" />
                  <span>Kirim Broadcast Email Newsletter Manual</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Kirim ulang pemberitahuan artikel tertentu kapan saja ke seluruh subscriber
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-8 space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Pilih Artikel yang Ingin Dikirimkan:
                  </label>
                  <select
                    value={manualBroadcastArticleId}
                    onChange={(e) => setManualBroadcastArticleId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                  >
                    <option value="">-- Pilih Artikel --</option>
                    {articles.map((art) => (
                      <option key={art.id} value={art.id}>
                        [{art.category}] {art.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <button
                    type="button"
                    disabled={!manualBroadcastArticleId || isBroadcasting}
                    onClick={() => {
                      const selected = articles.find((a) => a.id === manualBroadcastArticleId);
                      if (!selected) return;

                      setIsBroadcasting(true);
                      fetch('/api/newsletter/broadcast', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          articleId: selected.id,
                          title: selected.title,
                          subtitle: selected.subtitle,
                          category: selected.category,
                          summary: selected.summary,
                          readTime: selected.readTime,
                          imageUrl: selected.imageUrl,
                          articleUrl: 'https://webmurah.biz.id/#/artikel',
                        }),
                      })
                        .then((r) => r.json())
                        .then((data) => {
                          setIsBroadcasting(false);
                          if (data.success) {
                            setBroadcastModal({
                              title: selected.title,
                              count: data.subscriberCount,
                              recipients: data.recipients,
                              smtpSent: data.smtpSent,
                              smtpError: data.smtpError,
                              mailtoUrl: data.mailtoUrl,
                              subject: data.subject,
                              preview: data.emailBodyPreview,
                            });
                          }
                        })
                        .catch((err) => {
                          setIsBroadcasting(false);
                          alert('Gagal mengirim broadcast: ' + err.message);
                        });
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isBroadcasting ? 'Mengirim...' : 'Kirim Push Email Sekarang'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Pengaturan SMTP Pengirim Otomatis */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-sky-600" />
                    <span>Konfigurasi SMTP Email Pengirim (Otomatisasi Latar Belakang)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hubungkan akun email (seperti Gmail SMTP) agar pengiriman email push berjalan 100% otomatis dari server
                  </p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-black ${
                  smtpConfig.isConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {smtpConfig.isConfigured ? '✅ Aktif Terhubung' : '⚠️ Belum Dikonfigurasi'}
                </span>
              </div>

              {smtpNotice && (
                <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 font-bold ${
                  smtpNotice.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {smtpNotice.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{smtpNotice.text}</span>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSavingSmtp(true);
                  setSmtpNotice(null);

                  fetch('/api/newsletter/smtp-config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(smtpConfig),
                  })
                    .then(async (r) => {
                      const data = await r.json();
                      if (!r.ok) throw new Error(data.error || 'Gagal menyimpan');
                      return data;
                    })
                    .then((data) => {
                      setIsSavingSmtp(false);
                      setSmtpNotice({ type: 'success', text: data.message });
                      fetchSmtpConfig();
                    })
                    .catch((err) => {
                      setIsSavingSmtp(false);
                      setSmtpNotice({ type: 'error', text: err.message });
                    });
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">SMTP Host</label>
                    <input
                      type="text"
                      value={smtpConfig.host || 'smtp.gmail.com'}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                      placeholder="smtp.gmail.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">SMTP Port</label>
                    <input
                      type="number"
                      value={smtpConfig.port || 465}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, port: Number(e.target.value) })}
                      placeholder="465 (SSL) atau 587 (TLS)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Email Akun Pengirim (User)</label>
                    <input
                      type="email"
                      value={smtpConfig.user || ''}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                      placeholder="emailanda@gmail.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Password Aplikasi (App Password 16 Digit)
                    </label>
                    <input
                      type="password"
                      value={smtpConfig.pass || ''}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, pass: e.target.value })}
                      placeholder="Password aplikasi 16 karakter tanpa spasi"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Nama Pengirim yang Muncul</label>
                    <input
                      type="text"
                      value={smtpConfig.fromName || 'Webkilat / Indo Digital'}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, fromName: e.target.value })}
                      placeholder="Webkilat by Indo Digital"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Email Header Pengirim (Opsional)</label>
                    <input
                      type="email"
                      value={smtpConfig.fromEmail || ''}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, fromEmail: e.target.value })}
                      placeholder="no-reply@webmurah.biz.id atau sama dengan user"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-[11px] text-sky-900 space-y-1">
                  <div className="font-extrabold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    <span>Petunjuk Menggunakan Gmail SMTP:</span>
                  </div>
                  <p className="text-sky-800 leading-relaxed">
                    1. Buka <strong>Akun Google &gt; Keamanan &gt; Verifikasi 2 Langkah</strong>.<br />
                    2. Pada menu <strong>Sandi Aplikasi (App Passwords)</strong>, buat sandi baru untuk <em>Mail / Webkilat</em>.<br />
                    3. Salin 16 karakter sandi tersebut ke kolom <strong>Password Aplikasi</strong> di atas.<br />
                    4. Klik tombol <strong>Simpan &amp; Verifikasi SMTP</strong> di bawah.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSavingSmtp}
                  className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSmtp ? 'Memverifikasi Koneksi SMTP...' : 'Simpan & Verifikasi Koneksi SMTP'}</span>
                </button>
              </form>
            </div>

            {/* Section 4: Uji Coba Pengiriman Langsung (Instant Test Send) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Send className="w-5 h-5 text-emerald-600" />
                    <span>Uji Coba Pengiriman Langsung (Diagnostic Test Email)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kirim 1 email percobaan ke inbox Anda untuk memverifikasi handshake server SMTP dan penerimaan email di aplikasi Gmail/mail client.
                  </p>
                </div>
              </div>

              {testEmailResult && (
                <div
                  className={`p-4 rounded-2xl text-xs flex items-start gap-2.5 font-bold ${
                    testEmailResult.success
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {testEmailResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p>{testEmailResult.message}</p>
                    {testEmailResult.error && (
                      <p className="font-mono text-[11px] text-rose-700 bg-rose-100/70 p-2 rounded-lg mt-1">
                        {testEmailResult.error}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="email"
                  value={testEmailTarget}
                  onChange={(e) => setTestEmailTarget(e.target.value)}
                  placeholder="Masukkan alamat email penerima uji coba (misal: bca.ccpl@gmail.com)"
                  className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  disabled={isSendingTestEmail || !testEmailTarget.trim()}
                  onClick={() => {
                    setIsSendingTestEmail(true);
                    setTestEmailResult(null);
                    fetch('/api/newsletter/test-send', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: testEmailTarget.trim() }),
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        setIsSendingTestEmail(false);
                        setTestEmailResult(data);
                        fetchDeliveryLogs();
                      })
                      .catch((err) => {
                        setIsSendingTestEmail(false);
                        setTestEmailResult({ success: false, message: 'Gagal menghubungi server: ' + err.message });
                      });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs cursor-pointer shadow-xs whitespace-nowrap flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingTestEmail ? 'Mengirim Uji Coba...' : 'Kirim Email Tes ke Saya'}</span>
                </button>
              </div>
            </div>

            {/* Section 5: Audit Log & Riwayat Pengiriman Email (Delivery Logs) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sky-600" />
                    <span>Audit Log &amp; Riwayat Pengiriman Email ({deliveryLogs.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Catatan otomatis setiap event pengiriman email (manual admin, API/AI Studio, atau auto-scheduler) beserta status dan diagnosa error.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchDeliveryLogs}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Perbarui data log pengiriman"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refresh Log</span>
                </button>
              </div>

              {deliveryLogs.length === 0 ? (
                <div className="text-center py-8 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 text-slate-500 space-y-1">
                  <Inbox className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="text-xs font-bold">Belum ada riwayat pengiriman email yang tercatat.</p>
                  <p className="text-[11px] text-slate-400">
                    Log akan otomatis bertambah ketika ada artikel baru diterbitkan atau saat Anda mengirim email tes di atas.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-100 rounded-xl overflow-hidden">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-black tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Waktu (WIB)</th>
                        <th className="p-3">Judul Artikel / Event</th>
                        <th className="p-3">Sumber Trigger</th>
                        <th className="p-3">Penerima</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Detail &amp; Diagnosa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {deliveryLogs.map((log, idx) => (
                        <tr key={log.id || idx} className="hover:bg-slate-50/60">
                          <td className="p-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              timeZone: 'Asia/Jakarta',
                            })}{' '}
                            WIB
                          </td>
                          <td className="p-3 font-bold text-slate-900 max-w-xs truncate" title={log.articleTitle}>
                            {log.articleTitle}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {log.source === 'admin_manual'
                                ? 'Manual Admin'
                                : log.source === 'ai_studio_api'
                                ? 'AI Studio / API'
                                : log.source === 'auto_scheduler'
                                ? 'Auto-Scheduler'
                                : log.source === 'test_send'
                                ? 'Test Send'
                                : log.source}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-700">
                            {log.recipientCount} email
                          </td>
                          <td className="p-3">
                            {log.status === 'DELIVERED' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1 w-max">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                TERKIRIM
                              </span>
                            )}
                            {log.status === 'FAILED' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold flex items-center gap-1 w-max">
                                <AlertCircle className="w-3 h-3 text-rose-600" />
                                GAGAL
                              </span>
                            )}
                            {log.status === 'CONFIG_REQUIRED' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold flex items-center gap-1 w-max">
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                BUTUH SMTP
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-[11px] text-slate-500 max-w-sm">
                            {log.errorDetails ? (
                              <span className="text-rose-600 font-medium block leading-tight">
                                {log.errorDetails}
                              </span>
                            ) : log.messageId ? (
                              <span className="font-mono text-[10px] text-slate-400">
                                ID: {log.messageId.slice(0, 22)}...
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: MANAJEMEN MITRA MANDIRI (NON-PKWT) */}
        {/* ========================================================= */}
        {activeTab === 'mitra' && (
          <div className="animate-fade-in max-w-6xl mx-auto pb-12">
            <AdminMitraManagement />
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* POPUP MODAL: HASIL PUSH EMAIL BROADCAST NEWSLETTER */}
      {/* ========================================================= */}
      {broadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setBroadcastModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Notifikasi Newsletter Terkirim!</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 leading-snug">
                {broadcastModal.title}
              </h2>
              <p className="text-xs text-slate-600">
                Pemberitahuan artikel telah dipersiapkan untuk <strong>{broadcastModal.count} subscriber</strong>.
              </p>
            </div>

            {/* Status Delivery Box */}
            <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
              broadcastModal.smtpSent
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div className="font-extrabold flex items-center gap-2">
                {broadcastModal.smtpSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Email Berhasil Dikirim Otomatis Melalui Server SMTP!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span>Siap Dikirim / Buka di Aplikasi Email Anda</span>
                  </>
                )}
              </div>
              <p className="text-[11px] leading-relaxed">
                {broadcastModal.smtpSent
                  ? 'Server telah mem-push email notifikasi langsung ke inbox subscriber tanpa tindakan tambahan.'
                  : 'Jika Anda belum mengonfigurasi SMTP di tab Newsletter, Anda dapat langsung mengklik tombol di bawah untuk membuka Gmail dengan daftar email penerima otomatis terisi di kolom BCC.'}
              </p>
            </div>

            {/* Recipient Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600">Daftar Penerima ({broadcastModal.count}):</span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-100">
                {broadcastModal.recipients.map((rec: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-700">
                    {rec}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href={broadcastModal.mailtoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Buka di Gmail / Aplikasi Email (BCC)</span>
              </a>

              <button
                type="button"
                onClick={() => setBroadcastModal(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* POPUP MODAL: KONFIRMASI HAPUS ARTIKEL */}
      {/* ========================================================= */}
      {articleDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setArticleDeleteModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Hapus Artikel Ini?
                </h3>
                <p className="text-xs text-slate-500">
                  Tindakan ini akan menghapus artikel dari database website.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="text-xs font-black text-slate-900 line-clamp-2">
                {articleDeleteModal.title}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                <span>Status:</span>
                <span className={`font-bold ${articleDeleteModal.isCustom ? 'text-emerald-700' : 'text-slate-700'}`}>
                  {articleDeleteModal.isCustom ? 'Artikel Diterbitkan Admin' : 'Artikel Bawaan Sistem'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Setelah dihapus, artikel ini tidak akan tampil lagi di tab artikel website publik. Anda sewaktu-waktu dapat mereset artikel ke bawaan jika diperlukan.
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setArticleDeleteModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => confirmDeleteArticle(articleDeleteModal.id)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Artikel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
