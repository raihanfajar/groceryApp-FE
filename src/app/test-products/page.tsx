"use client";

import React from "react";
import { useProducts } from "@/hooks/product/useProducts";

export default function TestProductsPage() {
  const { data, isLoading, error } = useProducts({ limit: 5 });

  console.log("Products API Test:", { data, isLoading, error });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Test Products API</h1>
      <pre className="rounded bg-gray-100 p-4">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
