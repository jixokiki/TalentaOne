// // src/app/dashboard-worker/page.tsx
// "use client"; // Pastikan komponen ini dijalankan di sisi klien

// import { useState, useEffect } from "react";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { doc, setDoc, getDoc,addDoc, getDocs , collection, query, where, onSnapshot, updateDoc } from "firebase/firestore";
// import { storage, db, auth } from '@/lib/firebaseConfig';
// import NavbarWorker from '@/app/navbarworker'; // Sesuaikan path sesuai struktur proyek Anda
// import { Task, Profile} from "@/lib/types";



// export default function WorkerDashboard() {
//   // const [profile, setProfile] = useState({
//   //   noRekening: "",
//   //   role: "",
//   //   specialRole: "",
//   //   portofolioFile: null,
//   //   profilePicture: null,
//   // });
//   // const [profile, setProfile] = useState<Profile>({
//   //   noRekening: "",
//   //   role: "",
//   //   specialRole: "",
//   //   portofolioFile: null,
//   //   profilePicture: null,
//   // });

//   const [profile, setProfile] = useState<Profile>({
//     noRekening: "",
//     role: "",
//     specialRole: "",
//     name: "",
//     email: "",
//     portofolioUrl: "",
//     profilePictureUrl: "",
//     uid: "",
//     id: "",
//   });
  
//   const currentUser = auth.currentUser;
  
//   const [portofolioUrl, setPortofolioUrl] = useState("");
//   const [profilePictureUrl, setProfilePictureUrl] = useState("");
//   const [isEditing, setIsEditing] = useState(true); // Mode edit atau tampilan profile
//   const [showPortofolioPopup, setShowPortofolioPopup] = useState(false); // Popup portofolio
//   const [showProfilePicturePopup, setShowProfilePicturePopup] = useState(false); // Popup foto profil
//   const [notifications, setNotifications] = useState<Task[]>([]); // State untuk notifikasi tugas
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   // const [selectedTask, setSelectedTask] = useState(null); // State untuk tugas yang dipilih
//   const [declineReason, setDeclineReason] = useState(""); // State untuk alasan decline
//   const [showDeclineReason, setShowDeclineReason] = useState(false); // State untuk menampilkan input alasan decline


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

//   //JANGAN DIHAPUS DULU
//   // const [progressFiles, setProgressFiles] = useState([]); // State untuk file progress
// const [progressPercentage, setProgressPercentage] = useState(0); // State untuk progress bar

// // Fungsi untuk mengupload bukti progress
// // const handleUploadProgress = async (e) => {
// //JANGAN DIHAPUS YAA IKIII
// // const handleUploadProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {

// //   const file = e.target.files?.[0];
// //   // if (!file) return;
// //   if (!file || !selectedTask) return;


// //   try {
// //     const fileRef = ref(storage, `progress/${selectedTask.id}/${file.name}`);
// //     await uploadBytes(fileRef, file);
// //     const fileUrl = await getDownloadURL(fileRef);

// //     // Simpan progress ke Firestore
// //     await addDoc(collection(db, "tugasdariuser", selectedTask.id, "progress"), {
// //       fileUrl,
// //       fileName: file.name,
// //       uploadedAt: new Date(),
// //     });

// //     // Hitung progress percentage
// //     const progressSnapshot = await getDocs(collection(db, "tugasdariuser", selectedTask.id, "progress"));
// //     // const totalDays = Math.ceil((new Date(selectedTask.deadline) - new Date()) / (1000 * 60 * 60 * 24));
// //     const totalDays = Math.ceil(
// //       (new Date(selectedTask.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
// //     );    
// //     const progress = (progressSnapshot.size / totalDays) * 100;
// //     setProgressPercentage(progress > 100 ? 100 : progress); // Batasi progress hingga 100%
// //   } catch (error) {
// //     console.error("Error uploading progress: ", error);
// //   }
// // };

// const handleUploadProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file || !selectedTask) return;

//   try {
//     // Upload file ke Storage
//     const fileRef = ref(storage, `progress/${selectedTask.id}/${file.name}`);
//     await uploadBytes(fileRef, file);
//     const fileUrl = await getDownloadURL(fileRef);

//     // Simpan metadata file ke subcollection Firestore
//     await addDoc(collection(db, "tugasdariuser", selectedTask.id, "progress"), {
//       fileUrl,
//       fileName: file.name,
//       uploadedAt: new Date(),
//     });

//     // Hitung progress berdasarkan jumlah file
//     const progressSnapshot = await getDocs(
//       collection(db, "tugasdariuser", selectedTask.id, "progress")
//     );

//     const totalDays = Math.ceil(
//       (new Date(selectedTask.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
//     );

//     const calculatedProgress = (progressSnapshot.size / totalDays) * 100;
//     const progress = calculatedProgress > 100 ? 100 : calculatedProgress;

//     // Simpan progress ke field utama document tugas
//     const taskRef = doc(db, "tugasdariuser", selectedTask.id);
//     await updateDoc(taskRef, { progress });

//     // Set ke state
//     setProgressPercentage(progress);

//     // ✅ Tambahkan ke koleksi jawabanWorker
//     await addDoc(collection(db, "jawabanWorker"), {
//       taskId: selectedTask.id,
//       fileUrl,
//       fileName: file.name,
//       progress,
//       uploadedAt: new Date(),
//       status: "in_progress",
//       userEmail: currentUser?.email || "unknown", // opsional
//     });
//   } catch (error) {
//     console.error("Error uploading progress: ", error);
//   }
// };


//     // // Fungsi untuk mengacc atau menolak tugas
//     // const handleTaskResponse = async (taskId, status) => {
//     //   try {
//     //     await updateDoc(doc(db, "tugasdariuser", taskId), { status });
//     //     alert(`Tugas berhasil di-${status}.`);
//     //     setSelectedTask(null); // Tutup popup setelah merespons
//     //   } catch (error) {
//     //     console.error("Error updating task status: ", error);
//     //   }
//     // };
  
//     // // Tampilkan popup detail tugas
//     // const handleViewTask = (task) => {
//     //   setSelectedTask(task);
//     // };


//     // Fungsi untuk mengacc atau menolak tugas
// // const handleTaskResponse = async (taskId, status, reason = "") => {
//   const handleTaskResponse = async (
//     taskId: Task["taskId"],
//     status: Task["status"],
//     reason: Task["reason"]
//   ) => {
  
