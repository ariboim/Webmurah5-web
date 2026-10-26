import DOMPurify from 'dompurify';

/**
 * Utility untuk sanitasi HTML artikel sebelum disimpan dan saat dirender.
 * Mencegah serangan Cross-Site Scripting (XSS) seperti injeksi <script>,
 * atribut onerror, onclick, atau protokol jahat seperti javascript:
 */
export function sanitizeArticleHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';

  // Konfigurasi tag dan atribut yang diperbolehkan
  const clean = DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      'p',
      'b',
      'strong',
      'i',
      'em',
      'u',
      's',
      'strike',
      'h2',
      'h3',
      'h4',
      'ul',
      'ol',
      'li',
      'blockquote',
      'a',
      'br',
      'span',
      'code',
      'pre',
      'hr',
      'mark',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'title', 'id'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$)|#|\/)/i,
    ADD_ATTR: ['target', 'rel'],
  });

  // Pastikan setiap tag <a> yang menuju ke luar (eksternal) otomatis memiliki target="_blank" dan rel="noopener noreferrer"
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = clean;

    const links = tempDiv.querySelectorAll('a');
    links.forEach((a) => {
      const href = a.getAttribute('href') || '';
      // Jika link eksternal (dimulai dengan http:// atau https:// dan bukan domain lokal)
      if (href.startsWith('http://') || href.startsWith('https://')) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      } else if (href.startsWith('#') || href.startsWith('/')) {
        // Link internal
        a.removeAttribute('target');
        a.removeAttribute('rel');
      }
    });

    return tempDiv.innerHTML;
  }

  return clean;
}
