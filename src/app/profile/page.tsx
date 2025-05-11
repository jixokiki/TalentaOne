// 'use client';

// import { useState, useEffect } from 'react';
// import { onAuthStateChanged, User } from 'firebase/auth'; // Gunakan tipe User dari Firebase Auth
// import { auth } from '@/lib/firebaseConfig';
// import { getDoc, doc } from 'firebase/firestore';
// import { db } from '@/lib/firebaseConfig';

// export default function Profile() {
//   const [user, setUser] = useState<User | null>(null); // Ganti 'any' dengan 'User | null'
//   const [accountType, setAccountType] = useState<string | null>(null);
//   const [queueNumber, setQueueNumber] = useState<number | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);

//         // Ambil accountType dari Firestore berdasarkan UID
//         const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           setAccountType(userData.accountType);

//           // Ambil nomor antrian berdasarkan UID
//           if (userData.queueNumber) {
//             setQueueNumber(userData.queueNumber);
//           }
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   if (!user) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Profile</h1>
//       <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
//         <p className="text-lg font-medium">Email: {user.email}</p>
//         <p className="text-lg font-medium">Account Type: {accountType || 'Tidak diketahui'}</p>
//         {queueNumber ? (
//           <p className="text-lg font-medium">Nomor Antrian: {queueNumber}</p>
//         ) : (
//           <p className="text-lg font-medium">Anda belum mengambil nomor antrian.</p>
//         )}
//       </div>
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { motion } from 'framer-motion';
import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Ambil accountType dari Firestore berdasarkan UID
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAccountType(userData.accountType);

          // Ambil nomor antrian berdasarkan UID
          if (userData.queueNumber) {
            setQueueNumber(userData.queueNumber);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-700"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-700"
        >
          Silakan login untuk melihat profil.
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-32 px-4 sm:px-6 lg:px-8">
      <Navbar/>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8 text-center">
          Profile
        </h1>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-2xl font-bold text-gray-800">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Tipe Akun</label>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {accountType || 'Tidak diketahui'}
              </p>
            </div>
            {queueNumber ? (
              <div>
                <label className="block text-sm font-medium text-gray-500">Nomor Antrian</label>
                <p className="mt-1 text-2xl font-bold text-gray-800">{queueNumber}</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-500">Nomor Antrian</label>
                <p className="mt-1 text-2xl font-bold text-gray-800">
                  Anda belum mengambil nomor antrian.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}