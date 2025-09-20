"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import ProductListingHeader from "@/components/admin/product/ProductListingHeader";
import ProductFiltersComponent from "@/components/admin/product/ProductFiltersComponent";
import ProductCard from "@/components/admin/product/ProductCard";
import ProductEmptyState from "@/components/admin/product/ProductEmptyState";
import ProductPagination from "@/components/admin/product/ProductPagination";
import { useProductListing } from "@/hooks/useProductListing";

export default function AdminProductsPage() {
  const {
    products,
    categories,
    loading,
    filters,
    pagination,
    admin,
    handleDeleteProduct,
    handleSearch,
    handleCategoryFilter,
    handleStoreFilter,
    handlePageChange,
  } = useProductListing();

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
        <ProductListingHeader
          isSuper={admin.isSuper || false}
          storeName={admin.store?.name}
        />

        <ProductFiltersComponent
          filters={filters}
          categories={categories}
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
          <ProductEmptyState isSuper={admin.isSuper || false} />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSuper={admin.isSuper || false}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}

        <ProductPagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </AdminLayout>
  );
}
