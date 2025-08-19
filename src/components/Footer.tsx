/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiArrowUpRight,
  FiShield,
  FiRefreshCw,
  FiClock,
  FiTrendingUp,
  FiPhone,
  FiMail,
  FiMapPin,
  FiExternalLink,
  FiCheckCircle,
} from 'react-icons/fi';

export default function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.06 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 320, damping: 26 } },
  };

  return (
    <footer className="relative mt-24 text-gray-900 dark:text-gray-100">
      {/* Luxe ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-teal-400/25 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/25 blur-3xl" />
      </div>

      {/* Top CTA band */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="relative -mb-14 rounded-3xl border border-white/30 bg-white/70 p-6 pb-8 shadow-[0_30px_80px_-28px_rgba(0,0,0,0.35)] backdrop-blur-2xl dark:bg-neutral-900/60"
        >
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

          <div className="grid items-center gap-6 md:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
                Jadilah Vendor Strategis Kami
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-700/90 dark:text-gray-300">
                Invest pada proyek digital kami—pilih skema <span className="font-semibold">jangka panjang (dengan maintenance)</span> untuk pertumbuhan berkelanjutan
                atau <span className="font-semibold">jangka pendek (tanpa maintenance)</span> untuk eksekusi cepat dan efisien.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_-16px_rgba(13,148,136,0.8)] hover:shadow-[0_22px_46px_-18px_rgba(13,148,136,0.85)] transition"
              >
                Book a Call
                <FiArrowUpRight className="text-base" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/60 px-5 py-3 text-sm font-semibold text-gray-900 backdrop-blur hover:bg-white/80 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/15"
              >
                Lihat Portfolio
                <FiExternalLink className="text-base" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Offer Tiers */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {/* Long-Term (with maintenance) */}
          <motion.div variants={fadeUp} className="group relative rounded-[22px] p-[1px] bg-gradient-to-br from-teal-500/70 via-cyan-400/70 to-blue-600/70 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]">
            <div className="relative rounded-[21px] h-full bg-white/75 p-6 backdrop-blur-2xl border border-white/40 dark:bg-neutral-900/70">
              <div className="absolute -right-2 -top-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-3 py-1 text-[11px] font-bold text-white shadow">
                Rekomendasi
              </div>

              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 text-white">
                  <FiShield />
                </div>
                <h3 className="text-xl font-bold">Partnership Jangka Panjang (Maintenance)</h3>
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Cocok untuk produk yang tumbuh: roadmap berkelanjutan, iterasi fitur, dan dukungan pascarilis.
              </p>

              <ul className="mt-4 space-y-3 text-sm">
                {[
                  'SLA & dukungan prioritas (kontrak resmi)',
                  'Roadmap triwulanan + review performa',
                  'Monitoring uptime & patch keamanan berkala',
                  'Optimasi performa & biaya cloud',
                  'Retainer fleksibel (scope disepakati bersama)',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <FiCheckCircle className="mt-0.5 text-teal-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_-12px_rgba(13,148,136,0.8)] hover:shadow-[0_18px_40px_-16px_rgba(13,148,136,0.85)] transition"
                >
                  Ajukan Penawaran
                  <FiArrowUpRight />
                </Link>
                <Link
                  href="/case-studies"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/60 px-4 py-2.5 text-sm font-semibold text-gray-900 backdrop-blur hover:bg-white/80 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/15"
                >
                  Lihat Case Studies
                  <FiExternalLink />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Short-Term (no maintenance) */}
          <motion.div variants={fadeUp} className="group relative rounded-[22px] p-[1px] bg-gradient-to-br from-slate-300/60 via-slate-200/60 to-white/60 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] dark:from-white/10 dark:via-white/5 dark:to-white/0">
            <div className="relative rounded-[21px] h-full bg-white/75 p-6 backdrop-blur-2xl border border-white/40 dark:bg-neutral-900/70">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 ring-1 ring-white/40 dark:bg-white/10">
                  <FiRefreshCw />
                </div>
                <h3 className="text-xl font-bold">Proyek Jangka Pendek (Tanpa Maintenance)</h3>
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Fixed scope & timeline jelas—rilis cepat untuk validasi pasar atau kebutuhan campaign.
              </p>

              <ul className="mt-4 space-y-3 text-sm">
                {[
                  'Scope & estimasi transparan sejak awal',
                  'Durasi produksi ringkas & milestone rapih',
                  'Handover lengkap: source code + dokumentasi',
                  'Garansi bugfix singkat pascarilis*',
                  'Opsional upgrade ke maintenance kapan saja',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <FiCheckCircle className="mt-0.5 text-blue-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/pricing#one-off"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_-12px_rgba(0,0,0,0.6)] hover:shadow-[0_18px_40px_-16px_rgba(0,0,0,0.65)] transition"
                >
                  Minta Estimasi
                  <FiArrowUpRight />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/60 px-4 py-2.5 text-sm font-semibold text-gray-900 backdrop-blur hover:bg-white/80 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/15"
                >
                  Contoh Hasil
                  <FiExternalLink />
                </Link>
              </div>
              <p className="mt-3 text-[11px] text-gray-500">
                *Garansi bugfix disepakati di kontrak (jangka waktu terbatas).
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust / Value props */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 mt-10">
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-4 sm:grid-cols-3"
        >
          {[
            {
              icon: <FiClock />,
              title: 'Timeline Terkendali',
              desc: 'Milestone jelas & laporan rutin di setiap sprint.',
            },
            {
              icon: <FiTrendingUp />,
              title: 'Fokus ROI',
              desc: 'Prioritas ke fitur berdampak bisnis tertinggi.',
            },
            {
              icon: <FiShield />,
              title: 'Kontrak & Kepastian',
              desc: 'SLA, scope, & akses repo yang transparan.',
            },
          ].map((v, i) => (
            <motion.li
              key={v.title}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/70 p-5 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
            >
              <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 text-white">
                {v.icon}
              </div>
              <h4 className="text-base font-semibold">{v.title}</h4>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{v.desc}</p>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* Contact & Quick Links */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 mt-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-3">
            <h5 className="text-lg font-bold">IKICODE+</h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Partner teknologi untuk membangun, merawat, dan mengembangkan produk digital Anda.
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a
                href="tel:+620000000000"
                className="inline-flex items-center gap-2 hover:underline"
                aria-label="Telepon kami"
              >
                <FiPhone /> +62 000-0000-000
              </a>
              <a
                href="mailto:hello@ikicode.co"
                className="inline-flex items-center gap-2 hover:underline"
                aria-label="Email kami"
              >
                <FiMail /> hello@ikicode.co
              </a>
              <span className="inline-flex items-center gap-2 text-gray-700/90 dark:text-gray-300">
                <FiMapPin /> Jakarta, Indonesia
              </span>
            </div>
          </div>

          <nav>
            <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Perusahaan</h6>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/about" className="hover:underline">Tentang Kami</Link></li>
              <li><Link href="/portfolio" className="hover:underline">Portfolio</Link></li>
              <li><Link href="/case-studies" className="hover:underline">Case Studies</Link></li>
              <li><Link href="/careers" className="hover:underline">Karier</Link></li>
            </ul>
          </nav>

          <nav>
            <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Produk & Layanan</h6>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/services" className="hover:underline">Layanan</Link></li>
              <li><Link href="/pricing" className="hover:underline">Harga</Link></li>
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link href="/contact" className="hover:underline">Kontak</Link></li>
            </ul>
          </nav>
        </div>
      </section>

      {/* Bottom bar */}
      <section className="relative mt-10 border-t border-white/30 bg-white/50 backdrop-blur-xl dark:bg-neutral-900/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-gray-700/90 dark:text-gray-300 sm:flex-row sm:px-6">
          <span>© {year} IKICODE+. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/legal/privacy" className="hover:underline">Kebijakan Privasi</Link>
            <Link href="/legal/terms" className="hover:underline">S&K</Link>
          </div>
        </div>
      </section>
    </footer>
  );
}


// /* eslint-disable @typescript-eslint/no-unused-vars */
// 'use client';

// import Link from 'next/link';
// import { useMemo } from 'react';
// import { motion } from 'framer-motion';
// import {
//   FiArrowUpRight,
//   FiShield,
//   FiRefreshCw,
//   FiClock,
//   FiTrendingUp,
//   FiPhone,
//   FiMail,
//   FiMapPin,
//   FiExternalLink,
//   FiCheckCircle,
// } from 'react-icons/fi';

// type FooterProps = {
//   /** true = pakai margin top besar; false = nempel konten tanpa jarak */
//   spaced?: boolean;
//   className?: string;
// };

// export default function Footer({ spaced = true, className = '' }: FooterProps) {
//   const year = useMemo(() => new Date().getFullYear(), []);

//   const container = {
//     hidden: {},
//     show: { transition: { staggerChildren: 0.06 } },
//   };

//   const fadeUp = {
//     hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
//     show: {
//       opacity: 1,
//       y: 0,
//       filter: 'blur(0px)',
//       transition: { type: 'spring', stiffness: 320, damping: 26 },
//     },
//   };

//   return (
//     <footer
//       className={`${spaced ? 'mt-24' : 'mt-0'} relative text-gray-900 dark:text-gray-100 ${className}`}
//     >
//       {/* Luxe ambient background glows */}
//       <div className="pointer-events-none absolute inset-0 -z-10">
//         <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-teal-400/25 blur-3xl" />
//         <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
//         <div className="absolute -bottom-24 left-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/25 blur-3xl" />
//       </div>

//       {/* Top CTA band */}
//       <section className="relative mx-auto max-w-7xl px-4 sm:px-6">
//         <motion.div
//           variants={fadeUp}
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, amount: 0.4 }}
//           className="relative -mb-14 rounded-3xl border border-white/30 bg-white/70 p-6 pb-8 shadow-[0_30px_80px_-28px_rgba(0,0,0,0.35)] backdrop-blur-2xl dark:bg-neutral-900/60"
//         >
//           <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
//           <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

//           <div className="grid items-center gap-6 md:grid-cols-[1.3fr_1fr]">
//             <div>
//               <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
//                 Jadilah Vendor Strategis Kami
//               </h2>
//               <p className="mt-2 text-sm sm:text-base text-gray-700/90 dark:text-gray-300">
//                 Invest pada proyek digital kami—pilih skema <span className="font-semibold">jangka panjang (dengan maintenance)</span> untuk pertumbuhan berkelanjutan
//                 atau <span className="font-semibold">jangka pendek (tanpa maintenance)</span> untuk eksekusi cepat dan efisien.
//               </p>
//             </div>
//             <div className="flex flex-wrap gap-3 md:justify-end">
//               <Link
//                 href="/contact"
//                 className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_-16px_rgba(13,148,136,0.8)] hover:shadow-[0_22px_46px_-18px_rgba(13,148,136,0.85)] transition"
//               >
//                 Book a Call
//                 <FiArrowUpRight className="text-base" />
//               </Link>
//               <Link
//                 href="/portfolio"
//                 className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/60 px-5 py-3 text-sm font-semibold text-gray-900 backdrop-blur hover:bg-white/80 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/15"
//               >
//                 Lihat Portfolio
//                 <FiExternalLink className="text-base" />
//               </Link>
//             </div>
//           </div>
//         </motion.div>
//       </section>

//       {/* Offer Tiers */}
//       <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-24">
//         <motion.div
//           variants={container}
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, amount: 0.25 }}
//           className="grid gap-6 lg:grid-cols-2"
//         >
//           {/* Long-Term */}
//           <motion.div variants={fadeUp} className="group relative rounded-[22px] p-[1px] bg-gradient-to-br from-teal-500/70 via-cyan-400/70 to-blue-600/70 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]">
//             <div className="relative rounded-[21px] h-full bg-white/75 p-6 backdrop-blur-2xl border border-white/40 dark:bg-neutral-900/70">
//               <div className="absolute -right-2 -top-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-3 py-1 text-[11px] font-bold text-white shadow">
//                 Rekomendasi
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 text-white">
//                   <FiShield />
//                 </div>
//                 <h3 className="text-xl font-bold">Partnership Jangka Panjang (Maintenance)</h3>
//               </div>
//               <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
//                 Cocok untuk produk yang tumbuh: roadmap berkelanjutan, iterasi fitur, dan dukungan pascarilis.
//               </p>

