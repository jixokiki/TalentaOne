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

interface Service {
  id: string;
  serviceName: string;
  description: string;
}



export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Task[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleViewTask = async (task: Task) => {
    const taskRef = doc(db, "tugasdariuser", task.id);
    const taskSnap = await getDoc(taskRef);

    if (taskSnap.exists()) {
      const data = taskSnap.data();
      setProgressPercentage(data.progress || 0);
    }

    setSelectedTask(task);
  };

  useEffect(() => {
    const fetchServices = async () => {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const servicesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[];

      setServices(servicesData);
    };

    fetchServices();
  }, []);

//   useEffect(() => {
//   const unsubscribe = auth.onAuthStateChanged((user) => {
//     if (!user) return;

//     const q = query(
//       collection(db, "jawabanWorker"),
//       where("userEmail", "==", user.email)
//     );

//     const unsubSnapshot = onSnapshot(q, (snapshot) => {
//       const tasks: Task[] = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Task[];

//       setNotifications(tasks);
//     });

//     return () => unsubSnapshot();
//   });

//   return () => unsubscribe();
// }, []);


// useEffect(() => {
//   const unsubscribe = auth.onAuthStateChanged((user) => {
//     if (!user) return;

//     const q = query(
//       collection(db, "jawabanWorker"),
//       where("userEmail", "==", user.email)
//     );

//     const unsubSnapshot = onSnapshot(q, async (snapshot) => {
//       const taskPromises = snapshot.docs.map(async (docSnap) => {
//         const data = docSnap.data();
//         const taskId = data.taskId;

//         // Ambil data tugas dari koleksi tugasdariuser
//         const tugasRef = doc(db, "tugasdariuser", taskId);
//         const tugasSnap = await getDoc(tugasRef);
//         const tugasData = tugasSnap.exists() ? tugasSnap.data() : {};

//         return {
//           id: docSnap.id,
//           ...data,
//           deadline: tugasData.deadline || null,
//         } as Task;
//       });

//       const enrichedTasks = await Promise.all(taskPromises);
//       setNotifications(enrichedTasks);
//     });

//     return () => unsubSnapshot();
//   });

//   return () => unsubscribe();
// }, []);

//JANGAN DIHAPUS YA IKI
// useEffect(() => {
//   const unsubscribe = auth.onAuthStateChanged((user) => {
//     if (!user) {
//       console.log("Belum login. Tidak bisa ambil jawabanWorker.");
//       return;
//     }

//     console.log("User login dengan email:", user.email);

//     const q = query(
//       collection(db, "jawabanWorker"),
//       where("userEmail", "==", user.email)
//     );

//     const unsubSnapshot = onSnapshot(q, async (snapshot) => {
//       console.log("Jumlah dokumen ditemukan di jawabanWorker:", snapshot.size);

//       if (snapshot.empty) {
//         console.log("Tidak ada data di jawabanWorker untuk user ini.");
//         return;
//       }

//       const taskPromises = snapshot.docs.map(async (docSnap) => {
//         const data = docSnap.data();
//         const taskId = data.taskId;

//         console.log("Data jawabanWorker ditemukan:", data);

//         const tugasRef = doc(db, "tugasdariuser", taskId);
//         const tugasSnap = await getDoc(tugasRef);
        
//         if (tugasSnap.exists()) {
//           console.log("Data tugas dari user ditemukan:", tugasSnap.data());
//           return {
//             id: tugasSnap.id,
//             ...tugasSnap.data(),
//           } as Task;
//         } else {
//           console.warn(`Tugas dengan ID ${taskId} tidak ditemukan di tugasdariuser.`);
//           return null;
//         }
//       });

//       const resolvedTasks = (await Promise.all(taskPromises)).filter(Boolean) as Task[];
//       setNotifications(resolvedTasks);
//     });

//     return () => unsubSnapshot();
//   });

//   return () => unsubscribe();
// }, []);

//JANGAN DIHAPUS KI
// useEffect(() => {
//   const unsubscribe = auth.onAuthStateChanged((user) => {
//     if (!user) {
//       console.log("Belum login. Tidak bisa ambil jawabanWorker.");
//       return;
//     }

//     console.log("User login dengan email:", user.email);

//     // Ambil semua data di jawabanWorker tanpa filter userEmail
//     const q = query(collection(db, "tugasdariuser"));

//     const unsubSnapshot = onSnapshot(q, async (snapshot) => {
//       console.log("Jumlah dokumen ditemukan di tugasdariuser:", snapshot.size);

//       if (snapshot.empty) {
//         console.log("Tidak ada data di tugasdariuser.");
//         return;
//       }

//       const taskPromises = snapshot.docs.map(async (docSnap) => {
//         const data = docSnap.data();
//         const taskId = data.taskId;

//         console.log("Data tugasdariuser ditemukan:", data);

//         const tugasRef = doc(db, "tugasdariuser", taskId);
//         const tugasSnap = await getDoc(tugasRef);

//         if (tugasSnap.exists()) {
//           console.log("Data tugas dari user ditemukan:", tugasSnap.data());
//           return {
//             id: tugasSnap.id,
//             ...tugasSnap.data(),
//           } as Task;
//         } else {
//           console.warn(`Tugas dengan ID ${taskId} tidak ditemukan di tugasdariuser.`);
//           return null;
//         }
//       });

//       const resolvedTasks = (await Promise.all(taskPromises)).filter(Boolean) as Task[];
//       setNotifications(resolvedTasks);
//     });

//     return () => unsubSnapshot();
//   });

//   return () => unsubscribe();
// }, []);

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (!user) {
      console.log("Belum login. Tidak bisa ambil tugas.");
      return;
    }

    console.log("User login dengan email:", user.email);

    const unsubSnapshot = onSnapshot(collection(db, "tugasdariuser"), (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Task[];

      console.log("📦 Tugas ditemukan:", tasks);
      setNotifications(tasks);
    });

    return () => unsubSnapshot();
  });

  return () => unsubscribe();
}, []);



  // useEffect(() => {
  //   const user = auth.currentUser;
  //   if (!user) return;

  //   const q = query(
  //     collection(db, "jawabanWorker"),
  //     where("taskId", "==", user.uid)
  //   );

  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     const tasks: Task[] = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     })) as Task[];
  //     setNotifications(tasks);
  //   });

  //   return () => unsubscribe();
  // }, []);

  return (
    <div className="max-w-2xl mx-auto py-32 px-4">
      <Navbar />

      {/* Layanan */}
      <h2 className="text-2xl font-bold mb-4">Available Services</h2>
      <ul>
        {services.map((service) => (
          <li key={service.id} className="mb-4 p-4 border-b">
            <h3 className="text-xl font-semibold">{service.serviceName}</h3>
            <p>{service.description}</p>
          </li>
        ))}
      </ul>

      {/* Tombol toggle notifikasi */}
      <button
        onClick={() => setShowNotifications((prev) => !prev)}
        className="mt-6 bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 transition"
      >
        {showNotifications ? 'Sembunyikan Notifikasi' : 'Tampilkan Notifikasi Tugas'}
      </button>

      {/* Notifikasi Tugas */}
      {showNotifications && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifikasi Pengerjaan</h2>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleViewTask(task)}
                >
                  <p className="text-lg font-semibold text-gray-800">Tugas Worker Anda</p>
                  <p className="text-sm text-gray-600">Deadline: {new Date(task.deadline).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Status: {task.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Tidak ada tugas baru.</p>
          )}

          {/* Progress Bar jika task dipilih */}
          {selectedTask && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Progress Tugas: {progressPercentage.toFixed(1)}%</h3>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
