"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCollections } from "@/api/collections";
import Loader from "@/components/Loader";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleFetchCollections = async () => {
      setLoading(true);
      try {
        const { data } = await fetchCollections(isPublic);
        setCollections(data);
      } catch (err) {
        console.error(err);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    handleFetchCollections();
  }, [isPublic]);

  if (loading)
    return <Loader />

  if (!collections.length)
    return (
      <p className="text-center text-gray-500 mt-20 text-lg font-medium">
        No collections found.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-white border-b pb-4">
          {isPublic ? "Public Collections" : "Your Collections"}
        </h1>
        <button
          onClick={() => setIsPublic(!isPublic)}
          className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded"
        >
          {isPublic ? "View My Collections" : "View Public Collections"}
        </button>
      </div>

      <ul className="space-y-4">
        {collections.map(({ collectionId, title }) => (
          <li key={collectionId}>
            <Link
              href={`/collections/${collectionId}`}
              className="block p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <h2 className="text-xl font-semibold text-indigo-600 hover:text-indigo-800">
                {title || "Untitled Collection"}
              </h2>
              <p className="mt-1 text-gray-500 text-sm">View details &rarr;</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
