// 'use client';

// import { useState, useEffect, ReactNode } from 'react';
// import { getDocs, collection, query, where, onSnapshot, addDoc, orderBy, doc, getDoc } from 'firebase/firestore';
// import { db, auth, storage } from '@/lib/firebaseConfig';
// //JANGAN DIHAPUS DULU useRouternya
// // import { useRouter } from 'next/navigation'; // For navigation to profile
// // import { FiUser } from 'react-icons/fi'; // Ensure react-icons is installed
// import NavbarUser from '@/app/navbaruser'; // Sesuaikan path sesuai struktur proyek Anda
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import {  Task, WorkerProfile } from "@/lib/types";
// import { FiUser } from 'react-icons/fi';

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

// // interface WorkerProfile {
// //   noRekening: string;
// //   role: string;
// //   specialRole: string;
// //   portofolioUrl: string;
// //   profilePictureUrl: string;
// //   uid: string;
// // }

// export default function UserDashboard() {
//   const [currentQueueNumber, setCurrentQueueNumber] = useState<number | null>(null);
//   const [chatOpen, setChatOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]); // Store messages from the chat
//   const [newMessage, setNewMessage] = useState(''); // For new messages
//   const [name, setName] = useState('');
//   //JANGAN DIHAPUS DULU
//   // const router = useRouter();
//   const [workerProfiles, setWorkerProfiles] = useState<WorkerProfile[]>([]); // State untuk menyimpan data worker

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
//               const chatMessages = snapshot.docs.map((doc) => doc.data() as Message);
//               setMessages(chatMessages);
//               if (chatMessages.length > 0) {
//                 setChatOpen(true); // Open the chat popup when a message is received
//               }
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

//   // Fetch worker profiles from Firestore
//   useEffect(() => {
//     const fetchWorkerProfiles = async () => {
//       const workersQuery = query(collection(db, 'workers'));
//       const querySnapshot = await getDocs(workersQuery);
//       // const workers = querySnapshot.docs.map((doc) => ({
//       //   id: doc.id,
//       //   ...doc.data(),
//       // })) as WorkerProfile[];
//       const workers = querySnapshot.docs.map((doc) => {
//         const data = doc.data() as Omit<WorkerProfile, 'id'>;
//         return {
//           id: doc.id,
//           ...data,
//         };
//       });
      

//       setWorkerProfiles(workers);
//     };

//     fetchWorkerProfiles();
//   }, []);

//   // const handleSendMessage = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   const user = auth.currentUser;
//   //   if (!newMessage) return;

//   //   await addDoc(collection(db, 'chats'), {
//   //     text: newMessage,
//   //     sender: user?.email || 'Unknown',
//   //     queueNumber: currentQueueNumber,
//   //     createdAt: new Date(),
//   //   });

//   //   setNewMessage('');
//   // };

//   //JANGAN DIHAPUS YAA IKIII
//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const user = auth.currentUser;
//     if (!newMessage) return;
  
//     await addDoc(collection(db, 'chats'), {
//       text: newMessage,
//       sender: user?.email || 'Unknown',
//       queueNumber: currentQueueNumber,
//       // createdAt: new Date(),
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
  
//             // Listen to chat updates based on queue number
//             const chatQuery = query(
//               collection(db, 'chats'),
//               where('queueNumber', '==', queueData.queueNumber),
//               // orderBy('createdAt', 'asc')
//               orderBy('timestamp', 'asc')
//             );
//             const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
//               const chatMessages = snapshot.docs.map((doc) => doc.data() as Message);
//               setMessages(chatMessages);
//               if (chatMessages.length > 0) {
//                 setChatOpen(true); // Open the chat popup when a message is received
//               }
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
//         queueNumber: `${Math.floor(Math.random() * 100)}`, // Generate random queue number
//       });

//       // Fetch ulang data setelah berhasil dapatkan nomor antrian
//       const q = query(collection(db, 'queues'), where('name', '==', name));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         const queueData = querySnapshot.docs[0].data();
//         setCurrentQueueNumber(queueData.queueNumber); // Set nomor antrian baru
//       }
//     } catch (error) {
//       console.error('Error getting queue number:', error);
//     }
//   };

//   //JANGAN DIHAPUS DULU
//   // const handleProfileClick = () => {
//   //   router.push('/profile');
//   // };

//   // const [selectedWorker, setSelectedWorker] = useState(null);
//   const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);

//   // const [file, setFile] = useState(null);
//   const [file, setFile] = useState<File | null>(null);

//   const [description, setDescription] = useState("");
//   const [deadline, setDeadline] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Fungsi untuk memilih worker
//   const handleChooseWorker = (worker:WorkerProfile) => {
//     setSelectedWorker(worker);
//   };

//   // useEffect(() => {
//   //   const user = auth.currentUser;
//   //   if (!user) return;

//   //   const q = query(collection(db, "tugasdariuser"), where("workerId", "==", user.uid));
//   //   // const unsubscribe = onSnapshot(q, (snapshot) => {
//   //   //   const tasks = [];
//   //   //   snapshot.forEach((doc) => {
//   //   //     tasks.push({ id: doc.id, ...doc.data() });
//   //   //   });
//   //   //   setNotifications(tasks);
//   //   // });
//   //   const unsubscribe = onSnapshot(q, (snapshot) => {
//   //     const tasks: Task[] = snapshot.docs.map((doc) => ({
//   //       id: doc.id,
//   //       ...doc.data(),
//   //     })) as Task[];
      
