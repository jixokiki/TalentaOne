// import type { MetadataRoute } from 'next';
// import { SITE } from '@/lib/siteMeta';

// export default function robots(): MetadataRoute.Robots {
//   return {
//     rules: [
//       { userAgent: '*', allow: '/' },
//       // Blok halaman privat:
//       { userAgent: '*', disallow: ['/dashboard-admin', '/dashboard-worker', '/api/'] },
//     ],
//     sitemap: `${SITE.url}/sitemap.xml`,
//     host: SITE.url,
//   };
// }

import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/siteMeta';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/dashboard-admin', '/dashboard-user', '/dashboard-worker', '/api/'] },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
