// /* eslint-disable @next/next/no-img-element */
// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   onSnapshot,
//   addDoc,
//   where,
// } from 'firebase/firestore';
// import { db } from '@/lib/firebaseConfig';
// import NavbarAdmin from '@/app/navbaradmin';
// import { Message, UserData, WorkerProfile } from '@/lib/types';

// interface Queue {
//   id: string;
//   queueNumber: number;
//   name: string;
// }

// /** Tambahan tipe agar bebas dari 'any' tanpa mengubah struktur data */
// type WorkerProfileWithDesc = WorkerProfile & { description?: string };

// type LooseMessage = Message & {
//   text?: string;
//   type?: 'rekomendasi' | string;
//   senderRekomendasi?: string;
//   profilePictureUrl?: string;
//   specialRole?: string;
//   portofolioUrl?: string;
//   description?: string;
//   createdAt?: Date;
//   timestamp?: Date;
//   recipient?: string | null; // ✅ tambahkan ini untuk hilangkan TS2353
// };

// export default function AdminDashboard() {
//   const [queueList, setQueueList] = useState<Queue[]>([]);
//   const [messages, setMessages] = useState<LooseMessage[]>([]);
//   const [chatOpen, setChatOpen] = useState(false);
//   const [newMessage, setNewMessage] = useState('');
//   const [activeQueueNumber, setActiveQueueNumber] = useState<string | null>(null);
//   const [workerProfiles, setWorkerProfiles] = useState<WorkerProfileWithDesc[]>([]);
//   const [showWorkerData, setShowWorkerData] = useState(false);
//   const [selectedWorker, setSelectedWorker] = useState<WorkerProfileWithDesc | null>(null);
//   const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

//   // Fetch queues (once)
//   useEffect(() => {
//     const fetchQueues = async () => {
//       const qRef = query(collection(db, 'queues'), orderBy('queueNumber', 'asc'));
//       const querySnapshot = await getDocs(qRef);
//       const queues = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...(doc.data() as Omit<Queue, 'id'>),
//       })) as Queue[];
//       setQueueList(queues);
//     };
//     fetchQueues();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Fetch worker profiles (once)
//   useEffect(() => {
//     const fetchWorkerProfiles = async () => {
//       const workersQuery = query(collection(db, 'workers'));
//       const querySnapshot = await getDocs(workersQuery);

//       // Pastikan cocok ke tipe WorkerProfileWithDesc dan pakai doc.id sebagai fallback uid
//       const workers = querySnapshot.docs.map((doc) => {
//         const data = doc.data() as WorkerProfileWithDesc;
//         return {
//           ...data,
//           uid: data?.uid ?? doc.id,
//         } as WorkerProfileWithDesc;
//       });

//       setWorkerProfiles(workers);
//     };

//     fetchWorkerProfiles();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Buka chat untuk queue tertentu, muat user & histori pesan
//   const handleTalkClick = async (queueNumber: string) => {
//     setChatOpen(true);
//     setActiveQueueNumber(queueNumber);

//     // Ambil user dengan queueNumber
//     const uq = query(collection(db, 'users'), where('queueNumber', '==', queueNumber));
//     const uSnap = await getDocs(uq);
//     if (!uSnap.empty) {
//       const userData = uSnap.docs[0].data() as UserData;
//       setSelectedUser(userData);
//     }

//     // Ambil histori pesan (pakai createdAt agar kompatibel kode lama)
//     const messagesQuery = query(
//       collection(db, 'chats'),
//       where('queueNumber', '==', queueNumber),
//       orderBy('createdAt', 'asc')
//     );
//     const messagesSnapshot = await getDocs(messagesQuery);
//     const fetchedMessages = messagesSnapshot.docs.map((doc) => doc.data() as LooseMessage);
//     setMessages(fetchedMessages);
//   };

//   // Real-time listener untuk chat aktif (pakai timestamp yang konsisten)
//   useEffect(() => {
//     if (!activeQueueNumber) return;

//     const messagesQuery = query(
//       collection(db, 'chats'),
//       where('queueNumber', '==', activeQueueNumber),
//       orderBy('timestamp', 'asc')
//     );

