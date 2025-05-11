// 'use client';

// import { useState, useEffect } from 'react';
// import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
// import { db } from '@/lib/firebaseConfig';

// interface Queue {
//   id: string;
//   queueNumber: string;
//   name: string;
// }

// export default function Queue() {
//   const [name, setName] = useState('');
//   const [queueNumber, setQueueNumber] = useState<string | null>(null);
//   const [orderCompleted, setOrderCompleted] = useState(false);
//   const [orderDetails, setOrderDetails] = useState<Queue | null>(null);

//   useEffect(() => {
//     const fetchQueue = async () => {
//       const q = query(collection(db, 'queues'), where('name', '==', name));
//       const querySnapshot = await getDocs(q);
//       if (!querySnapshot.empty) {
//         const order = querySnapshot.docs[0].data() as Queue;
//         setQueueNumber(order.queueNumber);
//         setOrderDetails(order);
//       }
//     };

//     if (name) {
//       fetchQueue();
//     }
//   }, [name]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const queueNumber = `${Math.floor(Math.random() * 100)}`; // Generate a random queue number for simplicity
//       await addDoc(collection(db, 'queues'), {
//         name,
//         createdAt: new Date(),
//         queueNumber, // Simpan nomor antrian yang baru
//       });
//       setQueueNumber(queueNumber); // Set nomor antrian yang baru di state
//       setName('');
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleNewOrder = async (answer: string) => {
//     if (answer === 'yes') {
//       setQueueNumber(null);
//       setOrderCompleted(false);
//     } else {
//       setOrderCompleted(true);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Ambil Nomor Antrian</h2>
//       {queueNumber && !orderCompleted ? (
//         <>
//           <p className="text-lg font-bold">Nomor Antrian Anda adalah: {queueNumber}</p>
//           <button
//             onClick={() => navigator.clipboard.writeText(queueNumber!)}
//             className="w-full p-2 mt-4 bg-blue-500 text-white"
//           >
//             Salin Nomor Antrian
//           </button>
//           <div className="mt-4">
//             <p>Ingin membuat order baru?</p>
//             <button onClick={() => handleNewOrder('yes')} className="p-2 bg-green-500 text-white">Yes</button>
//             <button onClick={() => handleNewOrder('no')} className="p-2 bg-red-500 text-white ml-4">No</button>
//           </div>
//           <a href={`/chat/${queueNumber}`} className="mt-4 inline-block text-blue-600 underline">
//             Buat Order di Worker
//           </a>
//         </>
//       ) : !orderCompleted ? (
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Masukkan Nama Anda"
//             className="w-full p-2 mb-4 border"
//             required
//           />
//           <button type="submit" className="w-full p-2 bg-blue-500 text-white">
//             Dapatkan Nomor Antrian
//           </button>
//         </form>
//       ) : (
//         <>
//           <h3 className="text-xl font-bold">Detail Pesanan:</h3>
//           <p>Nama: {orderDetails?.name}</p>
//           <p>Nomor Antrian: {queueNumber}</p>
//         </>
//       )}
//     </div>
//   );
// }





'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { motion } from 'framer-motion';
import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda

interface Queue {
  id: string;
  queueNumber: string;
  name: string;
}

export default function Queue() {
  const [name, setName] = useState('');
  const [queueNumber, setQueueNumber] = useState<string | null>(null);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Queue | null>(null);

  useEffect(() => {
    const fetchQueue = async () => {
      const q = query(collection(db, 'queues'), where('name', '==', name));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const order = querySnapshot.docs[0].data() as Queue;
        setQueueNumber(order.queueNumber);
        setOrderDetails(order);
      }
    };

    if (name) {
      fetchQueue();
    }
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const queueNumber = `${Math.floor(Math.random() * 100)}`; // Generate a random queue number for simplicity
      await addDoc(collection(db, 'queues'), {
        name,
        createdAt: new Date(),
        queueNumber, // Simpan nomor antrian yang baru
      });
      setQueueNumber(queueNumber); // Set nomor antrian yang baru di state
      setName('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewOrder = async (answer: string) => {
    if (answer === 'yes') {
      setQueueNumber(null);
      setOrderCompleted(false);
    } else {
      setOrderCompleted(true);
    }
  };

  return (
    <div className="min-h-screen py-32 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar/>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6 text-center">
          Ambil Nomor Antrian
        </h2>
        {queueNumber && !orderCompleted ? (
          <>
            <p className="text-lg font-bold text-center text-gray-700">
              Nomor Antrian Anda adalah: <span className="text-4xl text-purple-600">{queueNumber}</span>
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigator.clipboard.writeText(queueNumber!)}
              className="w-full p-3 mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Salin Nomor Antrian
            </motion.button>
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-4">Ingin membuat order baru?</p>
              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNewOrder('yes')}
                  className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                >
                  Ya
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNewOrder('no')}
                  className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  Tidak
                </motion.button>
              </div>
            </div>
            <a
              href={`/chat/${queueNumber}`}
              className="mt-6 inline-block text-center w-full text-purple-600 hover:text-purple-500 underline transition-all"
            >
              Buat Order di Worker
            </a>
          </>
        ) : !orderCompleted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nama Anda
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan Nama Anda"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Dapatkan Nomor Antrian
            </motion.button>
          </form>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Detail Pesanan:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-lg text-gray-700">Nama: <span className="font-semibold">{orderDetails?.name}</span></p>
              <p className="text-lg text-gray-700">Nomor Antrian: <span className="font-semibold">{queueNumber}</span></p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}