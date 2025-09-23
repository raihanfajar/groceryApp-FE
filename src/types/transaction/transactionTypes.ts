export type Transaction = {
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

  // relasi
  productsTransaction?: TransactionProduct[];
};

export type TransactionProduct = {
  id: string;
  transactionId: string;
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  finalPrice: number;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  deletedAt?: string | null; // ISO Date string
  productDetails: Product;
};

export type Product = {
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
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  deletedAt?: string | null; // ISO Date string
  categoryId: string;
  isActive: boolean;
  weight: number;
};