//   //     setNotifications(tasks);
//   //   });
    

//   //   return () => unsubscribe();
//   // }, []);

//   const [userNotifications, setUserNotifications] = useState<Task[]>([]); // State untuk notifikasi tugas
//     // const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   useEffect(() => {
//   const user = auth.currentUser;
//   if (!user) return;

//   const q = query(
//     collection(db, "tugasdariuser"),
//     where("userId", "==", user.uid),
//     orderBy("createdAt", "desc")
//   );

//   const unsubscribe = onSnapshot(q, (snapshot) => {
//     const notifs = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     setUserNotifications(notifs);
//   });

//   return () => unsubscribe();
// }, []);


//           // Fungsi untuk mengambil notifikasi tugas
  
//   // Fungsi untuk mengirim tugas ke Firebase
//   const handleSubmitTask = async (e: React.ChangeEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!selectedWorker || !file || !description || !deadline) {
//       alert("Harap isi semua field!");
//       return;
//     }
  
//     setIsLoading(true);
  
//     try {
//       // Upload file ke Firebase Storage
//       const fileRef = ref(storage, `tugas/${file.name}`);
//       await uploadBytes(fileRef, file);
//       const fileUrl = await getDownloadURL(fileRef);
  
//       // Pastikan workerName terdefinisi
//       const workerName = selectedWorker.name || selectedWorker.role || "Unknown Worker";
  
//       // Simpan data ke Firestore
//       const taskData = {
//         workerId: selectedWorker.uid,
//         workerName, // Gunakan workerName yang sudah dipastikan terdefinisi
//         fileName: file.name,
//         fileUrl,
//         description,
//         userId: auth.currentUser?.uid, // WAJIB agar bisa ditarik oleh user nanti
//         deadline,
//         status: "pending", // Status awal
//         createdAt: new Date(),
//       };
  
//       await addDoc(collection(db, "tugasdariuser"), taskData);
  
//       // Reset form
//       setSelectedWorker(null);
//       setFile(null);
//       setDescription("");
//       setDeadline("");
  
//       // Simulasi notifikasi ke worker
//       alert("Tugas berhasil dikirim! Worker akan menerima notifikasi.");
//     } catch (error) {
//       console.error("Error mengirim tugas: ", error);
//       alert("Terjadi kesalahan saat mengirim tugas.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

  
//   return (
//     <div className="container mx-auto p-6 ">
//       <NavbarUser/>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-4xl font-extrabold text-gray-800">Dashboard User</h1>
//         {/* <FiUser
//           className="text-4xl text-gray-800 cursor-pointer"
//           onClick={handleProfileClick}
//           title="Profile"
//         /> */}
//       </div>
//       <p className="mb-8 text-lg">Selamat datang, User!</p>
// {userNotifications.some((n) => !n.isRead) && (
//   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
//     {userNotifications.filter((n) => !n.isRead).length}
//   </span>
// )}

// <div className="mt-4 space-y-2">
//   {userNotifications.map((n) => (
//     <div key={n.id} className="p-2 border rounded text-sm bg-white shadow">
//       <p className="font-semibold text-gray-700">Status: {n.status}</p>
//       <p className="text-gray-600">Deskripsi: {n.description}</p>
//     </div>
//   ))}
// </div>

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
//             <div key={worker.uid} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
//               {/* Gambar Profil */}
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

//               {/* Informasi Worker */}
//               <div className="mt-3 text-xs">
//                 <p className="text-gray-700"><span className="font-semibold">Role:</span> {worker.role}</p>
//                 <p className="text-gray-700"><span className="font-semibold">Special Role:</span> {worker.specialRole}</p>
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

//                {/* Tombol Choose */}
//                <button
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
//                   // onChange={(e) => setFile(e.target.files[0])}
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
//                   // rows="3"
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
//                 {isLoading ? "Mengirim..." : "Kirim Tugas"}
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
//         <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 w-full 
//                 max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl 
//                 h-[80vh] md:h-2/3 
//                 max-h-[90vh] md:max-h-[80vh] 
//                 border border-gray-300 flex flex-col 
//                 overflow-y-auto z-50">
//                   <button onClick={() => setChatOpen(false)} className="flex justify-between items-center border-b pb-2 mb-2 text-gray-500 hover:text-red-500">
//             ✖
//           </button>
//           <h2 className="font-bold">Chat with Admin</h2>
//           <div className="overflow-y-scroll h-3/4 bg-gray-100 p-2">
//             {/* {messages.map((msg, index) => (
//               <div key={index} className="mb-2">
//                 <p className="text-sm font-semibold">{msg.sender}:</p>
//                 <p>{msg.text}</p>
//               </div>
//             ))} */}
//             {/* {messages.map((msg, index) => (
//   <div key={index}> 
//     <p className="text-sm font-semibold">{msg.sender}:</p>
//     <p>{msg.text}</p>
//   </div>
// ))} */}
// {messages.map((msg, index) => (
//   <div key={index} className="mb-4">
//     <div className="p-2 bg-blue-100 text-sm rounded-lg">
//       <p><strong>{msg.sender}:</strong> {msg.text}</p>
//     </div>

