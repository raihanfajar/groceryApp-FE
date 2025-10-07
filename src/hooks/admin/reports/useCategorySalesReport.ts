import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { CategorySalesReport, ReportFilters } from "@/types/reports";

interface BackendCategoryStats {
  category_id: string;
  category_name: string;
  transaction_count: number;
  total_quantity_sold: number;
  total_revenue: number;
  average_order_value: number;
}

interface BackendCategorySalesResponse {
  success: boolean;
  message: string;
  data: {
    period: {
      startDate: string;
      endDate: string;
      period: string;
    };
    categories: BackendCategoryStats[];
    storeFilter?: string;
  };
}

export const useCategorySalesReport = (filters: ReportFilters) => {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;

  return useQuery({
    queryKey: ["reports", "sales", "categories", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.storeId) params.append("storeId", filters.storeId);
      if (filters.month) params.append("month", filters.month.toString());
      if (filters.year) params.append("year", filters.year.toString());

      const response = await axiosInstance.get<BackendCategorySalesResponse>(
        `/reports/sales/categories?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Transform the backend response to match frontend type
      const categories: CategorySalesReport[] =
        response.data.data.categories.map((cat) => ({
          categoryId: cat.category_id,
          categoryName: cat.category_name,
          totalRevenue: Number(cat.total_revenue || 0),
          totalQuantity: Number(cat.total_quantity_sold || 0),
          orderCount: Number(cat.transaction_count || 0),
          products: [], // Backend doesn't return products per category in this endpoint
        }));

      return categories;
    },
    enabled: !!token,
  });
};
