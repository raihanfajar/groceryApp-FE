import { axiosInstance } from "@/utils/axiosInstance";
import {
  AdminProductsResponse,
  AdminProductResponse,
  AdminCategoriesResponse,
  AdminCategoryResponse,
  CreateProductFormData,
  UpdateProductFormData,
  CreateCategoryFormData,
  UpdateCategoryFormData,
  ProductFilters,
  CategoryFilters,
} from "@/types/admin/product";

// Create axios instance with auth interceptor
const createAuthAxios = (token: string) => {
  const authInstance = axiosInstance;
  authInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return authInstance;
};

// Product APIs
export const adminProductAPI = {
  // Get all products with filters
  getProducts: async (
    token: string,
    filters?: ProductFilters,
  ): Promise<AdminProductsResponse> => {
    const api = createAuthAxios(token);
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.categoryId) params.append("categoryId", filters.categoryId);
    if (filters?.storeId) params.append("storeId", filters.storeId);
    if (filters?.isActive !== undefined)
      params.append("isActive", filters.isActive.toString());

    const response = await api.get(`/products/admin/all?${params.toString()}`);
    return response.data as AdminProductsResponse;
  },

  // Get single product
  getProduct: async (
    token: string,
    id: string,
  ): Promise<AdminProductResponse> => {
    const api = createAuthAxios(token);
    const response = await api.get(`/products/${id}`);
    return response.data as AdminProductResponse;
  },

  // Create product with image upload
  createProduct: async (
    token: string,
    formData: CreateProductFormData,
  ): Promise<AdminProductResponse> => {
    const api = createAuthAxios(token);

    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    uploadData.append("description", formData.description);
    uploadData.append("categoryId", formData.categoryId);
    uploadData.append("price", formData.price.toString());
    uploadData.append("weight", formData.weight.toString());

    if (formData.picture1) uploadData.append("picture1", formData.picture1);
    if (formData.picture2) uploadData.append("picture2", formData.picture2);
    if (formData.picture3) uploadData.append("picture3", formData.picture3);
    if (formData.picture4) uploadData.append("picture4", formData.picture4);

    const response = await api.post("/products/admin", uploadData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data as AdminProductResponse;
  },

  // Update product
  updateProduct: async (
    token: string,
    id: string,
    formData: Partial<UpdateProductFormData>,
  ): Promise<AdminProductResponse> => {
    const api = createAuthAxios(token);

    const uploadData = new FormData();

    if (formData.name) uploadData.append("name", formData.name);
    if (formData.description)
      uploadData.append("description", formData.description);
    if (formData.categoryId)
      uploadData.append("categoryId", formData.categoryId);
    if (formData.price) uploadData.append("price", formData.price.toString());
    if (formData.weight)
      uploadData.append("weight", formData.weight.toString());
    if (formData.isActive !== undefined)
      uploadData.append("isActive", formData.isActive.toString());

    if (formData.picture1) uploadData.append("picture1", formData.picture1);
    if (formData.picture2) uploadData.append("picture2", formData.picture2);
    if (formData.picture3) uploadData.append("picture3", formData.picture3);
    if (formData.picture4) uploadData.append("picture4", formData.picture4);

    const response = await api.put(`/products/admin/${id}`, uploadData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data as AdminProductResponse;
  },

  // Delete product
  deleteProduct: async (
    token: string,
    id: string,
  ): Promise<{ status: string; message: string }> => {
    const api = createAuthAxios(token);
    const response = await api.delete(`/products/admin/${id}`);
    return response.data as { status: string; message: string };
  },
};

// Category APIs
export const adminCategoryAPI = {
  // Get all categories
  getCategories: async (
    token: string,
    filters?: CategoryFilters,
  ): Promise<AdminCategoriesResponse> => {
    const api = createAuthAxios(token);
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.isActive !== undefined)
      params.append("isActive", filters.isActive.toString());

    const response = await api.get(
      `/categories/admin/all?${params.toString()}`,
    );
    return response.data as AdminCategoriesResponse;
  },

  // Get single category
  getCategory: async (
    token: string,
    id: string,
  ): Promise<AdminCategoryResponse> => {
    const api = createAuthAxios(token);
    const response = await api.get(`/categories/${id}`);
    return response.data as AdminCategoryResponse;
  },

  // Create category
  createCategory: async (
    token: string,
    formData: CreateCategoryFormData,
  ): Promise<AdminCategoryResponse> => {
    const api = createAuthAxios(token);
    const response = await api.post("/categories/admin", formData);
    return response.data as AdminCategoryResponse;
  },

  // Update category
  updateCategory: async (
    token: string,
    id: string,
    formData: Partial<UpdateCategoryFormData>,
  ): Promise<AdminCategoryResponse> => {
    const api = createAuthAxios(token);
    const response = await api.put(`/categories/admin/${id}`, formData);
    return response.data as AdminCategoryResponse;
  },

  // Delete category
  deleteCategory: async (
    token: string,
    id: string,
  ): Promise<{ status: string; message: string }> => {
    const api = createAuthAxios(token);
    const response = await api.delete(`/categories/admin/${id}`);
    return response.data as { status: string; message: string };
  },
};
