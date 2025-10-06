import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { adminReportAPI } from "@/services/admin/reportAPI";
import { adminInventoryAPI } from "@/services/admin/inventoryAPI";
import {
  DashboardFilters,
  DashboardStats,
  RecentTransaction,
} from "@/types/admin/dashboard";
import {
  Store,
  LowStockAlert as InventoryLowStockAlert,
} from "@/types/admin/inventory";

export const useDashboardData = (
  storeIdForQuery?: string,
  selectedStoreValue?: string,
) => {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;

  // Current month and year
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();

  // Determine store ID based on admin type
  const storeId = admin?.isSuper ? storeIdForQuery : admin?.store?.id;

  // Build filters
  const filters: DashboardFilters = {
    storeId,
    month: currentMonth,
    year: currentYear,
  };

  // Query enabled only if token exists and for Super Admin, a selection has been made
  // selectedStoreValue tracks whether Super Admin has made a choice (including "all")
  const isEnabled =
    !!token && (!admin?.isSuper || !!selectedStoreValue || !!storeId);

  // Fetch dashboard report (sales + stock summary)
  const {
    data: dashboardData,
    isLoading: loadingDashboard,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ["admin", "dashboard", storeId, currentMonth, currentYear],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      const response = await adminReportAPI.getDashboardReport(token, filters);
      return response.data;
    },
    enabled: isEnabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch recent transactions
  const {
    data: transactionsData,
    isLoading: loadingTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ["admin", "transactions", "recent", storeId],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      const response = await adminReportAPI.getRecentTransactions(
        token,
        storeId,
        10,
      );
      return response;
    },
    enabled: isEnabled,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });

  // Fetch low stock alerts
  const {
    data: lowStockData,
    isLoading: loadingLowStock,
    error: lowStockError,
  } = useQuery({
    queryKey: ["admin", "low-stock-alerts", storeId],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      const response = await adminInventoryAPI.getLowStockAlerts(token, {
        storeId,
      });
      return response.data;
    },
    enabled: isEnabled,
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: false,
  });

  // Calculate dashboard stats
  const stats: DashboardStats = {
    dailySales: 0,
    monthlySales: dashboardData?.sales?.summary?.totalSales || 0,
    monthlyTransactions: dashboardData?.sales?.summary?.totalTransactions || 0,
    totalProducts: dashboardData?.stock?.summary?.totalProducts || 0,
  };

  // Calculate today's sales from daily sales data
  if (dashboardData?.sales?.dailySales) {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const todaySales = dashboardData.sales.dailySales.find(
      (day) => day.date === today,
    );
    stats.dailySales = todaySales?.totalSales || 0;
  }

  // Transform data for components
  const salesChartData = {
    labels:
      dashboardData?.sales?.dailySales?.map((day) => {
        const date = new Date(day.date);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }) || [],
    data: dashboardData?.sales?.dailySales?.map((day) => day.totalSales) || [],
  };

  const topProducts = dashboardData?.sales?.topProducts || [];

  const recentTransactions: RecentTransaction[] =
    transactionsData?.transactions || [];

  const lowStockAlerts: InventoryLowStockAlert[] = lowStockData || [];

  const isLoading = loadingDashboard || loadingTransactions || loadingLowStock;
  const error = dashboardError || transactionsError || lowStockError;

  const refetchAll = useCallback(() => {
    refetchDashboard();
  }, [refetchDashboard]);

  return {
    stats,
    salesChartData,
    topProducts,
    recentTransactions,
    lowStockAlerts,
    isLoading,
    error,
    refetch: refetchAll,
    period: dashboardData?.sales?.period?.period || "",
  };
};

// Hook for loading stores (Super Admin only)
export const useStores = () => {
  const { admin } = useAdminAuthStore();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStores = useCallback(async () => {
    if (!admin?.accessToken || !admin?.isSuper) return;

    try {
      setLoading(true);
      const response = await adminInventoryAPI.getStores(admin.accessToken);
      setStores(response.data);
    } catch (error) {
      console.error("Error loading stores:", error);
    } finally {
      setLoading(false);
    }
  }, [admin?.accessToken, admin?.isSuper]);

  useEffect(() => {
    if (admin?.isSuper) {
      loadStores();
    }
  }, [admin?.isSuper, loadStores]);

  return { stores, loading };
};