//               <ul className="mt-4 space-y-3 text-sm">
//                 {[
//                   'SLA & dukungan prioritas (kontrak resmi)',
//                   'Roadmap triwulanan + review performa',
//                   'Monitoring uptime & patch keamanan berkala',
//                   'Optimasi performa & biaya cloud',
//                   'Retainer fleksibel (scope disepakati bersama)',
//                 ].map((f) => (
//                   <li key={f} className="flex items-start gap-3">
//                     <FiCheckCircle className="mt-0.5 text-teal-600" />
//                     <span>{f}</span>
//                   </li>
//                 ))}
//               </ul>

//               <div className="mt-5 flex flex-wrap items-center gap-3">
//                 <Link
//                   href="/pricing"
//                   className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_-12px_rgba(13,148,136,0.8)] hover:shadow-[0_18px_40px_-16px_rgba(13,148,136,0.85)] transition"
//                 >
//                   Ajukan Penawaran
//                   <FiArrowUpRight />
//                 </Link>
//                 <Link
//                   href="/case-studies"
//                   className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/60 px-4 py-2.5 text-sm font-semibold text-gray-900 backdrop-blur hover:bg-white/80 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/15"
//                 >
//                   Lihat Case Studies
//                   <FiExternalLink />
//                 </Link>
//               </div>
//             </div>
//           </motion.div>

