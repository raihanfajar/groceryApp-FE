export enum DiscountType {
  MANUAL = "MANUAL",
  MINIMUM_PURCHASE = "MINIMUM_PURCHASE",
  BOGO = "BOGO",
  REGULAR = "REGULAR",
}

export enum DiscountValueType {
  PERCENTAGE = "PERCENTAGE",
  NOMINAL = "NOMINAL",
}

export interface Store {
  id: string;
  name: string;
  city: string;
  province: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string;
}

export interface DiscountProduct {
  id: string;
  discountId: string;
  productId: string;
  product: Product;
}

export interface BogoDiscount {
  id: string;
  discountId: string;
  buyQuantity: number;
  getQuantity: number;
  applyToSameProduct: boolean;
  maxBogoSets?: number;
}

export interface Discount {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  type: DiscountType;
  valueType: DiscountValueType;
  value: number;
  maxDiscountAmount?: number;
  minTransactionValue?: number;
  maxUsagePerCustomer?: number;
  totalUsageLimit?: number;
  currentUsageCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  adminId: string;
  store: Store;
  products: DiscountProduct[];
  bogoConfig?: BogoDiscount;
}

export interface DiscountUsageHistory {
  id: string;
  discountId: string;
  transactionId?: string;
  userId?: string;
  adminId?: string;
  usedAt: string;
  discountValue: number;
  orderTotal: number;
  discount: {
    id: string;
    name: string;
    type: DiscountType;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
  appliedBy?: {
    id: string;
    name: string;
  };
}

export interface CreateDiscountData {
  name: string;
  description?: string;
  type: DiscountType;
  valueType: DiscountValueType;
  value: number;
  maxDiscountAmount?: number;
  minTransactionValue?: number;
  maxUsagePerCustomer?: number;
  totalUsageLimit?: number;
  startDate: string;
  endDate: string;
  productIds?: string[];
  storeId?: string; // For super admin
  // BOGO specific fields
  buyQuantity?: number;
  getQuantity?: number;
  applyToSameProduct?: boolean;
  maxBogoSets?: number;
}

export interface UpdateDiscountData {
  name?: string;
  description?: string;
  valueType?: DiscountValueType;
  value?: number;
  maxDiscountAmount?: number;
  minTransactionValue?: number;
  maxUsagePerCustomer?: number;
  totalUsageLimit?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  productIds?: string[];
  // BOGO specific fields
  buyQuantity?: number;
  getQuantity?: number;
  applyToSameProduct?: boolean;
  maxBogoSets?: number;
}

export interface ApplyDiscountData {
  discountId: string;
  orderId?: string;
  orderTotal: number;
}

export interface DiscountFilters {
  type?: DiscountType;
  isActive?: boolean;
  storeId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