//   try {
//     await updateDoc(doc(db, "tugasdariuser", taskId), { 
//       status,
//       declineReason: status === "decline" ? reason : "", // Simpan alasan jika status decline
//     });
//     // ✅ Tambahkan ke koleksi jawabanWorker
//     await addDoc(collection(db, "jawabanWorker"), {
//       taskId,
//       status,
//       reason: status === "decline" ? reason : "",
//       respondedAt: new Date(),
//       userEmail: currentUser?.email || "unknown", // opsional
//     });
//     alert(`Tugas berhasil di-${status}.`);
//     setSelectedTask(null); // Tutup popup setelah merespons
//     setDeclineReason(""); // Reset alasan decline
//     setShowDeclineReason(false); // Sembunyikan input alasan decline
//   } catch (error) {
//     console.error("Error updating task status: ", error);
//   }
// };

// // Tampilkan popup detail tugas dengan opsi decline dan acc
// // const handleViewTask = (task) => {
// //   setSelectedTask(task);
// // };
// //INI JANGAN DIHAPUS YAA IKII
// // const handleViewTask = (task: Task) => {
// //   setSelectedTask(task);
// // };

// const handleViewTask = async (task: Task) => {
//   const taskRef = doc(db, "tugasdariuser", task.id);
//   const taskSnap = await getDoc(taskRef);

//   if (taskSnap.exists()) {
//     const data = taskSnap.data();
//     setProgressPercentage(data.progress || 0); // Ambil progress
//   }

//   setSelectedTask(task);
// };

