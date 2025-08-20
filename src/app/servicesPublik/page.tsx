'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  // query,
  // where
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseConfig';
import { Task } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  FiBell,
  FiBellOff,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  // ⛔️ FiDownload dihapus agar tidak ada opsi download
} from 'react-icons/fi';

import Navbar from '../navbar';

interface Service {
  id: string;
  serviceName: string;
  description: string;
}

/* =========================
   Helpers: NO any typings
   ========================= */

// Firestore Timestamp-like (tanpa impor tipe Firestore)
type FirestoreTimestampLike = {
  seconds: number;
  nanoseconds: number;
  toDate?: () => Date;
};

type DateInput = string | number | Date | FirestoreTimestampLike | null | undefined;

function toDateSafe(value: DateInput): Date | null {
  if (value == null) return null;

  // Firestore Timestamp-like
  if (typeof value === 'object' && 'seconds' in value) {
    const ts = value as FirestoreTimestampLike;
    if (typeof ts.toDate === 'function') return ts.toDate();
    return new Date(ts.seconds * 1000);
  }

  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  if (typeof value === 'number' || typeof value === 'string') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

function formatDateTime(input: DateInput) {
  const d = toDateSafe(input);
  return d ? d.toLocaleString() : '-';
}

const statusStyles: Record<
  string,
  { badge: string; dot: string; icon: JSX.Element; label: string }
> = {
  pending: {
    badge:
      'bg-amber-100 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-400/30',
    dot: 'bg-amber-500',
    icon: <FiAlertCircle className="inline -mt-0.5" />,
    label: 'Pending',
  },
  acc: {
    badge:
      'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-400/30',
    dot: 'bg-emerald-500',
    icon: <FiCheckCircle className="inline -mt-0.5" />,
    label: 'Disetujui',
  },
  decline: {
    badge:
      'bg-rose-100 text-rose-800 ring-1 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:ring-rose-400/30',
    dot: 'bg-rose-500',
    icon: <FiAlertCircle className="inline -mt-0.5" />,
    label: 'Ditolak',
  },
};

const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm ${className}`} />
);

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Task[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Premium UX states (tidak mengubah logic)
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const querySnapshot = await getDocs(collection(db, 'services'));
        const servicesData = querySnapshot.docs.map((docu) => ({
          id: docu.id,
          ...docu.data(),
        })) as Service[];
        setServices(servicesData);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const handleViewTask = async (task: Task) => {
    const taskRef = doc(db, 'tugasdariuser', task.id);
    const taskSnap = await getDoc(taskRef);

    if (taskSnap.exists()) {
      const data = taskSnap.data() as Partial<Task> & { progress?: number; fileTugasAkhir?: string };
      setProgressPercentage(typeof data.progress === 'number' ? data.progress : 0);
      setSelectedTask({ ...task, fileTugasAkhir: data.fileTugasAkhir });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // Belum login. Tidak bisa ambil tugas.
        setLoadingTasks(false);
        return;
      }

      const unsubSnapshot = onSnapshot(collection(db, 'tugasdariuser'), (snapshot) => {
        const tasks = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Task[];

        setNotifications(tasks);
        setLoadingTasks(false);
      });

      // mengikuti struktur aslinya—cleanup snapshot ada di dalam callback
      return () => unsubSnapshot();
    });

    return () => unsubscribe();
  }, []);

  // ======== UI Premium Start ========
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-[#0b0f1a] dark:via-[#0e1322] dark:to-[#121936]">
      {/* Background Ornaments */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-400/25 blur-3xl dark:bg-indigo-600/20" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/25 blur-3xl dark:bg-emerald-600/20" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/20" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-32">
        {/* Header / Hero */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-white/70 px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-indigo-200">
            <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
            Services & Task Center
          </div>

          <h1 className="mt-4 bg-gradient-to-br from-slate-900 to-indigo-700 bg-clip-text text-3xl font-extrabold leading-tight text-transparent md:text-4xl dark:from-white dark:to-indigo-200">
            Jelajahi Layanan <span className="text-indigo-500 dark:text-indigo-300">dan</span> Pantau Progres Tugas
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base dark:text-slate-300/80">
            Temukan layanan yang tersedia dan cek notifikasi pengerjaan tugas dari worker Anda—semua dalam satu tempat.
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45 }}
          className="mb-8 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Layanan Tersedia</span>
              <span className="ml-2 rounded-full bg-indigo-600/10 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-200">
                {loadingServices ? '…' : services.length}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Notifikasi Tugas</span>
              <span className="ml-2 rounded-full bg-emerald-600/10 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
                {loadingTasks ? '…' : notifications.length}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:scale-[1.02] hover:shadow-indigo-600/30 active:scale-[0.99]"
          >
            {showNotifications ? (
              <>
                <FiBellOff className="text-base" />
                Sembunyikan Notifikasi
              </>
            ) : (
              <>
                <FiBell className="text-base" />
                Tampilkan Notifikasi Tugas
              </>
            )}
          </button>
        </motion.div>

        {/* Services Section */}
        <section aria-labelledby="services-heading" className="mb-12">
          <h2 id="services-heading" className="sr-only">
            Available Services
          </h2>

          {loadingServices ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28 md:col-span-2" />
            </div>
          ) : (
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.06, duration: 0.35, ease: 'easeOut' },
                },
              }}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              {services.map((service) => (
                <motion.li
                  key={service.id}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:shadow-xl dark:border-white/10 dark:bg-white/5"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20" />
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200">
                      <FiFileText />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">
                        {service.serviceName}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300/80">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </section>

        {/* Notifications Section */}
        {showNotifications && (
          <section aria-labelledby="notif-heading" className="mt-10">
            <h2
              id="notif-heading"
              className="mb-4 bg-gradient-to-r from-slate-900 to-indigo-700 bg-clip-text text-2xl font-extrabold text-transparent dark:from-white dark:to-indigo-200"
            >
              Notifikasi Pengerjaan
            </h2>

            {loadingTasks ? (
              <div className="space-y-3">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {notifications.map((task) => {
                  const statusKey = String(task.status || 'pending').toLowerCase();
                  const style = statusStyles[statusKey] || statusStyles['pending'];

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      onClick={() => handleViewTask(task)}
                      className="group cursor-pointer rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm ring-1 ring-transparent backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl hover:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/25">
                            <FiBell className="text-lg" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                              Tugas Worker Anda
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300/80">
                              <span className="inline-flex items-center gap-1">
                                <FiClock />
                                {formatDateTime(task.deadline as DateInput)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${style.badge}`}>
                          <span className={`inline-block h-1.5 w-1.5 rounded-full ${style.dot}`} />
                          {style.icon}
                          {style.label}
                        </span>
                      </div>

                      <div className="mt-3 text-sm text-slate-600 dark:text-slate-300/80">
                        Klik untuk melihat progres dan status file tugas akhir (tanpa unduhan).
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-slate-200/70 bg-white/60 px-4 py-6 text-center text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300/80">
                Tidak ada tugas baru.
              </p>
            )}

            {/* Progress & File */}
            {selectedTask && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8 rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Progres Tugas: {progressPercentage.toFixed(1)}%
                  </h3>

                  {/* ⛔️ Tidak ada link/unduhan. Hanya indikator teks bila file tersedia */}
                  {selectedTask?.fileTugasAkhir ? (
                    <div className="inline-flex items-center gap-2 rounded-xl border border-indigo-200/60 bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-indigo-200">
                      <FiFileText />
                      File Tugas Akhir tersedia — unduhan dinonaktifkan
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                      <FiFileText />
                      Belum ada file tugas akhir
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10">
                    <div
                      className="h-full w-0 rounded-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-violet-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
                    />
                    <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,.7)_50%,rgba(255,255,255,0)_100%)] [background-size:200%_100%] [animation:shimmer_2.2s_infinite]"></div>
                  </div>
                  <style jsx>{`
                    @keyframes shimmer {
                      0% {
                        background-position: 200% 0;
                      }
                      100% {
                        background-position: -200% 0;
                      }
                    }
                  `}</style>
                </div>
              </motion.div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
