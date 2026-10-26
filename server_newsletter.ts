import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface SubscriberRecord {
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

export interface NewsletterDeliveryLog {
  id: string;
  timestamp: string;
  articleId?: string;
  articleTitle: string;
  source: 'admin_manual' | 'ai_studio_api' | 'external_webhook' | 'auto_scheduler' | 'test_send';
  recipientCount: number;
  recipients: string[];
  status: 'DELIVERED' | 'FAILED' | 'CONFIG_REQUIRED' | 'SIMULATED';
  provider: string;
  messageId?: string;
  errorDetails?: string | null;
  durationMs: number;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
}

const SUBSCRIBERS_FILE = path.join(__dirname, 'data_subscribers.json');
const SMTP_CONFIG_FILE = path.join(__dirname, 'data_smtp_config.json');
const LOGS_FILE = path.join(__dirname, 'data_newsletter_logs.json');

// In-memory deduplication cache: map of articleId -> lastDispatchedTimestamp
const dispatchCache = new Map<string, number>();

export function getSubscribers(): SubscriberRecord[] {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const raw = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('[Newsletter] Error reading subscribers file:', e);
  }

  // Default seed subscriber
  const initial: SubscriberRecord[] = [
    { email: 'bca.ccpl@gmail.com', subscribedAt: new Date().toISOString(), status: 'active' },
  ];
  saveSubscribers(initial);
  return initial;
}

export function saveSubscribers(list: SubscriberRecord[]): void {
  try {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Newsletter] Error writing subscribers file:', e);
  }
}

