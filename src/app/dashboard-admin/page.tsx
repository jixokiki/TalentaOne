// 'use client';

// import { useState, useEffect } from 'react';
// import { addDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
// import { db } from '@/lib/firebaseConfig';

// // Define the Queue type for each document in Firestore
// interface Queue {
//   id: string;
//   queueNumber: number;
//   name: string;
// }

// export default function AdminDashboard() {
//   const [queueNumber, setQueueNumber] = useState<number>(1); // Initialize with queue number 1
//   const [queueList, setQueueList] = useState<Queue[]>([]); // List of queues

//   // Fetch queues from Firestore on component mount
//   useEffect(() => {
//     const fetchQueues = async () => {
//       const q = query(collection(db, 'queues'), orderBy('queueNumber', 'asc'));
//       const querySnapshot = await getDocs(q);
//       const queues = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Queue[];

//       setQueueList(queues);

//       // Update the queue number to the next available number
//       if (queues.length > 0) {
//         const lastQueueNumber = queues[queues.length - 1].queueNumber;
//         setQueueNumber(lastQueueNumber + 1);
//       }
//     };

//     fetchQueues();
//   }, []);

//   // Add new queue to Firestore
//   const handleAddQueue = async () => {
//     try {
//       await addDoc(collection(db, 'queues'), {
//         queueNumber,
//         name: '', // Initialize with an empty name (admin can update later if needed)
//         createdAt: new Date(),
//       });

//       // Update the queue list and increment the queue number
//       setQueueList((prev) => [...prev, { id: '', queueNumber, name: '' }]);
//       setQueueNumber(queueNumber + 1); // Move to next queue number
//     } catch (error) {
//       console.error('Error adding queue:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-4xl font-extrabold text-gray-800">Dashboard Admin</h1>
//       <p>Selamat datang, Admin!</p>

//       <div className="flex flex-col space-y-4 mb-8">
//         <a href="/addService" className="text-blue-600 font-medium underline hover:text-blue-800">
//           Tambahkan Layanan
//         </a>

//         <button onClick={handleAddQueue} className="p-2 bg-blue-500 text-white">
//           Masukkan Nomor Antrian: {queueNumber}
//         </button>
//       </div>

//       <h2 className="text-2xl font-bold mb-4">Daftar Antrian</h2>

//       {/* List of current queues */}
//       <ul className="space-y-4">
//         {queueList.length > 0 ? (
//           queueList.map((queue) => (
//             <li key={queue.id} className="p-4 bg-gray-100 border border-gray-200 rounded-lg shadow-md">
//               <p className="font-semibold">Nomor Antrian: {queue.queueNumber}</p>
//               <p>Nama: {queue.name || 'Belum diisi'}</p>
//             </li>
//           ))
//         ) : (
//           <p className="text-gray-600">Belum ada antrian.</p>
//         )}
//       </ul>
//     </div>
//   );
// }

//JANGAN DIHAPUS
// 'use client';

// import { useState, useEffect } from 'react';
// import { collection, getDocs, query, orderBy, onSnapshot, addDoc, where } from 'firebase/firestore';
// import { db } from '@/lib/firebaseConfig';

// interface Queue {
//   id: string;
//   queueNumber: number;
//   name: string;
// }

// interface Message {
//   text: string;
//   sender: string;
//   createdAt: Date;
//   queueNumber: string;
// }

// export default function AdminDashboard() {
//   const [queueList, setQueueList] = useState<Queue[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [chatOpen, setChatOpen] = useState(false);
//   const [newMessage, setNewMessage] = useState('');
//   const [activeQueueNumber, setActiveQueueNumber] = useState<string | null>(null);

//   // Fetch queues from Firestore on component mount
//   useEffect(() => {
//     const fetchQueues = async () => {
//       const q = query(collection(db, 'queues'), orderBy('queueNumber', 'asc'));
//       const querySnapshot = await getDocs(q);
//       const queues = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Queue[];

//       setQueueList(queues);
//     };

//     fetchQueues();
//   }, []);

