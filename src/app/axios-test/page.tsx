"use client";

import { axiosInstance } from "@/utils/axiosInstance";
import { useState } from "react";

export default function AxiosTestPage() {
  const [status, setStatus] = useState<string>("Ready to test");
  const [data, setData] = useState<unknown>(null);

  const testDirectAxios = async () => {
    try {
      setStatus("Testing direct axios call...");
      console.log("Starting axios test...");
      console.log("Axios instance config:", axiosInstance.defaults);

      const response = await axiosInstance.get("/api/products?page=1&limit=2");
      console.log("Axios response:", response);
      setStatus("Success!");
      setData(response.data);
    } catch (error) {
      console.error("Axios error:", error);
      setStatus(`Error: ${error}`);
      setData(null);
    }
  };

  const testFetch = async () => {
    try {
      setStatus("Testing direct fetch...");
      console.log("Starting fetch test...");

      const response = await fetch(
        "http://localhost:8000/api/products?page=1&limit=2",
      );
      console.log("Fetch response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetch data:", data);
      setStatus("Fetch Success!");
      setData(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus(`Fetch Error: ${error}`);
      setData(null);
    }
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Axios & API Test</h1>

      <div className="space-y-4">
        <div>
          <button
            onClick={testDirectAxios}
            className="mr-4 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Test Axios
          </button>

          <button
            onClick={testFetch}
            className="rounded bg-green-500 px-4 py-2 text-white"
          >
            Test Fetch
          </button>
        </div>

        <div className="rounded border p-4">
          <h2 className="font-bold">Status:</h2>
          <p>{status}</p>
        </div>

        {data && (
          <div className="rounded border p-4">
            <h2 className="font-bold">Data:</h2>
            <pre className="overflow-auto text-sm">
              {JSON.stringify(data as Record<string, unknown>, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
