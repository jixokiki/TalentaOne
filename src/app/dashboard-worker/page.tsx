// // src/app/dashboard-worker/page.tsx
// /* eslint-disable @next/next/no-img-element */
// "use client"; // Pastikan komponen ini dijalankan di sisi klien

// import { useState, useEffect } from "react";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import Breadcrumbs from '@/components/Breadcrumbs';

// import {
//   doc,
//   setDoc,
//   getDoc,
//   addDoc,
//   getDocs,
//   collection,
//   query,
//   where,
//   onSnapshot,
//   updateDoc,
//   Timestamp,
// } from "firebase/firestore";
// import { storage, db, auth } from "@/lib/firebaseConfig";
// import NavbarWorker from "@/app/navbarworker"; // Sesuaikan path sesuai struktur proyek Anda
// import { Task, Profile } from "@/lib/types";
// import { FaStar } from "react-icons/fa";

// /** =========================
//  *  Helpers: aman untuk segala tipe tanggal (Timestamp/Date/number/string)
//  *  ========================= */

// // Nilai tanggal yang mungkin datang dari Firestore / JS
// type AnyTimestamp =
//   | Timestamp
//   | { seconds: number; nanoseconds?: number }
//   | Date
//   | number
//   | string
//   | null
//   | undefined;

// // Type guard: Firestore Timestamp (punya toDate)
// function isFirestoreTimestamp(v: unknown): v is Timestamp {
//   return !!v && typeof v === "object" && typeof (v as Timestamp).toDate === "function";
// }

// // Type guard: objek mirip Timestamp { seconds, nanoseconds? }
// function isSecondsObj(v: unknown): v is { seconds: number; nanoseconds?: number } {
//   return !!v && typeof v === "object" && typeof (v as { seconds: number }).seconds === "number";
// }

// function toDateSafe(value: AnyTimestamp): Date {
//   if (!value) return new Date(NaN);
//   if (value instanceof Date) return value;
//   if (isFirestoreTimestamp(value)) return value.toDate();
//   if (isSecondsObj(value)) return new Date(value.seconds * 1000);
//   if (typeof value === "number") return new Date(value);
//   if (typeof value === "string") {
//     const asNumber = Number(value);
//     if (!Number.isNaN(asNumber) && asNumber > 0) return new Date(asNumber); // epoch ms as string
//     const parsed = Date.parse(value);
//     if (!Number.isNaN(parsed)) return new Date(parsed);
//   }
//   // Fallback tidak memaksa cast ke any; kembalikan Invalid Date
//   return new Date(NaN);
// }

// function formatDate(value: AnyTimestamp): string {
//   const d = toDateSafe(value);
//   return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
// }

// /** =========================
//  *  Tipe lokal untuk state profile (tanpa mengubah struktur UI)
//  *  ========================= */
// type EditableProfile = Profile & {
//   portofolioFile?: File;
//   profilePicture?: File;
// };

// export default function WorkerDashboard() {
//   const [profile, setProfile] = useState<EditableProfile>({
//     noRekening: "",
//     role: "",
//     specialRole: "",
//     name: "",
//     email: "",
//     portofolioUrl: "",
//     profilePictureUrl: "",
//     uid: "",
//     id: "",
//     achievement: "",
//     // field file opsional dibiarkan undefined
//   });

//   const currentUser = auth.currentUser;

//   const [portofolioUrl, setPortofolioUrl] = useState("");
//   const [profilePictureUrl, setProfilePictureUrl] = useState("");
//   const [isEditing, setIsEditing] = useState(true); // Mode edit atau tampilan profile
//   const [showPortofolioPopup, setShowPortofolioPopup] = useState(false); // Popup portofolio
//   const [showProfilePicturePopup, setShowProfilePicturePopup] = useState(false); // Popup foto profil
//   const [notifications, setNotifications] = useState<Task[]>([]); // State untuk notifikasi tugas
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [declineReason, setDeclineReason] = useState(""); // State untuk alasan decline
//   const [showDeclineReason, setShowDeclineReason] = useState(false); // State untuk menampilkan input alasan decline

//   // Fungsi untuk mengambil notifikasi tugas
//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const q = query(collection(db, "tugasdariuser"), where("workerId", "==", user.uid));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const tasks = snapshot.docs.map((d) => {
//         const data = d.data() as Record<string, unknown>;
//         return { id: d.id, ...data };
//       }) as unknown as Task[];

//       setNotifications(tasks);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Progress bar
//   const [progressPercentage, setProgressPercentage] = useState(0);

//   const handleUploadProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !selectedTask || !currentUser) return;

//     try {
//       // Upload file ke Storage
//       const fileRef = ref(storage, `progress/${selectedTask.id}/${file.name}`);
//       await uploadBytes(fileRef, file);
//       const fileUrl = await getDownloadURL(fileRef);

//       // Simpan metadata file ke subcollection Firestore
//       await addDoc(collection(db, "tugasdariuser", selectedTask.id, "progress"), {
//         fileUrl,
//         fileName: file.name,
//         uploadedAt: new Date(),
//       });

//       // Hitung progress berdasarkan jumlah file & total hari
//       const progressSnapshot = await getDocs(
//         collection(db, "tugasdariuser", selectedTask.id, "progress")
//       );

//       const now = new Date();
//       const rawDeadline = (selectedTask as unknown as { deadline?: AnyTimestamp }).deadline;
//       const deadline = toDateSafe(rawDeadline);