//   // const handleChange = (e) => {
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setProfile({ ...profile, [name]: files[0] });
//     } else {
//       setProfile({ ...profile, [name]: value });
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   try {
//   //     // Upload Portofolio
//   //     const portofolioRef = ref(storage, `portofolios/${profile.portofolioFile.name}`);
//   //     await uploadBytes(portofolioRef, profile.portofolioFile);
//   //     const portofolioUrl = await getDownloadURL(portofolioRef);
//   //     setPortofolioUrl(portofolioUrl);

//   //     // Upload Profile Picture
//   //     const profilePictureRef = ref(storage, `profilePictures/${profile.profilePicture.name}`);
//   //     await uploadBytes(profilePictureRef, profile.profilePicture);
//   //     const profilePictureUrl = await getDownloadURL(profilePictureRef);
//   //     setProfilePictureUrl(profilePictureUrl);

//   //     // Simpan data ke Firestore
//   //     const workerProfile = {
//   //       noRekening: profile.noRekening,
//   //       role: profile.role,
//   //       specialRole: profile.specialRole,
//   //       portofolioUrl,
//   //       profilePictureUrl,
//   //     };

//   //     await setDoc(doc(db, "workers", "workerId"), workerProfile); // Ganti "workerId" dengan ID worker yang sesuai
//   //     alert("Profile berhasil disimpan!");
//   //     setIsEditing(false); // Setelah disimpan, tampilkan profile
//   //   } catch (error) {
//   //     console.error("Error uploading files or saving data: ", error);
//   //   }
//   // };

//   // const handleSubmit = async (e) => {
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

//     e.preventDefault();
    
//     const user = auth.currentUser; // Ambil user yang sedang login
//     if (!user) {
//       alert("Anda belum login.");
//       return;
//     }
  
//     try {
//       // Upload Portofolio
//       let portofolioUrl = "";
//       if (profile.portofolioFile) {
//         const portofolioRef = ref(storage, `portofolios/${user.uid}_${profile.portofolioFile.name}`);
//         await uploadBytes(portofolioRef, profile.portofolioFile);
//         portofolioUrl = await getDownloadURL(portofolioRef);
//         setPortofolioUrl(portofolioUrl);
//       }
  
//       // Upload Profile Picture
//       let profilePictureUrl = "";
//       if (profile.profilePicture) {
//         const profilePictureRef = ref(storage, `profilePictures/${user.uid}_${profile.profilePicture.name}`);
//         await uploadBytes(profilePictureRef, profile.profilePicture);
//         profilePictureUrl = await getDownloadURL(profilePictureRef);
//         setProfilePictureUrl(profilePictureUrl);
//       }
  
//       // Simpan data ke Firestore berdasarkan UID user
//       const workerProfile = {
//         noRekening: profile.noRekening,
//         role: profile.role,
//         specialRole: profile.specialRole,
//         portofolioUrl,
//         profilePictureUrl,
//         uid: user.uid, // Simpan UID untuk referensi
//       };
  
//       await setDoc(doc(db, "workers", user.uid), workerProfile);
//       alert("Profile berhasil disimpan!");
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error uploading files or saving data: ", error);
//     }
//   };
  
//   const handleEdit = () => {
//     setIsEditing(true); // Kembali ke mode edit
//   };

//   // Fungsi untuk mengambil data dari Firestore (jika diperlukan)
//   // const fetchProfile = async () => {
//   //   const docRef = doc(db, "workers", "workerId");
//   //   const docSnap = await getDoc(docRef);
//   //   if (docSnap.exists()) {
//   //     const data = docSnap.data();
//   //     setProfile({
//   //       noRekening: data.noRekening,
//   //       role: data.role,
//   //       specialRole: data.specialRole,
//   //       portofolioFile: null,
//   //       profilePicture: null,
//   //     });
//   //     setPortofolioUrl(data.portofolioUrl);
//   //     setProfilePictureUrl(data.profilePictureUrl);
//   //     setIsEditing(false); // Tampilkan profile setelah data diambil
//   //   }
//   // };

//   const fetchProfile = async () => {
//     const user = auth.currentUser;
//     if (!user) {
//       console.log("Tidak ada user yang login.");
//       return;
//     }
  
//     const docRef = doc(db, "workers", user.uid);
//     const docSnap = await getDoc(docRef);
  
//     if (docSnap.exists()) {
//       const data = docSnap.data();
//       // setProfile({
//       //   noRekening: data.noRekening || "",
//       //   role: data.role || "",
//       //   specialRole: data.specialRole || "",
//       //   portofolioFile: null,
//       //   profilePicture: null,
//       // });
//       setProfile({
//         noRekening: data.noRekening || "",
//         role: data.role || "",
//         specialRole: data.specialRole || "",
//         name: data.name || "",
//         email: data.email || "",
//         portofolioUrl: data.portofolioUrl || "",
//         profilePictureUrl: data.profilePictureUrl || "",
//         uid: data.uid || user.uid, // fallback ke user.uid jika data.uid belum ada
//         id: data.id || user.uid,   // atau dokumen Firestore ID
//         portofolioFile: undefined,
//         profilePicture: undefined,
//       });
      
//       setPortofolioUrl(data.portofolioUrl || "");
//       setProfilePictureUrl(data.profilePictureUrl || "");
//       setIsEditing(false); // Tampilkan profile setelah data diambil
//     } else {
//       console.log("Profil belum ada, user harus mengisi data.");
//       setIsEditing(true);
//     }
//   };
  

//   // Jalankan fetchProfile saat komponen dimuat
//   // useEffect(() => {
//   //   fetchProfile();
//   // }, []);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         fetchProfile();
//       }
//     });
  
//     return () => unsubscribe();
//   }, []);
  

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
//       <NavbarWorker/>
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Dashboard Worker</h1>
//         <p className="text-lg text-gray-600 mb-8">Selamat datang, Worker!</p>

//         {/* Notifikasi Tugas */}
//         <div className="mb-8">
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
//         </div>

//         {isEditing ? (
//           <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">No Rekening</label>
//               <input
//                 type="text"
//                 name="noRekening"
//                 value={profile.noRekening}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
//               <input
//                 type="text"
//                 name="role"
//                 value={profile.role}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Special Role</label>
//               <input
//                 type="text"
//                 name="specialRole"
//                 value={profile.specialRole}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Upload Portofolio</label>
//               <input
//                 type="file"
//                 name="portofolioFile"
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Upload Foto Profil</label>
//               <input
//                 type="file"
//                 name="profilePicture"
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
//             >
//               Simpan Profile
//             </button>
//           </form>
//         ) : (
//           <div className="bg-white p-8 rounded-lg shadow-lg">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {/* Bagian Kiri: Foto Profil */}
//               <div className="flex flex-col items-center">
//                 <div className="relative w-48 h-48 mb-4">
//                   <img
//                     src={profilePictureUrl}
//                     alt="Profile"
//                     className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg cursor-pointer"
//                     onClick={() => setShowProfilePicturePopup(true)}
//                   />
//                   <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-full transition duration-300"></div>
//                 </div>
//                 <button
//                   onClick={handleEdit}
//                   className="mt-4 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
//                 >
//                   Edit Profile
//                 </button>
//               </div>

//               {/* Bagian Kanan: Informasi Profile */}
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">No Rekening</label>
//                   <p className="text-lg text-gray-900 bg-gray-100 p-3 rounded-lg">{profile.noRekening}</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
//                   <p className="text-lg text-gray-900 bg-gray-100 p-3 rounded-lg">{profile.role}</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Special Role</label>
//                   <p className="text-lg text-gray-900 bg-gray-100 p-3 rounded-lg">{profile.specialRole}</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Portofolio</label>
//                   <button
//                     onClick={() => setShowPortofolioPopup(true)}
//                     className="text-blue-600 hover:text-blue-700 underline"
//                   >
//                     Lihat Portofolio
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Popup Detail Tugas
//         {selectedTask && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
//               <h2 className="text-xl font-bold mb-4">Detail Tugas</h2>
//               <div className="space-y-4">
//                 <p><strong>File:</strong> <a href={selectedTask.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedTask.fileName}</a></p>
//                 <p><strong>Deskripsi:</strong> {selectedTask.description}</p>
//                 <p><strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleString()}</p>
//                 <p><strong>Status:</strong> {selectedTask.status}</p>
//               </div>
//               <div className="mt-6 flex space-x-4">
//                 {selectedTask.status === "pending" && (
//                   <>
//                     <button
//                       onClick={() => handleTaskResponse(selectedTask.id, "acc")}
//                       className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
//                     >
//                       Acc
//                     </button>
//                     <button
//                       onClick={() => handleTaskResponse(selectedTask.id, "decline")}
//                       className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
//                     >
//                       Decline
//                     </button>
//                   </>
//                 )}
//                 <button
//                   onClick={() => setSelectedTask(null)}
//                   className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
//                 >
//                   Tutup
//                 </button>
//               </div>
//             </div>
//           </div>
//         )} */}

//         {/* Popup Detail Tugas */}
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
//       <div className="mt-6 flex space-x-4">
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
//       </div>

//       {/* Popup Alasan Decline */}
//       {showDeclineReason && (
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
//       )}

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
//     <input
//       type="file"
//       onChange={handleUploadProgress}
//       className="mt-2"
//     />
//   </div>
// )}
//     </div>
//   </div>
// )}

//         {/* Popup Portofolio */}
//         {showPortofolioPopup && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white p-6 rounded-lg max-w-2xl max-h-full overflow-auto">
//               <h2 className="text-xl font-bold mb-4">Portofolio</h2>
//               {/* <iframe
//                 src={portofolioUrl}
//                 className="w-full h-96"
//                 title="Portofolio"
//               /> */}
//               {portofolioUrl && (
//   <>
//     {portofolioUrl.endsWith(".pdf") ? (
//       // Jika file adalah PDF, tampilkan dalam iframe
//       <iframe
//         src={portofolioUrl}
//         className="w-full h-96"
//         title="Portofolio"
//         sandbox="allow-scripts allow-same-origin allow-downloads allow-forms"
//       />
//     ) : portofolioUrl.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) ? (
//       // Jika file adalah gambar, tampilkan sebagai img
//       <img
//         src={portofolioUrl}
//         alt="Portofolio"
//         className="w-full h-auto max-h-96 object-contain"
//       />
//     ) : (
//       // Jika file adalah Word, Excel, atau file lainnya, tampilkan link
//       <a
//         href={portofolioUrl}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-blue-600 underline block text-center mt-4"
//       >
//         Klik di sini untuk melihat portofolio
//       </a>
//     )}
//   </>
// )}

//               <button
//                 onClick={() => setShowPortofolioPopup(false)}
//                 className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
//               >
//                 Tutup
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Popup Foto Profil */}
//         {showProfilePicturePopup && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white p-6 rounded-lg">
//               <h2 className="text-xl font-bold mb-4">Foto Profil</h2>
//               <img
//                 src={profilePictureUrl}
//                 alt="Profile"
//                 className="w-64 h-64 rounded-full"
//               />
//               <button
//                 onClick={() => setShowProfilePicturePopup(false)}
//                 className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
//               >
//                 Tutup
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }








// src/app/dashboard-worker/page.tsx
"use client"; // Pastikan komponen ini dijalankan di sisi klien

import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc,addDoc, getDocs , collection, query, where, onSnapshot, updateDoc } from "firebase/firestore";
import { storage, db, auth } from '@/lib/firebaseConfig';
import NavbarWorker from '@/app/navbarworker'; // Sesuaikan path sesuai struktur proyek Anda
import { Task, Profile} from "@/lib/types";



