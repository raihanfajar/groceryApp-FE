import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { adminProductAPI, adminCategoryAPI } from "@/services/admin/productAPI";
import { adminInventoryAPI } from "@/services/admin/inventoryAPI";
import { AdminProduct, AdminProductCategory } from "@/types/admin/product";
import {
  StockJournalEntry,
  StockMovementType,
  StockJournalFilters as JournalFilters,
} from "@/types/admin/inventory";
import { toast } from "react-toastify";

interface Store {
  id: string;
  name: string;
}

interface StockJournalFilters {
  page?: number;
  limit?: number;
  search?: string;
  productId?: string;
  categoryId?: string;
  storeId?: string;
  type?: StockMovementType;
  startDate?: string;
  endDate?: string;
}

export const useStockJournal = () => {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  const [entries, setEntries] = useState<StockJournalEntry[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<StockJournalFilters>({
    page: 1,
    limit: 10,
    search: "",
    storeId: admin?.isSuper ? undefined : admin?.store?.id,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [stats, setStats] = useState({
    movementsToday: 0,
    stockAdditions: 0,
    stockReductions: 0,
    transfers: 0,
  });

  const loadStockJournal = useCallback(async () => {
    try {
      setLoading(true);
      if (!admin?.accessToken) return;

      // Convert our filters to the API format
      const apiFilters: JournalFilters = {
        page: filters.page,
        limit: filters.limit,
        productId: filters.productId,
        storeId: filters.storeId,
        type: filters.type,
        dateFrom: filters.startDate,
        dateTo: filters.endDate,
      };

      const response = await adminInventoryAPI.getStockJournal(
        admin.accessToken,
        apiFilters,
      );
      setEntries(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error loading stock journal:", error);
      toast.error("Failed to load stock journal");
    } finally {
      setLoading(false);
    }
  }, [admin?.accessToken, filters]);

  const loadStats = useCallback(async () => {
    try {
      if (!admin?.accessToken) return;

      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Fetch today's movements
      const todayFilters: JournalFilters = {
        storeId: filters.storeId,
        dateFrom: today.toISOString(),
        dateTo: tomorrow.toISOString(),
        limit: 1000, // Get all movements for today
      };

      const response = await adminInventoryAPI.getStockJournal(
        admin.accessToken,
        todayFilters,
      );

      const todayEntries = response.data.data;

      // Calculate stats based on actual stock changes
      const movementsToday = todayEntries.length;
      const stockAdditions = todayEntries.filter(
        (entry) =>
          entry.type === "IN" ||
          entry.type === "INITIAL" ||
          (entry.type === "ADJUSTMENT" && entry.afterStock > entry.beforeStock),
      ).length;
      const stockReductions = todayEntries.filter(
        (entry) =>
          entry.type === "OUT" ||
          (entry.type === "ADJUSTMENT" && entry.afterStock < entry.beforeStock),
      ).length;
      const transfers = todayEntries.filter(
        (entry) => entry.type === "TRANSFER",
      ).length;

      setStats({
        movementsToday,
        stockAdditions,
        stockReductions,
        transfers,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }, [admin?.accessToken, filters.storeId]);

  const loadProducts = useCallback(async () => {
    try {
      if (!admin?.accessToken) return;

      const response = await adminProductAPI.getProducts(admin.accessToken, {
        limit: 1000, // Load all products for filtering
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }, [admin?.accessToken]);

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
    }
  }, [admin?.accessToken, admin?.isSuper]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }
    loadStockJournal();
    loadProducts();
    loadCategories();
    loadStores();
    loadStats();
  }, [
    isAuthenticated,
    router,
    loadStockJournal,
    loadProducts,
    loadCategories,
    loadStores,
    loadStats,
  ]);

  const handleSearch = useCallback((searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  }, []);

  const handleProductFilter = useCallback((productId: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      productId,
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

  const handleTypeFilter = useCallback(
    (type: StockMovementType | undefined) => {
      setFilters((prev) => ({
        ...prev,
        type,
        page: 1,
      }));
    },
    [],
  );

  const handleDateRangeFilter = useCallback(
    (startDate: string | undefined, endDate: string | undefined) => {
      setFilters((prev) => ({
        ...prev,
        startDate,
        endDate,
        page: 1,
      }));
    },
    [],
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
    entries,
    products,
    categories,
    stores,
    loading,
    filters,
    pagination,
    stats,
    admin,
    isAuthenticated,
    handleSearch,
    handleProductFilter,
    handleCategoryFilter,
    handleStoreFilter,
    handleTypeFilter,
    handleDateRangeFilter,
    handlePageChange,
  };
};