//   // Listen for incoming messages
//   useEffect(() => {
//     if (!activeQueueNumber) return;

//     const chatQuery = query(
//       collection(db, 'chats'),
//       where('queueNumber', '==', activeQueueNumber),
//       orderBy('createdAt', 'asc')
//     );
//     const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
//       const chatMessages = snapshot.docs.map((doc) => doc.data() as Message);
//       setMessages(chatMessages);
//       if (chatMessages.length > 0) {
//         setChatOpen(true); // Open chat popup when a message is received
//       }
//     });

//     return () => unsubscribe();
//   }, [activeQueueNumber]);

//   const handleTalkClick = async (queueNumber: number) => {
//     setActiveQueueNumber(queueNumber.toString());

//     // Optional: send a system message or notification when admin starts chat
//     await addDoc(collection(db, 'chats'), {
//       text: 'Admin has started the conversation',
//       sender: 'Admin',
//       queueNumber: queueNumber.toString(),
//       createdAt: new Date(),
//     });
//   };

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage || !activeQueueNumber) return;

//     await addDoc(collection(db, 'chats'), {
//       text: newMessage,
//       sender: 'Admin',
//       queueNumber: activeQueueNumber,
//       createdAt: new Date(),
//     });

//     setNewMessage('');
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-4xl font-extrabold text-gray-800">Dashboard Admin</h1>
//       <p>Selamat datang, Admin!</p>

//       <h2 className="text-2xl font-bold mb-4">Daftar Antrian</h2>

//       {/* List of current queues */}
//       <ul className="space-y-4">
//         {queueList.length > 0 ? (
//           queueList.map((queue) => (
//             <li key={queue.id} className="p-4 bg-gray-100 border border-gray-200 rounded-lg shadow-md">
//               <p className="font-semibold">Nomor Antrian: {queue.queueNumber}</p>
//               <p>Nama: {queue.name || 'Belum diisi'}</p>
//               <button
//                 className="mt-2 p-2 bg-blue-500 text-white rounded-lg"
//                 onClick={() => handleTalkClick(queue.queueNumber)}
//               >
//                 Talk
//               </button>
//             </li>
//           ))
//         ) : (
//           <p className="text-gray-600">Belum ada antrian.</p>
//         )}
//       </ul>

//       {/* Chat popup */}
//       {chatOpen && (
//         <div className="fixed bottom-0 right-0 bg-white shadow-lg p-4 w-1/3 h-1/3 border">
//           <h2 className="font-bold">Chat with User (Queue {activeQueueNumber})</h2>
//           <div className="overflow-y-scroll h-3/4 bg-gray-100 p-2">
//             {messages.map((msg, index) => (
//               <div key={index} className="mb-2">
//                 <p className="text-sm font-semibold">{msg.sender}:</p>
//                 <p>{msg.text}</p>
//               </div>
//             ))}
//           </div>
//           <form onSubmit={handleSendMessage} className="mt-2 flex">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               className="flex-grow p-2 border"
//               placeholder="Type a message..."
//             />
//             <button type="submit" className="bg-blue-500 text-white p-2">Send</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, onSnapshot, addDoc, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseConfig';
import NavbarAdmin from '@/app/navbaradmin'; // Sesuaikan path sesuai struktur proyek Anda
import { Message } from "@/lib/types";
import React from "react";
import { UserData, WorkerProfile } from "@/lib/types";





interface Queue {
  id: string;
  queueNumber: number;
  name: string;
}

// interface Message {
//   text: string;
//   sender: string;
//   createdAt: Date;
//   queueNumber: string;
// }

// interface WorkerProfile {
//   noRekening: string;
//   role: string;
//   specialRole: string;
//   portofolioUrl: string;
//   profilePictureUrl: string;
//   uid: string;
// }

