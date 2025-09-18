"use client";

import { useProducts } from "@/hooks/product/useProducts";
import Image from "next/image";

export default function ProductTestPage() {
  const {
    data: productsData,
    isLoading,
    error,
  } = useProducts({
    page: 1,
    limit: 5,
  });

  if (isLoading) return <div className="p-8">Loading products...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error: {String(error)}</div>;

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">
        Product API Test - Success! 🎉
      </h1>

      <div className="mb-4">
        <p>
          <strong>Total Products:</strong> {productsData?.data.pagination.total}
        </p>
        <p>
          <strong>Current Page:</strong> {productsData?.data.pagination.page}
        </p>
        <p>
          <strong>Products on this page:</strong>{" "}
          {productsData?.data.products.length}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {productsData?.data.products.map((product) => (
          <div key={product.id} className="rounded-lg border p-4">
            <Image
              src={product.picture1 || "/placeholder.jpg"}
              alt={product.name}
              width={300}
              height={200}
              className="mb-2 h-48 w-full rounded object-cover"
            />
            <h3 className="font-semibold">{product.name}</h3>
            <p className="mb-2 text-sm text-gray-600">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
              <span className="rounded bg-blue-100 px-2 py-1 text-sm">
                {product.category.name}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Stock: {product.totalStock} • Weight: {product.weight}g
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
