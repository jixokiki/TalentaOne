// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
// // import { auth, db } from '@/lib/firebaseConfig';
// // import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda
// // import { Task } from '@/lib/types';

// // // Tentukan tipe data untuk layanan
// // interface Service {
// //   id: string;
// //   serviceName: string;
// //   description: string;
// // }

// // export default function Services() {
// //   const [services, setServices] = useState<Service[]>([]);
// //   const [showNotifications, setShowNotifications] = useState(false);
// //   const [notifications, setNotifications] = useState<Task[]>([]); // State untuk notifikasi tugas
// //   const [progressPercentage, setProgressPercentage] = useState(0); // State untuk progress bar
// //     const [selectedTask, setSelectedTask] = useState<Task | null>(null);

// //   const handleViewTask = async (task: Task) => {
// //     const taskRef = doc(db, "tugasdariuser", task.id);
// //     const taskSnap = await getDoc(taskRef);
  
// //     if (taskSnap.exists()) {
// //       const data = taskSnap.data();
// //       setProgressPercentage(data.progress || 0); // Ambil progress
// //     }
  
// //     setSelectedTask(task);
// //   };

// //   useEffect(() => {
// //     const fetchServices = async () => {
// //       const querySnapshot = await getDocs(collection(db, 'services'));
// //       const servicesData = querySnapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       })) as Service[];

// //       setServices(servicesData);
// //     };

// //     fetchServices();
// //   }, []);

// //   // Fungsi untuk mengambil notifikasi tugas
// //   useEffect(() => {
// //     const user = auth.currentUser;
// //     if (!user) return;

// //     const q = query(collection(db, "tugasdariuser"), where("workerId", "==", user.uid));
// //     // const unsubscribe = onSnapshot(q, (snapshot) => {
// //     //   const tasks = [];
// //     //   snapshot.forEach((doc) => {
// //     //     tasks.push({ id: doc.id, ...doc.data() });
// //     //   });
// //     //   setNotifications(tasks);
// //     // });
// //     const unsubscribe = onSnapshot(q, (snapshot) => {
// //       const tasks: Task[] = snapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       })) as Task[];
      
// //       setNotifications(tasks);
// //     });
    

// //     return () => unsubscribe();
// //   }, []);

// //   return (
// //     <div className="max-w-2xl mx-auto py-32">
// //       <Navbar/>
// //       <h2 className="text-2xl font-bold mb-4">Available Services</h2>
// //       <ul>
// //         {services.map((service) => (
// //           <li key={service.id} className="mb-4 p-4 border-b">
// //             <h3 className="text-xl font-semibold">{service.serviceName}</h3>
// //             <p>{service.description}</p>
// //           </li>
// //         ))}
// //       </ul>

// //     <button
// //       onClick={() => setShowNotifications((prev) => !prev)}
// //       className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
// //     >
// //       Services
// //     </button>

// //     {/* Notifikasi Tugas */}
// //     {showNotifications && (
// //       <div className="mb-8 mt-4">
// //         <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifikasi Tugas</h2>
// //         {notifications.length > 0 ? (
// //           <div className="space-y-4">
// //             {notifications.map((task) => (
// //               <div
// //                 key={task.id}
// //                 className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
// //                 onClick={() => handleViewTask(task)}
// //               >
// //                 <p className="text-lg font-semibold text-gray-800">Tugas Baru dari User</p>
// //                 <p className="text-sm text-gray-600">
// //                   Deadline: {new Date(task.deadline).toLocaleString()}
// //                 </p>
// //                 <p className="text-sm text-gray-600">Status: {task.status}</p>
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-gray-600">Tidak ada tugas baru.</p>
// //         )}
// //       </div>
// //     )}