//     const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
//       const fetchedMessages = snapshot.docs.map((doc) => doc.data() as LooseMessage);
//       setMessages(fetchedMessages);
//     });

//     return () => unsubscribe();
//   }, [activeQueueNumber]);

//   // Kirim pesan teks biasa
//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !activeQueueNumber) return;

//     const messageData: LooseMessage = {
//       sender: 'Admin',
//       text: newMessage.trim(),
//       queueNumber: activeQueueNumber,
//       createdAt: new Date(), // kompatibel query lama
//       timestamp: new Date(), // dipakai untuk real-time orderBy
//       recipient: selectedUser ? selectedUser.uid : null,
//     };

//     await addDoc(collection(db, 'chats'), messageData);
//     setMessages((prev) => [...prev, messageData]);
//     setNewMessage('');
//   };

//   // Kirim pesan rekomendasi worker
//   const handleSendMessageRekomendasi = async () => {
//     if (!selectedWorker) {
//       console.error('Tidak ada worker yang dipilih.');
//       return;
//     }

//     const rekomendasiData: LooseMessage = {
//       sender: 'Admin',
//       text: `Rekomendasi Worker: ${selectedWorker.role}`,
//       type: 'rekomendasi',
//       senderRekomendasi: selectedWorker.role,
//       profilePictureUrl: selectedWorker.profilePictureUrl,
//       specialRole: selectedWorker.specialRole,
//       portofolioUrl: selectedWorker.portofolioUrl,
//       description: selectedWorker.description ?? '',
//       queueNumber: activeQueueNumber || '',
//       createdAt: new Date(),
//       timestamp: new Date(),
//       recipient: selectedUser ? selectedUser.uid : null,
//     };

//     try {
//       await addDoc(collection(db, 'chats'), rekomendasiData);
//       setMessages((prev) => [...prev, rekomendasiData]);
//       alert('Rekomendasi berhasil dikirim.');
//     } catch (error) {
//       console.error('Gagal mengirim rekomendasi:', error);
//       alert('Terjadi kesalahan saat mengirim rekomendasi.');
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <NavbarAdmin />
//       <h1 className="text-4xl font-extrabold text-gray-800">Dashboard Admin</h1>
//       <p>Selamat datang, Admin!</p>

//       <h2 className="text-2xl font-bold mb-4">Daftar Antrian</h2>

//       {/* List of current queues */}
//       <ul className="space-y-4">
//         {queueList.length > 0 ? (
//           queueList.map((queue) => (
//             <li
//               key={queue.id}
//               className="p-4 bg-gray-100 border border-gray-200 rounded-lg shadow-md"
//             >
//               <p className="font-semibold">Nomor Antrian: {queue.queueNumber}</p>
//               <p>Nama: {queue.name || 'Belum diisi'}</p>
//               <button
//                 className="mt-2 p-2 bg-blue-500 text-white rounded-lg"
//                 onClick={() => handleTalkClick(queue.queueNumber.toString())}
//               >
//                 Talk
//               </button>
//             </li>
//           ))
//         ) : (
//           <p className="text-gray-600">Belum ada antrian.</p>
//         )}
//       </ul>

//       {/* Data Worker (grid di luar popup) */}
//       <h3 className="font-bold mt-4 text-gray-800">Data Worker Terkait</h3>
//       {workerProfiles.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {workerProfiles.map((worker) => (
//             <div
//               key={worker.uid}
//               className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
//             >
//               <div className="flex items-center space-x-4">
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
//               <div className="mt-3 text-xs">
//                 <p className="text-gray-700">
//                   <span className="font-semibold">Role:</span> {worker.role}
//                 </p>
//                 <p className="text-gray-700">
//                   <span className="font-semibold">Special Role:</span> {worker.specialRole}
//                 </p>
//               </div>
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
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-600 text-xs">Belum ada data worker.</p>
//       )}

