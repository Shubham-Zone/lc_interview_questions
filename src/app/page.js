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

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-4xl mx-auto bg-gray-900 shadow-lg rounded-lg p-10 text-center">
        <h1 className="text-4xl font-bold mb-4">LeetCode Questions Tracker</h1>
        <p className="text-lg text-gray-300 mb-8">
          A focused tool designed to help you streamline your coding interview preparation.
          Upload company-specific CSV files and monitor your DSA progress effectively.
        </p>

        <a
          href="/upload"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition mb-8"
        >
          Upload a New CSV
        </a>

        <div className="mt-10 text-left">
          <h2 className="text-2xl font-semibold mb-4">Why use this tool?</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Organize company-specific LeetCode problems in one place.</li>
            <li>Track your progress across multiple collections.</li>
            <li>Prioritize unsolved or frequently missed problems.</li>
            <li>Stay consistent and goal-oriented in your prep.</li>
          </ul>
        </div>

        <div className="mt-10 text-left">
          <h2 className="text-2xl font-semibold mb-4">How it works</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Log in using your credentials.</li>
            <li>Navigate to <span className="font-semibold text-white">Upload CSV</span> and submit your file.</li>
            <li>Access your uploaded sets in the <span className="font-semibold text-white">Collections</span> tab.</li>
            <li>Mark questions as solved as you progress.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
