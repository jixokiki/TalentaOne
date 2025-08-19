import type { Metadata } from 'next';
import { SITE } from '@/lib/siteMeta';

export const metadata: Metadata = {
  title: 'Dashboard User – Kelola Tugas & Pembayaran',
  description:
    'Area privat untuk user mengelola antrian, chat dengan admin/worker, melihat progres tugas, dan pembayaran Midtrans secara real-time.',
  keywords: [
    ...SITE.keywords,
    'dashboard user',
    'antrian',
    'chat admin',
    'progress tugas',
    'pembayaran',
    'midtrans',
  ],
  alternates: { canonical: `${SITE.url}/dashboard-user` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/dashboard-user`,
    siteName: SITE.name,
    title: 'Dashboard User – Kelola Tugas & Pembayaran',
    description:
      'Area privat untuk user mengelola antrian, chat, progres tugas, dan pembayaran real-time.',
    images: [{ url: `${SITE.url}${SITE.ogImage}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard User – Kelola Tugas & Pembayaran',
    description:
      'Area privat untuk user mengelola antrian, chat, progres tugas, dan pembayaran real-time.',
    images: [`${SITE.url}${SITE.ogImage}`],
  },
  // 🚫 Privat → noindex
  robots: { index: false, follow: false },
};

export default function DashboardUserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
