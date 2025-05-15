'use client';

import './globals.css';
import Navbar from '../components/Navbar';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    setShowNavbar(!pathname.startsWith('/login'));
  }, [pathname]);

  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        {showNavbar && <Navbar />}
        <main className="container mx-auto p-6 flex-grow">{children}</main>
        <footer className="bg-gray-900 text-gray-300 p-4 text-center">
          &copy; 2025 LeetCode Tracker
        </footer>
      </body>
    </html>
  );
}
