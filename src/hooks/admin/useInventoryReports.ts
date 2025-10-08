import { useQuery } from "@tanstack/react-query";
import { adminInventoryAPI } from "@/services/admin/inventoryAPI";
import { InventorySummary } from "@/types/admin/inventory";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface StockValueData {
  category: string;
  totalStock: number;
  totalValue: number;
}

// Colors for category distribution chart
const CATEGORY_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
];

interface LowStockProduct {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  price: number;
  storeId: string;
  storeName: string;
}

interface UseInventoryReportsData {
  summary: InventorySummary | null;
  categoryDistribution: CategoryData[];
  stockValueByCategory: StockValueData[];
  lowStockProducts: LowStockProduct[];
  outOfStockProducts: LowStockProduct[];
}

interface UseInventoryReportsReturn {
  data: UseInventoryReportsData;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useInventoryReports = (
  selectedStoreId?: string,
): UseInventoryReportsReturn => {
  const { admin } = useAdminAuthStore();

  // Handle "all" stores option for Super Admin
  const storeId = admin?.isSuper
    ? selectedStoreId === "all"
      ? undefined
      : selectedStoreId
    : admin?.store?.id || undefined;
  const token = admin?.accessToken || "";

  // For Super Admin, always enable queries (can view all stores or specific store)
  // For Store Admin, require their storeId to be set
  const isEnabled = !!token && (!admin?.isSuper || selectedStoreId !== "");

  // Fetch inventory summary
  const {
    data: summaryResponse,
    isLoading: isSummaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ["admin", "inventory", "summary", storeId],
    queryFn: () => adminInventoryAPI.getInventorySummary(token, { storeId }),
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch category distribution data
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: categoryError,
    refetch: refetchCategory,
  } = useQuery({
    queryKey: ["admin", "inventory", "category-distribution", storeId],
    queryFn: async () => {
      const response = await adminInventoryAPI.getCategoryDistribution(
        token,
        storeId,
      );
      return response.data;
    },
    enabled: isEnabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch stock value by category
  const {
    data: stockValueData,
    isLoading: isStockValueLoading,
    error: stockValueError,
    refetch: refetchStockValue,
  } = useQuery({
    queryKey: ["admin", "inventory", "stock-value", storeId],
    queryFn: async () => {
      const response = await adminInventoryAPI.getStockValueByCategory(
        token,
        storeId,
      );
      return response.data;
    },
    enabled: isEnabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch low stock and out of stock products
  const {
    data: stockAlerts,
    isLoading: isStockAlertsLoading,
    error: stockAlertsError,
    refetch: refetchStockAlerts,
  } = useQuery({
    queryKey: ["admin", "inventory", "stock-alerts", storeId],
    queryFn: async () => {
      const response = await adminInventoryAPI.getLowStockAlerts(token, {
        storeId,
      });

      // Separate into low stock and out of stock
      const allAlerts = response.data;
      const lowStockProducts = allAlerts
        .filter((alert) => alert.stock > 0)
        .map((alert) => ({
          id: alert.productId,
          name: alert.product.name,
          category: alert.product.category.name,
          currentStock: alert.stock,
          minStock: alert.minStock || 5,
          price: alert.product.price,
          storeId: alert.storeId,
          storeName: alert.store?.name || "",
        }));

      const outOfStockProducts = allAlerts
        .filter((alert) => alert.stock === 0)
        .map((alert) => ({
          id: alert.productId,
          name: alert.product.name,
          category: alert.product.category.name,
          currentStock: alert.stock,
          minStock: alert.minStock || 5,
          price: alert.product.price,
          storeId: alert.storeId,
          storeName: alert.store?.name || "",
        }));

      return {
        lowStockProducts,
        outOfStockProducts,
      };
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isLoading =
    isSummaryLoading ||
    isCategoryLoading ||
    isStockValueLoading ||
    isStockAlertsLoading;

  const error =
    summaryError || categoryError || stockValueError || stockAlertsError;

  const refetch = () => {
    refetchSummary();
    refetchCategory();
    refetchStockValue();
    refetchStockAlerts();
  };

  const data: UseInventoryReportsData = {
    summary: summaryResponse?.data || null,
    categoryDistribution: categoryData
      ? categoryData.map((item, index) => ({
          ...item,
          color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        }))
      : [],
    stockValueByCategory: stockValueData || [],
    lowStockProducts: stockAlerts?.lowStockProducts || [],
    outOfStockProducts: stockAlerts?.outOfStockProducts || [],
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
