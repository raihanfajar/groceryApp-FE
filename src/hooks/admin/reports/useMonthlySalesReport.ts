import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import {
  MonthlySalesReport,
  ReportApiResponse,
  ReportFilters,
} from "@/types/reports";

export const useMonthlySalesReport = (filters: ReportFilters) => {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;

  return useQuery({
    queryKey: ["reports", "sales", "monthly", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.storeId) params.append("storeId", filters.storeId);
      if (filters.month) params.append("month", filters.month.toString());
      if (filters.year) params.append("year", filters.year.toString());

      const response = await axiosInstance.get<
        ReportApiResponse<MonthlySalesReport>
      >(`/reports/sales/monthly?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    },
    enabled: !!token,
  });
};