export default function AdminDashboard() {
  const [queueList, setQueueList] = useState<Queue[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [activeQueueNumber, setActiveQueueNumber] = useState<string | null>(null);
  const [workerProfiles, setWorkerProfiles] = useState<WorkerProfile[]>([]); // State untuk menyimpan data worker

  const [showWorkerData, setShowWorkerData] = useState(false);
  // const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  // const [selectedWorker, setSelectedWorker] = useState({
  //   profilePictureUrl: 'url-to-image',
  //   role: 'Worker Role',
  // });
  // const [selectedWorker, setSelectedWorker] = useState<WorkerProfile[]>([]);
  // Fetch queues from Firestore on component mount
  useEffect(() => {
    const fetchQueues = async () => {
      const q = query(collection(db, 'queues'), orderBy('queueNumber', 'asc'));
      const querySnapshot = await getDocs(q);
      const queues = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Queue[];

      setQueueList(queues);
    };

    fetchQueues();
  }, []);

  // Listen for incoming messages
  // useEffect(() => {
  //   if (!activeQueueNumber) return;

  //   const chatQuery = query(
  //     collection(db, 'chats'),
  //     where('queueNumber', '==', activeQueueNumber),
  //     orderBy('createdAt', 'asc')
  //   );
  //   const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
  //     const chatMessages = snapshot.docs.map((doc) => doc.data() as Message);
  //     setMessages(chatMessages);
  //     if (chatMessages.length > 0) {
  //       setChatOpen(true); // Open chat popup when a message is received
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [activeQueueNumber]);

  // Fetch worker profiles from Firestore
  useEffect(() => {
    const fetchWorkerProfiles = async () => {
      const workersQuery = query(collection(db, 'workers'));
      const querySnapshot = await getDocs(workersQuery);
      //JANGAN DIHAPUS DULU YAA
      // const workers = querySnapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // })) as WorkerProfile[];
      const workers = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...(doc.data() as Omit<WorkerProfile, 'id'>)
        };
      });
      

      setWorkerProfiles(workers);
    };

    fetchWorkerProfiles();
  }, []);

  // const handleTalkClick = async (queueNumber: number) => {
  //   setActiveQueueNumber(queueNumber.toString());

  //   // Optional: send a system message or notification when admin starts chat
  //   await addDoc(collection(db, 'chats'), {
  //     text: 'Admin has started the conversation',
  //     sender: 'Admin',
  //     queueNumber: queueNumber.toString(),
  //     createdAt: new Date(),
  //   });
  // };

  // const handleSendMessage = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!newMessage || !activeQueueNumber) return;

  //   await addDoc(collection(db, 'chats'), {
  //     text: newMessage,
  //     sender: 'Admin',
  //     queueNumber: activeQueueNumber,
  //     createdAt: new Date(),
  //   });

  //   setNewMessage('');
  // };

  //JANGAN DIHAPUS DULU YAA INI YANG PALING PERTAMA DIPAKAI
// const [selectedUser, setSelectedUser] = useState(null); // Data user yang sedang diajak bicara
//JANGAN JUGA DIHAPUS YANG KEDUA INI
// const [selectedUser, setSelectedUser] = useState<unknown>(null);
const [selectedUser, setSelectedUser] = useState<UserData | null>(null);


// **Fungsi untuk Menampilkan Chat Popup**
// const handleTalkClick = async (queueNumber) => {
//   setChatOpen(true);
//   setActiveQueueNumber(queueNumber);

//   // Cari data user berdasarkan queueNumber di Firestore
//   const q = query(collection(db, "users"), where("queueNumber", "==", queueNumber));
//   const querySnapshot = await getDocs(q);

//   if (!querySnapshot.empty) {
//     const userData = querySnapshot.docs[0].data();
//     setSelectedUser(userData); // Simpan data user yang akan diajak bicara

//     // Ambil pesan sebelumnya dari Firestore
//     const messagesQuery = query(
//       collection(db, "chats"),
//       where("queueNumber", "==", queueNumber),
//       orderBy("timestamp", "asc")
//     );

//     const messagesSnapshot = await getDocs(messagesQuery);
//     const fetchedMessages = messagesSnapshot.docs.map((doc) => doc.data());

//     setMessages(fetchedMessages);
//   }
// };


