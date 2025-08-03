// app/api/midtrans-status/route.js

export async function POST(request) {
  try {
    const { orderId } = await request.json();
    const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
    const base64 = Buffer.from(SERVER_KEY + ":").toString("base64");

    const response = await fetch(`https://api.sandbox.midtrans.com/v2/${orderId}/status`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${base64}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Gagal ambil status" }), { status: 500 });
    }

    const data = await response.json();
    const status = data.transaction_status;

    return new Response(JSON.stringify({ status }), { status: 200 });
  } catch (error) {
    console.error("Midtrans Status Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
