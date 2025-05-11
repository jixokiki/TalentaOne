// 'use client'; // Tambahkan ini di bagian atas file

// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import CheckoutForm from '../../components/CheckoutForm'; // Path relatif


// const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY'); // Gantilah dengan public key Stripe Anda

// export default function Payment() {
//   return (
//     <div className="max-w-md mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Pembayaran</h2>
//       <Elements stripe={stripePromise}>
//         <CheckoutForm />
//       </Elements>
//     </div>
//   );
// }


//JANGAN DIHAPUS CUMAN KURANG DISTYLUNGNYA AJA
// 'use client';

// import { useState } from 'react';

// declare global {
//   interface SnapCallbacks {
//     onSuccess: (result: unknown) => void;
//     onPending: (result: unknown) => void;
//     onError: (result: unknown) => void;
//     onClose: () => void;
//   }

//   interface Snap {
//     pay: (token: string, callbacks: SnapCallbacks) => void;
//   }

//   interface Window {
//     snap: Snap;
//   }
// }

// export default function Payment() {
//   const [orderId, setOrderId] = useState('');
//   const [amount, setAmount] = useState('');

//   const handlePayment = async () => {
//     try {
//       // Panggil API route untuk membuat token transaksi
//       const res = await fetch('/api/payment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ orderId, amount: parseInt(amount) }),
//       });

//       const data = await res.json();

//       if (data.token) {
//         // Menjalankan Midtrans Snap popup
//         window.snap.pay(data.token, {
//           onSuccess: function(result: unknown) {
//             alert('Payment Success');
//             console.log(result);
//           },
//           onPending: function(result: unknown) {
//             alert('Waiting for Payment');
//             console.log(result);
//           },
//           onError: function(result: unknown) {
//             alert('Payment Failed');
//             console.log(result);
//           },
//           onClose: function() {
//             alert('Payment popup closed');
//           },
//         });
//       }
//     } catch (error) {
//       console.error('Payment error:', error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Pembayaran</h2>
//       <input
//         type="text"
//         value={orderId}
//         onChange={(e) => setOrderId(e.target.value)}
//         placeholder="Order ID"
//         className="w-full p-2 mb-4 border"
//       />
//       <input
//         type="text"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         placeholder="Amount"
//         className="w-full p-2 mb-4 border"
//       />
//       <button
//         onClick={handlePayment}
//         className="w-full p-2 bg-blue-500 text-white"
//       >
//         Bayar Sekarang
//       </button>
//     </div>
//   );
// }



'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda

declare global {
  interface SnapCallbacks {
    onSuccess: (result: unknown) => void;
    onPending: (result: unknown) => void;
    onError: (result: unknown) => void;
    onClose: () => void;
  }

  interface Snap {
    pay: (token: string, callbacks: SnapCallbacks) => void;
  }

  interface Window {
    snap: Snap;
  }
}

export default function Payment() {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');

  const handlePayment = async () => {
    try {
      // Panggil API route untuk membuat token transaksi
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, amount: parseInt(amount) }),
      });

      const data = await res.json();

      if (data.token) {
        // Menjalankan Midtrans Snap popup
        window.snap.pay(data.token, {
          onSuccess: function (result: unknown) {
            alert('Payment Success');
            console.log(result);
          },
          onPending: function (result: unknown) {
            alert('Waiting for Payment');
            console.log(result);
          },
          onError: function (result: unknown) {
            alert('Payment Failed');
            console.log(result);
          },
          onClose: function () {
            alert('Payment popup closed');
          },
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
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
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-6 text-center">
          Pembayaran
        </h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
              Order ID
            </label>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Masukkan Order ID"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Masukkan Amount"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePayment}
            className="w-full p-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all"
          >
            Bayar Sekarang
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}