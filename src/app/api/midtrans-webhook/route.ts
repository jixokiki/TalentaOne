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
