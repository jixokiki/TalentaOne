import Head from 'next/head';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
  <meta property="og:title" content="SkillNova – Platform Freelance" />
  <meta property="og:description" content="Platform layanan freelance dengan monitoring progres & pembayaran real-time." />
  <meta property="og:url" content="https://talentaones.vercel.app" />
  <meta property="og:image" content="https://talentaones.vercel.app/og.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="SkillNova – Platform Freelance" />
  <meta name="twitter:description" content="Platform layanan freelance dengan monitoring progres & pembayaran real-time." />
  <meta name="twitter:image" content="https://talentaones.vercel.app/og.jpg" />
        <script
          async // Tambahkan async di sini
          type="text/javascript"
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key="SB-Mid-client-L755RRWOl6fJrmUX" // Ganti dengan Client Key Midtrans Anda
        ></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
