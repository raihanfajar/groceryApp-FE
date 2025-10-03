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
  const storeId = admin?.isSuper
    ? selectedStoreId
    : admin?.store?.id || undefined;
  const token = admin?.accessToken || "";

  // For Super Admin, require storeId to be selected
  const isEnabled = !!token && (!admin?.isSuper || !!storeId);

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
      // This would be a separate API call in a real implementation
      // For now, we'll simulate category distribution data
      const mockCategoryData: CategoryData[] = [
        { name: "Beverages", value: 45, color: "#0088FE" },
        { name: "Snacks", value: 32, color: "#00C49F" },
        { name: "Dairy", value: 28, color: "#FFBB28" },
        { name: "Fresh Produce", value: 25, color: "#FF8042" },
        { name: "Frozen Foods", value: 18, color: "#8884D8" },
        { name: "Bakery", value: 15, color: "#82CA9D" },
      ];
      return mockCategoryData;
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
      // This would be a separate API call in a real implementation
      // For now, we'll simulate stock value data
      const mockStockValueData: StockValueData[] = [
        { category: "Beverages", totalStock: 450, totalValue: 15000000 },
        { category: "Snacks", totalStock: 320, totalValue: 8500000 },
        { category: "Dairy", totalStock: 280, totalValue: 12000000 },
        { category: "Fresh Produce", totalStock: 250, totalValue: 6000000 },
        { category: "Frozen Foods", totalStock: 180, totalValue: 9500000 },
        { category: "Bakery", totalStock: 150, totalValue: 4500000 },
      ];
      return mockStockValueData;
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
      // This would be a separate API call in a real implementation
      // For now, we'll simulate stock alerts data
      const mockLowStockProducts: LowStockProduct[] = [
        {
          id: "1",
          name: "Coca Cola 330ml",
          category: "Beverages",
          currentStock: 5,
          minStock: 10,
          price: 8000,
          storeId: storeId || "store-1",
          storeName: admin?.store?.name || "Main Store",
        },
        {
          id: "2",
          name: "White Bread",
          category: "Bakery",
          currentStock: 3,
          minStock: 5,
          price: 12000,
          storeId: storeId || "store-1",
          storeName: admin?.store?.name || "Main Store",
        },
      ];

      const mockOutOfStockProducts: LowStockProduct[] = [
        {
          id: "3",
          name: "Milk 1L",
          category: "Dairy",
          currentStock: 0,
          minStock: 15,
          price: 18000,
          storeId: storeId || "store-1",
          storeName: admin?.store?.name || "Main Store",
        },
      ];

      return {
        lowStockProducts: mockLowStockProducts,
        outOfStockProducts: mockOutOfStockProducts,
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
    categoryDistribution: categoryData || [],
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
