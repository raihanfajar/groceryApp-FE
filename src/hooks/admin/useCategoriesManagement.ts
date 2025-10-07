import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { adminCategoryAPI } from "@/services/admin/productAPI";
import { AdminProductCategory, CategoryFilters } from "@/types/admin/product";
import { PRODUCT_QUERY_KEYS } from "@/hooks/product/useProducts";

export function useCategoriesManagement(
  accessToken: string | undefined,
  isAuthenticated: () => boolean,
) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryView, setCategoryView] = useState<"grid" | "list">("grid");
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilters>({
    search: "",
  });

  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      if (!accessToken) return;

      const response = await adminCategoryAPI.getCategories(
        accessToken,
        categoryFilters,
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  }, [accessToken, categoryFilters]);

  // Check authentication once on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, router]);

  // Load categories when filters change
  useEffect(() => {
    if (accessToken) {
      loadCategories();
    }
  }, [loadCategories, accessToken]);

  const handleDeleteCategory = async (id: string) => {
    if (!accessToken) return;

    if (
      !confirm(
        "Are you sure you want to delete this category? This action will affect all products in this category.",
      )
    )
      return;

    try {
      await adminCategoryAPI.deleteCategory(accessToken, id);
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

  return {
    categories,
    categoriesLoading,
    categoryView,
    categoryFilters,
    setCategoryView,
    handleDeleteCategory,
    handleCategorySearch,
    handleActiveFilter,
  };
}
