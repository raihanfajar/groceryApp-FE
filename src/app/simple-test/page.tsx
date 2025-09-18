"use client";

import React, { useState, useEffect } from "react";

export default function SimpleTestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");

  const addLog = (message: string) => {
    console.log(message);
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    const testAPI = async () => {
      try {
        addLog("Starting API test...");

        // Test 1: Basic fetch
        addLog("Testing fetch...");
        const response = await fetch("http://localhost:8000/products?limit=1");
        addLog(`Fetch response status: ${response.status}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        addLog("Fetch successful");
        setResult(JSON.stringify(data, null, 2));
      } catch (error) {
        addLog(
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        setResult(`Error: ${error}`);
      }
    };

    addLog("Component mounted");
    testAPI();
  }, []);

  const manualTest = async () => {
    try {
      addLog("Manual test started...");

      const response = await fetch("http://localhost:8000/products?limit=1");
      addLog(`Manual fetch response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      addLog("Manual fetch successful");
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      addLog(
        `Manual test error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Simple API Test</h1>

      <div className="mb-6">
        <h3 className="mb-2 font-bold">Logs:</h3>
        <div className="max-h-40 overflow-y-auto rounded bg-black p-4 font-mono text-sm text-green-400">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-bold">Result:</h3>
        <pre className="max-h-60 overflow-auto rounded bg-gray-100 p-4 text-sm">
          {result || "No result yet..."}
        </pre>
      </div>

      <button
        onClick={manualTest}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Test Again
      </button>
    </div>
  );
}