//     {msg.type === "rekomendasi" && (
//       <div className="mt-2 border rounded-lg p-3 bg-gray-50 shadow-sm">
//         <p className="text-sm font-semibold text-gray-800">Worker yang Direkomendasikan:</p>
//         <div className="flex items-center space-x-3 mt-2">
//           <img
//             src={msg.profilePictureUrl}
//             alt="Foto Worker"
//             className="w-10 h-10 rounded-full border object-cover"
//           />
//           <div>
//             <p className="text-sm"><strong>Role:</strong> {msg.senderRekomendasi}</p>
//             <p className="text-sm"><strong>Special Role:</strong> {msg.specialRole}</p>
//             <a
//               href={msg.portofolioUrl}
//               className="text-blue-600 hover:underline text-sm mt-1 inline-block"
//               target="_blank" rel="noopener noreferrer"
//             >
//               📁 Lihat Portofolio
//             </a>
//             <p className="text-xs text-gray-600 mt-2">{msg.description}</p>
//           </div>
//         </div>
//       </div>
//     )}
//   </div>
// ))}

// {/* Tampilkan Data Worker */}
// <h3 className="font-bold mt-4 text-gray-800">Data Worker Terkait</h3>
//       {workerProfiles.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {workerProfiles.map((worker) => (
//             <div key={worker.uid} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
//               {/* Gambar Profil */}
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

//               {/* Informasi Worker */}
//               <div className="mt-3 text-xs">
//                 <p className="text-gray-700"><span className="font-semibold">Role:</span> {worker.role}</p>
//                 <p className="text-gray-700"><span className="font-semibold">Special Role:</span> {worker.specialRole}</p>
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
//                {/* Tombol Choose */}
//                <button
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
//                   // onChange={(e) => setFile(e.target.files[0])}
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
//                   // rows="3"
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
//                 {isLoading ? "Mengirim..." : "Kirim Tugas"}
//               </button>

//               {/* Tombol Batal */}
//               <button
//                 type="button"
//                 onClick={() => setSelectedWorker(null)}
//                 className="w-full mt-2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition duration-300"
//               >
//                 Batal
//               </button>
//               {/* Tampilkan Status Tugas */}

//             </form>
//           </div>
//         </div>
//       )}

      
//       {/* Notifikasi Tugas */}
//         {/* <div className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifikasi Tugas</h2>
//           {notifications.length > 0 ? (
//             <div className="space-y-4">
//               {notifications.map((task) => (
//                 <div
//                   key={task.id}
//                   className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
//                   onClick={() => handleViewTask(task)}
//                 >
//                   <p className="text-lg font-semibold text-gray-800">Tugas Baru dari User</p>
//                   <p className="text-sm text-gray-600">Deadline: {new Date(task.deadline).toLocaleString()}</p>
//                   <p className="text-sm text-gray-600">Status: {task.status}</p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-600">Tidak ada tugas baru.</p>
//           )}
//         </div> */}
//         {/* Progress Bar dan Upload Progress */}
// {/* {selectedTask?.status === "acc" && (
//   <div className="mt-4">
//     <p className="text-lg font-semibold">Progress Pengerjaan</p>
//     <div className="w-full bg-gray-200 rounded-full h-2.5">
//       <div
//         className="bg-blue-600 h-2.5 rounded-full"
//         style={{ width: `${progressPercentage}%` }}
//       ></div>
//     </div>
//     <p className="text-sm text-gray-600">{progressPercentage.toFixed(2)}% selesai</p>
//     <input
//       type="file"
//       onChange={handleUploadProgress}
//       className="mt-2"
//     />
//   </div>
// )} */}
//     </div>
//   );
// }







'use client';

import { useState, useEffect, ReactNode, useRef } from 'react';
import { getDocs, collection, query, where, onSnapshot, addDoc, orderBy, updateDoc, setDoc ,doc, getDoc } from 'firebase/firestore';
import { db, auth, storage } from '@/lib/firebaseConfig';
import Swal from 'sweetalert2'; // pastikan kamu sudah install: npm i sweetalert2

import NavbarUser from '@/app/navbaruser'; // Sesuaikan path sesuai struktur proyek Anda
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {  Task, WorkerProfile } from "@/lib/types";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useRouter } from "next/navigation";