export default function WorkerDashboard() {

  const [profile, setProfile] = useState<Profile>({
    noRekening: "",
    role: "",
    specialRole: "",
    name: "",
    email: "",
    portofolioUrl: "",
    profilePictureUrl: "",
    uid: "",
    id: "",
    achievement: "",
  });
  
  const currentUser = auth.currentUser;
  
  const [portofolioUrl, setPortofolioUrl] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [isEditing, setIsEditing] = useState(true); // Mode edit atau tampilan profile
  const [showPortofolioPopup, setShowPortofolioPopup] = useState(false); // Popup portofolio
  const [showProfilePicturePopup, setShowProfilePicturePopup] = useState(false); // Popup foto profil
  const [notifications, setNotifications] = useState<Task[]>([]); // State untuk notifikasi tugas
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // const [selectedTask, setSelectedTask] = useState(null); // State untuk tugas yang dipilih
  const [declineReason, setDeclineReason] = useState(""); // State untuk alasan decline
  const [showDeclineReason, setShowDeclineReason] = useState(false); // State untuk menampilkan input alasan decline


  // Fungsi untuk mengambil notifikasi tugas
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "tugasdariuser"), where("workerId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      
      setNotifications(tasks);
    });
    

    return () => unsubscribe();
  }, []);

  //JANGAN DIHAPUS DULU
  // const [progressFiles, setProgressFiles] = useState([]); // State untuk file progress
const [progressPercentage, setProgressPercentage] = useState(0); // State untuk progress bar

// const handleUploadProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file || !selectedTask) return;

//   try {
//     // Upload file ke Storage
//     const fileRef = ref(storage, `progress/${selectedTask.id}/${file.name}`);
//     await uploadBytes(fileRef, file);
//     const fileUrl = await getDownloadURL(fileRef);

//     // Simpan metadata file ke subcollection Firestore
//     await addDoc(collection(db, "tugasdariuser", selectedTask.id, "progress"), {
//       fileUrl,
//       fileName: file.name,
//       uploadedAt: new Date(),
//     });

//     // Hitung progress berdasarkan jumlah file
//     const progressSnapshot = await getDocs(
//       collection(db, "tugasdariuser", selectedTask.id, "progress")
//     );

//     const totalDays = Math.ceil(
//       (new Date(selectedTask.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
//     );

//     const calculatedProgress = (progressSnapshot.size / totalDays) * 100;
//     const progress = calculatedProgress > 100 ? 100 : calculatedProgress;

//     // Simpan progress ke field utama document tugas
//     const taskRef = doc(db, "tugasdariuser", selectedTask.id);
//     await updateDoc(taskRef, { progress });

//     // Set ke state
//     setProgressPercentage(progress);

//     // ✅ Tambahkan ke koleksi jawabanWorker
//     await addDoc(collection(db, "jawabanWorker"), {
//       taskId: selectedTask.id,
//       fileUrl,
//       fileName: file.name,
//       progress,
//       uploadedAt: new Date(),
//       status: "in_progress",
//       userEmail: currentUser?.email || "unknown", // opsional
//     });
//   } catch (error) {
//     console.error("Error uploading progress: ", error);
//   }
// };


// const handleUploadProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file || !selectedTask || !currentUser) return;

//   try {
//     // Upload file ke Storage
//     const fileRef = ref(storage, `progress/${selectedTask.id}/${file.name}`);
//     await uploadBytes(fileRef, file);
//     const fileUrl = await getDownloadURL(fileRef);

//     // Simpan metadata file ke subcollection Firestore
//     await addDoc(collection(db, "tugasdariuser", selectedTask.id, "progress"), {
//       fileUrl,
//       fileName: file.name,
//       uploadedAt: new Date(),
//     });

//     // Hitung progress berdasarkan jumlah file & total hari
//     const progressSnapshot = await getDocs(
//       collection(db, "tugasdariuser", selectedTask.id, "progress")
//     );

//     const now = new Date();
//     const deadline = new Date(
//       selectedTask.deadline?.seconds
//         ? selectedTask.deadline.seconds * 1000
//         : selectedTask.deadline
//     );

//     const totalDays = Math.ceil(
//       (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
//     ) || 1; // fallback 1 hari jika deadline sudah dekat

//     const calculatedProgress = (progressSnapshot.size / totalDays) * 100;
//     const progress = Math.min(100, calculatedProgress);

//     // Status untuk Firestore
//     const statusProgress = progress >= 100 ? "Task Completed" : "in_progress";

//     // Simpan progress ke document utama tugas
//     const taskRef = doc(db, "tugasdariuser", selectedTask.id);
//     await updateDoc(taskRef, {
//       progress,
//       statusProgress,
//     });

//     // Simpan ke state (untuk UI)
//     setProgressPercentage(progress);

//     // Simpan ke koleksi jawabanWorker
//     await addDoc(collection(db, "jawabanWorker"), {
//       taskId: selectedTask.id,
//       fileUrl,
//       fileName: file.name,
//       progress,
//       uploadedAt: new Date(),
//       status: statusProgress,
//       userEmail: currentUser.email || "unknown",
//     });

//     // Alert jika tugas selesai
//     if (statusProgress === "Task Completed") {
//       alert("Tugas telah selesai 100% ✅");
//     }

//   } catch (error) {
//     console.error("Error uploading progress: ", error);
//   }
// };


const handleUploadProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !selectedTask || !currentUser) return;

  try {
    // Upload file ke Storage
    const fileRef = ref(storage, `progress/${selectedTask.id}/${file.name}`);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);

    // Simpan metadata file ke subcollection Firestore
    await addDoc(collection(db, "tugasdariuser", selectedTask.id, "progress"), {
      fileUrl,
      fileName: file.name,
      uploadedAt: new Date(),
    });

    // Hitung progress berdasarkan jumlah file & total hari
    const progressSnapshot = await getDocs(
      collection(db, "tugasdariuser", selectedTask.id, "progress")
    );

    const now = new Date();
    const deadline = new Date(
      selectedTask.deadline?.seconds
        ? selectedTask.deadline.seconds * 1000
        : selectedTask.deadline
    );

    const totalDays = Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    ) || 1;

    const calculatedProgress = (progressSnapshot.size / totalDays) * 100;
    const progress = Math.min(100, calculatedProgress);
    const statusProgress = progress >= 100 ? "Task Completed" : "in_progress";

    // Achievement logic
    let achievement = "";
    if (progress >= 100 && now < deadline) {
      const formattedNow = now.toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
      });
      const formattedDeadline = deadline.toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
      });
      achievement = `🎉 Pengerjaan terselesaikan sebelum deadline ${formattedNow} dengan deadline ${formattedDeadline}`;
    }

    // Simpan progress ke tugas
    const taskRef = doc(db, "tugasdariuser", selectedTask.id);
    await updateDoc(taskRef, {
      progress,
      statusProgress,
      achievement,
    });

    // Simpan ke worker jika ada achievement
    if (achievement) {
      const workerRef = doc(db, "workers", currentUser.uid);
      await updateDoc(workerRef, {
        achievement,
      });
      await fetchProfile(); // ✅ Panggil ulang setelah update
    }

    setProgressPercentage(progress);

    await addDoc(collection(db, "jawabanWorker"), {
      taskId: selectedTask.id,
      fileUrl,
      fileName: file.name,
      progress,
      uploadedAt: new Date(),
      status: statusProgress,
      userEmail: currentUser.email || "unknown",
    });

    if (statusProgress === "Task Completed") {
      alert("Tugas telah selesai 100% ✅");
    }

  } catch (error) {
    console.error("Error uploading progress: ", error);
  }
};


