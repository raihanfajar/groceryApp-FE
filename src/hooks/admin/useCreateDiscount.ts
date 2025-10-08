import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosInstance } from "@/utils/axiosInstance";
import { handleApiError } from "@/utils/errorHandler";
import { CreateDiscountData } from "@/types/discount";

export function useCreateDiscount(
  adminId?: string,
  storeId?: string,
  accessToken?: string,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDiscountData) => {
      const response = await axiosInstance.post("/discounts", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Discount created successfully");
      queryClient.invalidateQueries({
        queryKey: ["discounts", adminId, storeId],
      });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error, "Failed to create discount");
      toast.error(errorMessage);
    },
  });
}
