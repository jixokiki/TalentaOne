'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebaseConfig';

interface Message {
  text: string;
  sender: string;
  createdAt: Date;
}

export default function Chat() {
  const params = useParams();
  const queueNumber = params?.queueNumber as string | undefined; // Pastikan tipe data string atau undefined
  const [messages, setMessages] = useState<Message[]>([]); // Tipe yang sesuai untuk messages
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!queueNumber) return; // Pastikan queueNumber ada

    const q = query(
      collection(db, 'chats'),
      where('queueNumber', '==', queueNumber),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data() as Message); // Tipe Message
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [queueNumber]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage) return;
    const user = auth.currentUser;
    await addDoc(collection(db, 'chats'), {
      text: newMessage,
      sender: user?.email || 'Unknown',
      queueNumber,
      createdAt: new Date(),
    });
    setNewMessage('');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Chat dengan User</h1>
      <div className="chat-box bg-gray-100 p-4 border rounded-lg mb-4 h-64 overflow-y-scroll">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div key={idx} className="mb-2">
              <p className="text-sm font-bold">{msg.sender}:</p>
              <p>{msg.text}</p>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>

      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 border mb-4"
          placeholder="Type a message"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg w-full">
          Send
        </button>
      </form>
    </div>
  );
}