//       const totalDays =
//         Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) || 1;

//       const calculatedProgress = (progressSnapshot.size / totalDays) * 100;
//       const progress = Math.min(100, calculatedProgress);
//       const statusProgress = progress >= 100 ? "Task Completed" : "in_progress";

//       // Achievement logic
//       let achievement = "";
//       if (progress >= 100 && now < deadline) {
//         const formattedNow = now.toLocaleString("id-ID", {
//           dateStyle: "long",
//           timeStyle: "short",
//         });
//         const formattedDeadline = deadline.toLocaleString("id-ID", {
//           dateStyle: "long",
//           timeStyle: "short",
//         });
//         achievement = `🎉 Pengerjaan terselesaikan sebelum deadline ${formattedNow} dengan deadline ${formattedDeadline}`;
//       }

//       // Simpan progress ke tugas
//       const taskRef = doc(db, "tugasdariuser", selectedTask.id);
//       await updateDoc(taskRef, {
//         progress,
//         statusProgress,
//         achievement,
//       });

//       // Simpan ke worker jika ada achievement
//       if (achievement) {
//         const workerRef = doc(db, "workers", currentUser.uid);
//         await updateDoc(workerRef, {
//           achievement,
//         });
//         await fetchProfile(); // ✅ Panggil ulang setelah update
//       }

//       setProgressPercentage(progress);

//       await addDoc(collection(db, "jawabanWorker"), {
//         taskId: selectedTask.id,
//         fileUrl,
//         fileName: file.name,
//         progress,
//         uploadedAt: new Date(),
//         status: statusProgress,
//         userEmail: currentUser.email || "unknown",
//       });

//       if (statusProgress === "Task Completed") {
//         alert("Tugas telah selesai 100% ✅");
//       }
//     } catch (error) {
//       console.error("Error uploading progress: ", error);
//     }
//   };

//   // ===================== WORKER SIDE =====================
//   // Fungsi ketika Worker menanggapi tugas (acc / decline)
//   const [nominal, setNominal] = useState("");

//   const handleTaskResponse = async (
//     taskId: Task["taskId"],
//     status: Task["status"],
//     reason: Task["reason"]
//   ) => {
//     try {
//       if (status === "acc" && (!nominal || Number.isNaN(parseInt(nominal, 10)))) {
//         alert("Harap isi nominal terlebih dahulu.");
//         return;
//       }

//       const parsedNominal = parseInt(nominal, 10);
//       if (status === "acc" && parsedNominal < 20000) {
//         alert("Nominal terlalu kecil. Minimal Rp 20.000.");
//         return;
//       }

//       await updateDoc(doc(db, "tugasdariuser", taskId), {
//         status,
//         isRead: false,
//         declineReason: status === "decline" ? reason : "",
//         ...(status === "acc" && { nominal: parsedNominal }),
//       });

//       await addDoc(collection(db, "jawabanWorker"), {
//         taskId,
//         status,
//         reason: status === "decline" ? reason : "",
//         respondedAt: new Date(),
//         userEmail: currentUser?.email || "unknown",
//       });

//       alert(`Tugas berhasil di-${status}.`);
//       setSelectedTask(null);
//       setNominal(""); // reset nominal
//       setDeclineReason("");
//       setShowDeclineReason(false);
//     } catch (error) {
//       console.error("Error updating task status: ", error);
//     }
//   };

//   const handleViewTask = async (task: Task) => {
//     const taskRef = doc(db, "tugasdariuser", task.id);
//     const taskSnap = await getDoc(taskRef);

//     if (taskSnap.exists()) {
//       const data = taskSnap.data() as { progress?: number };
//       setProgressPercentage(data.progress ?? 0); // jika pakai state progress
//     }

//     setSelectedTask(task); // ini penting agar popup muncul
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, files } = e.target;

//     if (name === "portofolioFile" && files) {
//       setProfile((prev) => ({ ...prev, portofolioFile: files[0] }));
//       return;
//     }
//     if (name === "profilePicture" && files) {
//       setProfile((prev) => ({ ...prev, profilePicture: files[0] }));
//       return;
//     }
//     if (name === "noRekening" || name === "role" || name === "specialRole") {
//       setProfile((prev) => ({ ...prev, [name]: value } as EditableProfile));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const user = auth.currentUser; // Ambil user yang sedang login
//     if (!user) {
//       alert("Anda belum login.");
//       return;
//     }

//     try {
//       // Upload Portofolio
//       let newPortofolioUrl = "";
//       if (profile.portofolioFile) {
//         const portofolioRef = ref(
//           storage,
//           `portofolios/${user.uid}_${profile.portofolioFile.name}`
//         );
//         await uploadBytes(portofolioRef, profile.portofolioFile);
//         newPortofolioUrl = await getDownloadURL(portofolioRef);
//         setPortofolioUrl(newPortofolioUrl);
//       }

//       // Upload Profile Picture
//       let newProfilePictureUrl = "";
//       if (profile.profilePicture) {
//         const profilePictureRef = ref(
//           storage,
//           `profilePictures/${user.uid}_${profile.profilePicture.name}`
//         );
//         await uploadBytes(profilePictureRef, profile.profilePicture);
//         newProfilePictureUrl = await getDownloadURL(profilePictureRef);
//         setProfilePictureUrl(newProfilePictureUrl);
//       }