//JANGAN DIHAPUS DULU INI yang ada target status inprogress sama donennya maka berdampak ke user
// const handleUploadProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file || !selectedTask) return;

//   try {
//     // Upload file ke Storage
//     const fileRef = ref(storage, `progress/${selectedTask.id}/${file.name}`);
//     await uploadBytes(fileRef, file);
//     const fileUrl = await getDownloadURL(fileRef);

//     // Simpan metadata file ke subcollection Firestore
//     await addDoc(collection(db, "tugasdariuser", selectedTask.id, "progress"), {
//       fileUrl,
//       fileName: file.name,
//       uploadedAt: new Date(),
//     });

//     // Hitung progress
//     const progressSnapshot = await getDocs(
//       collection(db, "tugasdariuser", selectedTask.id, "progress")
//     );

//     const totalDays = Math.ceil(
//       (new Date(selectedTask.deadline).getTime() - new Date(selectedTask.createdAt).getTime()) / (1000 * 60 * 60 * 24)
//     ) || 1; // fallback 1 agar tidak error bagi deadline yg sama hari

//     const calculatedProgress = (progressSnapshot.size / totalDays) * 100;
//     const progress = Math.min(100, calculatedProgress);

//     // Status selesai jika progress sudah penuh
//     const statusProgress = progress >= 100 ? 100 : calculatedProgress ? "Task Completed" : "in_progress";

//     // Update ke document utama tugas
//     const taskRef = doc(db, "tugasdariuser", selectedTask.id);
//     await updateDoc(taskRef, { progress, statusProgress });

//     // Simpan ke state lokal
//     setProgressPercentage(progress);

//     // Simpan ke koleksi jawabanWorker
//     await addDoc(collection(db, "jawabanWorker"), {
//       taskId: selectedTask.id,
//       fileUrl,
//       fileName: file.name,
//       progress,
//       uploadedAt: new Date(),
//       status: statusProgress,
//       userEmail: currentUser?.email || "unknown",
//     });

//     // Opsional: alert jika selesai
//     if (statusProgress === "Task Completed") {
//       alert("Tugas telah selesai 100% ✅");
//     }
//   } catch (error) {
//     console.error("Error uploading progress: ", error);
//   }
// };


// const handleUploadProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file || !selectedTask || !currentUser) return;

//   try {
//     const fileRef = ref(storage, `progress/${selectedTask.id}/${file.name}`);
//     await uploadBytes(fileRef, file);
//     const fileUrl = await getDownloadURL(fileRef);

//     await addDoc(collection(db, "tugasdariuser", selectedTask.id, "progress"), {
//       fileUrl,
//       fileName: file.name,
//       uploadedAt: new Date(),
//     });

//     // ✅ Konversi Timestamp ke Date
//     const now = new Date();
//     const start = new Date(
//       selectedTask.createdAt?.seconds
//         ? selectedTask.createdAt.seconds * 1000
//         : selectedTask.createdAt
//     );
//     const deadline = new Date(
//       selectedTask.deadline?.seconds
//         ? selectedTask.deadline.seconds * 1000
//         : selectedTask.deadline
//     );

//     const totalDuration = deadline.getTime() - start.getTime();
//     const elapsedDuration = now.getTime() - start.getTime();
//     const progress =
//       totalDuration > 0 ? Math.min(100, (elapsedDuration / totalDuration) * 100) : 0;

//     const statusProgress = progress >= 100 ? "Task Completed" : "in_progress";

//     // Achievement jika selesai sebelum deadline
//     let achievement = "";
//     if (progress >= 100 && now < deadline) {
//       const formattedNow = now.toLocaleString("id-ID", {
//         dateStyle: "long",
//         timeStyle: "short",
//       });
//       const formattedDeadline = deadline.toLocaleString("id-ID", {
//         dateStyle: "long",
//         timeStyle: "short",
//       });
//       achievement = `🎉 Pengerjaan terselesaikan sebelum deadline (${formattedNow}) dari batas waktu (${formattedDeadline})`;
//     }

//     // Update tugas
//     const taskRef = doc(db, "tugasdariuser", selectedTask.id);
//     await updateDoc(taskRef, {
//       progress,
//       statusProgress,
//       achievement,
//     });

//     // Update worker jika achievement ada
//     if (achievement) {
//       const workerRef = doc(db, "workers", currentUser.uid);
//       await updateDoc(workerRef, { achievement });
//     }

//     setProgressPercentage(progress);

//     await addDoc(collection(db, "jawabanWorker"), {
//       taskId: selectedTask.id,
//       fileUrl,
//       fileName: file.name,
//       progress,
//       uploadedAt: new Date(),
//       status: statusProgress,
//       userEmail: currentUser.email || "unknown",
//     });

//     if (statusProgress === "Task Completed") {
//       alert("Tugas telah selesai 100% ✅");
//     }
//   } catch (error) {
//     console.error("Error uploading progress: ", error);
//   }
// };


// const handleUploadProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file || !selectedTask || !currentUser) return;

//   try {
//     const fileRef = ref(storage, `progress/${selectedTask.id}/${file.name}`);
//     await uploadBytes(fileRef, file);
//     const fileUrl = await getDownloadURL(fileRef);

//     await addDoc(collection(db, "tugasdariuser", selectedTask.id, "progress"), {
//       fileUrl,
//       fileName: file.name,
//       uploadedAt: new Date(),
//     });

//     const progressSnapshot = await getDocs(
//       collection(db, "tugasdariuser", selectedTask.id, "progress")
//     );

//     const now = new Date();
//     const start = new Date(
//       selectedTask.createdAt?.seconds
//         ? selectedTask.createdAt.seconds * 1000
//         : selectedTask.createdAt
//     );
//     const deadline = new Date(
//       selectedTask.deadline?.seconds
//         ? selectedTask.deadline.seconds * 1000
//         : selectedTask.deadline
//     );

