// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @next/next/no-img-element */
// 'use client';

// import { useState, useEffect, ReactNode, useRef } from 'react';
// import Breadcrumbs from '@/components/Breadcrumbs';

// import {
//   getDocs,
//   collection,
//   query,
//   where,
//   onSnapshot,
//   addDoc,
//   orderBy,
//   updateDoc,
//   setDoc,
//   doc,
//   getDoc,
// } from 'firebase/firestore';
// import { db, auth, storage } from '@/lib/firebaseConfig';
// import Swal from 'sweetalert2';

// import NavbarUser from '@/app/navbaruser';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { Task, WorkerProfile } from '@/lib/types';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import { useRouter } from 'next/navigation';

// import { FaStar } from 'react-icons/fa';

// interface Message {
//   type: string;
//   profilePictureUrl: string | undefined;
//   senderRekomendasi: ReactNode;
//   specialRole: ReactNode;
//   rekening: ReactNode;
//   portofolioUrl: string | undefined;
//   description: ReactNode;
//   text: string;
//   sender: string;
//   createdAt: Date;
// }

// export default function UserDashboard() {
//   const [currentQueueNumber, setCurrentQueueNumber] = useState<number | null>(null);
//   const [chatOpen, setChatOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [name, setName] = useState('');

//   const [workerProfiles, setWorkerProfiles] = useState<WorkerProfile[]>([]);
//   const [progressFiles, setProgressFiles] = useState<{ [key: string]: any[] }>({});
//   const [tasks, setTasks] = useState<Task[]>([]);

//   // --- Pakai 'tasks' agar tidak dianggap unused tanpa mengubah UI ---
//   useEffect(() => {
//     void tasks;
//   }, [tasks]);

//   useEffect(() => {
//     const fetchQueueNumber = async () => {
//       try {
//         const user = auth.currentUser;
//         if (user) {
//           const q = query(collection(db, 'queues'), where('name', '==', name || user.email));
//           const querySnapshot = await getDocs(q);

//           if (!querySnapshot.empty) {
//             const queueData = querySnapshot.docs[0].data();
//             setCurrentQueueNumber(queueData.queueNumber);

//             // Listen to chat updates based on queue number
//             const chatQuery = query(
//               collection(db, 'chats'),
//               where('queueNumber', '==', queueData.queueNumber)
//             );
//             const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
//               const chatMessages = snapshot.docs.map((d) => d.data() as Message);
//               setMessages(chatMessages);
//               if (chatMessages.length > 0) setChatOpen(true);
//             });
//             return () => unsubscribe();
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching queue number:', error);
//       }
//     };

//     fetchQueueNumber();
//   }, [name]);

//   // ======= Rating =======
//   const [selectedRatings, setSelectedRatings] = useState<{ [key: string]: number }>({});

//   const handleRating = async (workerId: string, rating: number) => {
//     setSelectedRatings((prev) => ({ ...prev, [workerId]: rating }));

//     await setDoc(doc(db, 'ratings', workerId), {
//       uid: workerId,
//       rating,
//     });
//   };

//   // ======= Progress Files =======
//   useEffect(() => {
//     const fetchProgressFiles = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, 'jawabanWorker'));
//         const tempFiles: { [key: string]: any[] } = {};

//         snapshot.forEach((d) => {
//           const data = d.data();
//           const taskId = data.taskId;

//           if (!tempFiles[taskId]) tempFiles[taskId] = [];
//           tempFiles[taskId].push(data);
//         });

//         setProgressFiles(tempFiles);
//       } catch (err) {
//         console.error('❌ Error fetching progress files:', err);
//       }
//     };

//     fetchProgressFiles();
//   }, []);

//   // ======= Workers =======
//   useEffect(() => {
//     const fetchWorkerProfiles = async () => {
//       const workersQuery = query(collection(db, 'workers'));
//       const querySnapshot = await getDocs(workersQuery);

//       // Pastikan sesuai tipe WorkerProfile (harus memiliki uid dll.)
//       const workers: WorkerProfile[] = querySnapshot.docs.map((d) => {
//         const data = d.data() as Omit<WorkerProfile, 'uid'> | WorkerProfile;
//         // Untuk jaga-jaga: jika data sudah punya uid, pakai itu; jika tidak, pakai doc.id
//         const hasUid = (data as any).uid;
//         const merged: WorkerProfile = {
//           uid: hasUid ? (data as any).uid : d.id,
//           ...(data as any),
//         };
//         return merged;
//       });

//       setWorkerProfiles(workers);
//     };

//     fetchWorkerProfiles();
//   }, []);

//   // ======= Chat =======
//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const user = auth.currentUser;
//     if (!newMessage) return;

//     await addDoc(collection(db, 'chats'), {
//       text: newMessage,
//       sender: user?.email || 'Unknown',
//       queueNumber: currentQueueNumber,
//       timestamp: new Date(),
//     });

//     setNewMessage('');
//   };

//   useEffect(() => {
//     const fetchQueueNumber = async () => {
//       try {
//         const user = auth.currentUser;
//         if (user) {
//           const q = query(collection(db, 'queues'), where('name', '==', name || user.email));
//           const querySnapshot = await getDocs(q);

//           if (!querySnapshot.empty) {
//             const queueData = querySnapshot.docs[0].data();
//             setCurrentQueueNumber(queueData.queueNumber);

//             const chatQuery = query(
//               collection(db, 'chats'),
//               where('queueNumber', '==', queueData.queueNumber),
//               orderBy('timestamp', 'asc')
//             );
//             const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
//               const chatMessages = snapshot.docs.map((d) => d.data() as Message);
//               setMessages(chatMessages);
//               if (chatMessages.length > 0) setChatOpen(true);
//             });
//             return () => unsubscribe();
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching queue number:', error);
//       }
//     };

//     fetchQueueNumber();
//   }, [name]);

//   const handleGetQueueNumber = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await addDoc(collection(db, 'queues'), {
//         name: name || auth.currentUser?.email,
//         createdAt: new Date(),
//         queueNumber: `${Math.floor(Math.random() * 100)}`,
//       });

//       // Fetch ulang
//       const q = query(collection(db, 'queues'), where('name', '==', name));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         const queueData = querySnapshot.docs[0].data();
//         setCurrentQueueNumber(queueData.queueNumber);
//       }
//     } catch (error) {
//       console.error('Error getting queue number:', error);
//     }
//   };

//   const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
//   const [file, setFile] = useState<File | null>(null);
//   const [description, setDescription] = useState('');
//   const [deadline, setDeadline] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChooseWorker = (worker: WorkerProfile) => {
//     setSelectedWorker(worker);
//   };

