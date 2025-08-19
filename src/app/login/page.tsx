/* eslint-disable react/no-unescaped-entities */
// 'use client';

// import { useState } from 'react';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/lib/firebaseConfig';
// import { useRouter } from 'next/navigation';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       router.push('/');
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Login</h2>
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

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();
//   const [accountType, setAccountType] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);

//       // Redirect user based on account type
//       if (accountType === 'admin') {
//         router.push('/dashboard-admin');
//       } else if (accountType === 'user') {
//         router.push('/dashboard-user');
//       } else if (accountType === 'worker') {
//         router.push('/dashboard-worker');
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleAccountTypeSelect = (type: string) => {
//     setAccountType(type);
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Login</h2>
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
        
//         {/* Account Type Selector */}
//         <div className="mb-4">
//           <label className="block font-bold mb-2">Select Account Type:</label>
//           <div className="flex space-x-4">
//             <button type="button" className={`p-2 ${accountType === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200'} border`} onClick={() => handleAccountTypeSelect('admin')}>
//               Admin
//             </button>
//             <button type="button" className={`p-2 ${accountType === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200'} border`} onClick={() => handleAccountTypeSelect('user')}>
//               User
//             </button>
//             <button type="button" className={`p-2 ${accountType === 'worker' ? 'bg-blue-600 text-white' : 'bg-gray-200'} border`} onClick={() => handleAccountTypeSelect('worker')}>
//               Worker
//             </button>
//           </div>
//         </div>

//         <button type="submit" className="w-full p-2 bg-blue-500 text-white">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }


//JANGAN DIHAPUSS LOGIC UDAH BENER TAPI CUMAN KURANG BAGUS STYLINGNYA
// 'use client';

// import { useState } from 'react';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from '@/lib/firebaseConfig'; // Import db for Firestore
// import { useRouter } from 'next/navigation';
// import { collection, getDocs, query, where } from 'firebase/firestore'; // Import Firestore methods

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Get user data from Firestore
//       const q = query(collection(db, 'users'), where('uid', '==', user.uid));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         const userData = querySnapshot.docs[0].data();

//         // Redirect based on account type
//         if (userData.accountType === 'admin') {
//           router.push('/dashboard-admin');
//         } else if (userData.accountType === 'user') {
//           router.push('/dashboard-user');
//         } else if (userData.accountType === 'worker') {
//           router.push('/dashboard-worker');
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Login</h2>
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
// import { auth, db } from '@/lib/firebaseConfig';
// import { useRouter } from 'next/navigation';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { motion } from 'framer-motion';
// import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(''); // Reset error message
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Get user data from Firestore
//       const q = query(collection(db, 'users'), where('uid', '==', user.uid));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         const userData = querySnapshot.docs[0].data();

//         // Redirect based on account type
//         if (userData.accountType === 'admin') {
//           router.push('/dashboard-admin');
//         } else if (userData.accountType === 'user') {
//           router.push('/dashboard-user');
//         } else if (userData.accountType === 'worker') {
//           router.push('/dashboard-worker');
//         }
//       }
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
//           Login
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
import { auth, db } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  // === State utama (tidak mengubah logika) ===
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // === Tambahan state UI (tidak mempengaruhi bisnis logic) ===
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore (tetap sama)
      const q = query(collection(db, 'users'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data() as { accountType?: string };

        // Redirect berdasarkan account type (tetap sama)
        if (userData.accountType === 'admin') {
          router.push('/dashboard-admin');
        } else if (userData.accountType === 'user') {
          router.push('/dashboard-user');
        } else if (userData.accountType === 'worker') {
          router.push('/dashboard-worker');
        } else {
          setError('Akun tidak memiliki tipe yang valid. Hubungi admin.');
        }
      } else {
        setError('Data pengguna tidak ditemukan di database.');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      {/* Navbar tetap */}
      <Navbar />

      {/* --- AURORA / GLASS BACKGROUND (styling mewah) --- */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Radial glow center */}
        <div className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[120vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.18),rgba(59,130,246,0.10)_45%,rgba(0,0,0,0)_70%)] blur-3xl" />
        {/* Aurora strokes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1.2 }}
          className="absolute right-[-10%] top-[10%] h-[60vh] w-[60vw] rounded-full blur-[60px] bg-gradient-to-br from-teal-500/20 via-sky-500/20 to-indigo-500/20"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute left-[-15%] bottom-[-10%] h-[70vh] w-[70vw] rounded-full blur-[70px] bg-gradient-to-tr from-cyan-400/20 via-fuchsia-400/10 to-emerald-400/10"
        />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-[0.06]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-28">
        {/* Card wrapper dengan glow ring */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Outer Glow Border */}
          <div className="absolute inset-0 -z-10 mx-auto h-[520px] max-w-md rounded-[28px] bg-gradient-to-r from-teal-500/30 via-sky-500/30 to-indigo-500/30 blur-2xl" />

          {/* Card Glass */}
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
            {/* Top gradient line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            {/* Inner shine */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-full bg-gradient-to-b from-white/15 to-transparent blur-2xl" />

            <div className="relative p-8">
              {/* Title */}
              <h2 className="mb-2 bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-300 bg-clip-text text-center text-3xl font-extrabold text-transparent">
                Login
              </h2>
              <p className="mb-6 text-center text-sm text-white/60">
                Masuk ke akun Anda untuk melanjutkan.
              </p>

              {/* Error alert (tetap mengikuti error state) */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-300"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </motion.div>
              )}

              {/* Form (struktur & handler tetap) */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/70"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <FiMail className="h-5 w-5 text-white/40" />
                    </span>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-11 py-3 text-white placeholder-white/40 outline-none transition focus:border-teal-400/40 focus:ring-2 focus:ring-teal-500/40"
                      required
                      autoComplete="email"
                      aria-invalid={!!error}
                    />
                    {/* subtle glow on focus */}
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/5" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/70"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <FiLock className="h-5 w-5 text-white/40" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-11 py-3 pr-12 text-white placeholder-white/40 outline-none transition focus:border-teal-400/40 focus:ring-2 focus:ring-teal-500/40"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute inset-y-0 right-3 flex items-center text-white/50 hover:text-white/80"
                    >
                      {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                    </button>
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/5" />
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-500 px-4 py-3 font-semibold text-white shadow-lg transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {/* animated sheen */}
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition group-hover:translate-x-full" />
                  <div className="flex items-center justify-center gap-2">
                    {loading && (
                      <span
                        className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                        aria-hidden
                      />
                    )}
                    <span>{loading ? 'Processing...' : 'Login'}</span>
                  </div>
                </motion.button>
              </form>

              {/* Register link (tetap) */}
              <p className="mt-6 text-center text-sm text-white/60">
                Don&apos;t have an account?{' '}
                <a
                  href="/register"
                  className="font-semibold text-teal-300 hover:text-teal-200"
                >
                  Register here
                </a>
              </p>
            </div>

            {/* Bottom gradient line */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
