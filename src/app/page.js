'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, []);

  
  if (!authorized) return null; // or a spinner/loading screen

  return (
    <div className="max-w-xl mx-auto text-center mt-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to LeetCode Questions Tracker</h1>
      <p className="mb-6 text-lg text-gray-700">
        Upload CSV files of company-wise questions and track your progress.
      </p>
      <a
        href="/upload"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition mb-4"
      >
        Upload a new CSV
      </a>
    
    </div>
  );
}
