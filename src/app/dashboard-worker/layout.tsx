// import type { Metadata } from 'next';
// import { SITE } from '@/lib/siteMeta';

// export const metadata: Metadata = {
//   title: 'Dashboard Worker – Layanan Dibayar & Upload Tugas Akhir',
//   description:
//     'Area privat untuk worker melihat layanan yang sudah berhasil dibayar, mengunggah file tugas akhir, dan memperbarui status tugas.',
//   keywords: [
//     ...SITE.keywords,
//     'dashboard worker',
//     'layanan dibayar',
//     'upload file tugas akhir',
//     'status tugas',
//     'progress tugas',
//     'midtrans',
//   ],
//   alternates: { canonical: `${SITE.url}/dashboard-worker` },
//   openGraph: {
//     type: 'website',
//     url: `${SITE.url}/dashboard-worker`,
//     siteName: SITE.name,
//     title: 'Dashboard Worker – Layanan Dibayar & Upload Tugas Akhir',
//     description:
//       'Kelola layanan yang sudah dibayar dan unggah file tugas akhir secara aman.',
//     images: [{ url: `${SITE.url}${SITE.ogImage}` }],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Dashboard Worker – Layanan Dibayar & Upload Tugas Akhir',
//     description:
//       'Kelola layanan yang sudah dibayar dan unggah file tugas akhir secara aman.',
//     images: [`${SITE.url}${SITE.ogImage}`],
//   },
//   // 🚫 Privat → noindex
//   robots: { index: false, follow: false },
// };

// export default function DashboardWorkerLayout({ children }: { children: React.ReactNode }) {
//   return <>{children}</>;
// }

import type { Metadata } from 'next';
import { SITE } from '@/lib/siteMeta';

export const metadata: Metadata = {
  title: 'Dashboard Worker – Layanan Dibayar & Upload Tugas Akhir',
  description:
    'Area privat untuk worker melihat layanan yang sudah berhasil dibayar, mengunggah file tugas akhir, dan memperbarui status tugas.',
  keywords: [
    ...SITE.keywords,
    'dashboard worker',
    'layanan dibayar',
    'upload file tugas akhir',
    'status tugas',
    'progress tugas',
    'midtrans',
  ],
  alternates: { canonical: `${SITE.url}/dashboard-worker` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/dashboard-worker`,
    siteName: SITE.name,
    title: 'Dashboard Worker – Layanan Dibayar & Upload Tugas Akhir',
    description:
      'Kelola layanan yang sudah dibayar dan unggah file tugas akhir secara aman.',
    images: [{ url: `${SITE.url}${SITE.ogImage}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard Worker – Layanan Dibayar & Upload Tugas Akhir',
    description:
      'Kelola layanan yang sudah dibayar dan unggah file tugas akhir secara aman.',
    images: [`${SITE.url}${SITE.ogImage}`],
  },
  // 🚫 Privat → noindex
  robots: { index: false, follow: false },
};

export default function DashboardWorkerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