//           {/* Short-Term */}
//           <motion.div variants={fadeUp} className="group relative rounded-[22px] p-[1px] bg-gradient-to-br from-slate-300/60 via-slate-200/60 to-white/60 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] dark:from-white/10 dark:via-white/5 dark:to-white/0">
//             <div className="relative rounded-[21px] h-full bg-white/75 p-6 backdrop-blur-2xl border border-white/40 dark:bg-neutral-900/70">
//               <div className="flex items-center gap-3">
//                 <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 ring-1 ring-white/40 dark:bg-white/10">
//                   <FiRefreshCw />
//                 </div>
//                 <h3 className="text-xl font-bold">Proyek Jangka Pendek (Tanpa Maintenance)</h3>
//               </div>
//               <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
//                 Fixed scope & timeline jelas—rilis cepat untuk validasi pasar atau kebutuhan campaign.
//               </p>

//               <ul className="mt-4 space-y-3 text-sm">
//                 {[
//                   'Scope & estimasi transparan sejak awal',
//                   'Durasi produksi ringkas & milestone rapih',
//                   'Handover lengkap: source code + dokumentasi',
//                   'Garansi bugfix singkat pascarilis*',
//                   'Opsional upgrade ke maintenance kapan saja',
//                 ].map((f) => (
//                   <li key={f} className="flex items-start gap-3">
//                     <FiCheckCircle className="mt-0.5 text-blue-600" />
//                     <span>{f}</span>
//                   </li>
//                 ))}
//               </ul>