// //     {/* Popup Detail Tugas */}
// // {selectedTask && (
// //   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
// //     <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
// //       <h2 className="text-xl font-bold mb-4">Detail Tugas</h2>
// //       <div className="space-y-4">
// //         <p><strong>File:</strong> <a href={selectedTask.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedTask.fileName}</a></p>
// //         <p><strong>Deskripsi:</strong> {selectedTask.description}</p>
// //         <p><strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleString()}</p>
// //         <p><strong>Status:</strong> {selectedTask.status}</p>
// //       </div>
// //       {/* <div className="mt-6 flex space-x-4">
// //         {selectedTask.status === "pending" && (
// //           <>
// //             <button
// //               onClick={() => handleTaskResponse(selectedTask.id, "acc","")}
// //               className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
// //             >
// //               Acc
// //             </button>
// //             <button
// //               onClick={() => setShowDeclineReason(true)} // Tampilkan input alasan decline
// //               className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
// //             >
// //               Decline
// //             </button>
// //           </>
// //         )}
// //         <button
// //           onClick={() => setSelectedTask(null)}
// //           className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
// //         >
// //           Tutup
// //         </button>
// //       </div> */}

// //       {/* Popup Alasan Decline */}
// //       {/* {showDeclineReason && (
// //         <div className="mt-4">
// //           <textarea
// //             value={declineReason}
// //             onChange={(e) => setDeclineReason(e.target.value)}
// //             placeholder="Masukkan alasan decline..."
// //             className="w-full p-2 border border-gray-300 rounded-lg"
// //             // rows="3"
// //             rows={3}
// //           />
// //           <button
// //             onClick={() => handleTaskResponse(selectedTask.id, "decline", declineReason)}
// //             className="mt-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
// //           >
// //             Kirim Alasan
// //           </button>
// //         </div>
// //       )} */}

// //       {/* Progress Bar dan Upload Progress */}
// // {selectedTask?.status === "acc" && (
// //   <div className="mt-4">
// //     <p className="text-lg font-semibold">Progress Pengerjaan</p>
// //     <div className="w-full bg-gray-200 rounded-full h-2.5">
// //       <div
// //         className="bg-blue-600 h-2.5 rounded-full"
// //         style={{ width: `${progressPercentage}%` }}
// //       ></div>
// //     </div>
// //     <p className="text-sm text-gray-600">{progressPercentage.toFixed(2)}% selesai</p>
// //     {/* <input
// //       type="file"
// //       onChange={handleUploadProgress}
// //       className="mt-2"
// //     /> */}
// //   </div>
// // )}
// //     </div>
// //   </div>
// // )}
// //     </div>
// //   );
// // }





// 'use client';

// import { useEffect, useState } from 'react';
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   onSnapshot,
//   // query,
//   // where
// } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebaseConfig';
// import Navbar from '@/app/navbar';
// import { Task } from '@/lib/types';

// interface Service {
//   id: string;
//   serviceName: string;
//   description: string;
// }



// export default function Services() {
//   const [services, setServices] = useState<Service[]>([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState<Task[]>([]);
//   const [progressPercentage, setProgressPercentage] = useState(0);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);

//   const handleViewTask = async (task: Task) => {
//     const taskRef = doc(db, "tugasdariuser", task.id);
//     const taskSnap = await getDoc(taskRef);

//     if (taskSnap.exists()) {
//       const data = taskSnap.data();
//       setProgressPercentage(data.progress || 0);
//     }

//     setSelectedTask(task);
//   };

//   useEffect(() => {
//     const fetchServices = async () => {
//       const querySnapshot = await getDocs(collection(db, 'services'));
//       const servicesData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Service[];

//       setServices(servicesData);
//     };

//     fetchServices();
//   }, []);

// //   useEffect(() => {
// //   const unsubscribe = auth.onAuthStateChanged((user) => {
// //     if (!user) return;

// //     const q = query(
// //       collection(db, "jawabanWorker"),
// //       where("userEmail", "==", user.email)
// //     );

// //     const unsubSnapshot = onSnapshot(q, (snapshot) => {
// //       const tasks: Task[] = snapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       })) as Task[];

// //       setNotifications(tasks);
// //     });

