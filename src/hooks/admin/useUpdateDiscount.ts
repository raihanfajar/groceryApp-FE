import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosInstance } from "@/utils/axiosInstance";
import { handleApiError } from "@/utils/errorHandler";
import { UpdateDiscountData } from "@/types/discount";

export function useUpdateDiscount(
  discountId: string,
  adminId?: string,
  storeId?: string,
  accessToken?: string,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateDiscountData) => {
      const response = await axiosInstance.put(
        `/discounts/${discountId}`,
        data,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Discount updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["discounts", adminId, storeId],
      });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error, "Failed to update discount");
      toast.error(errorMessage);
    },
  });
}
