// Admin Product Management Types
export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  weight: number;
  zIndex?: number | null;
  picture1?: string;
  picture2?: string;
  picture3?: string;
  picture4?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  storeStock?: AdminStoreStock[];
  totalStock?: number;
}

export interface AdminStoreStock {
  storeId: string;
  productId: string;
  stock: number;
  minStock: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  store: {
    id: string;
    name: string;
  };
}

export interface AdminProductCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  _count?: {
    products: number;
  };
}

export interface CreateProductFormData {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  weight: number;
  picture1?: File;
  picture2?: File;
  picture3?: File;
  picture4?: File;
}

export interface UpdateProductFormData extends Partial<CreateProductFormData> {
  id: string;
  isActive?: boolean;
}

export interface CreateCategoryFormData {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateCategoryFormData
  extends Partial<CreateCategoryFormData> {
  id: string;
  isActive?: boolean;
}

export interface AdminProductsResponse {
  status: string;
  data: {
    products: AdminProduct[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface AdminCategoriesResponse {
  status: string;
  data: {
    categories: AdminProductCategory[];
  };
}

export interface AdminProductResponse {
  status: string;
  data: {
    product: AdminProduct;
  };
}

export interface AdminCategoryResponse {
  status: string;
  data: {
    category: AdminProductCategory;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  storeId?: string;
  isActive?: boolean;
}

export interface CategoryFilters {
  search?: string;
  isActive?: boolean;
}