// **Fungsi untuk Menampilkan Chat Popup**
// const handleTalkClick = async (queueNumber) => {
const handleTalkClick = async (queueNumber:string) => {
  setChatOpen(true);
  setActiveQueueNumber(queueNumber);

  // Cari data user berdasarkan queueNumber di Firestore
  const q = query(collection(db, "users"), where("queueNumber", "==", queueNumber));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userData = querySnapshot.docs[0].data();
    //JANGAN DIHAPUS DULU YAA
    // setSelectedUser(userData); // Simpan data user yang akan diajak bicara
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // setSelectedUser(userData as any);
    setSelectedUser(userData as UserData);


    // Ambil pesan sebelumnya dari Firestore
    const messagesQuery = query(
      collection(db, "chats"),
      where("queueNumber", "==", queueNumber),
      orderBy("createdAt", "asc") // Pastikan ini sesuai dengan field timestamp di Firestore
    );

    const messagesSnapshot = await getDocs(messagesQuery);
    //JANGAN DIHAPUS DULU YAA
    // const fetchedMessages = messagesSnapshot.docs.map((doc) => doc.data());
    const fetchedMessages = messagesSnapshot.docs.map((doc) => doc.data()) as Message[];


    setMessages(fetchedMessages);
  }
};

// **Ambil Chat Secara Real-Time**
// useEffect(() => {
//   if (!activeQueueNumber) return;

//   const messagesQuery = query(
//     collection(db, "chats"),
//     where("queueNumber", "==", activeQueueNumber),
//     orderBy("createdAt", "asc")
//   );

//   // Gunakan onSnapshot agar data real-time diperbarui tanpa refresh
//   const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
//     const fetchedMessages = snapshot.docs.map((doc) => doc.data());
//     setMessages(fetchedMessages);
//   });

//   return () => unsubscribe(); // Cleanup listener saat komponen unmount
// }, [activeQueueNumber]);


// **Fungsi untuk Mengirim Pesan**
//JANGAN HAPUS DULU YAA
// const handleSendMessage = async (e) => {
const handleSendMessage = async (e: React.FormEvent) => {

  e.preventDefault();

  if (!newMessage.trim()) return; // Cegah pesan kosong

  // if (!selectedWorker) {
  //   console.error("No worker selected");
  //   return;
  // }

  // Struktur data pesan
  const messageData = {
    sender: "Admin",
    text: newMessage,
    // senderRekomendasi: selectedWorker.role,
    // textRekomendasi: `Rekomendasi Worker dari Admin ${selectedWorker.role}`,

    // senderRekomendasi: selectedWorker.role,
    // textRekomendasi: `Rekomendasi Worker dari Admin ${selectedWorker.role}`,
    // profilePictureUrl: selectedWorker.profilePictureUrl,

    // queueNumber: activeQueueNumber,
    queueNumber: activeQueueNumber || "", // <--- ini solusinya!
    // timestamp: new Date(),
    createdAt: new Date(),
    recipient: selectedUser ? selectedUser.uid : null, // Kirim ke user terkait

  };

  // Simpan pesan ke Firestore
  // await addDoc(collection(db, "chats"), messageData);

  if (!newMessage) return;
    if (!newMessage) return;
    await addDoc(collection(db, 'chats'), {
      text: newMessage,
      sender: 'Admin',
      queueNumber: activeQueueNumber,
      // createdAt: new Date(),
      timestamp: new Date(),
    });
  

  // Tambahkan pesan ke state lokal agar langsung muncul di UI
  setMessages((prevMessages) => [...prevMessages, messageData]);

  // Reset input
  setNewMessage("");
};


// const handleSendMessageRekomendasi = async () => {
//   if (!selectedWorker) {
//     console.error("Tidak ada worker yang dipilih.");
//     return;
//   }

//   const user = auth.currentUser;

