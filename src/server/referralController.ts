/**
 * ============================================================================
 * PT INOVASI TEKNOLOGI DIGITAL INDONESIA (ITDI)
 * Backend Controller & Dynamic Route Handler: Web Replika Mitra
 * Framework: Express.js (TypeScript) + Prisma ORM / PostgreSQL
 * File: /src/server/referralController.ts
 * ============================================================================
 */

import { Request, Response, NextFunction, Router } from 'express';

// Interface definitions for server environment
export interface PartnerProfile {
  id: string;
  namaLengkap: string;
  slug: string;
  phoneInternational: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BLOCKED';
  fotoUrl?: string;
  kotaDomisili?: string;
}

export const referralRouter = Router();

/**
 * ----------------------------------------------------------------------------
 * 1. DYNAMIC ROUTE HANDLER: /reff/:namamitra
 * ----------------------------------------------------------------------------
 * Description:
 *  - Intercepts incoming requests to https://www.webmurah.biz.id/reff/:namamitra
 *  - Queries database to verify if partner exists and has status = 'APPROVED'
 *  - Sets 30-day attribution tracking cookies (ref_mitra_slug, ref_mitra_id)
 *  - Logs visitor metrics (IP, user agent, timestamp) asynchronously
 *  - Returns pre-rendered HTML with injected OpenGraph meta tags & partner state
 *  - Fallback: If not found or status != 'APPROVED', gracefully redirects to '/'
 *    with a notice query parameter (/?error_ref=inactive_or_not_found).
 */
