// 'use client';

// import { useEffect, useState } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '@/lib/firebaseConfig';
// import { Service } from '@/lib/types';
// import { motion } from 'framer-motion';
// import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda

// export default function Home() {
//   const [services, setServices] = useState<Service[]>([]);

//   useEffect(() => {
//     const fetchServices = async () => {
//       const querySnapshot = await getDocs(collection(db, 'services'));
//       const servicesData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Service[];

//       setServices(servicesData);
//     };

//     fetchServices();
//   }, []);

//   // Animasi untuk teks
//   const textVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-32 px-4 sm:px-6 lg:px-8">
//       <Navbar /> {/* Tambahkan Navbar di sini */}
//       {/* Header Section */}
//       {/* <div className="text-center mb-12">
//         <motion.h1
//           initial="hidden"
//           animate="visible"
//           variants={textVariants}
//           className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 animate-text"
//         >
//           Selamat Datang di Layanan Jasa
//         </motion.h1>
//         <motion.p
//           initial="hidden"
//           animate="visible"
//           variants={textVariants}
//           className="mt-4 text-lg text-gray-600"
//         >
//           Mulailah mengkustomisasi aplikasi ini sesuai kebutuhan bisnis Anda!
//         </motion.p>
//       </div> */}
//       {/* Header Section */}
// <div className="text-center mb-12 overflow-visible">
//   <motion.h1
//     initial="hidden"
//     animate="visible"
//     variants={textVariants}
//     className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 animate-text inline-block leading-[1.2] md:leading-[1.15] pb-1"
//   >
//     Selamat Datang di Layanan Jasa
//   </motion.h1>

//   <motion.p
//     initial="hidden"
//     animate="visible"
//     variants={textVariants}
//     className="mt-4 text-lg text-gray-600 leading-relaxed pb-1"
//   >
//     Mulailah mengkustomisasi aplikasi ini sesuai kebutuhan bisnis Anda!
//   </motion.p>
// </div>


//       {/* Login & Register Section */}
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={textVariants}
//         className="flex justify-center space-x-6 mb-12"
//       >
//         <a
//           href="/login"
//           className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white bg-gradient-to-r from-teal-500 to-blue-500 rounded-full group hover:from-teal-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105"
//         >
//           <span className="relative z-10">Login</span>
//           <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
//         </a>
//         <a
//           href="/register"
//           className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group hover:from-purple-600 hover:to-pink-600 transition-all duration-300 ease-in-out transform hover:scale-105"
//         >
//           <span className="relative z-10">Register</span>
//           <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
//         </a>
//       </motion.div>

