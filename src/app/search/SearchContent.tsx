"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFiltersComponent } from "@/components/product/ProductFilters";
import { ProductSearch } from "@/components/product/ProductSearch";
import { useProducts } from "@/hooks/product/useProducts";
import { ProductFilters as ProductFiltersType } from "@/types/product/productTypes";
import { Pagination } from "@/components/product/Pagination";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [filters, setFilters] = useState<ProductFiltersType>({
    search: initialQuery,
    page: 1,
    limit: 12,
  });

  // Update filters when URL search params change
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setFilters((prev) => ({ ...prev, search: query, page: 1 }));
  }, [searchParams]);

  const { data, isLoading, error } = useProducts(filters);

  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination || {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  };

  const handleFiltersChange = (newFilters: ProductFiltersType) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({
      search: initialQuery,
      page: 1,
      limit: 12,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            {initialQuery ? `Search Results for "${initialQuery}"` : "Search Products"}
          </h1>
          <div className="max-w-2xl">
            <ProductSearch placeholder="Search for products..." />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden w-80 flex-shrink-0 lg:block">
            <div className="sticky top-8">
              <ProductFiltersComponent
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                className="rounded-lg bg-white shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1">
            {!isLoading && (
              <div className="mb-6">
                <p className="text-gray-600">
                  {pagination.total > 0
                    ? `Found ${pagination.total} product${pagination.total !== 1 ? "s" : ""}`
                    : "No products found"}
                  {filters.search && ` for "${filters.search}"`}
                </p>
              </div>
            )}

            <ProductGrid
              products={products}
              isLoading={isLoading}
              isError={!!error}
            />

            {!isLoading && products.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}