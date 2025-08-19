// /* eslint-disable @typescript-eslint/no-unused-vars */
// 'use client';

// import { useState, useEffect } from 'react';
// import { FiMenu, FiX, FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { onAuthStateChanged, User, signOut } from 'firebase/auth';
// import { auth } from '@/lib/firebaseConfig';
// import { getDoc, doc } from 'firebase/firestore';
// import { db } from '@/lib/firebaseConfig';

// export default function NavbarUser() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [accountType, setAccountType] = useState<string | null>(null);
//   const [queueNumber, setQueueNumber] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // Fetch user data
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);

//         // Ambil accountType dari Firestore berdasarkan UID
//         const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           setAccountType(userData.accountType);

//           // Ambil nomor antrian berdasarkan UID
//           if (userData.queueNumber) {
//             setQueueNumber(userData.queueNumber);
//           }
//         }
//       } else {
//         setUser(null); // Reset user state jika tidak ada pengguna yang login
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const toggleNavbar = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleProfileClick = () => {
//     router.push('/profile');
//   };

//   const handleLogin = () => {
//     router.push('/login'); // Arahkan ke halaman login
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth); // Logout dari Firebase
//       router.push('/'); // Arahkan ke halaman utama
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   return (
//     <nav className="bg-white shadow-lg">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="flex justify-between items-center py-3">
//           <div className="flex items-center">
//             <button
//               onClick={toggleNavbar}
//               className="text-gray-800 focus:outline-none"
//             >
//               {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
//             </button>
//           </div>
//           <div className="flex items-center space-x-4">
//             {user ? (
//               <FiUser
//                 className="text-2xl text-gray-800 cursor-pointer"
//                 onClick={handleProfileClick}
//                 title="Profile"
//               />
//             ) : (
//               <FiLogIn
//                 className="text-2xl text-gray-800 cursor-pointer"
//                 onClick={handleLogin}
//                 title="Login"
//               />
//             )}
//             {user && (
//               <FiLogOut
//                 className="text-2xl text-gray-800 cursor-pointer"
//                 onClick={handleLogout}
//                 title="Logout"
//               />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3 }}
//             className="bg-white border-t border-gray-200"
//           >
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//               <a
//                 href="#"
//                 className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
//               >
//                 Home
//               </a>
//               <a
//                 href="#"
//                 className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
//               >
//                 About
//               </a>
//               <a
//                 href="./services"
//                 className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
//               >
//                 Services
//               </a>
//               <a
//                 href="#"
//                 className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
//               >
//                 Contact
//               </a>
//             </div>

//             {/* Profile Section */}
//             {user && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="px-4 py-3 border-t border-gray-200"
//               >
//                 <div className="space-y-2">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-500">Email</label>
//                     <p className="mt-1 text-sm font-bold text-gray-800">{user.email}</p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-500">Tipe Akun</label>
//                     <p className="mt-1 text-sm font-bold text-gray-800">
//                       {accountType || 'Tidak diketahui'}
//                     </p>
//                   </div>
//                   {queueNumber ? (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-500">Nomor Antrian</label>
//                       <p className="mt-1 text-sm font-bold text-gray-800">{queueNumber}</p>
//                     </div>
//                   ) : (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-500">Nomor Antrian</label>
//                       <p className="mt-1 text-sm font-bold text-gray-800">
//                         Anda belum mengambil nomor antrian.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// }
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export default function NavbarUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ===== Animations (styling only, logic tetap) =====
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const panelVariants = {
    hidden: { opacity: 0, y: -18, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 320, damping: 28 },
    },
    exit: { opacity: 0, y: -18, transition: { duration: 0.18 } },
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.03 * i, type: 'spring', stiffness: 300, damping: 22 },
    }),
    exit: { y: -8, opacity: 0, transition: { duration: 0.15 } },
  };

  // ===== Fetch user data (logika asli dipertahankan) =====
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Ambil accountType dari Firestore berdasarkan UID
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as { accountType?: string; queueNumber?: number };
          setAccountType(userData.accountType ?? null);

          // Ambil nomor antrian berdasarkan UID
          if (userData.queueNumber) {
            setQueueNumber(userData.queueNumber);
          }
        }
      } else {
        setUser(null); // Reset user state jika tidak ada pengguna yang login
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleNavbar = () => setIsOpen(!isOpen);

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleLogin = () => {
    router.push('/login'); // Arahkan ke halaman login
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Logout dari Firebase
      router.push('/'); // Arahkan ke halaman utama
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="relative z-50">
      {/* Ambient luxe glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-24 bg-gradient-to-b from-teal-500/20 via-cyan-400/10 to-transparent blur-2xl" />

      {/* Glass nav bar */}
      <div className="bg-transparent">
        <div className="max-w-6xl mx-auto px-4">
          <div
            className="
              mt-3 mb-3 flex justify-between items-center py-3 px-4
              rounded-2xl border border-white/20
              bg-white/70 dark:bg-neutral-900/60
              shadow-[0_10px_40px_-12px_rgba(0,0,0,0.35)]
              backdrop-blur-xl
            "
          >
            {/* Left: Burger (struktur & fungsi tetap) */}
            <div className="flex items-center">
              <button
                onClick={toggleNavbar}
                className="
                  relative inline-flex items-center justify-center rounded-xl p-2
                  text-gray-800 dark:text-gray-100
                  hover:bg-white/60 dark:hover:bg-white/10
                  focus:outline-none focus:ring-2 focus:ring-teal-500/50
                  transition
                "
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>

            {/* Right: Icons auth (struktur & fungsi tetap) */}
            <div className="flex items-center space-x-3">
              {loading ? (
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-white/50 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur animate-pulse" />
              ) : user ? (
                <>
                  <button
                    title="Profile"
                    onClick={handleProfileClick}
                    className="
                      relative inline-flex items-center justify-center
                      h-10 w-10 rounded-xl
                      text-gray-800 dark:text-gray-100
                      hover:scale-105 transition
                      bg-white/60 dark:bg-white/10 backdrop-blur border border-white/20
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]
                    "
                  >
                    <FiUser className="text-xl" />
                  </button>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="
                      inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold
                      bg-gradient-to-r from-teal-600 to-blue-600 text-white
                      shadow-[0_10px_24px_-12px_rgba(13,148,136,0.8)]
                      hover:shadow-[0_18px_40px_-12px_rgba(13,148,136,0.8)]
                      active:scale-[0.98] transition
                    "
                  >
                    <FiLogOut className="text-base" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  title="Login"
                  className="
                    inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold
                    text-gray-900 dark:text-gray-100
                    border border-white/30 bg-white/50 dark:bg-white/10 backdrop-blur
                    hover:bg-white/70 dark:hover:bg-white/15 transition
                  "
                >
                  <FiLogIn className="text-base" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hairline divider di bawah navbar */}
      <div className="absolute inset-x-0 top-[82px] h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

      {/* ===== Mobile Menu (struktur asli dipertahankan) ===== */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel (menjaga elemen <a> yang sama) */}
            <motion.div
              key="panel"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={panelVariants}
              className="
                fixed left-0 right-0 top-[88px]
                mx-auto max-w-6xl
                rounded-2xl border border-white/20
                bg-white/85 dark:bg-neutral-900/80
                backdrop-blur-2xl
                shadow-[0_24px_80px_-20px_rgba(0,0,0,0.45)]
                overflow-hidden
              "
            >
              {/* Light bar */}
              <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-cyan-400 to-blue-600" />

              <div className="px-4 sm:px-6 py-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  {/* Links block */}
                  <nav className="space-y-1">
                    {[
                      { href: './dashboard-user', label: 'Home' },
                      { href: '#', label: 'About' },
                      { href: './services', label: 'Services' },
                      { href: '#', label: 'Contact' },
                    ].map((item, i) => (
                      <motion.a
                        key={item.href}
                        href={item.href}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={itemVariants}
                        className="
                          group block px-4 py-3 rounded-xl text-base font-medium
                          text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white
                          border border-white/20 bg-white/70 dark:bg-white/5
                          shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]
                          hover:-translate-y-0.5 hover:shadow-[0_14px_42px_-14px_rgba(13,148,136,0.6)]
                          transition
                        "
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="relative flex items-center justify-between">
                          <span>{item.label}</span>
                          <span
                            className="
                              ml-3 inline-flex items-center justify-center rounded-lg px-2 py-1 text-xs
                              bg-gradient-to-br from-teal-500 to-blue-600 text-white
                            "
                          >
                            Go
                          </span>
                        </span>
                        {/* Shimmer underline */}
                        <span className="block h-px w-full mt-2 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.a>
                    ))}
                  </nav>

                  {/* Profile Section (logika & struktur asli dipertahankan) */}
                  <AnimatePresence>
                    {user && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: 0.15 }}
                        className="
                          rounded-xl border border-white/20
                          bg-gradient-to-br from-teal-500/10 to-blue-600/10
                          p-4 sm:p-5
                        "
                      >
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Email</label>
                            <p className="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100 break-all">
                              {user.email}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Tipe Akun</label>
                            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {accountType || 'Tidak diketahui'}
                            </p>
                          </div>

                          {queueNumber ? (
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Nomor Antrian</label>
                              <p className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
                                <span className="inline-flex h-6 min-w-[2rem] items-center justify-center rounded-md bg-white/70 dark:bg-white/10 px-2 backdrop-blur border border-white/20">
                                  {queueNumber}
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-300">Aktif</span>
                              </p>
                            </div>
                          ) : (
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Nomor Antrian</label>
                              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Anda belum mengambil nomor antrian.
                              </p>
                            </div>
                          )}

                          <div className="pt-2">
                            <button
                              onClick={handleProfileClick}
                              className="
                                inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold
                                border border-white/30 bg-white/50 dark:bg-white/10 backdrop-blur
                                hover:bg-white/70 dark:hover:bg-white/15 transition
                              "
                            >
                              <FiUser className="text-base" />
                              Buka Profile
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