//               <div className="mt-5 flex flex-wrap items-center gap-3">
//                 <Link
//                   href="/pricing#one-off"
//                   className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_-12px_rgba(0,0,0,0.6)] hover:shadow-[0_18px_40px_-16px_rgba(0,0,0,0.65)] transition"
//                 >
//                   Minta Estimasi
//                   <FiArrowUpRight />
//                 </Link>
//                 <Link
//                   href="/portfolio"
//                   className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/60 px-4 py-2.5 text-sm font-semibold text-gray-900 backdrop-blur hover:bg-white/80 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/15"
//                 >
//                   Contoh Hasil
//                   <FiExternalLink />
//                 </Link>
//               </div>
//               <p className="mt-3 text-[11px] text-gray-500">
//                 *Garansi bugfix disepakati di kontrak (jangka waktu terbatas).
//               </p>
//             </div>
//           </motion.div>
//         </motion.div>
//       </section>

//       {/* Trust / Value props */}
//       <section className="relative mx-auto max-w-7xl px-4 sm:px-6 mt-10">
//         <motion.ul
//           variants={container}
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, amount: 0.3 }}
//           className="grid gap-4 sm:grid-cols-3"
//         >
//           {[
//             { icon: <FiClock />, title: 'Timeline Terkendali', desc: 'Milestone jelas & laporan rutin di setiap sprint.' },
//             { icon: <FiTrendingUp />, title: 'Fokus ROI', desc: 'Prioritas ke fitur berdampak bisnis tertinggi.' },
//             { icon: <FiShield />, title: 'Kontrak & Kepastian', desc: 'SLA, scope, & akses repo yang transparan.' },
//           ].map((v) => (
//             <motion.li
//               key={v.title}
//               variants={fadeUp}
//               className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/70 p-5 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
//             >
//               <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
//               <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 text-white">
//                 {v.icon}
//               </div>
//               <h4 className="text-base font-semibold">{v.title}</h4>
//               <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{v.desc}</p>
//             </motion.li>
//           ))}
//         </motion.ul>
//       </section>

