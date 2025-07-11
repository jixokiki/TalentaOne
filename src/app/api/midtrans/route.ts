// // pages/api/midtrans.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import midtransClient from 'midtrans-client';

// const snap = new midtransClient.Snap({
//   isProduction: false, // ganti jadi true kalau sudah live
//   serverKey: process.env.MIDTRANS_SERVER_KEY,
//   clientKey: process.env.MIDTRANS_CLIENT_KEY,
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const { order_id, gross_amount } = req.body;

//     if (!order_id || !gross_amount) {
//       return res.status(400).json({ error: 'order_id dan gross_amount wajib diisi' });
//     }

//     const parameter = {
//       transaction_details: {
//         order_id,
//         gross_amount,
//       },
//       credit_card: {
//         secure: true,
//       },
//     };

//     const transaction = await snap.createTransaction(parameter);
//     return res.status(200).json({ snapUrl: transaction.redirect_url });
//   } catch (error) {
//     console.error('Midtrans error:', error);
//     return res.status(500).json({ error: 'Gagal membuat transaksi' });
//   }
// }



// src/app/api/midtrans/route.ts
import { NextRequest } from "next/server";
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, gross_amount } = body;

    if (!order_id || !gross_amount) {
      return new Response(JSON.stringify({ error: "order_id dan gross_amount wajib diisi" }), {
        status: 400,
      });
    }

    const parameter = {
      transaction_details: {
        order_id,
        gross_amount,
      },
      credit_card: {
        secure: true,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return new Response(JSON.stringify({ snapUrl: transaction.redirect_url }), {
      status: 200,
    });
  } catch (error) {
    console.error("Midtrans error:", error);
    return new Response(JSON.stringify({ error: "Gagal membuat transaksi" }), {
      status: 500,
    });
  }
}
