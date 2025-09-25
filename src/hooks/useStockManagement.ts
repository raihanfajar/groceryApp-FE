import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { adminProductAPI, adminCategoryAPI } from "@/services/admin/productAPI";
import { adminInventoryAPI } from "@/services/admin/inventoryAPI";
import {
  AdminProduct,
  AdminProductCategory,
  ProductFilters,
} from "@/types/admin/product";
import { toast } from "react-toastify";

interface Store {
  id: string;
  name: string;
}

interface StockFilters extends ProductFilters {
  lowStockOnly?: boolean;
}

export const useStockManagement = () => {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get storeId from URL params (when coming from inventory dashboard)
  const urlStoreId = searchParams.get("storeId");

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<StockFilters>({
    page: 1,
    limit: 12,
    search: "",
    storeId: admin?.isSuper
      ? urlStoreId || undefined // Use URL param if available for Super Admin
      : admin?.store?.id || "store-1", // Use assigned store for Store Admin
  });

  useEffect(() => {
    // Update storeId filter when admin data changes
    if (!admin?.isSuper) {
      const storeId = admin?.store?.id || "store-1"; // Default store if none assigned
      setFilters((prev) => ({ ...prev, storeId }));
    } else if (urlStoreId && !filters.storeId) {
      // Set URL store ID for Super Admin if not already set
      setFilters((prev) => ({ ...prev, storeId: urlStoreId }));
    }
  }, [admin, urlStoreId, filters.storeId]);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
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

  const loadStores = useCallback(async () => {
    try {
      if (!admin?.accessToken || !admin?.isSuper) return;

      const response = await adminInventoryAPI.getStores(admin.accessToken);
      setStores(response.data);
    } catch (error) {
      console.error("Error loading stores:", error);
      toast.error("Failed to load stores");
    }
  }, [admin?.accessToken, admin?.isSuper]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }
    loadProducts();
    loadCategories();
    loadStores();
  }, [isAuthenticated, router, loadProducts, loadCategories, loadStores]);

  const handleUpdateStock = useCallback(
    async (
      productId: string,
      storeId: string,
      newStock: number,
      reason: string,
    ) => {
      if (!admin?.accessToken) return;

      try {
        await adminInventoryAPI.updateStock(admin.accessToken, {
          productId,
          storeId,
          quantity: newStock,
          type: "ADJUSTMENT",
          notes: reason,
        });

        toast.success("Stock updated successfully");

        // Reload products to show updated stock
        loadProducts();
      } catch (error) {
        console.error("Error updating stock:", error);
        toast.error("Failed to update stock");
        throw error;
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

  const handleCategoryFilter = useCallback((categoryId: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      categoryId,
      page: 1,
    }));
  }, []);

  const handleStoreFilter = useCallback((storeId: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      storeId,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
    products,
    categories,
    stores,
    loading,
    filters,
    pagination,
    admin,
    isAuthenticated,
    handleUpdateStock,
    handleSearch,
    handleCategoryFilter,
    handleStoreFilter,
    handlePageChange,
  };
};
