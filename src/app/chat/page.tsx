'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

// Tentukan tipe data untuk pesan (message)
interface Message {
  id: string;
  text: string;
  timestamp: Date;
}

export default function Chat() {
  // Tentukan tipe state sebagai array Message[]
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Mengambil data pesan dari Firestore secara real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'messages'), (snapshot) => {
      const messagesData: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        timestamp: doc.data().timestamp.toDate(), // pastikan timestamp diproses menjadi Date
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  // Fungsi untuk mengirim pesan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'messages'), {
        text: message,
        timestamp: new Date(),
      });
      setMessage(''); // Reset input setelah pengiriman
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Live Chat</h2>
      <ul className="mb-4">
        {messages.map((msg) => (
          <li key={msg.id} className="border-b py-2">
            <p>{msg.text}</p>
            <small>{msg.timestamp.toLocaleString()}</small> {/* Tampilkan waktu pengiriman pesan */}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="w-full p-2 mb-4 border"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white">
          Send
        </button>
      </form>
    </div>
  );
}