//       // Simpan data ke Firestore berdasarkan UID user
//       const workerProfile = {
//         noRekening: profile.noRekening,
//         role: profile.role,
//         specialRole: profile.specialRole,
//         portofolioUrl: newPortofolioUrl,
//         profilePictureUrl: newProfilePictureUrl,
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

//   const fetchProfile = async () => {
//     const user = auth.currentUser;
//     if (!user) {
//       console.log("Tidak ada user yang login.");
//       return;
//     }

//     const docRef = doc(db, "workers", user.uid);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       type WorkerDoc = {
//         noRekening?: string;
//         role?: string;
//         specialRole?: string;
//         name?: string;
//         email?: string;
//         portofolioUrl?: string;
//         profilePictureUrl?: string;
//         uid?: string;
//         id?: string;
//         achievement?: string;
//       };

//       const data = docSnap.data() as WorkerDoc;

//       setProfile((prev) => ({
//         ...prev,
//         noRekening: data.noRekening ?? "",
//         role: data.role ?? "",
//         specialRole: data.specialRole ?? "",
//         name: data.name ?? "",
//         email: data.email ?? "",
//         portofolioUrl: data.portofolioUrl ?? "",
//         profilePictureUrl: data.profilePictureUrl ?? "",
//         uid: data.uid ?? user.uid,
//         id: data.id ?? user.uid,
//         achievement: data.achievement ?? "",
//       }));

//       setPortofolioUrl(data.portofolioUrl ?? "");
//       setProfilePictureUrl(data.profilePictureUrl ?? "");
//       setIsEditing(false);
//     } else {
//       console.log("Profil belum ada, user harus mengisi data.");
//       setIsEditing(true);
//     }
//   };

//   const [userRating, setUserRating] = useState<number | null>(null);

//   useEffect(() => {
//     const fetchRating = async () => {
//       if (!currentUser) return;

//       const ratingDoc = await getDoc(doc(db, "ratings", currentUser.uid));
//       if (ratingDoc.exists()) {
//         const ratingData = ratingDoc.data() as { rating?: number } | undefined;
//         setUserRating(ratingData?.rating ?? null);
//       }
//     };

//     fetchRating();
//   }, [currentUser]);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         fetchProfile();
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <main role="main" className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
//     <NavbarWorker />

//     <Breadcrumbs
//       items={[
//         { name: 'Home', href: '/' },
//         { name: 'Dashboard Worker', href: '/dashboard-worker' },
//       ]}
//     />

//     {/* Teks aksesibilitas untuk screen reader & bisa membantu snippet */}
//     <p className="sr-only">
//       Dashboard privat untuk worker: lihat notifikasi tugas, respon acc/decline dengan nominal,
//       unggah progres dan file tugas akhir, kelola profil serta portofolio.
//     </p>
//     <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
//       {/* <NavbarWorker /> */}
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Dashboard Worker</h1>
//         <p className="text-lg text-gray-600 mb-8">Selamat datang, Worker!</p>

//         {/* Notifikasi Tugas */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifikasi Tugas</h2>
//           {notifications.length > 0 ? (
//             <div className="space-y-4">
//               {notifications.map((task) => {
//                 const taskDeadline = (task as unknown as { deadline?: AnyTimestamp }).deadline;
//                 return (
//                   <div
//                     key={task.id}
//                     className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
//                     onClick={() => handleViewTask(task)}
//                   >
//                     <p className="text-lg font-semibold text-gray-800">Tugas Baru dari User</p>
//                     <p className="text-sm text-gray-600">Deadline: {formatDate(taskDeadline)}</p>
//                     <p className="text-sm text-gray-600">Status: {task.status}</p>
//                   </div>
//                 );
//               })}
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
//                 {userRating !== null && (
//                   <div className="flex mt-2 space-x-1 text-yellow-400">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <FaStar
//                         key={star}
//                         className={`${userRating >= star ? "text-yellow-400" : "text-gray-300"}`}
//                       />
//                     ))}
//                     <span className="ml-2 text-xs text-gray-600">Rating dari client</span>
//                   </div>
//                 )}
//               </div>

//               {/* Bagian Kanan: Informasi Profile */}
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">No Rekening</label>
//                   <p className="text-lg text-gray-900 bg-gray-100 p-3 rounded-lg">
//                     {profile.noRekening}
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
//                   <p className="text-lg text-gray-900 bg-gray-100 p-3 rounded-lg">{profile.role}</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Special Role</label>
//                   <p className="text-lg text-gray-900 bg-gray-100 p-3 rounded-lg">
//                     {profile.specialRole}
//                   </p>
//                 </div>

//                 {profile.achievement && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Achievement</label>
//                     <div className="text-green-700 bg-green-100 p-3 rounded-lg border-l-4 border-green-600">
//                       {profile.achievement}
//                     </div>
//                   </div>
//                 )}

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

