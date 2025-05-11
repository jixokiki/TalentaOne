'use client'; // Tambahkan ini di bagian atas

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement!,
    });

    if (error) {
      setError(error.message || 'Error during payment');
    } else {
      setSuccess('Payment successful!');
      console.log('Payment Method:', paymentMethod);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <CardElement />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">{success}</div>}
      <button type="submit" className="w-full p-2 bg-blue-500 text-white mt-4" disabled={!stripe}>
        Bayar Sekarang
      </button>
    </form>
  );
}
