// 'use client';

// import { useEffect, useState } from 'react';
// import { db, auth } from '@/lib/firebaseConfig';
// import Breadcrumbs from '@/components/Breadcrumbs';

// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   updateDoc,
//   doc
// } from 'firebase/firestore';
// import { onAuthStateChanged } from 'firebase/auth';

// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import NavbarWorker from '@/app/navbarworker'; // Sesuaikan path sesuai struktur proyek Anda

// type Task = {
//   id: string;
//   workerName: string;
//   nominal: number;
//   progress: number;
//   statusPembayaran: string;
//   statusProgress: string;
//   workerId?: string;
// };

// export default function WorkerServicesPage() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = () => {};
//     const fetchData = async () => {
//       onAuthStateChanged(auth, async (user) => {
//         if (!user) return;

//         // Ambil tugas yang statusPembayaran: "success" dan milik worker yang login
//         const q = query(
//           collection(db, 'tugasdariuser'),
//           where('workerId', '==', user.uid),
//           where('statusPembayaran', '==', 'success')
//         );

//         const snapshot = await getDocs(q);
//         const data = snapshot.docs.map((doc) => {
//           const docData = doc.data();
//           return {
//             id: doc.id,
//             workerName: docData.workerName ?? '',
//             nominal: docData.nominal ?? 0,
//             progress: docData.progress ?? 0,
//             statusPembayaran: docData.statusPembayaran ?? '',
//             statusProgress: docData.statusProgress ?? '',
//             workerId: docData.workerId ?? '',
//           } as Task;
//         });

//         setTasks(data);
//         setLoading(false);
//       });
//     };

//     fetchData();
//     return () => unsubscribe();
//   }, []);




// const handleUploadFinalFile = async (taskId: string, file: File) => {
//   try {
//     const storage = getStorage();
//     const fileRef = ref(storage, `finalTasks/${taskId}/${file.name}`);
//     await uploadBytes(fileRef, file);

//     const downloadURL = await getDownloadURL(fileRef);

//     // Simpan URL ke Firestore
//     await updateDoc(doc(db, 'tugasdariuser', taskId), {
//       fileTugasAkhir: downloadURL,
//     });

//     alert('Berhasil upload file tugas akhir!');
//   } catch (err) {
//     console.error('Upload error:', err);
//     alert('Gagal upload file');
//   }
// };


//   return (
//     <main role="main" className="p-6">
//     <NavbarWorker />

//     <Breadcrumbs
//       items={[
//         { name: 'Home', href: '/' },
//         { name: 'Dashboard Worker', href: '/dashboard-worker' },
//         // Kalau halaman ini berada di sub-route (mis. /dashboard-worker/services), aktifkan baris di bawah:
//         // { name: 'Layanan Sukses Dibayar', href: '/dashboard-worker/services' },
//       ]}
//     />

//     {/* Teks aksesibilitas membantu snippet mesin telusur & screen reader */}
//     <p className="sr-only">
//       Halaman privat untuk worker melihat layanan yang sudah dibayar, mengunggah file tugas akhir,
//       dan memperbarui status progres tugas.
//     </p>

//     <div className="p-6">
//         {/* <NavbarWorker/> */}
//       <h1 className="text-2xl font-bold mb-4">Layanan Sukses Dibayar</h1>

//       {loading ? (
//         <p>Loading...</p>
//       ) : tasks.length === 0 ? (
//         <p>Belum ada layanan yang berhasil dibayar.</p>
//       ) : (
//         <ul className="space-y-4">
//           {tasks.map((task, idx) => (
//             <li
//               key={idx}
//               className="p-4 border rounded shadow bg-white hover:bg-gray-50 transition"
//             >
//               <p className="font-semibold text-lg">Tugas: {task.workerName}</p>
//               <p>Nominal: <strong>Rp {task.nominal.toLocaleString()}</strong></p>
//               <p>Progress: {task.progress}%</p>
//               <p>Status: ✅ {task.statusPembayaran}</p>
//               <p>Status Task: {task.statusProgress}</p>
//               <input
//   type="file"
//   accept=".pdf,.docx"
//   onChange={(e) => {
//     const file = e.target.files?.[0];
//     if (file) handleUploadFinalFile(task.id, file);
//   }}
//   className="mt-2"
// />

