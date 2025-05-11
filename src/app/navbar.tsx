'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
    closed: {
      opacity: 0,
      x: '100%',
      transition: { duration: 0.2 },
    },
  };

  const linkVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
          Layanan Jasa
        </Link>
        <button
          onClick={toggleMenu}
          className="p-2 focus:outline-none"
        >
          <svg
            className="w-8 h-8 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-16 right-0 w-full h-screen bg-white shadow-lg z-40"
          >
            <div className="container mx-auto px-4 py-8">
              <motion.ul className="space-y-6">
                <motion.li variants={linkVariants}>
                  <Link href="/" className="text-2xl font-semibold text-gray-800 hover:text-teal-600 transition-colors duration-300">
                    Home
                  </Link>
                </motion.li>
                <motion.li variants={linkVariants}>
                  <Link href="/login" className="text-2xl font-semibold text-gray-800 hover:text-teal-600 transition-colors duration-300">
                    Login
                  </Link>
                </motion.li>
                <motion.li variants={linkVariants}>
                  <Link href="/register" className="text-2xl font-semibold text-gray-800 hover:text-teal-600 transition-colors duration-300">
                    Register
                  </Link>
                </motion.li>
                <motion.li variants={linkVariants}>
                  <Link href="/services" className="text-2xl font-semibold text-gray-800 hover:text-teal-600 transition-colors duration-300">
                    Services
                  </Link>
                </motion.li>
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}