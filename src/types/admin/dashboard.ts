// Admin Dashboard Types

// ==================== SALES & REVENUE ====================

export interface DailySales {
  date: string; // YYYY-MM-DD format
  transactionCount: number;
  totalSales: number;
}

export interface MonthlySalesSummary {
  totalSales: number;
  totalTransactions: number;
  averageOrderValue: number;
  period: string; // e.g., "October 2024"
}

export interface TopSellingProduct {
  productId: string;
  productName: string;
  categoryName: string;
  picture?: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface SalesReport {
  period: {
    startDate: string;
    endDate: string;
    period: string;
  };
  summary: MonthlySalesSummary;
  dailySales: DailySales[];
  topProducts: TopSellingProduct[];
}

// ==================== TRANSACTIONS ====================

export interface RecentTransaction {
  id: string;
  transactionNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userProfilePicture: string | null;
  storeId: string;
  storeName: string;
  totalPrice: number;
  discountedProductPrice?: number;
  discountedShipping?: number;
  status: TransactionStatus;
  createdAt: string;
  products: TransactionProductDetail[];
}

export interface TransactionProductDetail {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount?: number;
  finalPrice?: number;
  picture?: string;
}

export type TransactionStatus =
  | "pending"
  | "waiting_payment"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  pending: "Pending",
  waiting_payment: "Waiting Payment",
  processing: "Processing",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const TRANSACTION_STATUS_COLORS: Record<TransactionStatus, string> = {
  pending: "bg-gray-100 text-gray-800",
  waiting_payment: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

// ==================== DASHBOARD STATS ====================

export interface DashboardStats {
  dailySales: number;
  monthlySales: number;
  monthlyTransactions: number;
  totalProducts: number;
  totalActiveProducts?: number;
}

export interface StockSummary {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalStockValue: number;
}

export interface DashboardReport {
  sales: SalesReport;
  stock: {
    period: {
      month: number;
      year: number;
    };
    summary: StockSummary;
    lowStockAlerts: LowStockAlert[];
  };
}

export interface LowStockAlert {
  productId: string;
  productName: string;
  categoryName: string;
  picture?: string;
  storeId: string;
  storeName: string;
  currentStock: number;
  minStock: number;
  isOutOfStock: boolean;
}

// ==================== API REQUEST/RESPONSE ====================

export interface DashboardFilters {
  storeId?: string;
  month?: number;
  year?: number;
}

export interface DashboardApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TransactionsResponse {
  transactions: RecentTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== CHART DATA ====================

export interface SalesChartData {
  labels: string[]; // Array of dates or labels
  data: number[]; // Array of sales values
  tooltips?: string[]; // Optional formatted tooltips
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}
