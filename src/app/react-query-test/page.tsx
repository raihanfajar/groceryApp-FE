"use client";

import {
  QueryClient,
  useQuery,
  QueryClientProvider,
} from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { useState } from "react";

// Create a fresh query client for this test
const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

function TestQueryComponent() {
  const [queryEnabled, setQueryEnabled] = useState(false);

  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["test-products"],
    queryFn: async () => {
      console.log("Query function called!");
      const response = await axiosInstance.get("/api/products?page=1&limit=2");
      console.log("Query response:", response.data);
      return response.data;
    },
    enabled: queryEnabled,
  });

  return (
    <div className="space-y-4">
      <div>
        <button
          onClick={() => setQueryEnabled(true)}
          className="mr-4 rounded bg-blue-500 px-4 py-2 text-white"
        >
          Enable Query
        </button>

        <button
          onClick={() => refetch()}
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          Manual Refetch
        </button>
      </div>

      <div className="rounded border p-4">
        <h3 className="font-bold">React Query Status:</h3>
        <p>Enabled: {queryEnabled.toString()}</p>
        <p>Loading: {isLoading.toString()}</p>
        <p>Error: {isError.toString()}</p>
        {error && <p>Error Details: {String(error)}</p>}
      </div>

      {data && (
        <div className="rounded border p-4">
          <h3 className="font-bold">Query Data:</h3>
          <pre className="overflow-auto text-sm">
            {JSON.stringify(data as Record<string, unknown>, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function ReactQueryTestPage() {
  return (
    <QueryClientProvider client={testQueryClient}>
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">React Query Test</h1>
        <TestQueryComponent />
      </div>
    </QueryClientProvider>
  );
}