// //     return () => unsubSnapshot();
// //   });

// //   return () => unsubscribe();
// // }, []);


// // useEffect(() => {
// //   const unsubscribe = auth.onAuthStateChanged((user) => {
// //     if (!user) return;

// //     const q = query(
// //       collection(db, "jawabanWorker"),
// //       where("userEmail", "==", user.email)
// //     );

// //     const unsubSnapshot = onSnapshot(q, async (snapshot) => {
// //       const taskPromises = snapshot.docs.map(async (docSnap) => {
// //         const data = docSnap.data();
// //         const taskId = data.taskId;

// //         // Ambil data tugas dari koleksi tugasdariuser
// //         const tugasRef = doc(db, "tugasdariuser", taskId);
// //         const tugasSnap = await getDoc(tugasRef);
// //         const tugasData = tugasSnap.exists() ? tugasSnap.data() : {};

// //         return {
// //           id: docSnap.id,
// //           ...data,
// //           deadline: tugasData.deadline || null,
// //         } as Task;
// //       });

// //       const enrichedTasks = await Promise.all(taskPromises);
// //       setNotifications(enrichedTasks);
// //     });

// //     return () => unsubSnapshot();
// //   });

// //   return () => unsubscribe();
// // }, []);

// //JANGAN DIHAPUS YA IKI
// // useEffect(() => {
// //   const unsubscribe = auth.onAuthStateChanged((user) => {
// //     if (!user) {
// //       console.log("Belum login. Tidak bisa ambil jawabanWorker.");
// //       return;
// //     }

// //     console.log("User login dengan email:", user.email);

// //     const q = query(
// //       collection(db, "jawabanWorker"),
// //       where("userEmail", "==", user.email)
// //     );

// //     const unsubSnapshot = onSnapshot(q, async (snapshot) => {
// //       console.log("Jumlah dokumen ditemukan di jawabanWorker:", snapshot.size);

// //       if (snapshot.empty) {
// //         console.log("Tidak ada data di jawabanWorker untuk user ini.");
// //         return;
// //       }

// //       const taskPromises = snapshot.docs.map(async (docSnap) => {
// //         const data = docSnap.data();
// //         const taskId = data.taskId;

// //         console.log("Data jawabanWorker ditemukan:", data);

// //         const tugasRef = doc(db, "tugasdariuser", taskId);
// //         const tugasSnap = await getDoc(tugasRef);
        
// //         if (tugasSnap.exists()) {
// //           console.log("Data tugas dari user ditemukan:", tugasSnap.data());
// //           return {
// //             id: tugasSnap.id,
// //             ...tugasSnap.data(),
// //           } as Task;
// //         } else {
// //           console.warn(`Tugas dengan ID ${taskId} tidak ditemukan di tugasdariuser.`);
// //           return null;
// //         }
// //       });

// //       const resolvedTasks = (await Promise.all(taskPromises)).filter(Boolean) as Task[];
// //       setNotifications(resolvedTasks);
// //     });

// //     return () => unsubSnapshot();
// //   });

// //   return () => unsubscribe();
// // }, []);

// //JANGAN DIHAPUS KI
// // useEffect(() => {
// //   const unsubscribe = auth.onAuthStateChanged((user) => {
// //     if (!user) {
// //       console.log("Belum login. Tidak bisa ambil jawabanWorker.");
// //       return;
// //     }

// //     console.log("User login dengan email:", user.email);

// //     // Ambil semua data di jawabanWorker tanpa filter userEmail
// //     const q = query(collection(db, "tugasdariuser"));

// //     const unsubSnapshot = onSnapshot(q, async (snapshot) => {
// //       console.log("Jumlah dokumen ditemukan di tugasdariuser:", snapshot.size);

// //       if (snapshot.empty) {
// //         console.log("Tidak ada data di tugasdariuser.");
// //         return;
// //       }

// //       const taskPromises = snapshot.docs.map(async (docSnap) => {
// //         const data = docSnap.data();
// //         const taskId = data.taskId;

