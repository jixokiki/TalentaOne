// import type { MetadataRoute } from 'next';
// import { SITE } from '@/lib/siteMeta';

// export default function sitemap(): MetadataRoute.Sitemap {
//   const now = new Date();
//   return [
//     {
//       url: `${SITE.url}/`,
//       lastModified: now,
//       changeFrequency: 'weekly',
//       priority: 1,
//     },
//     // Tambahkan route publik lain yang ingin ranking di sini.
//   ];
// }


import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/siteMeta';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ✅ Daftar route publik yang memang ingin ranking (tambahkan di sini)
  const PUBLIC_ROUTES: string[] = [
    '/', 
    // '/layanan',
    // '/pricing',
    // '/blog',
    // '/kontak',
        // '/dashboard-user',
    // '/dashboard-admin',
  ];

  return PUBLIC_ROUTES.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.8,
  }));
}
