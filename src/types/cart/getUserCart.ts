export type DiscountType = "MANUAL" | "MINIMUM_PURCHASE" | "BOGO" | "AUTOMATIC";
export type DiscountValueType = "PERCENTAGE" | "NOMINAL";

export type Product = {
  id: string;
  name: string;
  price: number;
  picture1: string;
};

export type AppliedDiscount = {
  id: string;
  name: string;
  type: DiscountType;
  valueType: DiscountValueType;
  value: number;
  maxDiscountAmount: number | null;
};

export type BogoInfo = {
  buyQuantity: number;
  getQuantity: number;
  applyToSameProduct: boolean;
  maxBogoSets: number | null;
};

export type Availability = {
  status: "AVAILABLE" | "OUT_OF_STOCK";
  currentStock: number;
};

export type CartItemWithPromo = {
  id: string; 
  productId: string;
  storeId: string;
  quantity: number;
  product: Product; 
  activePrice: number; 
  discountAmount: number; 
  appliedDiscount: AppliedDiscount | null;
  bogo: BogoInfo | null;
  availability: Availability; 
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItemWithPromo[];
};

export type UpdateQuantityPayload = {
  storeId: string;
  productId: string;
  quantity: number;
};