import Head from 'next/head';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
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
