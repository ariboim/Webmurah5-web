/**
 * Google Analytics 4 (GA4) Tracking Utility
 * Memantau performa trafik, interaksi pengguna, dan konversi secara real-time.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-7VK6L0W0R8';

/**
 * Mengirim custom event ke Google Analytics 4
 */
export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, {
        ...params,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      // safe fallback
    }
  }
};

/**
 * Track klik tombol WhatsApp
 */
export const trackWhatsAppClick = (location: string, details?: string) => {
  trackEvent('whatsapp_click', {
    event_category: 'Engagement',
    event_label: location,
    details: details || '',
  });
};

/**
 * Track submit formulir order landing page
 */
export const trackOrderSubmission = (businessName: string, packagePrice: number = 499000) => {
  trackEvent('generate_lead', {
    event_category: 'Conversion',
    event_label: businessName,
    value: packagePrice,
    currency: 'IDR',
  });
};
