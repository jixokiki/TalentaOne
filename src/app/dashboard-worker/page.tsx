// src/app/dashboard-worker/page.tsx
"use client"; // Pastikan komponen ini dijalankan di sisi klien

import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc,addDoc, getDocs , collection, query, where, onSnapshot, updateDoc } from "firebase/firestore";
import { storage, db, auth } from '@/lib/firebaseConfig';
import NavbarWorker from '@/app/navbarworker'; // Sesuaikan path sesuai struktur proyek Anda
import { Task, Profile} from "@/lib/types";


export default function WorkerDashboard() {
  // const [profile, setProfile] = useState({
  //   noRekening: "",
  //   role: "",
  //   specialRole: "",
  //   portofolioFile: null,
  //   profilePicture: null,
  // });
  // const [profile, setProfile] = useState<Profile>({
  //   noRekening: "",
  //   role: "",
  //   specialRole: "",
  //   portofolioFile: null,
  //   profilePicture: null,
  // });

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
  });
  
  
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
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   const tasks = [];
    //   snapshot.forEach((doc) => {
    //     tasks.push({ id: doc.id, ...doc.data() });
    //   });
    //   setNotifications(tasks);
    // });
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

// Fungsi untuk mengupload bukti progress
// const handleUploadProgress = async (e) => {
const handleUploadProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {

  const file = e.target.files?.[0];
  // if (!file) return;
  if (!file || !selectedTask) return;


  try {
    const fileRef = ref(storage, `progress/${selectedTask.id}/${file.name}`);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);

    // Simpan progress ke Firestore
    await addDoc(collection(db, "tugasdariuser", selectedTask.id, "progress"), {
      fileUrl,
      fileName: file.name,
      uploadedAt: new Date(),
    });

    // Hitung progress percentage
    const progressSnapshot = await getDocs(collection(db, "tugasdariuser", selectedTask.id, "progress"));
    // const totalDays = Math.ceil((new Date(selectedTask.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    const totalDays = Math.ceil(
      (new Date(selectedTask.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );    
    const progress = (progressSnapshot.size / totalDays) * 100;
    setProgressPercentage(progress > 100 ? 100 : progress); // Batasi progress hingga 100%
  } catch (error) {
    console.error("Error uploading progress: ", error);
  }
};



    // // Fungsi untuk mengacc atau menolak tugas
    // const handleTaskResponse = async (taskId, status) => {
    //   try {
    //     await updateDoc(doc(db, "tugasdariuser", taskId), { status });
    //     alert(`Tugas berhasil di-${status}.`);
    //     setSelectedTask(null); // Tutup popup setelah merespons
    //   } catch (error) {
    //     console.error("Error updating task status: ", error);
    //   }
    // };
  
    // // Tampilkan popup detail tugas
    // const handleViewTask = (task) => {
    //   setSelectedTask(task);
    // };


    // Fungsi untuk mengacc atau menolak tugas
// const handleTaskResponse = async (taskId, status, reason = "") => {
  const handleTaskResponse = async (
    taskId: Task["taskId"],
    status: Task["status"],
    reason: Task["reason"]
  ) => {
  
  try {
    await updateDoc(doc(db, "tugasdariuser", taskId), { 
      status,
      declineReason: status === "decline" ? reason : "", // Simpan alasan jika status decline
    });
    alert(`Tugas berhasil di-${status}.`);
    setSelectedTask(null); // Tutup popup setelah merespons
    setDeclineReason(""); // Reset alasan decline
    setShowDeclineReason(false); // Sembunyikan input alasan decline
  } catch (error) {
    console.error("Error updating task status: ", error);
  }
};