// //         console.log("Data tugasdariuser ditemukan:", data);

// //         const tugasRef = doc(db, "tugasdariuser", taskId);
// //         const tugasSnap = await getDoc(tugasRef);

// //         if (tugasSnap.exists()) {
// //           console.log("Data tugas dari user ditemukan:", tugasSnap.data());
// //           return {
// //             id: tugasSnap.id,
// //             ...tugasSnap.data(),
// //           } as Task;
// //         } else {
// //           console.warn(`Tugas dengan ID ${taskId} tidak ditemukan di tugasdariuser.`);
// //           return null;
// //         }
// //       });

// //       const resolvedTasks = (await Promise.all(taskPromises)).filter(Boolean) as Task[];
// //       setNotifications(resolvedTasks);
// //     });

// //     return () => unsubSnapshot();
// //   });

// //   return () => unsubscribe();
// // }, []);

// useEffect(() => {
//   const unsubscribe = auth.onAuthStateChanged((user) => {
//     if (!user) {
//       console.log("Belum login. Tidak bisa ambil tugas.");
//       return;
//     }

//     console.log("User login dengan email:", user.email);

//     const unsubSnapshot = onSnapshot(collection(db, "tugasdariuser"), (snapshot) => {
//       const tasks: Task[] = snapshot.docs.map((docSnap) => ({
//         id: docSnap.id,
//         ...docSnap.data(),
//       })) as Task[];

//       console.log("📦 Tugas ditemukan:", tasks);
//       setNotifications(tasks);
//     });

//     return () => unsubSnapshot();
//   });

//   return () => unsubscribe();
// }, []);



//   // useEffect(() => {
//   //   const user = auth.currentUser;
//   //   if (!user) return;

//   //   const q = query(
//   //     collection(db, "jawabanWorker"),
//   //     where("taskId", "==", user.uid)
//   //   );

//   //   const unsubscribe = onSnapshot(q, (snapshot) => {
//   //     const tasks: Task[] = snapshot.docs.map((doc) => ({
//   //       id: doc.id,
//   //       ...doc.data(),
//   //     })) as Task[];
//   //     setNotifications(tasks);
//   //   });

//   //   return () => unsubscribe();
//   // }, []);

//   return (
//     <div className="max-w-2xl mx-auto py-32 px-4">
//       <Navbar />

//       {/* Layanan */}
//       <h2 className="text-2xl font-bold mb-4">Available Services</h2>
//       <ul>
//         {services.map((service) => (
//           <li key={service.id} className="mb-4 p-4 border-b">
//             <h3 className="text-xl font-semibold">{service.serviceName}</h3>
//             <p>{service.description}</p>
//           </li>
//         ))}
//       </ul>

//       {/* Tombol toggle notifikasi */}
//       <button
//         onClick={() => setShowNotifications((prev) => !prev)}
//         className="mt-6 bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 transition"
//       >
//         {showNotifications ? 'Sembunyikan Notifikasi' : 'Tampilkan Notifikasi Tugas'}
//       </button>

//       {/* Notifikasi Tugas */}
//       {showNotifications && (
//         <div className="mt-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifikasi Pengerjaan</h2>
//           {notifications.length > 0 ? (
//             <div className="space-y-4">
//               {notifications.map((task) => (
//                 <div
//                   key={task.id}
//                   className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
//                   onClick={() => handleViewTask(task)}
//                 >
//                   <p className="text-lg font-semibold text-gray-800">Tugas Worker Anda</p>
//                   <p className="text-sm text-gray-600">Deadline: {new Date(task.deadline).toLocaleString()}</p>
//                   <p className="text-sm text-gray-600">Status: {task.status}</p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-600">Tidak ada tugas baru.</p>
//           )}