//     const totalDuration = deadline.getTime() - start.getTime();
//     const elapsed = now.getTime() - start.getTime();
//     const isBeforeDeadline = now < deadline;

//     // 🔍 Kontribusi file berdasarkan jenis
//     let fileContribution = 0;
//     if (file.name.endsWith(".pdf")) fileContribution = 0.2;
//     else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) fileContribution = 0.15;
//     else if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) fileContribution = 0.1;
//     else if (file.type.startsWith("image/")) fileContribution = 0.1;
//     else fileContribution = 0.05; // fallback contribution

//     const fileProgressTotal = fileContribution * progressSnapshot.size;
//     const timeProgress = totalDuration > 0 ? (elapsed / totalDuration) : 0;

//     const progress = Math.min(100, Math.round(fileProgressTotal * timeProgress * 100));
//     const statusProgress = progress >= 100 ? "Task Completed" : "in_progress";

//     let achievement = "";
//     if (progress >= 100 && isBeforeDeadline) {
//       const formattedNow = now.toLocaleString("id-ID", {
//         dateStyle: "long",
//         timeStyle: "short",
//       });
//       const formattedDeadline = deadline.toLocaleString("id-ID", {
//         dateStyle: "long",
//         timeStyle: "short",
//       });
//       achievement = `🎉 Pengerjaan terselesaikan sebelum deadline (${formattedNow}) dari batas waktu (${formattedDeadline}) - oleh ${selectedTask.userEmail}`;
//     }

//     const taskRef = doc(db, "tugasdariuser", selectedTask.id);
//     await updateDoc(taskRef, {
//       progress,
//       statusProgress,
//       achievement,
//     });

//     if (achievement) {
//       const workerRef = doc(db, "workers", currentUser.uid);
//       await updateDoc(workerRef, { achievement });
//     }

//     setProgressPercentage(progress);

//     await addDoc(collection(db, "jawabanWorker"), {
//       taskId: selectedTask.id,
//       fileUrl,
//       fileName: file.name,
//       progress,
//       uploadedAt: now,
//       status: statusProgress,
//       userEmail: currentUser.email || "unknown",
//     });

//     if (statusProgress === "Task Completed") {
//       alert("Tugas telah selesai 100% ✅");
//     }

//   } catch (error) {
//     console.error("Error uploading progress:", error);
//   }
// };



// const handleUploadProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file || !selectedTask || !currentUser) return;

//   try {
//     // Upload file
//     const fileRef = ref(storage, `progress/${selectedTask.id}/${file.name}`);
//     await uploadBytes(fileRef, file);
//     const fileUrl = await getDownloadURL(fileRef);

//     // Simpan ke subcollection progress
//     await addDoc(collection(db, "tugasdariuser", selectedTask.id, "progress"), {
//       fileUrl,
//       fileName: file.name,
//       uploadedAt: new Date(),
//     });

//     // Ambil semua file progress saat ini
//     const progressSnapshot = await getDocs(
//       collection(db, "tugasdariuser", selectedTask.id, "progress")
//     );

//     // Ambil waktu dari createdAt & deadline
//     const now = new Date();
//     const start = new Date(
//       selectedTask.createdAt?.seconds
//         ? selectedTask.createdAt.seconds * 1000
//         : selectedTask.createdAt
//     );
//     const deadline = new Date(
//       selectedTask.deadline?.seconds
//         ? selectedTask.deadline.seconds * 1000
//         : selectedTask.deadline
//     );

//     const isBeforeDeadline = now.getTime() < deadline.getTime();
//     const totalDuration = deadline.getTime() - start.getTime();
//     const elapsed = now.getTime() - start.getTime();
//     const timeProgress = totalDuration > 0 ? (elapsed / totalDuration) : 0;

//     // 💡 Estimasi butuh 3 file
//     const estimatedFileCount = 3;
//     const fileProgress = Math.min(progressSnapshot.size / estimatedFileCount, 1);

//     // Combine dua progress (file + waktu)
//     const combinedProgress = Math.min(1, fileProgress * timeProgress);

//     const progress = Math.round(combinedProgress * 100); // dalam persen
//     const statusProgress = progress >= 100 ? "Task Completed" : "in_progress";

//     // Achievement
//     let achievement = "";
//     if (progress >= 100 && isBeforeDeadline) {
//       const formattedNow = now.toLocaleString("id-ID", {
//         dateStyle: "long",
//         timeStyle: "short",
//       });
//       const formattedDeadline = deadline.toLocaleString("id-ID", {
//         dateStyle: "long",
//         timeStyle: "short",
//       });
//       achievement = `🎉 Pengerjaan terselesaikan sebelum deadline (${formattedNow}) dari batas waktu (${formattedDeadline})`;
//     }

//     // Update ke Firestore tugas
//     const taskRef = doc(db, "tugasdariuser", selectedTask.id);
//     await updateDoc(taskRef, {
//       progress,
//       statusProgress,
//       achievement,
//     });

//     // Update ke profile worker
//     if (achievement) {
//       const workerRef = doc(db, "workers", currentUser.uid);
//       await updateDoc(workerRef, { achievement });
//     }

//     setProgressPercentage(progress);
//     const newTaskSnap = await getDoc(taskRef);
// if (newTaskSnap.exists()) {
//   const newTaskData = { ...newTaskSnap.data(), id: selectedTask.id };
//   setSelectedTask(newTaskData as Task); // agar memicu rerender
//   setProgressPercentage(newTaskData.progress || 0);
// }


//     // Simpan ke jawabanWorker
//     await addDoc(collection(db, "jawabanWorker"), {
//       taskId: selectedTask.id,
//       fileUrl,
//       fileName: file.name,
//       progress,
//       uploadedAt: new Date(),
//       status: statusProgress,
//       userEmail: currentUser.email || "unknown",
//     });

//     if (statusProgress === "Task Completed") {
//       alert("Tugas selesai tepat waktu ✅ Achievement unlocked!");
//     }

//   } catch (error) {
//     console.error("Error uploading progress: ", error);
//   }
// };



    // Fungsi untuk mengacc atau menolak tugas
// const handleTaskResponse = async (taskId, status, reason = "") => {
//   const handleTaskResponse = async (
//     taskId: Task["taskId"],
//     status: Task["status"],
//     reason: Task["reason"]
//   ) => {
  