//   // ======= Notifikasi Tugas (User) =======
//   const [userNotifications, setUserNotifications] = useState<Task[]>([]);

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const q = query(
//       collection(db, 'tugasdariuser'),
//       where('userId', '==', user.uid),
//       where('isRead', '==', false),
//       orderBy('createdAt', 'desc')
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const notifs = snapshot.docs.map((d) => ({
//         id: d.id,
//         ...(d.data() as any),
//       }));
//       setUserNotifications((notifs as unknown) as Task[]);
//     });

//     return () => unsubscribe();
//   }, []);

//   const progressRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

//   useEffect(() => {
//     if (userNotifications.length > 0) {
//       const latest = userNotifications[0] as any;
//       if (latest.status === 'acc') {
//         toast.success('✅ Tugas kamu telah di-ACC oleh worker!');
//       } else if (latest.status === 'decline') {
//         toast.error('❌ Tugas kamu ditolak oleh worker.');
//       }
//     }
//   }, [userNotifications]);

//   // ======= Pembayaran =======
//   const [selectedPaymentTask, setSelectedPaymentTask] = useState<any | null>(null);
//   const [showPaymentPopup, setShowPaymentPopup] = useState(false);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);

//   const router = useRouter();

//   useEffect(() => {
//     if (paymentSuccess) {
//       const t = setTimeout(() => {
//         router.push('/dashboard-user');
//       }, 4000);
//       return () => clearTimeout(t);
//     }
//     return;
//   }, [paymentSuccess, router]);

//   useEffect(() => {
//     const unpaidTask = (userNotifications as any[]).find(
//       (n) =>
//         typeof n.progress === 'number' &&
//         n.progress >= 100 &&
//         n.statusProgress === 'Task Completed' &&
//         n.statusPembayaran !== 'success'
//     );

//     if (unpaidTask) {
//       setSelectedPaymentTask(unpaidTask);
//       setShowPaymentPopup(true);
//     } else {
//       setSelectedPaymentTask(null);
//       setShowPaymentPopup(false);
//     }
//   }, [userNotifications]);

//   useEffect(() => {
//     if (paymentSuccess) {
//       toast.success('🎉 Pembayaran berhasil disimpan!');
//       setPaymentSuccess(false);
//     }
//   }, [paymentSuccess]);

//   const handlePayment = async (
//     taskId: string,
//     nominal: number,
//     amountToWorker: number
//   ): Promise<void> => {
//     try {
//       const orderId = `${taskId}-${Date.now()}`;

//       // Step 1: Simpan transaksi awal ke Firestore
//       await setDoc(doc(db, 'payments', orderId), {
//         taskId,
//         orderId,
//         nominal,
//         fee: nominal * 0.1,
//         totalReceived: amountToWorker,
//         status: 'pending',
//         createdAt: new Date(),
//       });

//       // Step 2: Ambil Snap URL
//       const snapRes = await fetch('/api/midtrans', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ order_id: orderId, gross_amount: nominal }),
//       });

//       const { snapUrl } = await snapRes.json();

//       // Buka tanpa menyimpan variabel agar tidak kena unused-var
//       window.open(snapUrl, '_blank');

//       // Step 3: Polling status pembayaran via Midtrans
//       let retryCount = 0;
//       const interval = setInterval(async () => {
//         const statusRes = await fetch('/api/midtrans-status', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ orderId }),
//         });

//         const { status } = await statusRes.json();

//         if (status === 'settlement' || status === 'capture') {
//           clearInterval(interval);

//           // Simpan status sukses ke Firestore
//           await updateDoc(doc(db, 'payments', orderId), {
//             status: 'success',
//           });

//           // Update status pembayaran di tugas
//           await updateDoc(doc(db, 'tugasdariuser', taskId), {
//             statusPembayaran: 'success',
//           });

//           // Update UI
//           setUserNotifications((prev) =>
//             (prev as any[]).map((n: any) =>
//               n.id === taskId ? { ...n, statusPembayaran: 'success' } : n
//             ) as Task[]
//           );
//           setShowPaymentPopup(false);
//           setSelectedPaymentTask(null);
//           setPaymentSuccess(true);
//         }

//         retryCount++;
//         if (retryCount > 10) clearInterval(interval);
//       }, 3000);
//     } catch (error) {
//       console.error('Gagal memproses pembayaran:', error);
//       alert('Terjadi kesalahan saat memproses pembayaran.');
//     }
//   };

//   const handleSelectTaskForPayment = (task: any) => {
//     if (task.statusPembayaran === 'success') {
//       setShowPaymentPopup(false);
//       return;
//     }
//     setSelectedPaymentTask(task);
//     setShowPaymentPopup(true);
//   };

//   // 2. Fetch Data Notifikasi (semua, bukan hanya unread)
//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const q = query(
//       collection(db, 'tugasdariuser'),
//       where('userId', '==', user.uid),
//       orderBy('createdAt', 'desc')
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const notifs = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
//       setUserNotifications((notifs as unknown) as Task[]);
//     });

//     return () => unsubscribe();
//   }, []);

//   // 🔁 Fetch data tugas
//   const getTugas = async () => {
//     const querySnapshot = await getDocs(collection(db, 'tugasdariuser'));
//     const tugasData = querySnapshot.docs.map((d) => ({
//       id: d.id,
//       ...(d.data() as any),
//     }));
//     setTasks((tugasData as unknown) as Task[]);
//   };

//   useEffect(() => {
//     getTugas();
//   }, []);

//   // 🔁 Refresh data setelah sukses bayar
//   useEffect(() => {
//     if (paymentSuccess) {
//       getTugas();
//       setPaymentSuccess(false);
//     }
//   }, [paymentSuccess]);

//   // 3. Handle Click Notif + Scroll
//   const handleClickNotif = async (notifId: string) => {
//     const notifRef = doc(db, 'tugasdariuser', notifId);

//     try {
//       const notifSnap = await getDoc(notifRef);
//       if (!notifSnap.exists()) return;

//       const notifData: any = notifSnap.data();
//       await updateDoc(notifRef, { isRead: true });

//       if (notifData.status === 'acc') {
//         Swal.fire({
//           icon: 'success',
//           title: 'Tugas Diterima!',
//           text: 'Tugas kamu telah di-ACC oleh worker.',
//           timer: 3000,
//           showConfirmButton: false,
//         });
//       } else if (notifData.status === 'decline') {
//         Swal.fire({
//           icon: 'error',
//           title: 'Tugas Ditolak',
//           text: notifData.declineReason ? `Alasan: ${notifData.declineReason}` : 'Tugas kamu ditolak.',
//           timer: 3000,
//           showConfirmButton: false,
//         });
//       } else if (
//         typeof notifData.progress === 'number' &&
//         notifData.progress >= 100 &&
//         notifData.statusProgress === 'Task Completed'
//       ) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Progress Selesai',
//           text: 'Tugas telah selesai 100%.',
//           timer: 3000,
//           showConfirmButton: false,
//         });
//       }

//       const targetRef = progressRefs.current[notifId];
//       if (targetRef) {
//         targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }
//     } catch (err) {
//       console.error(err);
//       Swal.fire({ icon: 'error', title: 'Oops!', text: 'Gagal membaca notifikasi.' });
//     }
//   };

//   // ======= Submit Task =======
//   const handleSubmitTask = async (e: React.ChangeEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!selectedWorker || !file || !description || !deadline) {
//       alert('Harap isi semua field!');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const fileRef = ref(storage, `tugas/${file.name}`);
//       await uploadBytes(fileRef, file);
//       const fileUrl = await getDownloadURL(fileRef);

//       const workerName = selectedWorker.name || (selectedWorker as any).role || 'Unknown Worker';

//       const taskData = {
//         workerId: selectedWorker.uid,
//         workerName,
//         fileName: file.name,
//         fileUrl,
//         description,
//         userId: auth.currentUser?.uid,
//         deadline,
//         status: 'pending',
//         createdAt: new Date(),
//       };

//       await addDoc(collection(db, 'tugasdariuser'), taskData);

//       setSelectedWorker(null);
//       setFile(null);
//       setDescription('');
//       setDeadline('');

//       alert('Tugas berhasil dikirim! Worker akan menerima notifikasi.');
//     } catch (error) {
//       console.error('Error mengirim tugas: ', error);
//       alert('Terjadi kesalahan saat mengirim tugas.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <main role="main" className="container mx-auto p-6 ">
//     <NavbarUser />

//     <Breadcrumbs
//       items={[
//         { name: 'Home', href: '/' },
//         { name: 'Dashboard User', href: '/dashboard-user' },
//       ]}
//     />

//     {/* Teks untuk aksesibilitas & snippet long-click */}
//     <p className="sr-only">
//       Dashboard privat untuk pengguna mengelola antrian, percakapan dengan admin/worker,
//       melihat progres tugas, mengunduh file, serta melakukan pembayaran Midtrans dengan aman.
//     </p>

//     <ToastContainer />
//     <div className="container mx-auto p-6 ">
//       {/* <NavbarUser /> */}
//       <ToastContainer />
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-4xl font-extrabold text-gray-800">Dashboard User</h1>
//       </div>
//       <p className="mb-8 text-lg">Selamat datang, User!</p>
//       {paymentSuccess && (
//         <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-4 rounded shadow-lg z-50 animate-bounce">
//           <p>🎉 Pembayaran berhasil! Terima kasih telah menyelesaikan transaksi.</p>
//           <button
//             onClick={() => setPaymentSuccess(false)}
//             className="ml-4 text-sm underline hover:text-white"
//           >
//             Tutup
//           </button>
//         </div>
//       )}

//       <h1 className="text-xl font-bold">Daftar Tugas</h1>
//       <ul className="mt-4">
//         {userNotifications.map((task: any) => (
//           <li key={task.id} className="mb-4 border p-4 rounded">
//             <p className="font-medium">{String(task.namaTugas || task.description)}</p>
//             <p>Status Pembayaran: {task.statusPembayaran || 'belum bayar'}</p>
//             <button
//               className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
//               onClick={() => handleSelectTaskForPayment(task)}
//               disabled={task.statusPembayaran === 'success'}
//             >
//               {task.statusPembayaran === 'success' ? 'Sudah Dibayar' : 'Bayar Sekarang'}
//             </button>
//           </li>
//         ))}
//       </ul>

//       {userNotifications.some((n: any) => !n.isRead) && (
//         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
//           {userNotifications.filter((n: any) => !n.isRead).length}
//         </span>
//       )}

//       <div className="mt-4 space-y-4">
//         {userNotifications.map((n: any) => {
//           const progressNum =
//             typeof n.progress === 'number' ? n.progress : Number(n.progress ?? 0);
//           const isCompleted = progressNum >= 100 && n.statusProgress === 'Task Completed';
//           if (isCompleted) return null;
//           const files = progressFiles[n.id] || [];

//           return (
//             <div
//               key={n.id}
//               onClick={() => handleClickNotif(n.id)}
//               ref={(el) => {
//                 progressRefs.current[n.id] = el;
//               }}
//               className="p-4 border rounded bg-white shadow hover:bg-gray-50 cursor-pointer transition"
//             >
//               <p className="font-bold text-blue-700">📎 {n.fileName}</p>
//               <p className="text-sm text-gray-700">📝 {String(n.description)}</p>
//               <p className="text-sm text-gray-500">
//                 🕒 Deadline: {new Date(n.deadline).toLocaleString()}
//               </p>
//               <p className="text-sm text-gray-500">
//                 📂{' '}
//                 <a
//                   href={n.fileUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 underline"
//                 >
//                   Download File
//                 </a>
//               </p>
//               <p
//                 className={`text-sm font-semibold ${
//                   n.status === 'acc'
//                     ? 'text-green-600'
//                     : n.status === 'decline'
//                     ? 'text-red-500'
//                     : 'text-gray-600'
//                 }`}
//               >
//                 Status: {n.status}
//               </p>
//               {Number.isFinite(progressNum) && (
//                 <div className="mt-2">
//                   <p className="text-xs text-gray-500">Progress: {progressNum.toFixed(2)}%</p>
//                   <div className="w-full bg-gray-200 rounded-full h-2.5">
//                     <div
//                       className="bg-blue-600 h-2.5 rounded-full"
//                       style={{ width: `${progressNum}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               )}

//               {/* 📂 File progress */}
//               {files.length > 0 && (
//                 <div className="mt-4 bg-gray-50 p-3 rounded border">
//                   <p className="text-sm font-semibold mb-2">📥 File Progress oleh Worker:</p>
//                   <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
//                     {files.map((f, i) => (
//                       <li key={i}>
//                         <a
//                           href={f.fileUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 underline"
//                         >
//                           {f.fileName}
//                         </a>{' '}
//                         <span className="text-gray-400 text-xs">
//                           (
//                           {new Date(
//                             f.uploadedAt?.seconds
//                               ? f.uploadedAt.seconds * 1000
//                               : f.uploadedAt
//                           ).toLocaleString()}
//                           )
//                         </span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {showPaymentPopup &&
//         selectedPaymentTask &&
//         selectedPaymentTask.statusPembayaran !== 'success' && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="relative bg-white p-6 rounded shadow-lg w-full max-w-md">
//               <button
//                 onClick={() => setShowPaymentPopup(false)}
//                 className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg font-bold"
//                 aria-label="Tutup"
//               >
//                 &times;
//               </button>

//               <h2 className="text-xl font-semibold mb-4">Pembayaran Tugas</h2>
//               <p className="mb-2">Tugas: {String(selectedPaymentTask.description)}</p>
//               <p className="mb-2">
//                 Deadline: {new Date(selectedPaymentTask.deadline).toLocaleString()}
//               </p>
//               <p className="mb-2">
//                 Progress:{' '}
//                 {typeof selectedPaymentTask?.progress === 'number'
//                   ? `${selectedPaymentTask.progress.toFixed(2)}%`
//                   : 'Belum ada progress'}
//               </p>

//               {(() => {
//                 const nominal: number = selectedPaymentTask.nominal || 0;
//                 const fee = nominal * 0.1;
//                 const totalDiterima = nominal - fee;

//                 return (
//                   <>
//                     <p className="mb-2">Total Pembayaran: Rp {nominal.toLocaleString()}</p>
//                     <p className="mb-2 text-sm text-gray-600">
//                       Fee Admin (10%): Rp {fee.toLocaleString()}
//                     </p>
//                     <p className="mb-4 font-bold text-green-600">
//                       Total Diterima Worker: Rp {totalDiterima.toLocaleString()}
//                     </p>
//                     <button
//                       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//                       onClick={() =>
//                         handlePayment(selectedPaymentTask.id, nominal, totalDiterima)
//                       }
//                     >
//                       Bayar Sekarang (Midtrans)
//                     </button>
//                   </>
//                 );
//               })()}
//             </div>
//           </div>
//         )}

//       <form onSubmit={handleGetQueueNumber}>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Masukkan Nama Anda"
//           className="w-full p-2 mb-4 border"
//           required
//         />
//         <button type="submit" className="w-full p-2 bg-blue-500 text-white">
//           Dapatkan Nomor Antrian
//         </button>
//       </form>

//       <div className="bg-gray-100 p-4 border rounded mt-4">
//         {currentQueueNumber ? (
//           <p className="text-xl font-semibold">Nomor Antrian Ke: {currentQueueNumber}</p>
//         ) : (
//           <p className="text-lg">Belum ada nomor antrian tersedia.</p>
//         )}
//       </div>

//       {/* Tampilkan Data Worker */}
//       <h3 className="font-bold mt-4 text-gray-800">Data Worker Terkait</h3>
//       {workerProfiles.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {workerProfiles.map((worker) => (
//             <div
//               key={worker.uid}
//               className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
//             >
//               {/* Gambar Profil */}
//               <div className="flex items-center space-x-4">
//                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                 <img
//                   src={worker.profilePictureUrl}
//                   alt="Profile"
//                   className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
//                 />
//                 <div>
//                   <p className="text-xs font-semibold text-gray-700">No Rekening:</p>
//                   <p className="text-xs font-medium text-gray-900">{worker.noRekening}</p>
//                 </div>
//               </div>

//               {/* Informasi Worker */}
//               <div className="mt-3 text-xs">
//                 <p className="text-gray-700">
//                   <span className="font-semibold">Role:</span> {worker.role}
//                 </p>
//                 <p className="text-gray-700">
//                   <span className="font-semibold">Special Role:</span> {worker.specialRole}
//                 </p>
//               </div>

//               {/* Komponen Rating Bintang */}
//               <div className="mt-3 flex items-center space-x-1 text-yellow-400">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <FaStar
//                     key={star}
//                     onClick={() => handleRating(worker.uid, star)}
//                     className={`cursor-pointer ${
//                       selectedRatings[worker.uid] >= star ? 'text-yellow-400' : 'text-gray-300'
//                     }`}
//                   />
//                 ))}
//               </div>

//               {/* Link Portofolio */}
//               <div className="mt-3">
//                 <a
//                   href={worker.portofolioUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 text-xs font-semibold hover:text-blue-800 transition duration-300"
//                 >
//                   📂 Lihat Portofolio
//                 </a>
//               </div>

//               {/* Tombol Choose */}
//               <button
//                 onClick={() => handleChooseWorker(worker)}
//                 className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
//               >
//                 Choose
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-600 text-xs">Belum ada data worker.</p>
//       )}

//       {/* Form Pengiriman Tugas */}
//       {selectedWorker && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md">
//             <h2 className="text-lg font-semibold mb-4">Kirim Tugas ke {selectedWorker.name}</h2>
//             <form onSubmit={handleSubmitTask}>
//               {/* Input File */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Upload File</label>
//                 <input
//                   type="file"
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                     const selectedFile = e.target.files?.[0];
//                     if (selectedFile) {
//                       setFile(selectedFile);
//                     }
//                   }}
//                   className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
//                   required
//                 />
//               </div>

//               {/* Input Deskripsi */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Deskripsi Tugas</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
//                   rows={3}
//                   required
//                 ></textarea>
//               </div>

//               {/* Input Deadline */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Deadline</label>
//                 <input
//                   type="datetime-local"
//                   value={deadline}
//                   onChange={(e) => setDeadline(e.target.value)}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>

//               {/* Tombol Submit */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
//               >
//                 {isLoading ? 'Mengirim...' : 'Kirim Tugas'}
//               </button>

//               {/* Tombol Batal */}
//               <button
//                 type="button"
//                 onClick={() => setSelectedWorker(null)}
//                 className="w-full mt-2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition duration-300"
//               >
//                 Batal
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Chat popup */}
//       {chatOpen && (
//         <div
//           className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 w-full 
//                 max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl 
//                 h-[80vh] md:h-2/3 
//                 max-h-[90vh] md:max-h-[80vh] 
//                 border border-gray-300 flex flex-col 
//                 overflow-y-auto z-50"
//         >
//           <button
//             onClick={() => setChatOpen(false)}
//             className="flex justify-between items-center border-b pb-2 mb-2 text-gray-500 hover:text-red-500"
//           >
//             ✖
//           </button>
//           <h2 className="font-bold">Chat with Admin</h2>
//           <div className="overflow-y-scroll h-3/4 bg-gray-100 p-2">
//             {messages.map((msg, index) => (
//               <div key={index} className="mb-4">
//                 <div className="p-2 bg-blue-100 text-sm rounded-lg">
//                   <p>
//                     <strong>{msg.sender}:</strong> {msg.text}
//                   </p>
//                 </div>

//                 {msg.type === 'rekomendasi' && (
//                   <div className="mt-2 border rounded-lg p-3 bg-gray-50 shadow-sm">
//                     <p className="text-sm font-semibold text-gray-800">
//                       Worker yang Direkomendasikan:
//                     </p>
//                     <div className="flex items-center space-x-3 mt-2">
//                       {/* eslint-disable-next-line @next/next/no-img-element */}
//                       <img
//                         src={msg.profilePictureUrl}
//                         alt="Foto Worker"
//                         className="w-10 h-10 rounded-full border object-cover"
//                       />
//                       <div>
//                         <p className="text-sm">
//                           <strong>Role:</strong> {msg.senderRekomendasi}
//                         </p>
//                         <p className="text-sm">
//                           <strong>Special Role:</strong> {msg.specialRole}
//                         </p>
//                         <a
//                           href={msg.portofolioUrl}
//                           className="text-blue-600 hover:underline text-sm mt-1 inline-block"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           📁 Lihat Portofolio
//                         </a>
//                         <p className="text-xs text-gray-600 mt-2">{msg.description}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {/* Tampilkan Data Worker (di dalam chat) */}
//             <h3 className="font-bold mt-4 text-gray-800">Data Worker Terkait</h3>
//             {workerProfiles.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {workerProfiles.map((worker) => (
//                   <div
//                     key={worker.uid}
//                     className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
//                   >
//                     <div className="flex items-center space-x-4">
//                       {/* eslint-disable-next-line @next/next/no-img-element */}
//                       <img
//                         src={worker.profilePictureUrl}
//                         alt="Profile"
//                         className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
//                       />
//                       <div>
//                         <p className="text-xs font-semibold text-gray-700">No Rekening:</p>
//                         <p className="text-xs font-medium text-gray-900">{worker.noRekening}</p>
//                       </div>
//                     </div>

//                     <div className="mt-3 text-xs">
//                       <p className="text-gray-700">
//                         <span className="font-semibold">Role:</span> {worker.role}
//                       </p>
//                       <p className="text-gray-700">
//                         <span className="font-semibold">Special Role:</span>{' '}
//                         {worker.specialRole}
//                       </p>
//                     </div>

//                     <div className="mt-3">
//                       <a
//                         href={worker.portofolioUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 text-xs font-semibold hover:text-blue-800 transition duration-300"
//                       >
//                         📂 Lihat Portofolio
//                       </a>
//                     </div>

//                     <button
//                       onClick={() => handleChooseWorker(worker)}
//                       className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
//                     >
//                       Choose
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-600 text-xs">Belum ada data worker.</p>
//             )}
//           </div>

//           <form onSubmit={handleSendMessage} className="mt-2 flex">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               className="flex-grow p-2 border"
//               placeholder="Type a message..."
//             />
//             <button type="submit" className="bg-blue-500 text-white p-2">
//               Send
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Form Pengiriman Tugas (duplikat di luar chat, sesuai struktur asli) */}
//       {selectedWorker && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md">
//             <h2 className="text-lg font-semibold mb-4">Kirim Tugas ke {selectedWorker.name}</h2>
//             <form onSubmit={handleSubmitTask}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Upload File</label>
//                 <input
//                   type="file"
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                     const selectedFile = e.target.files?.[0];
//                     if (selectedFile) {
//                       setFile(selectedFile);
//                     }
//                   }}
//                   className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Deskripsi Tugas</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
//                   rows={3}
//                   required
//                 ></textarea>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Deadline</label>
//                 <input
//                   type="datetime-local"
//                   value={deadline}
//                   onChange={(e) => setDeadline(e.target.value)}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
//               >
//                 {isLoading ? 'Mengirim...' : 'Kirim Tugas'}
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setSelectedWorker(null)}
//                 className="w-full mt-2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition duration-300"
//               >
//                 Batal
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//       </main>

//   );
// }
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, ReactNode, useRef } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

