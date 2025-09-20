"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminCategoryAPI } from "@/services/admin/productAPI";
import { AdminProductCategory, CategoryFilters } from "@/types/admin/product";
import { toast } from "react-toastify";
import CategoryListHeader from "@/components/admin/category/CategoryListHeader";
import CategoryFiltersCard from "@/components/admin/category/CategoryFiltersCard";
import CategoryGrid from "@/components/admin/category/CategoryGrid";

export default function AdminCategoriesPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CategoryFilters>({
    search: "",
  });

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      if (!admin?.accessToken) return;

      const response = await adminCategoryAPI.getCategories(
        admin.accessToken,
        filters,
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [admin?.accessToken, filters]);

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
      toast.success("Category deleted successfully");
      loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
    }));
  };

  const handleActiveFilter = (isActive: string) => {
    setFilters((prev) => ({
      ...prev,
      isActive: isActive === "all" ? undefined : isActive === "true",
    }));
  };

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
        {/* Header */}
        <CategoryListHeader
          isSuper={admin.isSuper}
          storeName={admin.store?.name}
        />

        {/* Filters */}
        <CategoryFiltersCard
          filters={filters}
          onSearch={handleSearch}
          onActiveFilter={handleActiveFilter}
        />

        {/* Categories Grid */}
        <CategoryGrid
          categories={categories}
          loading={loading}
          isSuper={admin.isSuper}
          onDelete={handleDeleteCategory}
        />
      </div>
    </AdminLayout>
  );
}
