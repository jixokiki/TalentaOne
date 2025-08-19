'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { motion } from 'framer-motion';
import NavbarWorker from '../navbarworker';

export default function ProfileWorker() {
  const [user, setUser] = useState<User | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // ===== Animations (styling only) =====
  const cardVariants = {
    hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0)', transition: { type: 'spring', stiffness: 300, damping: 26 } },
  };

  const statVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.06 * i, type: 'spring', stiffness: 320, damping: 22 },
    }),
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Ambil accountType dari Firestore berdasarkan UID (logika asli dipertahankan)
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as { accountType?: string; queueNumber?: number };
          setAccountType(userData.accountType ?? null);

          // Ambil nomor antrian berdasarkan UID
          if (userData.queueNumber) {
            setQueueNumber(userData.queueNumber);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-live="polite"
          className="relative rounded-2xl border border-white/30 bg-white/60 px-6 py-4 text-2xl font-bold text-gray-700 backdrop-blur-xl shadow-[0_20px_60px_-24px_rgba(0,0,0,0.35)]"
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 animate-pulse rounded-full bg-gradient-to-r from-teal-500 to-blue-600" />
            Loading...
          </span>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border border-white/30 bg-white/60 px-6 py-4 text-2xl font-bold text-gray-700 backdrop-blur-xl shadow-[0_20px_60px_-24px_rgba(0,0,0,0.35)]"
        >
          Silakan login untuk melihat profil.
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-24 pt-28 sm:pt-28">
      {/* Navbar (struktur & fungsi tetap) */}
      <NavbarWorker />

      {/* Premium ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 -left-24 h-80 w-80 rounded-full bg-teal-400/25 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"
      >
        {/* Heading */}
        <div className="relative mx-auto mb-10 w-fit">
          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-teal-500/10 via-cyan-400/10 to-blue-600/10 blur-2xl" />
          <h1 className="text-center text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
            Profile
          </h1>
          <div className="mx-auto mt-3 h-px w-40 bg-gradient-to-r from-transparent via-teal-500/60 to-transparent" />
        </div>

        {/* Gradient border wrapper for the card */}
        <div className="relative rounded-[22px] p-[1px] bg-gradient-to-br from-teal-500/60 via-cyan-400/60 to-blue-600/60 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]">
          <div className="rounded-[20px] bg-white/70 backdrop-blur-xl border border-white/40 p-8">
            {/* Avatar + Email */}
            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 p-[2px]">
                  <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white/80 text-2xl font-extrabold text-teal-700">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-[10px] text-white shadow" >
                    ✓
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="text-2xl font-bold text-gray-900 break-all">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-xl border border-white/40 bg-white/60 px-3 py-1.5 text-xs font-semibold text-gray-700 backdrop-blur">
                  UID:
                  <span className="ml-1 max-w-[160px] truncate align-middle font-mono text-[11px] text-gray-900">{user.uid}</span>
                </span>
                <span className="hidden sm:inline-flex items-center rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_10px_24px_-12px_rgba(13,148,136,0.65)]">
                  Terverifikasi
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div
                custom={0}
                variants={statVariants}
                initial="hidden"
                animate="visible"
                className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-5 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
              >
                <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
                <div className="text-sm font-medium text-gray-500">Tipe Akun</div>
                <div className="mt-1 text-2xl font-bold text-gray-900">
                  {accountType || 'Tidak diketahui'}
                </div>
                <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />
                <div className="mt-3 text-xs text-gray-500">
                  Status akses dan peran Anda di platform.
                </div>
              </motion.div>

              <motion.div
                custom={1}
                variants={statVariants}
                initial="hidden"
                animate="visible"
                className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-5 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
              >
                <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
                <div className="text-sm font-medium text-gray-500">Nomor Antrian</div>
                {queueNumber ? (
                  <div className="mt-1 inline-flex items-center gap-2 text-2xl font-bold text-gray-900">
                    <span className="inline-flex h-8 min-w-[2.25rem] items-center justify-center rounded-md border border-white/40 bg-white/80 px-2 font-mono">
                      {queueNumber}
                    </span>
                    <span className="text-xs font-semibold text-teal-700">Aktif</span>
                  </div>
                ) : (
                  <div className="mt-1 text-2xl font-bold text-gray-900">
                    Anda belum mengambil nomor antrian.
                  </div>
                )}
                <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />
                <div className="mt-3 text-xs text-gray-500">
                  Ambil antrian saat memulai layanan untuk prioritas proses.
                </div>
              </motion.div>
            </div>

            {/* Subtle footer hint */}
            <div className="mt-8 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/60 px-3 py-1.5 text-xs font-medium text-gray-600 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-600" />
                Data profil ditarik langsung dari Firebase.
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