//           {/* Progress Bar jika task dipilih */}
//           {selectedTask && (
//             <div className="mt-6">
//               <h3 className="text-lg font-semibold mb-2">Progress Tugas: {progressPercentage.toFixed(1)}%</h3>
//               <div className="w-full bg-gray-200 rounded-full h-4">
//                 <div
//                   className="bg-green-500 h-4 rounded-full transition-all"
//                   style={{ width: `${progressPercentage}%` }}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }















// 'use client';

// import { useEffect, useState } from 'react';
// import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebaseConfig';
// import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda
// import { Task } from '@/lib/types';

// // Tentukan tipe data untuk layanan
// interface Service {
//   id: string;
//   serviceName: string;
//   description: string;
// }

// export default function Services() {
//   const [services, setServices] = useState<Service[]>([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState<Task[]>([]); // State untuk notifikasi tugas
//   const [progressPercentage, setProgressPercentage] = useState(0); // State untuk progress bar
//     const [selectedTask, setSelectedTask] = useState<Task | null>(null);

//   const handleViewTask = async (task: Task) => {
//     const taskRef = doc(db, "tugasdariuser", task.id);
//     const taskSnap = await getDoc(taskRef);
  
//     if (taskSnap.exists()) {
//       const data = taskSnap.data();
//       setProgressPercentage(data.progress || 0); // Ambil progress
//     }
  
//     setSelectedTask(task);
//   };

//   useEffect(() => {
//     const fetchServices = async () => {
//       const querySnapshot = await getDocs(collection(db, 'services'));
//       const servicesData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Service[];

//       setServices(servicesData);
//     };

//     fetchServices();
//   }, []);

//   // Fungsi untuk mengambil notifikasi tugas
//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const q = query(collection(db, "tugasdariuser"), where("workerId", "==", user.uid));
//     // const unsubscribe = onSnapshot(q, (snapshot) => {
//     //   const tasks = [];
//     //   snapshot.forEach((doc) => {
//     //     tasks.push({ id: doc.id, ...doc.data() });
//     //   });
//     //   setNotifications(tasks);
//     // });
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const tasks: Task[] = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Task[];
      
//       setNotifications(tasks);
//     });
    

//     return () => unsubscribe();
//   }, []);

//   return (
//     <div className="max-w-2xl mx-auto py-32">
//       <Navbar/>
//       <h2 className="text-2xl font-bold mb-4">Available Services</h2>
//       <ul>
//         {services.map((service) => (
//           <li key={service.id} className="mb-4 p-4 border-b">
//             <h3 className="text-xl font-semibold">{service.serviceName}</h3>
//             <p>{service.description}</p>
//           </li>
//         ))}
//       </ul>

//     <button
//       onClick={() => setShowNotifications((prev) => !prev)}
//       className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
//     >
//       Services
//     </button>

//     {/* Notifikasi Tugas */}
//     {showNotifications && (
//       <div className="mb-8 mt-4">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifikasi Tugas</h2>
//         {notifications.length > 0 ? (
//           <div className="space-y-4">
//             {notifications.map((task) => (
//               <div
//                 key={task.id}
//                 className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
//                 onClick={() => handleViewTask(task)}
//               >
//                 <p className="text-lg font-semibold text-gray-800">Tugas Baru dari User</p>
//                 <p className="text-sm text-gray-600">
//                   Deadline: {new Date(task.deadline).toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-600">Status: {task.status}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-600">Tidak ada tugas baru.</p>
//         )}
//       </div>
//     )}

//     {/* Popup Detail Tugas */}
// {selectedTask && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//     <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
//       <h2 className="text-xl font-bold mb-4">Detail Tugas</h2>
//       <div className="space-y-4">
//         <p><strong>File:</strong> <a href={selectedTask.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedTask.fileName}</a></p>
//         <p><strong>Deskripsi:</strong> {selectedTask.description}</p>
//         <p><strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleString()}</p>
//         <p><strong>Status:</strong> {selectedTask.status}</p>
//       </div>
//       {/* <div className="mt-6 flex space-x-4">
//         {selectedTask.status === "pending" && (
//           <>
//             <button
//               onClick={() => handleTaskResponse(selectedTask.id, "acc","")}
//               className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
//             >
//               Acc
//             </button>
//             <button
//               onClick={() => setShowDeclineReason(true)} // Tampilkan input alasan decline
//               className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
//             >
//               Decline
//             </button>
//           </>
//         )}
//         <button
//           onClick={() => setSelectedTask(null)}
//           className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
//         >
//           Tutup
//         </button>
//       </div> */}

