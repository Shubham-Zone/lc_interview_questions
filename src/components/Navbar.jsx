'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Upload CSV', href: '/upload' },
    { label: 'Collections', href: '/collections' },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <span className="text-xl font-bold text-indigo-400 tracking-wide">🧠 DSA Tracker</span>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'text-sm px-3 py-1 rounded transition-colors duration-200',
                pathname === item.href
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-sm px-4 py-1 rounded transition duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