// useEffect(() => {
//   if (userNotifications.length > 0) {
//     const latest = userNotifications[0];
//     if (latest.status === 'acc') {
//       toast.success("✅ Tugas kamu telah di-ACC oleh worker!");
//     } else if (latest.status === 'decline') {
//       toast.error("❌ Tugas kamu ditolak oleh worker.");
//     }
//   }
// }, [userNotifications]);

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
  const [messages, setMessages] = useState<Message[]>([]); // Store messages from the chat
  const [newMessage, setNewMessage] = useState(''); // For new messages
  const [name, setName] = useState('');

  const [workerProfiles, setWorkerProfiles] = useState<WorkerProfile[]>([]); // State untuk menyimpan data worker
  const [progressFiles, setProgressFiles] = useState<{ [key: string]: any[] }>({});


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
              const chatMessages = snapshot.docs.map((doc) => doc.data() as Message);
              setMessages(chatMessages);
              if (chatMessages.length > 0) {
                setChatOpen(true); // Open the chat popup when a message is received
              }
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

  useEffect(() => {
  const fetchProgressFiles = async () => {
    try {
      const snapshot = await getDocs(collection(db, "jawabanWorker"));
      const tempFiles: { [key: string]: any[] } = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        const taskId = data.taskId;

        if (!tempFiles[taskId]) tempFiles[taskId] = [];
        tempFiles[taskId].push(data);
      });

      setProgressFiles(tempFiles);
    } catch (err) {
      console.error("❌ Error fetching progress files:", err);
    }
  };

  fetchProgressFiles();
}, []);


  // Fetch worker profiles from Firestore
  useEffect(() => {
    const fetchWorkerProfiles = async () => {
      const workersQuery = query(collection(db, 'workers'));
      const querySnapshot = await getDocs(workersQuery);
      
      const workers = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<WorkerProfile, 'id'>;
        return {
          id: doc.id,
          ...data,
        };
      });
      

      setWorkerProfiles(workers);
    };

    fetchWorkerProfiles();
  }, []);

  //JANGAN DIHAPUS YAA IKIII
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!newMessage) return;
  
    await addDoc(collection(db, 'chats'), {
      text: newMessage,
      sender: user?.email || 'Unknown',
      queueNumber: currentQueueNumber,
      // createdAt: new Date(),
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
  
            // Listen to chat updates based on queue number
            const chatQuery = query(
              collection(db, 'chats'),
              where('queueNumber', '==', queueData.queueNumber),
              // orderBy('createdAt', 'asc')
              orderBy('timestamp', 'asc')
            );
            const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
              const chatMessages = snapshot.docs.map((doc) => doc.data() as Message);
              setMessages(chatMessages);
              if (chatMessages.length > 0) {
                setChatOpen(true); // Open the chat popup when a message is received
              }
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
        queueNumber: `${Math.floor(Math.random() * 100)}`, // Generate random queue number
      });

      // Fetch ulang data setelah berhasil dapatkan nomor antrian
      const q = query(collection(db, 'queues'), where('name', '==', name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const queueData = querySnapshot.docs[0].data();
        setCurrentQueueNumber(queueData.queueNumber); // Set nomor antrian baru
      }
    } catch (error) {
      console.error('Error getting queue number:', error);
    }
  };

  // const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);

  // const [file, setFile] = useState(null);
  const [file, setFile] = useState<File | null>(null);

  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk memilih worker
  const handleChooseWorker = (worker:WorkerProfile) => {
    setSelectedWorker(worker);
  };

  const [userNotifications, setUserNotifications] = useState<Task[]>([]); // State untuk notifikasi tugas
    // const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   useEffect(() => {
//   const user = auth.currentUser;
//   if (!user) return;

//   const q = query(
//     collection(db, "tugasdariuser"),
//     where("userId", "==", user.uid),
//     orderBy("createdAt", "desc")
//   );

//   const unsubscribe = onSnapshot(q, (snapshot) => {
//     const notifs = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     setUserNotifications(notifs);
//   });

//   return () => unsubscribe();
// }, []);
useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, "tugasdariuser"),
    where("userId", "==", user.uid),
    where("isRead", "==", false),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const notifs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUserNotifications(notifs.slice(0, 5)); // Maksimal 5 terbaru
  });

  return () => unsubscribe();
}, []);
//JANGAN DIHAPUS DULU IKIII
// const handleClickNotif = async (notifId: string) => {
//   const notifRef = doc(db, "tugasdariuser", notifId);

//   try {
//     const notifSnap = await getDoc(notifRef);
//     if (!notifSnap.exists()) return;

//     const notifData = notifSnap.data();

//     await updateDoc(notifRef, { isRead: true });

//     // 🔔 Tampilkan toast sesuai status
//     if (notifData.status === "acc") {
//       Swal.fire({
//         icon: "success",
//         title: "Tugas Diterima!",
//         text: "Tugas kamu telah di-ACC oleh worker.",
//         timer: 3000,
//         showConfirmButton: false,
//       });
//     } else if (notifData.status === "decline") {
//       Swal.fire({
//         icon: "error",
//         title: "Tugas Ditolak",
//         text: notifData.declineReason
//           ? `Alasan: ${notifData.declineReason}`
//           : "Tugas kamu ditolak.",
//         timer: 3000,
//         showConfirmButton: false,
//       });
//     }

//     // 🔁 Scroll otomatis ke elemen notifikasi yang diklik
//     const targetRef = progressRefs.current[notifId];
//     if (targetRef) {
//       targetRef.scrollIntoView({ behavior: "smooth", block: "center" });
//     }

//   } catch (error) {
//     console.error("Gagal membaca notifikasi:", error);
//     Swal.fire({
//       icon: "error",
//       title: "Gagal!",
//       text: "Tidak dapat memproses notifikasi.",
//     });
//   }
// };


// const progressRef = useRef<HTMLDivElement>(null);
const progressRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});



useEffect(() => {
  if (userNotifications.length > 0) {
    const latest = userNotifications[0];
    if (latest.status === 'acc') {
      toast.success("✅ Tugas kamu telah di-ACC oleh worker!");
    } else if (latest.status === 'decline') {
      toast.error("❌ Tugas kamu ditolak oleh worker.");
    }
  }
}, [userNotifications]);

// const [selectedPaymentTask, setSelectedPaymentTask] = useState(null);
// const [showPaymentPopup, setShowPaymentPopup] = useState(false);


// useEffect(() => {
//   const completedTask = userNotifications.find(
//     (n) => n.progress >= 100 && n.statusProgress === "Task Completed" && !n.paymentTriggered
//   );

//   if (completedTask) {
//     setSelectedPaymentTask(completedTask); // Simpan task ke state untuk diproses
//     setShowPaymentPopup(true); // Munculkan modal pembayaran
//   }
// }, [userNotifications]);


// const handlePayment = async (taskId: string, nominal: number, amountToWorker: number) => {
//   try {
//     const paymentRef = doc(db, "payments", taskId);
//     await setDoc(paymentRef, {
//       taskId,
//       nominal,
//       fee: nominal * 0.1,
//       totalReceived: amountToWorker,
//       status: "pending",
//       createdAt: new Date(),
//     });

