/* eslint-disable react/no-unescaped-entities */
// // src/app/login-worker/page.tsx
// 'use client';

// import { useState } from 'react';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/lib/firebaseConfig';
// import { useRouter } from 'next/navigation';

// export default function LoginWorker() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       router.push('/dashboard-worker'); // Redirect to worker dashboard after successful login
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Login Worker</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           className="w-full p-2 mb-4 border"
//           required
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           className="w-full p-2 mb-4 border"
//           required
//         />
//         <button type="submit" className="w-full p-2 bg-blue-500 text-white">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }



// 'use client';

// import { useState } from 'react';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/lib/firebaseConfig';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda

// export default function LoginWorker() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(''); // Reset error message
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       router.push('/dashboard-worker'); // Redirect to worker dashboard after successful login
//     } catch (error) {
//       console.error(error);
//       setError('Invalid email or password. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen py-32 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//       <Navbar/>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
//       >
//         <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-6 text-center">
//           Login Worker
//         </h2>
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center"
//           >
//             {error}
//           </motion.div>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
//               required
//             />
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="submit"
//             className="w-full p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
//           >
//             Login
//           </motion.button>
//         </form>
//         <p className="mt-6 text-center text-sm text-gray-600">
//           Don't have an account?{' '}
//           <a
//             href="/register"
//             className="font-semibold text-orange-600 hover:text-orange-500"
//           >
//             Register here
//           </a>
//         </p>
//       </motion.div>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda

export default function LoginWorker() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error message
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard-worker'); // Redirect to worker dashboard after successful login
    } catch (error) {
      console.error(error);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div
      className="
        relative isolate min-h-screen py-24 flex items-center justify-center overflow-hidden
        bg-gradient-to-br from-orange-50 via-rose-50 to-amber-100
        dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950
      "
    >
      {/* Top navigation stays intact */}
      <Navbar />

      {/* Premium floating gradient orbs */}
      <div className="pointer-events-none absolute -top-28 -left-24 h-96 w-96 rounded-full bg-gradient-to-tr from-orange-400/40 via-fuchsia-500/40 to-red-500/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-amber-400/40 via-orange-500/40 to-rose-500/40 blur-3xl" />

      {/* Subtle radial grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.5),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.35),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.4),transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.06),transparent_40%)]" />
      </div>

      {/* Card with luxury gradient border + glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Gradient ring frame */}
        <div className="absolute -inset-[2px] rounded-[22px] bg-gradient-to-br from-orange-400 via-pink-500 to-red-600 opacity-80 blur-sm" />
        <div className="relative rounded-[20px] p-[1px]">
          {/* Inner subtle gradient border */}
          <div className="rounded-[20px] bg-gradient-to-br from-white/70 to-white/30 dark:from-neutral-900/50 dark:to-neutral-900/30 p-0.5 backdrop-blur-xl">
            {/* Actual content surface */}
            <div className="rounded-[18px] bg-white/90 dark:bg-neutral-950/70 border border-white/40 dark:border-white/10 shadow-[0_12px_60px_rgba(0,0,0,0.15)]">
              <div className="p-8">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30 ring-1 ring-white/20 flex items-center justify-center">
                    {/* Simple crown-like glyph */}
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-white"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 8l4 3 5-6 5 6 4-3v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"
                        className="fill-white/90"
                      />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-600 to-red-600">
                    Login Worker
                  </h2>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                    Akses panel kerja Anda dengan tampilan premium & nyaman.
                  </p>
                </div>

                {/* Error notice (logic unchanged) */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 rounded-xl border border-red-200/70 bg-red-50/80 px-4 py-3 text-center text-sm font-medium text-red-700 shadow-sm dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                    aria-live="polite"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Form (structure, fields, names unchanged) */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="group relative">
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
                    >
                      Email
                    </label>
                    <div className="relative">
                      {/* Leading icon (pure SVG, no new deps) */}
                      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-neutral-400 group-focus-within:text-orange-500 transition-colors"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 6h16v12H4z"
                            className="stroke-current"
                            strokeWidth="1.5"
                            opacity=".35"
                          />
                          <path
                            d="M4 7l8 6 8-6"
                            className="stroke-current"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="
                          mt-1 w-full rounded-xl border border-neutral-200/80 bg-white/70
                          px-10 py-3 text-neutral-800 placeholder:text-neutral-400
                          shadow-inner focus:outline-none
                          focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500
                          transition-all
                          dark:border-white/10 dark:bg-neutral-900/60 dark:text-white
                          dark:placeholder:text-neutral-500
                        "
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="group relative">
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-neutral-400 group-focus-within:text-orange-500 transition-colors"
                          aria-hidden="true"
                        >
                          <path
                            d="M7 10V8a5 5 0 0 1 10 0v2"
                            className="stroke-current"
                            strokeWidth="1.5"
                          />
                          <rect
                            x="5"
                            y="10"
                            width="14"
                            height="10"
                            rx="2"
                            className="stroke-current"
                            strokeWidth="1.5"
                            opacity=".35"
                          />
                        </svg>
                      </div>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="
                          mt-1 w-full rounded-xl border border-neutral-200/80 bg-white/70
                          px-10 py-3 text-neutral-800 placeholder:text-neutral-400
                          shadow-inner focus:outline-none
                          focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500
                          transition-all
                          dark:border-white/10 dark:bg-neutral-900/60 dark:text-white
                          dark:placeholder:text-neutral-500
                        "
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="
                      relative w-full overflow-hidden rounded-xl px-4 py-3.5
                      font-semibold text-white shadow-lg
                      bg-gradient-to-r from-orange-500 via-rose-500 to-red-500
                      hover:from-orange-600 hover:via-rose-600 hover:to-red-600
                      transition-all duration-300
                    "
                  >
                    {/* Shimmer highlight */}
                    <span
                      className="
                        pointer-events-none absolute inset-0 -translate-x-full
                        bg-gradient-to-r from-transparent via-white/30 to-transparent
                        skew-x-12
                        group-hover:translate-x-full
                      "
                    />
                    Login
                  </motion.button>
                </form>

                <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-300">
                  Don&apos;t have an account?{' '}
                  <a
                    href="/register"
                    className="font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    Register here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Soft glow behind the card */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[20px] bg-gradient-to-br from-orange-500/20 via-rose-500/10 to-red-500/20 blur-2xl" />
      </motion.div>
    </div>
  );
}