//       {/* Chat Popup */}
//       {chatOpen && (
//         <div
//           className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 w-full 
//                 max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl 
//                 h-[80vh] md:h-2/3 
//                 max-h-[90vh] md:max-h-[80vh] 
//                 border border-gray-300 flex flex-col 
//                 overflow-y-auto z-50"
//         >
//           {/* Header */}
//           <div className="flex justify-between items-center border-b pb-2 mb-2">
//             <h2 className="text-lg font-bold text-gray-800">
//               Chat with {selectedUser ? selectedUser.name : 'User'} (Queue {activeQueueNumber})
//             </h2>
//             <button
//               onClick={() => setChatOpen(false)}
//               className="text-gray-500 hover:text-red-500"
//             >
//               ✖
//             </button>
//           </div>

//           {/* Chat Messages */}
//           <div className="flex-1 overflow-y-auto bg-gray-100 p-2 rounded-lg space-y-3">
//             {messages.map((msg, index) => (
//               <div key={index}>
//                 <p className="text-sm font-semibold text-gray-700">{msg.sender}:</p>
//                 <p className="text-gray-800 bg-white p-2 rounded-lg shadow-sm">
//                   {msg.text ?? ''}
//                 </p>
//               </div>
//             ))}

//             {/* Data Worker di dalam popup */}
//             <h3 className="font-bold mt-4 text-gray-800">Data Worker Terkait</h3>
//             {workerProfiles.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {workerProfiles.map((worker) => (
//                   <div
//                     key={worker.uid}
//                     className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
//                   >
//                     <div className="flex items-center space-x-4">
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
//                         <span className="font-semibold">Special Role:</span> {worker.specialRole}
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
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-600 text-xs">Belum ada data worker.</p>
//             )}
//           </div>

//           {/* Chat Input */}
//           <form onSubmit={handleSendMessage} className="mt-2 flex space-x-2">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Type a message..."
//             />
//             <button
//               type="button"
//               onClick={() => setShowWorkerData(!showWorkerData)}
//               className="p-2 text-gray-500 hover:text-gray-700 transition duration-300"
//             >
//               📌
//             </button>
//             <button
//               type="submit"
//               className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
//             >
//               Send
//             </button>
//           </form>

//           {showWorkerData && (
//             <>
//               <h3 className="font-bold mt-4 text-gray-800">Data Worker Terkait</h3>
//               {workerProfiles.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {workerProfiles.map((worker) => (
//                     <div
//                       key={worker.uid}
//                       className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
//                     >
//                       <div className="flex items-center space-x-4">
//                         <img
//                           src={worker.profilePictureUrl}
//                           alt="Profile"
//                           className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
//                         />
//                         <div>
//                           <p className="text-xs font-semibold text-gray-700">No Rekening:</p>
//                           <p className="text-xs font-medium text-gray-900">{worker.noRekening}</p>
//                         </div>
//                       </div>
//                       <div className="mt-3 text-xs">
//                         <p className="text-gray-700">
//                           <span className="font-semibold">Role:</span> {worker.role}
//                         </p>
//                         <p className="text-gray-700">
//                           <span className="font-semibold">Special Role:</span> {worker.specialRole}
//                         </p>
//                       </div>
//                       <div className="mt-3">
//                         <a
//                           href={worker.portofolioUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 text-xs font-semibold hover:text-blue-800 transition duration-300"
//                         >
//                           📂 Lihat Portofolio
//                         </a>
//                       </div>
//                       <button
//                         onClick={() => setSelectedWorker(worker)}
//                         className="mt-3 w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-700 transition duration-300"
//                       >
//                         Pilih
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-600 text-xs">Belum ada data worker.</p>
//               )}
//             </>
//           )}

//           {selectedWorker && (
//             <div className="mt-4 bg-gray-100 border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
//               <p className="text-sm font-semibold text-gray-800">Worker yang Dipilih:</p>
//               <div className="flex max-h-32 overflow-y-auto items-center space-x-2 mt-2">
//                 <img
//                   src={selectedWorker.profilePictureUrl}
//                   alt="Profile"
//                   className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
//                 />
//                 <p className="text-sm text-gray-700">{selectedWorker.role}</p>
//               </div>
//               <button
//                 type="button"
//                 onClick={handleSendMessageRekomendasi}
//                 className="mt-3 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
//               >
//                 Send
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import NavbarAdmin from '@/app/navbaradmin';
import { Message, UserData, WorkerProfile } from '@/lib/types';

