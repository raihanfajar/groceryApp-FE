import { axiosInstance } from "@/utils/axiosInstance";
import {
  DashboardReport,
  DashboardApiResponse,
  DashboardFilters,
  SalesReport,
  TransactionsResponse,
  TopSellingProduct,
} from "@/types/admin/dashboard";

// Create axios instance with auth interceptor
const createAuthAxios = (token: string) => {
  const authInstance = axiosInstance;
  authInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return authInstance;
};

// Admin Report & Dashboard APIs
export const adminReportAPI = {
  // Get comprehensive dashboard report
  getDashboardReport: async (
    token: string,
    filters?: DashboardFilters,
  ): Promise<DashboardApiResponse<DashboardReport>> => {
    const api = createAuthAxios(token);
    const params = new URLSearchParams();

    if (filters?.storeId) params.append("storeId", filters.storeId);
    if (filters?.month) params.append("month", filters.month.toString());
    if (filters?.year) params.append("year", filters.year.toString());

    const response = await api.get(`/reports/dashboard?${params.toString()}`);
    return response.data as DashboardApiResponse<DashboardReport>;
  },

  // Get monthly sales report
  getMonthlySalesReport: async (
    token: string,
    filters?: DashboardFilters,
  ): Promise<DashboardApiResponse<SalesReport>> => {
    const api = createAuthAxios(token);
    const params = new URLSearchParams();

    if (filters?.storeId) params.append("storeId", filters.storeId);
    if (filters?.month) params.append("month", filters.month.toString());
    if (filters?.year) params.append("year", filters.year.toString());

    const response = await api.get(
      `/reports/sales/monthly?${params.toString()}`,
    );
    return response.data as DashboardApiResponse<SalesReport>;
  },

  // Get recent transactions (admin view)
  getRecentTransactions: async (
    token: string,
    storeId?: string,
    limit: number = 10,
  ): Promise<TransactionsResponse> => {
    const api = createAuthAxios(token);
    const params = new URLSearchParams();

    params.append("limit", limit.toString());
    params.append("page", "1");
    params.append("sortBy", "createdAt");
    params.append("sortOrder", "desc");

    if (storeId) params.append("storeId", storeId);

    const response = await api.get(`/admin/transactions?${params.toString()}`);
    return response.data as TransactionsResponse;
  },

  // Get sales by products (for top products)
  getTopProducts: async (
    token: string,
    filters?: DashboardFilters,
    limit: number = 5,
  ): Promise<DashboardApiResponse<{ products: TopSellingProduct[] }>> => {
    const api = createAuthAxios(token);
    const params = new URLSearchParams();

    if (filters?.storeId) params.append("storeId", filters.storeId);
    if (filters?.month) params.append("month", filters.month.toString());
    if (filters?.year) params.append("year", filters.year.toString());
    params.append("limit", limit.toString());

    const response = await api.get(
      `/reports/sales/products?${params.toString()}`,
    );
    return response.data as DashboardApiResponse<{
      products: TopSellingProduct[];
    }>;
  },
};
