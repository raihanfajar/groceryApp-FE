import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  ProductsResponse,
  CategoriesResponse,
  ProductResponse,
  ProductFilters,
} from "@/types/product/productTypes";

// Query Keys
export const PRODUCT_QUERY_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, "list"] as const,
  list: (filters: ProductFilters) =>
    [...PRODUCT_QUERY_KEYS.lists(), filters] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PRODUCT_QUERY_KEYS.details(), id] as const,
  categories: ["categories"] as const,
  search: (query: string) =>
    [...PRODUCT_QUERY_KEYS.all, "search", query] as const,
};

// Build query string from filters
const buildQueryString = (filters: ProductFilters): string => {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.categoryId) params.append("categoryId", filters.categoryId);
  if (filters.categorySlug) params.append("categorySlug", filters.categorySlug);
  if (filters.storeId) params.append("storeId", filters.storeId);
  if (filters.minPrice !== undefined)
    params.append("minPrice", filters.minPrice.toString());
  if (filters.maxPrice !== undefined)
    params.append("maxPrice", filters.maxPrice.toString());
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());

  return params.toString();
};

// Hook to fetch products with filters and pagination
export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(filters),
    queryFn: async (): Promise<ProductsResponse> => {
      const queryString = buildQueryString(filters);
      const { data } = await axiosInstance.get<ProductsResponse>(
        `/products${queryString ? `?${queryString}` : ""}`,
      );
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Hook for infinite scroll products
export const useInfiniteProducts = (
  filters: Omit<ProductFilters, "page"> = {},
) => {
  return useInfiniteQuery({
    queryKey: [...PRODUCT_QUERY_KEYS.lists(), "infinite", filters],
    queryFn: async ({ pageParam }): Promise<ProductsResponse> => {
      const queryString = buildQueryString({
        ...filters,
        page: pageParam as number,
      });
      const { data } = await axiosInstance.get<ProductsResponse>(
        `/products${queryString ? `?${queryString}` : ""}`,
      );
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: ProductsResponse) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Hook to fetch product categories
export const useCategories = () => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.categories,
    queryFn: async (): Promise<CategoriesResponse> => {
      const { data } =
        await axiosInstance.get<CategoriesResponse>("/categories");
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
    retry: 2,
  });
};

// Hook to fetch a single product by ID
export const useProduct = (productId: string | null) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(productId || ""),
    queryFn: async (): Promise<ProductResponse> => {
      if (!productId) throw new Error("Product ID is required");
      const { data } = await axiosInstance.get<ProductResponse>(
        `/products/${productId}`,
      );
      return data;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Hook to fetch a single product by slug
export const useProductBySlug = (slug: string | null) => {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEYS.details(), "slug", slug || ""],
    queryFn: async (): Promise<ProductResponse> => {
      if (!slug) throw new Error("Product slug is required");
      const { data } = await axiosInstance.get<ProductResponse>(
        `/products/slug/${slug}`,
      );
      return data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Hook for product search with debouncing
export const useProductSearch = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.search(query),
    queryFn: async (): Promise<ProductsResponse> => {
      const { data } = await axiosInstance.get<ProductsResponse>(
        `/products?search=${encodeURIComponent(query)}&limit=10`,
      );
      return data;
    },
    enabled: enabled && query.length >= 2, // Only search if query is at least 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    retry: 1,
  });
};
