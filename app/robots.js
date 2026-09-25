// ===========================================
//  RetainPulse — Robots.txt
//  Auto-generated
// ===========================================

export default function robots() {
  const baseUrl = 'https://retainpulse.pro';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/',
          '/api/',
          '/login',
          '/signup',
          '/forgot-password',
          '/reset-password',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}