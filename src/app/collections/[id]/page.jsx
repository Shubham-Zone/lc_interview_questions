"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchCollection, toggleDone, toggleRevision, updateNote } from "@/api/collections";
import Loader from "@/components/Loader";

export default function CollectionPage({ params }) {
  const { id } = params;
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Filters
  const [filterRevision, setFilterRevision] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const handleFetchCollection = async () => {
      setLoading(true);
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
  }, [id, token]);

  async function handleToggleDone(questionId) {
    setCollection((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, done: !q.done } : q
      ),
    }));

    try {
      await toggleDone(id, questionId);
    } catch (err) {
      console.error(err);
      // optionally revert
    }
  }

  async function handleToggleRevision(questionId) {
    setCollection((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, revision: !q.revision } : q
      ),
    }));

    try {
      await toggleRevision(id, questionId);
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
      setCollection(res);
    } catch (err) {
      setCollection(null);
    }
  }

  // Filtering logic
  const filteredQuestions = useMemo(() => {
    if (!collection) return [];

    return collection.questions.filter((q) => {
      if (filterRevision && !q.revision) return false;
      if (filterDifficulty !== "All" && q.difficulty.toLowerCase() !== filterDifficulty.toLowerCase())
        return false;
      return true;
    });
  }, [collection, filterRevision, filterDifficulty]);

  // Progress calculation
  const progressPercent = useMemo(() => {
    if (!collection || collection.questions.length === 0) return 0;
    const doneCount = collection.questions.filter((q) => q.done).length;
    return Math.round((doneCount / collection.questions.length) * 100);
  }, [collection]);

  // Summary stats
  const doneCount = collection?.questions.filter((q) => q.done).length || 0;
  const revisionCount = collection?.questions.filter((q) => q.revision).length || 0;
  const totalCount = collection?.questions.length || 0;

  if (loading) return <Loader />;

  if (!collection)
    return (
      <p className="text-center text-red-600 text-lg mt-20">Collection not found.</p>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-5xl font-extrabold mb-4 text-gray-900 border-b pb-4">
        {collection.title || "Untitled Collection"}
      </h1>

      {/* Filters and Summary */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-6">
          {/* Filter: Revision */}
          <label className="inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterRevision}
              onChange={() => setFilterRevision(!filterRevision)}
              className="form-checkbox w-5 h-5 text-indigo-600"
            />
            <span className="ml-2 text-gray-700 font-medium">Show only Revised</span>
          </label>

          {/* Filter: Difficulty */}
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            Filter by Difficulty:
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option>All</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>
        </div>

        {/* Progress bar and stats */}
        <div className="w-full md:w-1/3">
          <div className="text-sm font-semibold mb-1 text-gray-800">
            Progress: {progressPercent}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="mt-2 text-xs text-gray-600 flex justify-between">
            <div>Total: {totalCount}</div>
            <div>Done: {doneCount}</div>
            <div>Revised: {revisionCount}</div>
          </div>
        </div>
      </div>

      {/* Questions table */}
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
            {filteredQuestions.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500 font-medium">
                  No questions match the current filters.
                </td>
              </tr>
            )}
            {filteredQuestions.map((q, i) => (
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
