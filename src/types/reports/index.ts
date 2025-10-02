// Report filter types
export interface ReportFilters {
  storeId?: string;
  month?: number;
  year?: number;
  productId?: string;
  startDate?: string;
  endDate?: string;
}

// Monthly Sales Report
export interface MonthlySalesReport {
  month: number;
  year: number;
  storeId?: string;
  storeName?: string;
  totalRevenue: number;
  totalOrders: number;
  totalItems: number;
  averageOrderValue: number;
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
  dailySales: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

// Sales by Category
export interface CategorySalesReport {
  categoryId: string;
  categoryName: string;
  totalRevenue: number;
  totalQuantity: number;
  orderCount: number;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
}

// Sales by Products
export interface ProductSalesReport {
  productId: string;
  productName: string;
  categoryName: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
  averagePrice: number;
  monthlySales: Array<{
    month: number;
    year: number;
    quantity: number;
    revenue: number;
  }>;
}

// Stock Report
export interface MonthlyStockReport {
  month: number;
  year: number;
  storeId?: string;
  storeName?: string;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  stockValue: number;
  stockMovements: Array<{
    type: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    count: number;
  }>;
  topRestockedProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
  }>;
}

// Product Stock Report
export interface ProductStockReport {
  productId: string;
  productName: string;
  currentStock: number;
  storeId?: string;
  storeName?: string;
  stockJournal: Array<{
    id: string;
    type: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    notes?: string;
    createdAt: string;
    admin?: {
      name: string;
    };
  }>;
  stockTrend: Array<{
    date: string;
    stock: number;
  }>;
}

// Stock Trends
export interface StockTrendsReport {
  productId: string;
  productName: string;
  trends: Array<{
    month: number;
    year: number;
    averageStock: number;
    totalIn: number;
    totalOut: number;
    endingStock: number;
  }>;
}

// Dashboard Report
export interface DashboardReport {
  sales: {
    period: {
      month: number;
      year: number;
      startDate: string;
      endDate: string;
    };
    summary: {
      totalSales: number;
      totalTransactions: number;
      averageOrderValue: number;
    };
    topProducts: Array<{
      productId: string;
      productName: string;
      categoryName: string;
      totalQuantitySold: number;
      totalRevenue: number;
    }>;
  };
  stock: {
    period: {
      month: number;
      year: number;
      startDate: string;
      endDate: string;
    };
    summary: {
      totalProducts: number;
      lowStockCount: number;
      outOfStockCount: number;
      totalStockValue: number;
    };
    lowStockAlerts: Array<{
      productId: string;
      productName: string;
      currentStock: number;
      minStock: number;
      status: "LOW" | "OUT";
    }>;
    movementsByType: Array<{
      type: "IN" | "OUT" | "ADJUSTMENT";
      totalQuantity: number;
      transactionCount: number;
    }>;
  };
}

// API Response wrapper
export interface ReportApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
