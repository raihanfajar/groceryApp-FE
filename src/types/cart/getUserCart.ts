export type DiscountType = "MANUAL" | "MINIMUM_PURCHASE" | "BOGO" | "REGULAR";
export type DiscountValueType = "PERCENTAGE" | "NOMINAL";

// Tipe untuk 'Product'
export type Product = {
  id: string;
  name: string;
  price: number;
  picture1: string;
};

// Tipe untuk informasi diskon yang diaplikasikan
export type AppliedDiscount = {
  id: string;
  name: string;
  type: DiscountType;
  valueType: DiscountValueType;
  value: number;
  maxDiscountAmount: number | null;
};

// Tipe untuk informasi promo BOGO
export type BogoInfo = {
  buyQuantity: number;
  getQuantity: number;
  applyToSameProduct: boolean;
  maxBogoSets: number | null;
};

// Tipe untuk item di keranjang (output dari service getUserCart)
export type CartItemWithPromo = {
  id: string; // id dari CartProduct
  productId: string;
  storeId: string;
  quantity: number;
  product: Product; // Objek produk lengkap
  activePrice: number; // Harga final per item setelah diskon
  discountAmount: number; // Jumlah potongan harga per item
  appliedDiscount: AppliedDiscount | null;
  bogo: BogoInfo | null;
};

// Tipe untuk keseluruhan objek keranjang
export type Cart = {
  id: string;
  userId: string;
  items: CartItemWithPromo[];
};

// Tipe untuk payload saat update kuantitas
export type UpdateQuantityPayload = {
  storeId: string;
  productId: string;
  quantity: number;
};
