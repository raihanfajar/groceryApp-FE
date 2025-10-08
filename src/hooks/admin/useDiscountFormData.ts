import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Store {
  id: string;
  name: string;
  city: string;
  province: string;
}

export function useProducts(accessToken?: string) {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      try {
        if (accessToken) {
          const response = await axiosInstance.get("/products/admin/all", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const result = response.data as {
            status: string;
            data: { products: Product[] };
          };
          return Array.isArray(result.data.products)
            ? result.data.products
            : [];
        } else {
          const response = await axiosInstance.get("/products");
          const result = response.data as {
            status: string;
            data: { products: Product[] };
          };
          return Array.isArray(result.data.products)
            ? result.data.products
            : [];
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    enabled: true,
  });
}

export function useStores(accessToken?: string, isSuper?: boolean) {
  return useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const response = await axiosInstance.get("/admin/stores", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = (response.data as { data: Store[] }).data;
      return Array.isArray(data) ? data : [];
    },
    enabled: !!accessToken && !!isSuper,
  });
}
