import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateStoreAdmin = (accessToken: string | null | undefined) => useMutation({
    mutationFn: async ({
        adminId,
        data,
    }: {
        adminId: string;
        data: { name: string; email: string; storeId: string };
    }) => {
        const response = await axiosInstance.put(
            `/admin/store-admins/${adminId}`,
            data,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            },
        );
        return response.data;
    },
    onSuccess: () => {
        toast.success("Store admin updated successfully");
    },
    onError: (error: unknown) => {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to update store admin";
        toast.error(errorMessage);
    },
});