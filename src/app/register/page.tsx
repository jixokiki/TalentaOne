// 'use client';

// import { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/lib/firebaseConfig';
// import { useRouter } from 'next/navigation';

// export default function Register() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       router.push('/');
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Register</h2>
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
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }



// 'use client';

// import { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/lib/firebaseConfig';
// import { useRouter } from 'next/navigation';

// export default function Register() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [accountType, setAccountType] = useState(''); // Account type state
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!accountType) {
//       alert('Please select an account type!');
//       return;
//     }

//     try {
//       await createUserWithEmailAndPassword(auth, email, password);

//       if (accountType === 'admin') {
//         router.push('/login-admin'); // Direct to Admin login
//       } else if (accountType === 'user') {
//         router.push('/login-user'); // Direct to User login
//       } else if (accountType === 'worker') {
//         router.push('/login-worker'); // Direct to Worker login
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
//       <h2 className="text-2xl font-bold mb-4">Register</h2>
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
        
//         {/* Pop-up style selection for account type */}
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
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }

//JANGAN DIHAPUS INI CUMAN STYLINGNYA YANG KURANG LOGICNYA UDAH PALING BENER
// 'use client';

// import { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from '@/lib/firebaseConfig'; // Import db for Firestore
// import { useRouter } from 'next/navigation';
// import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods

// export default function Register() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [accountType, setAccountType] = useState(''); // Account type state
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!accountType) {
//       alert('Please select an account type!');
//       return;
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Save user info to Firestore
//       await addDoc(collection(db, 'users'), {
//         uid: user.uid,
//         email: user.email,
//         accountType: accountType, // Save account type
//       });

//       // Redirect based on account type
//       if (accountType === 'admin') {
//         router.push('/login-admin'); // Direct to Admin login
//       } else if (accountType === 'user') {
//         router.push('/login-user'); // Direct to User login
//       } else if (accountType === 'worker') {
//         router.push('/login-worker'); // Direct to Worker login
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
//       <h2 className="text-2xl font-bold mb-4">Register</h2>
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
        
//         {/* Pop-up style selection for account type */}
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
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }


// 'use client';

// import { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from '@/lib/firebaseConfig';
// import { useRouter } from 'next/navigation';
// import { collection, addDoc } from 'firebase/firestore';
// import { motion } from 'framer-motion';
// import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda

// export default function Register() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [accountType, setAccountType] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!accountType) {
//       setError('Please select an account type!');
//       return;
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Save user info to Firestore
//       await addDoc(collection(db, 'users'), {
//         uid: user.uid,
//         email: user.email,
//         accountType: accountType,
//       });

//       // Redirect based on account type
//       if (accountType === 'admin') {
//         router.push('/login-admin');
//       } else if (accountType === 'user') {
//         router.push('/login-user');
//       } else if (accountType === 'worker') {
//         router.push('/login-worker');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('Registration failed. Please try again.');
//     }
//   };

//   const handleAccountTypeSelect = (type: string) => {
//     setAccountType(type);
//     setError(''); // Clear error when account type is selected
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
//           Register
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
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Account Type:
//             </label>
//             <div className="grid grid-cols-3 gap-4">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 type="button"
//                 onClick={() => handleAccountTypeSelect('admin')}
//                 className={`p-4 rounded-lg text-center font-semibold transition-all ${
//                   accountType === 'admin'
//                     ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Admin
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 type="button"
//                 onClick={() => handleAccountTypeSelect('user')}
//                 className={`p-4 rounded-lg text-center font-semibold transition-all ${
//                   accountType === 'user'
//                     ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 User
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 type="button"
//                 onClick={() => handleAccountTypeSelect('worker')}
//                 className={`p-4 rounded-lg text-center font-semibold transition-all ${
//                   accountType === 'worker'
//                     ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Worker
//               </motion.button>
//             </div>
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="submit"
//             className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
//           >
//             Register
//           </motion.button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }
'use client';

