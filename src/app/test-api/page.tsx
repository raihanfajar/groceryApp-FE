"use client";

import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/utils/axiosInstance";

export default function TestAPIPage() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [testType, setTestType] = useState<string>("");

  useEffect(() => {
    // Auto-run the test when component mounts
    testDirectAPI();
  }, []);

  const testDirectAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      setTestType("Axios");
      console.log("Testing direct API call...");

      const response = await axiosInstance.get("/products?limit=5");
      console.log("API Response:", response.data);
      setResult(response.data as Record<string, unknown>);
    } catch (err: unknown) {
      console.error("API Error:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const testFetch = async () => {
    try {
      setLoading(true);
      setError(null);
      setTestType("Fetch");
      console.log("Testing fetch...");

      const response = await fetch("http://localhost:8000/products?limit=5");
      const data = await response.json();
      console.log("Fetch Response:", data);
      setResult(data as Record<string, unknown>);
    } catch (err: unknown) {
      console.error("Fetch Error:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Test API Direct ({testType})</h1>

      <div className="mb-8 space-y-4">
        <button
          onClick={testDirectAPI}
          className="mr-4 rounded bg-blue-500 px-4 py-2 text-white"
          disabled={loading}
        >
          Test Axios
        </button>

        <button
          onClick={testFetch}
          className="rounded bg-green-500 px-4 py-2 text-white"
          disabled={loading}
        >
          Test Fetch
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {result && (
        <div>
          <h3 className="font-bold">Result:</h3>
          <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