//       {/* Popup Alasan Decline */}
//       {/* {showDeclineReason && (
//         <div className="mt-4">
//           <textarea
//             value={declineReason}
//             onChange={(e) => setDeclineReason(e.target.value)}
//             placeholder="Masukkan alasan decline..."
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             // rows="3"
//             rows={3}
//           />
//           <button
//             onClick={() => handleTaskResponse(selectedTask.id, "decline", declineReason)}
//             className="mt-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
//           >
//             Kirim Alasan
//           </button>
//         </div>
//       )} */}

//       {/* Progress Bar dan Upload Progress */}
// {selectedTask?.status === "acc" && (
//   <div className="mt-4">
//     <p className="text-lg font-semibold">Progress Pengerjaan</p>
//     <div className="w-full bg-gray-200 rounded-full h-2.5">
//       <div
//         className="bg-blue-600 h-2.5 rounded-full"
//         style={{ width: `${progressPercentage}%` }}
//       ></div>
//     </div>
//     <p className="text-sm text-gray-600">{progressPercentage.toFixed(2)}% selesai</p>
//     {/* <input
//       type="file"
//       onChange={handleUploadProgress}
//       className="mt-2"
//     /> */}
//   </div>
// )}
//     </div>
//   </div>
// )}
//     </div>
//   );
// }





// 'use client';

// import { useEffect, useState } from 'react';
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   onSnapshot,
//   // query,
//   // where
// } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebaseConfig';
// import Navbar from '@/app/navbar';
// import { Task } from '@/lib/types';

// interface Service {
//   id: string;
//   serviceName: string;
//   description: string;
// }



// export default function Services() {
//   const [services, setServices] = useState<Service[]>([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState<Task[]>([]);
//   const [progressPercentage, setProgressPercentage] = useState(0);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);

//   // const handleViewTask = async (task: Task) => {
//   //   const taskRef = doc(db, "tugasdariuser", task.id);
//   //   const taskSnap = await getDoc(taskRef);

//   //   if (taskSnap.exists()) {
//   //     const data = taskSnap.data();
//   //     setProgressPercentage(data.progress || 0);
//   //   }

//   //   setSelectedTask(task);
//   // };

//   useEffect(() => {
//     const fetchServices = async () => {
//       const querySnapshot = await getDocs(collection(db, 'services'));
//       const servicesData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Service[];

//       setServices(servicesData);
//     };

//     fetchServices();
//   }, []);

// const handleViewTask = async (task: Task) => {
//   const taskRef = doc(db, "tugasdariuser", task.id);
//   const taskSnap = await getDoc(taskRef);

//   if (taskSnap.exists()) {
//     const data = taskSnap.data();
//     setProgressPercentage(data.progress || 0);
//     setSelectedTask({ ...task, fileTugasAkhir: data.fileTugasAkhir });
//   }
// };


// useEffect(() => {
//   const unsubscribe = auth.onAuthStateChanged((user) => {
//     if (!user) {
//       console.log("Belum login. Tidak bisa ambil tugas.");
//       return;
//     }

//     console.log("User login dengan email:", user.email);

//     const unsubSnapshot = onSnapshot(collection(db, "tugasdariuser"), (snapshot) => {
//       const tasks: Task[] = snapshot.docs.map((docSnap) => ({
//         id: docSnap.id,
//         ...docSnap.data(),
//       })) as Task[];

//       console.log("📦 Tugas ditemukan:", tasks);
//       setNotifications(tasks);
//     });

