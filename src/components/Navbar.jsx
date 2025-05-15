'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-6">
        <a href="/" className="hover:underline">Home</a>
        <a href="/upload" className="hover:underline">Upload CSV</a>
        <a href="/collections" className="hover:underline">Collections</a>
      </div>
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
