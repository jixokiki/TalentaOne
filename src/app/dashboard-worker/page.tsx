// src/app/dashboard-worker/page.tsx
/* eslint-disable @next/next/no-img-element */
"use client"; // Pastikan komponen ini dijalankan di sisi klien

import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
import { FaStar } from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
      <NavbarWorker />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Dashboard Worker</h1>
        <p className="text-lg text-gray-600 mb-8">Selamat datang, Worker!</p>

        {/* Notifikasi Tugas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifikasi Tugas</h2>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((task) => {
                const taskDeadline = (task as unknown as { deadline?: AnyTimestamp }).deadline;
                return (
                  <div
                    key={task.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleViewTask(task)}
                  >
                    <p className="text-lg font-semibold text-gray-800">Tugas Baru dari User</p>
                    <p className="text-sm text-gray-600">Deadline: {formatDate(taskDeadline)}</p>
                    <p className="text-sm text-gray-600">Status: {task.status}</p>
                  </div>
                );
              })}
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
                {userRating !== null && (
                  <div className="flex mt-2 space-x-1 text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`${userRating >= star ? "text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-2 text-xs text-gray-600">Rating dari client</span>
                  </div>
                )}
              </div>

              {/* Bagian Kanan: Informasi Profile */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">No Rekening</label>
                  <p className="text-lg text-gray-900 bg-gray-100 p-3 rounded-lg">
                    {profile.noRekening}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <p className="text-lg text-gray-900 bg-gray-100 p-3 rounded-lg">{profile.role}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Role</label>
                  <p className="text-lg text-gray-900 bg-gray-100 p-3 rounded-lg">
                    {profile.specialRole}
                  </p>
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
            </div>
          </div>
        )}

        {/* Popup Detail Tugas */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative">
              <h2 className="text-xl font-bold mb-4">Detail Tugas</h2>
              <div className="space-y-4">
                <p>
                  <strong>File:</strong>{" "}
                  <a
                    href={selectedTask.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
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
                  <strong>Status:</strong> {selectedTask.status}
                </p>
                <p>
                  <strong>Nominal:</strong>{" "}
                  {selectedTask.nominal !== undefined && selectedTask.nominal !== null
                    ? String(selectedTask.nominal)
                    : ""}
                </p>
              </div>
              <div className="mt-6 flex space-x-4">
                {selectedTask.status === "pending" && (
                  <>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Masukkan Nominal Harga (Rp)
                      </label>
                      <input
                        type="number"
                        value={nominal}
                        onChange={(e) => setNominal(e.target.value)}
                        placeholder="Contoh: 50000"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                      <button
                        onClick={() => handleTaskResponse(selectedTask.id, "acc", "")}
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

                  {typeof progressPercentage === "number" && !Number.isNaN(progressPercentage) ? (
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

                  <input type="file" onChange={handleUploadProgress} className="mt-2" />
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
              <img src={profilePictureUrl} alt="Profile" className="w-64 h-64 rounded-full" />
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
