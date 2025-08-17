'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { Service } from '@/lib/types';
import { motion } from 'framer-motion';
import Navbar from '@/app/navbar'; // Sesuaikan path sesuai struktur proyek Anda

export default function Home() {
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

  // Animasi untuk teks
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-32 px-4 sm:px-6 lg:px-8">
      <Navbar /> {/* Tambahkan Navbar di sini */}
      {/* Header Section */}
      {/* <div className="text-center mb-12">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 animate-text"
        >
          Selamat Datang di Layanan Jasa
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mt-4 text-lg text-gray-600"
        >
          Mulailah mengkustomisasi aplikasi ini sesuai kebutuhan bisnis Anda!
        </motion.p>
      </div> */}
      {/* Header Section */}
<div className="text-center mb-12 overflow-visible">
  <motion.h1
    initial="hidden"
    animate="visible"
    variants={textVariants}
    className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 animate-text inline-block leading-[1.2] md:leading-[1.15] pb-1"
  >
    Selamat Datang di Layanan Jasa
  </motion.h1>

  <motion.p
    initial="hidden"
    animate="visible"
    variants={textVariants}
    className="mt-4 text-lg text-gray-600 leading-relaxed pb-1"
  >
    Mulailah mengkustomisasi aplikasi ini sesuai kebutuhan bisnis Anda!
  </motion.p>
</div>


      {/* Login & Register Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className="flex justify-center space-x-6 mb-12"
      >
        <a
          href="/login"
          className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white bg-gradient-to-r from-teal-500 to-blue-500 rounded-full group hover:from-teal-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <span className="relative z-10">Login</span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
        </a>
        <a
          href="/register"
          className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group hover:from-purple-600 hover:to-pink-600 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <span className="relative z-10">Register</span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
        </a>
      </motion.div>

      {/* Services Section */}
      <motion.h2
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 mb-8 animate-text"
      >
        Available Services
      </motion.h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.length > 0 ? (
          services.map((service, index) => (
            <motion.li
              key={service.id}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              transition={{ delay: index * 0.2 }}
              className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"
            >
              <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 mb-4">
                {service.serviceName}
              </h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105">
                Learn More
              </button>
            </motion.li>
          ))
        ) : (
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-gray-600 text-center col-span-full"
          >
            No services available at the moment.
          </motion.p>
        )}
      </ul>
    </div>
  );
}