import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { StockTrendsReport, ReportApiResponse } from "@/types/reports";

interface UseStockTrendsReportParams {
  productId: string;
  storeId?: string;
  startMonth?: number;
  startYear?: number;
  endMonth?: number;
  endYear?: number;
}

export const useStockTrendsReport = (params: UseStockTrendsReportParams) => {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;

  return useQuery({
    queryKey: ["stock-trends-report", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("productId", params.productId);
      if (params.storeId) searchParams.append("storeId", params.storeId);
      if (params.startMonth)
        searchParams.append("startMonth", params.startMonth.toString());
      if (params.startYear)
        searchParams.append("startYear", params.startYear.toString());
      if (params.endMonth)
        searchParams.append("endMonth", params.endMonth.toString());
      if (params.endYear)
        searchParams.append("endYear", params.endYear.toString());

      const response = await axiosInstance.get<
        ReportApiResponse<StockTrendsReport>
      >(`/reports/stock/trends?${searchParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    },
    enabled: !!token && !!params.productId,
    refetchOnWindowFocus: false,
  });
};
