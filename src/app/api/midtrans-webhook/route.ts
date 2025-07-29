// src/app/api/midtrans-webhook/route.ts
import { NextRequest } from "next/server";
// import midtransClient from "midtrans-client";
import { db } from "@/lib/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      order_id,
      transaction_status,
      fraud_status,
      payment_type,
      gross_amount,
    } = body;

    console.log("🔔 Webhook Received:", body);

    if (!order_id || !transaction_status) {
      return new Response(JSON.stringify({ error: "Invalid webhook data" }), {
        status: 400,
      });
    }

    // Hanya proses jika sukses
    if (transaction_status === "settlement" || transaction_status === "capture") {
      // Update status ke Firestore
      const paymentRef = doc(db, "payments", order_id);
      await updateDoc(paymentRef, {
        status: "success",
        paymentTriggered: true, // ✅ Tandai bahwa task ini sudah dibayar
        paidAt: new Date(),
        paymentType: payment_type,
        grossAmount: gross_amount,
        fraudStatus: fraud_status,
        transactionStatus: transaction_status,
      });

      console.log(`✅ Pembayaran berhasil untuk task ${order_id}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook gagal diproses" }), {
      status: 500,
    });
  }
}



// // /pages/api/midtrans/webhook.ts

// import type { NextApiRequest, NextApiResponse } from "next";
// import { NextRequest } from "next/server";
// // import { db } from "@/lib/firebase";
// // import { doc, updateDoc } from "firebase/firestore";
// import crypto from "crypto";



// // import midtransClient from "midtrans-client";
// import { db } from "@/lib/firebaseConfig";
// import { doc, updateDoc } from "firebase/firestore";
// const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!;

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

//   const callbackToken = req.headers["x-callback-token"];
//   const signatureKey = req.headers["x-signature-key"] || req.headers["x-signature-key".toLowerCase()];

//   const {
//     order_id,
//     transaction_status,
//     status_code,
//     gross_amount,
//     signature_key
//   } = req.body;

//   // Validasi signature Midtrans (wajib di production)
//   const rawSignature = order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY;
//   const expectedSignature = crypto.createHash('sha512').update(rawSignature).digest('hex');

//   if (expectedSignature !== signature_key) {
//     return res.status(403).json({ message: "Invalid signature" });
//   }

//   try {
//     const taskId = order_id.split("-")[0];

//     if (transaction_status === "settlement" || transaction_status === "capture") {
//       // Update Firestore payments
//       await updateDoc(doc(db, "payments", order_id), {
//         status: "success",
//       });

//       // Update Firestore tugas
//       await updateDoc(doc(db, "tugasdariuser", taskId), {
//         statusPembayaran: "success",
//       });

//       return res.status(200).json({ message: "Payment marked as success" });
//     }

//     // Untuk cancel / expire / refund
//     if (
//       transaction_status === "cancel" ||
//       transaction_status === "expire" ||
//       transaction_status === "deny"
//     ) {
//       await updateDoc(doc(db, "payments", order_id), {
//         status: transaction_status,
//       });

//       return res.status(200).json({ message: `Payment marked as ${transaction_status}` });
//     }

//     return res.status(200).json({ message: "No action taken" });
//   } catch (error) {
//     console.error("Webhook Error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }
