import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import {
  getSubscribers,
  saveSubscribers,
  getSmtpConfig,
  saveSmtpConfig,
  getNewsletterLogs,
  dispatchArticleNewsletter,
  testSendDiagnosticEmail,
  createTransporter,
  SubscriberRecord,
  SmtpConfig,
} from './server_newsletter';
import {
  getSchedulerConfig,
  saveSchedulerConfig,
  getArticleQueue,
  saveArticleQueue,
  getPublishedArticles,
  savePublishedArticles,
  executeAutoPublishNext,
  calculateNextScheduledSlot,
  QueuedArticle,
} from './server_article_scheduler';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_INSTRUCTION = `Anda adalah "Asisten AI Webkilat" (didukung teknologi Google Gemini 3.8 Flash), konsultan resmi landing page dan konversi penjualan digital dari Webkilat.
Misi utama Anda adalah membantu pemilik UMKM, pedagang online, praktisi jasa, dan pebisnis di Indonesia untuk memahami manfaat landing page, merumuskan ide copywriting/headline, dan menjawab pertanyaan seputar layanan jasa pembuatan landing page Webkilat.

INFORMASI LENGKAP LAYANAN WEBKILAT:
1. LAYANAN UTAMA & HARGA PROMO:
   - Jasa pembuatan landing page kustom super cepat: Selesai hanya dalam 1 HARI KERJA (24 jam) setelah materi/brief diterima.
   - Harga Normal: Rp 1.800.000,-
   - Harga Promo Flash Sale Saat Ini: Hanya Rp 499.000,- all-in (Hemat Rp 1.301.000).
   - Tanpa biaya langganan bulanan/tersembunyi untuk paket promo ini.

2. FASILITAS YANG DIDAPATKAN KLIEN (ALL-IN):
   - GRATIS Domain 1 tahun (.my.id atau .biz.id).
   - Desain 100% kustom & responsif (sangat optimal dan cepat di smartphone/HP pembeli).
   - Copywriting persuasif & menjual yang disesuaikan dengan produk/jasa klien.
   - Form pemesanan interaktif (order form) yang langsung mengirim data pesanan rapi ke WhatsApp penjual.
   - Integrasi tombol Call-to-Action (CTA) WhatsApp direct chat.
   - Gratis 1x revisi minor setelah website selesai.
   - Integrasi link media sosial, katalog foto produk, dan peta lokasi bisnis.

3. 5 ALASAN KENAPA BISNIS WAJIB PUNYA LANDING PAGE (EDUKASI INNE LIE):
   1. Toko Buka 24 Jam Nonstop: Website bekerja menerima calon pelanggan sepanjang hari tanpa lelah dan tanpa perlu bayar gaji kasir tambahan.
   2. Jangkauan Pasar Tak Terbatas: Pembeli bisa datang dari berbagai kota/pulau di Indonesia bahkan mancanegara.
   3. Tingkatkan Kredibilitas & Kepercayaan: Bisnis yang punya website/landing page terlihat jauh lebih profesional dan terpercaya dibanding hanya akun media sosial.
   4. Kumpulkan Database Pelanggan (Leads): "The money is in the list" — kumpulkan nomor kontak & data pembeli untuk strategi follow up dan repeat order.
   5. Pelacakan & Analitik Akurat: Bisa dipasang Meta Pixel (FB/IG Ads), Google Analytics, atau TikTok Pixel untuk retargeting iklan yang efektif.

4. KONTAK & CARA ORDER:
   - Kontak WhatsApp Admin: 0896-7368-6625 (Nomor: 6289673686625).
   - Cara Order: Klien cukup mengisi Formulir Pemesanan Kilat yang ada di halaman website Webkilat, lalu tekan tombol "Kirim Pesanan ke WhatsApp".

PEDOMAN GAYA BICARA & RESPON:
- Gunakan Bahasa Indonesia yang ramah, santun, antusias, jelas, dan berorientasi solusi (solutif).
- Jika pengguna menanyakan ide untuk bisnis mereka (misal: "saya jual hijab / herbal / kuliner / laundry"), berikan contoh ide Headline menarik, sudut pandang penawaran, atau struktur section landing page yang tepat.
- Format teks dengan rapi menggunakan poin-poin singkat (bullet points) agar nyaman dibaca di smartphone.
- Selalu selipkan ajakan ramah di akhir jawaban untuk memanfaatkan promo Rp 499.000 atau mengisi form order di website atau mengontak WhatsApp Admin di 0896-7368-6625.
- Jangan mengarang harga di luar Rp 499.000 untuk promo ini.`;

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Chatbot Gemini Endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Parameter pesan (message) diperlukan.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({
          reply: 'Halo! Terima kasih sudah menghubungi Webkilat. Asisten AI kami siap mendampingi Anda. Jika kunci API belum terkonfigurasi di server, jangan khawatir—Anda dapat langsung berkonsultasi secara gratis dengan tim kami via WhatsApp di 0896-7368-6625 atau mengisi formulir pemesanan promo Rp 499.000 di halaman depan!'
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Prepare conversation history
      const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-8)) {
          if (item && item.text && (item.role === 'user' || item.role === 'model')) {
            formattedContents.push({
              role: item.role,
              parts: [{ text: String(item.text) }],
            });
          }
        }
      }

      // Append current user message
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      let reply: string;
      try {
        const generatePromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        // 8-second timeout for quick fallback if network latency is high
        const timeoutPromise = new Promise<{ text?: string }>((_, reject) => {
          setTimeout(() => reject(new Error('TIMEOUT_GRACEFUL')), 8000);
        });

        const response = await Promise.race([generatePromise, timeoutPromise]);
        reply = response.text || 'Halo! Terima kasih atas pertanyaannya. Tim kami siap membantu pembuatan landing page 1 hari untuk bisnis Anda. Silakan hubungi WhatsApp 0896-7368-6625 atau isi form order di bawah.';
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        // Only log non-timeout errors for debugging
        if (!errorMsg.includes('TIMEOUT')) {
          console.warn('Gemini request notice:', errorMsg);
        }

        // Smart domain-aware response about Webkilat
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('harga') || lowerMsg.includes('biaya') || lowerMsg.includes('promo') || lowerMsg.includes('diskon')) {
          reply = `Halo! Saat ini Webkilat sedang mengadakan **Flash Sale Terbesar**: dari harga normal ~~Rp 1.800.000~~ menjadi **Cuma Rp 499.000 all-in** (hemat Rp 1.301.000)!
Sudah termasuk:
• Domain resmi aktif 1 tahun (.my.id / .biz.id)
• Hosting super cepat & sertifikat SSL resmi
• Desain 100% kustom siap closing dalam 24 jam
• Tombol pesan terhubung otomatis ke WhatsApp Anda.

Ingin klaim kuota promonya hari ini? Silakan isi formulir di bawah atau hubungi WhatsApp Admin di **0896-7368-6625**!`;
        } else if (lowerMsg.includes('domain') || lowerMsg.includes('fasilitas') || lowerMsg.includes('fitur') || lowerMsg.includes('hosting')) {
          reply = `Dengan paket **Rp 499.000 all-in**, Anda mendapatkan:
1. **Free Domain 1 Tahun** (.my.id atau .biz.id resmi)
2. **Cloud Hosting Cepat** dengan SSL/HTTPS aman
3. **Pengerjaan Kilat 24 Jam** (1 hari kerja selesai)
4. **Copywriting Menjual** disesuaikan produk Anda
5. **Formulir Order WhatsApp Otomatis**
6. **Free Revisi 1x & Panduan Lengkap**.

Hubungi admin kami di **0896-7368-6625** untuk konsultasi lebih lanjut!`;
        } else if (lowerMsg.includes('order') || lowerMsg.includes('pesan') || lowerMsg.includes('cara') || lowerMsg.includes('daftar')) {
          reply = `Cara pemesanan sangat mudah dan cepat:
1. Gulir ke bagian **"Formulir Pemesanan Kilat"** di halaman ini.
2. Masukkan data produk/bisnis Anda dan nomor WhatsApp tujuan order.
3. Klik tombol **"Order Sekarang via WhatsApp"**.
4. Tim desainer Webkilat akan langsung memproses website Anda dalam 1 hari kerja!

Ada pertanyaan sebelum memesan? Chat admin di **0896-7368-6625** (aktif 24 jam).`;
        } else {
          reply = `Halo! Terima kasih sudah menghubungi Webkilat. Tim kami siap membantu pembuatan landing page kustom 1 hari selesai seharga promo **Rp 499.000 all-in** (sudah termasuk gratis domain 1 tahun, copywriting persuasif, dan sistem order WhatsApp otomatis).

Apakah ada bidang usaha atau produk tertentu yang ingin Anda buatkan landing page-nya hari ini? Anda juga bisa langsung chat Admin kami di WhatsApp **0896-7368-6625**!`;
        }
      }

      return res.json({ reply });
    } catch (err: unknown) {
      return res.json({
        reply: `Halo! Terima kasih sudah bertanya seputar Webkilat. Tim kami siap membantu pembuatan landing page kustom 1 hari selesai dengan harga promo Flash Sale **Rp 499.000 all-in** (sudah termasuk domain gratis 1 tahun, desain mobile-friendly, copywriting, dan form order WhatsApp).\n\nAnda dapat langsung mengobrol dengan Admin kami di WhatsApp **0896-7368-6625** untuk respon kilat atau scroll ke formulir order di bawah!`,
        isFallback: true
      });
    }
  });

  // ================= NEWSLETTER & SUBSCRIBERS BACKEND =================
  // Functions getSubscribers, saveSubscribers, getSmtpConfig, saveSmtpConfig, createTransporter,
  // getNewsletterLogs, dispatchArticleNewsletter, testSendDiagnosticEmail are imported from ./server_newsletter.js


  // 1. Get all newsletter subscribers
  app.get('/api/newsletter/subscribers', (_req: Request, res: Response) => {
    const list = getSubscribers();
    const active = list.filter((s) => s.status === 'active');
    res.json({
      success: true,
      totalCount: list.length,
      activeCount: active.length,
      subscribers: list,
    });
  });

  // 2. Add new subscriber
  app.post('/api/newsletter/subscribe', async (req: Request, res: Response) => {
    try {
      const email = (req.body.email || '').trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Alamat email tidak valid.' });
      }

      const list = getSubscribers();
      const existing = list.find((s) => s.email.toLowerCase() === email);

      if (existing) {
        if (existing.status !== 'active') {
          existing.status = 'active';
          saveSubscribers(list);
        }
        return res.json({
          success: true,
          message: `Email ${email} sudah terdaftar dan statusnya aktif!`,
          alreadySubscribed: true,
        });
      }

      const newSubscriber: SubscriberRecord = {
        email,
        subscribedAt: new Date().toISOString(),
        status: 'active',
      };
      list.push(newSubscriber);
      saveSubscribers(list);

      // Try sending a welcome email if SMTP configured
      const smtp = getSmtpConfig();
      const transporter = createTransporter(smtp);
      if (transporter) {
        try {
          await transporter.sendMail({
            from: `"${smtp.fromName}" <${smtp.fromEmail || smtp.user}>`,
            to: email,
            subject: 'Selamat Datang di Newsletter Webkilat! 🚀',
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #0284c7;">
                  <h2 style="color: #1e293b; margin: 0; font-size: 22px;">Webkilat by Indo Digital</h2>
                  <p style="color: #0284c7; font-weight: bold; margin: 4px 0 0 0; font-size: 13px;">INSPIRASI &amp; STRATEGI DIGITAL UMKM</p>
                </div>
                <div style="padding: 24px 0;">
                  <h3 style="color: #0f172a; margin-top: 0;">Halo Rekan Bisnis! 👋</h3>
                  <p style="color: #475569; font-size: 14px; line-height: 1.6;">Terima kasih telah berlangganan newsletter kami. Anda akan menerima update studi kasus, strategi closing via WhatsApp, dan tips optimasi landing page setiap kali artikel baru diterbitkan.</p>
                  <div style="text-align: center; margin: 28px 0;">
                    <a href="https://webmurah.biz.id/#/artikel" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Jelajahi Artikel UMKM</a>
                  </div>
                </div>
                <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 11px; color: #94a3b8; text-align: center;">
                  &copy; ${new Date().getFullYear()} Webkilat (webmurah.biz.id) &bull; Indo Digital Solution
                </div>
              </div>
            `,
          });
        } catch (mailErr) {
          console.warn('Welcome mail notice:', mailErr);
        }
      }

      res.json({
        success: true,
        message: `Terima kasih! Email ${email} berhasil didaftarkan.`,
        subscriber: newSubscriber,
      });
    } catch (err) {
      console.error('Subscribe error:', err);
      res.status(500).json({ error: 'Gagal memproses pendaftaran newsletter.' });
    }
  });

  // 3. Delete / Unsubscribe
  app.delete('/api/newsletter/subscribers/:email', (req: Request, res: Response) => {
    const targetEmail = (req.params.email || '').trim().toLowerCase();
    const list = getSubscribers();
    const filtered = list.filter((s) => s.email.toLowerCase() !== targetEmail);
    saveSubscribers(filtered);
    res.json({ success: true, message: `Email ${targetEmail} berhasil dihapus.` });
  });

  // 4. Get SMTP Config (masked)
  app.get('/api/newsletter/smtp-config', (_req: Request, res: Response) => {
    const config = getSmtpConfig();
    res.json({
      host: config.host,
      port: config.port,
      user: config.user,
      fromName: config.fromName,
      fromEmail: config.fromEmail,
      hasPassword: Boolean(config.pass),
      isConfigured: Boolean(config.user && config.pass),
    });
  });

  // 5. Save SMTP Config & Test Connection
  app.post('/api/newsletter/smtp-config', async (req: Request, res: Response) => {
    try {
      const { host, port, user, pass, fromName, fromEmail } = req.body;
      const current = getSmtpConfig();
      const updated = {
        host: host ? String(host).trim() : current.host,
        port: port ? Number(port) : current.port,
        secure: Number(port || current.port) === 465,
        user: user ? String(user).trim() : current.user,
        pass: pass ? String(pass).trim() : current.pass,
        fromName: fromName ? String(fromName).trim() : current.fromName,
        fromEmail: fromEmail ? String(fromEmail).trim() : current.fromEmail,
      };

      // Test transporter if credentials are provided
      if (updated.user && updated.pass) {
        const transporter = createTransporter(updated);
        if (transporter) {
          try {
            await transporter.verify();
          } catch (verifyErr: any) {
            return res.status(400).json({
              error: `Gagal verifikasi SMTP: ${verifyErr.message || 'Kredensial atau host salah'}. Pastikan menggunakan App Password 16 digit untuk akun Gmail.`,
            });
          }
        }
      }

      saveSmtpConfig(updated);
      res.json({
        success: true,
        message: 'Pengaturan SMTP berhasil disimpan dan diverifikasi!',
        isConfigured: Boolean(updated.user && updated.pass),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Gagal menyimpan konfigurasi SMTP.' });
    }
  });

  // 6. Get Newsletter Delivery Logs & Audit Trail
  app.get('/api/newsletter/logs', (_req: Request, res: Response) => {
    try {
      const logs = getNewsletterLogs();
      res.json({
        success: true,
        count: logs.length,
        logs,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Gagal memuat log newsletter' });
    }
  });

  // 7. Instant Test-Send Diagnostic Email
  app.post('/api/newsletter/test-send', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Alamat email tujuan uji coba wajib diisi.' });
      }
      const result = await testSendDiagnosticEmail(String(email).trim());
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Gagal mengirim email tes' });
    }
  });

  // 8. Broadcast Newsletter to all subscribers on new article post
  app.post('/api/newsletter/broadcast', async (req: Request, res: Response) => {
    try {
      const { title, subtitle, category, summary, readTime, imageUrl, articleUrl } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Judul artikel wajib diisi untuk broadcast.' });
      }

      const dispatchResult = await dispatchArticleNewsletter(
        {
          title,
          subtitle,
          category,
          summary,
          readTime,
          imageUrl,
          articleUrl: articleUrl || 'https://webmurah.biz.id/#/artikel',
          status: 'published',
        },
        'admin_manual'
      );

      res.json({
        success: dispatchResult.success,
        status: dispatchResult.status,
        message: dispatchResult.message,
        subscriberCount: dispatchResult.recipientCount,
        recipients: dispatchResult.recipients,
        smtpConfigured: Boolean(getSmtpConfig().user && getSmtpConfig().pass),
        smtpSent: dispatchResult.status === 'DELIVERED',
        smtpError: dispatchResult.error || null,
        mailtoUrl: dispatchResult.mailtoUrl,
        subject: `[Artikel Baru] ${title} - Webkilat`,
        emailBodyPreview: summary,
      });
    } catch (err: any) {
      console.error('Broadcast error:', err);
      res.status(500).json({ error: err.message || 'Gagal melakukan broadcast newsletter.' });
    }
  });

  // 9. Universal Article Publishing & Trigger Hook (Admin UI, External API, Google AI Studio)
  app.post('/api/articles/publish', async (req: Request, res: Response) => {
    try {
      const {
        id,
        title,
        subtitle,
        category,
        categoryColor,
        readTime,
        summary,
        imageUrl,
        videoUrl,
        videoType,
        content,
        status = 'published', // 'published' | 'draft'
        targetKeyword,
        secondaryKeywords,
        source = 'ai_studio_api', // 'admin_manual' | 'ai_studio_api' | 'external_webhook'
        sendNewsletter = true,
      } = req.body;

      if (!title || !summary) {
        return res.status(400).json({ error: 'Parameter judul (title) dan ringkasan (summary) wajib diisi.' });
      }

      const articleId =
        id ||
        'art-' +
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .slice(0, 40) +
          '-' +
          Date.now().toString().slice(-4);

      const articleObj: QueuedArticle = {
        id: articleId,
        category: category || 'Tips & Digitalisasi UMKM',
        categoryColor: categoryColor || 'bg-sky-50 text-sky-800 border-sky-200',
        title: title.trim(),
        subtitle: subtitle?.trim() || title.trim(),
        readTime: readTime || '4 Menit Baca',
        date: new Date().getFullYear().toString(),
        sourceName: 'Admin Indo Digital',
        sourceUrl: '#',
        keyStat: '+100%',
        keyStatLabel: 'Pertumbuhan',
        summary: summary.trim(),
        imageUrl: imageUrl || undefined,
        metaDescription: summary.slice(0, 155),
        targetKeyword: targetKeyword || 'digitalisasi UMKM',
        secondaryKeywords: secondaryKeywords || [],
        content:
          typeof content === 'object' && content?.bodyText
            ? content
            : { bodyText: typeof content === 'string' ? content : summary },
        status: status === 'draft' ? 'queued' : 'published',
        publishedAt: status === 'published' ? new Date().toISOString() : undefined,
      };

      if (status === 'published') {
        const publishedList = getPublishedArticles();
        const updated = [articleObj, ...publishedList.filter((a) => a.id !== articleId)];
        savePublishedArticles(updated);
      } else {
        const queue = getArticleQueue();
        queue.push(articleObj);
        saveArticleQueue(queue);
      }

      // Trigger newsletter broadcast only if published and requested
      let newsletterResult: any = null;
      if (status === 'published' && sendNewsletter) {
        const dispatchSource =
          source === 'admin_manual'
            ? 'admin_manual'
            : source === 'external_webhook'
            ? 'external_webhook'
            : 'ai_studio_api';

        newsletterResult = await dispatchArticleNewsletter(
          {
            id: articleId,
            title: articleObj.title,
            subtitle: articleObj.subtitle,
            category: articleObj.category,
            summary: articleObj.summary,
            readTime: articleObj.readTime,
            imageUrl: articleObj.imageUrl,
            articleUrl: 'https://webmurah.biz.id/#/artikel',
            status: 'published',
          },
          dispatchSource
        );
      }

      res.json({
        success: true,
        message:
          status === 'published'
            ? `Artikel "${articleObj.title}" berhasil dipublikasikan dan ${
                newsletterResult?.status === 'DELIVERED'
                  ? 'email notifikasi sukses dikirim ke subscriber!'
                  : 'siap dibaca!'
              }`
            : `Artikel berhasil disimpan ke antrean draf.`,
        article: articleObj,
        newsletter: newsletterResult,
      });
    } catch (err: any) {
      console.error('Publish article error:', err);
      res.status(500).json({ error: err.message || 'Gagal memproses publikasi artikel' });
    }
  });

  // 10. Webhook endpoint for external automation (n8n, Make, Zapier, AI Studio script)
  app.post('/api/articles/webhook', async (req: Request, res: Response) => {
    try {
      req.body.source = 'external_webhook';
      const { title, summary } = req.body;
      if (!title || !summary) {
        return res.status(400).json({ error: 'Webhook payload membutuhkan title dan summary.' });
      }

      // Re-route to publish handler logic
      const publishRes = await fetch(`http://localhost:${PORT}/api/articles/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      const data = await publishRes.json();
      res.status(publishRes.status).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ================= ARTICLE AUTO-SCHEDULER API (2 ARTIKEL / HARI) =================
  app.get('/api/articles/auto-scheduler', (_req: Request, res: Response) => {
    try {
      const config = getSchedulerConfig();
      const queue = getArticleQueue();
      const published = getPublishedArticles();
      const nextSlotInfo = calculateNextScheduledSlot(config.dailySlots);

      res.json({
        success: true,
        config: {
          ...config,
          nextSlotName: nextSlotInfo.slotName,
        },
        queue,
        published,
        pendingQueueCount: queue.filter((a) => a.status === 'queued').length,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Gagal memuat status auto-scheduler' });
    }
  });

  app.post('/api/articles/auto-scheduler/toggle', (req: Request, res: Response) => {
    try {
      const { enabled } = req.body;
      const config = getSchedulerConfig();
      config.enabled = Boolean(enabled);
      saveSchedulerConfig(config);
      res.json({ success: true, enabled: config.enabled, config });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/articles/auto-scheduler/trigger-now', async (_req: Request, res: Response) => {
    try {
      const result = await executeAutoPublishNext(async (article) => {
        await dispatchArticleNewsletter(article, 'auto_scheduler');
      });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/articles/auto-scheduler/add-queue', (req: Request, res: Response) => {
    try {
      const { title, subtitle, category, summary, bodyText, imageUrl, targetKeyword } = req.body;
      if (!title || !summary) {
        return res.status(400).json({ error: 'Judul dan ringkasan wajib diisi.' });
      }

      const queue = getArticleQueue();
      const newQueued: QueuedArticle = {
        id: 'queued-' + Date.now(),
        category: category || 'Tips Bisnis & Marketing',
        categoryColor: 'bg-sky-50 text-sky-800 border-sky-200',
        title: title.trim(),
        subtitle: subtitle?.trim() || title.trim(),
        readTime: '4 Menit Baca',
        date: new Date().getFullYear().toString(),
        sourceName: 'Admin Indo Digital',
        sourceUrl: '#',
        keyStat: '+100%',
        keyStatLabel: 'Pertumbuhan',
        summary: summary.trim(),
        imageUrl: imageUrl || undefined,
        metaDescription: summary.slice(0, 150),
        targetKeyword: targetKeyword || 'digitalisasi UMKM',
        secondaryKeywords: [],
        content: { bodyText: bodyText || summary },
        status: 'queued',
      };

      queue.push(newQueued);
      saveArticleQueue(queue);
      res.json({ success: true, message: 'Artikel berhasil dimasukkan ke antrean auto-post!', article: newQueued });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/articles/published', (_req: Request, res: Response) => {
    try {
      const published = getPublishedArticles();
      res.json({ success: true, articles: published });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Background auto-post worker (memeriksa antrean setiap 30 detik untuk jadwal 08:00 & 17:00 WIB)
  setInterval(async () => {
    try {
      const config = getSchedulerConfig();
      if (!config.enabled) return;

      const now = Date.now();
      const scheduledTime = new Date(config.nextPostScheduledAt).getTime();

      if (now >= scheduledTime) {
        console.log('[Auto-Scheduler] Waktu jadwal publikasi harian tercapai. Memproses artikel antrean...');
        await executeAutoPublishNext(async (article) => {
          await dispatchArticleNewsletter(article, 'auto_scheduler');
        });
      }
    } catch (err) {
      console.error('[Auto-Scheduler] Worker error:', err);
    }
  }, 30000);

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'webkilat-backend',
      timestamp: new Date().toISOString(),
      model: 'gemini-3.8-flash'
    });
  });

  // Domain Availability Check Endpoint
  app.get('/api/check-domain', async (req: Request, res: Response) => {
    try {
      const rawDomain = ((req.query.domain as string) || '').toLowerCase().trim();
      if (!rawDomain) {
        return res.status(400).json({ error: 'Parameter domain wajib diisi.' });
      }

      // Clean domain input: strip protocol, www, slashes, spaces
      let clean = rawDomain
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '')
        .replace(/\/.*$/, '')
        .replace(/[^a-z0-9.-]/g, '');

      if (!clean) {
        return res.status(400).json({ error: 'Nama domain tidak valid.' });
      }

      const extensions = ['.my.id', '.biz.id', '.com', '.id'];
      let baseName = clean;
      let specifiedExt = '';

      for (const ext of extensions) {
        if (clean.endsWith(ext)) {
          baseName = clean.slice(0, -ext.length);
          specifiedExt = ext;
          break;
        }
      }

      if (baseName.includes('.')) {
        baseName = baseName.split('.')[0];
      }

      let extList = [...extensions];
      if (specifiedExt) {
        extList = [specifiedExt, ...extensions.filter((e) => e !== specifiedExt)];
      }

      const checkPromises = extList.map(async (ext) => {
        const fullDomain = `${baseName}${ext}`;
        let isAvailable = false;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const dohRes = await fetch(
            `https://dns.google/resolve?name=${encodeURIComponent(fullDomain)}&type=NS`,
            {
              headers: { Accept: 'application/dns-json' },
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);

          if (dohRes.ok) {
            const data: any = await dohRes.json();
            if (data.Status === 3) {
              isAvailable = true;
            } else if (
              data.Status === 0 &&
              (!data.Answer || data.Answer.length === 0) &&
              (!data.Authority || data.Authority.length === 0)
            ) {
              isAvailable = true;
            } else {
              isAvailable = false;
            }
          } else {
            isAvailable = true;
          }
        } catch {
          isAvailable = true;
        }

        const isFree = ext === '.my.id' || ext === '.biz.id';
        return {
          domain: fullDomain,
          extension: ext,
          isAvailable,
          isFreeWithPromo: isFree,
          badge: isFree ? 'Gratis 1 Tahun Promo' : 'Ekstensi Populer',
          message: isAvailable
            ? `${fullDomain} TERSEDIA! Siap digunakan untuk landing page Anda.`
            : `${fullDomain} sudah dipakai. Coba nama lain ya.`,
        };
      });

      const results = await Promise.all(checkPromises);
      return res.json({
        baseName,
        results,
      });
    } catch (err) {
      console.error('Error checking domain:', err);
      return res.status(500).json({ error: 'Gagal memeriksa domain.' });
    }
  });

  // Google Search Console Site Verification Endpoints (File & TXT Method Support)
  app.get(['/googleez3PPngLLzR9N5oWru-nh_vT-YcBeL5--Y-BlX-Gozo.html', '/google-site-verification.html'], (_req: Request, res: Response) => {
    res.type('text/html').send('google-site-verification: googleez3PPngLLzR9N5oWru-nh_vT-YcBeL5--Y-BlX-Gozo.html');
  });

  app.get(['/google-site-verification', '/google-site-verification.txt'], (_req: Request, res: Response) => {
    res.type('text/plain').send('google-site-verification=ez3PPngLLzR9N5oWru-nh_vT-YcBeL5--Y-BlX-Gozo');
  });

  // Always serve public directory assets (robots.txt, icons, verification files)
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Middleware to attach Google Site Verification header
  app.use((_req: Request, res: Response, next) => {
    res.setHeader('X-Google-Site-Verification', 'ez3PPngLLzR9N5oWru-nh_vT-YcBeL5--Y-BlX-Gozo');
    next();
  });

  // Serve static files in production or Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Webkilat server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