//         {/* Popup Detail Tugas */}
//         {selectedTask && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative">
//               <h2 className="text-xl font-bold mb-4">Detail Tugas</h2>
//               <div className="space-y-4">
//                 <p>
//                   <strong>File:</strong>{" "}
//                   <a
//                     href={selectedTask.fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline"
//                   >
//                     {selectedTask.fileName}
//                   </a>
//                 </p>
//                 <p>
//                   <strong>Deskripsi:</strong> {selectedTask.description}
//                 </p>
//                 <p>
//                   <strong>Deadline:</strong>{" "}
//                   {formatDate((selectedTask as unknown as { deadline?: AnyTimestamp }).deadline)}
//                 </p>
//                 <p>
//                   <strong>Status:</strong> {selectedTask.status}
//                 </p>
//                 <p>
//                   <strong>Nominal:</strong>{" "}
//                   {selectedTask.nominal !== undefined && selectedTask.nominal !== null
//                     ? String(selectedTask.nominal)
//                     : ""}
//                 </p>
//               </div>
//               <div className="mt-6 flex space-x-4">
//                 {selectedTask.status === "pending" && (
//                   <>
//                     <div className="mt-4">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Masukkan Nominal Harga (Rp)
//                       </label>
//                       <input
//                         type="number"
//                         value={nominal}
//                         onChange={(e) => setNominal(e.target.value)}
//                         placeholder="Contoh: 50000"
//                         className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                       />
//                       <button
//                         onClick={() => handleTaskResponse(selectedTask.id, "acc", "")}
//                         className="bg-green-600 text-white py-2 px-9 mx-1 my-2 rounded-lg hover:bg-green-700 transition duration-300"
//                       >
//                         Acc
//                       </button>
//                       <button
//                         onClick={() => setShowDeclineReason(true)} // Tampilkan input alasan decline
//                         className="bg-red-600 text-white py-2 px-8 mx-2 rounded-lg hover:bg-red-700 transition duration-300"
//                       >
//                         Decline
//                       </button>
//                       <button
//                         onClick={() => setSelectedTask(null)}
//                         className="bg-gray-600 text-white py-2 px-8 mx-2 rounded-lg hover:bg-gray-700 transition duration-300"
//                       >
//                         Tutup
//                       </button>
//                     </div>
//                   </>
//                 )}
//                 {/* Tombol X di pojok kanan atas */}
//                 <button
//                   onClick={() => setSelectedTask(null)}
//                   className="absolute top-2 right-2 bg-gray-600 text-white px-3 py-1 rounded-full hover:bg-gray-700 transition duration-300"
//                   aria-label="Tutup"
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* Popup Alasan Decline */}
//               {showDeclineReason && (
//                 <div className="mt-4">
//                   <textarea
//                     value={declineReason}
//                     onChange={(e) => setDeclineReason(e.target.value)}
//                     placeholder="Masukkan alasan decline..."
//                     className="w-full p-2 border border-gray-300 rounded-lg"
//                     rows={3}
//                   />
//                   <button
//                     onClick={() => handleTaskResponse(selectedTask.id, "decline", declineReason)}
//                     className="mt-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
//                   >
//                     Kirim Alasan
//                   </button>
//                 </div>
//               )}

//               {/* Progress Bar dan Upload Progress */}
//               {selectedTask?.status === "acc" && (
//                 <div className="mt-4">
//                   <p className="text-lg font-semibold">Progress Pengerjaan</p>

//                   {typeof progressPercentage === "number" && !Number.isNaN(progressPercentage) ? (
//                     <>
//                       <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div
//                           className="bg-blue-600 h-2.5 rounded-full"
//                           style={{ width: `${progressPercentage}%` }}
//                         ></div>
//                       </div>
//                       <p className="text-sm text-gray-600 mt-1">
//                         {progressPercentage.toFixed(2)}% selesai
//                       </p>
//                     </>
//                   ) : (
//                     <p className="text-sm text-gray-400">Belum ada progress</p>
//                   )}

//                   <input type="file" onChange={handleUploadProgress} className="mt-2" />
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Popup Portofolio */}
//         {showPortofolioPopup && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white p-6 rounded-lg max-w-2xl max-h-full overflow-auto">
//               <h2 className="text-xl font-bold mb-4">Portofolio</h2>

//               {portofolioUrl && (
//                 <>
//                   {portofolioUrl.endsWith(".pdf") ? (
//                     // Jika file adalah PDF, tampilkan dalam iframe
//                     <iframe
//                       src={portofolioUrl}
//                       className="w-full h-96"
//                       title="Portofolio"
//                       sandbox="allow-scripts allow-same-origin allow-downloads allow-forms"
//                     />
//                   ) : portofolioUrl.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) ? (
//                     // Jika file adalah gambar, tampilkan sebagai img
//                     <img
//                       src={portofolioUrl}
//                       alt="Portofolio"
//                       className="w-full h-auto max-h-96 object-contain"
//                     />
//                   ) : (
//                     // Jika file adalah Word, Excel, atau file lainnya, tampilkan link
//                     <a
//                       href={portofolioUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline block text-center mt-4"
//                     >
//                       Klik di sini untuk melihat portofolio
//                     </a>
//                   )}
//                 </>
//               )}

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
//               <img src={profilePictureUrl} alt="Profile" className="w-64 h-64 rounded-full" />
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
//     </main>
//   );
// }
// src/app/dashboard-worker/page.tsx
/* eslint-disable @next/next/no-img-element */
"use client"; // Pastikan komponen ini dijalankan di sisi klien

import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Breadcrumbs from '@/components/Breadcrumbs';

import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { storage, db, auth } from "@/lib/firebaseConfig";
import NavbarWorker from "@/app/navbarworker"; // Sesuaikan path sesuai struktur proyek Anda
import { Task, Profile } from "@/lib/types";
import { FaStar, FaTrophy } from "react-icons/fa";

/** =========================
 *  Helpers: aman untuk segala tipe tanggal (Timestamp/Date/number/string)
 *  ========================= */

// Nilai tanggal yang mungkin datang dari Firestore / JS
type AnyTimestamp =
  | Timestamp
  | { seconds: number; nanoseconds?: number }
  | Date
  | number
  | string
  | null
  | undefined;

