export type CartResponse = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  items: CartProductResponse[];
};

export type CartProductResponse = {
  id: string;
  cartId: string;
  productId: string;
  storeId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  product: ProductResponse;
};

export type PromoProductResponse = {
  id: string;
  storeId: string;
  productId: string;
  discountPercentage: number;
  discountNominal: number;
  picture?: string | null;
  startDate: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type ProductResponse = {
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
  weight?: number | null;

  promos: PromoProductResponse[];
};
