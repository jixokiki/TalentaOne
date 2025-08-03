'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import NavbarWorker from '@/app/navbarworker'; // Sesuaikan path sesuai struktur proyek Anda

type Task = {
  id: string;
  workerName: string;
  nominal: number;
  progress: number;
  statusPembayaran: string;
  statusProgress: string;
  workerId?: string;
};

export default function WorkerServicesPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = () => {};
    const fetchData = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) return;

        // Ambil tugas yang statusPembayaran: "success" dan milik worker yang login
        const q = query(
          collection(db, 'tugasdariuser'),
          where('workerId', '==', user.uid),
          where('statusPembayaran', '==', 'success')
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            workerName: docData.workerName ?? '',
            nominal: docData.nominal ?? 0,
            progress: docData.progress ?? 0,
            statusPembayaran: docData.statusPembayaran ?? '',
            statusProgress: docData.statusProgress ?? '',
            workerId: docData.workerId ?? '',
          } as Task;
        });

        setTasks(data);
        setLoading(false);
      });
    };

    fetchData();
    return () => unsubscribe();
  }, []);




const handleUploadFinalFile = async (taskId: string, file: File) => {
  try {
    const storage = getStorage();
    const fileRef = ref(storage, `finalTasks/${taskId}/${file.name}`);
    await uploadBytes(fileRef, file);

    const downloadURL = await getDownloadURL(fileRef);

    // Simpan URL ke Firestore
    await updateDoc(doc(db, 'tugasdariuser', taskId), {
      fileTugasAkhir: downloadURL,
    });

    alert('Berhasil upload file tugas akhir!');
  } catch (err) {
    console.error('Upload error:', err);
    alert('Gagal upload file');
  }
};


  return (
    <div className="p-6">
        <NavbarWorker/>
      <h1 className="text-2xl font-bold mb-4">Layanan Sukses Dibayar</h1>

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>Belum ada layanan yang berhasil dibayar.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task, idx) => (
            <li
              key={idx}
              className="p-4 border rounded shadow bg-white hover:bg-gray-50 transition"
            >
              <p className="font-semibold text-lg">Tugas: {task.workerName}</p>
              <p>Nominal: <strong>Rp {task.nominal.toLocaleString()}</strong></p>
              <p>Progress: {task.progress}%</p>
              <p>Status: ✅ {task.statusPembayaran}</p>
              <p>Status Task: {task.statusProgress}</p>
              <input
  type="file"
  accept=".pdf,.docx"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) handleUploadFinalFile(task.id, file);
  }}
  className="mt-2"
/>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