//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//       </main>


//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebaseConfig';
import Breadcrumbs from '@/components/Breadcrumbs';

import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import NavbarWorker from '@/app/navbarworker'; // Sesuaikan path sesuai struktur proyek Anda

type Task = {
  id: string;
  workerName: string;
  nominal: number;
  progress: number;
  statusPembayaran: string;
  statusProgress: string;
  workerId?: string;
};

export default function WorkerServicesPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = () => {};
    const fetchData = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) return;

        // Ambil tugas yang statusPembayaran: "success" dan milik worker yang login
        const q = query(
          collection(db, 'tugasdariuser'),
          where('workerId', '==', user.uid),
          where('statusPembayaran', '==', 'success')
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            workerName: docData.workerName ?? '',
            nominal: docData.nominal ?? 0,
            progress: docData.progress ?? 0,
            statusPembayaran: docData.statusPembayaran ?? '',
            statusProgress: docData.statusProgress ?? '',
            workerId: docData.workerId ?? '',
          } as Task;
        });

        setTasks(data);
        setLoading(false);
      });
    };

    fetchData();
    return () => unsubscribe();
  }, []);

  const handleUploadFinalFile = async (taskId: string, file: File) => {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, `finalTasks/${taskId}/${file.name}`);
      await uploadBytes(fileRef, file);

      const downloadURL = await getDownloadURL(fileRef);

      // Simpan URL ke Firestore
      await updateDoc(doc(db, 'tugasdariuser', taskId), {
        fileTugasAkhir: downloadURL,
      });

      alert('Berhasil upload file tugas akhir!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Gagal upload file');
    }
  };

  // ====== UI helpers (styling only, no logic changes) ======
  const chipClass = (status: string) => {
    const base =
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset';
    if (status?.toLowerCase() === 'success')
      return `${base} bg-emerald-500/10 text-emerald-300 ring-emerald-400/30`;
    if (status?.toLowerCase() === 'pending')
      return `${base} bg-amber-500/10 text-amber-300 ring-amber-400/30`;
    if (status?.toLowerCase() === 'failed')
      return `${base} bg-rose-500/10 text-rose-300 ring-rose-400/30`;
    return `${base} bg-slate-500/10 text-slate-300 ring-slate-400/30`;
  };

  const progressBarClass = (value: number) => {
    if (value >= 100) return 'bg-emerald-500';
    if (value >= 70) return 'bg-cyan-500';
    if (value >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <main
      role="main"
      className="
        min-h-screen
        bg-[radial-gradient(1200px_600px_at_0%_0%,#0ea5e9_0%,transparent_60%),radial-gradient(1200px_600px_at_100%_0%,#22c55e_0%,transparent_60%),radial-gradient(1000px_500px_at_50%_100%,#8b5cf6_0%,transparent_60%)]
        bg-slate-950 text-slate-100
        relative
        selection:bg-cyan-500/30 selection:text-white
      "
    >
      {/* Decorative gradient lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>

      <NavbarWorker />

      <div className="mx-auto w-full max-w-7xl px-6 pt-6">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Dashboard Worker', href: '/dashboard-worker' },
            // Kalau halaman ini berada di sub-route (mis. /dashboard-worker/services), aktifkan baris di bawah:
            // { name: 'Layanan Sukses Dibayar', href: '/dashboard-worker/services' },
          ]}
        />

        {/* Teks aksesibilitas membantu snippet mesin telusur & screen reader */}
        <p className="sr-only">
          Halaman privat untuk worker melihat layanan yang sudah dibayar, mengunggah file tugas akhir,
          dan memperbarui status progres tugas.
        </p>

        {/* Page header */}
        <header className="mt-6 mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium tracking-wide text-slate-200">
              Secure workspace
            </span>
          </div>

          <h1
            className="
              mt-4 text-2xl sm:text-3xl font-bold leading-tight
              bg-gradient-to-r from-white via-cyan-200 to-emerald-200 bg-clip-text text-transparent
              drop-shadow-[0_1px_0_rgba(255,255,255,0.15)]
            "
          >
            Layanan Sukses Dibayar
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-300/80">
            Kelola tugas yang telah <span className="text-emerald-300">berhasil dibayar</span>,
            unggah file akhir, dan pantau progres dengan tampilan premium.
          </p>
        </header>

        {/* Content card */}
        <section
          className="
            relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6
            shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_10px_40px_-10px_rgba(10,10,10,0.7)]
            backdrop-blur-xl
          "
        >
          {/* subtle glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-emerald-500/0 blur-2xl"
          />

          {loading ? (
            <div className="flex items-center gap-3 text-slate-300">
              <span className="inline-block h-3 w-3 animate-ping rounded-full bg-cyan-400" />
              <span className="text-sm">Loading data…</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-10 text-center">
              <div className="mb-4 h-12 w-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-slate-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M7 7h10M7 12h7M5 21h14a2 2 0 0 0 2-2V7.8a2 2 0 0 0-.59-1.42l-2.79-2.8A2 2 0 0 0 16.2 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-100">Belum ada layanan</h2>
              <p className="mt-1 text-sm text-slate-400">
                Ketika ada pembayaran berhasil, tugas akan muncul di sini.
              </p>
            </div>
          ) : (
            <ul
              className="
                space-y-6
                sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0
                xl:grid-cols-3
              "
            >
              {tasks.map((task, idx) => (
                <li
                  key={idx}
                  className="
                    group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b
                    from-white/[0.06] to-white/[0.03]
                    p-5 backdrop-blur
                    shadow-[0_1px_0_0_rgba(255,255,255,0.05),0_12px_30px_-12px_rgba(0,0,0,0.6)]
                    transition
                    hover:-translate-y-0.5 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08),0_22px_60px_-20px_rgba(0,0,0,0.7)]
                  "
                >
                  {/* Glow on hover */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        'radial-gradient(600px 200px at 50% -10%, rgba(34,211,238,0.15), transparent 70%)'
                    }}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-base text-slate-100">
                      Tugas: <span className="text-slate-200">{task.workerName}</span>
                    </p>
                    <span className={chipClass(task.statusPembayaran)}>
                      {task.statusPembayaran || 'unknown'}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3">
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                      <p className="text-xs text-slate-400">Nominal</p>
                      <p className="text-sm font-semibold tracking-wide text-slate-100">
                        Rp {task.nominal.toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-400">Progress</p>
                        <p className="text-xs font-medium text-slate-300">{task.progress}%</p>
                      </div>
                      <div
                        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10"
                        role="progressbar"
                        aria-valuenow={task.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Progress tugas"
                      >
                        <div
                          className={`h-full ${progressBarClass(task.progress)} transition-all duration-500`}
                          style={{ width: `${Math.min(Math.max(task.progress, 0), 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                      <p className="text-xs text-slate-400">Status Task</p>
                      <p className="text-sm font-medium text-slate-100">
                        {task.statusProgress || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor={`file-${task.id}`}
                      className="mb-1 block text-xs font-semibold tracking-wide text-slate-300"
                    >
                      Upload File Akhir (.pdf / .docx)
                    </label>
                    <input
                      id={`file-${task.id}`}
                      type="file"
                      accept=".pdf,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadFinalFile(task.id, file);
                      }}
                      className="
                        block w-full cursor-pointer
                        text-sm text-slate-300 file:mr-4 file:rounded-xl
                        file:border-0 file:bg-gradient-to-r file:from-cyan-500/90 file:to-emerald-500/90
                        file:px-4 file:py-2 file:font-semibold file:text-white
                        hover:file:brightness-110
                        file:shadow-[0_8px_20px_-8px_rgba(16,185,129,0.5)]
                        rounded-xl border border-white/10 bg-white/[0.04] p-2
                        focus:outline-none focus:ring-2 focus:ring-cyan-400/40
                      "
                    />
                    <p className="mt-2 text-[11px] text-slate-400">
                      Maksimal 20 MB. Pastikan dokumen final sudah diverifikasi sebelum upload.
                    </p>
                  </div>

                  {/* bottom subtle divider */}
                  <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400">
                      Worker ID
                    </span>
                    <span className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-slate-300 ring-1 ring-inset ring-white/10">
                      {task.workerId || '—'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* footer spacing */}
        <div className="h-12" />
      </div>
    </main>
  );
}