//       {/* Services Section */}
//       <motion.h2
//         initial="hidden"
//         animate="visible"
//         variants={textVariants}
//         className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 mb-8 animate-text"
//       >
//         Available Services
//       </motion.h2>
//       <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {services.length > 0 ? (
//           services.map((service, index) => (
//             <motion.li
//               key={service.id}
//               initial="hidden"
//               animate="visible"
//               variants={textVariants}
//               transition={{ delay: index * 0.2 }}
//               className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"
//             >
//               <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 mb-4">
//                 {service.serviceName}
//               </h3>
//               <p className="text-gray-600 mb-6">{service.description}</p>
//               <button className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105">
//                 Learn More
//               </button>
//             </motion.li>
//           ))
//         ) : (
//           <motion.p
//             initial="hidden"
//             animate="visible"
//             variants={textVariants}
//             className="text-gray-600 text-center col-span-full"
//           >
//             No services available at the moment.
//           </motion.p>
//         )}
//       </ul>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { Service } from '@/lib/types';
import { motion } from 'framer-motion';
import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const servicesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[];
        setServices(servicesData);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // ====== Animations ======
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, ease: 'easeOut' },
    },
  };

  // ====== Loading Skeleton ======
  const SkeletonCard = () => (
    <div className="relative group rounded-2xl p-[2px]">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/20 via-blue-500/10 to-purple-500/20 blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      <div className="relative rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden">
        <div className="animate-pulse p-6">
          <div className="h-6 w-1/2 bg-white/30 rounded mb-4" />
          <div className="h-4 w-full bg-white/20 rounded mb-2" />
          <div className="h-4 w-5/6 bg-white/20 rounded mb-6" />
          <div className="h-10 w-full bg-white/25 rounded" />
        </div>
      </div>
    </div>
  );

  // ====== Pointer glow per-card (client-only, no hydration mismatch) ======
  function handleMouseMove(e: React.MouseEvent<HTMLLIElement>) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  }
  function handleMouseLeave(e: React.MouseEvent<HTMLLIElement>) {
    const el = e.currentTarget;
    // Optional: reset ke tengah agar efek memudar rapi
    el.style.setProperty('--x', `50%`);
    el.style.setProperty('--y', `50%`);
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#0d1427] to-[#111833]">
      {/* ===== Decorative background layers ===== */}
      <div aria-hidden className="pointer-events-none select-none">
        <div className="absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-52 -right-28 h-[40rem] w-[40rem] rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/5 to-transparent" />
      </div>

      {/* ===== Noise film (subtle) ===== */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-soft-light [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22 viewBox=%220 0 48 48%22><filter id=%22n%22 x=%220%22 y=%220%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.95%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%2248%22 height=%2248%22 filter=%22url(%23n)%22/></svg>')]" />

      <Navbar />

      {/* ===== Page container ===== */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* ===== Hero ===== */}
        <div className="text-center mb-12 md:mb-16 overflow-visible">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-2 00 to-blue-300 text-5xl md:text-6xl font-extrabold leading-[1.15] drop-shadow-[0_2px_10px_rgba(20,184,166,0.15)]"
          >
            Selamat Datang di Layanan Jasa
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="mt-5 text-lg md:text-xl text-slate-300/90 leading-relaxed"
          >
            Mulailah mengkustomisasi aplikasi ini sesuai kebutuhan bisnis Anda!
          </motion.p>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '14rem', opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="mx-auto mt-6 h-[3px] rounded-full bg-gradient-to-r from-teal-400 via-emerald-300 to-blue-400 shadow-[0_0_24px_2px_rgba(34,197,94,0.35)]"
          />
        </div>

        {/* ===== CTA buttons ===== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={containerVariants}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-12"
        >
          <motion.a
            variants={textVariants}
            href="/login"
            aria-label="Masuk ke akun"
            className="group relative inline-flex items-center justify-center rounded-full px-8 py-3 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-teal-400/60 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 opacity-90 transition-all duration-300 group-hover:opacity-100" />
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-500/40 to-blue-600/40 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
            <span className="relative z-10 inline-flex items-center gap-2 rounded-full bg-white/5 px-8 py-3 backdrop-blur-sm">
              <span className="transition-transform duration-300 group-hover:-translate-y-0.5">Login</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </motion.a>

          <motion.a
            variants={textVariants}
            href="/register"
            aria-label="Daftar akun baru"
            className="group relative inline-flex items-center justify-center rounded-full px-8 py-3 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-pink-400/60 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-90 transition-all duration-300 group-hover:opacity-100" />
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500/40 to-pink-500/40 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
            <span className="relative z-10 inline-flex items-center gap-2 rounded-full bg-white/5 px-8 py-3 backdrop-blur-sm">
              <span className="transition-transform duration-300 group-hover:-translate-y-0.5">Register</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">★</span>
            </span>
          </motion.a>
        </motion.div>

        {/* ===== Section Title ===== */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={textVariants}
          className="text-center text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-200 to-blue-300 mb-8"
        >
          Available Services
        </motion.h2>

        {/* ===== Services grid ===== */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {loading &&
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}

          {!loading && services.length > 0 && services.map((service, index) => (
            <motion.li
              key={service.id}
              variants={cardVariants}
              transition={{ delay: index * 0.06 }}
              className="relative group p-[2px] rounded-2xl"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400 via-blue-500 to-fuchsia-500 opacity-80 blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="absolute inset-[1px] rounded-[14px] bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-2xl border border-white/15" />

              {/* Content card */}
              <div className="relative rounded-xl p-6 md:p-7 flex flex-col h-full text-slate-100">
                <div className="absolute -top-1 left-6 h-[2px] w-10 bg-gradient-to-r from-teal-300 to-transparent" />

                <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-teal-200 via-cyan-100 to-blue-200 mb-3">
                  {service.serviceName}
                </h3>

                <p className="text-slate-300/90 leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="mt-auto">
                  <button
                    className="relative w-full inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold overflow-hidden"
                    aria-label={`Pelajari ${service.serviceName}`}
                  >
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 transition-all duration-300 group-hover:from-teal-400 group-hover:to-blue-500" />
                    <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-teal-500/40 to-blue-600/40 blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="transition-transform duration-300 group-hover:-translate-y-0.5">Learn More</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </button>
                </div>

                {/* Pointer glow mask — pakai var(--x/--y) dari handler mouse */}
                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 [mask-image:radial-gradient(120px_120px_at_var(--x,50%)_var(--y,50%),white,transparent_70%)]" />
              </div>

              {/* Light sweep on hover */}
              <span className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out" />
              </span>
            </motion.li>
          ))}

          {!loading && services.length === 0 && (
            <motion.p
              variants={textVariants}
              className="text-slate-300/90 text-center col-span-full"
            >
              No services available at the moment.
            </motion.p>
          )}
        </motion.ul>

        {/* ===== Bottom callout ===== */}
        <section className="mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-purple-500/10 blur-2xl" />
            <div className="relative">
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={textVariants}
                className="text-center text-slate-300/90"
              >
                Tip: Anda bisa mengubah konten & data layanan langsung di koleksi <span className="font-semibold text-teal-300">services</span> pada Firestore tanpa mengubah kode.
              </motion.p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