//   const rekomendasiData = {
//     user: user,
//     sender: "Admin",
//     text: `Rekomendasi Worker: ${selectedWorker.role}`,
//     senderRekomendasi: selectedWorker.role,
//     profilePictureUrl: selectedWorker.profilePictureUrl,
//     queueNumber: activeQueueNumber || "",
//     createdAt: new Date(),
//     recipient: selectedUser ? selectedUser.uid : null,
//   };

//   try {
//     await addDoc(collection(db, "chats"), {
//       ...rekomendasiData,
//       timestamp: new Date(),
//     });

//     // Tambahkan ke UI lokal
//     setMessages((prev) => [...prev, rekomendasiData]);

//     // Optional: Notifikasi atau feedback
//     alert("Rekomendasi berhasil dikirim.");
//   } catch (error) {
//     console.error("Gagal mengirim rekomendasi:", error);
//     alert("Terjadi kesalahan saat mengirim rekomendasi.");
//   }
// };

const handleSendMessageRekomendasi = async () => {
  if (!selectedWorker) {
    console.error("Tidak ada worker yang dipilih.");
    return;
  }

  const rekomendasiData = {
    sender: "Admin",
    text: `Rekomendasi Worker: ${selectedWorker.role}`,
    type: "rekomendasi", // 💡 penanda khusus
    senderRekomendasi: selectedWorker.role,
    profilePictureUrl: selectedWorker.profilePictureUrl,
    specialRole: selectedWorker.specialRole,
    portofolioUrl: selectedWorker.portofolioUrl,
    description: selectedWorker.description || "",
    queueNumber: activeQueueNumber || "",
    createdAt: new Date(),
    recipient: selectedUser ? selectedUser.uid : null,
  };

  try {
    await addDoc(collection(db, "chats"), {
      ...rekomendasiData,
      timestamp: new Date(),
    });

    setMessages((prev) => [...prev, rekomendasiData]);
    alert("Rekomendasi berhasil dikirim.");
  } catch (error) {
    console.error("Gagal mengirim rekomendasi:", error);
    alert("Terjadi kesalahan saat mengirim rekomendasi.");
  }
};



// **Ambil Chat Secara Real-Time**
useEffect(() => {
  if (!activeQueueNumber) return;

  const messagesQuery = query(
    collection(db, "chats"),
    where("queueNumber", "==", activeQueueNumber),
    orderBy("timestamp", "asc")
  );

  // Gunakan onSnapshot agar data real-time diperbarui tanpa refresh
  const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
    // const fetchedMessages = snapshot.docs.map((doc) => doc.data());
    // setMessages(fetchedMessages);
    const fetchedMessages = snapshot.docs.map((doc) => doc.data() as Message);
setMessages(fetchedMessages);
  });

  return () => unsubscribe(); // Cleanup listener saat komponen unmount
}, [activeQueueNumber]);

// useEffect(() => {
//   if (!activeQueueNumber) return;

//   const chatQuery = query(
//     collection(db, 'chats'),
//     where('queueNumber', '==', activeQueueNumber),
//     orderBy('createdAt', 'asc')
//   );

//   const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
//     const chatMessages = snapshot.docs.map((doc) => doc.data() as Message);
//     console.log('Admin received messages:', chatMessages); // Debugging
//     setMessages(chatMessages);
//   });

