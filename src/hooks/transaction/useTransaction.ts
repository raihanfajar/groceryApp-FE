import { baseError } from "@/components/userAuth/typesAndInterfaces";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { ApiResponse } from "@/types/apiResponse";
import {
  PaginatedTransactionsFinal,
  QueryParams,
} from "@/types/transaction/FinalTypes";
import { Transaction } from "@/types/transaction/transactionTypes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface UploadProofVariables {
  transactionId: string;
  file: File;
}

interface UploadProofResponse {
  message: string;
  data: {
    paymentProof: Transaction;
  };
}

export const USER_TRANSACTION_KEY = ["userTransactions"];

// Get Transaction Details
export function useTransactionDetailsQuery(transactionId: string) {
  const { accessToken } = useUserAuthStore();
  return useQuery({
    queryKey: [...USER_TRANSACTION_KEY, "detail", transactionId],
    queryFn: async () => {
      if (!transactionId) return null;
      const response = await axiosInstance.get<
        ApiResponse<{ transaction: Transaction }>
      >(`/transaction/user-detail?transactionId=${transactionId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.data.transaction;
    },
    enabled: !!transactionId,
  });
}

// Complete User Transaction
export function useCompleteTransaction(transactionId: string) {
  const { accessToken } = useUserAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.put<
        ApiResponse<{ transaction: Transaction }>
      >(
        `/transaction/complete/?transactionId=${transactionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Transaction completed");
      queryClient.invalidateQueries({
        queryKey: [
          ...USER_TRANSACTION_KEY,
          "transactionDetails",
          transactionId,
        ],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["userTransactions"],
      });
    },
    onError: (err: unknown) => {
      const customError = err as baseError;
      const errorMessage =
        customError.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
  });
}

// Cancel Transaction
export function useCancelTransaction(transactionId?: string) {
  const { accessToken } = useUserAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!transactionId) throw new Error("Transaction ID is missing");
      if (!accessToken) throw new Error("Access token is missing");

      const response = await axiosInstance.put<
        ApiResponse<{ transaction: Transaction }>
      >(
        `/transaction/cancel/?transactionId=${transactionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Transaction canceled");
      queryClient.invalidateQueries({
        queryKey: [
          ...USER_TRANSACTION_KEY,
          "transactionDetails",
          transactionId,
        ],
        exact: true,
      });
    },
    onError: (err: unknown) => {
      const customError = err as baseError;
      const errorMessage =
        customError.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
  });
}

// Upload Proof of Payment
export function useUploadProofOfPayment() {
  const { accessToken } = useUserAuthStore();
  const queryClient = useQueryClient();

  return useMutation<UploadProofResponse, baseError, UploadProofVariables>({
    mutationFn: async ({ transactionId, file }) => {
      if (!accessToken) {
        throw new Error("Access token is not available.");
      }
      if (!transactionId || !file) {
        throw new Error("Missing required parameters: transactionId and file.");
      }

      const formData = new FormData();
      formData.append("paymentProof", file);

      const response = await axiosInstance.post(
        `/transaction/upload-proof?transactionId=${transactionId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data as UploadProofResponse;
    },

    onSuccess: (response) => {
      toast.success("Proof of payment uploaded successfully!");
      queryClient.invalidateQueries({
        queryKey: [
          ...USER_TRANSACTION_KEY,
          "transactionDetails",
          response.data.paymentProof.id,
        ],
      });
    },
    onError: (err: unknown) => {
      const customError = err as baseError;
      const errorMessage =
        customError.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
  });
}

// Get User Transaction List
export function useUserTransactionsQuery(params?: QueryParams) {
  const { accessToken } = useUserAuthStore();
  const queryKey = [...USER_TRANSACTION_KEY, "userTransactions", params];

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
      const url = `/transaction/user?${qs}`;

      const response = await axiosInstance.get<
        ApiResponse<PaginatedTransactionsFinal>
      >(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.data ?? null;
    },
  });
}
