// 'use client';

// import { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/lib/firebaseConfig';
// import { useRouter } from 'next/navigation';

// export default function Register() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       router.push('/');
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Register</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           className="w-full p-2 mb-4 border"
//           required
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           className="w-full p-2 mb-4 border"
//           required
//         />
//         <button type="submit" className="w-full p-2 bg-blue-500 text-white">
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }



// 'use client';

// import { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/lib/firebaseConfig';
// import { useRouter } from 'next/navigation';

// export default function Register() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [accountType, setAccountType] = useState(''); // Account type state
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!accountType) {
//       alert('Please select an account type!');
//       return;
//     }

//     try {
//       await createUserWithEmailAndPassword(auth, email, password);

//       if (accountType === 'admin') {
//         router.push('/login-admin'); // Direct to Admin login
//       } else if (accountType === 'user') {
//         router.push('/login-user'); // Direct to User login
//       } else if (accountType === 'worker') {
//         router.push('/login-worker'); // Direct to Worker login
//       }

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleAccountTypeSelect = (type: string) => {
//     setAccountType(type);
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Register</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           className="w-full p-2 mb-4 border"
//           required
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           className="w-full p-2 mb-4 border"
//           required
//         />
        
//         {/* Pop-up style selection for account type */}
//         <div className="mb-4">
//           <label className="block font-bold mb-2">Select Account Type:</label>
//           <div className="flex space-x-4">
//             <button type="button" className={`p-2 ${accountType === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200'} border`} onClick={() => handleAccountTypeSelect('admin')}>
//               Admin
//             </button>
//             <button type="button" className={`p-2 ${accountType === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200'} border`} onClick={() => handleAccountTypeSelect('user')}>
//               User
//             </button>
//             <button type="button" className={`p-2 ${accountType === 'worker' ? 'bg-blue-600 text-white' : 'bg-gray-200'} border`} onClick={() => handleAccountTypeSelect('worker')}>
//               Worker
//             </button>
//           </div>
//         </div>

//         <button type="submit" className="w-full p-2 bg-blue-500 text-white">
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }

//JANGAN DIHAPUS INI CUMAN STYLINGNYA YANG KURANG LOGICNYA UDAH PALING BENER
// 'use client';

// import { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from '@/lib/firebaseConfig'; // Import db for Firestore
// import { useRouter } from 'next/navigation';
// import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods

// export default function Register() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [accountType, setAccountType] = useState(''); // Account type state
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!accountType) {
//       alert('Please select an account type!');
//       return;
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Save user info to Firestore
//       await addDoc(collection(db, 'users'), {
//         uid: user.uid,
//         email: user.email,
//         accountType: accountType, // Save account type
//       });

//       // Redirect based on account type
//       if (accountType === 'admin') {
//         router.push('/login-admin'); // Direct to Admin login
//       } else if (accountType === 'user') {
//         router.push('/login-user'); // Direct to User login
//       } else if (accountType === 'worker') {
//         router.push('/login-worker'); // Direct to Worker login
//       }

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleAccountTypeSelect = (type: string) => {
//     setAccountType(type);
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Register</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           className="w-full p-2 mb-4 border"
//           required
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           className="w-full p-2 mb-4 border"
//           required
//         />
        
//         {/* Pop-up style selection for account type */}
//         <div className="mb-4">
//           <label className="block font-bold mb-2">Select Account Type:</label>
//           <div className="flex space-x-4">
//             <button type="button" className={`p-2 ${accountType === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200'} border`} onClick={() => handleAccountTypeSelect('admin')}>
//               Admin
//             </button>
//             <button type="button" className={`p-2 ${accountType === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200'} border`} onClick={() => handleAccountTypeSelect('user')}>
//               User
//             </button>
//             <button type="button" className={`p-2 ${accountType === 'worker' ? 'bg-blue-600 text-white' : 'bg-gray-200'} border`} onClick={() => handleAccountTypeSelect('worker')}>
//               Worker
//             </button>
//           </div>
//         </div>

//         <button type="submit" className="w-full p-2 bg-blue-500 text-white">
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountType) {
      setError('Please select an account type!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user info to Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email,
        accountType: accountType,
      });

      // Redirect based on account type
      if (accountType === 'admin') {
        router.push('/login-admin');
      } else if (accountType === 'user') {
        router.push('/login-user');
      } else if (accountType === 'worker') {
        router.push('/login-worker');
      }
    } catch (error) {
      console.error(error);
      setError('Registration failed. Please try again.');
    }
  };

  const handleAccountTypeSelect = (type: string) => {
    setAccountType(type);
    setError(''); // Clear error when account type is selected
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
          Register
        </h2>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center"
          >
            {error}
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Account Type:
            </label>
            <div className="grid grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => handleAccountTypeSelect('admin')}
                className={`p-4 rounded-lg text-center font-semibold transition-all ${
                  accountType === 'admin'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admin
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => handleAccountTypeSelect('user')}
                className={`p-4 rounded-lg text-center font-semibold transition-all ${
                  accountType === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                User
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => handleAccountTypeSelect('worker')}
                className={`p-4 rounded-lg text-center font-semibold transition-all ${
                  accountType === 'worker'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Worker
              </motion.button>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}