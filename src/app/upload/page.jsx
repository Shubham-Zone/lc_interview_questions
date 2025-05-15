"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadCSV } from "@/api/upload";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const { collectionId } = await uploadCSV(formData);
      router.push(`/collections/${collectionId}`);
    } catch (err) {
      console.log("Err", err);
      setError(err.response?.data?.msg || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Upload Company Questions CSV</h1>

      <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 text-sm rounded">
        <strong>CSV Format Required:</strong><br />
        Your CSV file should include these columns **in this exact order**:<br />
        <code className="block mt-1 text-sm text-gray-800 bg-gray-100 p-2 rounded">
          ID, Title, Acceptance, Difficulty, Frequency, Leetcode Question Link
        </code>
        Example row:<br />
        <code className="block mt-1 text-sm text-gray-800 bg-gray-100 p-2 rounded">
          937, Reorder Data in Log Files, 54.3%, Easy, 3.9944355947998136, https://leetcode.com/problems/reorder-data-in-log-files
        </code>
      </div>


      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="title">
            Collection Title (optional)
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Amazon 2025 Questions"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="file">
            Select CSV File
          </label>
          <input
            id="file"
            type="file"
            accept=".csv"
            onChange={e => setFile(e.target.files[0])}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}