// Tampilkan popup detail tugas dengan opsi decline dan acc
// const handleViewTask = (task) => {
//   setSelectedTask(task);
// };
const handleViewTask = (task: Task) => {
  setSelectedTask(task);
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
  //   e.preventDefault();

  //   try {
  //     // Upload Portofolio
  //     const portofolioRef = ref(storage, `portofolios/${profile.portofolioFile.name}`);
  //     await uploadBytes(portofolioRef, profile.portofolioFile);
  //     const portofolioUrl = await getDownloadURL(portofolioRef);
  //     setPortofolioUrl(portofolioUrl);

  //     // Upload Profile Picture
  //     const profilePictureRef = ref(storage, `profilePictures/${profile.profilePicture.name}`);
  //     await uploadBytes(profilePictureRef, profile.profilePicture);
  //     const profilePictureUrl = await getDownloadURL(profilePictureRef);
  //     setProfilePictureUrl(profilePictureUrl);

  //     // Simpan data ke Firestore
  //     const workerProfile = {
  //       noRekening: profile.noRekening,
  //       role: profile.role,
  //       specialRole: profile.specialRole,
  //       portofolioUrl,
  //       profilePictureUrl,
  //     };

  //     await setDoc(doc(db, "workers", "workerId"), workerProfile); // Ganti "workerId" dengan ID worker yang sesuai
  //     alert("Profile berhasil disimpan!");
  //     setIsEditing(false); // Setelah disimpan, tampilkan profile
  //   } catch (error) {
  //     console.error("Error uploading files or saving data: ", error);
  //   }
  // };

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

  // Fungsi untuk mengambil data dari Firestore (jika diperlukan)
  // const fetchProfile = async () => {
  //   const docRef = doc(db, "workers", "workerId");
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     const data = docSnap.data();
  //     setProfile({
  //       noRekening: data.noRekening,
  //       role: data.role,
  //       specialRole: data.specialRole,
  //       portofolioFile: null,
  //       profilePicture: null,
  //     });
  //     setPortofolioUrl(data.portofolioUrl);
  //     setProfilePictureUrl(data.profilePictureUrl);
  //     setIsEditing(false); // Tampilkan profile setelah data diambil
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
      // setProfile({
      //   noRekening: data.noRekening || "",
      //   role: data.role || "",
      //   specialRole: data.specialRole || "",
      //   portofolioFile: null,
      //   profilePicture: null,
      // });
      setProfile({
        noRekening: data.noRekening || "",
        role: data.role || "",
        specialRole: data.specialRole || "",
        name: data.name || "",
        email: data.email || "",
        portofolioUrl: data.portofolioUrl || "",
        profilePictureUrl: data.profilePictureUrl || "",
        uid: data.uid || user.uid, // fallback ke user.uid jika data.uid belum ada
        id: data.id || user.uid,   // atau dokumen Firestore ID
        portofolioFile: undefined,
        profilePicture: undefined,
      });
      
      setPortofolioUrl(data.portofolioUrl || "");
      setProfilePictureUrl(data.profilePictureUrl || "");
      setIsEditing(false); // Tampilkan profile setelah data diambil
    } else {
      console.log("Profil belum ada, user harus mengisi data.");
      setIsEditing(true);
    }
  };
  

  // Jalankan fetchProfile saat komponen dimuat
  // useEffect(() => {
  //   fetchProfile();
  // }, []);

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
            </div>
          </div>
        )}

        {/* Popup Detail Tugas
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
              <h2 className="text-xl font-bold mb-4">Detail Tugas</h2>
              <div className="space-y-4">
                <p><strong>File:</strong> <a href={selectedTask.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedTask.fileName}</a></p>
                <p><strong>Deskripsi:</strong> {selectedTask.description}</p>
                <p><strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleString()}</p>
                <p><strong>Status:</strong> {selectedTask.status}</p>
              </div>
              <div className="mt-6 flex space-x-4">
                {selectedTask.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleTaskResponse(selectedTask.id, "acc")}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                    >
                      Acc
                    </button>
                    <button
                      onClick={() => handleTaskResponse(selectedTask.id, "decline")}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
                    >
                      Decline
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedTask(null)}
                  className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* Popup Detail Tugas */}
{selectedTask && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
      <h2 className="text-xl font-bold mb-4">Detail Tugas</h2>
      <div className="space-y-4">
        <p><strong>File:</strong> <a href={selectedTask.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedTask.fileName}</a></p>
        <p><strong>Deskripsi:</strong> {selectedTask.description}</p>
        <p><strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleString()}</p>
        <p><strong>Status:</strong> {selectedTask.status}</p>
      </div>
      <div className="mt-6 flex space-x-4">
        {selectedTask.status === "pending" && (
          <>
            <button
              onClick={() => handleTaskResponse(selectedTask.id, "acc","")}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Acc
            </button>
            <button
              onClick={() => setShowDeclineReason(true)} // Tampilkan input alasan decline
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Decline
            </button>
          </>
        )}
        <button
          onClick={() => setSelectedTask(null)}
          className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Tutup
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
{selectedTask?.status === "acc" && (
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
)}
    </div>
  </div>
)}

        {/* Popup Portofolio */}
        {showPortofolioPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg max-w-2xl max-h-full overflow-auto">
              <h2 className="text-xl font-bold mb-4">Portofolio</h2>
              {/* <iframe
                src={portofolioUrl}
                className="w-full h-96"
                title="Portofolio"
              /> */}
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