"use client";

import { useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductsTabContent from "@/components/admin/product/ProductsTabContent";
import CategoriesTabContent from "@/components/admin/product/CategoriesTabContent";
import { useProductsManagement } from "@/hooks/admin/useProductsManagement";
import { useCategoriesManagement } from "@/hooks/admin/useCategoriesManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Package, FolderTree } from "lucide-react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingLogo from "@/components/ui/LoadingLogo";

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "products";
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  // Products state
  const {
    products,
    categories: productCategories,
    stores,
    loading: productsLoading,
    filters: productFilters,
    pagination,
    admin: productAdmin,
    productView,
    setProductView,
    handleDeleteProduct,
    handleSearch,
    handleCategoryFilter,
    handleStoreFilter,
    handlePageChange,
  } = useProductsManagement();

  // Categories state
  const {
    categories,
    categoriesLoading,
    categoryView,
    categoryFilters,
    setCategoryView,
    handleDeleteCategory,
    handleCategorySearch,
    handleActiveFilter,
  } = useCategoriesManagement(admin?.accessToken, isAuthenticated);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, router]);

  if (!admin || !productAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingLogo size="lg" message="Loading product management..." />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product and Category Management
            </h1>
            <p className="mt-1 text-gray-600">
              {admin.isSuper
                ? "Manage products and categories across all stores"
                : `Manage products and categories for ${admin.store?.name}`}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue={defaultTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="products"
                  className="flex items-center space-x-2"
                >
                  <Package className="h-4 w-4" />
                  <span>Products</span>
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="flex items-center space-x-2"
                >
                  <FolderTree className="h-4 w-4" />
                  <span>Categories</span>
                </TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6">
                <ProductsTabContent
                  products={products}
                  categories={productCategories}
                  stores={stores}
                  loading={productsLoading}
                  filters={productFilters}
                  pagination={pagination}
                  productView={productView}
                  isSuper={admin.isSuper || false}
                  storeName={admin.store?.name}
                  onViewChange={setProductView}
                  onSearch={handleSearch}
                  onCategoryFilter={handleCategoryFilter}
                  onStoreFilter={handleStoreFilter}
                  onPageChange={handlePageChange}
                  onDeleteProduct={handleDeleteProduct}
                />
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories" className="space-y-6">
                <CategoriesTabContent
                  categories={categories}
                  categoriesLoading={categoriesLoading}
                  categoryView={categoryView}
                  categoryFilters={categoryFilters}
                  isSuper={admin.isSuper || false}
                  storeName={admin.store?.name}
                  onViewChange={setCategoryView}
                  onSearch={handleCategorySearch}
                  onActiveFilter={handleActiveFilter}
                  onDelete={handleDeleteCategory}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
