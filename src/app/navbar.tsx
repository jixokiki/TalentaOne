// 'use client';

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Link from 'next/link';

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const menuVariants = {
//     open: {
//       opacity: 1,
//       x: 0,
//       transition: { type: 'spring', stiffness: 300, damping: 24 },
//     },
//     closed: {
//       opacity: 0,
//       x: '100%',
//       transition: { duration: 0.2 },
//     },
//   };

//   const linkVariants = {
//     open: {
//       y: 0,
//       opacity: 1,
//       transition: { type: 'spring', stiffness: 300, damping: 24 },
//     },
//     closed: {
//       y: 50,
//       opacity: 0,
//       transition: { duration: 0.2 },
//     },
//   };

//   return (
//     <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
//       <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//         <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
//           Layanan Jasa
//         </Link>
//         <button
//           onClick={toggleMenu}
//           className="p-2 focus:outline-none"
//         >
//           <svg
//             className="w-8 h-8 text-gray-800"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M4 6h16M4 12h16m-7 6h7"
//             ></path>
//           </svg>
//         </button>
//       </div>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial="closed"
//             animate="open"
//             exit="closed"
//             variants={menuVariants}
//             className="fixed top-16 right-0 w-full h-screen bg-white shadow-lg z-40"
//           >
//             <div className="container mx-auto px-4 py-8">
//               <motion.ul className="space-y-6">
//                 <motion.li variants={linkVariants}>
//                   <Link href="/" className="text-2xl font-semibold text-gray-800 hover:text-teal-600 transition-colors duration-300">
//                     Home
//                   </Link>
//                 </motion.li>
//                 <motion.li variants={linkVariants}>
//                   <Link href="/login" className="text-2xl font-semibold text-gray-800 hover:text-teal-600 transition-colors duration-300">
//                     Login
//                   </Link>
//                 </motion.li>
//                 <motion.li variants={linkVariants}>
//                   <Link href="/register" className="text-2xl font-semibold text-gray-800 hover:text-teal-600 transition-colors duration-300">
//                     Register
//                   </Link>
//                 </motion.li>
//                 <motion.li variants={linkVariants}>
//                   <Link href="/services" className="text-2xl font-semibold text-gray-800 hover:text-teal-600 transition-colors duration-300">
//                     Services
//                   </Link>
//                 </motion.li>
//               </motion.ul>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// }
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // ====== Animations ======
  const menuVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
    closed: {
      opacity: 0,
      x: '100%',
      transition: { duration: 0.2 },
    },
  };

  const linkVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 22 },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      {/* Premium gradient glow behind navbar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-teal-500/15 via-cyan-400/10 to-transparent blur-2xl" />

      {/* Glass nav container */}
      <div className="mx-auto max-w-7xl px-4">
        <div
          className="
            mt-3 mb-3
            relative flex items-center justify-between
            rounded-2xl border border-white/20
            bg-white/70 dark:bg-neutral-900/60
            shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)]
            backdrop-blur-xl
            px-5 py-3
          "
        >
          {/* Logo */}
          <Link
            href="/"
            className="relative inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600"
          >
            <span className="h-8 w-8 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-inner shadow-white/20" />
            SkillNova
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/login', label: 'Login' },
              { href: '/register', label: 'Register' },
              { href: '/servicesPublik', label: 'Services' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="
                  group relative px-4 py-2 text-sm font-medium
                  text-gray-700 dark:text-gray-200
                "
              >
                {/* fancy underline */}
                <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-teal-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {/* subtle hover card */}
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/40 group-hover:to-white/10 dark:group-hover:from-white/5 dark:group-hover:to-white/0 transition-colors" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}

            {/* CTA style button */}
            <Link
              href="/register"
              className="
                ml-2 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold
                bg-gradient-to-r from-teal-600 to-blue-600 text-white
                shadow-[0_10px_20px_-10px_rgba(13,148,136,0.7)]
                hover:shadow-[0_18px_40px_-12px_rgba(13,148,136,0.7)]
                transition-all active:scale-[0.98]
              "
            >
              Get Started
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="
              md:hidden relative inline-flex items-center justify-center rounded-xl p-2
              text-gray-800 dark:text-gray-100
              hover:bg-white/60 dark:hover:bg-white/10
              focus:outline-none focus:ring-2 focus:ring-teal-500/50
              transition
            "
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 6l12 12M18 6l-12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Hairline divider */}
      <div className="absolute inset-x-0 top-[82px] h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

      {/* ===== Mobile Menu & Overlay ===== */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Sliding panel */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="
                fixed top-[92px] right-0 z-50
                h-[calc(100dvh-92px)] w-full sm:w-[420px]
                rounded-l-2xl border-l border-white/20
                bg-white/85 dark:bg-neutral-900/80
                backdrop-blur-2xl
                shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)]
              "
            >
              {/* Decorative gradient edge */}
              <div className="absolute -left-px top-0 h-full w-px bg-gradient-to-b from-transparent via-teal-400/70 to-transparent" />

              <div className="relative h-full overflow-y-auto px-6 py-8">
                <motion.ul
                  className="space-y-4"
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  {[
                    { href: '/', label: 'Home' },
                    { href: '/login', label: 'Login' },
                    { href: '/register', label: 'Register' },
                    { href: '/services', label: 'Services' },
                  ].map((item, idx) => (
                    <motion.li key={item.href} variants={linkVariants} custom={idx}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="
                          group relative block overflow-hidden rounded-2xl
                          border border-white/20
                          bg-white/70 dark:bg-white/5
                          px-5 py-4
                          shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]
                          transition
                          hover:translate-x-0.5 hover:-translate-y-0.5
                          hover:shadow-[0_14px_40px_-12px_rgba(13,148,136,0.5)]
                        "
                      >
                        {/* subtle moving shimmer */}
                        <span className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
                        <span className="relative z-10 flex items-center justify-between">
                          <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                            {item.label}
                          </span>
                          <span className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 px-3 py-2 text-white">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </span>
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* Bottom section */}
                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-teal-500/15 to-blue-600/15 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Siap mulai proyek?
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      Daftar sekarang dan kelola layanan Anda dengan UI kelas premium.
                    </p>
                    <div className="mt-4 flex gap-3">
                      <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_-10px_rgba(13,148,136,0.8)]"
                      >
                        Buat Akun
                      </Link>
                      <Link
                        href="/services"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center rounded-xl border border-white/30 bg-white/30 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 backdrop-blur-md"
                      >
                        Lihat Services
                      </Link>
                    </div>
                  </div>

                  <div className="text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} SkillNova — All rights reserved.
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