//   try {
//     await updateDoc(doc(db, "tugasdariuser", taskId), { 
//       status,
//        isRead: false, // ⬅️ Tambahkan ini untuk notifikasi user
//       declineReason: status === "decline" ? reason : "", // Simpan alasan jika status decline
//       nominal: parseInt(nominal),
//     });
//     // ✅ Tambahkan ke koleksi jawabanWorker
//     await addDoc(collection(db, "jawabanWorker"), {
//       taskId,
//       status,
//       reason: status === "decline" ? reason : "",
//       respondedAt: new Date(),
//       userEmail: currentUser?.email || "unknown", // opsional
//     });
//     alert(`Tugas berhasil di-${status}.`);
//     setSelectedTask(null); // Tutup popup setelah merespons
//     setDeclineReason(""); // Reset alasan decline
//     setShowDeclineReason(false); // Sembunyikan input alasan decline
//   } catch (error) {
//     console.error("Error updating task status: ", error);
//   }
// };


// ===================== WORKER SIDE =====================
// Fungsi ketika Worker menanggapi tugas (acc / decline)
const [nominal, setNominal] = useState("");

const handleTaskResponse = async (
  taskId: Task["taskId"],
  status: Task["status"],
  reason: Task["reason"]
) => {
  try {
    if (status === "acc" && (!nominal || isNaN(parseInt(nominal)))) {
      alert("Harap isi nominal terlebih dahulu.");
      return;
    }

    const parsedNominal = parseInt(nominal);
    if (status === "acc" && parsedNominal < 20000) {
      alert("Nominal terlalu kecil. Minimal Rp 20.000.");
      return;
    }

    await updateDoc(doc(db, "tugasdariuser", taskId), {
      status,
      isRead: false,
      declineReason: status === "decline" ? reason : "",
      ...(status === "acc" && { nominal: parsedNominal }),
    });

    await addDoc(collection(db, "jawabanWorker"), {
      taskId,
      status,
      reason: status === "decline" ? reason : "",
      respondedAt: new Date(),
      userEmail: currentUser?.email || "unknown",
    });

    alert(`Tugas berhasil di-${status}.`);
    setSelectedTask(null);
    setNominal(""); // reset nominal
    setDeclineReason("");
    setShowDeclineReason(false);
  } catch (error) {
    console.error("Error updating task status: ", error);
  }
};

const handleViewTask = async (task: Task) => {
  const taskRef = doc(db, "tugasdariuser", task.id);
  const taskSnap = await getDoc(taskRef);

  if (taskSnap.exists()) {
    const data = taskSnap.data();
    setProgressPercentage(data.progress || 0); // jika pakai state progress
  }

  setSelectedTask(task); // ini penting agar popup muncul
};


  // const handleChange = (e) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setProfile({ ...profile, [name]: files[0] });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  // const handleSubmit = async (e) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    
    const user = auth.currentUser; // Ambil user yang sedang login
    if (!user) {
      alert("Anda belum login.");
      return;
    }
  
    try {
      // Upload Portofolio
      let portofolioUrl = "";
      if (profile.portofolioFile) {
        const portofolioRef = ref(storage, `portofolios/${user.uid}_${profile.portofolioFile.name}`);
        await uploadBytes(portofolioRef, profile.portofolioFile);
        portofolioUrl = await getDownloadURL(portofolioRef);
        setPortofolioUrl(portofolioUrl);
      }
  
      // Upload Profile Picture
      let profilePictureUrl = "";
      if (profile.profilePicture) {
        const profilePictureRef = ref(storage, `profilePictures/${user.uid}_${profile.profilePicture.name}`);
        await uploadBytes(profilePictureRef, profile.profilePicture);
        profilePictureUrl = await getDownloadURL(profilePictureRef);
        setProfilePictureUrl(profilePictureUrl);
      }
  
      // Simpan data ke Firestore berdasarkan UID user
      const workerProfile = {
        noRekening: profile.noRekening,
        role: profile.role,
        specialRole: profile.specialRole,
        portofolioUrl,
        profilePictureUrl,
        uid: user.uid, // Simpan UID untuk referensi
      };
  
      await setDoc(doc(db, "workers", user.uid), workerProfile);
      alert("Profile berhasil disimpan!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error uploading files or saving data: ", error);
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true); // Kembali ke mode edit
  };
