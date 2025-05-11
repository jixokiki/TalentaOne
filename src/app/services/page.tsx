'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda

// Tentukan tipe data untuk layanan
interface Service {
  id: string;
  serviceName: string;
  description: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const servicesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[];

      setServices(servicesData);
    };

    fetchServices();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-32">
      <Navbar/>
      <h2 className="text-2xl font-bold mb-4">Available Services</h2>
      <ul>
        {services.map((service) => (
          <li key={service.id} className="mb-4 p-4 border-b">
            <h3 className="text-xl font-semibold">{service.serviceName}</h3>
            <p>{service.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