// Type guard: Firestore Timestamp (punya toDate)
function isFirestoreTimestamp(v: unknown): v is Timestamp {
  return !!v && typeof v === "object" && typeof (v as Timestamp).toDate === "function";
}

// Type guard: objek mirip Timestamp { seconds, nanoseconds? }
function isSecondsObj(v: unknown): v is { seconds: number; nanoseconds?: number } {
  return !!v && typeof v === "object" && typeof (v as { seconds: number }).seconds === "number";
}

function toDateSafe(value: AnyTimestamp): Date {
  if (!value) return new Date(NaN);
  if (value instanceof Date) return value;
  if (isFirestoreTimestamp(value)) return value.toDate();
  if (isSecondsObj(value)) return new Date(value.seconds * 1000);
  if (typeof value === "number") return new Date(value);
  if (typeof value === "string") {
    const asNumber = Number(value);
    if (!Number.isNaN(asNumber) && asNumber > 0) return new Date(asNumber); // epoch ms as string
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) return new Date(parsed);
  }
  // Fallback tidak memaksa cast ke any; kembalikan Invalid Date
  return new Date(NaN);
}

function formatDate(value: AnyTimestamp): string {
  const d = toDateSafe(value);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
}

/** =========================
 *  Tipe lokal untuk state profile (tanpa mengubah struktur UI)
 *  ========================= */
type EditableProfile = Profile & {
  portofolioFile?: File;
  profilePicture?: File;
};

