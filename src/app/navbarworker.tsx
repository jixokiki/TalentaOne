/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export default function NavbarWorker() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Ambil accountType dari Firestore berdasarkan UID
        const userDoc = await getDoc(doc(db, 'workers', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAccountType(userData.accountType);

          // Ambil nomor antrian berdasarkan UID
          if (userData.queueNumber) {
            setQueueNumber(userData.queueNumber);
          }
        }
      } else {
        setUser(null); // Reset user state jika tidak ada pengguna yang login
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleLogin = () => {
    router.push('/login'); // Arahkan ke halaman login
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Logout dari Firebase
      router.push('/'); // Arahkan ke halaman utama
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <button
              onClick={toggleNavbar}
              className="text-gray-800 focus:outline-none"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <FiUser
                className="text-2xl text-gray-800 cursor-pointer"
                onClick={handleProfileClick}
                title="Profile"
              />
            ) : (
              <FiLogIn
                className="text-2xl text-gray-800 cursor-pointer"
                onClick={handleLogin}
                title="Login"
              />
            )}
            {user && (
              <FiLogOut
                className="text-2xl text-gray-800 cursor-pointer"
                onClick={handleLogout}
                title="Logout"
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="/dashboard-worker"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Home
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                About
              </a>
              <a
                href="/dashboard-worker/services"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Services
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Contact
              </a>
            </div>

            {/* Profile Section */}
            {user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-4 py-3 border-t border-gray-200"
              >
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm font-bold text-gray-800">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tipe Akun</label>
                    <p className="mt-1 text-sm font-bold text-gray-800">
                      {accountType || 'Tidak diketahui'}
                    </p>
                  </div>
                  {queueNumber ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Nomor Antrian</label>
                      <p className="mt-1 text-sm font-bold text-gray-800">{queueNumber}</p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Nomor Antrian</label>
                      <p className="mt-1 text-sm font-bold text-gray-800">
                        Anda belum mengambil nomor antrian.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}