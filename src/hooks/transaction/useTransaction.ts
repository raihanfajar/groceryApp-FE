import { baseError } from "@/components/userAuth/typesAndInterfaces";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { ApiResponse } from "@/types/apiResponse";
import { Transaction } from "@/types/transaction/transactionTypes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { error } from "console";
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
export function useCancelTransaction(transactionId: string) {
  const { accessToken } = useUserAuthStore();
  return useQuery({
    queryKey: ["cancelTransaction", transactionId],
    queryFn: async () => {
      if (!transactionId) return null;
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
    enabled: !!transactionId,
  });
}

// Upload Proof of Payment
// Tip: sesuaikan tipe UploadProofResponse/UploadProofVariables/baseError sesuai definisi Anda
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
