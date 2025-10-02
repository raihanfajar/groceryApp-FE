import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import {
  MonthlyStockReport,
  ReportApiResponse,
  ReportFilters,
} from "@/types/reports";

export const useMonthlyStockReport = (filters: ReportFilters) => {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;

  return useQuery({
    queryKey: ["monthly-stock-report", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.storeId) params.append("storeId", filters.storeId);
      if (filters.month) params.append("month", filters.month.toString());
      if (filters.year) params.append("year", filters.year.toString());

      const response = await axiosInstance.get<
        ReportApiResponse<MonthlyStockReport>
      >(`/reports/stock/monthly?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    },
    enabled: !!token && !!filters.month && !!filters.year,
    refetchOnWindowFocus: false,
  });
};
