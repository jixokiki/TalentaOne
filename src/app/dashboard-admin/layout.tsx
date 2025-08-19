// import type { Metadata } from 'next';
// import { SITE } from '@/lib/siteMeta';

// export const metadata: Metadata = {
//   title: 'Interaction Monitor (Admin)',
//   description: 'Pemantauan interaksi user → worker → pembayaran secara real-time.',
//   alternates: { canonical: `${SITE.url}/dashboard-admin` },
//   robots: { index: false, follow: false, nocache: true }, // 🚫 SEO index
//   openGraph: {
//     type: 'website',
//     url: `${SITE.url}/dashboard-admin`,
//     title: 'Interaction Monitor (Admin)',
//     description: 'Monitoring real-time untuk admin.',
//   },
//   twitter: {
//     card: 'summary',
//     title: 'Interaction Monitor (Admin)',
//     description: 'Monitoring real-time untuk admin.',
//   },
// };

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   return <>{children}</>;
// }
import type { Metadata } from 'next';
import { SITE } from '@/lib/siteMeta';

export const metadata: Metadata = {
  title: 'Dashboard Admin – Interaction Monitor',
  description:
    'Pemantauan interaksi user → worker → pembayaran secara real-time untuk admin.',
  keywords: SITE.keywords,
  alternates: { canonical: `${SITE.url}/dashboard-admin` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/dashboard-admin`,
    siteName: SITE.name,
    title: 'Dashboard Admin – Interaction Monitor',
    description:
      'Pemantauan interaksi user → worker → pembayaran secara real-time untuk admin.',
    images: [{ url: `${SITE.url}${SITE.ogImage}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard Admin – Interaction Monitor',
    description:
      'Pemantauan interaksi user → worker → pembayaran secara real-time untuk admin.',
    images: [`${SITE.url}${SITE.ogImage}`],
  },
  // 🚫 Admin bersifat privat → noindex
  robots: { index: false, follow: false, /* nocache: true */ },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