//   return () => unsubscribe();
// }, [activeQueueNumber]);

  return (
    <div className="container mx-auto p-6">
      <NavbarAdmin/>
      <h1 className="text-4xl font-extrabold text-gray-800">Dashboard Admin</h1>
      <p>Selamat datang, Admin!</p>

      <h2 className="text-2xl font-bold mb-4">Daftar Antrian</h2>

      {/* List of current queues */}
      {/* <ul className="space-y-4">
        {queueList.length > 0 ? (
          queueList.map((queue) => (
            <li key={queue.id} className="p-4 bg-gray-100 border border-gray-200 rounded-lg shadow-md">
              <p className="font-semibold">Nomor Antrian: {queue.queueNumber}</p>
              <p>Nama: {queue.name || 'Belum diisi'}</p>
              <button
                className="mt-2 p-2 bg-blue-500 text-white rounded-lg"
                onClick={() => handleTalkClick(queue.queueNumber)}
              >
                Talk
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-600">Belum ada antrian.</p>
        )}
      </ul> */}

      {/* Chat popup */}
      {/* {chatOpen && (
        <div className="fixed bottom-0 right-0 bg-white shadow-lg p-4 w-1/3 h-1/3 border">
          <h2 className="font-bold">Chat with User (Queue {activeQueueNumber})</h2>
          <div className="overflow-y-scroll h-3/4 bg-gray-100 p-2">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <p className="text-sm font-semibold">{msg.sender}:</p>
                <p>{msg.text}</p>
              </div>
            ))}

            Tampilkan Data Worker
            <h3 className="font-bold mt-4">Data Worker Terkait</h3>
            {workerProfiles.length > 0 ? (
              workerProfiles.map((worker) => (
                <div key={worker.uid} className="mb-4 p-2 bg-white border border-gray-200 rounded-lg">
                  <p className="text-sm font-semibold">No Rekening: {worker.noRekening}</p>
                  <p>Role: {worker.role}</p>
                  <p>Special Role: {worker.specialRole}</p>
                  <a
                    href={worker.portofolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Lihat Portofolio
                  </a>
                  <img
                    src={worker.profilePictureUrl}
                    alt="Profile"
                    className="w-16 h-16 rounded-full mt-2"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-600">Belum ada data worker.</p>
            )}
          </div>
          <form onSubmit={handleSendMessage} className="mt-2 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow p-2 border"
              placeholder="Type a message..."
            />
            <button type="submit" className="bg-blue-500 text-white p-2">Send</button>
          </form>
        </div>
      )} */}
{/* List of current queues */}
<ul className="space-y-4">
      {queueList.length > 0 ? (
        queueList.map((queue) => (
          <li key={queue.id} className="p-4 bg-gray-100 border border-gray-200 rounded-lg shadow-md">
            <p className="font-semibold">Nomor Antrian: {queue.queueNumber}</p>
            <p>Nama: {queue.name || "Belum diisi"}</p>
            <button
              className="mt-2 p-2 bg-blue-500 text-white rounded-lg"
              // onClick={() => handleTalkClick(queue.queueNumber)}
              onClick={() => handleTalkClick(queue.queueNumber.toString())}

            >
              Talk
            </button>
          </li>
        ))
      ) : (
        <p className="text-gray-600">Belum ada antrian.</p>
      )}
    </ul>

    {/* Tampilkan Data Worker */}
    <h3 className="font-bold mt-4 text-gray-800">Data Worker Terkait</h3>
      {workerProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workerProfiles.map((worker) => (
            <div key={worker.uid} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Gambar Profil */}
              <div className="flex items-center space-x-4">
                <img
                  src={worker.profilePictureUrl}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                />
                <div>
                  <p className="text-xs font-semibold text-gray-700">No Rekening:</p>
                  <p className="text-xs font-medium text-gray-900">{worker.noRekening}</p>
                </div>
              </div>

              {/* Informasi Worker */}
              <div className="mt-3 text-xs">
                <p className="text-gray-700"><span className="font-semibold">Role:</span> {worker.role}</p>
                <p className="text-gray-700"><span className="font-semibold">Special Role:</span> {worker.specialRole}</p>
              </div>

              {/* Link Portofolio */}
              <div className="mt-3">
                <a
                  href={worker.portofolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-xs font-semibold hover:text-blue-800 transition duration-300"
                >
                  📂 Lihat Portofolio
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-xs">Belum ada data worker.</p>
      )}

    {/* Chat Popup */}
    {chatOpen && (
      // <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 w-full max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl h-auto md:h-2/3 border border-gray-300 flex flex-col ">
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 w-full 
                max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl 
                h-[80vh] md:h-2/3 
                max-h-[90vh] md:max-h-[80vh] 
                border border-gray-300 flex flex-col 
                overflow-y-auto z-50">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <h2 className="text-lg font-bold text-gray-800">
            Chat with {selectedUser ? selectedUser.name : "User"} (Queue {activeQueueNumber})
          </h2>
          <button onClick={() => setChatOpen(false)} className="text-gray-500 hover:text-red-500">
            ✖
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-2 rounded-lg space-y-3">
          {/* {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <p className="text-sm font-semibold text-gray-700">{msg.sender}:</p>
              <p className="text-gray-800 bg-white p-2 rounded-lg shadow-sm">{msg.text}</p>
            </div>
          ))} */}
          {messages.map((msg, index) => (
  <div key={index}> {/* Tambahkan key */}
    <p className="text-sm font-semibold">{msg.sender}:</p>
    <p>{msg.text}</p>
    {/* <p>{msg.senderRekomendasi}</p>
        <p>{msg.textRekomendasi}</p>
        <img
          src={msg.profilePictureUrl}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
        /> */}
  </div>
))}
          {/* Tampilkan Data Worker */}
      <h3 className="font-bold mt-4 text-gray-800">Data Worker Terkait</h3>
      {workerProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workerProfiles.map((worker) => (
            <div key={worker.uid} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Gambar Profil */}
              <div className="flex items-center space-x-4">
                <img
                  src={worker.profilePictureUrl}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                />
                <div>
                  <p className="text-xs font-semibold text-gray-700">No Rekening:</p>
                  <p className="text-xs font-medium text-gray-900">{worker.noRekening}</p>
                </div>
              </div>

              {/* Informasi Worker */}
              <div className="mt-3 text-xs">
                <p className="text-gray-700"><span className="font-semibold">Role:</span> {worker.role}</p>
                <p className="text-gray-700"><span className="font-semibold">Special Role:</span> {worker.specialRole}</p>
              </div>

              {/* Link Portofolio */}
              <div className="mt-3">
                <a
                  href={worker.portofolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-xs font-semibold hover:text-blue-800 transition duration-300"
                >
                  📂 Lihat Portofolio
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-xs">Belum ada data worker.</p>
      )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="mt-2 flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type a message..."
          />
          <button
          type="button"
          onClick={() => setShowWorkerData(!showWorkerData)}
          className="p-2 text-gray-500 hover:text-gray-700 transition duration-300"
        >
          📌
        </button>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300">
            Send
          </button>
        </form>
        {showWorkerData && (
        <>
          <h3 className="font-bold mt-4 text-gray-800">Data Worker Terkait</h3>
          {workerProfiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workerProfiles.map((worker) => (
                <div key={worker.uid} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center space-x-4">
                    <img
                      src={worker.profilePictureUrl}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">No Rekening:</p>
                      <p className="text-xs font-medium text-gray-900">{worker.noRekening}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs">
                    <p className="text-gray-700"><span className="font-semibold">Role:</span> {worker.role}</p>
                    <p className="text-gray-700"><span className="font-semibold">Special Role:</span> {worker.specialRole}</p>
                  </div>
                  <div className="mt-3">
                    <a
                      href={worker.portofolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-xs font-semibold hover:text-blue-800 transition duration-300"
                    >
                      📂 Lihat Portofolio
                    </a>
                  </div>
                  <button
                    onClick={() => setSelectedWorker(worker)}
                    className="mt-3 w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-700 transition duration-300"
                  >
                    Pilih
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-xs">Belum ada data worker.</p>
          )}
        </>
      )}

      {selectedWorker && (
  <div className="mt-4 bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300 p-3 bg-gray-100 rounded-lg">
    <p className="text-sm font-semibold text-gray-800">Worker yang Dipilih:</p>
    <div className="flex max-h-32 overflow-y-auto items-center space-x-2 mt-2">
      <img
        src={selectedWorker.profilePictureUrl}
        alt="Profile"
        className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
      />
      <p className="text-sm text-gray-700">{selectedWorker.role}</p>
    </div>
    <button
      type="submit"
      onClick={handleSendMessageRekomendasi}
      className="mt-3 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
    >
      Send
    </button>
  </div>
)}

      </div>
    )}

    </div>
  );
}

