// Product API Response Types
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface ProductStore {
  id: string;
  name: string;
  city: string;
  province: string;
}

export interface ProductStock {
  productId: string;
  storeId: string;
  stock: number;
  store: ProductStore;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  categoryId: string;
  price: number;
  weight?: number;
  picture1: string;
  picture2?: string;
  picture3?: string;
  picture4?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory;
  totalStock: number;
  storeStock?: ProductStock[];
}

export interface ProductsResponse {
  status: string;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ProductResponse {
  status: string;
  data: {
    product: Product;
  };
}

export interface CategoriesResponse {
  status: string;
  data: {
    categories: ProductCategory[];
  };
}

// Search and Filter Types
export interface ProductFilters {
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  storeId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface PriceRange {
  min: number;
  max: number;
}

// Component Props
export interface ProductCatalogProps {
  initialFilters?: ProductFilters;
}

export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  categories: ProductCategory[];
  priceRange: PriceRange;
  loading?: boolean;
}

export interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  placeholder?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

// Sort Options
export interface SortOption {
  label: string;
  value: string;
  sortBy: "name" | "price" | "createdAt";
  sortOrder: "asc" | "desc";
}

export const SORT_OPTIONS: SortOption[] = [
  { label: "Name (A-Z)", value: "name_asc", sortBy: "name", sortOrder: "asc" },
  {
    label: "Name (Z-A)",
    value: "name_desc",
    sortBy: "name",
    sortOrder: "desc",
  },
  {
    label: "Price (Low to High)",
    value: "price_asc",
    sortBy: "price",
    sortOrder: "asc",
  },
  {
    label: "Price (High to Low)",
    value: "price_desc",
    sortBy: "price",
    sortOrder: "desc",
  },
  {
    label: "Newest First",
    value: "newest",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  {
    label: "Oldest First",
    value: "oldest",
    sortBy: "createdAt",
    sortOrder: "asc",
  },
];

// API Error Types
export interface ApiError {
  response: {
    status: number;
    data: {
      status: string;
      message: string;
    };
  };
}