//     // ✅ Panggil Midtrans (Snap URL / WebView kalau di mobile)
//     const snapRes = await fetch("/api/midtrans", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ order_id: taskId, gross_amount: nominal }),
//     });
//     const { snapUrl } = await snapRes.json();

//     window.open(snapUrl, "_blank");

//     // ✅ Update UI
//     setShowPaymentPopup(false);
//     alert("Silakan lanjutkan pembayaran di tab baru.");

//   } catch (error) {
//     console.error("Gagal memproses pembayaran:", error);
//     alert("Terjadi kesalahan saat memproses pembayaran.");
//   }
// };



// ===================== USER SIDE =====================
// State untuk memunculkan popup pembayaran
const [selectedPaymentTask, setSelectedPaymentTask] = useState(null);
const [showPaymentPopup, setShowPaymentPopup] = useState(false);
const [paymentSuccess, setPaymentSuccess] = useState(false);

const router = useRouter();

useEffect(() => {
  if (paymentSuccess) {
    setTimeout(() => {
      router.push("/dashboard-user"); // atau router.refresh() jika hanya mau reload dashboard
    }, 4000);
  }
}, [paymentSuccess]);
// useEffect(() => {
//   const completedTask = userNotifications.find(
//     (n) => n.progress >= 100 && n.statusProgress === "Task Completed" && !n.paymentTriggered
//   );

//   if (completedTask) {
//     setSelectedPaymentTask(completedTask);
//     setShowPaymentPopup(true);
//   }
// }, [userNotifications]);
useEffect(() => {
  const checkPaymentStatus = async () => {
    for (const n of userNotifications) {
      if (n.progress >= 100 && n.statusProgress === "Task Completed") {
        const paymentRef = doc(db, "payments", n.id);
        const snap = await getDoc(paymentRef);
        const data = snap.exists() ? snap.data() : null;

        if (!data || data.status !== "success") {
          setSelectedPaymentTask(n);
          setShowPaymentPopup(true);
          return; // stop loop, hanya tampilkan satu popup saja
        }
      }
    }
  };

  checkPaymentStatus();
}, [userNotifications]);

useEffect(() => {
  const unpaidTask = userNotifications.find(
    (n) =>
      n.progress >= 100 &&
      n.statusProgress === "Task Completed" &&
      !n.paymentTriggered &&
      n.paymentStatus !== "success"
  );

  if (unpaidTask) {
    setSelectedPaymentTask(unpaidTask);
    setShowPaymentPopup(true);
  }
}, [userNotifications]);


// Fungsi untuk memproses pembayaran
// const handlePayment = async (taskId, nominal, amountToWorker) => {
//   try {
//     await setDoc(doc(db, "payments", taskId), {
//       taskId,
//       nominal,
//       fee: nominal * 0.1,
//       totalReceived: amountToWorker,
//       status: "pending",
//       createdAt: new Date(),
//     });

//     // ⛳ FIXED API CALL
//     const snapRes = await fetch("/api/midtrans", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ order_id: taskId, gross_amount: nominal }),
//     });

//     const { snapUrl } = await snapRes.json();

//     window.open(snapUrl, "_blank");
//     setShowPaymentPopup(false);
//     alert("Silakan lanjutkan pembayaran di tab baru.");
//   } catch (error) {
//     console.error("Gagal memproses pembayaran:", error);
//     alert("Terjadi kesalahan saat memproses pembayaran.");
//   }
// };

const handlePayment = async (taskId, nominal, amountToWorker) => {
  try {
    const orderId = `${taskId}-${Date.now()}`; // ✅ Jadikan order_id unik

    await setDoc(doc(db, "payments", orderId), {
      taskId,
      orderId,
      nominal,
      fee: nominal * 0.1,
      totalReceived: amountToWorker,
      status: "pending",
      createdAt: new Date(),
    });

    const snapRes = await fetch("/api/midtrans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, gross_amount: nominal }),
    });

    const { snapUrl } = await snapRes.json();

    const paymentWindow = window.open(snapUrl, "_blank");
    const interval = setInterval(async () => {
      const statusDoc = await getDoc(doc(db, "payments", orderId));
      const paymentData = statusDoc.data();
      if (paymentData?.status === "success") {
        clearInterval(interval);
        setShowPaymentPopup(false);
        setPaymentSuccess(true);
        setSelectedPaymentTask(null);
      }
    }, 3000);

  } catch (error) {
    console.error("Gagal memproses pembayaran:", error);
    alert("Terjadi kesalahan saat memproses pembayaran.");
  }
};


// const progressRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
// const [userNotifications, setUserNotifications] = useState<any[]>([]);

// 2. Fetch Data Notifikasi
useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, 'tugasdariuser'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const notifs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUserNotifications(notifs);
  });

  return () => unsubscribe();
}, []);

