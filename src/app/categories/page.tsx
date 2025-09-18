"use client";

import { useState } from "react";
import { useCategories, useProducts } from "@/hooks/product/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";
import { ProductFilters } from "@/types/product/productTypes";

export default function CategoriesPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
  });

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const { data: productsData, isLoading: productsLoading } = useProducts({
    ...filters,
    categoryId: selectedCategoryId || undefined,
  });

  const categories = categoriesData?.data?.categories || [];
  const products = productsData?.data?.products || [];
  const pagination = productsData?.data?.pagination || {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId,
  );

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="mb-4 h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Product Categories
          </h1>
          <p className="text-gray-600">
            Browse our wide selection of fresh groceries by category
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {/* All Products Option */}
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              !selectedCategoryId ? "ring-primary ring-2" : ""
            }`}
            onClick={() => handleCategorySelect("")}
          >
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                <Package className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-1 text-sm font-semibold">All Products</h3>
              <p className="text-xs text-gray-500">View everything</p>
            </CardContent>
          </Card>

          {/* Individual Categories */}
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCategoryId === category.id ? "ring-primary ring-2" : ""
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                  <Package className="text-primary h-6 w-6" />
                </div>
                <h3 className="mb-1 text-sm font-semibold">{category.name}</h3>
                {category.description && (
                  <p className="line-clamp-2 text-xs text-gray-500">
                    {category.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Category Info */}
        {selectedCategoryId && selectedCategory && (
          <div className="mb-6">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="secondary">{selectedCategory.name}</Badge>
              <span className="text-sm text-gray-500">
                {pagination.total} product{pagination.total !== 1 ? "s" : ""}
              </span>
            </div>
            {selectedCategory.description && (
              <p className="mb-4 text-sm text-gray-600">
                {selectedCategory.description}
              </p>
            )}
          </div>
        )}

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">
            {selectedCategory ? selectedCategory.name : "All Products"}
          </h2>

          <ProductGrid
            products={products}
            isLoading={productsLoading}
            isError={false}
          />
        </div>

        {/* Pagination */}
        {!productsLoading &&
          products.length > 0 &&
          pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>

                <span className="px-4 text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
