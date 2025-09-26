import { baseError } from "@/components/userAuth/typesAndInterfaces";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { ApiResponse } from "@/types/apiResponse";
import {
  PaginatedTransactions,
  Transaction,
} from "@/types/transaction/transactionTypes";
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

// Get Transaction Details
export function useTransactionDetailsQuery(transactionId: string) {
  const { accessToken } = useUserAuthStore();
  return useQuery({
    queryKey: ["transactionDetails", transactionId],
    queryFn: async () => {
      if (!transactionId) return null;
      const response = await axiosInstance.get<
        ApiResponse<{ transaction: Transaction }>
      >(`/transaction/user-detail/?transactionId=${transactionId}`, {
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
  return useQuery({
    queryKey: ["completeTransaction", transactionId],
    queryFn: async () => {
      if (!transactionId) return null;
      const response = await axiosInstance.put<
        ApiResponse<{ transaction: Transaction }>
      >(
        `/transaction/complete/?transactionId=${transactionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data.data.transaction;
    },
    enabled: !!transactionId,
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
        queryKey: ["transactionDetails", transactionId],
        exact: true,
      });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || err?.message || "Cancel failed";
      toast.error(msg);
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
        `/transactions/upload-proof?transactionId=${transactionId}`,
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
        queryKey: ["transactionDetails", response.data.paymentProof.id],
      });
    },
    onError: (err: baseError) => {
      const errorMessage =
        (err as any)?.response?.data?.message ||
        (err as any)?.message ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  });
}

// Get User Transaction List
export function useUserTransactionsQuery(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  orderId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const { accessToken } = useUserAuthStore();
  const queryKey = ["userTransactions", params ?? {}];

  return useQuery<
    PaginatedTransactions | null,
    unknown,
    PaginatedTransactions | null
  >({
    queryKey,
    queryFn: async () => {
      if (!accessToken) return null;

      const qs = new URLSearchParams();
      if (params?.page) qs.set("page", String(params.page));
      if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
      if (params?.status) qs.set("status", params.status ?? "");
      if (params?.orderId) qs.set("orderId", params.orderId ?? "");
      if (params?.startDate) qs.set("startDate", params.startDate);
      if (params?.endDate) qs.set("endDate", params.endDate);

      // remove empty values (in case some empty strings added)
      for (const [k, v] of Array.from(qs.entries())) {
        if (!v) qs.delete(k);
      }

      const url = `/transaction/user${qs.toString() ? `?${qs.toString()}` : ""}`;
      const response = await axiosInstance.get<
        ApiResponse<PaginatedTransactions>
      >(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.data ?? null;
    },
  });
}