// 3. Handle Click Notif + Scroll
const handleClickNotif = async (notifId: string) => {
  const notifRef = doc(db, 'tugasdariuser', notifId);

  try {
    const notifSnap = await getDoc(notifRef);
    if (!notifSnap.exists()) return;

    const notifData = notifSnap.data();
    await updateDoc(notifRef, { isRead: true });

    // 🔔 Toast sesuai status
    if (notifData.status === 'acc') {
      Swal.fire({ icon: 'success', title: 'Tugas Diterima!', text: 'Tugas kamu telah di-ACC oleh worker.', timer: 3000, showConfirmButton: false });
    } else if (notifData.status === 'decline') {
      Swal.fire({ icon: 'error', title: 'Tugas Ditolak', text: notifData.declineReason ? `Alasan: ${notifData.declineReason}` : 'Tugas kamu ditolak.', timer: 3000, showConfirmButton: false });
    } else if (notifData.progress >= 100 && notifData.statusProgress === 'Task Completed') {
      Swal.fire({ icon: 'success', title: 'Progress Selesai', text: 'Tugas telah selesai 100%.', timer: 3000, showConfirmButton: false });
    }

    // Scroll ke progress
    const targetRef = progressRefs.current[notifId];
    if (targetRef) {
      targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({ icon: 'error', title: 'Oops!', text: 'Gagal membaca notifikasi.' });
  }
};
  
  // Fungsi untuk mengirim tugas ke Firebase
  const handleSubmitTask = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedWorker || !file || !description || !deadline) {
      alert("Harap isi semua field!");
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Upload file ke Firebase Storage
      const fileRef = ref(storage, `tugas/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
  
      // Pastikan workerName terdefinisi
      const workerName = selectedWorker.name || selectedWorker.role || "Unknown Worker";
  
      // Simpan data ke Firestore
      const taskData = {
        workerId: selectedWorker.uid,
        workerName, // Gunakan workerName yang sudah dipastikan terdefinisi
        fileName: file.name,
        fileUrl,
        description,
        userId: auth.currentUser?.uid, // WAJIB agar bisa ditarik oleh user nanti
        deadline,
        status: "pending", // Status awal
        createdAt: new Date(),
      };
  
      await addDoc(collection(db, "tugasdariuser"), taskData);
  
      // Reset form
      setSelectedWorker(null);
      setFile(null);
      setDescription("");
      setDeadline("");
  
      // Simulasi notifikasi ke worker
      alert("Tugas berhasil dikirim! Worker akan menerima notifikasi.");
    } catch (error) {
      console.error("Error mengirim tugas: ", error);
      alert("Terjadi kesalahan saat mengirim tugas.");
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <div className="container mx-auto p-6 ">
      <NavbarUser/>
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800">Dashboard User</h1>
        {/* <FiUser
          className="text-4xl text-gray-800 cursor-pointer"
          onClick={handleProfileClick}
          title="Profile"
        /> */}
      </div>
      <p className="mb-8 text-lg">Selamat datang, User!</p>
      {paymentSuccess && (
  <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-4 rounded shadow-lg z-50 animate-bounce">
    <p>🎉 Pembayaran berhasil! Terima kasih telah menyelesaikan transaksi.</p>
    <button
      onClick={() => setPaymentSuccess(false)}
      className="ml-4 text-sm underline hover:text-white"
    >
      Tutup
    </button>
  </div>
)}

{userNotifications.some((n) => !n.isRead) && (
  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
    {userNotifications.filter((n) => !n.isRead).length}
  </span>
)}

{/* <div className="mt-4 space-y-2">
  {userNotifications.map((n) => (
    <div key={n.id} className="p-2 border rounded text-sm bg-white shadow">
      <p className="font-semibold text-gray-700">Status: {n.status}</p>
      <p className="text-gray-600">Deskripsi: {n.description}</p>
    </div>
  ))}
</div> */}


{/* <div className="mt-4 space-y-2">
  {userNotifications
    .filter((n) => n.isRead === false)         // 🧹 hanya yang belum dibaca
    .slice(0, 5)                               // 🔢 ambil 5 terbaru
    .map((n) => (
      <div
        key={n.id}
        className="p-4 border rounded-lg shadow bg-white hover:bg-blue-50 cursor-pointer transition-all duration-200"
        onClick={async () => {
          // 🔁 AUTO tandai sebagai dibaca
          await updateDoc(doc(db, "tugasdariuser", n.id), { isRead: true });

          // 🔔 TOAST Notifikasi jika acc / decline
          if (n.status === "acc") {
            Swal.fire({
              icon: 'success',
              title: 'Tugas Diterima!',
              text: 'Tugas kamu telah di-ACC oleh worker.',
              timer: 3000,
              showConfirmButton: false
            });
          } else if (n.status === "decline") {
            Swal.fire({
              icon: 'error',
              title: 'Tugas Ditolak',
              text: n.declineReason ? `Alasan: ${n.declineReason}` : 'Tugas kamu ditolak.',
              timer: 3000,
              showConfirmButton: false
            });
          }
        }}
      >
        <p className="text-sm text-gray-700"><strong>Status:</strong> {n.status}</p>
        <p className="text-sm text-gray-600"><strong>Deskripsi:</strong> {n.description}</p>
        <p className="text-sm text-gray-600"><strong>File:</strong> <a href={n.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{n.fileName}</a></p>
        <p className="text-xs text-gray-500 mt-1">Deadline: {new Date(n.deadline).toLocaleString()}</p>
      </div>
    ))}
</div> */}

{/* <div className="mt-4 space-y-4">
  {userNotifications.map((n) => (
    <div
      key={n.id}
      onClick={() => handleClickNotif(n.id)}
      ref={(el) => (progressRefs.current[n.id] = el)} // ← Set ref untuk notif ini
      className="p-4 border rounded bg-white shadow hover:bg-gray-50 cursor-pointer transition"
    >
      <p className="font-bold text-blue-700">📎 {n.fileName}</p>
      <p className="text-sm text-gray-700">📝 {n.description}</p>
      <p className="text-sm text-gray-500">🕒 Deadline: {new Date(n.deadline).toLocaleString()}</p>
      <p className="text-sm text-gray-500">📂 <a href={n.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Download File</a></p>
      <p className={`text-sm font-semibold ${n.status === 'acc' ? 'text-green-600' : n.status === 'decline' ? 'text-red-500' : 'text-gray-600'}`}>Status: {n.status}</p>
      {n.progress && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">Progress: {n.progress.toFixed(2)}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${n.progress}%` }}></div>
          </div>
        </div>
      )}
    </div>
  ))}
