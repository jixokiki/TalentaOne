'use client';

import { useState, useEffect } from 'react';
import { getDocs, collection, query, where, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { db, auth, storage } from '@/lib/firebaseConfig';
//JANGAN DIHAPUS DULU useRouternya
// import { useRouter } from 'next/navigation'; // For navigation to profile
// import { FiUser } from 'react-icons/fi'; // Ensure react-icons is installed
import NavbarUser from '@/app/navbaruser'; // Sesuaikan path sesuai struktur proyek Anda
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {  WorkerProfile } from "@/lib/types";

interface Message {
  text: string;
  sender: string;
  createdAt: Date;
}

// interface WorkerProfile {
//   noRekening: string;
//   role: string;
//   specialRole: string;
//   portofolioUrl: string;
//   profilePictureUrl: string;
//   uid: string;
// }

export default function UserDashboard() {
  const [currentQueueNumber, setCurrentQueueNumber] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]); // Store messages from the chat
  const [newMessage, setNewMessage] = useState(''); // For new messages
  const [name, setName] = useState('');
  //JANGAN DIHAPUS DULU
  // const router = useRouter();
  const [workerProfiles, setWorkerProfiles] = useState<WorkerProfile[]>([]); // State untuk menyimpan data worker

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

  // Fetch worker profiles from Firestore
  useEffect(() => {
    const fetchWorkerProfiles = async () => {
      const workersQuery = query(collection(db, 'workers'));
      const querySnapshot = await getDocs(workersQuery);
      // const workers = querySnapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // })) as WorkerProfile[];
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

  // const handleSendMessage = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const user = auth.currentUser;
  //   if (!newMessage) return;

  //   await addDoc(collection(db, 'chats'), {
  //     text: newMessage,
  //     sender: user?.email || 'Unknown',
  //     queueNumber: currentQueueNumber,
  //     createdAt: new Date(),
  //   });

  //   setNewMessage('');
  // };

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

  //JANGAN DIHAPUS DULU
  // const handleProfileClick = () => {
  //   router.push('/profile');
  // };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800">Dashboard User</h1>
        {/* <FiUser
          className="text-4xl text-gray-800 cursor-pointer"
          onClick={handleProfileClick}
          title="Profile"
        /> */}
      </div>
      <p className="mb-8 text-lg">Selamat datang, User!</p>

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
            {/* {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <p className="text-sm font-semibold">{msg.sender}:</p>
                <p>{msg.text}</p>
              </div>
            ))} */}
            {messages.map((msg, index) => (
  <div key={index}> {/* Tambahkan key */}
    <p className="text-sm font-semibold">{msg.sender}:</p>
    <p>{msg.text}</p>
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
{workerProfiles.map((worker) => (
  <div key={worker.uid} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
    {/* ... (kode sebelumnya) ... */}
    {worker.tasks?.map((task) => (
      <div key={task.id} className="mt-4">
        <p><strong>Status Tugas:</strong> {task.status}</p>
        {task.status === "decline" && (
          <p><strong>Alasan Decline:</strong> {task.declineReason}</p>
        )}
        {task.status === "acc" && (
          <div>
            <p><strong>Progress:</strong></p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${task.progressPercentage}%` }}
              ></div>
            </div>
            {/* <p className="text-sm text-gray-600">{task.progressPercentage.toFixed(2)}% selesai</p> */}
            {typeof task.progressPercentage === "number" && (
  <p className="text-sm text-gray-600">
    {task.progressPercentage.toFixed(2)}% selesai
  </p>
)}

          </div>
        )}
      </div>
    ))}
  </div>
))}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