export function getSmtpConfig(): SmtpConfig {
  try {
    if (fs.existsSync(SMTP_CONFIG_FILE)) {
      const raw = fs.readFileSync(SMTP_CONFIG_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('[Newsletter] Error reading SMTP config file:', e);
  }

  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: (process.env.SMTP_PORT || '465') === '465',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromName: process.env.SMTP_FROM_NAME || 'Webkilat - Edukasi & Inspirasi UMKM',
    fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'no-reply@webmurah.biz.id',
  };
}

export function saveSmtpConfig(config: Partial<SmtpConfig>): void {
  const current = getSmtpConfig();
  const updated: SmtpConfig = {
    ...current,
    ...config,
    port: Number(config.port || current.port),
    secure: Number(config.port || current.port) === 465,
  };
  try {
    fs.writeFileSync(SMTP_CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Newsletter] Error writing SMTP config file:', e);
  }
}

export function getNewsletterLogs(): NewsletterDeliveryLog[] {
  try {
    if (fs.existsSync(LOGS_FILE)) {
      const raw = fs.readFileSync(LOGS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (e) {
    console.error('[Newsletter] Error reading newsletter logs:', e);
  }
  return [];
}

export function appendNewsletterLog(log: NewsletterDeliveryLog): void {
  try {
    const logs = getNewsletterLogs();
    logs.unshift(log); // newest first
    // keep last 100 entries
    const truncated = logs.slice(0, 100);
    fs.writeFileSync(LOGS_FILE, JSON.stringify(truncated, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Newsletter] Error appending newsletter log:', e);
  }
}

export function createTransporter(config: SmtpConfig) {
  if (!config.user || !config.pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: config.host || 'smtp.gmail.com',
    port: Number(config.port) || 465,
    secure: Number(config.port) === 465,
    auth: {
      user: config.user.trim(),
      pass: config.pass.trim(),
    },
    // Useful timeout settings to prevent long-running hanging requests
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 15000,
  });
}

/**
 * Diagnostic helper to translate common SMTP error codes into clear actionable Indonesian advice
 */
function translateSmtpError(err: any, config: SmtpConfig): string {
  const msg = err?.message || String(err);
  const code = err?.code || '';

  if (code === 'EAUTH' || msg.includes('535') || msg.includes('Username and Password not accepted')) {
    if (config.host.includes('gmail')) {
      return 'Autentikasi Gagal (EAUTH / 535): Akun Gmail menolak password biasa. Anda WAJIB mengaktifkan 2-Step Verification pada akun Google, lalu membuat "App Password" (Sandi Aplikasi) 16 digit khusus di myaccount.google.com/apppasswords.';
    }
    return `Autentikasi Gagal (EAUTH): Username (${config.user}) atau password SMTP ditolak oleh server ${config.host}.`;
  }

  if (code === 'ETIMEDOUT' || code === 'ESOCKETTIMEDOUT') {
    return `Koneksi Timeout (ETIMEDOUT): Tidak dapat terhubung ke ${config.host}:${config.port}. Coba ganti port ke 587 (TLS) atau periksa koneksi firewall.`;
  }

  if (code === 'ECONNREFUSED') {
    return `Koneksi Ditolak (ECONNREFUSED): Host ${config.host} menolak koneksi pada port ${config.port}.`;
  }

  if (code === 'EENVELOPE') {
    return 'Alamat penerima atau pengirim tidak valid (EENVELOPE). Periksa format email tujuan.';
  }

  return `Error SMTP [${code}]: ${msg}`;
}

export interface DispatchArticlePayload {
  id?: string;
  title: string;
  subtitle?: string;
  category?: string;
  summary: string;
  readTime?: string;
  imageUrl?: string;
  articleUrl?: string;
  status?: 'published' | 'draft' | 'queued' | string;
}

/**
 * Centralized Article Dispatcher:
 * Ensures all article publications (manual admin, AI Studio/API, webhook, or auto-scheduler)
 * follow the exact same verified delivery pipeline with deduplication and audit logging.
 */
export async function dispatchArticleNewsletter(
  article: DispatchArticlePayload,
  source: 'admin_manual' | 'ai_studio_api' | 'external_webhook' | 'auto_scheduler'
): Promise<{
  success: boolean;
  status: 'DELIVERED' | 'FAILED' | 'CONFIG_REQUIRED' | 'SKIPPED_DRAFT' | 'DUPLICATE_SKIPPED';
  message: string;
  recipientCount: number;
  recipients: string[];
  error?: string | null;
  mailtoUrl?: string;
}> {
  const startTime = Date.now();

  // 1. Guard check: Only 'published' articles trigger notifications (ignore drafts)
  if (article.status === 'draft') {
    return {
      success: true,
      status: 'SKIPPED_DRAFT',
      message: 'Status artikel adalah draft. Notifikasi newsletter dilewati.',
      recipientCount: 0,
      recipients: [],
    };
  }

  // 2. Deduplication check (protect against double calls within 5 minutes)
  const dedupKey = article.id || article.title;
  const lastTime = dispatchCache.get(dedupKey);
  const now = Date.now();
  if (lastTime && now - lastTime < 5 * 60 * 1000) {
    return {
      success: true,
      status: 'DUPLICATE_SKIPPED',
      message: 'Artikel ini sudah baru saja diproses broadcast dalam 5 menit terakhir.',
      recipientCount: 0,
      recipients: [],
    };
  }
  dispatchCache.set(dedupKey, now);

  // 3. Get active subscribers
  const activeSubscribers = getSubscribers().filter((s) => s.status === 'active');
  const recipientEmails = activeSubscribers.map((s) => s.email);

  const cleanTitle = (article.title || 'Artikel Baru').trim();
  const cleanSummary = (article.summary || '').trim();
  const cleanCategory = (article.category || 'Artikel UMKM').trim();
  const targetUrl = article.articleUrl || 'https://webmurah.biz.id/#/artikel';
  const emailSubject = `[Artikel Baru] ${cleanTitle} - Webkilat`;

  // Build clean plain text fallback
  const emailText = `
Halo Pelaku UMKM Indonesia!

Kami baru saja menerbitkan artikel edukasi bisnis terbaru:
"${cleanTitle}"
Kategori: ${cleanCategory} (${article.readTime || '4 Menit Baca'})

Ringkasan:
${cleanSummary}

Baca selengkapnya di web kami:
${targetUrl}

--
Webkilat & Indo Digital Solution
WhatsApp Admin: 0896-7368-6625
Website: https://webmurah.biz.id
  `.trim();

  // Build high-converting HTML template
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${cleanTitle}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; max-width: 600px;">
              <!-- Header Banner -->
              <tr>
                <td style="background: linear-gradient(135deg, #1D3582 0%, #0284c7 100%); padding: 32px 30px; text-align: center;">
                  <div style="display: inline-block; background-color: rgba(255,255,255,0.18); padding: 4px 12px; border-radius: 20px; color: #fef08a; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">
                    UPDATE ARTIKEL &amp; INSPIRASI BISNIS UMKM
                  </div>
                  <h1 style="color: #ffffff; font-size: 22px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">
                    Webkilat &bull; Indo Digital
                  </h1>
                  <p style="color: #e0f2fe; font-size: 13px; margin: 6px 0 0 0;">
                    Studi Kasus Digitalisasi, Tips Closing WhatsApp &amp; Optimasi Omzet
                  </p>
                </td>
              </tr>

              <!-- Article Content -->
              <tr>
                <td style="padding: 32px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                    <tr>
                      <td>
                        <span style="background-color: #f0fdf4; color: #166534; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; border: 1px solid #bbf7d0; text-transform: uppercase;">
                          ${cleanCategory}
                        </span>
                      </td>
                      <td align="right" style="font-size: 12px; color: #64748b; font-weight: 600;">
                        &bull; ${article.readTime || '4 Menit Baca'}
                      </td>
                    </tr>
                  </table>

                  <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; line-height: 1.4; margin: 0 0 16px 0;">
                    ${cleanTitle}
                  </h2>

                  ${
                    article.imageUrl
                      ? `
                    <div style="margin: 16px 0 20px 0; border-radius: 12px; overflow: hidden; background-color: #f1f5f9; text-align: center;">
                      <img src="${article.imageUrl}" alt="${cleanTitle}" style="width: 100%; max-height: 280px; object-fit: cover; display: block;" />
                    </div>
                  `
                      : ''
                  }

                  <p style="color: #334155; font-size: 14px; line-height: 1.7; margin: 0 0 24px 0;">
                    ${cleanSummary}
                  </p>

                  <div style="text-align: center; padding: 12px 0 20px 0;">
                    <a href="${targetUrl}" target="_blank" style="background-color: #0284c7; color: #ffffff; padding: 14px 30px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);">
                      BACA ARTIKEL LENGKAP SEKARANG &rarr;
                    </a>
                  </div>

                  <div style="background-color: #fffbeb; border-radius: 12px; border: 1px solid #fef3c7; padding: 14px 18px; margin-top: 10px;">
                    <p style="margin: 0; color: #92400e; font-size: 12px; font-weight: 600; line-height: 1.5;">
                      💡 <strong>Butuh Website / Landing Page Bisnis?</strong> Dapatkan promo Flash Sale Rp 499.000 (1 hari kerja beres &amp; gratis domain) di <a href="https://webmurah.biz.id" style="color: #b45309; text-decoration: underline;">webmurah.biz.id</a>
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 30px; text-align: center;">
                  <p style="color: #64748b; font-size: 12px; margin: 0 0 6px 0; font-weight: 700;">
                    Webkilat by Indo Digital Solution
                  </p>
                  <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
                    Anda menerima email ini karena terdaftar pada Newsletter Komunitas UMKM webmurah.biz.id.<br/>
                    WhatsApp Admin: 0896-7368-6625 &bull; Kota Bekasi, Jawa Barat
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Fallback mailto URL
  const bccString = recipientEmails.join(',');
  const mailtoUrl = `mailto:?bcc=${encodeURIComponent(bccString)}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailText)}`;

  if (recipientEmails.length === 0) {
    const durationMs = Date.now() - startTime;
    appendNewsletterLog({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      articleId: article.id,
      articleTitle: cleanTitle,
      source,
      recipientCount: 0,
      recipients: [],
      status: 'CONFIG_REQUIRED',
      provider: 'none',
      errorDetails: 'Tidak ada subscriber dengan status aktif di database.',
      durationMs,
    });

    return {
      success: false,
      status: 'CONFIG_REQUIRED',
      message: 'Tidak ada subscriber aktif yang terdaftar.',
      recipientCount: 0,
      recipients: [],
      mailtoUrl,
    };
  }

  const smtpConfig = getSmtpConfig();
  const transporter = createTransporter(smtpConfig);

  // If SMTP is NOT configured (no user or pass)
  if (!transporter) {
    const durationMs = Date.now() - startTime;
    const errorMsg =
      'Kredensial SMTP belum diatur (user/password kosong). Email otomatis ke subscriber tidak dapat dikirim ke server email. Silakan isi konfigurasi SMTP (Gmail App Password 16 karakter) pada tab Pengaturan SMTP di Admin Panel.';

    console.warn(`[Newsletter Notice - ${source}]`, errorMsg);

    appendNewsletterLog({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      articleId: article.id,
      articleTitle: cleanTitle,
      source,
      recipientCount: recipientEmails.length,
      recipients: recipientEmails,
      status: 'CONFIG_REQUIRED',
      provider: smtpConfig.host || 'unconfigured',
      errorDetails: errorMsg,
      durationMs,
    });

    return {
      success: false,
      status: 'CONFIG_REQUIRED',
      message: errorMsg,
      recipientCount: recipientEmails.length,
      recipients: recipientEmails,
      error: errorMsg,
      mailtoUrl,
    };
  }

  // Attempt real SMTP dispatch
  try {
    const senderFrom = `"${smtpConfig.fromName}" <${smtpConfig.fromEmail || smtpConfig.user}>`;

    const info = await transporter.sendMail({
      from: senderFrom,
      bcc: recipientEmails,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
      headers: {
        'X-Entity-Ref-ID': article.id || String(Date.now()),
        'Precedence': 'bulk',
        'List-Unsubscribe': `<mailto:${smtpConfig.fromEmail || smtpConfig.user}?subject=unsubscribe>`,
      },
    });

    const durationMs = Date.now() - startTime;
    console.log(`[Newsletter Success - ${source}] Dispatched to ${recipientEmails.length} recipients. MessageId: ${info.messageId}`);

    appendNewsletterLog({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      articleId: article.id,
      articleTitle: cleanTitle,
      source,
      recipientCount: recipientEmails.length,
      recipients: recipientEmails,
      status: 'DELIVERED',
      provider: smtpConfig.host,
      messageId: info.messageId,
      errorDetails: null,
      durationMs,
    });

    return {
      success: true,
      status: 'DELIVERED',
      message: `Berhasil mengirim push email ke ${recipientEmails.length} subscriber via ${smtpConfig.host}!`,
      recipientCount: recipientEmails.length,
      recipients: recipientEmails,
      mailtoUrl,
    };
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    const diagnostic = translateSmtpError(err, smtpConfig);
    console.error(`[Newsletter Failed - ${source}]`, diagnostic, err);

    appendNewsletterLog({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      articleId: article.id,
      articleTitle: cleanTitle,
      source,
      recipientCount: recipientEmails.length,
      recipients: recipientEmails,
      status: 'FAILED',
      provider: smtpConfig.host,
      errorDetails: diagnostic,
      durationMs,
    });

    return {
      success: false,
      status: 'FAILED',
      message: `Gagal mengirim email: ${diagnostic}`,
      recipientCount: recipientEmails.length,
      recipients: recipientEmails,
      error: diagnostic,
      mailtoUrl,
    };
  }
}

/**
 * Diagnostic tool: Test send a single email to an explicit target
 */
export async function testSendDiagnosticEmail(targetEmail: string): Promise<{
  success: boolean;
  message: string;
  error?: string | null;
  provider: string;
}> {
  const smtpConfig = getSmtpConfig();
  const transporter = createTransporter(smtpConfig);

  if (!transporter) {
    appendNewsletterLog({
      id: 'log-test-' + Date.now(),
      timestamp: new Date().toISOString(),
      articleTitle: 'Uji Coba Pengiriman Email',
      source: 'test_send',
      recipientCount: 1,
      recipients: [targetEmail],
      status: 'CONFIG_REQUIRED',
      provider: smtpConfig.host,
      errorDetails: 'Kredensial SMTP belum diatur (User atau Password kosong). Harap masukkan kredensial di Form SMTP Pengirim.',
      durationMs: 0,
    });
    return {
      success: false,
      message: 'SMTP belum dikonfigurasi. Harap isi User dan Password SMTP terlebih dahulu pada Form Konfigurasi SMTP di bawah.',
      error: 'User atau Password SMTP masih kosong.',
      provider: smtpConfig.host,
    };
  }

  const startTime = Date.now();
  try {
    // 1. Verify connection handshake
    await transporter.verify();

    // 2. Send test email
    const senderFrom = `"${smtpConfig.fromName}" <${smtpConfig.fromEmail || smtpConfig.user}>`;
    const testTime = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const info: any = await transporter.sendMail({
      from: senderFrom,
      to: targetEmail,
      subject: '[Test Koneksi Berhasil] Sistem Newsletter Webkilat Aktif! ✅',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; padding: 24px; border: 1px solid #10b981; border-radius: 12px; background: #f0fdf4;">
          <h2 style="color: #065f46; margin-top: 0;">Koneksi SMTP Berhasil! 🎉</h2>
          <p style="color: #1e293b; font-size: 14px; line-height: 1.6;">
            Email uji coba ini mengonfirmasi bahwa server SMTP <strong>${smtpConfig.host}:${smtpConfig.port}</strong> telah terhubung dengan benar dan siap mengirimkan notifikasi artikel baru ke seluruh subscriber secara otomatis.
          </p>
          <hr style="border: none; border-top: 1px solid #a7f3d0; margin: 16px 0;" />
          <p style="font-size: 11px; color: #64748b; margin: 0;">
            Waktu Uji: ${testTime} WIB &bull; Status: Terverifikasi
          </p>
        </div>
      `,
    });

    const durationMs = Date.now() - startTime;
    appendNewsletterLog({
      id: 'log-test-' + Date.now(),
      timestamp: new Date().toISOString(),
      articleTitle: 'Test Send Koneksi SMTP',
      source: 'test_send',
      recipientCount: 1,
      recipients: [targetEmail],
      status: 'DELIVERED',
      provider: smtpConfig.host,
      messageId: info.messageId,
      errorDetails: null,
      durationMs,
    });

    return {
      success: true,
      message: `Email tes berhasil terkirim ke ${targetEmail}! Message ID: ${info.messageId}`,
      provider: smtpConfig.host,
    };
  } catch (err: any) {
    const diagnostic = translateSmtpError(err, smtpConfig);
    const durationMs = Date.now() - startTime;

    appendNewsletterLog({
      id: 'log-test-' + Date.now(),
      timestamp: new Date().toISOString(),
      articleTitle: 'Test Send Koneksi SMTP (Gagal)',
      source: 'test_send',
      recipientCount: 1,
      recipients: [targetEmail],
      status: 'FAILED',
      provider: smtpConfig.host,
      errorDetails: diagnostic,
      durationMs,
    });

    return {
      success: false,
      message: `Gagal mengirim email tes: ${diagnostic}`,
      error: diagnostic,
      provider: smtpConfig.host,
    };
  }
}