interface Queue {
  id: string;
  queueNumber: number;
  name: string;
}

/** Tambahan tipe agar bebas dari 'any' tanpa mengubah struktur data */
type WorkerProfileWithDesc = WorkerProfile & { description?: string };

type LooseMessage = Message & {
  text?: string;
  type?: 'rekomendasi' | string;
  senderRekomendasi?: string;
  profilePictureUrl?: string;
  specialRole?: string;
  portofolioUrl?: string;
  description?: string;
  createdAt?: Date;
  timestamp?: Date;
  recipient?: string | null; // ✅ tambahkan ini untuk hilangkan TS2353
};

export default function AdminDashboard() {
  const [queueList, setQueueList] = useState<Queue[]>([]);
  const [messages, setMessages] = useState<LooseMessage[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [activeQueueNumber, setActiveQueueNumber] = useState<string | null>(null);
  const [workerProfiles, setWorkerProfiles] = useState<WorkerProfileWithDesc[]>([]);
  const [showWorkerData, setShowWorkerData] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfileWithDesc | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Fetch queues (once)
  useEffect(() => {
    const fetchQueues = async () => {
      const qRef = query(collection(db, 'queues'), orderBy('queueNumber', 'asc'));
      const querySnapshot = await getDocs(qRef);
      const queues = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Queue, 'id'>),
      })) as Queue[];
      setQueueList(queues);
    };
    fetchQueues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch worker profiles (once)
  useEffect(() => {
    const fetchWorkerProfiles = async () => {
      const workersQuery = query(collection(db, 'workers'));
      const querySnapshot = await getDocs(workersQuery);

      // Pastikan cocok ke tipe WorkerProfileWithDesc dan pakai doc.id sebagai fallback uid
      const workers = querySnapshot.docs.map((doc) => {
        const data = doc.data() as WorkerProfileWithDesc;
        return {
          ...data,
          uid: data?.uid ?? doc.id,
        } as WorkerProfileWithDesc;
      });

      setWorkerProfiles(workers);
    };

    fetchWorkerProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Buka chat untuk queue tertentu, muat user & histori pesan
  const handleTalkClick = async (queueNumber: string) => {
    setChatOpen(true);
    setActiveQueueNumber(queueNumber);

    // Ambil user dengan queueNumber
    const uq = query(collection(db, 'users'), where('queueNumber', '==', queueNumber));
    const uSnap = await getDocs(uq);
    if (!uSnap.empty) {
      const userData = uSnap.docs[0].data() as UserData;
      setSelectedUser(userData);
    }

    // Ambil histori pesan (pakai createdAt agar kompatibel kode lama)
    const messagesQuery = query(
      collection(db, 'chats'),
      where('queueNumber', '==', queueNumber),
      orderBy('createdAt', 'asc')
    );
    const messagesSnapshot = await getDocs(messagesQuery);
    const fetchedMessages = messagesSnapshot.docs.map((doc) => doc.data() as LooseMessage);
    setMessages(fetchedMessages);
  };

  // Real-time listener untuk chat aktif (pakai timestamp yang konsisten)
  useEffect(() => {
    if (!activeQueueNumber) return;

    const messagesQuery = query(
      collection(db, 'chats'),
      where('queueNumber', '==', activeQueueNumber),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => doc.data() as LooseMessage);
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [activeQueueNumber]);

  // Kirim pesan teks biasa
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeQueueNumber) return;

    const messageData: LooseMessage = {
      sender: 'Admin',
      text: newMessage.trim(),
      queueNumber: activeQueueNumber,
      createdAt: new Date(), // kompatibel query lama
      timestamp: new Date(), // dipakai untuk real-time orderBy
      recipient: selectedUser ? selectedUser.uid : null,
    };

    await addDoc(collection(db, 'chats'), messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');
  };

  // Kirim pesan rekomendasi worker
  const handleSendMessageRekomendasi = async () => {
    if (!selectedWorker) {
      console.error('Tidak ada worker yang dipilih.');
      return;
    }

    const rekomendasiData: LooseMessage = {
      sender: 'Admin',
      text: `Rekomendasi Worker: ${selectedWorker.role}`,
      type: 'rekomendasi',
      senderRekomendasi: selectedWorker.role,
      profilePictureUrl: selectedWorker.profilePictureUrl,
      specialRole: selectedWorker.specialRole,
      portofolioUrl: selectedWorker.portofolioUrl,
      description: selectedWorker.description ?? '',
      queueNumber: activeQueueNumber || '',
      createdAt: new Date(),
      timestamp: new Date(),
      recipient: selectedUser ? selectedUser.uid : null,
    };

    try {
      await addDoc(collection(db, 'chats'), rekomendasiData);
      setMessages((prev) => [...prev, rekomendasiData]);
      alert('Rekomendasi berhasil dikirim.');
    } catch (error) {
      console.error('Gagal mengirim rekomendasi:', error);
      alert('Terjadi kesalahan saat mengirim rekomendasi.');
    }
  };

  return (
    <div
      className="
        relative min-h-screen
        bg-slate-950 text-slate-100
        selection:bg-indigo-500/20 selection:text-indigo-200
        overflow-x-hidden
      "
    >
      {/* Decorative background: radial glows + subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Radial glow */}
        <div className="absolute -top-24 -left-24 h-[36rem] w-[36rem] rounded-full bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tl from-cyan-400/10 via-emerald-400/10 to-transparent blur-3xl" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.09) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <NavbarAdmin />

      <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
        {/* Page header */}
        <header
          className="
            mb-8 rounded-3xl p-6 md:p-8
            bg-white/5 backdrop-blur-xl
            border border-white/10
            shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]
            ring-1 ring-black/5
          "
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1
                className="
                  text-3xl md:text-4xl font-extrabold tracking-tight
                  bg-clip-text text-transparent
                  bg-gradient-to-r from-indigo-200 via-white to-cyan-200
                  drop-shadow-[0_2px_10px_rgba(99,102,241,0.35)]
                "
              >
                Dashboard Admin
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-300">
                Selamat datang, Admin! Kelola antrian, chat, dan rekomendasi worker dalam satu tempat.
              </p>
            </div>

            {/* Quick KPI-ish badge (dekoratif, tidak ganggu logika) */}
            <div
              className="
                inline-flex items-center gap-2
                rounded-full px-4 py-2
                bg-gradient-to-r from-indigo-600/40 to-fuchsia-600/40
                border border-white/10
                shadow-inner shadow-white/5
              "
              title="Status realtime aktif"
            >
              <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-white/90">
                Realtime Connected
              </span>
            </div>
          </div>
        </header>

        {/* Daftar Antrian */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white/95">Daftar Antrian</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
              {queueList.length} item
            </span>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {queueList.length > 0 ? (
              queueList.map((queue) => (
                <li
                  key={queue.id}
                  className="
                    group relative overflow-hidden
                    rounded-2xl p-5
                    bg-white/5 backdrop-blur-xl
                    border border-white/10
                    shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]
                    transition-all duration-300
                    hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]
                  "
                >
                  {/* Glow accent */}
                  <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/10 to-cyan-400/10 blur-2xl" />
                  </div>

                  <p className="font-semibold text-slate-100">
                    Nomor Antrian:{' '}
                    <span className="text-indigo-300">#{queue.queueNumber}</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Nama:{' '}
                    <span className="font-medium text-white/90">
                      {queue.name || 'Belum diisi'}
                    </span>
                  </p>
                  <button
                    className="
                      mt-4 inline-flex items-center justify-center gap-2
                      px-4 py-2 rounded-xl
                      bg-gradient-to-r from-indigo-600 to-fuchsia-600
                      text-white font-semibold
                      shadow-[inset_0_-8px_20px_rgba(0,0,0,0.25)]
                      ring-1 ring-white/10
                      transition-all duration-300
                      hover:brightness-110 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.7)]
                      focus:outline-none focus:ring-2 focus:ring-indigo-400/50
                    "
                    onClick={() => handleTalkClick(queue.queueNumber.toString())}
                  >
                    <span>Talk</span>
                    <span aria-hidden>💬</span>
                  </button>
                </li>
              ))
            ) : (
              <p className="text-slate-400 text-sm">Belum ada antrian.</p>
            )}
          </ul>
        </section>

        {/* Data Worker (grid di luar popup) */}
        <section className="mb-10">
          <h3 className="text-xl md:text-2xl font-bold text-white/95 mb-4">Data Worker Terkait</h3>
          {workerProfiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {workerProfiles.map((worker) => (
                <div
                  key={worker.uid}
                  className="
                    group relative overflow-hidden
                    rounded-2xl p-4
                    bg-white/5 backdrop-blur-xl
                    border border-white/10
                    shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]
                    transition-all duration-300
                    hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]
                  "
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={worker.profilePictureUrl}
                        alt="Profile"
                        className="
                          w-12 h-12 rounded-full object-cover
                          ring-2 ring-white/20 border border-white/20
                          shadow-[0_10px_30px_-15px_rgba(59,130,246,0.5)]
                        "
                      />
                      <span
                        className="
                          absolute -bottom-1 -right-1 size-4 rounded-full
                          bg-emerald-400 ring-2 ring-slate-900
                        "
                        title="Verified"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        No Rekening
                      </p>
                      <p className="text-xs font-medium text-white/90">
                        {worker.noRekening}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-xs">
                    <p className="text-slate-300">
                      <span className="font-semibold text-white/90">Role:</span> {worker.role}
                    </p>
                    <p className="text-slate-300">
                      <span className="font-semibold text-white/90">Special Role:</span>{' '}
                      {worker.specialRole}
                    </p>
                  </div>

                  <div className="mt-3">
                    <a
                      href={worker.portofolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex items-center gap-2
                        text-indigo-300 text-xs font-semibold
                        hover:text-white transition duration-300
                      "
                    >
                      <span>📂 Lihat Portofolio</span>
                      <span aria-hidden className="translate-y-px">↗</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-xs">Belum ada data worker.</p>
          )}
        </section>
      </div>

      {/* Chat Popup */}
      {chatOpen && (
        <div
          className="
            fixed bottom-5 right-5 z-50
            w-[calc(100%-2.5rem)] max-w-xl
            h-[80vh] md:h-[72vh]
            rounded-3xl
            bg-gradient-to-br from-white/10 to-white/5
            backdrop-blur-2xl
            border border-white/15
            shadow-[0_20px_80px_-20px_rgba(0,0,0,0.7)]
            ring-1 ring-black/5
            flex flex-col
            overflow-hidden
          "
          role="dialog"
          aria-modal="true"
          aria-label="Chat Window"
        >
          {/* Header */}
          <div
            className="
              relative
              px-5 py-4
              bg-white/5
              border-b border-white/10
              flex items-center justify-between
            "
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-gradient-to-br from-indigo-500/60 to-fuchsia-500/60 ring-1 ring-white/15" />
              <div>
                <h2 className="text-base md:text-lg font-bold text-white/95">
                  Chat with {selectedUser ? selectedUser.name : 'User'}{' '}
                  <span className="text-slate-300">(Queue {activeQueueNumber})</span>
                </h2>
                <p className="text-[11px] text-slate-400">Secure • Realtime</p>
              </div>
            </div>

            <button
              onClick={() => setChatOpen(false)}
              className="
                inline-flex items-center justify-center
                size-9 rounded-xl
                bg-white/5 hover:bg-white/10
                border border-white/10
                text-slate-200 hover:text-white
                transition
                focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40
              "
              aria-label="Close chat"
              title="Close"
            >
              ✖
            </button>
          </div>

          {/* Chat Messages */}
          <div
            className="
              flex-1 overflow-y-auto p-3 md:p-4
              bg-gradient-to-b from-transparent to-black/20
              [scrollbar-width:thin]
            "
          >
            <div className="mx-auto max-w-[48rem]">
              {/* Stream messages */}
              <div className="flex flex-col gap-3">
                {messages.map((msg, index) => {
                  const isAdmin = msg.sender === 'Admin';
                  const isRekom = msg.type === 'rekomendasi';
                  return (
                    <div
                      key={index}
                      className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Bubble */}
                      <div
                        className={`
                          relative max-w-[85%]
                          rounded-2xl px-4 py-3
                          border
                          shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]
                          ${isAdmin
                            ? 'bg-gradient-to-br from-indigo-600/70 to-fuchsia-600/70 border-white/15 text-white'
                            : 'bg-white/10 border-white/15 text-white/90'}
                        `}
                      >
                        <p className="text-[11px] mb-1 opacity-80">
                          <span className="font-semibold">{msg.sender}</span>
                        </p>

                        {!isRekom ? (
                          <p className="text-sm leading-relaxed">
                            {msg.text ?? ''}
                          </p>
                        ) : (
                          <div className="text-sm">
                            <p className="font-semibold mb-2">
                              {msg.text}
                            </p>
                            <div className="flex items-center gap-3">
                              {msg.profilePictureUrl ? (
                                <img
                                  src={msg.profilePictureUrl}
                                  alt="Worker"
                                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                                />
                              ) : null}
                              <div className="text-xs">
                                <p className="text-white/90">
                                  <span className="font-semibold">Special:</span>{' '}
                                  {msg.specialRole || '-'}
                                </p>
                                {msg.description ? (
                                  <p className="text-white/80 line-clamp-3 mt-1">
                                    {msg.description}
                                  </p>
                                ) : null}
                                {msg.portofolioUrl ? (
                                  <a
                                    href={msg.portofolioUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-2 text-indigo-200 hover:text-white font-semibold"
                                  >
                                    Lihat Portofolio ↗
                                  </a>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Tail */}
                        <span
                          className={`
                            absolute top-3 h-3 w-3 rotate-45
                            ${isAdmin
                              ? '-right-1 bg-gradient-to-br from-indigo-600/70 to-fuchsia-600/70 border-r border-b border-white/15'
                              : '-left-1 bg-white/10 border-l border-t border-white/15'}
                          `}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Data Worker di dalam popup */}
              <h3 className="font-bold mt-6 mb-2 text-white/95">Data Worker Terkait</h3>
              {workerProfiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workerProfiles.map((worker) => (
                    <div
                      key={worker.uid}
                      className="
                        rounded-2xl p-3
                        bg-white/5 border border-white/10 backdrop-blur-xl
                        shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]
                        transition-all duration-300
                        hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]
                      "
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={worker.profilePictureUrl}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20 border border-white/10"
                        />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                            No Rekening
                          </p>
                          <p className="text-xs font-medium text-white/90">
                            {worker.noRekening}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 text-xs">
                        <p className="text-slate-300">
                          <span className="font-semibold text-white/90">Role:</span> {worker.role}
                        </p>
                        <p className="text-slate-300">
                          <span className="font-semibold text-white/90">Special Role:</span>{' '}
                          {worker.specialRole}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <a
                          href={worker.portofolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            text-indigo-200 text-xs font-semibold hover:text-white transition
                            inline-flex items-center gap-1
                          "
                        >
                          📂 Portofolio <span aria-hidden>↗</span>
                        </a>
                        <button
                          onClick={() => setSelectedWorker(worker)}
                          className="
                            inline-flex items-center justify-center
                            px-3 py-1.5 rounded-lg
                            bg-gradient-to-r from-emerald-600 to-teal-600
                            text-white text-xs font-semibold
                            ring-1 ring-white/10
                            hover:brightness-110 transition
                          "
                        >
                          Pilih
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs">Belum ada data worker.</p>
              )}
            </div>
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendMessage}
            className="
              p-3 md:p-4
              bg-white/5 border-t border-white/10
              flex items-center gap-2
            "
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="
                flex-grow px-4 py-3 rounded-2xl
                bg-white/10 text-white placeholder:text-slate-400
                border border-white/10
                focus:outline-none focus:ring-2 focus:ring-indigo-400/40
                shadow-inner shadow-black/20
              "
              placeholder="Type a message..."
              aria-label="Type a message"
            />
            <button
              type="button"
              onClick={() => setShowWorkerData(!showWorkerData)}
              className="
                inline-flex items-center justify-center
                size-11 rounded-2xl
                bg-white/10 hover:bg-white/15
                border border-white/10
                text-slate-200 hover:text-white
                transition focus:outline-none focus:ring-2 focus:ring-indigo-400/40
              "
              title="Toggle Data Worker"
              aria-label="Toggle Data Worker"
            >
              📌
            </button>
            <button
              type="submit"
              className="
                inline-flex items-center justify-center gap-2
                px-5 py-3 rounded-2xl
                bg-gradient-to-r from-indigo-600 to-fuchsia-600
                text-white font-semibold
                shadow-[inset_0_-10px_30px_rgba(0,0,0,0.25)]
                ring-1 ring-white/10
                hover:brightness-110 transition
                focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40
              "
            >
              Send ✈
            </button>
          </form>

          {/* Panel pilihan worker (toggle) */}
          {showWorkerData && (
            <div
              className="
                px-4 pb-4
                bg-gradient-to-b from-transparent to-white/5
                border-t border-white/10
              "
            >
              <h3 className="font-bold mt-4 text-white/95">Data Worker Terkait</h3>
              {workerProfiles.length > 0 ? (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workerProfiles.map((worker) => (
                    <div
                      key={worker.uid}
                      className="
                        rounded-2xl p-3
                        bg-white/5 border border-white/10 backdrop-blur-xl
                        shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]
                        hover:-translate-y-0.5 transition
                      "
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={worker.profilePictureUrl}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20 border border-white/10"
                        />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                            No Rekening
                          </p>
                          <p className="text-xs font-medium text-white/90">
                            {worker.noRekening}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 text-xs">
                        <p className="text-slate-300">
                          <span className="font-semibold text-white/90">Role:</span> {worker.role}
                        </p>
                        <p className="text-slate-300">
                          <span className="font-semibold text-white/90">Special Role:</span>{' '}
                          {worker.specialRole}
                        </p>
                      </div>
                      <div className="mt-3">
                        <a
                          href={worker.portofolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-200 text-xs font-semibold hover:text-white transition inline-flex items-center gap-1"
                        >
                          📂 Lihat Portofolio ↗
                        </a>
                      </div>
                      <button
                        onClick={() => setSelectedWorker(worker)}
                        className="
                          mt-3 w-full
                          bg-gradient-to-r from-emerald-600 to-teal-600
                          text-white text-sm font-semibold
                          p-2 rounded-xl
                          ring-1 ring-white/10
                          hover:brightness-110 transition
                        "
                      >
                        Pilih
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs">Belum ada data worker.</p>
              )}
            </div>
          )}

          {/* Ringkasan worker terpilih + tombol Send rekomendasi */}
          {selectedWorker && (
            <div
              className="
                px-4 py-3
                bg-white/5 border-t border-white/10
              "
            >
              <div
                className="
                  rounded-2xl p-3
                  bg-white/5 border border-white/10
                  shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]
                "
              >
                <p className="text-sm font-semibold text-white/95">Worker yang Dipilih</p>
                <div className="flex max-h-32 overflow-y-auto items-center gap-3 mt-2">
                  <img
                    src={selectedWorker.profilePictureUrl}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
                  />
                  <div className="text-sm">
                    <p className="text-white/90">{selectedWorker.role}</p>
                    <p className="text-xs text-slate-300">
                      {selectedWorker.specialRole ? `Special: ${selectedWorker.specialRole}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSendMessageRekomendasi}
                  className="
                    mt-3 inline-flex items-center justify-center gap-2
                    bg-gradient-to-r from-indigo-600 to-fuchsia-600
                    text-white px-4 py-2 rounded-xl
                    font-semibold
                    ring-1 ring-white/10
                    hover:brightness-110 transition
                  "
                >
                  Send Rekomendasi 🚀
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