//JANGAN DIHAPUS YAAA IKI INI UDAH YANG ASLI DAN BENAR CUMAN BELUM ADA ACHIEVEMENTS NYA AJA
  // const fetchProfile = async () => {
  //   const user = auth.currentUser;
  //   if (!user) {
  //     console.log("Tidak ada user yang login.");
  //     return;
  //   }
  
  //   const docRef = doc(db, "workers", user.uid);
  //   const docSnap = await getDoc(docRef);
  
  //   if (docSnap.exists()) {
  //     const data = docSnap.data();

  //     setProfile({
  //       noRekening: data.noRekening || "",
  //       role: data.role || "",
  //       specialRole: data.specialRole || "",
  //       name: data.name || "",
  //       email: data.email || "",
  //       portofolioUrl: data.portofolioUrl || "",
  //       profilePictureUrl: data.profilePictureUrl || "",
  //       uid: data.uid || user.uid, // fallback ke user.uid jika data.uid belum ada
  //       id: data.id || user.uid,   // atau dokumen Firestore ID
  //       portofolioFile: undefined,
  //       profilePicture: undefined,
  //     });
      
  //     setPortofolioUrl(data.portofolioUrl || "");
  //     setProfilePictureUrl(data.profilePictureUrl || "");
  //     setIsEditing(false); // Tampilkan profile setelah data diambil
  //   } else {
  //     console.log("Profil belum ada, user harus mengisi data.");
  //     setIsEditing(true);
  //   }
  // };


  const fetchProfile = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.log("Tidak ada user yang login.");
    return;
  }

  const docRef = doc(db, "workers", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    setProfile({
      noRekening: data.noRekening || "",
      role: data.role || "",
      specialRole: data.specialRole || "",
      name: data.name || "",
      email: data.email || "",
      portofolioUrl: data.portofolioUrl || "",
      profilePictureUrl: data.profilePictureUrl || "",
      uid: data.uid || user.uid,
      id: data.id || user.uid,
      achievement: data.achievement || "", // ✅ TAMBAHKAN INI
      portofolioFile: undefined,
      profilePicture: undefined,
    });

    setPortofolioUrl(data.portofolioUrl || "");
    setProfilePictureUrl(data.profilePictureUrl || "");
    setIsEditing(false);
  } else {
    console.log("Profil belum ada, user harus mengisi data.");
    setIsEditing(true);
  }
};


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchProfile();
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
      <NavbarWorker/>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Dashboard Worker</h1>
        <p className="text-lg text-gray-600 mb-8">Selamat datang, Worker!</p>

        {/* Notifikasi Tugas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifikasi Tugas</h2>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleViewTask(task)}
                >
                  <p className="text-lg font-semibold text-gray-800">Tugas Baru dari User</p>
                  <p className="text-sm text-gray-600">Deadline: {new Date(task.deadline).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Status: {task.status}</p>
                  
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Tidak ada tugas baru.</p>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Rekening</label>
              <input
                type="text"
                name="noRekening"
                value={profile.noRekening}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                name="role"
                value={profile.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Role</label>
              <input
                type="text"
                name="specialRole"
                value={profile.specialRole}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Portofolio</label>
              <input
                type="file"
                name="portofolioFile"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Foto Profil</label>
              <input
                type="file"
                name="profilePicture"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Simpan Profile
            </button>
          </form>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bagian Kiri: Foto Profil */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4">
                  <img
                    src={profilePictureUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg cursor-pointer"
                    onClick={() => setShowProfilePicturePopup(true)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-full transition duration-300"></div>
                </div>
                <button
                  onClick={handleEdit}
                  className="mt-4 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Edit Profile
                </button>
              </div>

              {/* Bagian Kanan: Informasi Profile */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">No Rekening</label>
                  <p className="text-lg text-gray-900 bg-gray-100 p-3 rounded-lg">{profile.noRekening}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <p className="text-lg text-gray-900 bg-gray-100 p-3 rounded-lg">{profile.role}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Role</label>
                  <p className="text-lg text-gray-900 bg-gray-100 p-3 rounded-lg">{profile.specialRole}</p>
                </div>
                {profile.achievement && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Achievement</label>
    <div className="text-green-700 bg-green-100 p-3 rounded-lg border-l-4 border-green-600">
      {profile.achievement}
    </div>
  </div>
)}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portofolio</label>
                  <button
                    onClick={() => setShowPortofolioPopup(true)}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Lihat Portofolio
                  </button>
                </div>
              </div>
              {/* {profile.achievement && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Achievement</label>
    <div className="text-green-700 bg-green-100 p-3 rounded-lg border-l-4 border-green-600">
      {profile.achievement}
    </div>
  </div>
)} */}
            </div>
          </div>
        )}

        {/* Popup Detail Tugas */}
{selectedTask && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative">
      <h2 className="text-xl font-bold mb-4">Detail Tugas</h2>
      <div className="space-y-4">
        <p><strong>File:</strong> <a href={selectedTask.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedTask.fileName}</a></p>
        <p><strong>Deskripsi:</strong> {selectedTask.description}</p>
        <p><strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleString()}</p>
        <p><strong>Status:</strong> {selectedTask.status}</p>
        <p><strong>Nominal:</strong> {selectedTask.nominal}</p>
      </div>
      <div className="mt-6 flex space-x-4">
        {selectedTask.status === "pending" && (
          <>
           <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Masukkan Nominal Harga (Rp)</label>
          <input
            type="number"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            placeholder="Contoh: 50000"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
                      <button
              onClick={() => handleTaskResponse(selectedTask.id, "acc","")}
              className="bg-green-600 text-white py-2 px-9 mx-1 my-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Acc
            </button>
            <button
              onClick={() => setShowDeclineReason(true)} // Tampilkan input alasan decline
              className="bg-red-600 text-white py-2 px-8 mx-2 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Decline
            </button>
                    <button
          onClick={() => setSelectedTask(null)}
          className="bg-gray-600 text-white py-2 px-8 mx-2 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Tutup
        </button>
        </div>

          </>
        )}
{/* Tombol X di pojok kanan atas */}
<button
  onClick={() => setSelectedTask(null)}
  className="absolute top-2 right-2 bg-gray-600 text-white px-3 py-1 rounded-full hover:bg-gray-700 transition duration-300"
  aria-label="Tutup"
>
  ✕
</button>

      </div>

      {/* Popup Alasan Decline */}
      {showDeclineReason && (
        <div className="mt-4">
          <textarea
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Masukkan alasan decline..."
            className="w-full p-2 border border-gray-300 rounded-lg"
            // rows="3"
            rows={3}
          />
          <button
            onClick={() => handleTaskResponse(selectedTask.id, "decline", declineReason)}
            className="mt-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Kirim Alasan
          </button>
        </div>
      )}

      {/* Progress Bar dan Upload Progress */}
{/* {selectedTask?.status === "acc" && (
  <div className="mt-4">
    <p className="text-lg font-semibold">Progress Pengerjaan</p>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
    <p className="text-sm text-gray-600">{progressPercentage.toFixed(2)}% selesai</p>
    <input
      type="file"
      onChange={handleUploadProgress}
      className="mt-2"
    />
  </div>
)} */}

{/* Progress Bar dan Upload Progress */}
{selectedTask?.status === "acc" && (
  <div className="mt-4">
    <p className="text-lg font-semibold">Progress Pengerjaan</p>

    {typeof progressPercentage === "number" && !isNaN(progressPercentage) ? (
      <>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {progressPercentage.toFixed(2)}% selesai
        </p>
      </>
    ) : (
      <p className="text-sm text-gray-400">Belum ada progress</p>
    )}

    <input
      type="file"
      onChange={handleUploadProgress}
      className="mt-2"
    />
  </div>
)}



    </div>
  </div>
)}

        {/* Popup Portofolio */}
        {showPortofolioPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg max-w-2xl max-h-full overflow-auto">
              <h2 className="text-xl font-bold mb-4">Portofolio</h2>
              
              {portofolioUrl && (
  <>
    {portofolioUrl.endsWith(".pdf") ? (
      // Jika file adalah PDF, tampilkan dalam iframe
      <iframe
        src={portofolioUrl}
        className="w-full h-96"
        title="Portofolio"
        sandbox="allow-scripts allow-same-origin allow-downloads allow-forms"
      />
    ) : portofolioUrl.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) ? (
      // Jika file adalah gambar, tampilkan sebagai img
      <img
        src={portofolioUrl}
        alt="Portofolio"
        className="w-full h-auto max-h-96 object-contain"
      />
    ) : (
      // Jika file adalah Word, Excel, atau file lainnya, tampilkan link
      <a
        href={portofolioUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline block text-center mt-4"
      >
        Klik di sini untuk melihat portofolio
      </a>
    )}
  </>
)}

              <button
                onClick={() => setShowPortofolioPopup(false)}
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Popup Foto Profil */}
        {showProfilePicturePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Foto Profil</h2>
              <img
                src={profilePictureUrl}
                alt="Profile"
                className="w-64 h-64 rounded-full"
              />
              <button
                onClick={() => setShowProfilePicturePopup(false)}
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}