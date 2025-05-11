// import type { NextApiRequest, NextApiResponse } from 'next';
// import midtransClient from 'midtrans-client';

// // Create a new instance of Midtrans Snap API
// const snap = new midtransClient.Snap({
//   isProduction: false, // Set to `true` for production environment
//   serverKey: 'SB-Mid-server-j7K9AitJwmel9Te7eBxJeYbm',
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     // Body request yang diharapkan (data transaksi dari frontend)
//     const { orderId, amount } = req.body;

//     // Parameter transaksi yang akan dikirim ke Midtrans
//     const parameter = {
//       transaction_details: {
//         order_id: orderId,
//         gross_amount: amount,
//       },
//       customer_details: {
//         first_name: 'Nama',
//         last_name: 'User',
//         email: 'user@example.com',
//         phone: '081234567890',
//       },
//     };

//     try {
//       const transaction = await snap.createTransaction(parameter);
//       const transactionToken = transaction.token;

//       res.status(200).json({ token: transactionToken });
//     } catch (error) {
//       console.error('Midtrans Error:', error);
//       res.status(500).json({ error: 'Failed to create transaction' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }


import { NextApiRequest, NextApiResponse } from 'next';
import midtransClient from 'midtrans-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { orderId, amount } = req.body;

  try {
    const snap = new midtransClient.Snap({
      isProduction: false, // Ganti dengan true jika sudah live
      serverKey: 'SB-Mid-server-j7K9AitJwmel9Te7eBxJeYbm', // Ganti dengan server key dari akun Midtrans Anda
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    res.status(200).json({ token: transaction.token });
  } catch (error) {
    console.error('Midtrans Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
