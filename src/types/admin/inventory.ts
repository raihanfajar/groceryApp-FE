// Inventory Management Types

// Core Inventory Models
export interface Store {
  id: string;
  name: string;
  city: string;
  province: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoreProduct {
  storeId: string;
  productId: string;
  stock: number;
  minStock: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  product?: {
    id: string;
    name: string;
    picture1?: string;
    price: number;
    category?: {
      id: string;
      name: string;
    };
  };
  store?: {
    id: string;
    name: string;
    city: string;
    province: string;
  };
}

export interface StockJournalEntry {
  id: string;
  storeId: string;
  productId: string;
  adminId: string;
  transactionId?: string | null;
  type: StockMovementType;
  quantity: number;
  beforeStock: number;
  afterStock: number;
  notes?: string | null;
  createdAt: string;
  storeProduct: {
    product: {
      id: string;
      name: string;
      picture1?: string;
    };
    store: {
      id: string;
      name: string;
    };
  };
  admin: {
    id: string;
    name: string;
    email: string;
  };
  transaction?: {
    id: string;
    status: string;
  } | null;
}

// Enums and Constants
export type StockMovementType =
  | "IN"
  | "OUT"
  | "ADJUSTMENT"
  | "TRANSFER"
  | "INITIAL";

export const STOCK_MOVEMENT_TYPES: { [key in StockMovementType]: string } = {
  IN: "Stock Increase",
  OUT: "Stock Decrease",
  ADJUSTMENT: "Stock Adjustment",
  TRANSFER: "Stock Transfer",
  INITIAL: "Initial Stock",
};

export const STOCK_MOVEMENT_DESCRIPTIONS: {
  [key in StockMovementType]: string;
} = {
  IN: "Receiving new inventory from suppliers",
  OUT: "Sales, damages, or manual removals",
  ADJUSTMENT: "Setting exact stock level after physical count",
  TRANSFER: "Moving inventory between stores",
  INITIAL: "Setting up stock for new products",
};

// Request Types
export interface StockUpdateRequest {
  productId: string;
  storeId?: string; // Optional for Store Admins (auto-assigned)
  quantity: number;
  type: StockMovementType;
  notes?: string;
}

export interface BulkStockUpdateRequest {
  storeId?: string; // Optional for Store Admins
  items: Array<{
    productId: string;
    quantity: number;
    type: StockMovementType;
    notes?: string;
  }>;
}

export interface StockTransferRequest {
  fromStoreId: string;
  toStoreId: string;
  productId: string;
  quantity: number;
  notes?: string;
}

export interface MinStockUpdateRequest {
  productId: string;
  storeId?: string; // Optional for Store Admins
  minStock: number;
}

// Filter Types
export interface StockJournalFilters {
  storeId?: string;
  productId?: string;
  adminId?: string;
  type?: StockMovementType;
  dateFrom?: string; // YYYY-MM-DD format
  dateTo?: string; // YYYY-MM-DD format
  page?: number;
  limit?: number;
}

export interface InventorySummaryFilters {
  storeId?: string; // Required for Super Admin, auto-assigned for Store Admins
}

export interface LowStockFilters {
  storeId?: string; // Required for Super Admin, auto-assigned for Store Admins
}

// Summary and Report Types
export interface InventorySummary {
  totalProducts: number;
  totalStock: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  recentMovements: number;
  stockByCategory: CategoryStockSummary[];
}

export interface CategoryStockSummary {
  categoryId: string;
  categoryName: string;
  totalStock: number;
  productCount: number;
}

export interface LowStockAlert {
  storeId: string;
  productId: string;
  stock: number;
  minStock: number;
  isOutOfStock: boolean;
  alertLevel: "warning" | "critical" | "out_of_stock";
  product: {
    id: string;
    name: string;
    picture1?: string;
    price: number;
    category: {
      id: string;
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface StockTransferResult {
  fromStore: StoreProduct;
  toStore: StoreProduct;
}

// API Response Types
export interface InventoryApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface StockJournalResponse {
  status: string;
  data: {
    data: StockJournalEntry[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Form Data Types for UI Components
export interface StockUpdateFormData {
  productId: string;
  storeId?: string;
  quantity: string; // String for form input, converted to number
  type: StockMovementType;
  notes?: string;
}

export interface BulkStockUpdateFormData {
  storeId?: string;
  items: Array<{
    productId: string;
    quantity: string; // String for form input
    type: StockMovementType;
    notes?: string;
  }>;
}

export interface StockTransferFormData {
  fromStoreId: string;
  toStoreId: string;
  productId: string;
  quantity: string; // String for form input
  notes?: string;
}

// UI State Types
export interface InventoryPageFilters {
  search?: string;
  storeId?: string;
  categoryId?: string;
  alertLevel?: "all" | "warning" | "critical" | "out_of_stock";
  page?: number;
  limit?: number;
}

export interface StockManagementFilters {
  search?: string;
  storeId?: string;
  categoryId?: string;
  stockStatus?: "all" | "in_stock" | "low_stock" | "out_of_stock";
  page?: number;
  limit?: number;
}

// Store Selection for Super Admin
export interface StoreOption {
  id: string;
  name: string;
  city: string;
  province: string;
}

// Product Selection for Inventory Management
export interface ProductOption {
  id: string;
  name: string;
  price: number;
  picture1?: string;
  category: {
    id: string;
    name: string;
  };
  currentStock?: number;
  minStock?: number;
}
