import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { adminProductAPI, adminCategoryAPI } from "@/services/admin/productAPI";
import {
  AdminProduct,
  AdminProductCategory,
  ProductFilters,
} from "@/types/admin/product";
import { toast } from "react-toastify";

export const useProductListing = () => {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
    search: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      if (!admin?.accessToken) return;

      const response = await adminProductAPI.getProducts(
        admin.accessToken,
        filters,
      );
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [admin?.accessToken, filters]);

  const loadCategories = useCallback(async () => {
    try {
      if (!admin?.accessToken) return;

      const response = await adminCategoryAPI.getCategories(admin.accessToken);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, [admin?.accessToken]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }
    loadProducts();
    loadCategories();
  }, [isAuthenticated, router, loadProducts, loadCategories]);

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      if (!admin?.accessToken) return;

      if (!confirm("Are you sure you want to delete this product?")) return;

      try {
        await adminProductAPI.deleteProduct(admin.accessToken, id);
        toast.success("Product deleted successfully");
        loadProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    },
    [admin?.accessToken, loadProducts],
  );

  const handleSearch = useCallback((searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  }, []);

  const handleCategoryFilter = useCallback((categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: categoryId === "all" ? undefined : categoryId,
      page: 1,
    }));
  }, []);

  const handleStoreFilter = useCallback((storeId: string) => {
    setFilters((prev) => ({
      ...prev,
      storeId: storeId === "all" ? undefined : storeId,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
    products,
    categories,
    loading,
    filters,
    pagination,
    admin,
    isAuthenticated,
    handleDeleteProduct,
    handleSearch,
    handleCategoryFilter,
    handleStoreFilter,
    handlePageChange,
  };
};
