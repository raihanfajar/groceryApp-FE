import { axiosInstance } from "@/utils/axiosInstance";
import {
  StockUpdateRequest,
  BulkStockUpdateRequest,
  StockTransferRequest,
  MinStockUpdateRequest,
  StockJournalFilters,
  InventorySummaryFilters,
  LowStockFilters,
  StoreProduct,
  Store,
  InventorySummary,
  LowStockAlert,
  StockTransferResult,
  InventoryApiResponse,
  StockJournalResponse,
} from "@/types/admin/inventory";

// Create axios instance with auth interceptor
const createAuthAxios = (token: string) => {
  const authInstance = axiosInstance;
  authInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return authInstance;
};

// Inventory Management APIs
export const adminInventoryAPI = {
  // Get all stores (for Super Admin store selection)
  getStores: async (token: string): Promise<InventoryApiResponse<Store[]>> => {
    const api = createAuthAxios(token);
    const response = await api.get("/admin/stores");
    return response.data as InventoryApiResponse<Store[]>;
  },

  // Update stock for a single product
  updateStock: async (
    token: string,
    requestData: StockUpdateRequest,
  ): Promise<InventoryApiResponse<StoreProduct>> => {
    const api = createAuthAxios(token);
    const response = await api.post("/inventory/stock/update", requestData);
    return response.data as InventoryApiResponse<StoreProduct>;
  },

  // Bulk update stock for multiple products
  bulkUpdateStock: async (
    token: string,
    requestData: BulkStockUpdateRequest,
  ): Promise<InventoryApiResponse<StoreProduct[]>> => {
    const api = createAuthAxios(token);
    const response = await api.post(
      "/inventory/stock/bulk-update",
      requestData,
    );
    return response.data as InventoryApiResponse<StoreProduct[]>;
  },

  // Transfer stock between stores (Super Admin only)
  transferStock: async (
    token: string,
    requestData: StockTransferRequest,
  ): Promise<InventoryApiResponse<StockTransferResult>> => {
    const api = createAuthAxios(token);
    const response = await api.post("/inventory/transfer", requestData);
    return response.data as InventoryApiResponse<StockTransferResult>;
  },

  // Set minimum stock level
  setMinStock: async (
    token: string,
    requestData: MinStockUpdateRequest,
  ): Promise<InventoryApiResponse<StoreProduct>> => {
    const api = createAuthAxios(token);
    const response = await api.put("/inventory/min-stock", requestData);
    return response.data as InventoryApiResponse<StoreProduct>;
  },

  // Get stock journal with filters
  getStockJournal: async (
    token: string,
    filters?: StockJournalFilters,
  ): Promise<StockJournalResponse> => {
    const api = createAuthAxios(token);
    const params = new URLSearchParams();

    if (filters?.storeId) params.append("storeId", filters.storeId);
    if (filters?.productId) params.append("productId", filters.productId);
    if (filters?.adminId) params.append("adminId", filters.adminId);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.categoryId) params.append("categoryId", filters.categoryId);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await api.get(`/inventory/journal?${params.toString()}`);
    return response.data as StockJournalResponse;
  },

  // Get inventory summary
  getInventorySummary: async (
    token: string,
    filters?: InventorySummaryFilters,
  ): Promise<InventoryApiResponse<InventorySummary>> => {
    const api = createAuthAxios(token);
    const params = new URLSearchParams();

    if (filters?.storeId) params.append("storeId", filters.storeId);

    const response = await api.get(`/inventory/summary?${params.toString()}`);
    return response.data as InventoryApiResponse<InventorySummary>;
  },

  // Get low stock alerts
  getLowStockAlerts: async (
    token: string,
    filters?: LowStockFilters,
  ): Promise<InventoryApiResponse<LowStockAlert[]>> => {
    const api = createAuthAxios(token);
    const params = new URLSearchParams();

    if (filters?.storeId) params.append("storeId", filters.storeId);

    const response = await api.get(`/inventory/low-stock?${params.toString()}`);
    return response.data as InventoryApiResponse<LowStockAlert[]>;
  },

  // Get category distribution
  getCategoryDistribution: async (
    token: string,
    storeId?: string,
  ): Promise<InventoryApiResponse<Array<{ name: string; value: number }>>> => {
    const api = createAuthAxios(token);
    const params = new URLSearchParams();

    if (storeId) params.append("storeId", storeId);

    const response = await api.get(
      `/inventory/category-distribution?${params.toString()}`,
    );
    return response.data as InventoryApiResponse<
      Array<{ name: string; value: number }>
    >;
  },

  // Get stock value by category
  getStockValueByCategory: async (
    token: string,
    storeId?: string,
  ): Promise<
    InventoryApiResponse<
      Array<{ category: string; totalStock: number; totalValue: number }>
    >
  > => {
    const api = createAuthAxios(token);
    const params = new URLSearchParams();

    if (storeId) params.append("storeId", storeId);

    const response = await api.get(
      `/inventory/stock-value?${params.toString()}`,
    );
    return response.data as InventoryApiResponse<
      Array<{ category: string; totalStock: number; totalValue: number }>
    >;
  },
};

export default adminInventoryAPI;
