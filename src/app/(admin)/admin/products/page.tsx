"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductListingHeader from "@/components/admin/product/ProductListingHeader";
import ProductFiltersComponent from "@/components/admin/product/ProductFiltersComponent";
import ProductCard from "@/components/admin/product/ProductCard";
import ProductListRow from "@/components/admin/product/ProductListRow";
import ProductEmptyState from "@/components/admin/product/ProductEmptyState";
import ProductPagination from "@/components/admin/product/ProductPagination";
import ViewToggle from "@/components/admin/product/ViewToggle";
import { useProductListing } from "@/hooks/useProductListing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Package, FolderTree } from "lucide-react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { adminCategoryAPI } from "@/services/admin/productAPI";
import { AdminProductCategory, CategoryFilters } from "@/types/admin/product";
import { toast } from "react-toastify";
import CategoryListHeader from "@/components/admin/category/CategoryListHeader";
import CategoryFiltersCard from "@/components/admin/category/CategoryFiltersCard";
import CategoryGrid from "@/components/admin/category/CategoryGrid";
import { useQueryClient } from "@tanstack/react-query";
import { PRODUCT_QUERY_KEYS } from "@/hooks/product/useProducts";
import LoadingLogo from "@/components/ui/LoadingLogo";

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "products";
  const [productView, setProductView] = useState<"grid" | "list">("grid");
  const [categoryView, setCategoryView] = useState<"grid" | "list">("grid");
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Products state
  const {
    products,
    categories: productCategories,
    stores,
    loading: productsLoading,
    filters: productFilters,
    pagination,
    admin: productAdmin,
    handleDeleteProduct,
    handleSearch,
    handleCategoryFilter,
    handleStoreFilter,
    handlePageChange,
  } = useProductListing();

  // Categories state
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilters>({
    search: "",
  });

  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      if (!admin?.accessToken) return;

      const response = await adminCategoryAPI.getCategories(
        admin.accessToken,
        categoryFilters,
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  }, [admin?.accessToken, categoryFilters]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }
    loadCategories();
  }, [isAuthenticated, router, loadCategories]);

  const handleDeleteCategory = async (id: string) => {
    if (!admin?.accessToken) return;

    if (
      !confirm(
        "Are you sure you want to delete this category? This action will affect all products in this category.",
      )
    )
      return;

    try {
      await adminCategoryAPI.deleteCategory(admin.accessToken, id);
      await queryClient.invalidateQueries({
        queryKey: PRODUCT_QUERY_KEYS.categories,
      });
      toast.success("Category deleted successfully");
      loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleCategorySearch = (searchTerm: string) => {
    setCategoryFilters((prev) => ({
      ...prev,
      search: searchTerm,
    }));
  };

  const handleActiveFilter = (isActive: string) => {
    setCategoryFilters((prev) => ({
      ...prev,
      isActive: isActive === "all" ? undefined : isActive === "true",
    }));
  };

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
                <ProductListingHeader
                  isSuper={admin.isSuper || false}
                  storeName={admin.store?.name}
                />

                <ProductFiltersComponent
                  filters={productFilters}
                  categories={productCategories}
                  stores={stores}
                  isSuper={admin.isSuper || false}
                  onSearch={handleSearch}
                  onCategoryFilter={handleCategoryFilter}
                  onStoreFilter={handleStoreFilter}
                />

                <div className="flex justify-end">
                  <ViewToggle
                    view={productView}
                    onViewChange={setProductView}
                  />
                </div>

                {productsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingLogo size="md" message="Loading products..." />
                  </div>
                ) : products.length === 0 ? (
                  <ProductEmptyState isSuper={admin.isSuper || false} />
                ) : productView === "grid" ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isSuper={admin.isSuper || false}
                        onDelete={handleDeleteProduct}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <ProductListRow
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
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories" className="space-y-6">
                <CategoryListHeader
                  isSuper={admin.isSuper}
                  storeName={admin.store?.name}
                />

                <CategoryFiltersCard
                  filters={categoryFilters}
                  onSearch={handleCategorySearch}
                  onActiveFilter={handleActiveFilter}
                />

                <div className="flex justify-end">
                  <ViewToggle
                    view={categoryView}
                    onViewChange={setCategoryView}
                  />
                </div>

                <CategoryGrid
                  categories={categories}
                  loading={categoriesLoading}
                  isSuper={admin.isSuper}
                  view={categoryView}
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
