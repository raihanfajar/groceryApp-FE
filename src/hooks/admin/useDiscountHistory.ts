import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { DiscountUsageHistory } from "@/types/discount";

interface DiscountHistoryData {
  data: DiscountUsageHistory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalDiscountGiven: number;
    totalOrderValue: number;
    totalUsages: number;
    averageDiscountPerOrder: number;
  };
}

export function useDiscountHistory(
  adminId?: string,
  storeId?: string,
  accessToken?: string,
) {
  return useQuery({
    queryKey: ["discountHistory", adminId, storeId],
    queryFn: async () => {
      const response = await axiosInstance.get("/discounts/report/usage", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { limit: 100 },
      });
      const result = response.data as {
        status: string;
        data: DiscountHistoryData;
      };
      return result.data;
    },
    enabled: !!accessToken,
  });
}
