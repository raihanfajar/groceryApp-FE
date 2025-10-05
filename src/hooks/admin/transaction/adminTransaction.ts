import { baseError } from "@/components/userAuth/typesAndInterfaces";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { ApiResponse } from "@/types/apiResponse";
import {
  getAllStoreTypes,
  PaginatedTransactionsFinal,
  QueryParams,
} from "@/types/transaction/FinalTypes";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { Transaction } from "@tiptap/pm/state";
import { toast } from "react-toastify";

// 1. Definisikan satu query key utama untuk semua data transaksi
export const TRANSACTIONS_QUERY_KEY = ["transactions"];

// ------------------ GET: Store (Admin) Transactions ------------------
export function useStoreTransactionsQuery(params?: QueryParams) {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;
  const queryKey = [...TRANSACTIONS_QUERY_KEY, "list", params];

  return useQuery<PaginatedTransactionsFinal | null>({
    queryKey,
    queryFn: async () => {
      if (!token) return null;

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
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data ?? null;
    },
    enabled: !!token,
  });
}

// ------------------ GET: User Transaction Detail (Admin) ------------------
export function useUserTransactionDetailAdminQuery(
  transactionId?: string | null,
) {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;
  const queryKey = [...TRANSACTIONS_QUERY_KEY, "detail", transactionId];

  return useQuery<Transaction | null>({
    queryKey,
    queryFn: async () => {
      if (!token || !transactionId) return null;

      const url = `/transaction/admin-detail?transactionId=${encodeURIComponent(transactionId)}`;
      const response = await axiosInstance.get<
        ApiResponse<{ transaction: Transaction }>
      >(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data?.transaction ?? null;
    },
    enabled: !!(token && transactionId),
  });
}

// ------------------ PUT: Confirming Order (Admin) ------------------
export function useAdminConfirmOrderMutation() {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      if (!transactionId) throw new Error("Transaction ID is missing");
      if (!token) throw new Error("Access token is missing");

      const url = `/transaction/admin/confirm?transaction=${encodeURIComponent(transactionId)}`;
      const response = await axiosInstance.put<
        ApiResponse<{ transaction: Transaction }>
      >(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Order confirmed");
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
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
export function useAdminCancelOrderPaymentMutation() {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      if (!transactionId) throw new Error("Transaction ID is missing");
      if (!token) throw new Error("Access token is missing");

      const url = `/transaction/admin/cancel-payment?transaction=${encodeURIComponent(transactionId)}`;
      const response = await axiosInstance.put<
        ApiResponse<{ transaction: Transaction }>
      >(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Payment canceled");
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
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
export function useAdminShipTransactionMutation() {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      if (!transactionId) throw new Error("Transaction ID is missing");
      if (!token) throw new Error("Access token is missing");

      const url = `/transaction/admin/shipping?transaction=${encodeURIComponent(transactionId)}`;
      const response = await axiosInstance.put<
        ApiResponse<{ transaction: Transaction }>
      >(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Transaction marked as shipped");
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
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
export function useAdminCancelStoreTransactionMutation() {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      if (!transactionId) throw new Error("Transaction ID is missing");
      if (!token) throw new Error("Access token is missing");

      const url = `/transaction/admin/cancel?transaction=${encodeURIComponent(transactionId)}`;
      const response = await axiosInstance.put<
        ApiResponse<{ transaction: Transaction }>
      >(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Store transaction canceled");
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
    onError: (err: unknown) => {
      const customError = err as baseError;
      const errorMessage =
        customError?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
  });
}

// ------------------ Get: All Store List (Admin) ------------------
type QueryFnData = ApiResponse<{ storeList: getAllStoreTypes[] }> | null;
type SelectedData = getAllStoreTypes[];

type StoreListQueryOptions = Omit<
  UseQueryOptions<QueryFnData, Error, SelectedData>,
  "queryKey" | "queryFn"
>;

export function useStoreListQuery(options?: StoreListQueryOptions) {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;
  const queryKey = [...TRANSACTIONS_QUERY_KEY, "store"];

  const { enabled, ...restOptions } = options || {};

  return useQuery<QueryFnData, Error, SelectedData>({
    queryKey,
    queryFn: async () => {
      if (!token) return null;

      const response = await axiosInstance.get<
        ApiResponse<{ storeList: getAllStoreTypes[] }>
      >(`/transaction/store`, { headers: { Authorization: `Bearer ${token}` } });
      return response.data;
    },
    enabled: !!token && (enabled ?? true),

    select: (data) => {
      return data?.data?.storeList ?? [];
    },

    ...restOptions,
  });
}