//       {/* Contact & Quick Links */}
//       <section className="relative mx-auto max-w-7xl px-4 sm:px-6 mt-10">
//         <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
//           <div className="space-y-3">
//             <h5 className="text-lg font-bold">Desaineriam n Company</h5>
//             <p className="text-sm text-gray-700 dark:text-gray-300">
//               Partner teknologi untuk membangun, merawat, dan mengembangkan produk digital Anda.
//             </p>
//             <div className="mt-3 flex flex-col gap-2 text-sm">
//               <a href="tel:+620000000000" className="inline-flex items-center gap-2 hover:underline" aria-label="Telepon kami">
//                 <FiPhone /> +62 000-0000-000
//               </a>
//               <a href="mailto:hello@desaineriam.co" className="inline-flex items-center gap-2 hover:underline" aria-label="Email kami">
//                 <FiMail /> hello@desaineriam.co
//               </a>
//               <span className="inline-flex items-center gap-2 text-gray-700/90 dark:text-gray-300">
//                 <FiMapPin /> Jakarta, Indonesia
//               </span>
//             </div>
//           </div>

//           <nav>
//             <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Perusahaan</h6>
//             <ul className="mt-3 space-y-2 text-sm">
//               <li><Link href="/about" className="hover:underline">Tentang Kami</Link></li>
//               <li><Link href="/portfolio" className="hover:underline">Portfolio</Link></li>
//               <li><Link href="/case-studies" className="hover:underline">Case Studies</Link></li>
//               <li><Link href="/careers" className="hover:underline">Karier</Link></li>
//             </ul>
//           </nav>

//           <nav>
//             <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Produk & Layanan</h6>
//             <ul className="mt-3 space-y-2 text-sm">
//               <li><Link href="/services" className="hover:underline">Layanan</Link></li>
//               <li><Link href="/pricing" className="hover:underline">Harga</Link></li>
//               <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
//               <li><Link href="/contact" className="hover:underline">Kontak</Link></li>
//             </ul>
//           </nav>
//         </div>
//       </section>

//       {/* Bottom bar */}
//       <section className="relative mt-10 border-t border-white/30 bg-white/50 backdrop-blur-xl dark:bg-neutral-900/60">
//         <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-gray-700/90 dark:text-gray-300 sm:flex-row sm:px-6">
//           <span>© {year} Desaineriam n Company. All rights reserved.</span>
//           <div className="flex items-center gap-4">
//             <Link href="/legal/privacy" className="hover:underline">Kebijakan Privasi</Link>
//             <Link href="/legal/terms" className="hover:underline">S&K</Link>
//           </div>
//         </div>
//       </section>
//     </footer>
//   );
// }
