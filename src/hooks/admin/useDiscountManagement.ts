import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/errorHandler";
import { Discount, Store } from "@/types/discount";

export function useDiscounts(
  adminId?: string,
  storeId?: string,
  selectedStoreId?: string,
  accessToken?: string,
) {
  return useQuery({
    queryKey: ["discounts", adminId, storeId, selectedStoreId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedStoreId) {
        params.append("storeId", selectedStoreId);
      }

      const response = await axiosInstance.get(
        `/discounts?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const result = response.data as {
        status: string;
        data: {
          data: Discount[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        };
      };
      return Array.isArray(result.data.data) ? result.data.data : [];
    },
    enabled: !!accessToken,
  });
}

export function useStoresFilter(accessToken?: string, isSuper?: boolean) {
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

export function useDeleteDiscount(
  adminId?: string,
  storeId?: string,
  selectedStoreId?: string,
  accessToken?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (discountId: string) => {
      const response = await axiosInstance.delete(`/discounts/${discountId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Discount deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["discounts", adminId, storeId, selectedStoreId],
      });
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error, "Failed to delete discount");
      toast.error(errorMessage);
    },
  });
}

export function useToggleDiscountStatus(
  adminId?: string,
  storeId?: string,
  selectedStoreId?: string,
  accessToken?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      discountId,
      isActive,
    }: {
      discountId: string;
      isActive: boolean;
    }) => {
      const response = await axiosInstance.put(
        `/discounts/${discountId}`,
        { isActive },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Discount status updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["discounts", adminId, storeId, selectedStoreId],
      });
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(
        error,
        "Failed to update discount status",
      );
      toast.error(errorMessage);
    },
  });
}
