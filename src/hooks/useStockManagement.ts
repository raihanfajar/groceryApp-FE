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
  sortBy?: "stock-asc" | "stock-desc";
}

export const useStockManagement = () => {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get storeId and sortBy from URL params (when coming from inventory dashboard)
  const urlStoreId = searchParams.get("storeId");
  const urlSortBy = searchParams.get("sortBy") as
    | "stock-asc"
    | "stock-desc"
    | null;

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeIdInitialized, setStoreIdInitialized] = useState(false);
  const [filters, setFilters] = useState<StockFilters>({
    page: 1,
    limit: 12,
    search: "",
    storeId: admin?.isSuper
      ? urlStoreId || undefined // Default to undefined (All Stores) for Super Admin
      : admin?.store?.id || "store-1", // Use assigned store for Store Admin
    sortBy: urlSortBy || undefined, // Pre-set sort from URL if available
  });

  useEffect(() => {
    // Update storeId and sortBy filters when admin data or URL params change
    if (admin?.isSuper) {
      // For Super Admin: use URL params if available
      setFilters((prev) => ({
        ...prev,
        storeId: urlStoreId || undefined,
        sortBy: urlSortBy || prev.sortBy, // Keep existing sortBy if no URL param
      }));
      setStoreIdInitialized(true);
    } else if (admin?.store?.id) {
      // For Store Admin: use their assigned store
      setFilters((prev) => ({
        ...prev,
        storeId: admin?.store?.id || "store-1",
        sortBy: urlSortBy || prev.sortBy, // Keep existing sortBy if no URL param
      }));
      setStoreIdInitialized(true);
    }
  }, [admin?.isSuper, admin?.store?.id, urlStoreId, urlSortBy]);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
  const [stats, setStats] = useState({
    productsUpdatedToday: 0,
    lowStockAlerts: 0,
    stockMovementsToday: 0,
  });

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      if (!admin?.accessToken) return;

      const response = await adminProductAPI.getProducts(
        admin.accessToken,
        filters,
      );

      // Backend handles sorting, no need for client-side sorting
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

  const loadStats = useCallback(async () => {
    try {
      if (!admin?.accessToken) return;

      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Build filters object, only including storeId if it's defined and not 'all'
      const journalFilters: {
        dateFrom: string;
        dateTo: string;
        limit: number;
        storeId?: string;
      } = {
        dateFrom: today.toISOString(),
        dateTo: tomorrow.toISOString(),
        limit: 1000,
      };
      if (filters.storeId && filters.storeId !== "all") {
        journalFilters.storeId = filters.storeId;
      }

      const alertFilters: { storeId?: string } = {};
      if (filters.storeId && filters.storeId !== "all") {
        alertFilters.storeId = filters.storeId;
      }

      // Fetch today's stock movements and low stock alerts
      const [journalResponse, alertsResponse] = await Promise.all([
        adminInventoryAPI.getStockJournal(admin.accessToken, journalFilters),
        adminInventoryAPI.getLowStockAlerts(admin.accessToken, alertFilters),
      ]);

      const todayMovements = journalResponse.data.data;

      // Count unique products updated today (excluding TRANSFER)
      const uniqueProducts = new Set(
        todayMovements
          .filter((entry) => entry.type !== "TRANSFER")
          .map((entry) => entry.productId),
      );
      const productsUpdatedToday = uniqueProducts.size;

      // Get low stock alerts count
      const lowStockAlerts = alertsResponse.data.length;

      // Count total movements today
      const stockMovementsToday = todayMovements.length;

      setStats({
        productsUpdatedToday,
        lowStockAlerts,
        stockMovementsToday,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }, [admin?.accessToken, filters.storeId]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }
    loadProducts();
    loadCategories();
    loadStores();
  }, [isAuthenticated, router, loadProducts, loadCategories, loadStores]);

  // Reload stats when store filter changes or when it's first initialized
  useEffect(() => {
    // Only load stats if we have admin access token and storeId has been initialized
    if (admin?.accessToken && storeIdInitialized) {
      loadStats();
    }
  }, [filters.storeId, admin?.accessToken, storeIdInitialized, loadStats]);

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

  const handleSortChange = useCallback(
    (sortBy: "stock-asc" | "stock-desc" | undefined) => {
      setFilters((prev) => ({
        ...prev,
        sortBy,
        page: 1,
      }));
    },
    [],
  );

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
    stats,
    admin,
    isAuthenticated,
    handleUpdateStock,
    handleSearch,
    handleCategoryFilter,
    handleStoreFilter,
    handleSortChange,
    handlePageChange,
  };
};
