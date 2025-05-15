'use client';

import { sendOtp, verifyOtp } from '@/api/auth';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleSendOtp = async () => {
    if(email === '') {
      alert("Please enter email");
      return;
    }
    setLoading(true);
    try {
      const res = await sendOtp(email);
      const data = res.data;
      setMessage(data.message);
      if (res.status === 200) setStep('otp');
    } catch (err) {
      console.log(err);
      setMessage(err.response.data.error || "error sending otp");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if(otp === '') {
      alert("Please enter otp");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      const data = res.data;
      setMessage(data.message);
      if (res.status === 200) {
        localStorage.setItem('token', data.token);
        window.location.href = '/collections';
      }
    } catch (err) {
      setMessage(err.response.data.error || "Error verifying otp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          Login with OTP
        </h2>

        {step === 'email' && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. example@mail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition mb-4 text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Send OTP'
              )}
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="6-digit OTP"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition mb-4 text-gray-900"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Verify OTP'
              )}
            </button>

          </>
        )}

        {message && (
          <p className="text-center mt-4 text-sm text-gray-600">{message}</p>
        )}
      </motion.div>
    </div>
  );
}
