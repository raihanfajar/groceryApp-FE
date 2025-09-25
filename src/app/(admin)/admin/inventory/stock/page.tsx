"use client";

// ! ERROR ketika npm run build, disuruh wrap suspense, jadi beginiin (ghazi)

import { Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StockManagementHeader from "@/components/admin/inventory/StockManagementHeader";
import StockFiltersComponent from "@/components/admin/inventory/StockFiltersComponent";
import StockProductCard from "@/components/admin/inventory/StockProductCard";
import StockEmptyState from "@/components/admin/inventory/StockEmptyState";
import StockPagination from "@/components/admin/inventory/StockPagination";
import { useStockManagement } from "@/hooks/useStockManagement";
import { AdminProduct } from "@/types/admin/product";

function StockManagementPage() {
  const {
    products,
    categories,
    stores,
    loading,
    filters,
    pagination,
    admin,
    handleUpdateStock,
    handleSearch,
    handleCategoryFilter,
    handleStoreFilter,
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
        />

        <StockFiltersComponent
          filters={filters}
          categories={categories}
          stores={stores}
          isSuper={admin.isSuper || false}
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          onStoreFilter={handleStoreFilter}
        />

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <StockEmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product: AdminProduct) => (
              <StockProductCard
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
