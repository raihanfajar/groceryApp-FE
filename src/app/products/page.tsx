"use client";

// !Changing this code, because i can't do NPM RUN BUILD (ghazi), nothing significant happens here,
// !only suspense so that it doesn't crash
// !Please handle later, and don't forget to npm run build afterwards

import { Suspense } from "react";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { ProductFilters } from "@/types/product/productTypes";
import { useSearchParams } from "next/navigation";

// ---------- move the hook usage into its own component ----------
function CatalogWithFilters() {
  const searchParams = useSearchParams();

  const initialFilters: Partial<ProductFilters> = {};
  const categoryId = searchParams.get("categoryId");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const storeId = searchParams.get("storeId");

  if (categoryId) initialFilters.categoryId = categoryId;
  if (category) initialFilters.category = category;
  if (search) initialFilters.search = search;
  if (minPrice) initialFilters.minPrice = parseFloat(minPrice);
  if (maxPrice) initialFilters.maxPrice = parseFloat(maxPrice);
  if (storeId) initialFilters.storeId = storeId;

  return <ProductCatalog initialFilters={initialFilters} />;
}

// ---------- page entry ----------
export default function ProductsPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/groceryBackgroundImage.jpeg')",
        backgroundSize: "25%",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border-2 border-black bg-[#ffffffdb] p-6 shadow-lg">
          <Suspense fallback={<div>Loading…</div>}>
            <CatalogWithFilters />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
