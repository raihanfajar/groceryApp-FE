import { baseError } from "@/components/userAuth/typesAndInterfaces";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { ApiResponse } from "@/types/apiResponse";
import {
  PaginatedTransactionsFinal,
  QueryParams,
} from "@/types/transaction/FinalTypes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@tiptap/pm/state";
import { toast } from "react-toastify";

// ------------------ GET: Store (Admin) Transactions ------------------
export function useStoreTransactionsQuery(params?: QueryParams) {
  const { accessToken } = useUserAuthStore();
  const queryKey = ["storeTransactions", params];

  return useQuery<PaginatedTransactionsFinal | null>({
    queryKey,
    queryFn: async () => {
      if (!accessToken) return null;

      const validParams = Object.fromEntries(
        Object.entries(params ?? {}).filter(([, value]) => value),
      );
      const qs = new URLSearchParams(
        validParams as Record<string, string>,
      ).toString();
      const url = `/transaction/admin?${qs}`;

      const response = await axiosInstance.get<
        ApiResponse<PaginatedTransactionsFinal>
      >(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.data ?? null;
    },
  });
}

// ------------------ GET: User Transaction Detail (Admin) ------------------
export function useUserTransactionDetailAdminQuery(
  transactionId?: string | null,
) {
  const { accessToken } = useUserAuthStore();
  const queryKey = ["adminTransactionDetail", transactionId];

  return useQuery<Transaction | null>({
    queryKey,
    queryFn: async () => {
      if (!accessToken) return null;
      if (!transactionId) return null;

      const url = `/transaction/admin-detail?transactionId=${encodeURIComponent(transactionId)}`;
      const response = await axiosInstance.get<
        ApiResponse<{ transaction: Transaction }>
      >(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.data?.transaction ?? null;
    },
    enabled: Boolean(accessToken && transactionId),
  });
}

// ------------------ PUT: Confirming Order (Admin) ------------------
export function useAdminConfirmOrderMutation(transactionId?: string) {
  const { accessToken } = useUserAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!transactionId) throw new Error("Transaction ID is missing");
      if (!accessToken) throw new Error("Access token is missing");

      const url = `/transaction/admin/confirm?transaction=${encodeURIComponent(transactionId)}`;
      const response = await axiosInstance.put<
        ApiResponse<{ transaction: Transaction }>
      >(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Order confirmed");
      queryClient.invalidateQueries({
        queryKey: ["adminTransactionDetail", transactionId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["storeTransactions"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["userTransactions"],
        exact: false,
      });
    },
    onError: (err: unknown) => {
      const customError = err as baseError;
      const errorMessage =
        customError?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
  });
}

// ------------------ PUT: Cancel Order Payment (Admin) ------------------
export function useAdminCancelOrderPaymentMutation(transactionId?: string) {
  const { accessToken } = useUserAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!transactionId) throw new Error("Transaction ID is missing");
      if (!accessToken) throw new Error("Access token is missing");

      const url = `/transaction/admin/cancel-payment?transaction=${encodeURIComponent(transactionId)}`;
      const response = await axiosInstance.put<
        ApiResponse<{ transaction: Transaction }>
      >(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Payment canceled");
      queryClient.invalidateQueries({
        queryKey: ["adminTransactionDetail", transactionId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["storeTransactions"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["userTransactions"],
        exact: false,
      });
    },
    onError: (err: unknown) => {
      const customError = err as baseError;
      const errorMessage =
        customError?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
  });
}

// ------------------ PUT: Shipping / Shipped Transaction (Admin) ------------------
export function useAdminShipTransactionMutation(transactionId?: string) {
  const { accessToken } = useUserAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!transactionId) throw new Error("Transaction ID is missing");
      if (!accessToken) throw new Error("Access token is missing");

      const url = `/transaction/admin/shipping?transaction=${encodeURIComponent(transactionId)}`;
      const response = await axiosInstance.put<
        ApiResponse<{ transaction: Transaction }>
      >(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Transaction marked as shipped");
      queryClient.invalidateQueries({
        queryKey: ["adminTransactionDetail", transactionId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["storeTransactions"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["userTransactions"],
        exact: false,
      });
    },
    onError: (err: unknown) => {
      const customError = err as baseError;
      const errorMessage =
        customError?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
  });
}

// ------------------ PUT: Cancel Store Transaction (Admin) ------------------
export function useAdminCancelStoreTransactionMutation(transactionId?: string) {
  const { accessToken } = useUserAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!transactionId) throw new Error("Transaction ID is missing");
      if (!accessToken) throw new Error("Access token is missing");

      const url = `/transaction/admin/cancel?transaction=${encodeURIComponent(transactionId)}`;
      const response = await axiosInstance.put<
        ApiResponse<{ transaction: Transaction }>
      >(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Store transaction canceled");
      queryClient.invalidateQueries({
        queryKey: ["adminTransactionDetail", transactionId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["storeTransactions"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["userTransactions"],
        exact: false,
      });
    },
    onError: (err: unknown) => {
      const customError = err as baseError;
      const errorMessage =
        customError?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
  });
}