//     return () => unsubSnapshot();
//   });

//   return () => unsubscribe();
// }, []);

//   return (
//     <div className="max-w-2xl mx-auto py-32 px-4">
//       <Navbar />

//       {/* Layanan */}
//       <h2 className="text-2xl font-bold mb-4">Available Services</h2>
//       <ul>
//         {services.map((service) => (
//           <li key={service.id} className="mb-4 p-4 border-b">
//             <h3 className="text-xl font-semibold">{service.serviceName}</h3>
//             <p>{service.description}</p>
//           </li>
//         ))}
//       </ul>

//       {/* Tombol toggle notifikasi */}
//       <button
//         onClick={() => setShowNotifications((prev) => !prev)}
//         className="mt-6 bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 transition"
//       >
//         {showNotifications ? 'Sembunyikan Notifikasi' : 'Tampilkan Notifikasi Tugas'}
//       </button>

//       {/* Notifikasi Tugas */}
//       {showNotifications && (
//         <div className="mt-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifikasi Pengerjaan</h2>
//           {notifications.length > 0 ? (
//             <div className="space-y-4">
//               {notifications.map((task) => (
//                 <div
//                   key={task.id}
//                   className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
//                   onClick={() => handleViewTask(task)}
//                 >
//                   <p className="text-lg font-semibold text-gray-800">Tugas Worker Anda</p>
//                   <p className="text-sm text-gray-600">Deadline: {new Date(task.deadline).toLocaleString()}</p>
//                   <p className="text-sm text-gray-600">Status: {task.status}</p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-600">Tidak ada tugas baru.</p>
//           )}

//           {/* Progress Bar jika task dipilih */}
//           {selectedTask && (
//             <div className="mt-6">
//               <h3 className="text-lg font-semibold mb-2">Progress Tugas: {progressPercentage.toFixed(1)}%</h3>
//               <div className="w-full bg-gray-200 rounded-full h-4">
//                 <div
//                   className="bg-green-500 h-4 rounded-full transition-all"
//                   style={{ width: `${progressPercentage}%` }}
//                 />
//               </div>
//             {selectedTask?.fileTugasAkhir && (
//   <div className="mt-4">
//     <a
//       href={selectedTask.fileTugasAkhir}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//     >
//       Download File Tugas Akhir
//     </a>
//   </div>
// )}

//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
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
import Navbar from '@/app/navbar';
import { Task } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  FiBell,
  FiBellOff,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiDownload,
} from 'react-icons/fi';

interface Service {
  id: string;
  serviceName: string;
  description: string;
}

// ========== Helpers UI ==========
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm ${className}`} />
);

function formatDateTime(input: any) {
  try {
    const d = new Date(input);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString();
  } catch {
    return '-';
  }
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
      const data = taskSnap.data() as any;
      setProgressPercentage(data.progress || 0);
      setSelectedTask({ ...task, fileTugasAkhir: (data as any).fileTugasAkhir });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log('Belum login. Tidak bisa ambil tugas.');
        setLoadingTasks(false);
        return;
      }

      console.log('User login dengan email:', user.email);

      const unsubSnapshot = onSnapshot(collection(db, 'tugasdariuser'), (snapshot) => {
        const tasks: Task[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Task[];

        console.log('📦 Tugas ditemukan:', tasks);
        setNotifications(tasks);
        setLoadingTasks(false);
      });

      // Catatan: mengikuti struktur aslinya—cleanup snapshot ada di dalam callback
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
                                {formatDateTime((task as any).deadline)}
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
                        Klik untuk melihat progres dan file tugas akhir (jika ada).
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

                  {selectedTask?.fileTugasAkhir && (
                    <a
                      href={selectedTask.fileTugasAkhir as any}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:scale-[1.02] hover:shadow-indigo-600/30 active:scale-[0.99]"
                    >
                      <FiDownload />
                      Download File Tugas Akhir
                    </a>
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
