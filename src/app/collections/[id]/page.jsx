"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCollection, toggleDone, toggleRevision, updateNote } from "@/api/collections";

export default function CollectionPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setCollection(null);
      return;
    }

    const handleFetchCollection = async () => {
      try {
        const data = await fetchCollection(id);
        setCollection(data);
      } catch (error) {
        setCollection(null);
      } finally {
        setLoading(false);
      }
    };

    handleFetchCollection();
  }, [id]);

  async function handleToggleDone(questionId) {
    try {
      await toggleDone(id, questionId);
      refreshCollection();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleToggleRevision(questionId) {
    try {
      await toggleRevision(id, questionId);
      refreshCollection();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdateNote(questionId, note) {
    try {
      await updateNote(id, questionId, note);
      refreshCollection();
    } catch (err) {
      console.error(err);
    }
  }

  async function refreshCollection() {
    try {
      const res = await fetchCollection(id);
      setCollection(res.data);
    } catch (err) {
      setCollection(null);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );

  if (!collection)
    return <p className="text-center text-red-600 text-lg mt-20">Collection not found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-5xl font-extrabold mb-8 text-gray-900 border-b pb-4">
        {collection.title || "Untitled Collection"}
      </h1>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Done",
                "Revision",
                "ID",
                "Title",
                "Acceptance",
                "Difficulty",
                "Frequency",
                "Link",
                "Note",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider select-none"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {collection.questions.map((q, i) => (
              <tr
                key={q.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                title={`Click the checkboxes or add notes for "${q.title}"`}
              >
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={q.done || false}
                    onChange={() => handleToggleDone(q.id)}
                    className="w-5 h-5 cursor-pointer rounded border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={q.revision || false}
                    onChange={() => handleToggleRevision(q.id)}
                    className="w-5 h-5 cursor-pointer rounded border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-700 font-mono">{q.id}</td>
                <td className="px-4 py-3 text-left text-sm font-medium text-gray-900">{q.title}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{q.acceptance}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{q.difficulty}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{q.frequency}</td>
                <td className="px-4 py-3 text-center">
                  <a
                    href={q.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
                  >
                    View
                  </a>
                </td>
                <td className="px-4 py-3">
                  <textarea
                    className="w-full rounded border border-gray-300 p-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    defaultValue={q.note || ""}
                    onBlur={(e) => handleUpdateNote(q.id, e.target.value)}
                    rows={2}
                    placeholder="Add notes here..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
