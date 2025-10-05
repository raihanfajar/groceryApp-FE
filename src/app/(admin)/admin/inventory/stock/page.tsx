"use client";

// ! ERROR ketika npm run build, disuruh wrap suspense, jadi beginiin (ghazi)

import { Suspense, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StockManagementHeader from "@/components/admin/inventory/StockManagementHeader";
import StockFiltersComponent from "@/components/admin/inventory/StockFiltersComponent";
import StockProductCard from "@/components/admin/inventory/StockProductCard";
import StockProductListItem from "@/components/admin/inventory/StockProductListItem";
import StockEmptyState from "@/components/admin/inventory/StockEmptyState";
import StockPagination from "@/components/admin/inventory/StockPagination";
import { useStockManagement } from "@/hooks/useStockManagement";
import { AdminProduct } from "@/types/admin/product";
import { Button } from "@/components/ui/button";
import { Grid3x3, List } from "lucide-react";

function StockManagementPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    products,
    categories,
    stores,
    loading,
    filters,
    pagination,
    stats,
    admin,
    handleUpdateStock,
    handleSearch,
    handleCategoryFilter,
    handleStoreFilter,
    handleSortChange,
    handlePageChange,
  } = useStockManagement();

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <StockManagementHeader
          isSuper={admin.isSuper || false}
          storeName={admin.store?.name}
          stats={stats}
        />

        <StockFiltersComponent
          filters={filters}
          categories={categories}
          stores={stores}
          isSuper={admin.isSuper || false}
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          onStoreFilter={handleStoreFilter}
          onSortChange={handleSortChange}
        />

        {/* View Mode Toggle */}
        <div className="flex justify-end">
          <div className="flex items-center space-x-1 rounded-md border bg-white p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 px-3"
            >
              <Grid3x3 className="mr-2 h-4 w-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3"
            >
              <List className="mr-2 h-4 w-4" />
              List
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <StockEmptyState />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {products.map((product: AdminProduct) => (
              <StockProductCard
                key={product.id}
                product={product}
                selectedStoreId={filters.storeId || admin.store?.id}
                onUpdateStock={handleUpdateStock}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((product: AdminProduct) => (
              <StockProductListItem
                key={product.id}
                product={product}
                selectedStoreId={filters.storeId || admin.store?.id}
                onUpdateStock={handleUpdateStock}
              />
            ))}
          </div>
        )}

        <StockPagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </AdminLayout>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <span>Loading…</span>
        </div>
      }
    >
      <StockManagementPage />
    </Suspense>
  );
}