import { useMemo, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // ---- Helpers: "100 juta UX" (tanpa ganggu logika utama) ----
  const calcStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 4); // skala 0..4
  };

  const strength = useMemo(() => calcStrength(password), [password]);
  const strengthLabel = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][strength] || 'Too short';
  const strengthBarWidth = ['0%', '25%', '50%', '75%', '100%'][strength] || '0%';
  const strengthBarClass = [
    'bg-gray-200',
    'bg-red-400',
    'bg-yellow-400',
    'bg-emerald-400',
    'bg-green-500'
  ][strength] || 'bg-gray-200';

  const friendlyFirebaseError = (code?: string) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Email sudah terdaftar. Coba login atau gunakan email lain.';
      case 'auth/invalid-email':
        return 'Format email tidak valid.';
      case 'auth/weak-password':
        return 'Password terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol.';
      default:
        return 'Registration failed. Please try again.';
    }
  };

  // ---- Logic utama (TIDAK diubah) ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountType) {
      setError('Please select an account type!');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user info to Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email,
        accountType: accountType,
      });

      // Redirect based on account type
      if (accountType === 'admin') {
        router.push('/login-admin');
      } else if (accountType === 'user') {
        router.push('/login-user');
      } else if (accountType === 'worker') {
        router.push('/login-worker');
      }
    } catch (err: unknown) {
      console.error(err);
      const code = (err as { code?: string })?.code;
      setError(friendlyFirebaseError(code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountTypeSelect = (type: string) => {
    setAccountType(type);
    setError(''); // Clear error when account type is selected
  };

  // ---- UI Premium: Animated background + glassmorphism ----
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100">
      {/* Decorative Background */}
      <Navbar />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.15]"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Animated gradient blobs */}
      <motion.div
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl -z-10"
        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(168,85,247,0.35), transparent 60%)' }}
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        aria-hidden
      />
      <motion.div
        className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full blur-3xl -z-10"
        style={{ background: 'radial-gradient(circle at 70% 70%, rgba(236,72,153,0.35), transparent 60%)' }}
        animate={{ x: [0, -40, 20, 0], y: [0, 20, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        aria-hidden
      />

      {/* Shine line */}
      <motion.div
        className="absolute inset-x-0 top-28 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 5, repeat: Infinity }}
        aria-hidden
      />

      {/* Page container */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        {/* Card wrapper with gradient border */}
        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-fuchsia-500 via-pink-500 to-cyan-400 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
            <div className="rounded-3xl bg-white/5 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-white/10">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-lg shadow-fuchsia-500/20">
                  {/* Sparkle icon (inline SVG, no extra deps) */}
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 2l1.8 4.6L18 8.4l-4.2 1.8L12 15l-1.8-4.8L6 8.4l4.2-1.8L12 2z" fill="currentColor" className="text-white/90"/>
                    <path d="M19 12l.9 2.3 2.3.9-2.3.9L19 18l-.9-2.3L16 15.2l2.1-.9L19 12z" fill="currentColor" className="text-pink-200/90"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
                    Register
                  </span>
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  Buat akun untuk melanjutkan. Aman, cepat, dan elegan ✨
                </p>
              </div>

              {/* Error banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
                  role="alert"
                >
                  {error}
                </motion.div>
              )}

              {/* Form (struktur & logic TIDAK diubah) */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-200">
                    Email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                      {/* Mail icon */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-slate-400">
                        <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-fuchsia-500/40 hover:border-white/20"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                      {/* Lock icon */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-slate-400">
                        <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-12 text-slate-100 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-fuchsia-500/40 hover:border-white/20"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-300/80 hover:bg-white/10 hover:text-white transition"
                    >
                      {/* Eye / Eye-off icon */}
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M10.6 10.8a3 3 0 104.2 4.2" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M21 12s-3.6-6-9-6c-1.2 0-2.3.3-3.4.8M3 12s3.6 6 9 6c.9 0 1.7-.1 2.5-.3" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M12 6c-5.4 0-9 6-9 6s3.6 6 9 6 9-6 9-6-3.6-6-9-6z" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Strength meter */}
                  <div className="mt-2">
                    <div className="h-1.5 w-full rounded-full bg-white/10">
                      <div
                        className={`h-1.5 rounded-full transition-all ${strengthBarClass}`}
                        style={{ width: strengthBarWidth }}
                        aria-hidden
                      />
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      Strength: <span className="text-slate-300">{strengthLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Account type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Select Account Type:
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'admin', label: 'Admin' },
                      { key: 'user', label: 'User' },
                      { key: 'worker', label: 'Worker' },
                    ].map(({ key, label }) => {
                      const selected = accountType === key;
                      return (
                        <motion.button
                          key={key}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => handleAccountTypeSelect(key)}
                          className={[
                            'relative p-4 rounded-xl text-center font-semibold transition-all ring-1',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60',
                            selected
                              ? 'bg-gradient-to-br from-fuchsia-600 to-pink-600 text-white ring-white/0 shadow-xl shadow-fuchsia-600/25'
                              : 'bg-white/5 text-slate-200 hover:bg-white/10 ring-white/10'
                          ].join(' ')}
                        >
                          {/* Tiny icon at top-right when selected */}
                          {selected && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-emerald-950 shadow-lg"
                              aria-hidden
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" />
                              </svg>
                            </motion.span>
                          )}
                          {label}
                        </motion.button>
                      );
                    })}
                  </div>

                  {!accountType && (
                    <p className="mt-2 text-xs text-amber-300/90">
                      *Wajib pilih salah satu untuk melanjutkan.
                    </p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.015 }}
                  whileTap={{ scale: isLoading ? 1 : 0.985 }}
                  type="submit"
                  disabled={isLoading}
                  className={[
                    'group relative w-full overflow-hidden rounded-xl px-4 py-3 font-semibold transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60',
                    isLoading
                      ? 'cursor-not-allowed bg-white/10 text-slate-300'
                      : 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:from-fuchsia-600 hover:to-pink-600'
                  ].join(' ')}
                >
                  <span className="relative z-10">
                    {isLoading ? 'Processing...' : 'Register'}
                  </span>

                  {/* Shimmer */}
                  {!isLoading && (
                    <span
                      className="absolute inset-0 -z-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition group-hover:translate-x-[100%] group-hover:opacity-100"
                      aria-hidden
                      style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
                    />
                  )}
                </motion.button>
              </form>

              {/* Footer / helper */}
              <div className="mt-6 text-center text-xs text-slate-400">
                Dengan mendaftar, Anda menyetujui{' '}
                <span className="text-slate-300 underline decoration-dotted underline-offset-2">
                  Ketentuan
                </span>{' '}
                &{' '}
                <span className="text-slate-300 underline decoration-dotted underline-offset-2">
                  Kebijakan Privasi
                </span>
                .
              </div>
            </div>
          </div>

          {/* Subtle shadow glow */}
          <div className="mx-auto mt-6 h-8 w-3/4 rounded-full bg-gradient-to-r from-transparent via-fuchsia-600/20 to-transparent blur-2xl" aria-hidden />
        </motion.div>
      </div>
    </div>
  );
}
