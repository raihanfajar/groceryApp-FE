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

    params.append("pageSize", limit.toString());
    params.append("page", "1");

    if (storeId) params.append("storeId", storeId);

    // Super Admin (no storeId or storeId="all") uses /admin/all endpoint
    // Store Admin uses /admin endpoint
    const endpoint =
      !storeId || storeId === "all"
        ? "/transaction/admin/all"
        : "/transaction/admin";

    const response = await api.get(`${endpoint}?${params.toString()}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData: any = response.data;

    // Backend returns { message, data: { data: [], meta: {} } }
    // Transform to match frontend expectation
    const rawTransactions = responseData.data?.data || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedTransactions = rawTransactions.map((tx: any) => ({
      id: tx.id,
      transactionNumber: tx.id.slice(0, 8).toUpperCase(),
      userId: tx.userId,
      userName: tx.user?.name || "Unknown",
      userEmail: tx.user?.email || "",
      userProfilePicture: tx.user?.profilePicture || null,
      storeId: tx.storeId,
      storeName: tx.store?.name || "Unknown Store",
      totalPrice: tx.totalPrice,
      discountedProductPrice: tx.discountedProductPrice || 0,
      discountedShipping: tx.discountedShipping || 0,
      status: tx.status,
      createdAt: tx.createdAt,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      products:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tx.products?.map((p: any) => ({
          productId: p.product?.id || p.productId,
          productName: p.product?.name || "Unknown Product",
          quantity: p.quantity,
          price: p.price,
          discount: p.discount || 0,
          finalPrice: p.finalPrice || p.price,
          picture: p.product?.picture1,
        })) || [],
    }));

    return {
      transactions: transformedTransactions,
      pagination: {
        page: responseData.data?.meta?.page || 1,
        limit: responseData.data?.meta?.pageSize || limit,
        total: responseData.data?.meta?.total || 0,
        totalPages: responseData.data?.meta?.totalPages || 0,
      },
    };
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
