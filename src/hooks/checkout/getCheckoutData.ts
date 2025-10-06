import { baseError } from "@/components/userAuth/typesAndInterfaces";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { ApiResponse } from "@/types/apiResponse";
import { Cart } from "@/types/cart/getUserCart";
import {
  CreateTransactionInput,
  TransactionResponse,
  UserAddressInterface,
} from "@/types/checkout/checkoutTypes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const USER_ADDRESSES_QUERY_KEY = ["userAddresses"];

// Get User Address
export function useUserAddressesQuery() {
  const { accessToken } = useUserAuthStore();

  return useQuery<UserAddressInterface[]>({
    queryKey: ["userAddresses", "userAddressList", accessToken, ...USER_ADDRESSES_QUERY_KEY],
    queryFn: async () => {
      if (!accessToken) return [];

      const response = await axiosInstance.get<
        ApiResponse<{
          address: UserAddressInterface | UserAddressInterface[] | null;
        }>
      >("/transaction/address", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const raw = response.data?.data?.address ?? null;

      if (!raw) return [];
      if (Array.isArray(raw)) return raw;
      return [raw];
    },
    enabled: !!accessToken,
  });
}

// Get User Cart
export function useUserCartQuery() {
  const { accessToken } = useUserAuthStore();
  return useQuery({
    queryKey: ["userCart", accessToken],
    queryFn: async () => {
      if (!accessToken) return null;
      const response = await axiosInstance.get<
        ApiResponse<{ cart: Cart | null }>
      >("/cart/user", { headers: { Authorization: `Bearer ${accessToken}` } });
      return response.data.data.cart ?? null;
    },
    enabled: !!accessToken,
  });
}

// Get shipping price
export function useShippingPriceQuery(
  userAddressId: string | null,
  storeId: string | null,
) {
  const { accessToken } = useUserAuthStore();
  return useQuery({
    queryKey: ["shippingPrice", userAddressId, storeId],
    queryFn: async () => {
      if (!userAddressId || !storeId || !accessToken) return null;
      const response = await axiosInstance.get<
        ApiResponse<{ shippingPrice: { price: number | null } | null }>
      >("/transaction/shipping", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { userAddressId, storeId },
      });
      const shippingCost = response.data.data.shippingPrice?.price;

      return shippingCost ?? null;
    },
    enabled: !!userAddressId && !!storeId && !!accessToken,
  });
}

// Create user Transaction
export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();
  const { accessToken } = useUserAuthStore();

  return useMutation<TransactionResponse, baseError, CreateTransactionInput>({
    mutationFn: async (input: CreateTransactionInput) => {
      if (!accessToken) {
        throw new Error("Access token is not available.");
      }
      console.log("create masuk", input);
      try {
        const response = await axiosInstance.post<TransactionResponse>(
          "/transaction/create",
          input,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        return response.data;
      } catch (error: unknown) {
        const customError = error as baseError;

        const errorMessage =
          customError.response?.data?.message ||
          "An unexpected error occurred.";

        throw new Error(errorMessage);
      }
    },
    onSuccess: (response) => {
      toast.success("Transaction created successfully!");
      queryClient.invalidateQueries({ queryKey: ["userCart"] });

      const paymentDetails = response.data.paymentDetails;
      if (paymentDetails && paymentDetails.token) {
        window.snap?.pay(paymentDetails.token);
      }
    },
    onError: (err: baseError) => {
      const errorMessage =
        err?.response?.data?.message || "Something went wrong";

      toast.error(errorMessage);
    },
  });
}
