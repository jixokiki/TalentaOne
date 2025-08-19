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
    <div className="container mx-auto p-6">
      <NavbarAdmin />
      <h1 className="text-4xl font-extrabold text-gray-800">Dashboard Admin</h1>
      <p>Selamat datang, Admin!</p>

      <h2 className="text-2xl font-bold mb-4">Daftar Antrian</h2>

      {/* List of current queues */}
      <ul className="space-y-4">
        {queueList.length > 0 ? (
          queueList.map((queue) => (
            <li
              key={queue.id}
              className="p-4 bg-gray-100 border border-gray-200 rounded-lg shadow-md"
            >
              <p className="font-semibold">Nomor Antrian: {queue.queueNumber}</p>
              <p>Nama: {queue.name || 'Belum diisi'}</p>
              <button
                className="mt-2 p-2 bg-blue-500 text-white rounded-lg"
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

      {/* Data Worker (grid di luar popup) */}
      <h3 className="font-bold mt-4 text-gray-800">Data Worker Terkait</h3>
      {workerProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workerProfiles.map((worker) => (
            <div
              key={worker.uid}
              className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
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
                <p className="text-gray-700">
                  <span className="font-semibold">Role:</span> {worker.role}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Special Role:</span> {worker.specialRole}
                </p>
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
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-xs">Belum ada data worker.</p>
      )}

      {/* Chat Popup */}
      {chatOpen && (
        <div
          className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 w-full 
                max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl 
                h-[80vh] md:h-2/3 
                max-h-[90vh] md:max-h-[80vh] 
                border border-gray-300 flex flex-col 
                overflow-y-auto z-50"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h2 className="text-lg font-bold text-gray-800">
              Chat with {selectedUser ? selectedUser.name : 'User'} (Queue {activeQueueNumber})
            </h2>
            <button
              onClick={() => setChatOpen(false)}
              className="text-gray-500 hover:text-red-500"
            >
              ✖
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-100 p-2 rounded-lg space-y-3">
            {messages.map((msg, index) => (
              <div key={index}>
                <p className="text-sm font-semibold text-gray-700">{msg.sender}:</p>
                <p className="text-gray-800 bg-white p-2 rounded-lg shadow-sm">
                  {msg.text ?? ''}
                </p>
              </div>
            ))}

            {/* Data Worker di dalam popup */}
            <h3 className="font-bold mt-4 text-gray-800">Data Worker Terkait</h3>
            {workerProfiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workerProfiles.map((worker) => (
                  <div
                    key={worker.uid}
                    className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
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
                      <p className="text-gray-700">
                        <span className="font-semibold">Role:</span> {worker.role}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Special Role:</span> {worker.specialRole}
                      </p>
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
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Send
            </button>
          </form>

          {showWorkerData && (
            <>
              <h3 className="font-bold mt-4 text-gray-800">Data Worker Terkait</h3>
              {workerProfiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workerProfiles.map((worker) => (
                    <div
                      key={worker.uid}
                      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
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
                        <p className="text-gray-700">
                          <span className="font-semibold">Role:</span> {worker.role}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Special Role:</span> {worker.specialRole}
                        </p>
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
            <div className="mt-4 bg-gray-100 border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
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
                type="button"
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
