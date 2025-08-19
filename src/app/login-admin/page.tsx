// // src/app/login-admin/page.tsx
// 'use client';

// import { useState } from 'react';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/lib/firebaseConfig';
// import { useRouter } from 'next/navigation';

// export default function LoginAdmin() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       router.push('/dashboard-admin'); // Redirect to admin dashboard after successful login
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Login Admin</h2>
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

// export default function LoginAdmin() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(''); // Reset error message
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       router.push('/dashboard-admin'); // Redirect to admin dashboard after successful login
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
//         <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6 text-center">
//           Login Admin
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
//               className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
//               className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//               required
//             />
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="submit"
//             className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
//           >
//             Login
//           </motion.button>
//         </form>
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
import Navbar from '@/app/navbar';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard-admin');
    } catch (error) {
      console.error(error);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100 via-white to-pink-50">
      {/* Decorative premium background */}
      <Navbar />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full bg-gradient-to-br from-fuchsia-400/40 to-purple-300/40 blur-3xl"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.9, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="pointer-events-none absolute -bottom-40 -right-24 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-rose-400/40 to-violet-300/40 blur-3xl"
      />
      {/* subtle grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      <div className="relative z-10 py-28 flex items-center justify-center">
        {/* Outer glow gradient frame */}
        <div className="relative w-full max-w-md px-6 sm:px-0">
          <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 opacity-80 blur-[6px]" />
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[0_10px_50px_-10px_rgba(99,102,241,.35)] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600">
                Login Admin
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Selamat datang kembali. Silakan masuk untuk melanjutkan.
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-center text-sm font-medium text-red-700"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.35 }}
              >
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-gray-800"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="peer mt-0 w-full rounded-xl border border-gray-200 bg-white/70 px-10 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500/70 backdrop-blur-sm"
                    required
                  />
                  {/* input glow */}
                  <div className="pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity peer-focus:opacity-100">
                    <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-500/40 to-pink-500/40 blur" />
                  </div>
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
              >
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-gray-800"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="peer mt-0 w-full rounded-xl border border-gray-200 bg-white/70 px-10 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500/70 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {/* input glow */}
                  <div className="pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity peer-focus:opacity-100">
                    <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-pink-500/40 to-purple-500/40 blur" />
                  </div>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98, y: 0 }}
                type="submit"
                className="group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-4 py-3.5 text-center font-semibold text-white shadow-lg transition-all hover:shadow-[0_12px_40px_-12px_rgba(236,72,153,.55)] focus:outline-none"
              >
                <span className="relative z-10">Login</span>
                {/* animated sheen */}
                <span className="pointer-events-none absolute inset-0 block translate-x-[-150%] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-[150%] group-hover:opacity-100" />
              </motion.button>
            </form>

            {/* Trust badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Protected by Firebase Authentication</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
