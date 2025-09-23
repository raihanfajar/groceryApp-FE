"use client";

import { ProductCatalog } from "@/components/product/ProductCatalog";
import { ProductFilters } from "@/types/product/productTypes";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const searchParams = useSearchParams();

  // Extract filters from URL search parameters
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
            <ProductCatalog initialFilters={initialFilters} />
          </div>
        </div>
      </div>
  );
}