</div> */}


<div className="mt-4 space-y-4">
    {userNotifications.map((n) => {
      const isCompleted = n.progress >= 100 && n.statusProgress === 'Task Completed';
      if (isCompleted) return null;
      const files = progressFiles[n.id] || [];


      return (
        <div
          key={n.id}
          onClick={() => handleClickNotif(n.id)}
          ref={(el) => (progressRefs.current[n.id] = el)}
          className="p-4 border rounded bg-white shadow hover:bg-gray-50 cursor-pointer transition"
        >
          <p className="font-bold text-blue-700">📎 {n.fileName}</p>
          <p className="text-sm text-gray-700">📝 {n.description}</p>
          <p className="text-sm text-gray-500">🕒 Deadline: {new Date(n.deadline).toLocaleString()}</p>
          <p className="text-sm text-gray-500">📂 <a href={n.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Download File</a></p>
          <p className={`text-sm font-semibold ${n.status === 'acc' ? 'text-green-600' : n.status === 'decline' ? 'text-red-500' : 'text-gray-600'}`}>Status: {n.status}</p>
          {n.progress && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">Progress: {n.progress.toFixed(2)}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${n.progress}%` }}></div>
              </div>
            </div>
          )}
          {/* 📂 File progress */}
        {files.length > 0 && (
          <div className="mt-4 bg-gray-50 p-3 rounded border">
            <p className="text-sm font-semibold mb-2">📥 File Progress oleh Worker:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {files.map((f, i) => (
                <li key={i}>
                  <a
                    href={f.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {f.fileName}
                  </a>{" "}
                  {/* <span className="text-gray-400 text-xs">({new Date(f.uploadedAt.seconds * 1000).toLocaleString()})</span> */}
                  <span className="text-gray-400 text-xs">
  ({new Date(
    f.uploadedAt?.seconds ? f.uploadedAt.seconds * 1000 : f.uploadedAt
  ).toLocaleString()})
</span>

                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      );
    })}
  </div>

  {/* {showPaymentPopup && selectedPaymentTask && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Pembayaran Tugas</h2>
      <p className="mb-2">Tugas: {selectedPaymentTask.description}</p>
      <p className="mb-2">Deadline: {new Date(selectedPaymentTask.deadline).toLocaleString()}</p>
      <p className="mb-2">Progress: {selectedPaymentTask.progress.toFixed(2)}%</p>

      Hitung Nominal
      {(() => {
        const nominal = selectedPaymentTask.nominal || 100000; // fallback jika belum ada nominal
        const fee = nominal * 0.1;
        const totalDiterima = nominal - fee;

        return (
          <>
            <p className="mb-2">Total Pembayaran: Rp {nominal.toLocaleString()}</p>
            <p className="mb-2 text-sm text-gray-600">Fee Admin (10%): Rp {fee.toLocaleString()}</p>
            <p className="mb-4 font-bold text-green-600">Total Diterima Worker: Rp {totalDiterima.toLocaleString()}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => handlePayment(selectedPaymentTask.id, nominal, totalDiterima)}
            >
              Bayar Sekarang (Midtrans)
            </button>
          </>
        );
      })()}
    </div>
  </div>
)} */}
{/* // ===================== POPUP PAYMENT =====================
{showPaymentPopup && selectedPaymentTask && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Pembayaran Tugas</h2>
      <p className="mb-2">Tugas: {selectedPaymentTask.description}</p>
      <p className="mb-2">Deadline: {new Date(selectedPaymentTask.deadline).toLocaleString()}</p>
      <p className="mb-2">Progress: {selectedPaymentTask.progress.toFixed(2)}%</p>

      {(() => {
        const nominal = selectedPaymentTask.nominal || "belum ada nominal"; // fallback jika belum ada nominal
        const fee = nominal * 0.1;
        const totalDiterima = nominal - fee;

        return (
          <>
            <p className="mb-2">Total Pembayaran: Rp {nominal.toLocaleString()}</p>
            <p className="mb-2 text-sm text-gray-600">Fee Admin (10%): Rp {fee.toLocaleString()}</p>
            <p className="mb-4 font-bold text-green-600">Total Diterima Worker: Rp {totalDiterima.toLocaleString()}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => handlePayment(selectedPaymentTask.id, nominal, totalDiterima)}
            >
              Bayar Sekarang (Midtrans)
            </button>
          </>
        );
      })()}
    </div>
  </div>
)} */}

{showPaymentPopup && selectedPaymentTask && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="relative bg-white p-6 rounded shadow-lg w-full max-w-md">
      
      {/* Tombol X / Close */}
      <button
        onClick={() => setShowPaymentPopup(false)}
        className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg font-bold"
        aria-label="Tutup"
      >
        &times;
      </button>

      <h2 className="text-xl font-semibold mb-4">Pembayaran Tugas</h2>
      <p className="mb-2">Tugas: {selectedPaymentTask.description}</p>
      <p className="mb-2">Deadline: {new Date(selectedPaymentTask.deadline).toLocaleString()}</p>
      <p className="mb-2">Progress: {selectedPaymentTask.progress.toFixed(2)}%</p>

      {(() => {
        const nominal = selectedPaymentTask.nominal || 0;
        const fee = nominal * 0.1;
        const totalDiterima = nominal - fee;

        return (
          <>
            <p className="mb-2">Total Pembayaran: Rp {nominal.toLocaleString()}</p>
            <p className="mb-2 text-sm text-gray-600">Fee Admin (10%): Rp {fee.toLocaleString()}</p>
            <p className="mb-4 font-bold text-green-600">
              Total Diterima Worker: Rp {totalDiterima.toLocaleString()}
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => handlePayment(selectedPaymentTask.id, nominal, totalDiterima)}
            >
              Bayar Sekarang (Midtrans)
            </button>
          </>
        );
      })()}
    </div>
  </div>
)}



      <form onSubmit={handleGetQueueNumber}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan Nama Anda"
          className="w-full p-2 mb-4 border"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white">
          Dapatkan Nomor Antrian
        </button>
      </form>

      <div className="bg-gray-100 p-4 border rounded mt-4">
        {currentQueueNumber ? (
          <p className="text-xl font-semibold">Nomor Antrian Ke: {currentQueueNumber}</p>
        ) : (
          <p className="text-lg">Belum ada nomor antrian tersedia.</p>
        )}
      </div>

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

               {/* Tombol Choose */}
               <button
                onClick={() => handleChooseWorker(worker)}
                className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Choose
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-xs">Belum ada data worker.</p>
      )}

      {/* Form Pengiriman Tugas */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Kirim Tugas ke {selectedWorker.name}</h2>
            <form onSubmit={handleSubmitTask}>
              {/* Input File */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Upload File</label>
                <input
                  type="file"
                  // onChange={(e) => setFile(e.target.files[0])}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      setFile(selectedFile);
                    }
                  }}
                  
                  className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                  required
                />
              </div>

              {/* Input Deskripsi */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Deskripsi Tugas</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  // rows="3"
                  rows={3}
                  required
                ></textarea>
              </div>

              {/* Input Deadline */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Deadline</label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                {isLoading ? "Mengirim..." : "Kirim Tugas"}
              </button>

              {/* Tombol Batal */}
              <button
                type="button"
                onClick={() => setSelectedWorker(null)}
                className="w-full mt-2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition duration-300"
              >
                Batal
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Chat popup */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 w-full 
                max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl 
                h-[80vh] md:h-2/3 
                max-h-[90vh] md:max-h-[80vh] 
                border border-gray-300 flex flex-col 
                overflow-y-auto z-50">
                  <button onClick={() => setChatOpen(false)} className="flex justify-between items-center border-b pb-2 mb-2 text-gray-500 hover:text-red-500">
            ✖
          </button>
          <h2 className="font-bold">Chat with Admin</h2>
          <div className="overflow-y-scroll h-3/4 bg-gray-100 p-2">
          
{messages.map((msg, index) => (
  <div key={index} className="mb-4">
    <div className="p-2 bg-blue-100 text-sm rounded-lg">
      <p><strong>{msg.sender}:</strong> {msg.text}</p>
    </div>

    {msg.type === "rekomendasi" && (
      <div className="mt-2 border rounded-lg p-3 bg-gray-50 shadow-sm">
        <p className="text-sm font-semibold text-gray-800">Worker yang Direkomendasikan:</p>
        <div className="flex items-center space-x-3 mt-2">
          <img
            src={msg.profilePictureUrl}
            alt="Foto Worker"
            className="w-10 h-10 rounded-full border object-cover"
          />
          <div>
            <p className="text-sm"><strong>Role:</strong> {msg.senderRekomendasi}</p>
            <p className="text-sm"><strong>Special Role:</strong> {msg.specialRole}</p>
            <a
              href={msg.portofolioUrl}
              className="text-blue-600 hover:underline text-sm mt-1 inline-block"
              target="_blank" rel="noopener noreferrer"
            >
              📁 Lihat Portofolio
            </a>
            <p className="text-xs text-gray-600 mt-2">{msg.description}</p>
          </div>
        </div>
      </div>
    )}
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
               {/* Tombol Choose */}
               <button
                onClick={() => handleChooseWorker(worker)}
                className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Choose
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-xs">Belum ada data worker.</p>
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
      )}
      {/* Form Pengiriman Tugas */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Kirim Tugas ke {selectedWorker.name}</h2>
            <form onSubmit={handleSubmitTask}>
              {/* Input File */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Upload File</label>
                <input
                  type="file"
                  // onChange={(e) => setFile(e.target.files[0])}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      setFile(selectedFile);
                    }
                  }}
                  
                  className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                  required
                />
              </div>

              {/* Input Deskripsi */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Deskripsi Tugas</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  // rows="3"
                  rows={3}
                  required
                ></textarea>
              </div>

              {/* Input Deadline */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Deadline</label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                {isLoading ? "Mengirim..." : "Kirim Tugas"}
              </button>

              {/* Tombol Batal */}
              <button
                type="button"
                onClick={() => setSelectedWorker(null)}
                className="w-full mt-2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition duration-300"
              >
                Batal
              </button>
              {/* Tampilkan Status Tugas */}

            </form>
          </div>
        </div>
      )}

    </div>
  );
}



