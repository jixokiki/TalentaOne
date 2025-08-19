/* eslint-disable react/no-unescaped-entities */
// // src/app/login-user/page.tsx
// 'use client';

// import { useState } from 'react';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/lib/firebaseConfig';
// import { useRouter } from 'next/navigation';

// export default function LoginUser() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       router.push('/dashboard-user'); // Redirect to user dashboard after successful login
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Login User</h2>
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

// export default function LoginUser() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(''); // Reset error message
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       router.push('/dashboard-user'); // Redirect to user dashboard after successful login
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
//         <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 mb-6 text-center">
//           Login User
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
//               className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
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
//               className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
//               required
//             />
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="submit"
//             className="w-full p-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all"
//           >
//             Login
//           </motion.button>
//         </form>
//         <p className="mt-6 text-center text-sm text-gray-600">
//           Don't have an account?{' '}
//           <a
//             href="/register"
//             className="font-semibold text-teal-600 hover:text-teal-500"
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

export default function LoginUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard-user'); // Redirect to user dashboard after successful login
    } catch (error) {
      console.error(error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
        relative min-h-screen flex flex-col
        bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
        from-sky-50 via-white to-teal-50
        dark:from-neutral-900 dark:via-neutral-950 dark:to-black
        overflow-hidden
      "
    >
      {/* Navbar tetap ada, tidak diubah */}
      <Navbar />

      {/* Dekorasi latar premium: grid halus + orbs */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)]
          dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]
          bg-[size:36px_36px]
          [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]
        "
      />
      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-teal-400/40 to-blue-500/40 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-400/30 to-indigo-500/30 blur-3xl"
      />

      {/* Konten utama */}
      <div className="flex-1 py-28 sm:py-32 flex items-center justify-center px-4">
        {/* Glow ring wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="
            relative w-full max-w-md
          "
        >
          {/* Outer gradient border */}
          <div
            className="
              relative p-[1.2px] rounded-3xl
              bg-gradient-to-br from-teal-400 via-blue-500 to-fuchsia-500
              shadow-[0_0_0_1px_rgba(255,255,255,0.15)]
              shadow-teal-500/10
            "
          >
            {/* Glass card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="
                relative rounded-3xl p-8 sm:p-10
                bg-white/70 dark:bg-neutral-900/70
                backdrop-blur-xl
                ring-1 ring-black/[0.06] dark:ring-white/[0.08]
                shadow-2xl shadow-black/5
              "
            >
              {/* Accent glow line */}
              <div
                aria-hidden
                className="absolute inset-x-6 -top-0.5 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10"
              />

              {/* Heading */}
              <div className="text-center mb-8">
                <h2
                  className="
                    text-3xl sm:text-4xl font-extrabold tracking-tight
                    text-transparent bg-clip-text
                    bg-gradient-to-r from-teal-600 via-blue-600 to-fuchsia-600
                    dark:from-teal-300 dark:via-sky-300 dark:to-fuchsia-300
                  "
                >
                  Login User
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Masuk untuk melanjutkan ke dashboard Anda.
                </p>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="
                    mb-5 p-3 rounded-xl text-sm text-red-700 dark:text-red-300
                    bg-red-50/80 dark:bg-red-900/20
                    ring-1 ring-red-200/60 dark:ring-red-800/40
                    text-center
                  "
                  role="alert"
                >
                  {error}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-200"
                  >
                    Email
                  </label>
                  <div className="relative group">
                    <span
                      aria-hidden
                      className="
                        absolute inset-y-0 left-3 my-auto h-5 w-5
                        text-gray-500/80 dark:text-gray-400/80
                      "
                    >
                      {/* Mail Icon (inline SVG, no extra deps) */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          d="M4 6h16v12H4z"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="m4 7 8 6 8-6"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="
                        peer w-full pl-11 pr-4 py-3 rounded-xl
                        bg-white/75 dark:bg-neutral-800/70
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        border border-gray-200/70 dark:border-white/10
                        focus:outline-none focus:ring-2 focus:ring-teal-500/70 focus:border-transparent
                        transition-all
                        shadow-[inset_0_0_0_9999px_rgba(255,255,255,0.02)]
                      "
                      autoComplete="email"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-200"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <span
                      aria-hidden
                      className="
                        absolute inset-y-0 left-3 my-auto h-5 w-5
                        text-gray-500/80 dark:text-gray-400/80
                      "
                    >
                      {/* Lock Icon */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect
                          x="4"
                          y="10"
                          width="16"
                          height="10"
                          rx="2"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8 10V7a4 4 0 1 1 8 0v3"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="
                        peer w-full pl-11 pr-12 py-3 rounded-xl
                        bg-white/75 dark:bg-neutral-800/70
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        border border-gray-200/70 dark:border-white/10
                        focus:outline-none focus:ring-2 focus:ring-teal-500/70 focus:border-transparent
                        transition-all
                        shadow-[inset_0_0_0_9999px_rgba(255,255,255,0.02)]
                      "
                      autoComplete="current-password"
                      required
                      aria-required="true"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="
                        absolute inset-y-0 right-2 my-auto px-3 py-1.5
                        rounded-lg text-xs font-medium
                        text-gray-600 dark:text-gray-300
                        bg-gray-100/70 dark:bg-white/10
                        hover:bg-gray-200/70 dark:hover:bg-white/15
                        ring-1 ring-inset ring-gray-300/60 dark:ring-white/15
                        transition
                      "
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`
                    group w-full py-3 rounded-xl font-semibold
                    bg-gradient-to-r from-teal-500 via-sky-500 to-blue-500
                    hover:from-teal-600 hover:via-sky-600 hover:to-blue-600
                    text-white transition-all
                    shadow-[0_10px_40px_0_rgba(56,189,248,0.45)]
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
                    disabled:opacity-60 disabled:cursor-not-allowed
                  `}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {isLoading && (
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          strokeWidth="3"
                          className="opacity-30"
                        />
                        <path
                          d="M21 12a9 9 0 0 1-9 9"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    {isLoading ? 'Signing in...' : 'Login'}
                  </span>
                </motion.button>
              </form>

              {/* Register link */}
              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
                Don&apos;t have an account?{' '}
                <a
                  href="/register"
                  className="
                    font-semibold text-teal-600 hover:text-teal-500
                    underline decoration-teal-400/40 hover:decoration-teal-500/70 underline-offset-4
                  "
                >
                  Register here
                </a>
              </p>

              {/* Subtle bottom glow */}
              <div
                aria-hidden
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 h-24 w-[75%] rounded-[32px] bg-gradient-to-r from-teal-500/25 via-sky-500/25 to-fuchsia-500/25 blur-2xl"
              />
            </motion.div>
          </div>

          {/* Floating accents */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute -z-10 -top-8 right-8 h-10 w-10 rounded-full bg-gradient-to-br from-amber-300/80 to-pink-400/80 blur-[2px]"
          />
          <motion.div
            aria-hidden
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="absolute -z-10 -bottom-10 left-10 h-8 w-8 rounded-full bg-gradient-to-br from-emerald-300/80 to-cyan-400/80 blur-[2px]"
          />
        </motion.div>
      </div>
    </div>
  );
}
