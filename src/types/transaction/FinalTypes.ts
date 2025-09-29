export type PaginatedTransactionsFinal = {
  data: TransactionFinal[];
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
  };
};

export type ProductFinal = {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  zIndex?: number | null;
  picture1: string;
  picture2?: string | null;
  picture3?: string | null;
  picture4?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  categoryId: string;
  isActive: boolean;
  weight: number;
};

export type TransactionProductFinal = {
  id: string;
  transactionId: string;
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  finalPrice: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  product: ProductFinal; 
};

export type TransactionFinal = {
  id: string;
  userId: string;
  storeId: string;
  status: "waiting_payment" | "paid" | "shipped" | "completed" | "cancelled"; // sesuaikan dengan enum OrderStatus
  totalProductPrice: number;
  discountedProductPrice: number;
  finalProductPrice: number;
  shippingPrice: number;
  discountedShipping?: number | null;
  finalShippingPrice: number;
  totalPrice: number;
  address: string;
  receiverName: string;
  phoneNumber: string;
  provinceId: number;
  province: string;
  cityId: number;
  city: string;
  districtId: number;
  district: string;
  addressLabel: string;
  codeVoucherProduct?: string | null;
  codeVoucherDelivery?: string | null;
  paymentProof?: string | null;
  paymentMethod?: string | null; // contoh: "gopay" | "bca_va" | "manual_transfer"
  snapToken?: string | null;
  snapRedirectUrl?: string | null;
  paidAt?: string | null; // ISO Date string
  expiryAt?: string | null; // ISO Date string
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  deletedAt?: string | null; // ISO Date string
  products?: TransactionProductFinal[];
};

export type QueryParams = {
  page?: number;
  pageSize?: number;
  status?: string;
  orderId?: string;
  startDate?: string;
  endDate?: string;
};