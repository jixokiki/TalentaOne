'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export default function AddService() {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'services'), {
        serviceName,
        description,
      });
      setServiceName('');
      setDescription('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Service</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="Service Name"
          className="w-full p-2 mb-4 border"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 mb-4 border"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white">
          Add Service
        </button>
      </form>
    </div>
  );
}