import {
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  orderBy,
  updateDoc,
  setDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db, auth, storage } from '@/lib/firebaseConfig';
import Swal from 'sweetalert2';

import NavbarUser from '@/app/navbaruser';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Task, WorkerProfile } from '@/lib/types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '@/components/Footer'; // ⬅️ tambahkan ini (sesuaikan path)

import { useRouter } from 'next/navigation';

import { FaStar } from 'react-icons/fa';

interface Message {
  type: string;
  profilePictureUrl: string | undefined;
  senderRekomendasi: ReactNode;
  specialRole: ReactNode;
  rekening: ReactNode;
  portofolioUrl: string | undefined;
  description: ReactNode;
  text: string;
  sender: string;
  createdAt: Date;
}

export default function UserDashboard() {
  const [currentQueueNumber, setCurrentQueueNumber] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [name, setName] = useState('');

  const [workerProfiles, setWorkerProfiles] = useState<WorkerProfile[]>([]);
  const [progressFiles, setProgressFiles] = useState<{ [key: string]: any[] }>({});
  const [tasks, setTasks] = useState<Task[]>([]);

  // --- Pakai 'tasks' agar tidak dianggap unused tanpa mengubah UI ---
  useEffect(() => {
    void tasks;
  }, [tasks]);

  useEffect(() => {
    const fetchQueueNumber = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(collection(db, 'queues'), where('name', '==', name || user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const queueData = querySnapshot.docs[0].data();
            setCurrentQueueNumber(queueData.queueNumber);

            // Listen to chat updates based on queue number
            const chatQuery = query(
              collection(db, 'chats'),
              where('queueNumber', '==', queueData.queueNumber)
            );
            const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
              const chatMessages = snapshot.docs.map((d) => d.data() as Message);
              setMessages(chatMessages);
              if (chatMessages.length > 0) setChatOpen(true);
            });
            return () => unsubscribe();
          }
        }
      } catch (error) {
        console.error('Error fetching queue number:', error);
      }
    };

    fetchQueueNumber();
  }, [name]);

  // ======= Rating =======
  const [selectedRatings, setSelectedRatings] = useState<{ [key: string]: number }>({});

  const handleRating = async (workerId: string, rating: number) => {
    setSelectedRatings((prev) => ({ ...prev, [workerId]: rating }));

    await setDoc(doc(db, 'ratings', workerId), {
      uid: workerId,
      rating,
    });
  };

  // ======= Progress Files =======
  useEffect(() => {
    const fetchProgressFiles = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'jawabanWorker'));
        const tempFiles: { [key: string]: any[] } = {};

        snapshot.forEach((d) => {
          const data = d.data();
          const taskId = data.taskId;

          if (!tempFiles[taskId]) tempFiles[taskId] = [];
          tempFiles[taskId].push(data);
        });

        setProgressFiles(tempFiles);
      } catch (err) {
        console.error('❌ Error fetching progress files:', err);
      }
    };

    fetchProgressFiles();
  }, []);

  // ======= Workers =======
  useEffect(() => {
    const fetchWorkerProfiles = async () => {
      const workersQuery = query(collection(db, 'workers'));
      const querySnapshot = await getDocs(workersQuery);

      // Pastikan sesuai tipe WorkerProfile (harus memiliki uid dll.)
      const workers: WorkerProfile[] = querySnapshot.docs.map((d) => {
        const data = d.data() as Omit<WorkerProfile, 'uid'> | WorkerProfile;
        // Untuk jaga-jaga: jika data sudah punya uid, pakai itu; jika tidak, pakai doc.id
        const hasUid = (data as any).uid;
        const merged: WorkerProfile = {
          uid: hasUid ? (data as any).uid : d.id,
          ...(data as any),
        };
        return merged;
      });

      setWorkerProfiles(workers);
    };

    fetchWorkerProfiles();
  }, []);

  // ======= Chat =======
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!newMessage) return;

    await addDoc(collection(db, 'chats'), {
      text: newMessage,
      sender: user?.email || 'Unknown',
      queueNumber: currentQueueNumber,
      timestamp: new Date(),
    });

    setNewMessage('');
  };

  useEffect(() => {
    const fetchQueueNumber = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(collection(db, 'queues'), where('name', '==', name || user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const queueData = querySnapshot.docs[0].data();
            setCurrentQueueNumber(queueData.queueNumber);

            const chatQuery = query(
              collection(db, 'chats'),
              where('queueNumber', '==', queueData.queueNumber),
              orderBy('timestamp', 'asc')
            );
            const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
              const chatMessages = snapshot.docs.map((d) => d.data() as Message);
              setMessages(chatMessages);
              if (chatMessages.length > 0) setChatOpen(true);
            });
            return () => unsubscribe();
          }
        }
      } catch (error) {
        console.error('Error fetching queue number:', error);
      }
    };

    fetchQueueNumber();
  }, [name]);

  const handleGetQueueNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'queues'), {
        name: name || auth.currentUser?.email,
        createdAt: new Date(),
        queueNumber: `${Math.floor(Math.random() * 100)}`,
      });

      // Fetch ulang
      const q = query(collection(db, 'queues'), where('name', '==', name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const queueData = querySnapshot.docs[0].data();
        setCurrentQueueNumber(queueData.queueNumber);
      }
    } catch (error) {
      console.error('Error getting queue number:', error);
    }
  };

  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChooseWorker = (worker: WorkerProfile) => {
    setSelectedWorker(worker);
  };

  // ======= Notifikasi Tugas (User) =======
  const [userNotifications, setUserNotifications] = useState<Task[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'tugasdariuser'),
      where('userId', '==', user.uid),
      where('isRead', '==', false),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setUserNotifications((notifs as unknown) as Task[]);
    });

    return () => unsubscribe();
  }, []);

  const progressRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (userNotifications.length > 0) {
      const latest = userNotifications[0] as any;
      if (latest.status === 'acc') {
        toast.success('✅ Tugas kamu telah di-ACC oleh worker!');
      } else if (latest.status === 'decline') {
        toast.error('❌ Tugas kamu ditolak oleh worker.');
      }
    }
  }, [userNotifications]);

  // ======= Pembayaran =======
  const [selectedPaymentTask, setSelectedPaymentTask] = useState<any | null>(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (paymentSuccess) {
      const t = setTimeout(() => {
        router.push('/dashboard-user');
      }, 4000);
      return () => clearTimeout(t);
    }
    return;
  }, [paymentSuccess, router]);

  useEffect(() => {
    const unpaidTask = (userNotifications as any[]).find(
      (n) =>
        typeof n.progress === 'number' &&
        n.progress >= 100 &&
        n.statusProgress === 'Task Completed' &&
        n.statusPembayaran !== 'success'
    );

    if (unpaidTask) {
      setSelectedPaymentTask(unpaidTask);
      setShowPaymentPopup(true);
    } else {
      setSelectedPaymentTask(null);
      setShowPaymentPopup(false);
    }
  }, [userNotifications]);

  useEffect(() => {
    if (paymentSuccess) {
      toast.success('🎉 Pembayaran berhasil disimpan!');
      setPaymentSuccess(false);
    }
  }, [paymentSuccess]);

  const handlePayment = async (
    taskId: string,
    nominal: number,
    amountToWorker: number
  ): Promise<void> => {
    try {
      const orderId = `${taskId}-${Date.now()}`;

      // Step 1: Simpan transaksi awal ke Firestore
      await setDoc(doc(db, 'payments', orderId), {
        taskId,
        orderId,
        nominal,
        fee: nominal * 0.1,
        totalReceived: amountToWorker,
        status: 'pending',
        createdAt: new Date(),
      });

      // Step 2: Ambil Snap URL
      const snapRes = await fetch('/api/midtrans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, gross_amount: nominal }),
      });

      const { snapUrl } = await snapRes.json();

      // Buka tanpa menyimpan variabel agar tidak kena unused-var
      window.open(snapUrl, '_blank');

      // Step 3: Polling status pembayaran via Midtrans
      let retryCount = 0;
      const interval = setInterval(async () => {
        const statusRes = await fetch('/api/midtrans-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });

        const { status } = await statusRes.json();

        if (status === 'settlement' || status === 'capture') {
          clearInterval(interval);

          // Simpan status sukses ke Firestore
          await updateDoc(doc(db, 'payments', orderId), {
            status: 'success',
          });

          // Update status pembayaran di tugas
          await updateDoc(doc(db, 'tugasdariuser', taskId), {
            statusPembayaran: 'success',
          });

          // Update UI
          setUserNotifications((prev) =>
            (prev as any[]).map((n: any) =>
              n.id === taskId ? { ...n, statusPembayaran: 'success' } : n
            ) as Task[]
          );
          setShowPaymentPopup(false);
          setSelectedPaymentTask(null);
          setPaymentSuccess(true);
        }

        retryCount++;
        if (retryCount > 10) clearInterval(interval);
      }, 3000);
    } catch (error) {
      console.error('Gagal memproses pembayaran:', error);
      alert('Terjadi kesalahan saat memproses pembayaran.');
    }
  };

  const handleSelectTaskForPayment = (task: any) => {
    if (task.statusPembayaran === 'success') {
      setShowPaymentPopup(false);
      return;
    }
    setSelectedPaymentTask(task);
    setShowPaymentPopup(true);
  };

  // 2. Fetch Data Notifikasi (semua, bukan hanya unread)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'tugasdariuser'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setUserNotifications((notifs as unknown) as Task[]);
    });

    return () => unsubscribe();
  }, []);

  // 🔁 Fetch data tugas
  const getTugas = async () => {
    const querySnapshot = await getDocs(collection(db, 'tugasdariuser'));
    const tugasData = querySnapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    setTasks((tugasData as unknown) as Task[]);
  };

  useEffect(() => {
    getTugas();
  }, []);

  // 🔁 Refresh data setelah sukses bayar
  useEffect(() => {
    if (paymentSuccess) {
      getTugas();
      setPaymentSuccess(false);
    }
  }, [paymentSuccess]);

  // 3. Handle Click Notif + Scroll
  const handleClickNotif = async (notifId: string) => {
    const notifRef = doc(db, 'tugasdariuser', notifId);

    try {
      const notifSnap = await getDoc(notifRef);
      if (!notifSnap.exists()) return;

      const notifData: any = notifSnap.data();
      await updateDoc(notifRef, { isRead: true });

      if (notifData.status === 'acc') {
        Swal.fire({
          icon: 'success',
          title: 'Tugas Diterima!',
          text: 'Tugas kamu telah di-ACC oleh worker.',
          timer: 3000,
          showConfirmButton: false,
        });
      } else if (notifData.status === 'decline') {
        Swal.fire({
          icon: 'error',
          title: 'Tugas Ditolak',
          text: notifData.declineReason ? `Alasan: ${notifData.declineReason}` : 'Tugas kamu ditolak.',
          timer: 3000,
          showConfirmButton: false,
        });
      } else if (
        typeof notifData.progress === 'number' &&
        notifData.progress >= 100 &&
        notifData.statusProgress === 'Task Completed'
      ) {
        Swal.fire({
          icon: 'success',
          title: 'Progress Selesai',
          text: 'Tugas telah selesai 100%.',
          timer: 3000,
          showConfirmButton: false,
        });
      }

      const targetRef = progressRefs.current[notifId];
      if (targetRef) {
        targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Oops!', text: 'Gagal membaca notifikasi.' });
    }
  };

  // ======= Submit Task =======
  const handleSubmitTask = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedWorker || !file || !description || !deadline) {
      alert('Harap isi semua field!');
      return;
    }

    setIsLoading(true);

    try {
      const fileRef = ref(storage, `tugas/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      const workerName = selectedWorker.name || (selectedWorker as any).role || 'Unknown Worker';

      const taskData = {
        workerId: selectedWorker.uid,
        workerName,
        fileName: file.name,
        fileUrl,
        description,
        userId: auth.currentUser?.uid,
        deadline,
        status: 'pending',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'tugasdariuser'), taskData);

      setSelectedWorker(null);
      setFile(null);
      setDescription('');
      setDeadline('');

      alert('Tugas berhasil dikirim! Worker akan menerima notifikasi.');
    } catch (error) {
      console.error('Error mengirim tugas: ', error);
      alert('Terjadi kesalahan saat mengirim tugas.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <main
    //   role="main"
    //   className="min-h-svh relative overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    // >
    <div className="min-h-svh flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <main role="main" className="relative flex-1 overflow-x-hidden">
      {/* Decorative premium layers */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-1/3 -left-1/3 h-[80vmax] w-[80vmax] rounded-full bg-gradient-to-tr from-blue-500 via-cyan-400 to-indigo-500 blur-3xl" />
        <div className="absolute -bottom-1/3 -right-1/3 h-[70vmax] w-[70vmax] rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-400 to-amber-300 blur-3xl" />
      </div>

      <div className="relative flex-1 overflow-x-hidden">
        <NavbarUser />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="mb-4">
            <Breadcrumbs
              items={[
                { name: 'Halaman Utama', href: '/' },
                { name: 'Dashboard User', href: '/dashboard-user' },
              ]}
            />
          </div>

          {/* Shell / card utama */}
          <section className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_10px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 px-4 sm:px-6 lg:px-10 py-8">
            {/* Teks untuk aksesibilitas & snippet long-click */}
            <p className="sr-only">
              Dashboard privat untuk pengguna mengelola antrian, percakapan dengan admin/worker,
              melihat progres tugas, mengunduh file, serta melakukan pembayaran Midtrans dengan aman.
            </p>

            <ToastContainer />

            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-sky-300 via-cyan-200 to-white bg-clip-text text-transparent drop-shadow">
                  Dashboard User
                </h1>
                <p className="mt-1 text-slate-200/80 text-base">
                  Selamat datang, <span className="font-semibold">User</span>!
                </p>
              </div>

              {/* Status bayar sukses toast lokal */}
              {paymentSuccess && (
                <div className="bg-emerald-500/90 text-white px-5 py-3 rounded-2xl shadow-lg shadow-emerald-900/30 ring-1 ring-white/10 animate-bounce">
                  🎉 Pembayaran berhasil! Terima kasih.
                </div>
              )}
            </div>

            {/* Daftar Tugas */}
            <div className="rounded-2xl bg-white/70 backdrop-blur-md ring-1 ring-slate-200/60 shadow-xl p-5">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
                Daftar Tugas
              </h2>
              <ul className="mt-4 grid gap-4">
                {userNotifications.map((task: any) => (
                  <li
                    key={task.id}
                    className="group rounded-xl border border-slate-200/70 bg-white/90 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="p-4">
                      <p className="font-semibold text-slate-800">
                        {String(task.namaTugas || task.description)}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Status Pembayaran:{' '}
                        <span
                          className={
                            task.statusPembayaran === 'success'
                              ? 'text-emerald-600 font-semibold'
                              : 'text-amber-600 font-semibold'
                          }
                        >
                          {task.statusPembayaran || 'belum bayar'}
                        </span>
                      </p>
                      <button
                        className={`mt-3 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-white/0 ${
                          task.statusPembayaran === 'success'
                            ? 'bg-emerald-500 cursor-not-allowed opacity-80'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-950/20'
                        }`}
                        onClick={() => handleSelectTaskForPayment(task)}
                        disabled={task.statusPembayaran === 'success'}
                      >
                        {task.statusPembayaran === 'success' ? 'Sudah Dibayar' : 'Bayar Sekarang'}
                      </button>
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200/80 to-transparent" />
                  </li>
                ))}
              </ul>

              {userNotifications.some((n: any) => !n.isRead) && (
                <span className="relative inline-flex items-center mt-4">
                  <span className="absolute inline-flex h-5 w-5 rounded-full bg-red-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold items-center justify-center">
                    {userNotifications.filter((n: any) => !n.isRead).length}
                  </span>
                </span>
              )}
            </div>

            {/* Kartu Notifikasi/Progress */}
            <div className="mt-6 grid gap-4">
              {userNotifications.map((n: any) => {
                const progressNum =
                  typeof n.progress === 'number' ? n.progress : Number(n.progress ?? 0);
                const isCompleted = progressNum >= 100 && n.statusProgress === 'Task Completed';
                if (isCompleted) return null;
                const files = progressFiles[n.id] || [];

                return (
                  <div
                    key={n.id}
                    onClick={() => handleClickNotif(n.id)}
                    ref={(el) => {
                      progressRefs.current[n.id] = el;
                    }}
                    className="cursor-pointer rounded-2xl border border-white/10 bg-white/40 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="p-5">
                      <p className="font-bold text-blue-700">📎 {n.fileName}</p>
                      <p className="text-sm text-slate-700">📝 {String(n.description)}</p>
                      <p className="text-sm text-slate-600">
                        🕒 Deadline:{' '}
                        <span className="font-medium">
                          {new Date(n.deadline).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-sm text-slate-600">
                        📂{' '}
                        <a
                          href={n.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline decoration-blue-400 underline-offset-4 hover:text-blue-700"
                        >
                          Download File
                        </a>
                      </p>
                      <p
                        className={`mt-1 text-sm font-semibold ${
                          n.status === 'acc'
                            ? 'text-green-600'
                            : n.status === 'decline'
                            ? 'text-red-500'
                            : 'text-slate-700'
                        }`}
                      >
                        Status: {n.status}
                      </p>

                      {Number.isFinite(progressNum) && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-slate-600">Progress:</p>
                            <p className="text-xs font-semibold text-slate-700">
                              {progressNum.toFixed(2)}%
                            </p>
                          </div>
                          <div className="w-full bg-slate-200/70 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-[width] duration-500 ease-out"
                              style={{ width: `${progressNum}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* 📂 File progress */}
                      {files.length > 0 && (
                        <div className="mt-4 bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-slate-200/70">
                          <p className="text-sm font-semibold mb-2 text-slate-800">
                            📥 File Progress oleh Worker:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            {files.map((f, i) => (
                              <li key={i}>
                                <a
                                  href={f.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-700 underline underline-offset-4"
                                >
                                  {f.fileName}
                                </a>{' '}
                                <span className="text-slate-400 text-xs">
                                  (
                                  {new Date(
                                    f.uploadedAt?.seconds
                                      ? f.uploadedAt.seconds * 1000
                                      : f.uploadedAt
                                  ).toLocaleString()}
                                  )
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment Popup */}
            {showPaymentPopup &&
              selectedPaymentTask &&
              selectedPaymentTask.statusPembayaran !== 'success' && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex justify-center items-center z-50">
                  <div className="relative bg-white/90 backdrop-blur-xl p-6 rounded-3xl w-full max-w-md shadow-2xl ring-1 ring-slate-200/60">
                    <button
                      onClick={() => setShowPaymentPopup(false)}
                      className="absolute top-3 right-3 text-slate-500 hover:text-red-500 text-lg font-bold rounded-full h-8 w-8 flex items-center justify-center hover:bg-slate-100 transition"
                      aria-label="Tutup"
                    >
                      &times;
                    </button>

                    <h2 className="text-xl font-extrabold text-slate-900 mb-4">
                      Pembayaran Tugas
                    </h2>
                    <p className="mb-1 text-slate-800">
                      Tugas:{' '}
                      <span className="font-semibold">
                        {String(selectedPaymentTask.description)}
                      </span>
                    </p>
                    <p className="mb-1 text-slate-700">
                      Deadline:{' '}
                      <span className="font-medium">
                        {new Date(selectedPaymentTask.deadline).toLocaleString()}
                      </span>
                    </p>
                    <p className="mb-3 text-slate-700">
                      Progress:{' '}
                      {typeof selectedPaymentTask?.progress === 'number'
                        ? `${selectedPaymentTask.progress.toFixed(2)}%`
                        : 'Belum ada progress'}
                    </p>

                    {(() => {
                      const nominal: number = selectedPaymentTask.nominal || 0;
                      const fee = nominal * 0.1;
                      const totalDiterima = nominal - fee;

                      return (
                        <>
                          <div className="rounded-xl bg-white border border-slate-200 p-4 mb-4">
                            <p className="mb-1 text-slate-800">
                              Total Pembayaran:{' '}
                              <span className="font-bold text-slate-900">
                                Rp {nominal.toLocaleString()}
                              </span>
                            </p>
                            <p className="mb-1 text-sm text-slate-600">
                              Fee Admin (10%): Rp {fee.toLocaleString()}
                            </p>
                            <p className="text-lg font-extrabold text-emerald-600">
                              Total Diterima Worker: Rp {totalDiterima.toLocaleString()}
                            </p>
                          </div>
                          <button
                            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 shadow-lg shadow-blue-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                            onClick={() =>
                              handlePayment(selectedPaymentTask.id, nominal, totalDiterima)
                            }
                          >
                            Bayar Sekarang (Midtrans)
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

            {/* Form Ambil Nomor Antrian */}
            <form
              onSubmit={handleGetQueueNumber}
              className="mt-8 rounded-2xl border border-white/10 bg-white/40 backdrop-blur-md p-5 shadow-xl"
            >
              <label className="block text-slate-900 font-semibold mb-2">
                Masukkan Nama Anda
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan Nama Anda"
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition bg-white"
                required
              />
              <button
                type="submit"
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold py-2.5 shadow-lg shadow-cyan-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
              >
                Dapatkan Nomor Antrian
              </button>
            </form>

            <div className="bg-white/80 backdrop-blur-md p-5 border border-slate-200/70 rounded-2xl mt-4 shadow-xl">
              {currentQueueNumber ? (
                <p className="text-xl font-semibold text-slate-900">
                  Nomor Antrian Ke:{' '}
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-slate-900 text-white">
                    {currentQueueNumber}
                  </span>
                </p>
              ) : (
                <p className="text-lg text-slate-700">Belum ada nomor antrian tersedia.</p>
              )}
            </div>

            {/* Tampilkan Data Worker */}
            <div className="mt-8">
              <h3 className="font-bold text-lg text-slate-100 mb-3">Data Worker Terkait</h3>
              {workerProfiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {workerProfiles.map((worker) => (
                    <div
                      key={worker.uid}
                      className="group bg-white/80 backdrop-blur-md border border-slate-200/70 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
                    >
                      {/* Gambar Profil */}
                      <div className="flex items-center space-x-4">
                        <img
                          src={worker.profilePictureUrl}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-700">No Rekening:</p>
                          <p className="text-xs font-medium text-slate-900">{worker.noRekening}</p>
                        </div>
                      </div>

                      {/* Informasi Worker */}
                      <div className="mt-3 text-xs">
                        <p className="text-slate-700">
                          <span className="font-semibold">Role:</span> {worker.role}
                        </p>
                        <p className="text-slate-700">
                          <span className="font-semibold">Special Role:</span> {worker.specialRole}
                        </p>
                      </div>

                      {/* Komponen Rating Bintang */}
                      <div className="mt-3 flex items-center space-x-1 text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            onClick={() => handleRating(worker.uid, star)}
                            className={`cursor-pointer transition ${
                              selectedRatings[worker.uid] >= star
                                ? 'text-yellow-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Link Portofolio */}
                      <div className="mt-3">
                        <a
                          href={worker.portofolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 text-xs font-semibold hover:text-blue-900 transition duration-300 underline underline-offset-4"
                        >
                          📂 Lihat Portofolio
                        </a>
                      </div>

                      {/* Tombol Choose */}
                      <button
                        onClick={() => handleChooseWorker(worker)}
                        className="mt-3 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2 shadow-md shadow-blue-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      >
                        Choose
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-200 text-sm">Belum ada data worker.</p>
              )}
            </div>

            {/* Form Pengiriman Tugas */}
            {selectedWorker && (
              <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-50">
                <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl w-full max-w-md shadow-2xl ring-1 ring-slate-200/70">
                  <h2 className="text-lg font-bold mb-4 text-slate-900">
                    Kirim Tugas ke {selectedWorker.name}
                  </h2>
                  <form onSubmit={handleSubmitTask}>
                    {/* Input File */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-800">
                        Upload File
                      </label>
                      <input
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const selectedFile = e.target.files?.[0];
                          if (selectedFile) {
                            setFile(selectedFile);
                          }
                        }}
                        className="mt-1 block w-full text-sm text-slate-900 border border-slate-300 rounded-xl cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 bg-white"
                        required
                      />
                    </div>

                    {/* Input Deskripsi */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-800">
                        Deskripsi Tugas
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full p-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 bg-white"
                        rows={3}
                        required
                      ></textarea>
                    </div>

                    {/* Input Deadline */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-800">Deadline</label>
                      <input
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="mt-1 block w-full p-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 bg-white"
                        required
                      />
                    </div>

                    {/* Tombol Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 shadow-lg shadow-blue-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-70"
                    >
                      {isLoading ? 'Mengirim...' : 'Kirim Tugas'}
                    </button>

                    {/* Tombol Batal */}
                    <button
                      type="button"
                      onClick={() => setSelectedWorker(null)}
                      className="w-full mt-2 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2.5 transition"
                    >
                      Batal
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Chat popup */}
            {chatOpen && (
              <div
                className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-4 w-full 
                max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl 
                h-[80vh] md:h-2/3 
                max-h-[90vh] md:max-h-[80vh] 
                border border-slate-200/70 flex flex-col 
                overflow-y-auto z-50 ring-1 ring-white/40"
              >
                <button
                  onClick={() => setChatOpen(false)}
                  className="flex justify-between items-center border-b pb-2 mb-3 text-slate-500 hover:text-red-500"
                >
                  ✖
                </button>
                <h2 className="font-bold text-slate-900">Chat with Admin</h2>
                <div className="overflow-y-scroll h-3/4 bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 mt-2">
                  {messages.map((msg, index) => (
                    <div key={index} className="mb-4">
                      <div className="p-2 bg-blue-50 text-sm rounded-lg border border-blue-100 text-slate-800">
                        <p>
                          <strong>{msg.sender}:</strong> {msg.text}
                        </p>
                      </div>

                      {msg.type === 'rekomendasi' && (
                        <div className="mt-2 border rounded-xl p-3 bg-white/80 shadow-sm border-slate-200/70">
                          <p className="text-sm font-semibold text-slate-800">
                            Worker yang Direkomendasikan:
                          </p>
                          <div className="flex items-center space-x-3 mt-2">
                            <img
                              src={msg.profilePictureUrl}
                              alt="Foto Worker"
                              className="w-10 h-10 rounded-full border object-cover"
                            />
                            <div>
                              <p className="text-sm">
                                <strong>Role:</strong> {msg.senderRekomendasi}
                              </p>
                              <p className="text-sm">
                                <strong>Special Role:</strong> {msg.specialRole}
                              </p>
                              <a
                                href={msg.portofolioUrl}
                                className="text-blue-700 hover:underline text-sm mt-1 inline-block underline-offset-4"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                📁 Lihat Portofolio
                              </a>
                              <p className="text-xs text-slate-600 mt-2">{msg.description}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Tampilkan Data Worker (di dalam chat) */}
                  <h3 className="font-bold mt-4 text-slate-900">Data Worker Terkait</h3>
                  {workerProfiles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                      {workerProfiles.map((worker) => (
                        <div
                          key={worker.uid}
                          className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={worker.profilePictureUrl}
                              alt="Profile"
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                            />
                            <div>
                              <p className="text-xs font-semibold text-slate-700">No Rekening:</p>
                              <p className="text-xs font-medium text-slate-900">
                                {worker.noRekening}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 text-xs">
                            <p className="text-slate-700">
                              <span className="font-semibold">Role:</span> {worker.role}
                            </p>
                            <p className="text-slate-700">
                              <span className="font-semibold">Special Role:</span>{' '}
                              {worker.specialRole}
                            </p>
                          </div>

                          <div className="mt-3">
                            <a
                              href={worker.portofolioUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 text-xs font-semibold hover:text-blue-900 transition underline underline-offset-4"
                            >
                              📂 Lihat Portofolio
                            </a>
                          </div>

                          <button
                            onClick={() => handleChooseWorker(worker)}
                            className="mt-3 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2 transition font-semibold"
                          >
                            Choose
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600 text-xs">Belum ada data worker.</p>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow p-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 bg-white"
                    placeholder="Type a message..."
                  />
                  <button
                    type="submit"
                    className="rounded-xl px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}

            {/* Form Pengiriman Tugas (duplikat di luar chat, sesuai struktur asli) */}
            {selectedWorker && (
              <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-50">
                <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl w-full max-w-md shadow-2xl ring-1 ring-slate-200/70">
                  <h2 className="text-lg font-semibold mb-4 text-slate-900">
                    Kirim Tugas ke {selectedWorker.name}
                  </h2>
                  <form onSubmit={handleSubmitTask}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-800">
                        Upload File
                      </label>
                      <input
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const selectedFile = e.target.files?.[0];
                          if (selectedFile) {
                            setFile(selectedFile);
                          }
                        }}
                        className="mt-1 block w-full text-sm text-slate-900 border border-slate-300 rounded-xl cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 bg-white"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-800">
                        Deskripsi Tugas
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full p-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 bg-white"
                        rows={3}
                        required
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-800">Deadline</label>
                      <input
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="mt-1 block w-full p-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 bg-white"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 shadow-lg shadow-blue-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-70"
                    >
                      {isLoading ? 'Mengirim...' : 'Kirim Tugas'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedWorker(null)}
                      className="w-full mt-2 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2.5 transition"
                    >
                      Batal
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
    <Footer/>
   </div>
  );
}