export default function WorkerDashboard() {
  const [profile, setProfile] = useState<EditableProfile>({
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
    // field file opsional dibiarkan undefined
  });

  const currentUser = auth.currentUser;

  const [portofolioUrl, setPortofolioUrl] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [isEditing, setIsEditing] = useState(true); // Mode edit atau tampilan profile
  const [showPortofolioPopup, setShowPortofolioPopup] = useState(false); // Popup portofolio
  const [showProfilePicturePopup, setShowProfilePicturePopup] = useState(false); // Popup foto profil
  const [notifications, setNotifications] = useState<Task[]>([]); // State untuk notifikasi tugas
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [declineReason, setDeclineReason] = useState(""); // State untuk alasan decline
  const [showDeclineReason, setShowDeclineReason] = useState(false); // State untuk menampilkan input alasan decline

  // Fungsi untuk mengambil notifikasi tugas
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "tugasdariuser"), where("workerId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return { id: d.id, ...data };
      }) as unknown as Task[];

      setNotifications(tasks);
    });

    return () => unsubscribe();
  }, []);

  // Progress bar
  const [progressPercentage, setProgressPercentage] = useState(0);

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
      const rawDeadline = (selectedTask as unknown as { deadline?: AnyTimestamp }).deadline;
      const deadline = toDateSafe(rawDeadline);

      const totalDays =
        Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) || 1;

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

  // ===================== WORKER SIDE =====================
  // Fungsi ketika Worker menanggapi tugas (acc / decline)
  const [nominal, setNominal] = useState("");

  const handleTaskResponse = async (
    taskId: Task["taskId"],
    status: Task["status"],
    reason: Task["reason"]
  ) => {
    try {
      if (status === "acc" && (!nominal || Number.isNaN(parseInt(nominal, 10)))) {
        alert("Harap isi nominal terlebih dahulu.");
        return;
      }

      const parsedNominal = parseInt(nominal, 10);
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
      const data = taskSnap.data() as { progress?: number };
      setProgressPercentage(data.progress ?? 0); // jika pakai state progress
    }

    setSelectedTask(task); // ini penting agar popup muncul
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "portofolioFile" && files) {
      setProfile((prev) => ({ ...prev, portofolioFile: files[0] }));
      return;
    }
    if (name === "profilePicture" && files) {
      setProfile((prev) => ({ ...prev, profilePicture: files[0] }));
      return;
    }
    if (name === "noRekening" || name === "role" || name === "specialRole") {
      setProfile((prev) => ({ ...prev, [name]: value } as EditableProfile));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser; // Ambil user yang sedang login
    if (!user) {
      alert("Anda belum login.");
      return;
    }

    try {
      // Upload Portofolio
      let newPortofolioUrl = "";
      if (profile.portofolioFile) {
        const portofolioRef = ref(
          storage,
          `portofolios/${user.uid}_${profile.portofolioFile.name}`
        );
        await uploadBytes(portofolioRef, profile.portofolioFile);
        newPortofolioUrl = await getDownloadURL(portofolioRef);
        setPortofolioUrl(newPortofolioUrl);
      }

      // Upload Profile Picture
      let newProfilePictureUrl = "";
      if (profile.profilePicture) {
        const profilePictureRef = ref(
          storage,
          `profilePictures/${user.uid}_${profile.profilePicture.name}`
        );
        await uploadBytes(profilePictureRef, profile.profilePicture);
        newProfilePictureUrl = await getDownloadURL(profilePictureRef);
        setProfilePictureUrl(newProfilePictureUrl);
      }

      // Simpan data ke Firestore berdasarkan UID user
      const workerProfile = {
        noRekening: profile.noRekening,
        role: profile.role,
        specialRole: profile.specialRole,
        portofolioUrl: newPortofolioUrl,
        profilePictureUrl: newProfilePictureUrl,
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

  const fetchProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log("Tidak ada user yang login.");
      return;
    }

    const docRef = doc(db, "workers", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      type WorkerDoc = {
        noRekening?: string;
        role?: string;
        specialRole?: string;
        name?: string;
        email?: string;
        portofolioUrl?: string;
        profilePictureUrl?: string;
        uid?: string;
        id?: string;
        achievement?: string;
      };

      const data = docSnap.data() as WorkerDoc;

      setProfile((prev) => ({
        ...prev,
        noRekening: data.noRekening ?? "",
        role: data.role ?? "",
        specialRole: data.specialRole ?? "",
        name: data.name ?? "",
        email: data.email ?? "",
        portofolioUrl: data.portofolioUrl ?? "",
        profilePictureUrl: data.profilePictureUrl ?? "",
        uid: data.uid ?? user.uid,
        id: data.id ?? user.uid,
        achievement: data.achievement ?? "",
      }));

      setPortofolioUrl(data.portofolioUrl ?? "");
      setProfilePictureUrl(data.profilePictureUrl ?? "");
      setIsEditing(false);
    } else {
      console.log("Profil belum ada, user harus mengisi data.");
      setIsEditing(true);
    }
  };

  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      if (!currentUser) return;

      const ratingDoc = await getDoc(doc(db, "ratings", currentUser.uid));
      if (ratingDoc.exists()) {
        const ratingData = ratingDoc.data() as { rating?: number } | undefined;
        setUserRating(ratingData?.rating ?? null);
      }
    };

    fetchRating();
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchProfile();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main
      role="main"
      className="
        relative min-h-screen overflow-hidden
        bg-gradient-to-br from-indigo-50 via-white to-purple-50
        dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950
        selection:bg-indigo-200 selection:text-indigo-900
      "
    >
      {/* Decorative blurred orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-400/20 to-fuchsia-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-cyan-400/20 to-purple-400/20 blur-3xl" />
      </div>

      <NavbarWorker />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Dashboard Worker', href: '/dashboard-worker' },
          ]}
        />

        {/* Teks aksesibilitas untuk screen reader & bisa membantu snippet */}
        <p className="sr-only">
          Dashboard privat untuk worker: lihat notifikasi tugas, respon acc/decline dengan nominal,
          unggah progres dan file tugas akhir, kelola profil serta portofolio.
        </p>

        <header className="mt-6 flex flex-col gap-3">
          <h1
            className="
              text-4xl font-black tracking-tight text-slate-900
              dark:text-white
              drop-shadow-sm
            "
          >
            <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Worker
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Selamat datang, Worker! Kelola tugas, progres, dan profil Anda dalam satu tempat.
          </p>
        </header>

        {/* Wrapper utama dengan efek glass & ring glow */}
        <div
          className="
            mt-8 rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur
            ring-1 ring-inset ring-slate-900/5
            dark:border-white/10 dark:bg-white/5 dark:ring-white/10
          "
        >
          {/* Notifikasi Tugas */}
          <section className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Notifikasi Tugas
              </h2>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                {notifications.length} tugas
              </span>
            </div>

            {notifications.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {notifications.map((task) => {
                  const taskDeadline = (task as unknown as { deadline?: AnyTimestamp }).deadline;
                  const statusTone =
                    task.status === "acc"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : task.status === "decline"
                      ? "bg-rose-500/10 text-rose-700 dark:text-rose-300"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-300";

                  const statusLabel =
                    task.status === "acc" ? "Diterima" : task.status === "decline" ? "Ditolak" : "Menunggu";

                  return (
                    <button
                      key={task.id}
                      onClick={() => handleViewTask(task)}
                      className="
                        group relative w-full overflow-hidden rounded-xl border border-slate-200/70 bg-white/70 p-4 text-left
                        shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none
                        focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                        dark:border-white/10 dark:bg-white/5
                      "
                    >
                      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/60 to-white/20 dark:from-white/[0.08] dark:to-white/[0.02]" />
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                          Tugas Baru dari User
                        </p>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Deadline: <span className="font-medium">{formatDate(taskDeadline)}</span>
                      </p>
                      <div
                        aria-hidden
                        className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"
                      >
                        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-500 transition-all group-hover:w-2/3" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-slate-600 dark:text-slate-300">Tidak ada tugas baru.</p>
            )}
          </section>

          {/* Profil */}
          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              className="
                relative space-y-6 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur
                dark:border-white/10 dark:bg-white/5
              "
            >
              <div className="absolute -inset-[1px] -z-10 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-cyan-500/10" />
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    No Rekening
                  </label>
                  <input
                    type="text"
                    name="noRekening"
                    value={profile.noRekening}
                    onChange={handleChange}
                    className="
                      w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-slate-900 shadow-sm
                      outline-none ring-1 ring-transparent transition placeholder:text-slate-400
                      focus:border-indigo-500 focus:ring-indigo-500/30
                      dark:border-white/10 dark:bg-white/10 dark:text-white
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={profile.role}
                    onChange={handleChange}
                    className="
                      w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-slate-900 shadow-sm
                      outline-none ring-1 ring-transparent transition placeholder:text-slate-400
                      focus:border-indigo-500 focus:ring-indigo-500/30
                      dark:border-white/10 dark:bg-white/10 dark:text-white
                    "
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Special Role
                  </label>
                  <input
                    type="text"
                    name="specialRole"
                    value={profile.specialRole}
                    onChange={handleChange}
                    className="
                      w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-slate-900 shadow-sm
                      outline-none ring-1 ring-transparent transition placeholder:text-slate-400
                      focus:border-indigo-500 focus:ring-indigo-500/30
                      dark:border-white/10 dark:bg-white/10 dark:text-white
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Upload Portofolio
                  </label>
                  <input
                    type="file"
                    name="portofolioFile"
                    onChange={handleChange}
                    className="
                      block w-full cursor-pointer rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-slate-900
                      file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white
                      hover:file:bg-indigo-700
                      dark:border-white/10 dark:bg-white/10 dark:text-white
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Upload Foto Profil
                  </label>
                  <input
                    type="file"
                    name="profilePicture"
                    onChange={handleChange}
                    className="
                      block w-full cursor-pointer rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-slate-900
                      file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-fuchsia-600 file:px-4 file:py-2 file:text-white
                      hover:file:bg-fuchsia-700
                      dark:border-white/10 dark:bg-white/10 dark:text-white
                    "
                  />
                </div>
              </div>

              <button
                type="submit"
                className="
                  w-full rounded-xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-purple-600 px-4 py-3
                  font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                "
              >
                Simpan Profile
              </button>
            </form>
          ) : (
            <div
              className="
                rounded-2xl border border-slate-200/70 bg-white/70 p-8 shadow-sm backdrop-blur
                dark:border-white/10 dark:bg-white/5
              "
            >
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Bagian Kiri: Foto Profil */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 h-48 w-48">
                    <img
                      src={profilePictureUrl}
                      alt="Profile"
                      className="
                        h-full w-full rounded-full object-cover
                        border-4 border-white/70 shadow-xl
                        dark:border-white/20
                        cursor-pointer
                      "
                      onClick={() => setShowProfilePicturePopup(true)}
                    />
                    <div
                      aria-hidden
                      className="
                        absolute inset-0 rounded-full
                        ring-2 ring-transparent transition
                        hover:ring-fuchsia-400/40
                      "
                    />
                  </div>
                  <button
                    onClick={handleEdit}
                    className="
                      rounded-xl bg-emerald-600 px-6 py-2 font-semibold text-white shadow-lg transition
                      hover:bg-emerald-700 active:scale-[0.99]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500
                    "
                  >
                    Edit Profile
                  </button>

                  {userRating !== null && (
                    <div className="mt-3 flex items-center space-x-1 text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`${userRating >= star ? "text-yellow-400" : "text-gray-300 dark:text-slate-600"}`}
                        />
                      ))}
                      <span className="ml-2 text-xs text-slate-600 dark:text-slate-300">
                        Rating dari client
                      </span>
                    </div>
                  )}
                </div>

                {/* Bagian Kanan: Informasi Profile */}
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      No Rekening
                    </label>
                    <p className="rounded-xl bg-slate-50 p-3 text-lg text-slate-900 ring-1 ring-inset ring-slate-900/5 dark:bg-white/10 dark:text-white dark:ring-white/10">
                      {profile.noRekening}
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Role
                    </label>
                    <p className="rounded-xl bg-slate-50 p-3 text-lg text-slate-900 ring-1 ring-inset ring-slate-900/5 dark:bg-white/10 dark:text-white dark:ring-white/10">
                      {profile.role}
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Special Role
                    </label>
                    <p className="rounded-xl bg-slate-50 p-3 text-lg text-slate-900 ring-1 ring-inset ring-slate-900/5 dark:bg-white/10 dark:text-white dark:ring-white/10">
                      {profile.specialRole}
                    </p>
                  </div>

                  {profile.achievement && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Achievement
                      </label>
                      <div className="flex items-start gap-3 rounded-xl border-l-4 border-emerald-600 bg-emerald-50 p-3 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-200">
                        <FaTrophy className="mt-0.5 shrink-0" />
                        <div>{profile.achievement}</div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Portofolio
                    </label>
                    <button
                      onClick={() => setShowPortofolioPopup(true)}
                      className="
                        inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600
                        px-4 py-2 font-semibold text-white shadow-md transition hover:brightness-110 active:scale-[0.99]
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                      "
                    >
                      Lihat Portofolio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Popup Detail Tugas */}
          {selectedTask && (
            <div
              className="
                fixed inset-0 z-[60] flex items-center justify-center p-4
                bg-black/50 backdrop-blur-sm
              "
            >
              <div
                className="
                  relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20
                  bg-white/80 p-6 shadow-2xl backdrop-blur
                  dark:bg-slate-900/80
                "
                role="dialog"
                aria-modal="true"
                aria-label="Detail Tugas"
              >
                <div className="absolute inset-x-0 -top-1 h-px bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Detail Tugas</h2>

                <div className="mt-4 space-y-3 text-slate-700 dark:text-slate-200">
                  <p>
                    <strong>File:</strong>{" "}
                    <a
                      href={selectedTask.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-indigo-600 underline hover:text-indigo-700"
                    >
                      {selectedTask.fileName}
                    </a>
                  </p>
                  <p>
                    <strong>Deskripsi:</strong> {selectedTask.description}
                  </p>
                  <p>
                    <strong>Deadline:</strong>{" "}
                    {formatDate((selectedTask as unknown as { deadline?: AnyTimestamp }).deadline)}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-sm dark:bg-white/10">
                      {selectedTask.status}
                    </span>
                  </p>
                  <p>
                    <strong>Nominal:</strong>{" "}
                    {selectedTask.nominal !== undefined && selectedTask.nominal !== null
                      ? String(selectedTask.nominal)
                      : ""}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {selectedTask.status === "pending" && (
                    <>
                      <div className="mt-1 w-full rounded-xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-900/5 dark:bg-white/5 dark:ring-white/10">
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                          Masukkan Nominal Harga (Rp)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={nominal}
                            onChange={(e) => setNominal(e.target.value)}
                            placeholder="Contoh: 50000"
                            className="
                              w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm
                              outline-none ring-1 ring-transparent transition placeholder:text-slate-400
                              focus:border-indigo-500 focus:ring-indigo-500/30
                              dark:border-white/10 dark:bg-white/10 dark:text-white
                            "
                          />
                          <button
                            onClick={() => handleTaskResponse(selectedTask.id, "acc", "")}
                            className="
                              shrink-0 rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white shadow-md transition
                              hover:bg-emerald-700 active:scale-[0.99]
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500
                            "
                          >
                            Acc
                          </button>
                          <button
                            onClick={() => setShowDeclineReason(true)} // Tampilkan input alasan decline
                            className="
                              shrink-0 rounded-xl bg-rose-600 px-5 py-2 font-semibold text-white shadow-md transition
                              hover:bg-rose-700 active:scale-[0.99]
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500
                            "
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => setSelectedTask(null)}
                            className="
                              shrink-0 rounded-xl bg-slate-700 px-5 py-2 font-semibold text-white shadow-md transition
                              hover:bg-slate-800 active:scale-[0.99]
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500
                            "
                          >
                            Tutup
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Tombol X di pojok kanan atas */}
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="
                      absolute right-2 top-2 rounded-full bg-slate-800/80 px-3 py-1 text-white shadow
                      transition hover:bg-slate-900
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500
                    "
                    aria-label="Tutup"
                    title="Tutup"
                  >
                    ✕
                  </button>
                </div>

                {/* Popup Alasan Decline */}
                {showDeclineReason && (
                  <div className="mt-4 rounded-xl bg-rose-50 p-3 ring-1 ring-inset ring-rose-200 dark:bg-rose-500/10 dark:ring-rose-500/30">
                    <textarea
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder="Masukkan alasan decline..."
                      className="
                        h-28 w-full resize-none rounded-xl border border-rose-200 bg-white/80 p-2 text-slate-900 shadow-sm
                        outline-none ring-1 ring-transparent transition placeholder:text-slate-400
                        focus:border-rose-500 focus:ring-rose-500/30
                        dark:border-rose-500/30 dark:bg-white/10 dark:text-white
                      "
                    />
                    <button
                      onClick={() => handleTaskResponse(selectedTask.id, "decline", declineReason)}
                      className="
                        mt-2 rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white shadow-md transition
                        hover:bg-rose-700 active:scale-[0.99]
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500
                      "
                    >
                      Kirim Alasan
                    </button>
                  </div>
                )}

                {/* Progress Bar dan Upload Progress */}
                {selectedTask?.status === "acc" && (
                  <div className="mt-6">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">Progress Pengerjaan</p>

                    {typeof progressPercentage === "number" && !Number.isNaN(progressPercentage) ? (
                      <>
                        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                          <div
                            className="
                              h-full rounded-full
                              bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500
                              shadow-inner
                            "
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          {progressPercentage.toFixed(2)}% selesai
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-400">Belum ada progress</p>
                    )}

                    <label
                      className="
                        mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200
                        bg-white/80 px-4 py-2 font-medium text-slate-900 shadow-sm transition
                        hover:border-indigo-300 hover:text-indigo-700
                        dark:border-white/10 dark:bg-white/10 dark:text-white
                      "
                    >
                      <input type="file" onChange={handleUploadProgress} className="hidden" />
                      <span>Upload Progress</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Popup Portofolio */}
          {showPortofolioPopup && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
              <div className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur dark:bg-slate-900/85">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Portofolio</h2>

                <div className="mt-4">
                  {portofolioUrl && (
                    <>
                      {portofolioUrl.endsWith(".pdf") ? (
                        <iframe
                          src={portofolioUrl}
                          className="h-[70vh] w-full rounded-xl ring-1 ring-inset ring-slate-900/5 dark:ring-white/10"
                          title="Portofolio"
                          sandbox="allow-scripts allow-same-origin allow-downloads allow-forms"
                        />
                      ) : portofolioUrl.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) ? (
                        <img
                          src={portofolioUrl}
                          alt="Portofolio"
                          className="mx-auto max-h-[70vh] w-full rounded-xl object-contain ring-1 ring-inset ring-slate-900/5 dark:ring-white/10"
                        />
                      ) : (
                        <a
                          href={portofolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-indigo-700"
                        >
                          Klik di sini untuk melihat portofolio
                        </a>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setShowPortofolioPopup(false)}
                    className="
                      rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white shadow-md transition
                      hover:bg-rose-700 active:scale-[0.99]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500
                    "
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Popup Foto Profil */}
          {showProfilePicturePopup && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur dark:bg-slate-900/85">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Foto Profil</h2>
                <img
                  src={profilePictureUrl}
                  alt="Profile"
                  className="mx-auto mt-4 h-64 w-64 rounded-full object-cover ring-2 ring-inset ring-white/80 dark:ring-white/20"
                />
                <button
                  onClick={() => setShowProfilePicturePopup(false)}
                  className="
                    mt-6 w-full rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white shadow-md transition
                    hover:bg-rose-700 active:scale-[0.99]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500
                  "
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
