import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { ProductStockReport, ReportApiResponse } from "@/types/reports";

interface UseProductStockReportParams {
  productId: string;
  storeId?: string;
}

export const useProductStockReport = ({
  productId,
  storeId,
}: UseProductStockReportParams) => {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;

  return useQuery({
    queryKey: ["product-stock-report", productId, storeId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (storeId) params.append("storeId", storeId);

      const response = await axiosInstance.get<
        ReportApiResponse<ProductStockReport>
      >(`/reports/stock/product/${productId}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    },
    enabled: !!token && !!productId,
    refetchOnWindowFocus: false,
  });
};