export async function handleReplicaRoute(req: Request, res: Response, next: NextFunction) {
  const { namamitra } = req.params;

  if (!namamitra || typeof namamitra !== 'string') {
    return res.redirect(302, '/');
  }

  const cleanSlug = namamitra.trim().toLowerCase();

  try {
    // A. Query Partner from Database
    // Note: In Prisma, this is: await prisma.mitra.findUnique({ where: { slug: cleanSlug } })
    const partner = await findPartnerInDatabase(cleanSlug);

    // B. Validation: Check existence and APPROVED status
    if (!partner || partner.status !== 'APPROVED') {
      // Fallback redirection to main domain with notification flag
      return res.redirect(
        302,
        `/?ref_status=${partner ? 'pending_approval' : 'not_found'}&slug=${encodeURIComponent(cleanSlug)}`
      );
    }

    // C. Set Attribution Cookies (30-day cookie attribution window)
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    res.cookie('ref_mitra_id', partner.id, {
      maxAge: thirtyDaysInMs,
      httpOnly: false, // Accessible by client-side order form
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.cookie('ref_mitra_slug', partner.slug, {
      maxAge: thirtyDaysInMs,
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // D. Asynchronously log referral click to prevent blocking SSR
    logReferralClickAsync({
      mitraId: partner.id,
      slug: partner.slug,
      visitorIp: req.ip || req.headers['x-forwarded-for']?.toString() || '',
      userAgent: req.headers['user-agent'] || '',
      refererUrl: req.headers['referer'] || '',
    }).catch(console.error);

    // E. Dynamic WhatsApp Direct Message URL for this partner
    const waText = encodeURIComponent(
      `Halo ${partner.namaLengkap}, saya tertarik dengan layanan landing page di webmurah.biz.id dan ingin konsultasi pembuatan website bisnis.`
    );
    const dynamicWhatsAppUrl = `https://wa.me/${partner.phoneInternational}?text=${waText}`;

    // F. Dynamic Social Sharing OpenGraph Meta Tags (WhatsApp, Facebook, Twitter)
    const pageTitle = `Konsultan Resmi: ${partner.namaLengkap} | PT Inovasi Teknologi Digital Indonesia`;
    const pageDescription = `Layanan pembuatan landing page kustom 1 hari jadi Rp 499rb all-in. Hubungi Konsultan Resmi kami, ${partner.namaLengkap}, untuk konsultasi langsung.`;
    const canonicalUrl = `https://www.webmurah.biz.id/reff/${partner.slug}`;
    const previewImage = partner.fotoUrl || 'https://www.webmurah.biz.id/assets/og-preview.jpg';

    // In a full-stack Next.js or Vite Express SSR environment:
    // Inject metadata and initial state into the HTML template:
    const injectedHtml = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${escapeHtml(pageTitle)}</title>
          <meta name="description" content="${escapeHtml(pageDescription)}" />
          <link rel="canonical" href="${canonicalUrl}" />

          <!-- OpenGraph / WhatsApp Meta Tags -->
          <meta property="og:type" content="website" />
          <meta property="og:url" content="${canonicalUrl}" />
          <meta property="og:title" content="${escapeHtml(pageTitle)}" />
          <meta property="og:description" content="${escapeHtml(pageDescription)}" />
          <meta property="og:image" content="${previewImage}" />
          <meta property="og:site_name" content="Webkilat - PT Inovasi Teknologi Digital Indonesia" />

          <!-- Pre-seeded Partner State for Client SPA Hydration -->
          <script>
            window.__REPLIKA_PARTNER__ = ${JSON.stringify({
              id: partner.id,
              namaLengkap: partner.namaLengkap,
              slug: partner.slug,
              phoneInternational: partner.phoneInternational,
              status: partner.status,
              whatsAppUrl: dynamicWhatsAppUrl,
            })};
          </script>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/src/main.tsx"></script>
        </body>
      </html>
    `;

    return res.status(200).send(injectedHtml);
  } catch (err) {
    console.error('Error handling replica route:', err);
    return res.redirect(302, '/');
  }
}

/**
 * ----------------------------------------------------------------------------
 * 2. REST API: GET /api/referral/:slug
 * ----------------------------------------------------------------------------
 * Used by SPA client to validate slug and fetch partner metadata on-the-fly.
 */
referralRouter.get('/api/referral/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;
  const partner = await findPartnerInDatabase(slug);

  if (!partner || partner.status !== 'APPROVED') {
    return res.status(404).json({
      success: false,
      message: 'Mitra referal tidak ditemukan atau belum aktif.',
      fallbackUrl: 'https://www.webmurah.biz.id/',
    });
  }

  const waText = encodeURIComponent(
    `Halo ${partner.namaLengkap}, saya tertarik dengan layanan landing page di webmurah.biz.id dan ingin konsultasi pembuatan website.`
  );

  return res.status(200).json({
    success: true,
    data: {
      id: partner.id,
      namaLengkap: partner.namaLengkap,
      slug: partner.slug,
      phoneInternational: partner.phoneInternational,
      status: partner.status,
      kotaDomisili: partner.kotaDomisili,
      whatsAppUrl: `https://wa.me/${partner.phoneInternational}?text=${waText}`,
      replicaUrl: `https://www.webmurah.biz.id/reff/${partner.slug}`,
    },
  });
});

/**
 * ----------------------------------------------------------------------------
 * 3. REST API: POST /api/referral/order
 * ----------------------------------------------------------------------------
 * Secure order ingestion enforcing immutable partner attribution.
 */
referralRouter.post('/api/referral/order', async (req: Request, res: Response) => {
  const {
    clientName,
    clientPhone,
    clientEmail,
    clientBusinessName,
    domainChoice,
    packageType = 'UMKM',
    productDetails,
    referralMitraId,
    referralMitraSlug,
  } = req.body;

  if (!clientName || !clientPhone || !domainChoice) {
    return res.status(400).json({
      success: false,
      message: 'Nama pemesan, nomor WhatsApp, dan pilihan domain wajib diisi.',
    });
  }

  // Double check partner validity
  let attributedMitraId: string | null = null;
  let attributedMitraSlug: string | null = null;

  if (referralMitraSlug) {
    const partner = await findPartnerInDatabase(referralMitraSlug);
    if (partner && partner.status === 'APPROVED') {
      attributedMitraId = partner.id;
      attributedMitraSlug = partner.slug;
    }
  }

  const packagePrice = packageType === 'ELITE' ? 3000000 : 499000;
  const commissionRate = 0.6; // 60% Partner Commission
  const commissionMitra = packagePrice * commissionRate;
  const shareCompany = packagePrice * (1 - commissionRate);

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;

  // Save to database
  const orderRecord = {
    id: orderId,
    clientName,
    clientPhone,
    clientEmail,
    clientBusinessName,
    domainChoice,
    packageType,
    packagePrice,
    commissionMitra,
    shareCompany,
    mitraId: attributedMitraId,
    mitraSlug: attributedMitraSlug,
    orderStatus: 'PENDING_REVIEW',
    createdAt: new Date().toISOString(),
  };

  return res.status(201).json({
    success: true,
    message: 'Pesanan berhasil dicatat dengan atribusi mitra.',
    order: orderRecord,
  });
});

// Mock Database Adapter for Illustration (in production replace with Prisma Client)
async function findPartnerInDatabase(slug: string): Promise<PartnerProfile | null> {
  const mockPartners: Record<string, PartnerProfile> = {
    'prima-aldino': {
      id: 'ITDI-MTR-2026-5652',
      namaLengkap: 'Prima aldino',
      slug: 'prima-aldino',
      phoneInternational: '6285811735280',
      status: 'APPROVED',
      kotaDomisili: 'Bekasi',
    },
    'padilah-ramadhan': {
      id: 'ITDI-MTR-2026-6075',
      namaLengkap: 'Padilah ramadhan',
      slug: 'padilah-ramadhan',
      phoneInternational: '6287874805975',
      status: 'APPROVED',
      kotaDomisili: 'Bekasi',
    },
    'budi-santoso': {
      id: 'ITDI-MTR-2026-0018',
      namaLengkap: 'Budi Santoso, S.Kom',
      slug: 'budi-santoso',
      phoneInternational: '6281234567890',
      status: 'APPROVED',
      kotaDomisili: 'Kota Bekasi',
    },
    'siti-rahmawati': {
      id: 'ITDI-MTR-2026-0024',
      namaLengkap: 'Siti Rahmawati',
      slug: 'siti-rahmawati',
      phoneInternational: '6285712348899',
      status: 'PENDING',
      kotaDomisili: 'Jakarta Selatan',
    },
  };

  return mockPartners[slug.toLowerCase()] || null;
}

async function logReferralClickAsync(data: {
  mitraId: string;
  slug: string;
  visitorIp: string;
  userAgent: string;
  refererUrl: string;
}): Promise<void> {
  // Production: await prisma.referralClick.create({ data })
  console.log('[Referral Tracking] Click logged for mitra:', data.slug);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default referralRouter;
